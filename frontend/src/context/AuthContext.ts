import { createContext, useCallback, useContext, useState } from "react";
import type { AuthContextType } from "../interfaces/Auth.interface";
import type { Student, User } from "../interfaces/user.interface";
import type { Role } from "../types/global.type";
import { api } from "../lib/api";

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = () => {
  const [user, setUser] = useState<User | Student | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const resetAuthStates = () => {
    setUser(null);
    setRole(null);
    setLoading(false);
  };

  const applyProfile = useCallback((profile: User | Student | null) => {
    setUser(profile);
    setRole(profile.role);
  }, []);

  // const fetchUserProfile = useCallback(async () => {
  //   const token = api.getAuthToken();
  //   if (!token) {
  //     resetAuthStates();
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     const profile = await api.getProfile();
  //     applyProfile(profile);
  //   } catch (error) {
  //     console.error("Erreur lors de la récupération du profil:", error);
  //     resetAuthStates();
  //     api.removeAuthToken();
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [applyProfile]);

  // const signIn = async (data: object) => {
  //   setLoading(true);
  //   try {
  //     const response = await api.login(data);
  //     console.log(response);
  //     // applyProfile(response.json());
  //     return;
  //   } catch (error) {
  //     setLoading(false);
  //     return { success: false, error };
  //   }
  // };

};

export const signIn = async (data: object) => {
  try {
    const response = await api.user.login(data);
    console.log(response);
    // applyProfile(response.json());
    return response;
  } catch (error) {
    return { success: false, error };
  }
};

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within an AuthProvider");
//   return context;
// };
