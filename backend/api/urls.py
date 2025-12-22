from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import RegisterView, MeView
from api.views import (PasswordResetRequestView, PasswordResetConfirmView)
router = DefaultRouter()

router.register(r'businesses', views.BusinessViewSet, basename='business')
router.register(r'categories', views.CategoryViewSet, basename='category')
router.register(r'products', views.ProductViewSet, basename='product')
router.register(r'orders', views.OrderViewSet, basename='order')


urlpatterns = [
    path('home/', views.home, name='api-home'),  
    path("auth/register/", RegisterView.as_view(), name="auth_register"),
    path("auth/me/", MeView.as_view(), name="auth_me"),
    path("auth/password-reset/", PasswordResetRequestView.as_view(), name="password_reset"),
    path("auth/password-reset/confirm/", PasswordResetConfirmView.as_view(), name="password_reset_confirm"),
    path('', include(router.urls)),
]