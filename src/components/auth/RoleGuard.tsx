"use client"

import { useRole } from "@/hooks/useRole"
import { useAuth } from "@/hooks/useAuth"
import type { ReactNode } from "react"
import { useRouter } from "next/navigation"

interface RoleGuardProps {
  children: ReactNode
  requiredRole?: "admin" | "user"
  fallback?: ReactNode
  redirectTo?: string
}

/**
 * Componente para proteger contenido basado en roles
 */
export function RoleGuard({ children, requiredRole = "user", fallback = null, redirectTo }: RoleGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const { hasRole } = useRole()
  const router = useRouter()

  // Si está cargando, mostrar un indicador de carga o nada
  if (isLoading) {
    return null
  }

  // Si no está autenticado o no tiene el rol requerido
  if (!isAuthenticated || !hasRole(requiredRole)) {
    // Si se especificó una redirección, redirigir
    if (redirectTo) {
      router.push(redirectTo)
      return null
    }
    // De lo contrario, mostrar el fallback
    return <>{fallback}</>
  }

  // Si tiene el rol requerido, mostrar el contenido
  return <>{children}</>
}

/**
 * Componente específico para proteger contenido de administrador
 */
export function AdminGuard({ children, fallback = null, redirectTo }: Omit<RoleGuardProps, "requiredRole">) {
  return (
    <RoleGuard requiredRole="admin" fallback={fallback} redirectTo={redirectTo}>
      {children}
    </RoleGuard>
  )
}

/**
 * Componente para proteger contenido que requiere autenticación
 */
export function AuthGuard({ children, fallback = null, redirectTo }: Omit<RoleGuardProps, "requiredRole">) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // Si está cargando, mostrar un indicador de carga o nada
  if (isLoading) {
    return null
  }

  // Si no está autenticado
  if (!isAuthenticated) {
    // Si se especificó una redirección, redirigir
    if (redirectTo) {
      router.push(redirectTo)
      return null
    }
    // De lo contrario, mostrar el fallback
    return <>{fallback}</>
  }

  // Si está autenticado, mostrar el contenido
  return <>{children}</>
}

