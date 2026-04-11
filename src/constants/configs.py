from pathlib import Path
import os
from typing import Any
import darkdetect  # type: ignore

is_dark: bool = darkdetect.isDark() or False

APP_DATA_PATH = os.getenv("LOCALAPPDATA") or "./"
CONFIGS_DIR_PATH = Path(APP_DATA_PATH, "Fast Emoji")
CONFIGS_PATH = Path(CONFIGS_DIR_PATH, "config.init")


DEFAULT_CONFIGS: dict[str, Any] = {
    "app": {
        "theme": "dark" if is_dark else "light",
        "launch_at_startup": True,
        "run_in_background": True,
    }
}
