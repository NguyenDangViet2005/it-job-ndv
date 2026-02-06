import type { Metadata } from "next";

import UserFooter from "@/components/layouts/UserFooter";
import UserHeader from "@/components/layouts/UserHeader";
import { MobileBottomNav } from "@/components/features/navigation/mobile-bottom-nav";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <UserHeader />
      <div className="pb-0 sm:pb-0">
        {children}
      </div>
      <UserFooter />
      <MobileBottomNav />
    </>
  );
}
