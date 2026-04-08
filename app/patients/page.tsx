"use client";

import React from "react";
import Link from "next/link";
import { IconUserPlus, IconEye, IconEdit } from "@tabler/icons-react";
import { usePatients } from "@/hooks/usePatients";
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

export default function PatientsPage() {
  const {
    patients,
    totalCount,
    loading,
    error,
    search,
    setSearch,
    page,
    setPage,
    totalPages,
  } = usePatients();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pb-2">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Patient Directory</h1>
          <p className="text-text-secondary mt-1.5 font-medium">
            Manage your patients. {totalCount} total patient{totalCount !== 1 ? "s" : ""}.
          </p>
        </div>
        <Link href="/patients/create">
          <Button icon={<IconUserPlus className="h-4 w-4" stroke={2.5} />} size="lg">
            Register Patient
          </Button>
        </Link>
      </div>

      {/* Control Bar */}
      <Card className="px-6 py-4 flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name, age, or gender…"
          className="w-full sm:w-80"
        />
        {/* Additional filters could go here */}
      </Card>

      {/* Error */}
      {error && (
        <Card className="border-danger/20 bg-danger-muted p-4 shadow-none">
          <p className="text-sm font-medium text-danger">{error}</p>
        </Card>
      )}

      {/* Loading */}
      {loading ? (
        <TableSkeleton rows={6} cols={4} />
      ) : patients.length === 0 ? (
        <EmptyState
          title={search ? "No results found" : "No patients yet"}
          message={
            search
              ? `No patients match "${search}". Try a different search term.`
              : "Add your first patient to get started."
          }
          action={
             !search ? (
               <Link href="/patients/create">
                 <Button
                   size="md"
                   icon={<IconUserPlus className="h-4 w-4" />}
                 >
                   Add Patient
                 </Button>
               </Link>
             ) : undefined
          }
        />
      ) : (
        <div className="space-y-6">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Patient Details</TableHeaderCell>
                <TableHeaderCell>Age</TableHeaderCell>
                <TableHeaderCell>Gender</TableHeaderCell>
                <TableHeaderCell className="text-right">Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 border border-brand-100 font-bold shadow-softer shrink-0">
                        {patient.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-text-primary">
                        {patient.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-text-secondary">{patient.age} yrs</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={genderBadgeVariant(patient.gender)}>
                      {patient.gender}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/patients/${patient.id}`}>
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={<IconEye className="h-4 w-4" stroke={2} />}
                          className="hover:bg-brand-50 hover:text-brand-600"
                        >
                          View
                        </Button>
                      </Link>
                      <Link href={`/patients/${patient.id}/edit`}>
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={<IconEdit className="h-4 w-4" stroke={2} />}
                        >
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex justify-center p-2">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      )}
    </div>
  );
}
