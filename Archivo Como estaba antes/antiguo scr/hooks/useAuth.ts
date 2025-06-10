"use client"

import { useState, useCallback, useEffect } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/redux/hooks"
import { getUserRole } from "@/lib/firestore"

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
  const [role, setRole] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  // Efecto para cargar el rol del usuario cuando la sesión cambia
  useEffect(() => {
    const loadUserRole = async () => {
      if (session?.user?.id) {
        try {
          const userRole = await getUserRole(session.user.id)
          setRole(userRole || "user")
          setIsAdmin(userRole === "admin")
        } catch (err) {
          console.error("Error al cargar rol de usuario:", err)
          setRole("user")
          setIsAdmin(false)
        }
      } else {
        setRole(null)
        setIsAdmin(false)
      }
    }

    loadUserRole()
  }, [session])

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

          // Redirección después de login exitoso
          console.log("🔄 useAuth: Redirigiendo después de login exitoso...")
          router.push(`/${locale}`)
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
    [update, router, locale],
  )

  /**
   * Iniciar sesión con Google (usando popup)
   * Esta implementación utiliza una técnica de ventana popup real
   */
  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("🔑 useAuth: Iniciando login con Google (popup)...")

      // Configuración del popup
      const width = 500
      const height = 600
      const left = window.screenX + (window.outerWidth - width) / 2
      const top = window.screenY + (window.outerHeight - height) / 2
      const popupWindowSettings = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`

      // URL para el inicio de sesión con Google
      // Usamos un enfoque personalizado para manejar el popup correctamente
      const authUrl = `/api/auth/google-popup-signin?callbackUrl=${encodeURIComponent(
        `${window.location.origin}/${locale}`,
      )}`

      // Abrir el popup
      const popupWindow = window.open(authUrl, "GoogleLoginPopup", popupWindowSettings)

      if (!popupWindow) {
        console.error("❌ useAuth: No se pudo abrir el popup. Posiblemente bloqueado por el navegador.")
        setError({
          message:
            "No se pudo abrir la ventana de inicio de sesión. Por favor, permite ventanas emergentes para este sitio.",
          code: "popup-blocked",
        })
        setIsLoading(false)
        return false
      }

      // Función para verificar el estado del popup y la autenticación
      const checkPopupStatus = async () => {
        if (!popupWindow || popupWindow.closed) {
          console.log("🔄 useAuth: Popup cerrado, verificando sesión...")
          clearInterval(popupCheckInterval)

          // Esperar un momento y luego verificar si la sesión se actualizó
          await new Promise((resolve) => setTimeout(resolve, 1000))
          await update()

          // Verificar si el usuario está autenticado ahora
          const updatedSession = await fetch("/api/auth/session").then((res) => res.json())

          if (updatedSession?.user) {
            console.log("✅ useAuth: Login con Google exitoso")
            router.refresh()
            setIsLoading(false)
            return true
          } else {
            console.log("❌ useAuth: Login con Google no completado")
            setError({ message: "Inicio de sesión no completado", code: "auth/login-canceled" })
            setIsLoading(false)
            return false
          }
        }
      }

      // Verificar el estado del popup periódicamente
      const popupCheckInterval = setInterval(checkPopupStatus, 1000)

      // También manejar el caso en que la ventana principal se cierre
      window.addEventListener("beforeunload", () => {
        if (popupWindow && !popupWindow.closed) {
          popupWindow.close()
        }
      })

      return true // Devolvemos true inicialmente, la verificación real ocurre en el intervalo
    } catch (err) {
      console.error("❌ useAuth: Error de autenticación con Google:", err)
      setError({
        message: "Error al iniciar sesión con Google",
        code: "auth/google-signin-failed",
      })
      setIsLoading(false)
      return false
    }
  }, [update, router, locale])

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

      // Cerrar sesión con NextAuth
      // Usamos redirect: true para forzar una recarga completa de la página
      // Esto garantiza que el estado de la sesión se actualice correctamente
      await signOut({
        redirect: true,
        callbackUrl: `/${locale}`,
      })

      // Nota: El código después de signOut con redirect: true no se ejecutará
      // porque la página se recargará automáticamente

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
  }, [locale])

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
    role,
    isAdmin,
    isAuthenticated: status === "authenticated" && !!session,
    login,
    loginWithGoogle,
    register,
    logout,
    clearError,
  }
}






// "use client"

// import { useState, useCallback } from "react"
// import { signIn, signOut, useSession } from "next-auth/react"
// import { useRouter } from "next/navigation"
// import { useAppSelector } from "@/redux/hooks"

// interface LoginCredentials {
//   email: string
//   password: string
// }

// interface RegisterCredentials extends LoginCredentials {
//   name: string
// }

// interface AuthError {
//   message: string
//   code?: string
// }

// /**
//  * Hook para centralizar la lógica de autenticación
//  *
//  * @returns Objeto con métodos y estado de autenticación
//  *
//  * @example
//  * const { login, loginWithGoogle, logout, isLoading, error } = useAuth();
//  *
//  * // Iniciar sesión con email y contraseña
//  * const handleSubmit = async (e) => {
//  *   e.preventDefault();
//  *   const success = await login({ email, password });
//  *   if (success) {
//  *     // Hacer algo después del login exitoso
//  *   }
//  * };
//  */
// export function useAuth() {
//   const { data: session, status, update } = useSession()
//   const router = useRouter()
//   const locale = useAppSelector((state) => state.language.locale) || "en"
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState<AuthError | null>(null)

//   /**
//    * Iniciar sesión con email y contraseña
//    */
//   const login = useCallback(
//     async (credentials: LoginCredentials) => {
//       setIsLoading(true)
//       setError(null)

//       try {
//         console.log("🔑 useAuth: Iniciando sesión con credenciales...")
//         const result = await signIn("credentials", {
//           redirect: false,
//           email: credentials.email,
//           password: credentials.password,
//         })

//         if (result?.error) {
//           console.log("❌ useAuth: Error en login:", result.error)
//           setError({ message: "Credenciales incorrectas" })
//           return false
//         }

//         if (result?.ok) {
//           console.log("✅ useAuth: Login exitoso")

//           // Actualizar la sesión
//           await update()
//           console.log("✅ useAuth: Sesión actualizada")

//           // Forzar actualización de la UI usando router
//           router.refresh()

//           // SOLUCIÓN AGRESIVA: Recargar la página después de un breve retraso
//           // Esto garantiza que todos los componentes se actualicen correctamente
//           console.log("🔄 useAuth: Programando recarga de página para asegurar actualización completa...")
//           setTimeout(() => {
//             console.log("🔄 useAuth: Recargando página...")
//             window.location.href = `/${locale}`
//           }, 100)

//           return true
//         }

//         return false
//       } catch (err) {
//         console.error("❌ useAuth: Error de autenticación:", err)
//         setError({
//           message: "Ocurrió un error durante la autenticación",
//           code: "auth/unknown-error",
//         })
//         return false
//       } finally {
//         setIsLoading(false)
//       }
//     },
//     [update, router],
//   )

//   /**
//    * Iniciar sesión con Google
//    */
//   const loginWithGoogle = useCallback(async () => {
//     setIsLoading(true)
//     setError(null)

//     try {
//       console.log("🔑 useAuth: Iniciando login con Google...")
//       const result = await signIn("google", { redirect: false })

//       if (result?.error) {
//         console.log("❌ useAuth: Error en login con Google:", result.error)
//         setError({ message: "Error al iniciar sesión con Google" })
//         return false
//       }

//       if (result?.ok) {
//         console.log("✅ useAuth: Login con Google exitoso")

//         // Actualizar la sesión
//         await update()

//         // Forzar actualización de la UI
//         router.refresh()

//         // SOLUCIÓN AGRESIVA: Recargar la página después de un breve retraso
//         console.log("🔄 useAuth: Programando recarga de página para asegurar actualización completa...")
//         setTimeout(() => {
//           console.log("🔄 useAuth: Recargando página...")
//           window.location.href = `/${locale}`
//         }, 100)

//         return true
//       }

//       return false
//     } catch (err) {
//       console.error("❌ useAuth: Error de autenticación con Google:", err)
//       setError({
//         message: "Error al iniciar sesión con Google",
//         code: "auth/google-signin-failed",
//       })
//       return false
//     } finally {
//       setIsLoading(false)
//     }
//   }, [update, router])

//   /**
//    * Registrar un nuevo usuario
//    * Nota: Esta función es un ejemplo y debe adaptarse a tu implementación real
//    */
//   const register = useCallback(
//     async (credentials: RegisterCredentials) => {
//       setIsLoading(true)
//       setError(null)

//       try {
//         // Aquí implementarías la lógica real de registro
//         // Por ejemplo, una llamada a tu API
//         console.log("🔑 useAuth: Registrando nuevo usuario...")

//         // Simulación de registro exitoso
//         await new Promise((resolve) => setTimeout(resolve, 1000))

//         // Después del registro exitoso, iniciar sesión automáticamente
//         return await login({
//           email: credentials.email,
//           password: credentials.password,
//         })
//       } catch (err) {
//         console.error("❌ useAuth: Error en registro:", err)
//         setError({
//           message: "Error al registrar usuario",
//           code: "auth/registration-failed",
//         })
//         return false
//       } finally {
//         setIsLoading(false)
//       }
//     },
//     [login],
//   )

//   /**
//    * Cerrar sesión
//    */
//   const logout = useCallback(async () => {
//     setIsLoading(true)

//     try {
//       console.log("🔄 useAuth: Cerrando sesión...")
//       await signOut({ redirect: false })
//       console.log("✅ useAuth: Sesión cerrada correctamente")

//       // Forzar actualización de la UI usando router
//       router.refresh()

//       // SOLUCIÓN AGRESIVA: Recargar la página después de un breve retraso
//       console.log("🔄 useAuth: Programando recarga de página para asegurar actualización completa...")
//       setTimeout(() => {
//         console.log("🔄 useAuth: Recargando página...")
//         window.location.href = `/${locale}`
//       }, 100)

//       return true
//     } catch (err) {
//       console.error("❌ useAuth: Error al cerrar sesión:", err)
//       setError({
//         message: "Error al cerrar sesión",
//         code: "auth/signout-failed",
//       })
//       return false
//     } finally {
//       setIsLoading(false)
//     }
//   }, [router, locale])

//   /**
//    * Limpiar errores de autenticación
//    */
//   const clearError = useCallback(() => {
//     setError(null)
//   }, [])

//   return {
//     session,
//     status,
//     isLoading,
//     error,
//     isAuthenticated: status === "authenticated" && !!session,
//     login,
//     loginWithGoogle,
//     register,
//     logout,
//     clearError,
//   }
// }


