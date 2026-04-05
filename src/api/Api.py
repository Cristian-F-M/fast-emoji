from __future__ import annotations
from typing import TYPE_CHECKING, Any
import emoji
from pynput import keyboard

controller = keyboard.Controller()

if TYPE_CHECKING:
    from wv import FastEmoji


class API:
    def __init__(self, fast_emoji: FastEmoji):
        self._fast_emoji = fast_emoji

    def log(self, *args: Any):
        print(*args)

    def get_emojis(self, offset: int, limit: int):
        entries = list(emoji.EMOJI_DATA.items())
        return entries[offset : offset + limit]

    def print_emoji(self, emoji: str):
        self._fast_emoji.hide_window()
        self._fast_emoji.search_query = ""
        self._fast_emoji.raw_search_query = ""
        controller.type("\b" * len(self._fast_emoji.raw_search_query))
        controller.type(emoji)

    def handle_input(self, value: str):
        self._fast_emoji.search_query = value
        self._fast_emoji.raw_search_query = f":{value}"
