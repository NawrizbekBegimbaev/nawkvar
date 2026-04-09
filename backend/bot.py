#!/usr/bin/env python
"""Telegram bot for Nawkvar — listens for /start and saves chat_id."""

import os
import sys
import time
import django
import requests

# Django setup
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from users.models import TelegramChat

# Load token from .env file
env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
TOKEN = ''
if os.path.exists(env_path):
    with open(env_path) as f:
        for line in f:
            if line.startswith('TELEGRAM_BOT_TOKEN='):
                TOKEN = line.strip().split('=', 1)[1]

if not TOKEN:
    TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN', '')

if not TOKEN:
    print('TELEGRAM_BOT_TOKEN not found!')
    sys.exit(1)

API = f'https://api.telegram.org/bot{TOKEN}'
offset = 0


def get_updates():
    global offset
    r = requests.get(f'{API}/getUpdates', params={'offset': offset, 'timeout': 30})
    data = r.json()
    if not data.get('ok'):
        return []
    return data.get('result', [])


def send_message(chat_id, text):
    requests.post(f'{API}/sendMessage', json={'chat_id': chat_id, 'text': text})


def handle_update(update):
    global offset
    offset = update['update_id'] + 1
    msg = update.get('message')
    if not msg:
        return

    chat_id = msg['chat']['id']
    text = msg.get('text', '')
    user = msg.get('from', {})
    username = user.get('username', '')

    if text == '/start':
        if not username:
            send_message(chat_id,
                'У вас не установлен username в Telegram.\n'
                'Зайдите в Настройки -> Имя пользователя, установите его и попробуйте снова.')
            return

        username_lower = username.lower()
        TelegramChat.objects.update_or_create(
            username=username_lower,
            defaults={'chat_id': chat_id},
        )
        send_message(chat_id,
            f'Добро пожаловать в Nawkvar!\n\n'
            f'Ваш аккаунт @{username} привязан.\n'
            f'Теперь вернитесь на сайт и нажмите "Отправить код".')
        print(f'[+] Saved @{username} -> {chat_id}')


print('Bot started. Listening for /start...')
while True:
    try:
        updates = get_updates()
        for u in updates:
            handle_update(u)
    except KeyboardInterrupt:
        print('\nBot stopped.')
        break
    except Exception as e:
        print(f'Error: {e}')
        time.sleep(5)
