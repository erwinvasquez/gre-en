// Opciones de configuración para NextAuth
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { auth } from "@/lib/auth/firebase-mock"

// Log para verificar que este archivo se está cargando
console.log("🔄 NextAuth: Configuración cargada")

// Opciones de configuración para NextAuth
export const authOptions: NextAuthOptions = {
  // Configurar proveedores de autenticación
  providers: [
    // Proveedor de credenciales para email/password
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("🔄 NextAuth: authorize - Verificando credenciales...")
          // Verificar que se proporcionaron credenciales
          if (!credentials?.email || !credentials?.password) {
            console.log("❌ NextAuth: authorize - Credenciales incompletas")
            return null
          }

          // Intentar autenticar con Firebase simulado
          console.log("🔄 NextAuth: authorize - Intentando autenticar con Firebase...")
          const { user } = await auth.signInWithEmailAndPassword(credentials.email, credentials.password)
          console.log("✅ NextAuth: authorize - Autenticación exitosa con Firebase")

          // Devolver usuario en formato compatible con NextAuth
          console.log("🔄 NextAuth: authorize - Devolviendo usuario para NextAuth")
          return {
            id: user.uid,
            name: user.displayName,
            email: user.email,
            image: user.photoURL,
            emailVerified: user.emailVerified,
            providerId: user.providerId,
          }
        } catch (error) {
          console.error("❌ NextAuth: Error en authorize:", error)
          return null
        }
      },
    }),
    // Proveedor de credenciales para Google
    CredentialsProvider({
      id: "google",
      name: "Google",
      credentials: {},
      async authorize() {
        try {
          console.log("🔄 NextAuth: authorize (Google) - Iniciando autenticación...")
          // Simular inicio de sesión con Google
          const { user } = await auth.signInWithPopup()
          console.log("✅ NextAuth: authorize (Google) - Autenticación exitosa")

          // Devolver usuario en formato compatible con NextAuth
          console.log("🔄 NextAuth: authorize (Google) - Devolviendo usuario para NextAuth")
          return {
            id: user.uid,
            name: user.displayName,
            email: user.email,
            image: user.photoURL,
            emailVerified: user.emailVerified,
            providerId: user.providerId,
          }
        } catch (error) {
          console.error("❌ NextAuth: Error en authorize Google:", error)
          return null
        }
      },
    }),
  ],
  // Añadir esta configuración para mejorar la seguridad
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-here",
  // Configuración de páginas personalizadas
  pages: {
    signIn: "/", // No redirigir a una página de login específica
    error: "/", // No redirigir a una página de error específica
  },
  // Configuración de callbacks
  callbacks: {
    // Personalizar JWT
    async jwt({ token, user }) {
      console.log("🔄 NextAuth: jwt callback - Personalizando token")
      // Incluir datos adicionales en el token si hay un usuario
      if (user) {
        console.log("🔄 NextAuth: jwt callback - Añadiendo datos de usuario al token")
        token.id = user.id
        token.emailVerified = (user as any).emailVerified || false
        token.providerId = (user as any).providerId || "unknown"
      }
      return token
    },
    // Personalizar sesión
    async session({ session, token }) {
      console.log("🔄 NextAuth: session callback - Personalizando sesión")
      if (token && session.user) {
        console.log("🔄 NextAuth: session callback - Añadiendo datos del token a la sesión")
        session.user.id = token.id as string
        session.user.emailVerified = token.emailVerified as boolean
        session.user.providerId = token.providerId as string
      }
      return session
    },
    // Añadir un callback para manejar errores
    async redirect({ url, baseUrl }) {
      console.log("🔄 NextAuth: redirect callback - Redirigiendo a:", url)
      // Personalizar redirecciones
      return url.startsWith(baseUrl) ? url : baseUrl
    },
  },
  // Configuración de sesión
  session: {
    strategy: "jwt", // Usar JWT para la sesión
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  // Configuración de cookies para mejorar la persistencia
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60, // 30 días
      },
    },
  },
  // Habilitar debug solo en desarrollo
  debug: true, // Forzar debug para ver todos los logs
  // Añadir eventos de NextAuth
  events: {
    async signIn({ user }) {
      console.log("🔄 NextAuth Event: signIn - Usuario ha iniciado sesión:", user.name)
      // Aquí puedes añadir lógica adicional después del login
    },
    async signOut() {
      console.log("🔄 NextAuth Event: signOut - Usuario ha cerrado sesión")
      // Aquí puedes añadir lógica adicional después del logout
    },
    async session({ session }) {
      console.log("🔄 NextAuth Event: session - Sesión actualizada", session)
      // Los eventos no deben devolver valores, solo ejecutar código
    },
  },
}

// Extender la sesión de NextAuth para incluir datos de Firebase
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string | null
      email: string | null
      image: string | null
      emailVerified: boolean
      providerId: string
    }
  }
}
