from django.contrib import admin
from .models import Apartment, ApartmentImage


class ApartmentImageInline(admin.TabularInline):
    model = ApartmentImage
    extra = 1


@admin.register(Apartment)
class ApartmentAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'price', 'rooms', 'status', 'owner', 'created_at']
    list_filter = ['status', 'rooms']
    search_fields = ['title', 'description']
    inlines = [ApartmentImageInline]
