import type { Metadata } from "next";

import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/providers/auth.provider";
import { Toaster } from "sonner";
import { NavigationTracker } from "@/components/auth/navigation-tracker";

export const metadata: Metadata = {
  title: "IT Job | Nền tảng công việc IT hàng đầu Việt Nam",
  description: "IT Job | Nền tảng công việc IT hàng đầu Việt Nam",
  icons: {
    icon: [
      { url: '/icons/icon.svg', sizes: 'any' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
    ]
  },
};

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
