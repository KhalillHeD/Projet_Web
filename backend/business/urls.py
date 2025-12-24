from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryViewSet,TransactionViewSet, OrderViewSet , BusinessViewSet , InvoiceViewSet , invoice_pdf, contact_us

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'businesses', BusinessViewSet, basename='business')
router.register(r"transactions", TransactionViewSet, basename="transactions")
router.register(r'invoices', InvoiceViewSet, basename='invoice')

urlpatterns = [

    path('invoices/<int:pk>/pdf/', invoice_pdf, name='invoice-pdf'),
    path('contact/', contact_us, name='contact_us'),
    path('', include(router.urls)),
]
