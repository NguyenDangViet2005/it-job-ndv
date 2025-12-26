"use client";

import { HRLayout } from "@/layouts/hr/hr.layout";
import ProtectedRoute from "@/components/auth/protected-route";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute allowedRoles={["hr", "employer"]}>
      <HRLayout>{children}</HRLayout>
    </ProtectedRoute>
  );
}
