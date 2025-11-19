"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TextInput } from "../molecules/text-input"
import { PasswordInput } from "../molecules/password-input"
import { register } from "@/lib/api/auth.service"

export function RegisterForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState<'admin' | 'sales'>("sales")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null)

  useEffect(() => {
    if (confirmPassword.length > 0) {
      setPasswordMatch(password === confirmPassword)
    } else {
      setPasswordMatch(null)
    }
  }, [password, confirmPassword])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      const response = await register({ name, email, password, role })

      console.log("Registration successful:", response)
      setSuccess("User registered successfully! Redirecting...")

      setName("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      setRole("sales")
      
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (err) {
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
        <Label htmlFor="name">Name</Label>
        <TextInput
          id="name"
          type="text"
          placeholder="Type Your Name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

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
        {passwordMatch === false && confirmPassword.length > 0 && (
          <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
        )}
        {passwordMatch === true && (
          <p className="text-xs text-green-600 mt-1">Passwords match ✓</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select value={role} onValueChange={(value) => setRole(value as 'admin' | 'sales')}>
          <SelectTrigger className="w-full h-11">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-[#183495] hover:bg-[#183495]/90 text-white h-12 rounded-lg text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? "Registering..." : "Register"}
      </Button>
    </form>
  )
}

