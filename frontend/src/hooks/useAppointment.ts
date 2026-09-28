import { useCallback, useState } from "react";
import type { Appointment } from "../interfaces/models.interface";
import { api } from "../lib/api";

export const useAppointment = () => {
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOne = useCallback(async (id: number): Promise<Appointment> => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.appointment.fetchOne(id);
      setAppointment(data);
      return data;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Error fetching appointment";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(
    async (data: Partial<Appointment>): Promise<Appointment> => {
      setLoading(true);
      setError(null);
      try {
        const created = await api.appointment.create(data);
        setAppointment(created);
        return created;
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Error creating appointment";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const update = useCallback(
    async (id: number, data: Partial<Appointment>): Promise<Appointment> => {
      setLoading(true);
      setError(null);
      try {
        const updated = await api.appointment.update(id, data);
        setAppointment((prev) => (prev && prev.id === id ? updated : prev));
        return updated;
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Error updating appointment";
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
      await api.appointment.delete(id);
      setAppointment((prev) => (prev && prev.id === id ? null : prev));
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Error deleting appointment";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    appointment,
    loading,
    error,
    fetchOne,
    create,
    update,
    remove,
  };
};

export default useAppointment;
