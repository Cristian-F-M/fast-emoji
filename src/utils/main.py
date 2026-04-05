from typing import Any
from src.data import vk_from_string, string_from_vk


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
