"use client";

import { AuthLayout } from "@/components/auth/organisms/auth-layout";
import { LoginForm } from "@/components/auth/organisms/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <AuthLayout type="login">
      <div className="w-full max-w-sm sm:max-w-md flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 w-full">
          <div className="relative w-full h-48 sm:h-60 lg:h-75 mb-6 sm:mb-10">
            <Image
              src="/login/businessAnalytics.svg"
              alt="Business Analytics"
              fill
              className="object-contain"
              priority
            />
          </div>
          <LoginForm />
        </div>
      </div>
    </AuthLayout>
  );
}
