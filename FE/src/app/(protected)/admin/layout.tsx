"use client";

import { AdminLayout } from "@/components/layouts/AdminLayout";
import ProtectedRoute from "@/constants/protected-route";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}

