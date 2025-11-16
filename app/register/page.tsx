"use client"

import { AuthLayout } from "@/components/auth/organisms/auth-layout"
import { RegisterForm } from "@/components/auth/organisms/register-form"

export default function RegisterPage() {
  return (
    <AuthLayout type="register">
      <div className="space-y-6 w-full max-w-md">
        <h2 className="text-3xl font-bold text-foreground">Create an Account</h2>
        <RegisterForm />
      </div>
    </AuthLayout>
  )
}

