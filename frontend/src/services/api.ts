import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const apiService = {
  // Business endpoints
  getBusinesses: () => api.get('/businesses/'),
  getBusiness: (id: string) => api.get(`/businesses/${id}/`),
  
  // Invoice endpoints  
  getInvoices: (businessId?: string) => api.get('/invoices/', { 
    params: businessId ? { business_id: businessId } : {} 
  }),
  createInvoice: (data: any) => api.post('/invoices/', data),
  // ... more endpoints
};