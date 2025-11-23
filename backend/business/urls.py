from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryViewSet,TransactionViewSet, OrderViewSet , BusinessViewSet , InvoiceViewSet , invoice_pdf
router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'businesses', BusinessViewSet)
router.register(r"transactions", TransactionViewSet, basename="transactions")
router.register(r'invoices', InvoiceViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('invoices/<int:pk>/pdf/', invoice_pdf, name='invoice-pdf'),
]
