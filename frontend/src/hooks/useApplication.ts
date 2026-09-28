import { useCallback, useState } from "react";
import type { Application, Appointment } from "../interfaces/models.interface";
import { api } from "../lib/api";

export const useApplication = () => {
  const [application, setApplication] = useState<Application | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOne = useCallback(async (id: number): Promise<Application> => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.application.fetchOne(id);
      setApplication(data);
      return data;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Error fetching application";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(
    async (data: Partial<Application>): Promise<Application> => {
      setLoading(true);
      setError(null);
      try {
        const created = await api.application.create(data);
        setApplication(created);
        return created;
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Error creating application";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const update = useCallback(
    async (id: number, data: Partial<Application>): Promise<Application> => {
      setLoading(true);
      setError(null);
      try {
        const updated = await api.application.update(id, data);
        setApplication((prev) => (prev && prev.id === id ? updated : prev));
        return updated;
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Error updating application";
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
      await api.application.delete(id);
      setApplication((prev) => (prev && prev.id === id ? null : prev));
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Error deleting application";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAppointments = useCallback(
    async (applicationId: number): Promise<Appointment[]> => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.application.fetchAppointments(applicationId);
        setAppointments(data);
        return data;
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Error fetching user appointments";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    application,
    appointments,
    loading,
    error,
    fetchOne,
    create,
    update,
    remove,
    fetchAppointments
  };
};

export default useApplication;
