// frontend/src/api.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

// ---- Axios instance ----
export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach JWT token on every request (if present)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- Auth helpers ----
export async function login(username: string, password: string) {
  const res = await api.post("/auth/login/", { username, password });
  const { access, refresh } = res.data;

  // Save tokens
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);

  return res.data;
}

export async function register(username: string, email: string, password: string) {
  const res = await api.post("/auth/register/", { username, email, password });
  return res.data;
}

export async function getMe() {
  const res = await api.get("/auth/me/");
  return res.data;
}

// ---- Business endpoints ----
export async function getBusinesses() {
  const res = await api.get("/businesses/");
  return res.data;
}

export async function createBusiness(data: {
  name: string;
  description?: string;
  tagline?: string;
  industry?: string;
}) {
  const res = await api.post("/businesses/", data);
  return res.data;
}


