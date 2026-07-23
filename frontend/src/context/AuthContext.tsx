import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { User } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("driveflix-user");

    if (!storedUser) return null;

    try {
      const stored = JSON.parse(storedUser) as User;
      return stored.expiresAt > Date.now() ? stored : null;
    } catch {
      return null;
    }
  });

  const login = (user: User) => {
    setUser(user);
    localStorage.setItem("driveflix-user", JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("driveflix-user");
  };

  useEffect(() => {
    if (!user) {
      localStorage.removeItem("driveflix-user");

      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
      return;
    }

    const timeout = window.setTimeout(() => {
      setUser(null);
      localStorage.removeItem("driveflix-user");
      window.location.replace("/login");
    }, Math.max(user.expiresAt - Date.now(), 0));

    return () => window.clearTimeout(timeout);
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      logout,
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
