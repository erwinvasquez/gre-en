"use client"

import type React from "react"
import { useAuth } from "@/hooks"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface RoleBasedAccessProps {
  children: React.ReactNode
  allowedRoles: string[]
  fallback?: React.ReactNode
}

/**
 * Componente para controlar el acceso basado en roles
 * Solo muestra el contenido si el usuario tiene uno de los roles permitidos
 *
 * @example
 * <RoleBasedAccess allowedRoles={["admin"]}>
 *   <AdminPanel />
 * </RoleBasedAccess>
 */
export function RoleBasedAccess({ children, allowedRoles, fallback = null }: RoleBasedAccessProps) {
  const { session, status, role } = useAuth()

  // Mostrar loading mientras se verifica la autenticación
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center p-4">
        <LoadingSpinner size="md" />
      </div>
    )
  }

  // Si no está autenticado o no tiene el rol requerido, mostrar fallback
  if (!session || !role || !allowedRoles.includes(role)) {
    return <>{fallback}</>
  }

  // Si tiene acceso, mostrar el contenido
  return <>{children}</>
}
