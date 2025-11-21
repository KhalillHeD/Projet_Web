from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryViewSet, OrderViewSet , BusinessViewSet
from django.urls import path, include
router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'businesses', BusinessViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
