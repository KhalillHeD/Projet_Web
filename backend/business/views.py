from rest_framework import viewsets
from .models import Product , Category, Order, Business , Transaction , Invoice
from .serializers import ProductSerializer, CategorySerializer, OrderSerializer , BusinessSerializer , TransactionSerializer , InvoiceSerializer
import io
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.platypus import Table, TableStyle
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import HttpResponse
from .models import Invoice
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image)
from reportlab.lib.styles import getSampleStyleSheet
import datetime
from rest_framework.exceptions import ValidationError
from django.core.mail import send_mail
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json
from django.core.mail import EmailMessage

from rest_framework import permissions

class BusinessViewSet(viewsets.ModelViewSet):
    serializer_class = BusinessSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Each user sees ONLY their businesses
        return Business.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically assign owner
        serializer.save(user=self.request.user)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

class ProductViewSet(viewsets.ModelViewSet):
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
            raise ValidationError(
                {"business_id": "business_id is required to create a product."}
            )

        try:
            # ensure the business belongs to the current user
            business = Business.objects.get(id=business_id, user=self.request.user)
        except Business.DoesNotExist:
            raise ValidationError(
                {"business_id": "Business not found or unauthorized."}
            )

        serializer.save(business=business)


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["status", "created_at"]

    def get_queryset(self):
        user_businesses = Business.objects.filter(user=self.request.user)
        return Order.objects.filter(product__business__in=user_businesses)

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_businesses = Business.objects.filter(user=self.request.user)
        qs = Transaction.objects.filter(business__in=user_businesses)
        business_id = self.request.query_params.get("business_id")
        if business_id:
            qs = qs.filter(business_id=int(business_id))
        return qs

    def perform_create(self, serializer):
        business_id = self.request.query_params.get("business_id")
        if not business_id:
            raise ValidationError({"business_id": "This query param is required"})
        try:
            business = Business.objects.get(id=int(business_id), user=self.request.user)
        except Business.DoesNotExist:
            raise ValidationError({"business_id": "Business not found or unauthorized."})
        serializer.save(business=business)

class InvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_businesses = Business.objects.filter(user=self.request.user)
        qs = Invoice.objects.filter(business__in=user_businesses)
        business_id = self.request.query_params.get("business")
        if business_id:
            qs = qs.filter(business__id=business_id)
        return qs
    
@api_view(['GET'])
def invoice_pdf(request, pk):
    try:
        invoice = Invoice.objects.get(pk=pk)
        business = invoice.business
        contact = getattr(business, 'contact_info', None)
    except Invoice.DoesNotExist:
        return HttpResponse("Invoice not found", status=404)

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=20*mm,
        leftMargin=20*mm,
        topMargin=20*mm,
        bottomMargin=20*mm
    )

    styles = getSampleStyleSheet()
    story = []

    # ------------------------------------------------------------
    # Header Section
    # ------------------------------------------------------------
    header_items = []

    # Business Logo
    if business.logo:
        try:
            logo = Image(business.logo.path, width=40*mm, height=40*mm)
            header_items.append([logo, Paragraph("<b>INVOICE</b>", styles["Title"])])
        except:
            header_items.append([Paragraph(business.name, styles["Title"]),
                                 Paragraph("<b>INVOICE</b>", styles["Title"])])
    else:
        header_items.append([Paragraph(business.name, styles["Title"]),
                             Paragraph("<b>INVOICE</b>", styles["Title"])])

    header_table = Table(header_items, colWidths=[80*mm, 80*mm])
    header_table.setStyle(
        TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("ALIGN", (1, 0), (1, 0), "RIGHT")
        ])
    )

    story.append(header_table)
    story.append(Spacer(1, 12))

    # ------------------------------------------------------------
    # Business Info Section
    # ------------------------------------------------------------
    business_lines = [
        f"<b>{business.name}</b>",
    ]

    if business.tagline:
        business_lines.append(business.tagline)

    if contact:
        if contact.email:
            business_lines.append(f"Email: {contact.email}")
        if contact.phone:
            business_lines.append(f"Phone: {contact.phone}")

        address = ", ".join(
            filter(None, [
                contact.address,
                contact.city,
                contact.state,
                contact.postal_code,
                contact.country
            ])
        )
        if address:
            business_lines.append(address)

    for line in business_lines:
        story.append(Paragraph(line, styles["Normal"]))
    story.append(Spacer(1, 12))

    # ------------------------------------------------------------
    # Invoice Metadata Section (Right aligned)
    # ------------------------------------------------------------
    invoice_meta = [
        [Paragraph("<b>Invoice #:</b>", styles["Normal"]), invoice.invoiceNumber],
        [Paragraph("<b>Date:</b>", styles["Normal"]), invoice.created_at.strftime('%Y-%m-%d')],
        [Paragraph("<b>Due Date:</b>", styles["Normal"]), invoice.dueDate.strftime('%Y-%m-%d')],
        [Paragraph("<b>Status:</b>", styles["Normal"]), invoice.status.capitalize()],
    ]

    meta_table = Table(invoice_meta, colWidths=[30*mm, 50*mm])
    meta_table.setStyle(
        TableStyle([
            ("ALIGN", (1, 0), (-1, -1), "RIGHT"),
        ])
    )

    story.append(meta_table)
    story.append(Spacer(1, 12))
    story.append(Spacer(1, 6))

    # ------------------------------------------------------------
    # Client Information
    # ------------------------------------------------------------
    story.append(Paragraph("<b>Bill To:</b>", styles["Heading4"]))
    story.append(Paragraph(invoice.clientName, styles["Normal"]))
    story.append(Spacer(1, 14))

    # ------------------------------------------------------------
    # Invoice Items Table
    # ------------------------------------------------------------
    data = [
        ["Description", "Amount"],
        ["Service/Product", f"${invoice.amount:.2f}"],
        ["", ""],
        ["Total", f"${invoice.amount:.2f}"],
    ]

    table = Table(data, colWidths=[120*mm, 40*mm])
    table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
            ("ALIGN", (1, 1), (1, -1), "RIGHT"),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
            ("GRID", (0, 0), (-1, -1), 0.25, colors.grey),
            ("FONTNAME", (0, -1), (-1, -1), "Helvetica-Bold")
        ])
    )

    story.append(table)
    story.append(Spacer(1, 20))

    # ------------------------------------------------------------
    # Footer Section
    # ------------------------------------------------------------
    story.append(Paragraph("Thank you for your business!", styles["Normal"]))
    story.append(Paragraph("If you have any questions, please contact us.", styles["Normal"]))

    # ------------------------------------------------------------
    # Build PDF
    # ------------------------------------------------------------
    doc.build(story)

    buffer.seek(0)
    return HttpResponse(buffer, content_type="application/pdf")






@csrf_exempt
@require_http_methods(["POST"])
def contact_us(request):
    try:
        data = json.loads(request.body)
        name = data.get('name')
        email = data.get('email')
        message = data.get('message')

        if not all([name, email, message]):
            return JsonResponse({'success': False, 'error': 'Missing fields'}, status=400)

        email_msg = EmailMessage(
            subject=f'New Contact from {name}',
            body=f"From: {name}\nEmail: {email}\n\nMessage:\n{message}",
            from_email=None,  # Uses DEFAULT_FROM_EMAIL from settings.py
            to=['bizmanager08@gmail.com'],
            headers={'Reply-To': email}
        )

        email_msg.send(fail_silently=False)

        return JsonResponse({'success': True, 'message': 'Email sent successfully'})

    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)
