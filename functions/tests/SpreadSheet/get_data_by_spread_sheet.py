import gspread
from oauth2client.service_account import ServiceAccountCredentials

# 認証情報の設定
scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
creds = ServiceAccountCredentials.from_json_keyfile_name('../../src/data/security/for_drive-gspread.json', scope)

# クライアントの作成
client = gspread.authorize(creds)

# スプレッドシートの取得
spreadsheet = client.open_by_key('1zAb9gY_rEiCtAkDwUZKHF6ohQe28BISCjqh2kVhk9gA')

# ワークシートの取得
worksheet = spreadsheet.sheet1

# 全データの取得
data = worksheet.get_all_records()
print(data)

# 特定のセルの値を取得
cell_value = worksheet.acell('A1').value
print(f"A1セルの値: {cell_value}")

# 特定の範囲の値を取得
range_values = worksheet.get('A1:B2')
print(f"A1:B2の値: {range_values}")
