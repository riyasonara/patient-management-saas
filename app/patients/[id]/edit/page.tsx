"use client";

import React, { useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { IconArrowLeft, IconEditCircle } from "@tabler/icons-react";

import { usePatient } from "@/hooks/usePatient";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import { Skeleton } from "@/components/ui/Loader";
import { updatePatient } from "@/lib/api";

const patientSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be 100 characters or less"),
  age: z
    .number()
    .int("Age must be a whole number")
    .min(0, "Age must be 0 or greater")
    .max(150, "Age must be 150 or less"),
  gender: z.enum(["Male", "Female", "Other"], {
    message: "Please select a gender",
  }),
});

type PatientFormValues = z.infer<typeof patientSchema>;

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

export default function EditPatientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { patient, loading, error } = usePatient(id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
  });

  useEffect(() => {
    if (patient) {
      reset({
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
      });
    }
  }, [patient, reset]);

  const onSubmit = async (data: PatientFormValues) => {
    try {
      await updatePatient(id, data);
      toast.success("Patient updated successfully!");
      router.push(`/patients/${id}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update patient"
      );
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 py-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-48 mb-2" />
        <div className="rounded-2xl border border-border bg-surface p-8 space-y-6">
          <Skeleton className="h-14 w-full rounded-xl" />
          <div className="grid grid-cols-2 gap-6">
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
          <Skeleton className="h-12 w-36 rounded-xl mt-4" />
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in py-4">
        <Link
          href="/patients"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted hover:text-brand-600 transition-colors"
        >
          <IconArrowLeft className="h-4 w-4" stroke={2.5} />
          Back to Directory
        </Link>
        <Card className="border-danger/20 bg-danger-muted p-6">
          <p className="text-sm font-medium text-danger">
            {error || "Patient not found"}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in py-4">
      {/* Back link */}
      <Link
        href={`/patients/${id}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted hover:text-brand-600 transition-colors"
      >
        <IconArrowLeft className="h-4 w-4" stroke={2.5} />
        Back to Patient Profile
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">Edit Profile</h1>
        <p className="text-text-secondary mt-1.5 font-medium">
          Update the personal information for {patient.name}.
        </p>
      </div>

      {/* Form */}
      <Card className="border border-border/80 shadow-soft">
        <CardHeader className="bg-surface-hover/30">
          <CardTitle className="flex items-center gap-2 text-brand-600">
             <IconEditCircle className="h-5 w-5" />
             Profile Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormInput
              label="Full Name"
              placeholder="e.g. Jane Doe"
              error={errors.name?.message}
              registration={register("name")}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <FormInput
                 label="Age"
                 type="number"
                 placeholder="e.g. 34"
                 error={errors.age?.message}
                 registration={register("age", { valueAsNumber: true })}
               />

               <FormSelect
                 label="Gender"
                 options={genderOptions}
                 placeholder="Select gender"
                 error={errors.gender?.message}
                 registration={register("gender")}
               />
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-border mt-8">
              <Button type="submit" isLoading={isSubmitting} size="lg" className="w-full sm:w-auto">
                {isSubmitting ? "Saving changes…" : "Save Changes"}
              </Button>
              <Link href={`/patients/${id}`} className="w-full sm:w-auto">
                <Button type="button" variant="outline" size="lg" className="w-full">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
