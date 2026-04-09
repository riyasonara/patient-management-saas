import { api } from "@/lib/api-client";
import type { Consultation, CreateConsultationPayload, UpdateConsultationDto } from "@/types";

export const consultationService = {
  getAll: () => api.get<Consultation[]>("/consultations"),
  getByPatientId: (patientId: number | string) => api.get<Consultation[]>(`/consultations/patient/${patientId}`),
  create: (data: CreateConsultationPayload) => api.post<Consultation>("/consultations", data),
  update: (id: number | string, data: UpdateConsultationDto) => api.put<Consultation>(`/consultations/${id}`, data),
  delete: (id: number | string) => api.delete<void>(`/consultations/${id}`),
};
