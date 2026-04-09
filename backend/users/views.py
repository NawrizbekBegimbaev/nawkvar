import random
import requests

from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import TelegramChat, OTP
from .serializers import RegisterSerializer, LoginSerializer

User = get_user_model()


def send_telegram_message(chat_id, text):
    url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/sendMessage"
    requests.post(url, json={'chat_id': chat_id, 'text': text})


class SendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        telegram = request.data.get('telegram', '').strip().lstrip('@').lower()
        if not telegram:
            return Response({'detail': 'Укажите Telegram username'}, status=400)

        # Check if user already exists with this telegram
        if User.objects.filter(telegram__iexact=telegram).exists():
            return Response({'detail': 'Этот Telegram уже зарегистрирован'}, status=400)

        # Find chat_id
        try:
            chat = TelegramChat.objects.get(username__iexact=telegram)
        except TelegramChat.DoesNotExist:
            return Response({
                'detail': 'Сначала отправьте /start боту @online_flat_bot',
                'need_start': True,
            }, status=400)

        # Generate OTP
        code = str(random.randint(100000, 999999))
        OTP.objects.create(telegram_username=telegram.lower(), code=code)

        # Send via Telegram
        send_telegram_message(
            chat.chat_id,
            f"Ваш код подтверждения для Nawkvar: {code}\n\nКод действителен 5 минут."
        )

        return Response({'detail': 'Код отправлен в Telegram'})


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        telegram = request.data.get('telegram', '').strip().lstrip('@').lower()
        otp_code = request.data.get('otp_code', '').strip()

        if not telegram or not otp_code:
            return Response({'detail': 'Укажите Telegram и код подтверждения'}, status=400)

        # Verify OTP
        try:
            otp = OTP.objects.filter(
                telegram_username=telegram.lower(),
                code=otp_code,
                is_used=False,
            ).latest('created_at')
        except OTP.DoesNotExist:
            return Response({'detail': 'Неверный код'}, status=400)

        if not otp.is_valid():
            return Response({'detail': 'Код истек, запросите новый'}, status=400)

        # Mark OTP as used
        otp.is_used = True
        otp.save()

        # Create user
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone = serializer.validated_data['phone']
        password = serializer.validated_data['password']

        try:
            user = User.objects.get(phone=phone)
        except User.DoesNotExist:
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.check_password(password):
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
