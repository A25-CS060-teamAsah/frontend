'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { isAuthenticated, getCurrentUser } from '@/lib/api/auth.service'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: 'admin'
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        sessionStorage.setItem('redirectAfterLogin', pathname)
        router.push('/login')
        return
      }

      const currentUser = getCurrentUser()
      
      if (!currentUser) {
        router.push('/login')
        return
      }

      if (requiredRole && currentUser.role !== requiredRole) {
        router.push('/dashboard')
        return
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [router, pathname, requiredRole])


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#183495]"></div>
      </div>
    )
  }

  return <>{children}</>
}
