"use client"

import { Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface IconProps {
  className?: string
}

export const MailIcon = ({ className }: IconProps) => (
  <Mail className={cn("size-5 text-muted-foreground", className)} />
)

export const LockIcon = ({ className }: IconProps) => (
  <Lock className={cn("size-5 text-muted-foreground", className)} />
)

export const UserIcon = ({ className }: IconProps) => (
  <User className={cn("size-5 text-muted-foreground", className)} />
)

export const EyeIcon = ({ className }: IconProps) => (
  <Eye className={cn("size-5 text-muted-foreground cursor-pointer", className)} />
)

export const EyeOffIcon = ({ className }: IconProps) => (
  <EyeOff className={cn("size-5 text-muted-foreground cursor-pointer", className)} />
)

