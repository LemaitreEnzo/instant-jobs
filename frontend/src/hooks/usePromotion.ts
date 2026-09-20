import { useCallback, useState } from "react";
import type { Promotion, Speciality } from "../interfaces/models.interface";
import { api } from "../lib/api";

export const usePromotion = () => {
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOne = useCallback(async (id: number): Promise<Promotion> => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.promotion.fetchOne(id);
      setPromotion(data);
      return data;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Erreur lors de la récupération de la promotion";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(
    async (data: Partial<Promotion>): Promise<Promotion> => {
      setLoading(true);
      setError(null);
      try {
        const created = await api.promotion.create(data);
        setPromotion(created);
        return created;
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Erreur lors de la création de la promotion";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const update = useCallback(
    async (id: number, data: Partial<Promotion>): Promise<Promotion> => {
      setLoading(true);
      setError(null);
      try {
        const updated = await api.promotion.update(id, data);
        setPromotion((prev) => (prev && prev.id === id ? updated : prev));
        return updated;
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Erreur lors de la mise à jour de la promotion";
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
      await api.promotion.delete(id);
      setPromotion((prev) => (prev && prev.id === id ? null : prev));
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Erreur lors de la suppression de la promotion";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSpecialities = useCallback(
    async (promotionId: number): Promise<Speciality[]> => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.promotion.fetchSpecialities(promotionId);
        setSpecialities(data);
        return data;
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Erreur lors de la récupération des spécialités de la promotion";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    promotion,
    specialities,
    loading,
    error,
    fetchOne,
    create,
    update,
    remove,
    fetchSpecialities,
  };
};

export default usePromotion;
