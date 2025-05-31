import type { DefaultSession, DefaultUser } from "next-auth"
import type { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string | null
      email: string | null
      image: string | null
      emailVerified: boolean
      providerId: string
      role: "admin" | "user"
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id: string
    emailVerified?: boolean
    providerId?: string
    role?: "admin" | "user"
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    emailVerified: boolean
    providerId: string
    role: "admin" | "user"
  }
}

