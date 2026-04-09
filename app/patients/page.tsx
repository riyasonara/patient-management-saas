"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { IconUserPlus, IconEye, IconEdit, IconTrash } from "@tabler/icons-react";
import { usePatients, useDeletePatient } from "@/hooks/usePatients";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge, { genderBadgeVariant } from "@/components/ui/Badge";
import SearchInput from "@/components/ui/SearchInput";
import Pagination from "@/components/ui/Pagination";
import EmptyState from "@/components/ui/EmptyState";
import { TableSkeleton } from "@/components/ui/Loader";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from "@/components/ui/Table";

const PAGE_SIZE = 8;

export default function PatientsPage() {
  const { data: patients, isLoading, isError, error } = usePatients();
  const deleteMutation = useDeletePatient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Client-side search filtering
  const filtered = useMemo(() => {
    if (!patients) return [];
    if (!search.trim()) return patients;
    const q = search.toLowerCase();
    return patients.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.gender?.toLowerCase().includes(q) ||
        p.disease?.toLowerCase().includes(q) ||
        p.bloodGroup?.toLowerCase().includes(q) ||
        String(p.age).includes(q)
    );
  }, [patients, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pb-2">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Patient Directory</h1>
          <p className="text-text-secondary mt-1.5 font-medium">
            Manage your patients. {filtered.length} total patient{filtered.length !== 1 ? "s" : ""}.
          </p>
        </div>
        <Link href="/patients/create">
          <Button icon={<IconUserPlus className="h-4 w-4" stroke={2.5} />} size="lg">
            Register Patient
          </Button>
        </Link>
      </div>

      <Card className="px-6 py-4 flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface border-border/80 shadow-soft">
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Search by name, disease, gender..."
          className="w-full sm:w-80"
        />
      </Card>

      {isError && (
        <Card className="border-danger/20 bg-danger-muted p-4 shadow-none">
          <p className="text-sm font-medium text-danger">{error?.message || "Error fetching patients"}</p>
        </Card>
      )}

      {isLoading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : patients?.length === 0 ? (
        <EmptyState
          title="No patients yet"
          message="Add your first patient to get started."
          action={
            <Link href="/patients/create">
              <Button size="md" icon={<IconUserPlus className="h-4 w-4" />}>
                Add Patient
              </Button>
            </Link>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No results found"
          message={`No patients match "${search}". Try a different search term.`}
        />
      ) : (
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Patient Details</TableHeaderCell>
                  <TableHeaderCell>Age / Blood</TableHeaderCell>
                  <TableHeaderCell>Gender</TableHeaderCell>
                  <TableHeaderCell>Contact</TableHeaderCell>
                  <TableHeaderCell>Disease</TableHeaderCell>
                  <TableHeaderCell className="text-right">Actions</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginated.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 border border-brand-100 font-bold shadow-softer shrink-0">
                          {patient.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <span className="font-semibold text-text-primary">
                          {patient.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-text-secondary">{patient.age} yrs</span>
                        <span className="text-xs text-text-muted">{patient.bloodGroup || "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={genderBadgeVariant(patient.gender as any)}>
                        {patient.gender || "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">{patient.phoneNumber || "N/A"}</span>
                        <span className="text-xs text-text-muted">{patient.email || "No Email"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{patient.disease || "None"}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/patients/${patient.id}`}>
                          <Button size="sm" variant="ghost" icon={<IconEye className="h-4 w-4" stroke={2} />} className="hover:bg-brand-50 hover:text-brand-600">
                            View
                          </Button>
                        </Link>
                        <Link href={`/patients/${patient.id}/edit`}>
                          <Button size="sm" variant="ghost" icon={<IconEdit className="h-4 w-4" stroke={2} />}>
                            Edit
                          </Button>
                        </Link>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          icon={<IconTrash className="h-4 w-4 text-danger" stroke={2} />}
                          onClick={() => handleDelete(patient.id)}
                          className="hover:bg-danger/10 hover:text-danger"
                          isLoading={deleteMutation.isPending && deleteMutation.variables === patient.id}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-center p-2">
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      )}
    </div>
  );
}
