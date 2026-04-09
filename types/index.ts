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
  gender: string;
  email?: string;
  disease?: string;
  bloodGroup?: string;
  phoneNumber?: string;
  createdAt: string;
}

/** Payload for creating a new patient */
export interface CreatePatientPayload {
  name: string;
  age: number;
  gender: string;
  email?: string;
  disease?: string;
  bloodGroup?: string;
  phoneNumber?: string;
}

/** Payload for updating an existing patient */
export interface UpdatePatientDto {
  name?: string;
  age?: number;
  gender?: string;
  email?: string;
  disease?: string;
  bloodGroup?: string;
  phoneNumber?: string;
}

/** Consultation entity */
export interface Consultation {
  id: number;
  patientId: number;
  diagnosis: string;
  notes: string;
  prescription?: string;
  consultationDate: string;
  createdAt?: string;
}

/** Payload for creating a new consultation */
export interface CreateConsultationPayload {
  patientId: number;
  diagnosis: string;
  notes: string;
  prescription?: string;
  consultationDate: string;
}

/** Payload for updating an existing consultation */
export interface UpdateConsultationDto {
  patientId?: number;
  diagnosis?: string;
  notes?: string;
  prescription?: string;
  consultationDate?: string;
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
