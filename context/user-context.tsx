"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { SessionUser } from "@/types";

interface UserContextType {
  user: SessionUser | null;
  setUser: (user: SessionUser | null) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: SessionUser) => void;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkSession = async () => {
    try {
      const response = await fetch("/api/auth/session");
      const data = await response.json();

      if (data.isAuth && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Session check failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = (userData: SessionUser) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        checkSession,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
