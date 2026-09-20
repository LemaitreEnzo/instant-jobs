import { useCallback, useState } from "react";
import type { SubSpeciality } from "../interfaces/models.interface";
import { api } from "../lib/api";

export const useSubSpeciality = () => {
  const [subSpeciality, setSubSpeciality] = useState<SubSpeciality | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOne = useCallback(async (id: number): Promise<SubSpeciality> => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.subSpeciality.fetchOne(id);
      setSubSpeciality(data);
      return data;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Erreur lors de la récupération de la sous-spécialité";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(
    async (data: Partial<SubSpeciality>): Promise<SubSpeciality> => {
      setLoading(true);
      setError(null);
      try {
        const created = await api.subSpeciality.create(data);
        setSubSpeciality(created);
        return created;
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Erreur lors de la création de la sous-spécialité";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const update = useCallback(
    async (
      id: number,
      data: Partial<SubSpeciality>,
    ): Promise<SubSpeciality> => {
      setLoading(true);
      setError(null);
      try {
        const updated = await api.subSpeciality.update(id, data);
        setSubSpeciality((prev) => (prev && prev.id === id ? updated : prev));
        return updated;
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Erreur lors de la mise à jour de la sous-spécialité";
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
      await api.subSpeciality.delete(id);
      setSubSpeciality((prev) => (prev && prev.id === id ? null : prev));
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Erreur lors de la suppression de la sous-spécialité";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    subSpeciality,
    loading,
    error,
    fetchOne,
    create,
    update,
    remove,
  };
};

export default useSubSpeciality;
