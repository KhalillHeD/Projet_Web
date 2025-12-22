from rest_framework import viewsets, status, generics, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError

from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings

from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

from business.models import Business, Category, Product, Order
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    BusinessSerializer,
    CategorySerializer,
    ProductSerializer,
    OrderSerializer,
)

User = get_user_model()


# Simple home view
@api_view(["GET"])
def home(request):
    return Response(
        {
            "message": "Bienvenue sur notre API",
            "endpoints": {
                "categories": "/api/categories/",
                "products": "/api/products/",
                "orders": "/api/orders/",
            },
        }
    )


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response(
                {"detail": "Email is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Do not reveal if user exists
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"detail": "If the email exists, a reset link was sent."},
                status=status.HTTP_200_OK,
            )

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        frontend_url = getattr(settings, "FRONTEND_URL", "http://localhost:5173")
        reset_link = f"{frontend_url}/reset-password?uid={uid}&token={token}"

        send_mail(
            subject="Reset your password",
            message=f"Click this link to reset your password: {reset_link}",
            from_email=getattr(settings, "DEFAULT_FROM_EMAIL", None),
            recipient_list=[email],
            fail_silently=False,
        )

        return Response(
            {"detail": "If the email exists, a reset link was sent."},
            status=status.HTTP_200_OK,
        )


class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        uid = request.data.get("uid")
        token = request.data.get("token")
        new_password = request.data.get("new_password")

        if not uid or not token or not new_password:
            return Response(
                {"detail": "uid, token and new_password are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
        except Exception:
            return Response({"detail": "Invalid link"}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response(
                {"detail": "Invalid or expired token"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save()

        return Response(
            {"detail": "Password has been reset successfully"},
            status=status.HTTP_200_OK,
        )

class BusinessViewSet(viewsets.ModelViewSet):
    """
    Each user only sees / manages their own businesses.
    """
    serializer_class = BusinessSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Business.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CategoryViewSet(viewsets.ModelViewSet):
    """
    Categories that are actually used by the current user's products.
    """
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Categories linked to products owned by the user's businesses
        return (
            Category.objects.filter(product__business__user=self.request.user)
            .distinct()
        )


class ProductViewSet(viewsets.ModelViewSet):
    """
    Products belonging to the current user's businesses.
    Supports ?business_id=... for filtering/creating.
    """
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # limit to user's businesses
        user_businesses = Business.objects.filter(user=self.request.user)
        qs = Product.objects.filter(business__in=user_businesses)

        business_id = self.request.query_params.get("business_id")
        if business_id:
            qs = qs.filter(business_id=business_id)

        return qs

    def perform_create(self, serializer):
        business_id = self.request.query_params.get("business_id")
        if not business_id:
            raise ValidationError({"business_id": "business_id is required to create a product."})

        # ensure the business belongs to the current user
        business = get_object_or_404(Business, id=business_id, user=self.request.user)
        serializer.save(business=business)


class OrderViewSet(viewsets.ModelViewSet):
    """
    Orders only for products belonging to the current user's businesses.
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(product__business__user=self.request.user)
