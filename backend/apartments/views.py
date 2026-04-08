from rest_framework import status
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Apartment, ApartmentImage
from .serializers import (
    ApartmentListSerializer,
    ApartmentCreateSerializer,
    ApartmentUpdateSerializer,
    ApartmentStatusSerializer,
)


class ApartmentPublicListView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = ApartmentListSerializer

    def get_queryset(self):
        return Apartment.objects.filter(status=Apartment.Status.ACTIVE).select_related('owner').prefetch_related('images')


class ApartmentPublicDetailView(RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = ApartmentListSerializer

    def get_queryset(self):
        return Apartment.objects.filter(status=Apartment.Status.ACTIVE).select_related('owner').prefetch_related('images')


class MyApartmentListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ApartmentListSerializer

    def get_queryset(self):
        return Apartment.objects.filter(owner=self.request.user).select_related('owner').prefetch_related('images')


class ApartmentCreateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = ApartmentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        apartment = serializer.save(owner=request.user)
        return Response(
            ApartmentListSerializer(apartment).data,
            status=status.HTTP_201_CREATED,
        )


class ApartmentUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def put(self, request, pk):
        apartment = Apartment.objects.filter(pk=pk, owner=request.user).first()
        if not apartment:
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ApartmentUpdateSerializer(apartment, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        apartment = serializer.save()
        return Response(ApartmentListSerializer(apartment).data)


class ApartmentStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        apartment = Apartment.objects.filter(pk=pk, owner=request.user).first()
        if not apartment:
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ApartmentStatusSerializer(apartment, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ApartmentDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        apartment = Apartment.objects.filter(pk=pk, owner=request.user).first()
        if not apartment:
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        apartment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
