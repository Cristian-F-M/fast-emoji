import sys
from screeninfo import get_monitors
from webview import Window
import webview
from src.api.Main import API
from src.configs.Configs import Configs
from src.windows.EmojiPicker import EmojiPicker


class MainView:
    def __init__(self, emoji_picker: EmojiPicker, configs: Configs) -> None:
        [monitor] = get_monitors()

        self.screen_w = monitor.width
        self.screen_h = monitor.height

        self.emoji_picker = emoji_picker

        self.window: Window | None
        self.title = "Fast Emoji"
        self.url = "http://localhost:5173/"
        self.configs = configs
        self.api = API(self, self.configs, self.emoji_picker)
        self.min_w = self.screen_w - 100
        self.min_h = self.screen_h - 100

        self.create_window()
        # self.start_window()

    def create_window(self):
        window = webview.create_window(  # type: ignore
            self.title,
            self.url,
            background_color="#000000",
            js_api=self.api,
            hidden=False,
            min_size=(self.min_w, self.min_h),
        )

        if not window:
            sys.exit(1)
        self.window = window

    def start_window(self):
        webview.start()
