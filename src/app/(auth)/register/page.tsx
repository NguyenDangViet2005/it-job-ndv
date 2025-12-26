"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import RegisterPage from "@/pages/auth/register.page";
import Routes from "@/routes";

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
          let redirectPath = Routes.home;
          if (role === "admin") {
            redirectPath = "/admin";
          } else if (role === "hr" || role === "employer") {
            redirectPath = "/hr";
          }

          router.push(redirectPath);
        } catch (error) {
          console.error("Error parsing user data:", error);
          router.push(Routes.home);
        }
      }
    }
  }, [router]);

  return (
    <>
      <RegisterPage />
    </>
  );
}

export default Page;
