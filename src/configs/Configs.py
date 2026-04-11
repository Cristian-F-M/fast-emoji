import configparser
from typing import Any
from src.constants.configs import CONFIGS_DIR_PATH, CONFIGS_PATH, DEFAULT_CONFIGS


class Configs:
    def __init__(self):
        self.configs = configparser.ConfigParser()
        self.init_configs_folder()
        self.init_configs_file()

    def init_configs_file(self):
        if CONFIGS_PATH.exists():
            c = CONFIGS_PATH.read_text("utf-8")
            if c.strip() == "":
                self.configs.read_dict(DEFAULT_CONFIGS)
                self.save_configs()
            else:
                self.configs.read(CONFIGS_PATH)

            return

        CONFIGS_PATH.touch()
        sections = self.configs.sections()
        if len(sections) >= 1:
            return
        self.configs.read_dict(DEFAULT_CONFIGS)
        self.save_configs()

    def init_configs_folder(self):
        if not CONFIGS_DIR_PATH.exists():
            CONFIGS_DIR_PATH.mkdir()

    def get_configs(self):
        return self.configs

    def get_configs_dict(self):
        _configs = self.configs
        sections = _configs.sections()
        configs: dict[str, Any] = {}

        for section in sections:
            configs[section] = {}
            for key, value in _configs.items(section):
                if value.lower() in [
                    "true",
                    "false",
                    "yes",
                    "no",
                    "on",
                    "off",
                    "1",
                    "0",
                ]:
                    configs[section][key] = _configs.getboolean(section, key)
                else:
                    configs[section][key] = value
        return configs

    def set_configs(self, section: str, option: str, value: Any):
        self.configs.set(section, option, value)
        self.save_configs()

    def save_configs(self):
        with open(CONFIGS_PATH, "w") as config_file:
            self.configs.write(config_file)
