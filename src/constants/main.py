import sys
from src.data import vk_from_string

KEYS_TO_SUPPRES = {
    vk_from_string[k]
    for k in ("VK_RETURN", "VK_LEFT", "VK_UP", "VK_RIGHT", "VK_DOWN", "VK_ESCAPE")
}


CTRL_KEYS = {"VK_LCONTROL", "VK_RCONTROL", "VK_CONTROL"}
SHIFT_KEYS = {"VK_LSHIFT", "VK_RSHIFT", "VK_SHIFT"}

IS_PACKAGED = getattr(sys, "frozen", False)
