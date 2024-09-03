# 環境変数の取得
from dotenv import load_dotenv
load_dotenv()

import os

from firebase_admin import initialize_app, db
from firebase_functions import https_fn

import flask
from flask import request, jsonify
from flask_cors import CORS

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

@https_fn.on_request()
def api(req: https_fn.Request) -> https_fn.Response:
    with app.request_context(req.environ):
        return app.full_dispatch_request()

if __name__ == '__main__':
    app.run(debug=True)