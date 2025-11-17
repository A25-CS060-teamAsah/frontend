"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { TextInput } from "../molecules/text-input"
import { PasswordInput } from "../molecules/password-input"
import { register } from "@/lib/api/auth.service"

export function RegisterForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role] = useState<'admin' | 'sales'>("admin")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validate password match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setIsLoading(true)

    try {
      const response = await register({ email, password, role })
      
      // Registration successful
      console.log("Registration successful:", response)
      setSuccess("User registered successfully! Redirecting...")
      
      // Clear form
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      
      // Optional: redirect after success
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (err) {
      // Handle error
      const errorMessage = err instanceof Error ? err.message : "Registration failed. Please try again."
      setError(errorMessage)
      console.error("Registration error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}

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

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <PasswordInput
          id="confirmPassword"
          placeholder="Please Type Your Password Again..."
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-[#183495] hover:bg-[#183495]/90 text-white h-12 rounded-lg text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? "Registering..." : "Register"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-[#407BFF] hover:underline font-medium">
          Login
        </Link>
      </p>
    </form>
  )
}

