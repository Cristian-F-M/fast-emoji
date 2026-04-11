import argparse
import sys
from typing import Callable, Literal
import pyinstaller_versionfile
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

sys.path.append(str(SRC))
from utils.pack import get_node_package_manager, get_package_json  # noqa: E402


version_file_path = Path(".\\src\\assets\\version_file.txt")

if not version_file_path.exists():
    version_file_path.touch()

package_json = get_package_json()


# Build view
def build_view():

    try:
        node_package_manager = get_node_package_manager()
        result = subprocess.run([node_package_manager, "run", "build"])
        print("Salida:\n", result.stdout)
        print("Errores:\n", result.stderr)
    except subprocess.CalledProcessError as e:
        print("Error building app view", e)
        sys.exit(1)


# build exe
def build_exe():
    cmd = [
        "uv",
        "run",
        "pyinstaller",
        "main.py",
        "--onefile",
        "--name",
        "Fast Emoji",
        "--add-data",
        ".\\view\\dist\\:.",
        "--windowed",
        "--icon",
        ".\\src\\assets\\fast-emoji.ico",
        "--version-file",
        version_file_path.as_posix(),
        "--clean",
        "--paths",
        ".\\.venv\\Lib\\site-packages\\",
    ]

    # Build apk
    try:
        result = subprocess.run(cmd, check=True, capture_output=False, text=False)
        print("Salida:\n", result.stdout)
        print("Errores:\n", result.stderr)
    except subprocess.CalledProcessError as e:
        print("Error al ejecutar el comando:")
        print(e.stderr)


# generate version file
def generate_version_file():
    version: str | Literal["1.0.0"] = (
        package_json["version"] if package_json else "1.0.0"
    )
    pyinstaller_versionfile.create_versionfile(
        output_file=version_file_path.as_posix(),
        version=version,
        company_name="cmorales",
        file_description="Fast emoji",
        internal_name="Fast Emoji",
        legal_copyright="© cmorales. All rights reserved.",
        original_filename="Fast Emoji.exe",
        product_name="Fast Emoji",
    )


def main():
    actions: list[Callable[[], None]] = []
    parser = argparse.ArgumentParser()
    parser.add_argument("--only-view", action="store_const", const=True, default=False)
    parser.add_argument("--only-exe", action="store_const", const=True, default=False)
    parser.add_argument(
        "--only-version-file", action="store_const", const=True, default=False
    )

    args = parser.parse_args()

    if args.only_version_file:
        actions = [generate_version_file]
    elif args.only_view:
        actions = [build_view]
    elif args.only_exe:
        actions = [build_exe]

    else:
        actions = [generate_version_file, build_view, build_exe]

    for action in actions:
        action()


if __name__ == "__main__":
    try:
        main()
    except subprocess.CalledProcessError as e:
        print(e)
    except Exception as e:
        print(e)
