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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

import { usePatient } from "@/hooks/usePatient";
import { useConsultations } from "@/hooks/useConsultations";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge, { genderBadgeVariant } from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import FormInput from "@/components/ui/FormInput";
import FormTextarea from "@/components/ui/FormTextarea";
import EmptyState from "@/components/ui/EmptyState";
import { Skeleton, Spinner } from "@/components/ui/Loader";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from "@/components/ui/Table";
import { createConsultation } from "@/lib/api";
import { formatDate, toDateInputValue } from "@/lib/utils";

// ── Consultation form schema ──────────────────────────────
const consultationSchema = z.object({
  date: z.string().min(1, "Date is required"),
  notes: z.string().min(2, "Notes must be at least 2 characters"),
  doctorName: z.string().min(2, "Doctor name is required"),
});

type ConsultationFormValues = z.infer<typeof consultationSchema>;

export default function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { patient, loading: patientLoading, error: patientError } = usePatient(id);
  const {
    consultations,
    loading: consultationsLoading,
    refetch: refetchConsultations,
  } = useConsultations(id);

  const [modalOpen, setModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      date: toDateInputValue(new Date().toISOString()),
      notes: "",
      doctorName: "",
    },
  });

  const onSubmitConsultation = async (data: ConsultationFormValues) => {
    try {
      await createConsultation({
        patientId: Number(id),
        date: data.date,
        notes: data.notes,
        doctorName: data.doctorName,
      });
      toast.success("Consultation added successfully!");
      setModalOpen(false);
      reset();
      refetchConsultations();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to add consultation"
      );
    }
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
                  <Badge variant={genderBadgeVariant(patient.gender)}>
                    {patient.gender}
                  </Badge>
                  <span className="text-sm font-medium text-text-secondary flex items-center gap-1.5 bg-surface/60 px-2 py-1 rounded-md border border-border/50">
                    <IconUser className="h-4 w-4 text-brand-500" />
                    {patient.age} years old
                  </span>
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
                onClick={() => setModalOpen(true)}
              >
                New Record
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consultation history */}
      <Card className="border border-border/80 shadow-soft">
        <CardHeader className="bg-surface">
          <CardTitle className="flex items-center gap-2">
             <IconStethoscope className="h-5 w-5 text-brand-500" />
             Consultation Records
          </CardTitle>
          <span className="text-sm font-medium text-text-muted bg-surface-hover px-2.5 py-0.5 rounded-full">
            {consultations.length} record{consultations.length !== 1 ? "s" : ""}
          </span>
        </CardHeader>
        
        <CardContent className="p-0">
          {consultationsLoading ? (
             <div className="flex justify-center py-12">
                <Spinner />
             </div>
          ) : consultations.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="No medical records found"
                message="This patient does not have any recorded consultations yet."
                icon={<IconStethoscope className="h-8 w-8 opacity-70" />}
                action={
                  <Button
                    onClick={() => setModalOpen(true)}
                    icon={<IconPlus className="h-4 w-4" />}
                  >
                    Add First Record
                  </Button>
                }
              />
            </div>
          ) : (
             <Table className="border-none shadow-none rounded-none rounded-b-2xl">
                <TableHead>
                   <TableRow>
                      <TableHeaderCell>Date</TableHeaderCell>
                      <TableHeaderCell>Attending Doctor</TableHeaderCell>
                      <TableHeaderCell>Clinical Notes</TableHeaderCell>
                   </TableRow>
                </TableHead>
                <TableBody>
                   {consultations.map((c) => (
                      <TableRow key={c.id}>
                         <TableCell className="w-1/5">
                            <span className="inline-flex items-center gap-1.5 font-medium text-text-secondary bg-surface-hover/50 px-2 py-1 rounded-md">
                               <IconCalendarEvent className="h-4 w-4 text-text-muted" />
                               {formatDate(c.date)}
                            </span>
                         </TableCell>
                         <TableCell className="w-1/4 font-semibold text-text-primary">
                            Dr. {c.doctorName.replace(/^Dr\.?\s*/i, "")}
                         </TableCell>
                         <TableCell>
                            <p className="text-text-secondary leading-relaxed bg-surface/50 border border-border/40 p-3 rounded-xl shadow-inner text-sm">
                              {c.notes}
                            </p>
                         </TableCell>
                      </TableRow>
                   ))}
                </TableBody>
             </Table>
          )}
        </CardContent>
      </Card>

      {/* Add consultation modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Record New Consultation"
      >
        <form
          onSubmit={handleSubmit(onSubmitConsultation)}
          className="space-y-5 py-2"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
             <FormInput
               label="Date"
               type="date"
               error={errors.date?.message}
               registration={register("date")}
             />
             <FormInput
               label="Attending Doctor"
               placeholder="Dr. Name"
               error={errors.doctorName?.message}
               registration={register("doctorName")}
             />
          </div>
          <FormTextarea
            label="Clinical Notes"
            placeholder="Detailed observations and prescriptions..."
            error={errors.notes?.message}
            registration={register("notes")}
            className="min-h-[120px]"
          />
          <div className="flex items-center gap-3 pt-3 border-t border-border mt-4">
            <Button type="submit" isLoading={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? "Saving record…" : "Save Record"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
               className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
