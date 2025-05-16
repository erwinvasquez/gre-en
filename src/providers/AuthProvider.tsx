"use client"

import type React from "react"
import { useEffect } from "react"
import { SessionProvider } from "next-auth/react"
import type { Session } from "next-auth"

interface AuthProviderProps {
  children: React.ReactNode
  session?: Session | null
}

export function AuthProvider({ children, session }: AuthProviderProps) {
  // Añadir logs para ver si el AuthProvider está recibiendo la sesión correctamente
  useEffect(() => {
    console.log("🔍 AuthProvider: Inicializado con sesión:", session)
  }, [session])

  return <SessionProvider session={session}>{children}</SessionProvider>
}


