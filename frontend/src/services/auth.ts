// src/services/auth.ts
export const API_URL = "http://127.0.0.1:8000";

export type LoginResponse = {
  access: string;
  refresh: string;
};

export type User = {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
};

export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
  password2: string;
}): Promise<User> {
  const res = await fetch(`${API_URL}/api/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw errorData;
  }

  return res.json();
}

export async function loginUser(data: {
  username: string;
  password: string;
}): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/api/auth/login/`, {   
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw errorData;
  }

  return res.json();
}

export async function fetchMe(accessToken: string): Promise<User> {
  const res = await fetch(`${API_URL}/api/auth/me/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error("Not authenticated");
  }

  return res.json();
}
