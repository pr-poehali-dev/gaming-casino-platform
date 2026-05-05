"""
Аутентификация: регистрация, вход, выход, получение профиля.
Параметр action в теле: register | login | logout | me
"""
import json
import os
import secrets
import hashlib
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Token",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def ok(data, status=200):
    return {"statusCode": status, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps(data, ensure_ascii=False)}


def err(msg, status=400):
    return ok({"error": msg}, status)


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    headers = event.get("headers") or {}
    token = headers.get("X-Session-Token") or headers.get("x-session-token")

    body = {}
    if event.get("body"):
        body = json.loads(event["body"])

    action = body.get("action") or event.get("queryStringParameters", {}) and event["queryStringParameters"].get("action") or ""

    # me — получить профиль по токену
    if action == "me":
        if not token:
            return err("Не авторизован", 401)
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "SELECT u.id, u.email, u.username, u.balance, u.bonus_balance, u.vip_level, u.created_at "
            "FROM sessions s JOIN users u ON s.user_id = u.id "
            "WHERE s.token = %s AND s.expires_at > NOW()",
            (token,)
        )
        row = cur.fetchone()
        conn.close()
        if not row:
            return err("Сессия истекла", 401)
        return ok({
            "id": row[0], "email": row[1], "username": row[2],
            "balance": float(row[3]), "bonus_balance": float(row[4]),
            "vip_level": row[5], "created_at": str(row[6])
        })

    # register
    if action == "register":
        email = (body.get("email") or "").strip().lower()
        username = (body.get("username") or "").strip()
        password = body.get("password") or ""

        if not email or not username or not password:
            return err("Заполните все поля")
        if len(password) < 6:
            return err("Пароль минимум 6 символов")

        conn = get_conn()
        cur = conn.cursor()
        cur.execute("SELECT id FROM users WHERE email = %s OR username = %s", (email, username))
        if cur.fetchone():
            conn.close()
            return err("Email или имя пользователя уже заняты", 409)

        pw_hash = hash_password(password)
        cur.execute(
            "INSERT INTO users (email, username, password_hash) VALUES (%s, %s, %s) RETURNING id",
            (email, username, pw_hash)
        )
        user_id = cur.fetchone()[0]
        sess_token = secrets.token_hex(48)
        cur.execute("INSERT INTO sessions (user_id, token) VALUES (%s, %s)", (user_id, sess_token))
        conn.commit()
        conn.close()
        return ok({"token": sess_token, "username": username, "message": "Регистрация успешна"}, 201)

    # login
    if action == "login":
        login = (body.get("login") or "").strip().lower()
        password = body.get("password") or ""

        if not login or not password:
            return err("Введите логин и пароль")

        pw_hash = hash_password(password)
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "SELECT id, username, balance, bonus_balance, vip_level FROM users "
            "WHERE (email = %s OR username = %s) AND password_hash = %s",
            (login, login, pw_hash)
        )
        row = cur.fetchone()
        if not row:
            conn.close()
            return err("Неверный логин или пароль", 401)

        user_id, username, balance, bonus_balance, vip_level = row
        sess_token = secrets.token_hex(48)
        cur.execute("INSERT INTO sessions (user_id, token) VALUES (%s, %s)", (user_id, sess_token))
        conn.commit()
        conn.close()
        return ok({
            "token": sess_token, "username": username,
            "balance": float(balance), "bonus_balance": float(bonus_balance),
            "vip_level": vip_level, "message": "Вход выполнен"
        })

    # logout
    if action == "logout":
        if token:
            conn = get_conn()
            cur = conn.cursor()
            cur.execute("UPDATE sessions SET expires_at = NOW() WHERE token = %s", (token,))
            conn.commit()
            conn.close()
        return ok({"message": "Выход выполнен"})

    # default — проверка авторизации (GET без action)
    if not token:
        return err("Не авторизован", 401)

    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        "SELECT u.id, u.email, u.username, u.balance, u.bonus_balance, u.vip_level "
        "FROM sessions s JOIN users u ON s.user_id = u.id "
        "WHERE s.token = %s AND s.expires_at > NOW()",
        (token,)
    )
    row = cur.fetchone()
    conn.close()
    if not row:
        return err("Сессия истекла", 401)
    return ok({
        "id": row[0], "email": row[1], "username": row[2],
        "balance": float(row[3]), "bonus_balance": float(row[4]),
        "vip_level": row[5]
    })