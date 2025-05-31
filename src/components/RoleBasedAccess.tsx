"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect } from "react"

interface RoleBasedAccessProps {
  children: React.ReactNode
  allowedRoles: string[]
}

const RoleBasedAccess: React.FC<RoleBasedAccessProps> = ({ children, allowedRoles }) => {
  const { session, status, userRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") {
      return
    }

    if (status === "unauthenticated") {
      router.push("/api/auth/signin")
      return
    }

    if (!userRole || !allowedRoles.includes(userRole)) {
      router.push("/unauthorized")
    }
  }, [status, userRole, allowedRoles, router])

  if (status === "loading" || !userRole || !allowedRoles.includes(userRole)) {
    return null // or a loading indicator
  }

  return <>{children}</>
}

const useAuth = () => {
  const session = useSession()
  const userRole = session?.data?.user?.role as string
  const status = session.status

  return {
    session,
    status,
    userRole,
  }
}

export default RoleBasedAccess
