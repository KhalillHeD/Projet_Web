from django.db import models
import datetime
import uuid
STATUS_CHOICES = [
    ('paid', 'Paid'),
    ('unpaid', 'Unpaid'),
    ('pending', 'Pending'),
    ('overdue', 'Overdue'),
]

class Business(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    logo = models.ImageField(upload_to='business_logos/', blank=True, null=True)  # optional
    tagline = models.CharField(max_length=255, blank=True)  # optional
    industry = models.CharField(max_length=255, blank=True, null=True)  # Add this line

    def __str__(self):
        return self.name
class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    business = models.ForeignKey(Business, on_delete=models.CASCADE)  # link product to business
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    is_available = models.BooleanField(default=True)
    initial_quantity = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.name

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('confirmed', 'Confirmée'),
        ('completed', 'Terminée'),
        ('cancelled', 'Annulée'),
    ]
    
    customer_name = models.CharField(max_length=100)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Commande #{self.id} - {self.customer_name}"

class Transaction(models.Model):
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name="transactions")
    description = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.CharField(max_length=10, choices=(('income','Income'), ('expense','Expense')))
    category = models.CharField(max_length=100)
    date = models.DateField()
    status = models.CharField(max_length=10, default="completed")
    
class ContactInfo(models.Model):
    business = models.OneToOneField(Business, on_delete=models.CASCADE, related_name='contact_info')
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, blank=True)

class Invoice(models.Model):
    business = models.ForeignKey(Business, on_delete=models.CASCADE)
    invoiceNumber = models.CharField(max_length=50, unique=True, blank=True)
    clientName = models.CharField(max_length=100)
    dueDate = models.DateField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.invoiceNumber:
            date_str = datetime.date.today().strftime('%Y%m%d')
            # Random 6-character suffix ensures uniqueness
            unique_suffix = uuid.uuid4().hex[:6].upper()
            self.invoiceNumber = f"INV-{date_str}-{unique_suffix}"
        super().save(*args, **kwargs)