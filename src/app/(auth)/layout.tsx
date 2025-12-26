import { FloatingIcons } from "@/components/ui/customs/floating-icons";
import LightRays from "@/components/ui/react.bits/light-rays";
import { ModeToggle } from "@/components/ui/customs/toggle-them";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background selection:bg-primary/20">
      {/* Background Gradients & Grid Pattern */}
      <div className="fixed inset-0 z-0 h-full w-full bg-background">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0 dark:opacity-20 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop")',
          }}
        />
        <div className="hidden md:block">
          <FloatingIcons />
        </div>
        {/* Radial Gradient Top */}
        <div className="absolute top-0 z-20 h-screen w-screen bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />

        {/* Radial Gradient Bottom */}
        <div className="absolute bottom-0 left-0 z-20 h-screen w-screen bg-[radial-gradient(ellipse_80%_80%_at_0%_100%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
      </div>

      {/* Light Rays */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-50">
        <LightRays
          raysOrigin="top-center"
          raysColor="#00ffff"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          className="custom-rays"
        />
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <ModeToggle />
      </div>

      {children}
    </div>
  );
}
