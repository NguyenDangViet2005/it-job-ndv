import { ModeToggle } from "@/components/ui/customs/toggle-them";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background selection:bg-primary/20">
      <div className="fixed inset-0 z-0 h-full w-full bg-background"></div>
      <div className="absolute top-6 right-6 z-50">
        <ModeToggle />
      </div>

      {children}
    </div>
  );
}
