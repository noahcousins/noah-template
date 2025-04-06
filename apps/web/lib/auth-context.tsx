"use client";

import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  // Add other user properties as needed
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  initialUser: User | null;
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const isAuthenticated = !!user;

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
