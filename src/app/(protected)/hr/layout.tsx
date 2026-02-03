"use client";

import { HRLayout } from "@/components/layouts/HRLayout";
import ProtectedRoute from "@/constants/protected-route";

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

