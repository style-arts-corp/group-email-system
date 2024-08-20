import sys
import os
from pathlib import Path

if getattr(sys, 'frozen', False):
    # 実行ファイル実行時の処理
    _ROOT = sys._MEIPASS
else:
    # スクリプト実行時の処理
    _ROOT = str(Path(__file__).resolve().parent.parent.parent)

_SRC = os.path.join(_ROOT, "src")
_DATA = os.path.join(_SRC, "data")

PATHS = {
    "root": _ROOT,
    "src": _SRC,
    "data": _DATA,
    "security": os.path.join(_DATA, "security"),
}