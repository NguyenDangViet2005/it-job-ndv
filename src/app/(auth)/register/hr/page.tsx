"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import RegisterHRPage from "@/pages/auth/register.hr.page";
import { ROUTES } from "@/configs";

function Page() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("userInfo");
      const storedToken = localStorage.getItem("accessToken");

      if (storedUser && storedToken) {
        try {
          const user = JSON.parse(storedUser);
          const role = user.role?.toLowerCase();

          // Redirect based on role
          let redirectPath = ROUTES.HOME as string;
          if (role === "admin") {
            redirectPath = "/admin";
          } else if (role === "hr" || role === "employer") {
            redirectPath = "/hr";
          }

          router.push(redirectPath);
        } catch (error) {
          console.error("Error parsing user data:", error);
          router.push(ROUTES.HOME);
        }
      }
    }
  }, [router]);

  return (
    <>
      <RegisterHRPage />
    </>
  );
}

export default Page;
