// ============================================================
// Centralized API service — Axios instance + typed helpers
// ============================================================
import axios from "axios";
import type {
  Patient,
  CreatePatientPayload,
  UpdatePatientPayload,
  Consultation,
  CreateConsultationPayload,
} from "@/types";

// ── Axios instance ──────────────────────────────────────────
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://localhost:7001/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

// Request interceptor (e.g. attach auth token in the future)
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor — unwrap data, normalise errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.title ||
      error.message ||
      "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

// ── Patient endpoints ───────────────────────────────────────

export async function getPatients(): Promise<Patient[]> {
  const { data } = await api.get<Patient[]>("/patients");
  return data;
}

export async function getPatient(id: number | string): Promise<Patient> {
  const { data } = await api.get<Patient>(`/patients/${id}`);
  return data;
}

export async function createPatient(
  payload: CreatePatientPayload
): Promise<Patient> {
  const { data } = await api.post<Patient>("/patients", payload);
  return data;
}

export async function updatePatient(
  id: number | string,
  payload: UpdatePatientPayload
): Promise<Patient> {
  const { data } = await api.put<Patient>(`/patients/${id}`, payload);
  return data;
}

export async function deletePatient(id: number | string): Promise<void> {
  await api.delete(`/patients/${id}`);
}

// ── Consultation endpoints ──────────────────────────────────

export async function getConsultations(
  patientId: number | string
): Promise<Consultation[]> {
  const { data } = await api.get<Consultation[]>(
    `/consultations/${patientId}`
  );
  return data;
}

export async function createConsultation(
  payload: CreateConsultationPayload
): Promise<Consultation> {
  const { data } = await api.post<Consultation>("/consultations", payload);
  return data;
}

export default api;
