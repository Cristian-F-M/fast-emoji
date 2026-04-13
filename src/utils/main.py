from typing import Any
from src.constants.main import HOST, PORT
from src.data import vk_from_string, string_from_vk
import win32api
import socket


def is_some_key_in(
    obj: dict[Any, Any] | set[Any],
    from_str: bool = True,
    *keys: str | int,
):
    if from_str:
        return any(vk_from_string[k] in obj for k in keys if type(k) is str)

    return any(string_from_vk[k] in obj for k in keys if type(k) is int)


def get_string_from_vk_code(vk_code: int):
    if vk_code not in string_from_vk:
        return None
    return string_from_vk[vk_code]


def vk_is(vk_code: int, string: str):
    return string_from_vk[vk_code] == string


def is_key_pressed(code: int | str):
    vk_code: int | None = None
    if type(code) is str and code in vk_from_string:
        vk_code = vk_from_string[code]
    elif type(code) is int:
        vk_code = code

    if vk_code is None:
        return False

    return win32api.GetKeyState(vk_code) < 0


def check_if_running():
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        s.connect((HOST, PORT))
        s.close()
        return True
    except Exception:
        return False
