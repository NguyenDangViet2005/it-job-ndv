import type { Metadata } from "next";
import { getMetadata } from "@/utils";

import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/providers/auth.provider";
import { Toaster } from "@/components/ui/shadcn/sonner";
import { NavigationTracker } from "@/routes/navigation-tracker";

export const metadata: Metadata = getMetadata(
  "IT Job | Nền tảng công việc IT hàng đầu Việt Nam"
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <Toaster />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <NavigationTracker />
              {children}
            </AuthProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
