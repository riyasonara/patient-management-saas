import React from "react";
import { IconDatabaseOff } from "@tabler/icons-react";

interface EmptyStateProps {
  title: string;
  message: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title,
  message,
  action,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border/80 bg-surface/50">
      <div className="mx-auto w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center mb-5 text-text-muted">
        {icon || <IconDatabaseOff className="h-8 w-8 opacity-70" />}
      </div>
      <h3 className="text-lg font-bold text-text-primary mb-1.5">{title}</h3>
      <p className="text-sm font-medium text-text-secondary max-w-sm mb-6 leading-relaxed">
        {message}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
