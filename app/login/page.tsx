"use client"

import { AuthLayout } from "@/components/auth/organisms/auth-layout"
import { LoginForm } from "@/components/auth/organisms/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <AuthLayout type="login">
      <div className="w-full max-w-md scale-110 flex items-center justify-center">
        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 w-full">
          {/* Business Analytics Illustration */}
          <div className="relative w-full h-75 mb-10">
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
  )
}

