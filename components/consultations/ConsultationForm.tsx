"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import FormTextarea from "@/components/ui/FormTextarea";
import Button from "@/components/ui/Button";
import { usePatients } from "@/hooks/usePatients";
import {
  useCreateConsultation,
  useUpdateConsultation,
} from "@/hooks/useConsultations";
import type { Consultation } from "@/types";

const consultationSchema = z.object({
  patientId: z.union([z.string(), z.number()]).refine(
    (val) => Number(val) >= 1,
    "Patient is required"
  ),
  diagnosis: z.string().min(2, "Diagnosis must be at least 2 characters"),
  notes: z.string().min(2, "Notes must be at least 2 characters"),
  prescription: z.string().optional(),
  consultationDate: z.string().min(1, "Consultation Date is required"),
});

type ConsultationFormValues = z.infer<typeof consultationSchema>;

interface ConsultationFormProps {
  consultationToEdit?: Consultation;
  fixedPatientId?: number; // If opening from a patient's detail view
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ConsultationForm({
  consultationToEdit,
  fixedPatientId,
  onSuccess,
  onCancel,
}: ConsultationFormProps) {
  const isEditing = !!consultationToEdit;

  const { data: patients } = usePatients();
  const createMutation = useCreateConsultation();
  const updateMutation = useUpdateConsultation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      patientId: fixedPatientId ? String(fixedPatientId) : "",
      diagnosis: "",
      notes: "",
      prescription: "",
      consultationDate: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    if (consultationToEdit) {
      reset({
        patientId: String(consultationToEdit.patientId),
        diagnosis: consultationToEdit.diagnosis,
        notes: consultationToEdit.notes,
        prescription: consultationToEdit.prescription || "",
        consultationDate: consultationToEdit.consultationDate.split("T")[0],
      });
    }
  }, [consultationToEdit, reset]);

  const onSubmit = (data: ConsultationFormValues) => {
    const payload = {
      ...data,
      patientId: Number(data.patientId),
    };

    if (isEditing) {
      updateMutation.mutate(
        { id: consultationToEdit!.id, data: payload },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          onSuccess?.();
          if (!fixedPatientId) {
             reset();
          }
        },
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const patientOptions =
    patients?.map((p) => ({
      value: p.id.toString(),
      label: p.name,
    })) || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormSelect
          label="Patient"
          options={patientOptions}
          registration={register("patientId")}
          error={errors.patientId?.message}
          disabled={!!fixedPatientId || isEditing}
        />

        <FormInput
          label="Consultation Date"
          type="date"
          registration={register("consultationDate")}
          error={errors.consultationDate?.message}
        />
      </div>

      <FormInput
        label="Diagnosis"
        type="text"
        placeholder="Enter diagnosis"
        registration={register("diagnosis")}
        error={errors.diagnosis?.message}
      />

      <FormTextarea
        label="Consultation Notes"
        placeholder="Enter detailed notes..."
        registration={register("notes")}
        error={errors.notes?.message}
        rows={4}
      />

      <FormTextarea
        label="Prescription (Optional)"
        placeholder="Enter prescribed medications..."
        registration={register("prescription")}
        error={errors.prescription?.message}
        rows={3}
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          isLoading={isPending}
          disabled={isPending}
        >
          {isEditing ? "Update Consultation" : "Save Consultation"}
        </Button>
      </div>
    </form>
  );
}
