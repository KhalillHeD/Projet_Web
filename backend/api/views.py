from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from business.models import Category, Product, Order
from .serializers import CategorySerializer, ProductSerializer, OrderSerializer

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