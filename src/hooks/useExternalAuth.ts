import { useState, useCallback } from "react";
import {
  loginToExternalAPI,
  storeAuthTokens,
  clearAuthTokens,
  getAuthToken,
  ApiError,
  LoginCredentials,
} from "@/lib/api";

export function useExternalAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginToExternalAPI(credentials);
      storeAuthTokens(response);
      return response;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearAuthTokens();
  }, []);

  const getToken = useCallback(() => {
    return getAuthToken();
  }, []);

  return {
    login,
    logout,
    getToken,
    isLoading,
    error,
  };
}
