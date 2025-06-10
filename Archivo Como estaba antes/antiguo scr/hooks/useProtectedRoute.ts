"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/redux/hooks"

interface UseProtectedRouteOptions {
  redirectTo?: string
  requireAdmin?: boolean
}

/**
 * Hook para proteger rutas que requieren autenticación
 *
 * @param options Opciones de configuración
 * @returns Objeto con información de la sesión y estado de carga
 *
 * @example
 * // Uso básico
 * const { session, isLoading } = useProtectedRoute();
 *
 * // Con redirección personalizada
 * const { session, isLoading } = useProtectedRoute({ redirectTo: '/login' });
 *
 * // Con verificación de rol de administrador
 * const { session, isLoading } = useProtectedRoute({ requireAdmin: true });
 */
export function useProtectedRoute(options: UseProtectedRouteOptions = {}) {
  const { redirectTo = "", requireAdmin = false } = options
  const { data: session, status } = useSession()
  const locale = useAppSelector((state) => state.language.locale) || "en"
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Si el estado aún está cargando, no hacemos nada
    if (status === "loading") return

    // Si el usuario no está autenticado, redirigimos
    if (status === "unauthenticated") {
      console.log("🔒 useProtectedRoute: Usuario no autenticado, redirigiendo...")
      router.push(`/${locale}${redirectTo}`)
      return
    }

    // Si el usuario está autenticado, verificamos si tiene los permisos necesarios
    if (status === "authenticated" && session) {
      // Si se requiere rol de administrador, verificamos (esto es un ejemplo, ajusta según tu lógica)
      if (requireAdmin) {
        // Aquí deberías implementar tu lógica para verificar si el usuario es administrador
        // Por ejemplo: const isAdmin = session.user.role === 'admin';
        const isAdmin = true // Simulación - ajusta según tu lógica real

        if (!isAdmin) {
          console.log("🔒 useProtectedRoute: Usuario no es administrador, redirigiendo...")
          router.push(`/${locale}`)
          return
        }
      }

      // Si llegamos aquí, el usuario está autorizado
      setIsAuthorized(true)
    }
  }, [status, session, router, locale, redirectTo, requireAdmin])

  return {
    session,
    status,
    isLoading: status === "loading" || (status === "authenticated" && !isAuthorized),
    isAuthenticated: status === "authenticated" && !!session,
    isAuthorized,
  }
}

