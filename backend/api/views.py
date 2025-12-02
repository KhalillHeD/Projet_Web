from rest_framework import viewsets, status, generics, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError

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
