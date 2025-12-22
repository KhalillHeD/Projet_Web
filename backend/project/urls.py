# main urls.py
from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static
from business.views import contact_us  # Make sure this is correct
from api.views import RegisterView, MeView
urlpatterns = [
    path("admin/", admin.site.urls),

    # AUTH ENDPOINTS
    path("api/auth/register/", RegisterView.as_view(), name="auth_register"),
    path("api/auth/me/", MeView.as_view(), name="auth_me"), 
    path("api/auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"), 
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    path("api/", include("business.urls")),  # Your business app endpoints including /contact/

    path("", lambda request: redirect("/api/")),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
