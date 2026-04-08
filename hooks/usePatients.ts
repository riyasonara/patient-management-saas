"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { getPatients } from "@/lib/api";
import type { Patient } from "@/types";

const PAGE_SIZE = 8;

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Client-side search filtering
  const filtered = useMemo(() => {
    if (!search.trim()) return patients;
    const q = search.toLowerCase();
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.gender.toLowerCase().includes(q) ||
        String(p.age).includes(q)
    );
  }, [patients, search]);

  // Client-side pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  return {
    patients: paginated,
    allPatients: patients,
    totalCount: filtered.length,
    loading,
    error,
    search,
    setSearch: (val: string) => {
      setSearch(val);
      setPage(1);
    },
    page: safePage,
    setPage,
    totalPages,
    refetch: fetchPatients,
  };
}
