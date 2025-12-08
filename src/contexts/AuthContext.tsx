"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, getUser, getAuthToken, storeUser } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  refreshAuth: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuth = () => {
    console.log("AuthContext - refreshAuth called");
    const storedUser = getUser();
    const token = getAuthToken();

    console.log("AuthContext - storedUser:", storedUser);
    console.log("AuthContext - token:", token ? "exists" : "null");

    if (storedUser && token) {
      setUser(storedUser);

      // Set cookie for middleware
      document.cookie = `auth_token=${token}; path=/; max-age=${
        60 * 60 * 24 * 7
      }`; // 7 days
      console.log("AuthContext - User set successfully");
    } else {
      // Create a demo user if no user is found
      const demoUser: User = {
        id: "demo-user-123",
        email: "demo@renthub.com",
        name: "Demo User",
        role: "OWNER",
      };
      setUser(demoUser);
      storeUser(demoUser);
      document.cookie = `auth_token=demo-token; path=/; max-age=${
        60 * 60 * 24 * 7
      }`;
      console.log("AuthContext - Demo user created");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
