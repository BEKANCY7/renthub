// API configuration and utilities for external RentHub backend
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://renthubbackend.onrender.com/api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  phone?: string;
  image?: string;
}

export interface LoginResponse {
  access?: string;
  refresh?: string;
  token?: string;
  user?: User;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

/**
 * Login to the external RentHub backend API
 */
export async function loginToExternalAPI(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login/`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        message: errorData.message || "Login failed",
        status: response.status,
        details: errorData,
      } as ApiError;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if ((error as ApiError).status) {
      throw error;
    }
    throw {
      message: "Network error. Please check your connection.",
      status: 0,
      details: error,
    } as ApiError;
  }
}

/**
 * Store authentication tokens in localStorage
 */
export function storeAuthTokens(tokens: {
  access?: string;
  refresh?: string;
  token?: string;
}) {
  if (typeof window === "undefined") return;

  if (tokens.access) {
    localStorage.setItem("access_token", tokens.access);
  }
  if (tokens.refresh) {
    localStorage.setItem("refresh_token", tokens.refresh);
  }
  if (tokens.token) {
    localStorage.setItem("auth_token", tokens.token);
  }
}

/**
 * Get stored authentication token
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem("access_token") ||
    localStorage.getItem("auth_token") ||
    null
  );
}

/**
 * Clear authentication tokens
 */
export function clearAuthTokens() {
  if (typeof window === "undefined") return;

  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user");
}

/**
 * Store user data in localStorage
 */
export function storeUser(user: User) {
  if (typeof window === "undefined") return;
  localStorage.setItem("user", JSON.stringify(user));
}

/**
 * Get stored user data
 */
export function getUser(): User | null {
  if (typeof window === "undefined") return null;

  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Make authenticated API request
 */
export async function authenticatedFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAuthToken();

  const headers = {
    accept: "application/json",
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
}
