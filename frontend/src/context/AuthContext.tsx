"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is logged in on mount
    const checkUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // Redirect logic
  useEffect(() => {
    if (!loading) {
      if (!user && pathname.startsWith("/dashboard")) {
        router.push("/login");
      } else if (user && user.role === "ADMIN" && pathname.startsWith("/dashboard") && !pathname.startsWith("/dashboard/tour/viewer")) {
        router.push("/admin");
      }
    }
  }, [user, loading, pathname, router]);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (userData.role === "ADMIN") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { 
        method: "POST",
        credentials: "include"
      });
      setUser(null);
      localStorage.removeItem("user");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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
