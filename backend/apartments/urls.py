from django.urls import path

from .views import (
    ApartmentPublicListView,
    ApartmentPublicDetailView,
    MyApartmentListView,
    ApartmentCreateView,
    ApartmentUpdateView,
    ApartmentStatusView,
    ApartmentDeleteView,
)

urlpatterns = [
    path('', ApartmentPublicListView.as_view(), name='apartment-list'),
    path('<int:pk>/', ApartmentPublicDetailView.as_view(), name='apartment-detail'),
    path('my/', MyApartmentListView.as_view(), name='my-apartments'),
    path('create/', ApartmentCreateView.as_view(), name='apartment-create'),
    path('<int:pk>/update/', ApartmentUpdateView.as_view(), name='apartment-update'),
    path('<int:pk>/status/', ApartmentStatusView.as_view(), name='apartment-status'),
    path('<int:pk>/delete/', ApartmentDeleteView.as_view(), name='apartment-delete'),
]
