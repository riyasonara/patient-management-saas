"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import {
  IconArrowLeft,
  IconEdit,
  IconPlus,
  IconStethoscope,
  IconCalendarEvent,
  IconUser,
} from "@tabler/icons-react";
import toast from "react-hot-toast";

import { usePatient } from "@/hooks/usePatient";
import { usePatientConsultations } from "@/hooks/useConsultations";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge, { genderBadgeVariant } from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { Skeleton, Spinner } from "@/components/ui/Loader";
import { formatDate } from "@/lib/utils";
import ConsultationList from "@/components/consultations/ConsultationList";
import ConsultationForm from "@/components/consultations/ConsultationForm";
import type { Consultation } from "@/types";

export default function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const patientIdNum = Number(id);
  const { patient, loading: patientLoading, error: patientError } = usePatient(id);
  const {
    data: consultationsData,
    isLoading: consultationsLoading,
  } = usePatientConsultations(id);

  const consultations = consultationsData || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [editingConsultation, setEditingConsultation] = useState<Consultation | undefined>(undefined);

  const handleEdit = (c: Consultation) => {
    setEditingConsultation(c);
    setModalOpen(true);
  };

  const handleCloseForm = () => {
    setModalOpen(false);
    setEditingConsultation(undefined);
  };

  if (patientLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 py-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-64 mb-2" />
        <div className="rounded-2xl border border-border bg-surface p-8 space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (patientError || !patient) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in py-4">
        <Link
          href="/patients"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted hover:text-brand-600 transition-colors"
        >
          <IconArrowLeft className="h-4 w-4" stroke={2.5} />
          Back to Directory
        </Link>
        <Card className="border-danger/20 bg-danger-muted p-6">
          <p className="text-sm font-medium text-danger">
            {patientError || "Patient not found"}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in py-4">
      {/* Back link */}
      <Link
        href="/patients"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted hover:text-brand-600 transition-colors"
      >
        <IconArrowLeft className="h-4 w-4" stroke={2.5} />
        Back to Directory
      </Link>

      {/* Patient info card */}
      <Card className="overflow-hidden border border-border/80 shadow-soft">
        <CardContent className="p-0">
          <div className="bg-gradient-subtle p-8 border-b border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-3xl font-bold text-brand-600 shadow-softer ring-1 ring-border">
                {patient.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text-primary tracking-tight">
                  {patient.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mt-3">
                  <Badge variant={genderBadgeVariant(patient.gender as any)}>
                     {patient.gender}
                   </Badge>
                  {patient.bloodGroup && (
                    <Badge variant="default" className="text-brand-600 border-brand-200 bg-brand-50">
                      {patient.bloodGroup}
                    </Badge>
                  )}
                  <span className="text-sm font-medium text-text-secondary flex items-center gap-1.5 bg-surface/60 px-2 py-1 rounded-md border border-border/50">
                    <IconUser className="h-4 w-4 text-brand-500" />
                    {patient.age} years old
                  </span>
                  {patient.disease && (
                    <span className="text-sm font-medium text-danger flex items-center gap-1.5 bg-danger-muted px-2 py-1 rounded-md border border-danger/20">
                      <IconStethoscope className="h-4 w-4 text-danger" />
                      {patient.disease}
                    </span>
                  )}
                  {patient.phoneNumber && (
                    <span className="text-sm font-medium text-text-secondary flex items-center gap-1.5 bg-surface/60 px-2 py-1 rounded-md border border-border/50">
                      Tel: {patient.phoneNumber}
                    </span>
                  )}
                  {patient.email && (
                    <span className="text-sm font-medium text-text-secondary flex items-center gap-1.5 bg-surface/60 px-2 py-1 rounded-md border border-border/50">
                      Email: {patient.email}
                    </span>
                  )}
                  {patient.createdAt && (
                    <span className="text-sm font-medium text-text-secondary flex items-center gap-1.5 bg-surface/60 px-2 py-1 rounded-md border border-border/50">
                      <IconCalendarEvent className="h-4 w-4 text-brand-500" />
                      Added {formatDate(patient.createdAt)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex shrink-0 gap-3">
              <Link href={`/patients/${id}/edit`}>
                <Button
                  variant="outline"
                  icon={<IconEdit className="h-4 w-4" />}
                >
                  Edit Patient
                </Button>
              </Link>
              <Button
                variant="primary"
                icon={<IconPlus className="h-4 w-4" stroke={2.5} />}
                onClick={() => {
                  setEditingConsultation(undefined);
                  setModalOpen(true);
                }}
              >
                New Record
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consultation history */}
      <Card className="border border-border/80 shadow-soft overflow-hidden">
        <CardHeader className="bg-surface">
          <CardTitle className="flex items-center gap-2">
             <IconStethoscope className="h-5 w-5 text-brand-500" />
             Consultation Records
          </CardTitle>
          <span className="text-sm font-medium text-text-muted bg-surface-hover px-2.5 py-0.5 rounded-full">
            {consultations.length} record{consultations.length !== 1 ? "s" : ""}
          </span>
        </CardHeader>
        <CardContent className="p-0 border-t border-border">
          {consultationsLoading ? (
            <div className="flex justify-center py-12">
               <Spinner />
            </div>
          ) : (
             <ConsultationList consultations={consultations} onEdit={handleEdit} />
          )}
        </CardContent>
      </Card>

      {/* Add / Edit consultation modal */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseForm}
        title={editingConsultation ? "Edit Record" : "Record New Consultation"}
      >
         <ConsultationForm
           fixedPatientId={patientIdNum}
           consultationToEdit={editingConsultation}
           onSuccess={handleCloseForm}
           onCancel={handleCloseForm}
         />
      </Modal>
    </div>
  );
}
