"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { LockIcon, EyeIcon, EyeOffIcon } from "../atoms/icon"
import { cn } from "@/lib/utils"

interface PasswordInputProps extends React.ComponentProps<typeof Input> {
  showToggle?: boolean
}

export function PasswordInput({ className, showToggle = true, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2">
        <LockIcon />
      </div>
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("pl-10 pr-10", className)}
        {...props}
      />
      {showToggle && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      )}
    </div>
  )
}


