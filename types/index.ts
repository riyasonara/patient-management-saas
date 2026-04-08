// ============================================================
// Patient Management System — TypeScript Type Definitions
// ============================================================

/** Gender options for a patient */
export type Gender = "Male" | "Female" | "Other";

/** Core patient entity returned from / sent to the API */
export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: Gender;
  createdAt?: string;
}

/** Payload for creating a new patient (id is server-generated) */
export interface CreatePatientPayload {
  name: string;
  age: number;
  gender: Gender;
}

/** Payload for updating an existing patient */
export interface UpdatePatientPayload {
  name: string;
  age: number;
  gender: Gender;
}

/** Consultation entity */
export interface Consultation {
  id: number;
  patientId: number;
  date: string;
  notes: string;
  doctorName: string;
  createdAt?: string;
}

/** Payload for creating a new consultation */
export interface CreateConsultationPayload {
  patientId: number;
  date: string;
  notes: string;
  doctorName: string;
}

/** Generic API response wrapper */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/** Paginated list response */
export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
