from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from api.views import RegisterView, MeView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),

    # 🔹 AUTH ENDPOINTS FIRST (exact paths)
    path("api/auth/register/", RegisterView.as_view(), name="auth_register"),
    path("api/auth/me/", MeView.as_view(), name="auth_me"),
    path("api/auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # 🔹 OTHER API ROUTES UNDER /api/
    path("api/", include("business.urls")),
    path("api/", include("api.urls")),  # expose categories/products/orders from api app too

    path("", lambda request: redirect("/api/")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)