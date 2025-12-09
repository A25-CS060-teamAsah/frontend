"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/auth/organisms/auth-layout";
import { RegisterForm } from "@/components/auth/organisms/register-form";
import { getCurrentUser } from "@/lib/api/auth.service";
import Image from "next/image";
import { Shield } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthorization = () => {
      const user = getCurrentUser();

      if (!user) {
        router.push("/login");
        return;
      }

      if (user.role !== "admin") {
        router.push("/dashboard");
        return;
      }

      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuthorization();
  }, [router]);

  if (isLoading) {
    return (
      <AuthLayout type="register">
        <div className="w-full max-w-sm sm:max-w-md flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 w-full">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#183495] mb-4"></div>
              <p className="text-gray-600">Checking permissions...</p>
            </div>
          </div>
        </div>
      </AuthLayout>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <AuthLayout type="register">
      <div className="w-full max-w-sm sm:max-w-md flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 w-full">
          <div className="relative w-full h-40 sm:h-48 mb-4 sm:mb-6">
            <Image
              src="/login/businessAnalytics.svg"
              alt="Business Analytics"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-[#183495]" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center">
              Create New User
            </h2>
          </div>
          <RegisterForm />
        </div>
      </div>
    </AuthLayout>
  );
}
