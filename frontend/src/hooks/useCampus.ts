import { useCallback, useState } from "react";
import type { Campus, Promotion } from "../interfaces/models.interface";
import { api } from "../lib/api";

export const useCampus = () => {
  const [campus, setCampus] = useState<Campus | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOne = useCallback(async (id: number): Promise<Campus> => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.campus.fetchOne(id);
      setCampus(data);
      return data;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Erreur lors de la récupération du campus";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (data: Partial<Campus>): Promise<Campus> => {
    setLoading(true);
    setError(null);
    try {
      const created = await api.campus.create(data);
      setCampus(created);
      return created;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Erreur lors de la création du campus";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(
    async (id: number, data: Partial<Campus>): Promise<Campus> => {
      setLoading(true);
      setError(null);
      try {
        const updated = await api.campus.update(id, data);
        setCampus((prev) => (prev && prev.id === id ? updated : prev));
        return updated;
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Erreur lors de la mise à jour du campus";
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
      await api.campus.delete(id);
      setCampus((prev) => (prev && prev.id === id ? null : prev));
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Erreur lors de la suppression du campus";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPromotions = useCallback(
    async (campusId: number): Promise<Promotion[]> => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.campus.fetchPromotions(campusId);
        setPromotions(data);
        return data;
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Erreur lors de la récupération des promotions du campus";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    campus,
    promotions,
    loading,
    error,
    fetchOne,
    create,
    update,
    remove,
    fetchPromotions,
  };
};

export default useCampus;
