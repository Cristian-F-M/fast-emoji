from screeninfo import get_monitors
import webview
import threading
import sys
from pynput import keyboard
from webview import Window
import win32gui
import win32.lib.win32con as win32con
from typing import Any
from src.api.Api import API
from src.data import string_from_vk
from src.utils.main import is_key_pressed, is_some_key_in, vk_is


Key = keyboard.Key
KeyCode = keyboard.KeyCode
kb_controller = keyboard.Controller()


# TODO -> Add paste support


class FastEmoji:
    def __init__(self):

        [monitor] = get_monitors()

        self.screen_w = monitor.width
        self.screen_h = monitor.height
        self.focused_emoji: None | str = None
        self.is_showed: bool = False
        self.search_query: str = ""
        self.listener: keyboard.Listener
        self.raw_search_query: str = ""
        self.api: API = API(self)
        self.keys_pressed: set[int] = set()
        self.must_record = False

        self.title = "Fast Emoji"
        self.width = 360
        self.height = 400
        self.x = self.screen_w - self.width - 10
        self.y = self.screen_h - self.height - 20
        self.window: Window | None
        self.url = "http://localhost:5173" if not IS_PACKAGED else "./index.html"

        threading.Thread(target=self.init_keyboard_hotkeys, daemon=True).start()
        self.listener = keyboard.Listener(
            on_press=self.on_press,
            on_release=self.on_release,
            win32_event_filter=self.win32_event_filter,
        )
        self.listener.start()
        self.init_window()
        self.start_webview()

    def quit_program(self):
        self.listener.stop()
        if self.window:
            self.hide_window()
            self.window.destroy()

    def hide_window(self):
        if not self.window:
            return
        self.window.hide()
        self.is_showed = False
        self.search_query = ""
        self.raw_search_query = ""
        self.must_record = False
        self.window.evaluate_js("window.change_focused_emoji(0)")
        self.window.evaluate_js("window.on_hide()")
        self.update_ui()

    def show_window(self):
        if not self.window:
            return
        self.window.show()
        self.is_showed = True
        self.search_query = ""
        self.update_ui()

    def show_no_focus(self):
        if self.window is None:
            return
        self.is_showed = True
        self.search_query = ""
        self.update_ui()
        hwnd = self.get_hwnd()
        win32gui.ShowWindow(hwnd, win32con.SW_SHOWNOACTIVATE)

    def get_hwnd(self):
        hwnd = win32gui.FindWindow(None, self.title)
        return hwnd

    def on_press(self, key: (keyboard.Key | keyboard.KeyCode | None)):
        if key is None:
            return

        if isinstance(key, keyboard.Key):
            if not self.is_showed:
                return

            if key == Key.space:
                self.hide_window()

    def on_release(self, key: (keyboard.Key | keyboard.KeyCode | None)):
        pass

    def init_keyboard_hotkeys(self):
        pass

    def init_window(self):
        window = webview.create_window(  # type: ignore
            self.title,
            self.url,
            width=self.width,
            height=self.height,
            x=self.x,
            y=self.y,
            frameless=True,
            background_color="#000001",
            js_api=self.api,
            on_top=True,
            draggable=False,
            resizable=False,
            hidden=True,
            focus=False,
            easy_drag=False,
            zoomable=False,
        )

        if not window:
            sys.exit(1)
        self.window = window

    def start_webview(self):
        webview.start(self.on_window_start)

    def update_ui(self):
        if not self.window:
            return
        self.window.evaluate_js(f"window.setQuery('{self.search_query}')")

    def is_window_active(self):
        return win32gui.GetForegroundWindow() == self.get_hwnd()

    def win32_event_filter(self, msg: int, data: Any):
        vk_code: int = data.vkCode
        is_key_down = msg == 256
        is_key_up = msg == 257
        is_char = vk_code >= 65 and vk_code <= 90

        if is_key_down:
            self.keys_pressed.add(vk_code)
        if is_key_up and vk_code in self.keys_pressed:
            self.keys_pressed.remove(vk_code)

        # ctrl + shift + q
        if (
            is_some_key_in(self.keys_pressed, True, "Q")
            and is_key_pressed("VK_CONTROL")
            and is_key_pressed("VK_SHIFT")
        ):
            self.quit_program()
            self.listener.suppress_event()  # type: ignore

        # ctrl + shift + r
        if (
            is_some_key_in(self.keys_pressed, True, "R")
            and is_key_pressed("VK_CONTROL")
            and is_key_pressed("VK_SHIFT")
        ):
            if self.is_showed:
                self.reload_view()
                self.listener.suppress_event()  # type: ignore

        # shift + . -> :
        if is_key_pressed("VK_SHIFT") and is_some_key_in(
            self.keys_pressed, True, "VK_OEM_PERIOD"
        ):
            self.must_record = True
            self.raw_search_query = ":"
            self.show_no_focus()

        if self.window is None or not self.is_showed:
            return

        name = string_from_vk[vk_code] if vk_code in string_from_vk else ""

        # arrows (→ ← ↑ ↓)
        if name in ["VK_RIGHT", "VK_LEFT", "VK_UP", "VK_DOWN"] and is_key_down:
            direction = name.replace("VK_", "")
            self.window.evaluate_js(f"window.move_focused_emoji('{direction}')")
            self.listener.suppress_event()  # type: ignore

        # enter
        if vk_is(vk_code, "VK_RETURN") and is_key_down:
            self.print_emoji()
            self.listener.suppress_event()  # type: ignore

        # esc or tab
        if vk_is(vk_code, "VK_ESCAPE") or vk_is(vk_code, "VK_TAB"):
            self.hide_window()
            self.listener.suppress_event()  # type: ignore

        # space
        if vk_is(vk_code, "VK_SPACE"):
            self.hide_window()

        # shift + backspace
        if is_key_pressed("VK_CONTROL") and vk_is(vk_code, "VK_BACK") and is_key_up:
            self.search_query = ""
            self.update_ui()

            if self.raw_search_query == ":":
                self.raw_search_query = ""
                self.hide_window()
            else:
                self.raw_search_query = ":"

        # not ctrl - backspace
        if (
            not is_key_pressed("VK_CONTROL")
            and vk_is(vk_code, "VK_BACK")
            and is_key_down
        ):
            self.search_query = self.search_query[:-1]
            self.raw_search_query = self.raw_search_query[:-1]
            self.update_ui()

            if len(self.raw_search_query) == 0:
                self.hide_window()

        # any char [A-Z]
        if is_char and is_key_down and self.must_record:
            char = chr(data.vkCode).lower()
            self.raw_search_query += char
            self.search_query += char
            self.update_ui()

    def reload_view(self):
        if self.window is None:
            return
        print("Reloading view")
        self.window.evaluate_js("window.location.reload()")

    def print_emoji(self):
        query_lenght = len(self.raw_search_query)
        focused_emoji = self.focused_emoji
        self.hide_window()
        self.search_query = ""
        self.raw_search_query = ""

        if focused_emoji is not None:
            for _ in range(query_lenght):
                kb_controller.tap(Key.backspace)
            kb_controller.type(focused_emoji)

    def on_window_start(self):
        pass


if __name__ == "__main__":
    FastEmoji()
