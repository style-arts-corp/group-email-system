# 環境変数の取得
from dotenv import load_dotenv
load_dotenv()

import os
import json

from firebase_admin import initialize_app, db
from firebase_functions import https_fn

import flask
from flask import request, jsonify
from flask_cors import CORS

from src.email.send_email import send_email
from src.SpreadSheet.spreadsheet import SpreadSheet

initialize_app()
app = flask.Flask(__name__)
app.config['JSON_AS_ASCII'] = False
CORS(app)


# for health check
@app.route('/health', methods=['GET'])
def get_health():
    return "api is healthy", 200

@app.route('/get_gspread_list', methods=['GET'])
def get_gspread_list():
    res = [
        {
            "title": "test",
            "id": os.getenv("TARGET_GSPREADID"),
        }
    ]
    return jsonify(res), 200

@app.route('/get_gspread_data_by_id', methods=['POST'])
def get_gspread_data_by_id():
    if request.method != "POST":
        return "method not allowed", 405
    data = request.get_json()
    if not data or 'spread_sheet_id' not in data:
        return "Missing spread_sheet_id in JSON body", 400
    id = data['spread_sheet_id']
    print(f"gspread id: {id}")
    spread_sheet = SpreadSheet(id=id)
    data = spread_sheet.get_data()
    return jsonify(data), 200

@app.route('/process_send_email', methods=['POST'])
def process_send_email():
    if request.method != "POST":
        return "method not allowed", 405
    # email data
    _buf = request.form.get('emailData')
    print(f"emailData _buf : {_buf}")
    data = json.loads(_buf)
    if not data or 'target_list' not in data:
        return "Missing email in JSON body", 400
    target_list = data['target_list']
    print(f"target_list: {target_list}")
    cc_list = data["cc_list"]
    print(f"cc_list: {cc_list}")
    subject = data["subject"]
    print(f"subject: {subject}")
    content = data['content']
    print(f"content: {content}")
    # file
    file_num = 0
    files = []
    while True:
        file_name = f"attachmentFile{file_num}"
        _buf = request.files.get(file_name)
        if _buf is None:
            break
        files.append(_buf)
        file_num += 1
    # send email
    for target in target_list:
        send_text = content.replace("{company}", target["company"]).replace("{name}", target["name"]).replace("{role}", target["role"])
        send_email(
            account=os.getenv("ACCOUNT"),
            account_password=os.getenv("ACCOUNT_PASSWORD"),
            sender_email=os.getenv("SENDER_EMAIL"),
            receiver_email=target["email"],
            cc_list=cc_list,
            subject=subject,
            body=send_text,
            files=files
        )
    return "complete", 200

@https_fn.on_request()
def api(req: https_fn.Request) -> https_fn.Response:
    with app.request_context(req.environ):
        return app.full_dispatch_request()

if __name__ == '__main__':
    app.run(debug=True)