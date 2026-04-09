"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IconArrowLeft, IconUserPlus } from "@tabler/icons-react";
import Link from "next/link";

import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import { useCreatePatient } from "@/hooks/usePatients";
import toast from "react-hot-toast";

const patientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Too long"),
  age: z.number({ message: "age is required" }).int().min(0, "Invalid age").max(150, "Invalid age"),
  gender: z.string().min(1, "Please select a gender"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  disease: z.string().min(1, "Disease / Condition is required"),
  bloodGroup: z.string().optional(),
  phoneNumber: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientSchema>;

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Other", label: "Other" },
];

export default function CreatePatientPage() {
  const router = useRouter();
  const createMutation = useCreatePatient();

  const { register, handleSubmit, formState: { errors } } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
  });

  const onSubmit = (data: PatientFormValues) => {
    // optional fields can be empty string, cast them to undefined or send them
    createMutation.mutate(data as any, {
      onSuccess: () => {
        toast.success("Patient registered successfully!");
        router.push("/patients");
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in py-4">
      <Link href="/patients" className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted hover:text-brand-600 transition-colors">
        <IconArrowLeft className="h-4 w-4" stroke={2.5} /> Back to Directory
      </Link>
      <div>
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">Register Patient</h1>
        <p className="text-text-secondary mt-1.5 font-medium">Fill in the details below to add a new patient to the system.</p>
      </div>

      <Card className="border border-border/80 shadow-soft">
        <CardHeader className="bg-surface-hover/30">
          <CardTitle className="flex items-center gap-2 text-brand-600">
             <IconUserPlus className="h-5 w-5" /> Patient Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormInput label="Full Name *" placeholder="e.g. Jane Doe" error={errors.name?.message} registration={register("name")} />
              <FormInput label="Age *" type="number" placeholder="e.g. 34" error={errors.age?.message} registration={register("age", { valueAsNumber: true })} />
              <FormSelect label="Gender *" options={genderOptions} placeholder="Select gender" error={errors.gender?.message} registration={register("gender")} />
              <FormInput label="Blood Group" placeholder="e.g. O+" error={errors.bloodGroup?.message} registration={register("bloodGroup")} />
              <FormInput label="Phone Number" placeholder="e.g. 123-456-7890" error={errors.phoneNumber?.message} registration={register("phoneNumber")} />
              <FormInput label="Email Address *" type="email" placeholder="e.g. jane@example.com" error={errors.email?.message} registration={register("email")} />
              <div className="sm:col-span-2">
                <FormInput label="Disease / Condition *" placeholder="e.g. Hypertension" error={errors.disease?.message} registration={register("disease")} />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-border/50 mt-8">
              <Button type="submit" isLoading={createMutation.isPending} size="lg" className="w-full sm:w-auto">
                {createMutation.isPending ? "Registering..." : "Register Patient"}
              </Button>
              <Link href="/patients" className="w-full sm:w-auto">
                <Button type="button" variant="outline" size="lg" className="w-full">Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
