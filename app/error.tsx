"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("App Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
      <div className="rounded-2xl bg-danger-muted p-4 mb-5">
        <AlertTriangle className="h-10 w-10 text-danger" />
      </div>
      <h2 className="text-xl font-bold text-text-primary mb-2">
        Something went wrong
      </h2>
      <p className="text-sm text-text-muted max-w-md mb-6">
        An unexpected error occurred. Please try again, or contact support if
        the problem persists.
      </p>
      <Button
        onClick={() => unstable_retry()}
        icon={<RotateCcw className="h-4 w-4" />}
      >
        Try Again
      </Button>
    </div>
  );
}
