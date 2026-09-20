import { useCallback, useState } from "react";
import type { Campus, Organization } from "../interfaces/models.interface";
import type { User } from "../interfaces/user.interface";
import { api } from "../lib/api";

export const useOrganization = () => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizations = useCallback(async (): Promise<Organization[]> => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.organization.fetch();
      setOrganizations(data);
      return data;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Error fetching organizations";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOne = useCallback(
    async (id: string | number): Promise<Organization> => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.organization.fetchOne(id);
        setOrganization(data);
        return data;
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Error fetching organization";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const create = useCallback(
    async (data: Partial<Organization>): Promise<Organization> => {
      setLoading(true);
      setError(null);
      try {
        const created = await api.organization.create(data);
        setOrganizations((prev) => [...prev, created]);
        return created;
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Error creating organization";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const update = useCallback(
    async (id: number, data: Partial<Organization>): Promise<Organization> => {
      setLoading(true);
      setError(null);
      try {
        const updated = await api.organization.update(id, data);
        setOrganizations((prev) => prev.map((o) => (o.id === id ? updated : o)));
        setOrganization((prev) => (prev && prev.id === id ? updated : prev));
        return updated;
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Error updating organization";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const remove = useCallback(async (id: string | number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await api.organization.delete(id);
      const numericId = typeof id === "string" ? parseInt(id, 10) : id;
      setOrganizations((prev) => prev.filter((o) => o.id !== numericId));
      setOrganization((prev) => (prev && prev.id === numericId ? null : prev));
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Error deleting organization";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCampuses = useCallback(
    async (organizationId: number): Promise<Campus[]> => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.organization.fetchCampuses(organizationId);
        setCampuses(data);
        return data;
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Error fetching organization campuses";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchUsers = useCallback(
    async (organizationId: number): Promise<User[]> => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.organization.fetchUsers(organizationId);
        setUsers(data);
        return data;
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Error fetching organization users";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    organization,
    organizations,
    campuses,
    users,
    loading,
    error,
    fetchOrganizations,
    fetchOne,
    create,
    update,
    remove,
    fetchCampuses,
    fetchUsers,
  };
};

export default useOrganization;
