from pathlib import Path
import os
import json
from typing import Any

view_path = Path("./view/")


def get_node_package_manager():
    if os.path.exists(os.path.join(view_path, "pnpm-lock.yaml")):
        return "pnpm"
    elif os.path.exists(os.path.join(view_path, "yarn.lock")):
        return "yarn"
    elif os.path.exists(os.path.join(view_path, "bun.lockb")):
        return "bun"
    elif os.path.exists(os.path.join(view_path, "package-lock.json")):
        return "npm"
    else:
        return "npm"


def get_package_json():
    package_json_path = Path(view_path, "package.json")

    if not package_json_path.exists():
        return None
    with open(package_json_path, "r", encoding="utf-8") as f:
        data: dict[str, Any] = json.load(f)
        return data
