// ============================================================
// Centralized API service — Axios instance + typed helpers
// ============================================================
import axios from "axios";
import type {
  Patient,
  CreatePatientPayload,
  UpdatePatientDto,
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
  const { data } = await api.get<Patient[]>("/Patient");
  return data;
}

export async function getPatient(id: number | string): Promise<Patient> {
  const { data } = await api.get<Patient[]>("/Patient");
  const patient = data.find(p => p.id === Number(id));
  if (!patient) throw new Error("Patient not found");
  return patient;
}

export async function createPatient(
  payload: CreatePatientPayload
): Promise<Patient> {
  const { data } = await api.post<Patient>("/Patient", payload);
  return data;
}

export async function updatePatient(
  id: number | string,
  payload: UpdatePatientDto
): Promise<Patient> {
  const { data } = await api.put<Patient>(`/Patient/${id}`, payload);
  return data;
}

export async function deletePatient(id: number | string): Promise<void> {
  await api.delete(`/Patient/${id}`);
}



export default api;
