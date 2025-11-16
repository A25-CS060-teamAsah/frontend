"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { TextInput } from "../molecules/text-input"
import { PasswordInput } from "../molecules/password-input"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    router.push("/dashboard")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <TextInput
          id="email"
          type="email"
          placeholder="Type Your Email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          placeholder="Type Your Password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked === true)}
          />
          <Label
            htmlFor="remember"
            className="text-sm font-normal cursor-pointer"
          >
            Remember me
          </Label>
        </div>
        <Link
          href="/forgot-password"
          className="text-sm text-[#183495] hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-[#183495] hover:bg-[#183495]/90 text-white h-12 rounded-lg text-base font-medium"
      >
        Login
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-[#407BFF] hover:underline font-medium">
          Register
        </Link>
      </p>
    </form>
  )
}

