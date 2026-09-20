import { useCallback, useState } from "react";
import type { Media } from "../interfaces/models.interface";
import { api } from "../lib/api";

export const useMedia = () => {
  const [media, setMedia] = useState<Media | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOne = useCallback(async (id: number): Promise<Media> => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.media.fetchOne(id);
      setMedia(data);
      return data;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Erreur lors de la récupération du média";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(
    async (data: Partial<Media> | FormData): Promise<Media> => {
      setLoading(true);
      setError(null);
      try {
        const created = await api.media.create(data);
        setMedia(created);
        return created;
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Erreur lors de la création du média";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const update = useCallback(
    async (id: number, data: Partial<Media>): Promise<Media> => {
      setLoading(true);
      setError(null);
      try {
        const updated = await api.media.update(id, data);
        setMedia((prev) => (prev && prev.id === id ? updated : prev));
        return updated;
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Erreur lors de la mise à jour du média";
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
      await api.media.delete(id);
      setMedia((prev) => (prev && prev.id === id ? null : prev));
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Erreur lors de la suppression du média";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    media,
    loading,
    error,
    fetchOne,
    create,
    update,
    remove,
  };
};

export default useMedia;
