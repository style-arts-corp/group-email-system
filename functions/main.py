# 環境変数の取得
from dotenv import load_dotenv
load_dotenv()

import os

from firebase_admin import initialize_app, db
from firebase_functions import https_fn

import flask
from flask import jsonify
from flask_cors import CORS

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
    pass

@https_fn.on_request()
def api(req: https_fn.Request) -> https_fn.Response:
    with app.request_context(req.environ):
        return app.full_dispatch_request()

if __name__ == '__main__':
    app.run(debug=True)