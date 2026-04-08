"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { IconArrowLeft, IconUserPlus } from "@tabler/icons-react";
import Link from "next/link";

import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import { createPatient } from "@/lib/api";

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

export default function CreatePatientPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: "",
      age: undefined,
      gender: undefined,
    },
  });

  const onSubmit = async (data: PatientFormValues) => {
    try {
      await createPatient(data);
      toast.success("Patient created successfully!");
      router.push("/patients");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create patient"
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in py-4">
      {/* Back link */}
      <Link
        href="/patients"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted hover:text-brand-600 transition-colors"
      >
        <IconArrowLeft className="h-4 w-4" stroke={2.5} />
        Back to Directory
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">
          Register Patient
        </h1>
        <p className="text-text-secondary mt-1.5 font-medium">
          Fill in the details below to add a new patient to the system.
        </p>
      </div>

      {/* Form */}
      <Card className="border border-border/80 shadow-soft">
        <CardHeader className="bg-surface-hover/30">
          <CardTitle className="flex items-center gap-2 text-brand-600">
             <IconUserPlus className="h-5 w-5" />
             Patient Information
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

            <div className="flex items-center gap-3 pt-4 border-t border-border/50 mt-8">
              <Button type="submit" isLoading={isSubmitting} size="lg" className="w-full sm:w-auto">
                {isSubmitting ? "Registering…" : "Register Patient"}
              </Button>
              <Link href="/patients" className="w-full sm:w-auto">
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
