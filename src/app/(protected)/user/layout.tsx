"use client";

import { UserDashboardLayout } from "@/components/layouts/UserLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserDashboardLayout>{children}</UserDashboardLayout>;
}

