import os

import gspread
from oauth2client.service_account import ServiceAccountCredentials

from constants.path import PATHS

# 認証情報の設定
security_key_path = os.path.join(PATHS["security"], "for_drive-gspread.json")
scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
CREDS = ServiceAccountCredentials.from_json_keyfile_name(security_key_path, scope)

# データについて
DATA_POS = {
    "email": 4,
    "company": 7,
    "name": 8,
    "role": 9,
}

class SpreadSheet:
    def __init__(self):
        # クライアントの作成
        self.client = gspread.authorize(CREDS)

    #################### ▼ set ▼ ####################
    def set_spread_sheet_by_key(self, key:str):
        try:
            self._spread_sheet = self.client.open_by_key(key)
            self._worksheet = self._spread_sheet.sheet1
        except PermissionError:
            print("スプレッドシートのアクセス権限がありません。")
    #################### ▲ set ▲ ####################

    #################### ▼ get ▼ ####################
    def get_data(self):
        data = []
        for i, row in enumerate(self._worksheet.get_all_values()):
            if i == 0:
                continue
            buf = {
                "email": row[DATA_POS["email"]],
                "company": row[DATA_POS["company"]],
                "name": row[DATA_POS["name"]],
                "role": row[DATA_POS["role"]],
            }
            data.append(buf)
        return data
    #################### ▲ get ▲ ####################

if __name__ == "__main__":
    ss = SpreadSheet()
    ss.set_spread_sheet_by_key("12M7zf-1vIjcyfynQWAZMuBwCLIuwEKl31oYXAZPFpls")
    all_data = ss.get_data()
    print(all_data)