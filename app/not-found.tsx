import Link from "next/link";
import Button from "@/components/ui/Button";
import { Home, FileQuestion } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
      <div className="rounded-2xl bg-surface-hover/60 p-4 mb-5">
        <FileQuestion className="h-10 w-10 text-text-muted" />
      </div>
      <h1 className="text-4xl font-bold text-text-primary mb-2">404</h1>
      <h2 className="text-lg font-semibold text-text-primary mb-2">
        Page Not Found
      </h2>
      <p className="text-sm text-text-muted max-w-md mb-6">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/dashboard">
        <Button icon={<Home className="h-4 w-4" />}>Go to Dashboard</Button>
      </Link>
    </div>
  );
}
