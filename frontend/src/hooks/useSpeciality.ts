import { useCallback, useState } from "react";
import type { Speciality, SubSpeciality } from "../interfaces/models.interface";
import { api } from "../lib/api";

export const useSpeciality = () => {
  const [speciality, setSpeciality] = useState<Speciality | null>(null);
  const [subSpecialities, setSubSpecialities] = useState<SubSpeciality[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOne = useCallback(async (id: number): Promise<Speciality> => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.speciality.fetchOne(id);
      setSpeciality(data);
      return data;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Erreur lors de la récupération de la spécialité";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(
    async (data: Partial<Speciality>): Promise<Speciality> => {
      setLoading(true);
      setError(null);
      try {
        const created = await api.speciality.create(data);
        setSpeciality(created);
        return created;
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Erreur lors de la création de la spécialité";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const update = useCallback(
    async (id: number, data: Partial<Speciality>): Promise<Speciality> => {
      setLoading(true);
      setError(null);
      try {
        const updated = await api.speciality.update(id, data);
        setSpeciality((prev) => (prev && prev.id === id ? updated : prev));
        return updated;
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Erreur lors de la mise à jour de la spécialité";
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
      await api.speciality.delete(id);
      setSpeciality((prev) => (prev && prev.id === id ? null : prev));
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Erreur lors de la suppression de la spécialité";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSubSpecialities = useCallback(
    async (specialityId: number): Promise<SubSpeciality[]> => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.speciality.fetchSubSpecialities(specialityId);
        setSubSpecialities(data);
        return data;
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Erreur lors de la récupération des sous-spécialités de la spécialité";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    speciality,
    subSpecialities,
    loading,
    error,
    fetchOne,
    create,
    update,
    remove,
    fetchSubSpecialities,
  };
};

export default useSpeciality;
