"use client"

import { useSession } from "next-auth/react"
import { useMemo } from "react"

// Definir los tipos para el hook
export interface UseRoleReturn {
  role: "admin" | "user" | null
  isAdmin: boolean
  isUser: boolean
  isLoading: boolean
  hasRole: (requiredRole: "admin" | "user") => boolean
  hasPermission: (permission: string) => boolean
}

// Definir permisos por rol
const ROLE_PERMISSIONS = {
  admin: ["view_admin_panel", "manage_users", "edit_content", "delete_content", "view_analytics", "manage_settings"],
  user: ["view_profile", "edit_profile", "view_content"],
}

/**
 * Hook para manejar roles y permisos de usuario
 * @returns Objeto con información de rol y funciones de verificación
 */
export function useRole(): UseRoleReturn {
  const { data: session, status } = useSession()

  // Memoizar los datos de rol para evitar re-renders innecesarios
  const roleData = useMemo(() => {
    const isLoading = status === "loading"
    const role = session?.user?.role || null
    const isAdmin = role === "admin"
    const isUser = role === "user"

    // Función para verificar si el usuario tiene un rol específico
    const hasRole = (requiredRole: "admin" | "user") => {
      return role === requiredRole
    }

    // Función para verificar si el usuario tiene un permiso específico
    const hasPermission = (permission: string) => {
      if (!role) return false

      // Verificar si el permiso existe en el array de permisos del rol
      return ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS].includes(permission)
    }

    return {
      role,
      isAdmin,
      isUser,
      isLoading,
      hasRole,
      hasPermission,
    }
  }, [session, status])

  return roleData
}


