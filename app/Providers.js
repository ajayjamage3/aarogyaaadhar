"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedAuth = sessionStorage.getItem("auth");

    if (storedAuth) {
      const parsedAuth = JSON.parse(storedAuth);
      const now = new Date();

      if (parsedAuth.expires && new Date(parsedAuth.expires) > now) {
        setAuth(parsedAuth);
      } else {
        sessionStorage.clear();
        if (pathname !== "/login") router.replace("/login");
      }
    } else if (pathname !== "/login") {
      router.replace("/login");
    }
  }, [pathname, router]);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
