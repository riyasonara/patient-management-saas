"use client";

import { useState, useEffect, useCallback } from "react";
import { getConsultations } from "@/lib/api";
import type { Consultation } from "@/types";

export function useConsultations(patientId: number | string) {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConsultations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getConsultations(patientId);
      setConsultations(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch consultations"
      );
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  return { consultations, loading, error, refetch: fetchConsultations };
}
