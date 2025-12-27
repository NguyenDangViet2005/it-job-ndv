import type { Metadata } from "next";

import UserFooter from "@/layouts/user/footer";

import UserHeader from "@/layouts/user/header";


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
