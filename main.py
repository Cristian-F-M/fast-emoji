import webview
from pynput import keyboard
from src.configs.Configs import Configs
from src.windows.Main import MainView
from src.windows.EmojiPicker import EmojiPicker


Key = keyboard.Key
KeyCode = keyboard.KeyCode
kb_controller = keyboard.Controller()


class FastEmoji:
    def __init__(self):
        self.configs = Configs()
        self.emoji_picker = EmojiPicker(self.configs)
        self.main_view = MainView(self.emoji_picker, self.configs)

        self.init_webview()

    def init_webview(self):
        webview.start()


if __name__ == "__main__":
    FastEmoji()
