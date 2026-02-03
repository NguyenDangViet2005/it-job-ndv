import type { Metadata } from "next";

import UserFooter from "@/components/layouts/UserFooter";
import UserHeader from "@/components/layouts/UserHeader";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <UserHeader />
      {children}
      <UserFooter />
    </>
  );
}
