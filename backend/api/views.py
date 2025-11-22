from rest_framework import viewsets, status, serializers, generics, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response
from business.models import Category, Product, Order
from .serializers import CategorySerializer, ProductSerializer, OrderSerializer
from django.contrib.auth.models import User
from rest_framework.views import APIView



# Vue pour les catégories
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

# Vue pour les produits
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

# Vue pour les commandes
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

# Vue simple pour la page d'accueil
@api_view(['GET'])
def home(request):
    return Response({
        'message': 'Bienvenue sur notre API',
        'endpoints': {
            'categories': '/api/categories/',
            'products': '/api/products/',
            'orders': '/api/orders/'
        }
    })

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return user

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)