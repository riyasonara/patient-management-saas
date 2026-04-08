"use client";

import { useState, useEffect, useCallback } from "react";
import { getPatient } from "@/lib/api";
import type { Patient } from "@/types";

export function usePatient(id: number | string) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatient = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPatient(id);
      setPatient(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch patient"
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPatient();
  }, [fetchPatient]);

  return { patient, loading, error, refetch: fetchPatient };
}
