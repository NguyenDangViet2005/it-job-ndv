"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ROUTES } from "@/constants";
import LoadingScreen from "@/components/common/loading-screen";

export default function ProfileRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user?.id) {
        router.replace(ROUTES.PROFILE(user?.id));
      } else {
        router.replace(ROUTES.LOGIN);
      }
    }
  }, [user, loading, router]);

  return <LoadingScreen message="Đang chuyển hướng..." fullScreen={true} />;
}
