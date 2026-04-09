import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import AppShell from "@/components/layout/AppShell";
import { QueryProvider } from "@/providers/query-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PatientMS — Patient Management System",
  description:
    "A modern patient management system for healthcare professionals. Manage patients, consultations, and medical records efficiently.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <QueryProvider>
          <AppShell>{children}</AppShell>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#ffffff",
                color: "#0f172a",
                border: "1px solid #e2e8f0",
                borderRadius: "0.75rem",
                fontSize: "0.875rem",
                boxShadow:
                  "0 10px 25px rgba(0,0,0,0.06), 0 4px 10px rgba(0,0,0,0.04)",
              },
              success: {
                iconTheme: { primary: "#16a34a", secondary: "#ffffff" },
              },
              error: {
                iconTheme: { primary: "#dc2626", secondary: "#ffffff" },
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
