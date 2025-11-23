from rest_framework import serializers
from .models import Category, Product, Order , Transaction , ContactInfo , Invoice
from .models import Business
import datetime
import uuid

class ContactInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInfo
        fields = ['email', 'phone', 'address', 'city', 'state', 'postal_code', 'country']


class BusinessSerializer(serializers.ModelSerializer):
    contact_info = ContactInfoSerializer()

    class Meta:
        model = Business
        fields = ['id', 'name', 'description', 'logo', 'tagline', 'industry', 'contact_info']

    def create(self, validated_data):
        contact_data = validated_data.pop('contact_info', {})
        business = super().create(validated_data)
        ContactInfo.objects.create(business=business, **contact_data)
        return business

    def update(self, instance, validated_data):
        contact_data = validated_data.pop('contact_info', {})
        instance = super().update(instance, validated_data)
        ContactInfo.objects.update_or_create(business=instance, defaults=contact_data)
        return instance
    
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'category', 'category_id',
            'image', 'is_available', 'initial_quantity', 'created_at'
        ]

class OrderSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='product', write_only=True
    )

    class Meta:
        model = Order
        fields = [
            'id', 'customer_name', 'customer_email', 'customer_phone',
            'product', 'product_id', 'quantity', 'total_price', 'status',
            'notes', 'created_at'
        ]
class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'description', 'amount', 'type', 'category', 'date', 'status', 'business']
        read_only_fields = ['business']

class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = ['id', 'business', 'invoiceNumber', 'clientName', 'dueDate', 'amount', 'status', 'created_at']
        read_only_fields = ['invoiceNumber', 'created_at']

    def create(self, validated_data):
        # Auto-generate invoiceNumber safely
        date_str = datetime.date.today().strftime('%Y%m%d')
        unique_suffix = uuid.uuid4().hex[:6].upper()
        validated_data['invoiceNumber'] = f"INV-{date_str}-{unique_suffix}"
        return super().create(validated_data)