"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { NavbarIcon } from "@/components/ui/navbar-icon"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)
    // Asegurarse de que el tema inicial sea light
    setTheme("light")
  }, [setTheme])

  // Si no está montado, renderizar un placeholder con las mismas dimensiones
  if (!mounted) {
    return (
      <div className="w-9 h-9 flex items-center justify-center opacity-0">
        <span className="sr-only">Toggle theme</span>
      </div>
    )
  }

  return (
    <NavbarIcon
      icon={theme === "dark" ? <Sun /> : <Moon className="fill-current" />}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      label="Toggle theme"
    />
  )
}




