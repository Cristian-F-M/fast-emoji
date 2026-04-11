from __future__ import annotations
from typing import TYPE_CHECKING, Any
from pynput import keyboard


controller = keyboard.Controller()

if TYPE_CHECKING:
    from src.configs.Configs import Configs
    from windows.Main import MainView
    from windows.EmojiPicker import EmojiPicker


class API:
    def __init__(
        self, main_view: MainView, configs: Configs, emoji_picker: EmojiPicker
    ):
        self._main_view = main_view
        self._configs = configs
        self._emoji_picker = emoji_picker

    def log(self, *args: Any):
        print(*args)

    def get_configs(self):
        configs: dict[str, Any] = {}
        _configs = self._configs.get_configs_dict()

        for section in _configs:
            for item in _configs[section]:
                value = _configs[section][item]

                configs[item] = value

        return configs

    def change_config(self, section: str, option: str, value: Any):
        self._configs.set_configs(section, option, str(value))
        self._emoji_picker.api.update_configs()

    def open_picker(self):
        self._emoji_picker.show_no_focus()
