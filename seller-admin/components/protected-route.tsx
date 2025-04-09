"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip redirect during initial loading
    if (isLoading) return

    // If not authenticated and not on auth pages, redirect to login
    if (!isAuthenticated && !pathname.includes("/auth")) {
      router.push("/auth/login")
    }

    // If authenticated and on auth pages, redirect to dashboard
    if (isAuthenticated && pathname.includes("/auth")) {
      router.push("/")
    }
  }, [isAuthenticated, isLoading, router, pathname])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // For auth pages, we want to render even if not authenticated
  if (pathname.includes("/auth")) {
    return <>{children}</>
  }

  // For protected pages, only render if authenticated
  return isAuthenticated ? <>{children}</> : null
}
