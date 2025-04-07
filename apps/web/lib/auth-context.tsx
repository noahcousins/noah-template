"use client";

import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<string | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
  userId: string | null;
}

export function AuthProvider({ children, userId }: AuthProviderProps) {
  const [id, setId] = useState<string | null>(userId);

  useEffect(() => {
    setId(userId);
  }, [userId]);

  return <AuthContext.Provider value={id}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
