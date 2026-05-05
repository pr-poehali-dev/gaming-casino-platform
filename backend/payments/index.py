"""
Платежи: создание заявки на пополнение, подтверждение оператором.
action: create_deposit | confirm | my_payments
"""
import json
import os
import random
import string
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Token",
}

CARD_NUMBER = "2200702118389035"
BANK_NAME = "Т-Банк"


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def ok(data, status=200):
    return {"statusCode": status, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps(data, ensure_ascii=False)}


def err(msg, status=400):
    return ok({"error": msg}, status)


def get_user_by_token(cur, token):
    cur.execute(
        "SELECT u.id, u.username, u.balance FROM sessions s JOIN users u ON s.user_id = u.id "
        "WHERE s.token = %s AND s.expires_at > NOW()",
        (token,)
    )
    return cur.fetchone()


def gen_code():
    return "AU-" + "".join(random.choices(string.digits, k=8))


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    headers = event.get("headers") or {}
    token = headers.get("X-Session-Token") or headers.get("x-session-token")

    body = {}
    if event.get("body"):
        body = json.loads(event["body"])

    action = body.get("action", "")

    # Создать заявку на пополнение
    if action == "create_deposit":
        if not token:
            return err("Не авторизован", 401)
        amount = body.get("amount")
        if not amount or float(amount) < 100:
            return err("Минимальная сумма 100 ₽")

        conn = get_conn()
        cur = conn.cursor()
        user = get_user_by_token(cur, token)
        if not user:
            conn.close()
            return err("Сессия истекла", 401)

        user_id = user[0]
        code = gen_code()
        cur.execute(
            "INSERT INTO payments (user_id, amount, payment_code) VALUES (%s, %s, %s) RETURNING id, created_at",
            (user_id, float(amount), code)
        )
        row = cur.fetchone()
        conn.commit()
        conn.close()

        return ok({
            "payment_id": row[0],
            "payment_code": code,
            "amount": float(amount),
            "card_number": CARD_NUMBER,
            "bank": BANK_NAME,
            "instruction": f"Переведите {float(amount):.0f} ₽ на карту {CARD_NUMBER} ({BANK_NAME}). В комментарии укажите код: {code}. После перевода нажмите «Я оплатил».",
            "created_at": str(row[1])
        })

    # Пользователь нажал «Я оплатил» — статус waiting
    if action == "confirm_sent":
        if not token:
            return err("Не авторизован", 401)
        payment_id = body.get("payment_id")
        if not payment_id:
            return err("Укажите payment_id")

        conn = get_conn()
        cur = conn.cursor()
        user = get_user_by_token(cur, token)
        if not user:
            conn.close()
            return err("Сессия истекла", 401)

        cur.execute(
            "UPDATE payments SET status = 'waiting' WHERE id = %s AND user_id = %s AND status = 'pending'",
            (payment_id, user[0])
        )
        conn.commit()
        conn.close()
        return ok({"message": "Заявка отправлена на проверку. Обычно подтверждение занимает до 15 минут."})

    # История платежей пользователя
    if action == "my_payments":
        if not token:
            return err("Не авторизован", 401)
        conn = get_conn()
        cur = conn.cursor()
        user = get_user_by_token(cur, token)
        if not user:
            conn.close()
            return err("Сессия истекла", 401)

        cur.execute(
            "SELECT id, amount, status, payment_code, created_at FROM payments "
            "WHERE user_id = %s ORDER BY created_at DESC LIMIT 20",
            (user[0],)
        )
        rows = cur.fetchall()
        conn.close()
        return ok({"payments": [
            {"id": r[0], "amount": float(r[1]), "status": r[2], "code": r[3], "created_at": str(r[4])}
            for r in rows
        ]})

    return err("Неизвестное действие")
