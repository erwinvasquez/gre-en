"use client"

import { useState, useCallback } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/redux/hooks"

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterCredentials extends LoginCredentials {
  name: string
}

interface AuthError {
  message: string
  code?: string
}

/**
 * Hook para centralizar la lógica de autenticación
 *
 * @returns Objeto con métodos y estado de autenticación
 *
 * @example
 * const { login, loginWithGoogle, logout, isLoading, error } = useAuth();
 *
 * // Iniciar sesión con email y contraseña
 * const handleSubmit = async (e) => {
 *   e.preventDefault();
 *   const success = await login({ email, password });
 *   if (success) {
 *     // Hacer algo después del login exitoso
 *   }
 * };
 */
export function useAuth() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const locale = useAppSelector((state) => state.language.locale) || "en"
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)

  /**
   * Iniciar sesión con email y contraseña
   */
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setIsLoading(true)
      setError(null)

      try {
        console.log("🔑 useAuth: Iniciando sesión con credenciales...")
        const result = await signIn("credentials", {
          redirect: false,
          email: credentials.email,
          password: credentials.password,
        })

        if (result?.error) {
          console.log("❌ useAuth: Error en login:", result.error)
          setError({ message: "Credenciales incorrectas" })
          return false
        }

        if (result?.ok) {
          console.log("✅ useAuth: Login exitoso")

          // Actualizar la sesión
          await update()
          console.log("✅ useAuth: Sesión actualizada")

          // Forzar actualización de la UI usando router
          router.refresh()

          // SOLUCIÓN AGRESIVA: Recargar la página después de un breve retraso
          // Esto garantiza que todos los componentes se actualicen correctamente
          console.log("🔄 useAuth: Programando recarga de página para asegurar actualización completa...")
          setTimeout(() => {
            console.log("🔄 useAuth: Recargando página...")
            window.location.href = `/${locale}`
          }, 100)

          return true
        }

        return false
      } catch (err) {
        console.error("❌ useAuth: Error de autenticación:", err)
        setError({
          message: "Ocurrió un error durante la autenticación",
          code: "auth/unknown-error",
        })
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [update, router],
  )

  /**
   * Iniciar sesión con Google
   */
  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("🔑 useAuth: Iniciando login con Google...")
      const result = await signIn("google", { redirect: false })

      if (result?.error) {
        console.log("❌ useAuth: Error en login con Google:", result.error)
        setError({ message: "Error al iniciar sesión con Google" })
        return false
      }

      if (result?.ok) {
        console.log("✅ useAuth: Login con Google exitoso")

        // Actualizar la sesión
        await update()

        // Forzar actualización de la UI
        router.refresh()

        // SOLUCIÓN AGRESIVA: Recargar la página después de un breve retraso
        console.log("🔄 useAuth: Programando recarga de página para asegurar actualización completa...")
        setTimeout(() => {
          console.log("🔄 useAuth: Recargando página...")
          window.location.href = `/${locale}`
        }, 100)

        return true
      }

      return false
    } catch (err) {
      console.error("❌ useAuth: Error de autenticación con Google:", err)
      setError({
        message: "Error al iniciar sesión con Google",
        code: "auth/google-signin-failed",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }, [update, router])

  /**
   * Registrar un nuevo usuario
   * Nota: Esta función es un ejemplo y debe adaptarse a tu implementación real
   */
  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      setIsLoading(true)
      setError(null)

      try {
        // Aquí implementarías la lógica real de registro
        // Por ejemplo, una llamada a tu API
        console.log("🔑 useAuth: Registrando nuevo usuario...")

        // Simulación de registro exitoso
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Después del registro exitoso, iniciar sesión automáticamente
        return await login({
          email: credentials.email,
          password: credentials.password,
        })
      } catch (err) {
        console.error("❌ useAuth: Error en registro:", err)
        setError({
          message: "Error al registrar usuario",
          code: "auth/registration-failed",
        })
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [login],
  )

  /**
   * Cerrar sesión
   */
  const logout = useCallback(async () => {
    setIsLoading(true)

    try {
      console.log("🔄 useAuth: Cerrando sesión...")
      await signOut({ redirect: false })
      console.log("✅ useAuth: Sesión cerrada correctamente")

      // Forzar actualización de la UI usando router
      router.refresh()

      // SOLUCIÓN AGRESIVA: Recargar la página después de un breve retraso
      console.log("🔄 useAuth: Programando recarga de página para asegurar actualización completa...")
      setTimeout(() => {
        console.log("🔄 useAuth: Recargando página...")
        window.location.href = `/${locale}`
      }, 100)

      return true
    } catch (err) {
      console.error("❌ useAuth: Error al cerrar sesión:", err)
      setError({
        message: "Error al cerrar sesión",
        code: "auth/signout-failed",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }, [router, locale])

  /**
   * Limpiar errores de autenticación
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    session,
    status,
    isLoading,
    error,
    isAuthenticated: status === "authenticated" && !!session,
    login,
    loginWithGoogle,
    register,
    logout,
    clearError,
  }
}


