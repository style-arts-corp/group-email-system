import os
from dotenv import load_dotenv
load_dotenv()

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication

def send_email(account, account_password, sender_email, receiver_email, cc_list, subject, body, file=None):
    # メッセージの作成
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = receiver_email
    message["Subject"] = subject
    if cc_list:
        message["Cc"] = ", ".join(cc_list)

    # 本文の追加
    message.attach(MIMEText(body, "plain"))

    # 添付ファイル
    if file:
        file_data = file.read()
        file_name = file.filename
        part = MIMEApplication(file_data)
        part.add_header(
            "Content-Disposition",
            "attachment",
            filename=file_name
        )
        message.attach(part)
        file.seek(0)

    # SMTPサーバーへの接続とメール送信
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(account, account_password)
        server.send_message(message)
        print("メールが正常に送信されました。")

if __name__ == "__main__":
    # 使用例
    sender_email = os.getenv("SENDER_EMAIL")
    sender_password = os.getenv("SENDER_PASSWORD")
    receiver_email = os.getenv("RECEIVER_EMAIL")
    subject = "Gmail　自動送信　テスト"
    body = """
    昨日話してた打ち合わせ明日やりましょう！
    時間的に何時が良いでしょうか？
    """

    send_email(sender_email, sender_password, receiver_email, subject, body)