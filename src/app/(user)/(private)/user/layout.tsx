"use client";

import { UserDashboardLayout } from "@/layouts/user/user.layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserDashboardLayout>{children}</UserDashboardLayout>;
}
