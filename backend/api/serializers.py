from rest_framework import serializers
from business.models import Category, Product, Order ,Business
from django.contrib.auth import get_user_model

User = get_user_model()

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "description",
            "price",
            "category",
            "category_name",
            "image",
            "is_available",
            "initial_quantity",
            "created_at",
        ]
        extra_kwargs = {
            "category": {"required": False},
        }

    def create(self, validated_data):
        category_data = self.initial_data.get("category_name")
        category = validated_data.get("category")

        if not category and category_data:
            category, _ = Category.objects.get_or_create(name=category_data)
            validated_data["category"] = category

        if not validated_data.get("category"):
            raise serializers.ValidationError(
                {"category": "Category ID or category_name is required."}
            )

        return super().create(validated_data)

class OrderSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    total_price_display = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "id",
            "customer_name",
            "customer_email",
            "customer_phone",
            "product",
            "product_name",
            "quantity",
            "total_price",
            "total_price_display",
            "status",
            "notes",
            "created_at",
        ]

    def get_total_price_display(self, obj):
        return f"{obj.total_price} €"
    
class BusinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        # don't expose the user field to the client
        fields = ["id", "name", "description", "logo", "tagline", "industry"]


class BaseUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User

class UserSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        fields = ["id", "username", "email", "first_name", "last_name"]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "password2"]

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError({"password2": "Passwords do not match."})
        if User.objects.filter(email=attrs["email"]).exists():
            raise serializers.ValidationError({"email": "An account with this email already exists."})
        return attrs

    def create(self, validated_data):
        validated_data.pop("password2")
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
