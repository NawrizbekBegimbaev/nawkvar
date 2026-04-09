from rest_framework import serializers
from .models import Apartment, ApartmentImage


class ApartmentImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApartmentImage
        fields = ['id', 'image', 'created_at']
        read_only_fields = ['id', 'created_at']


class ApartmentListSerializer(serializers.ModelSerializer):
    images = ApartmentImageSerializer(many=True, read_only=True)
    owner_phone = serializers.CharField(source='owner.phone', read_only=True)
    owner_telegram = serializers.CharField(source='owner.telegram', read_only=True)

    class Meta:
        model = Apartment
        fields = [
            'id', 'price', 'rooms', 'description',
            'latitude', 'longitude', 'status',
            'owner_phone', 'owner_telegram',
            'images', 'created_at', 'updated_at',
        ]


class ApartmentCreateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=True
    )

    class Meta:
        model = Apartment
        fields = [
            'price', 'rooms', 'description',
            'latitude', 'longitude', 'images',
        ]

    def validate_images(self, value):
        if not value:
            raise serializers.ValidationError('At least one image is required.')
        return value

    def create(self, validated_data):
        images_data = validated_data.pop('images')
        apartment = Apartment.objects.create(**validated_data)
        for image in images_data:
            ApartmentImage.objects.create(apartment=apartment, image=image)
        return apartment


class ApartmentUpdateSerializer(serializers.ModelSerializer):
    new_images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )

    class Meta:
        model = Apartment
        fields = [
            'price', 'rooms', 'description',
            'latitude', 'longitude', 'new_images',
        ]

    def update(self, instance, validated_data):
        new_images = validated_data.pop('new_images', [])
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        for image in new_images:
            ApartmentImage.objects.create(apartment=instance, image=image)
        return instance


class ApartmentStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Apartment
        fields = ['status']
