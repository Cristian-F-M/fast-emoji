from __future__ import annotations
from typing import TYPE_CHECKING, Any
import emoji
from pynput import keyboard

controller = keyboard.Controller()

if TYPE_CHECKING:
    from main import FastEmoji


class API:
    def __init__(self, fast_emoji: FastEmoji):
        self._fast_emoji = fast_emoji

    def log(self, *args: Any):
        print(*args)

    def get_emojis(self, offset: int, limit: int, query: str):
        entries = list(emoji.EMOJI_DATA.items())
        end = offset + limit
        if end > len(entries):
            end = len(entries)
        if not query:
            return entries[offset:end]
        filtered = [
            e
            for e in entries
            if "alias" in e[1] and (query in e[1]["alias"] or query in e[1]["en"])
        ]
        return filtered

    def print_emoji(self, emoji: str):
        if not emoji:
            self._fast_emoji.focused_emoji = None
            return
        self._fast_emoji.focused_emoji = emoji
        self._fast_emoji.print_emoji()

    def handle_input(self, value: str):
        self._fast_emoji.search_query = value
        self._fast_emoji.raw_search_query = f":{value}"

    def set_focused_emoji(self, emoji: str):
        if not emoji:
            self._fast_emoji.focused_emoji = None
            return
        self._fast_emoji.focused_emoji = emoji
