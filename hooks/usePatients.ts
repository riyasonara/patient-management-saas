"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Patient, CreatePatientPayload, UpdatePatientDto } from "@/types";
import toast from "react-hot-toast";

const PATIENTS_QUERY_KEY = ["patients"];

// API Service functions for Patients
export const patientService = {
  getAll: () => api.get<Patient[]>("/Patient"),
  getById: async (id: number | string) => {
    const patients = await api.get<Patient[]>("/Patient");
    const patient = patients.find(p => p.id === Number(id));
    if (!patient) throw new Error("Patient not found");
    return patient;
  },
  create: (data: CreatePatientPayload) => api.post<Patient>("/Patient", data),
  update: (id: number | string, data: UpdatePatientDto) => api.put<Patient>(`/Patient/${id}`, data),
  delete: (id: number | string) => api.delete<void>(`/Patient/${id}`),
};

// Hooks
export function usePatients() {
  return useQuery({
    queryKey: PATIENTS_QUERY_KEY,
    queryFn: patientService.getAll,
  });
}

export function usePatient(id: number | string) {
  return useQuery({
    queryKey: [...PATIENTS_QUERY_KEY, id],
    queryFn: () => patientService.getById(id),
    enabled: !!id,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patientService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PATIENTS_QUERY_KEY });
    },
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: UpdatePatientDto }) =>
      patientService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PATIENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...PATIENTS_QUERY_KEY, variables.id] });
    },
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patientService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PATIENTS_QUERY_KEY });
      toast.success("Patient deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete patient");
    }
  });
}
