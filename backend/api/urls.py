from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import RegisterView, MeView

router = DefaultRouter()


urlpatterns = [
    path('', include(router.urls)),  # Garde seulement le router ici
    path('home/', views.home, name='api-home'),  # Si tu veux la page home
    path("auth/register/", RegisterView.as_view(), name="auth_register"),
    path("auth/me/", MeView.as_view(), name="auth_me"),
]
