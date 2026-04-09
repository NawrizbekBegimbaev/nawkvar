from django.conf import settings
from django.db import models


class Apartment(models.Model):
    class Status(models.TextChoices):
        ACTIVE = 'ACTIVE', 'Active'
        SOLD = 'SOLD', 'Sold'

    price = models.DecimalField(max_digits=12, decimal_places=2)
    rooms = models.PositiveIntegerField()
    description = models.TextField(blank=True, default='')
    latitude = models.FloatField()
    longitude = models.FloatField()
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.ACTIVE)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='apartments')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.rooms}-комн. {self.price} сум"


class ApartmentImage(models.Model):
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='apartments/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for apartment #{self.apartment.id}"
