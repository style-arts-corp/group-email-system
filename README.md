# 概要
本システムは、Matching HUB NAGAOKAで出展者及び関係者に対して、メールを送信するためのサービスである。
従来ではBCC送信などを行ってきたが、先方の意向により一人一人に対して宛名を設定してメールを送信したいとの要望があり開発に至っている。
（2024-08-10 山口）

# 構成
## hosting
フロントエンド上では、メッセージの入力とスプレットシートの参照元（リンク）を閲覧できる
### .envファイル構成
以下の要素で構成されるenvファイルを`./hosting`配下に設置する。
```.env
# API
REACT_APP_API_BASE_URL

# firebase
REACT_APP_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID
REACT_APP_MEASUREMENT_ID
```
それぞれの値は、以下のURLより取得して設定する。
- [API](https://console.firebase.google.com/project/group-email-system/functions?hl=ja)
- [firebase](https://console.firebase.google.com/project/group-email-system/settings/general/web:YWQzYzc0YWEtMDE1ZC00NjZlLWE3NjQtMDIxYTE3MTdiZDU3?hl=ja&nonce=1727025041507)

## functions
バックエンドでは、FEから送られてきたメッセージに対して、登録済みのスプレッドシート内にあるメールアドレスに対して、メッセージを送信する。

# 開発にあたり
速度重視であるため、 `create-react-app`で作成するが、近年の風潮により、良しとされていないため、後ほど変更を加える。
