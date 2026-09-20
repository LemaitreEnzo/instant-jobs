import { useCallback, useState } from "react";
import type { Application, Media } from "../interfaces/models.interface";
import type { Student, User } from "../interfaces/user.interface";
import { api } from "../lib/api";

export const useUser = () => {
  const [user, setUser] = useState<User | Student | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [medias, setMedias] = useState<Media[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOne = useCallback(async (id: number): Promise<User | Student> => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.user.fetchOne(id);
      setUser(data);
      return data;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Erreur lors de la récupération de l'utilisateur";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (data: Partial<User>): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      const created = await api.user.create(data);
      setUser(created);
      return created;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Erreur lors de la création de l'utilisateur";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(
    async (id: number, data: Partial<User>): Promise<User> => {
      setLoading(true);
      setError(null);
      try {
        const updated = await api.user.update(id, data);
        setUser((prev) => (prev && prev.id === id ? { ...prev, ...updated } : prev));
        return updated;
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Erreur lors de la mise à jour de l'utilisateur";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const remove = useCallback(async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await api.user.delete(id);
      setUser((prev) => (prev && prev.id === id ? null : prev));
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Erreur lors de la suppression de l'utilisateur";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (
      credentials: { email: string; password: string } | Partial<User>,
    ): Promise<User | Student> => {
      setLoading(true);
      setError(null);
      try {
        const loggedUser = await api.user.login(credentials);
        setUser(loggedUser);
        return loggedUser;
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Erreur lors de la connexion";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await api.user.logout();
      setUser(null);
      setApplications([]);
      setMedias([]);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Erreur lors de la déconnexion";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMe = useCallback(async (): Promise<User | Student> => {
    setLoading(true);
    setError(null);
    try {
      const currentUser = await api.user.getMe();
      setUser(currentUser);
      return currentUser;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Erreur lors de la récupération du profil";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchApplications = useCallback(
    async (userId: number): Promise<Application[]> => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.user.fetchApplications(userId);
        setApplications(data);
        return data;
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Erreur lors de la récupération des candidatures de l'utilisateur";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchMedias = useCallback(
    async (userId: number): Promise<Media[]> => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.user.fetchMedias(userId);
        setMedias(data);
        return data;
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Erreur lors de la récupération des médias de l'utilisateur";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    user,
    applications,
    medias,
    loading,
    error,
    fetchOne,
    create,
    update,
    remove,
    login,
    logout,
    getMe,
    fetchApplications,
    fetchMedias,
  };
};

export default useUser;
