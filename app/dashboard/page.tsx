"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  IconUsers,
  IconStethoscope,
  IconUserPlus,
  IconArrowRight,
  IconTrendingUp,
} from "@tabler/icons-react";
import Card, { CardContent } from "@/components/ui/Card";
import Badge, { genderBadgeVariant } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { StatCardSkeleton, Skeleton } from "@/components/ui/Loader";
import { getPatients } from "@/lib/api";
import { consultationService } from "@/services/consultationService";
import { formatDate } from "@/lib/utils";
import type { Patient } from "@/types";

export default function DashboardPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [totalConsultations, setTotalConsultations] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const pts = await getPatients();
        setPatients(pts);

        // Attempt to count consultations (sum across all patients)
        let total = 0;
        const ids = pts.slice(0, 20).map((p) => p.id); // limit to 20
        const results = await Promise.allSettled(
          ids.map((id) => consultationService.getByPatientId(id))
        );
        for (const r of results) {
          if (r.status === "fulfilled") total += r.value.length;
        }
        setTotalConsultations(total);
      } catch {
        // API unavailable — show empty state
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const recentPatients = [...patients]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-72" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
          <Skeleton className="h-6 w-40" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page heading */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">Dashboard</h1>
        <p className="text-text-secondary mt-1">
          Welcome back! Here&apos;s an overview of your patient records.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Patients */}
        <Card className="group hover:border-brand-300 transition-all border border-border">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold tracking-wide text-text-secondary uppercase">
                  Total Patients
                </p>
                <p className="mt-2 text-4xl font-bold text-text-primary">
                  {patients.length}
                </p>
                <p className="mt-2 text-sm text-success font-medium flex items-center gap-1.5">
                  <IconTrendingUp className="h-4 w-4" />
                  All time
                </p>
              </div>
              <div className="rounded-2xl bg-brand-50 p-3 group-hover:bg-brand-100 transition-colors shadow-softer">
                <IconUsers className="h-7 w-7 text-brand-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Consultations */}
        <Card className="group hover:border-info-light transition-all border border-border">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold tracking-wide text-text-secondary uppercase">
                  Total Consultations
                </p>
                <p className="mt-2 text-4xl font-bold text-text-primary">
                  {totalConsultations}
                </p>
                <p className="mt-2 text-sm text-text-muted font-medium flex items-center gap-1.5">
                  <IconStethoscope className="h-4 w-4 text-info" />
                  Across all patients
                </p>
              </div>
              <div className="rounded-2xl bg-info-muted p-3 group-hover:bg-blue-100 transition-colors shadow-softer">
                <IconStethoscope className="h-7 w-7 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card className="border border-border">
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div>
              <p className="text-sm font-semibold tracking-wide text-text-secondary uppercase">
                Quick Actions
              </p>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <Link href="/patients/create">
                <Button
                  size="md"
                  variant="primary"
                  icon={<IconUserPlus className="h-4 w-4" stroke={2.5} />}
                  className="w-full justify-start pl-4"
                >
                  Register New Patient
                </Button>
              </Link>
              <Link href="/patients">
                <Button
                  size="md"
                  variant="outline"
                  icon={<IconUsers className="h-4 w-4" />}
                  className="w-full justify-start pl-4"
                >
                  View Patient Directory
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent patients */}
      <Card>
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <h2 className="text-lg font-bold text-text-primary tracking-tight">
              Recent Patients
            </h2>
            <Link href="/patients">
              <Button size="sm" variant="ghost" className="text-brand-600 hover:text-brand-700 hover:bg-brand-50">
                View Directory
                <IconArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
          </div>

          <div className="p-2">
            {recentPatients.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="mx-auto w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center mb-4">
                  <IconUsers className="h-8 w-8 text-text-muted opacity-50" />
                </div>
                <h3 className="text-base font-semibold text-text-primary mb-1">No patients found</h3>
                <p className="text-sm text-text-muted mb-6">You haven't registered any patients yet.</p>
                <Link href="/patients/create" className="inline-block">
                  <Button size="md" icon={<IconUserPlus className="h-4 w-4" />}>
                    Add First Patient
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                {recentPatients.map((patient, idx) => (
                  <Link
                    key={patient.id}
                    href={`/patients/${patient.id}`}
                    className="flex items-center justify-between rounded-xl px-4 py-3.5 hover:bg-surface-hover transition-all group border border-transparent hover:border-border/50"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 font-bold border border-brand-100 shadow-softer group-hover:bg-brand-100 transition-colors">
                        {patient.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary group-hover:text-brand-600 transition-colors">
                          {patient.name}
                        </p>
                        <p className="text-sm text-text-muted mt-0.5 font-medium">
                          Age: {patient.age} <span className="opacity-50 mx-1">•</span> Added {formatDate(patient.createdAt)}
                        </p>
                      </div>
                    </div>
                    <Badge variant={genderBadgeVariant(patient.gender)}>
                      {patient.gender}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
