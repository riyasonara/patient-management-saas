"use client";

import React, { useState } from "react";
import { useConsultations, usePatientConsultations } from "@/hooks/useConsultations";
import { usePatients } from "@/hooks/usePatients";
import ConsultationList from "@/components/consultations/ConsultationList";
import ConsultationForm from "@/components/consultations/ConsultationForm";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/Loader";
import { IconPlus, IconFilter } from "@tabler/icons-react";
import type { Consultation } from "@/types";

export default function ConsultationsPage() {
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingConsultation, setEditingConsultation] = useState<Consultation | undefined>(undefined);

  const { data: allConsultations, isLoading: isLoadingAll } = useConsultations();
  const { data: patientConsultations, isLoading: isLoadingPatient } = usePatientConsultations(
    selectedPatientId ? Number(selectedPatientId) : undefined
  );
  const { data: patients } = usePatients();

  const handleEdit = (consultation: Consultation) => {
    setEditingConsultation(consultation);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingConsultation(undefined);
  };

  const consultations = selectedPatientId ? patientConsultations : allConsultations;
  const isLoading = selectedPatientId ? isLoadingPatient : isLoadingAll;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            Consultations
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage patient consultations, diagnosis, and prescriptions.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-text-muted">
              <IconFilter className="w-4 h-4" />
            </div>
            <select
              className="w-full pl-10 pr-4 py-2 border border-border rounded-xl bg-surface text-sm focus-ring shadow-sm appearance-none cursor-pointer"
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
            >
              <option value="">All Patients</option>
              {patients?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              setEditingConsultation(undefined);
              setIsFormOpen(true);
            }}
            className="shrink-0"
          >
            <IconPlus className="w-4 h-4 mr-2" />
            New
          </Button>
        </div>
      </div>

      <div className="animate-fade-in">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" />
          </div>
        ) : (
          <ConsultationList
            consultations={consultations || []}
            onEdit={handleEdit}
          />
        )}
      </div>

      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingConsultation ? "Edit Consultation" : "New Consultation"}
      >
        <ConsultationForm
          consultationToEdit={editingConsultation}
          onSuccess={handleCloseForm}
          onCancel={handleCloseForm}
        />
      </Modal>
    </div>
  );
}
