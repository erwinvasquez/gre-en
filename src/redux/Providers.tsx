// src/redux/Providers.tsx - Versión simplificada
"use client"

import type React from "react"
import { Provider } from "react-redux"
import { store } from "./store"
import { ThemeProvider } from "next-themes"
import { SessionProvider } from "next-auth/react"

interface Props {
  children: React.ReactNode
}

export const Providers = ({ children }: Props) => {
  return (
    <Provider store={store}>
      <ThemeProvider 
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
              themes={["light", "dark"]}
              storageKey="theme"
            >
        <SessionProvider>{children}</SessionProvider>
      </ThemeProvider>
    </Provider>
  )
}


