from rest_framework import serializers
from .models import Category, Product, Order , Transaction , ContactInfo , Invoice
from .models import Business
import datetime
import uuid
import json

class ContactInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInfo
        fields = ['email', 'phone', 'address', 'city', 'state', 'postal_code', 'country']


class BusinessSerializer(serializers.ModelSerializer):
    contact_info = ContactInfoSerializer(required=False)

    class Meta:
        model = Business
        fields = ["id", "name", "description", "logo", "tagline", "industry", "contact_info"]

    def _extract_contact_data(self, validated_data):
        """
        Support both JSON (nested dict) and FormData (contact_info[field]) shapes.
        """
        # JSON body: contact_info is already a dict in validated_data
        contact_data = validated_data.pop("contact_info", None) or {}

        # FormData body: contact_info[email], contact_info[phone], ...
        for field in ["email", "phone", "address", "city", "state", "postal_code", "country"]:
            key = f"contact_info[{field}]"
            if key in self.initial_data:
                contact_data[field] = self.initial_data[key]

        # Strip empty strings so you do not overwrite with blanks unless provided
        contact_data = {k: v for k, v in contact_data.items() if v is not None}
        return contact_data

    def create(self, validated_data):
        contact_data = self._extract_contact_data(validated_data)
        business = super().create(validated_data)
        if contact_data:
            ContactInfo.objects.update_or_create(business=business, defaults=contact_data)
        return business

    def update(self, instance, validated_data):
        contact_data = self._extract_contact_data(validated_data)
        instance = super().update(instance, validated_data)
        if contact_data:
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