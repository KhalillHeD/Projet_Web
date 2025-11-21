from rest_framework import viewsets
from .models import Product , Category, Order, Business
from .serializers import ProductSerializer, CategorySerializer, OrderSerializer , BusinessSerializer

class BusinessViewSet(viewsets.ModelViewSet):
    queryset = Business.objects.all()
    serializer_class = BusinessSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    queryset = Product.objects.all()

    def get_queryset(self):
        business_id = self.request.query_params.get('business_id')
        if business_id:
            return Product.objects.filter(business_id=business_id)
        return Product.objects.all()
    

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    filterset_fields = ['status', 'created_at']
