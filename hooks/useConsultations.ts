"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { consultationService } from "@/services/consultationService";
import type { CreateConsultationPayload, UpdateConsultationDto } from "@/types";
import toast from "react-hot-toast";

export const CONSULTATIONS_QUERY_KEY = ["consultations"];
export const PATIENT_CONSULTATIONS_QUERY_KEY = ["patient-consultations"];

export function useConsultations() {
  return useQuery({
    queryKey: CONSULTATIONS_QUERY_KEY,
    queryFn: consultationService.getAll,
  });
}

export function usePatientConsultations(patientId?: number | string) {
  return useQuery({
    queryKey: [...PATIENT_CONSULTATIONS_QUERY_KEY, String(patientId)],
    queryFn: () => consultationService.getByPatientId(patientId!),
    enabled: !!patientId,
  });
}

export function useCreateConsultation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: consultationService.create,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CONSULTATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...PATIENT_CONSULTATIONS_QUERY_KEY, String(variables.patientId)] });
      toast.success("Consultation created successfully");
    },
    onError: () => {
      // Re-throw handled by api-client toast, but we could add custom here if needed
    }
  });
}

export function useUpdateConsultation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: UpdateConsultationDto }) =>
      consultationService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONSULTATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PATIENT_CONSULTATIONS_QUERY_KEY });
      toast.success("Consultation updated successfully");
    },
    onError: () => {
      // Error toast already shown by api-client interceptor
    }
  });
}

export function useDeleteConsultation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: consultationService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONSULTATIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PATIENT_CONSULTATIONS_QUERY_KEY });
      toast.success("Consultation deleted successfully");
    },
    onError: () => {
      // Error toast mapped inside api-client interceptor
    }
  });
}
