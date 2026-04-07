import os
from pathlib import Path
import argparse
from importlib.metadata import version, PackageNotFoundError
import shutil
import stat
import subprocess
import sys
import tempfile
from typing import Any, Callable


def git(*args: Any):
    try:
        result = subprocess.run(
            [
                "git",
                *args,
            ],
            cwd=temp_dir,
            capture_output=True,
            text=True,
        )
        return result
    except subprocess.CalledProcessError as e:
        print("An error had ocurred creating path.\n", e)
        sys.exit(1)


parser = argparse.ArgumentParser()
parser.add_argument("package_name")
parser.add_argument("--apply", action="store_const", const=True, default=False)
parser.add_argument("--install-name", type=str, default="")


args = parser.parse_args()
libs_path = ".venv/Lib/site-packages/"
package_path = Path(libs_path, args.package_name)
temp_dir = tempfile.mkdtemp()
patchs_path = Path.absolute(Path("./patches/"))
if not patchs_path.exists():
    patchs_path.mkdir()
temp_dir = Path(temp_dir)


if not package_path.exists():
    raise FileExistsError(
        f"Package with name {args.package_name} does not exists, Make sure that's the correct name"
    )

package_version = None
real_package_name: str = (
    args.install_name if "install_name" in args else args.package_name
)


try:
    package_version = version(real_package_name)
except PackageNotFoundError:
    raise PackageNotFoundError(
        "\nTry adding the package name as you imported it, and add --install-name as you install it."
    )


if args.apply:
    patch_name = f"{args.package_name}+{package_version}.patch"
    package_patch_path = Path(patchs_path, patch_name)

    try:
        result = subprocess.run(
            [
                "git",
                "apply",
                f"--directory={libs_path}",
                "-p1",
                "--ignore-whitespace",
                "--ignore-space-change",
                "--whitespace=fix",
                package_patch_path,
            ],
            capture_output=True,
            text=True,
        )
        print()
    except Exception as e:
        print(e)
        sys.exit(1)

    if not result or result.returncode != 0:
        print("Error applying patch")
        print(result.stderr)
        sys.exit(1)
    else:
        print("Patch applied correctly")
        sys.exit(0)
    sys.exit(0)


try:
    subprocess.run(
        [
            "uv",
            "pip",
            "install",
            f"{real_package_name}=={package_version}",
            "--target",
            temp_dir,
            "--no-deps",
        ],
        capture_output=True,
        check=True,
    )

    temp_package_dir = Path(temp_dir, args.package_name)

    for item in temp_dir.iterdir():
        if item == temp_package_dir:
            continue

        if item.is_file() or item.is_symlink():
            item.unlink()
            continue

        if item.is_dir():
            shutil.rmtree(item)
            continue

    result = git("config", "core.autocrlf", "false")
    result = git("init")
    result = git("add", "-f", temp_dir)
    result = git("commit", "--allow-empty", "-m", "init")

    shutil.rmtree(temp_package_dir)

    shutil.copytree(package_path, Path(temp_dir, args.package_name), dirs_exist_ok=True)
except subprocess.CalledProcessError as e:
    print(e)
    sys.exit(1)

result = git(
    "diff",
    "--reverse",
    "--exit-code",
    "--src-prefix=a/",
    "--dst-prefix=b/",
)


code = result.returncode


# if code != 0:
#     raise ValueError("There is no changes to patch")

# if result.stdout.strip() == "":
#     raise ValueError("There is no changes to patch")


with open(
    f"{patchs_path}/{args.package_name}+{package_version}.patch", "w", encoding="utf-8"
) as f:
    f.write(result.stdout)


def handle_remove_readonly(
    func: Callable[..., Any],  # type: ignore
    path: str,
    exc: BaseException,
):
    os.chmod(path, stat.S_IWRITE)
    if func is not None:
        func(path)


print("Patch generated")
shutil.rmtree(temp_dir, onexc=handle_remove_readonly)
