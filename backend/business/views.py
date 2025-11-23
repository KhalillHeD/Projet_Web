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


class BusinessViewSet(viewsets.ModelViewSet):
    queryset = Business.objects.all()
    serializer_class = BusinessSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    def get_queryset(self):
        business_id = self.request.query_params.get("business_id")
        if business_id:
            return Product.objects.filter(business_id=business_id)
        return Product.objects.all()
    

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    filterset_fields = ['status', 'created_at']

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer

    def get_queryset(self):
        business_id = self.request.query_params.get("business_id")
        if business_id:
            return Transaction.objects.filter(business_id=int(business_id))
        return Transaction.objects.all()

    def perform_create(self, serializer):
        business_id = self.request.query_params.get("business_id")
        if not business_id:
            raise ValidationError({"business_id": "This query param is required"})
        business = Business.objects.get(id=int(business_id))
        serializer.save(business=business)

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer

    def get_queryset(self):
        business_id = self.request.query_params.get('business')
        if business_id:
            return self.queryset.filter(business__id=business_id)
        return self.queryset
    
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