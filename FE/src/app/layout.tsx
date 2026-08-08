import type { Metadata } from "next";
import { getMetadata } from "@/utils";

import "./globals.css";
import { ThemeProvider } from "@/lib/providers/theme-provider";
import { AuthProvider } from "@/lib/providers/auth.provider";
import { Toaster } from "@/components/ui/sonner";
import { NavigationTracker } from "@/helpers/navigation-tracker";
import { SmoothScrollProvider } from "@/lib/providers/smooth-scroll-provider";

export const metadata: Metadata = getMetadata(
  "IT Job | Nền tảng công việc IT hàng đầu Việt Nam",
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="vi" suppressHydrationWarning>
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
              <SmoothScrollProvider>
                <NavigationTracker />
                {children}
              </SmoothScrollProvider>
            </AuthProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
