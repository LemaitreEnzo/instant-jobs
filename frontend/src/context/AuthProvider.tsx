import React, { useEffect, useState } from "react";
import type { AuthContextType } from "../interfaces/Auth.interface";
import type { Role } from "../types/global.type";
import { AuthContext } from "./AuthContext";

const fetchUserSession = (): Promise<{ isLoggedIn: boolean; role: Role }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ isLoggedIn: true, role: "admin" });
    }, 1000);
  });
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [auth, setAuth] = useState<Omit<AuthContextType, "loading">>({
    isLoggedIn: false,
    role: "user",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchUserSession()
      .then((data) => {
        if (isMounted) {
          setAuth(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setAuth({ isLoggedIn: false, role: "user" });
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
