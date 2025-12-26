"use client";

import { AdminLayout } from "@/layouts/admin/admin.layout";
import ProtectedRoute from "@/components/auth/protected-route";

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
