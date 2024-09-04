# 環境変数の取得
from dotenv import load_dotenv
load_dotenv()

import os

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
    print("id: ", id)
    spread_sheet = SpreadSheet(id=id)
    data = spread_sheet.get_data()
    return jsonify(data), 200

@app.route('/process_send_email', methods=['POST'])
def process_send_email():
    if request.method != "POST":
        return "method not allowed", 405
    data = request.get_json()
    if not data or 'target_list' not in data:
        return "Missing email in JSON body", 400
    target_list = data['target_list']
    content = data['content']
    for target in target_list:
        send_text = content.replace("{company}", target["company"]).replace("{name}", target["name"]).replace("{role}", target["role"])
        subject = "「WorkSmart」について"
        send_email(os.getenv("SENDER_EMAIL"), os.getenv("SENDER_PASSWORD"), target["email"], subject, send_text)
    return "complete", 200

@https_fn.on_request()
def api(req: https_fn.Request) -> https_fn.Response:
    with app.request_context(req.environ):
        return app.full_dispatch_request()

if __name__ == '__main__':
    app.run(debug=True)