"use client";

import { useAuth } from "@/providers/auth.provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import Routes from "@/routes";

export default function ProfileRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user?.id) {
        router.replace(Routes.profile(user?.id));
      } else {
        router.replace(Routes.login);
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Đang chuyển hướng...</p>
      </div>
    </div>
  );
}
