"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import type { Consultation } from "@/types";
import { useDeleteConsultation } from "@/hooks/useConsultations";
import { usePatients } from "@/hooks/usePatients";

interface ConsultationListProps {
  consultations: Consultation[];
  onEdit: (consultation: Consultation) => void;
}

export default function ConsultationList({
  consultations,
  onEdit,
}: ConsultationListProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const deleteMutation = useDeleteConsultation();
  const { data: patients } = usePatients();

  if (!consultations?.length) {
    return (
      <EmptyState
        title="No consultations found"
        message="There are no consultations matching your criteria."
      />
    );
  }

  const handleDelete = () => {
    if (deleteId !== null) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => setDeleteId(null),
      });
    }
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Date</TableHeaderCell>
            <TableHeaderCell>Patient</TableHeaderCell>
            <TableHeaderCell>Diagnosis</TableHeaderCell>
            <TableHeaderCell>Notes</TableHeaderCell>
            <TableHeaderCell className="text-right">Actions</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {consultations.map((consultation) => {
            const patient = patients?.find((p) => p.id === consultation.patientId);
            return (
              <TableRow key={consultation.id}>
                <TableCell className="font-medium">
                  {new Date(consultation.consultationDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {patient ? patient.name : `ID: ${consultation.patientId}`}
                </TableCell>
                <TableCell>
                  <span className="font-medium text-text-primary">
                    {consultation.diagnosis}
                  </span>
                </TableCell>
                <TableCell>
                  <p className="line-clamp-2 max-w-xs text-sm text-text-secondary">
                    {consultation.notes}
                  </p>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(consultation)}
                    >
                      <IconEdit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setDeleteId(consultation.id)}
                    >
                      <IconTrash className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Modal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="Delete Consultation"
      >
        <div className="py-4">
          <p className="text-text-secondary mb-6">
            Are you sure you want to delete this consultation? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={deleteMutation.isPending}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
