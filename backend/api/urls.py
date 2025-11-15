from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('clients/', name='clients'),
    path('products/', name='products'),
    path('transactions/', name='transactions'),
    path('ogin/', name='login'),
]
