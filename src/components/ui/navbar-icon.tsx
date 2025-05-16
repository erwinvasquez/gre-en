"use client"

import React from "react"
import type { ReactElement, ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface NavbarIconProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactElement
  active?: boolean
  label: string
  children?: React.ReactNode
}

/**
 * Componente reutilizable para iconos de la barra de navegación
 * Maneja de forma consistente el estado de hover y las transformaciones
 * Optimizado para evitar saltos durante la hidratación
 */
export function NavbarIcon({ icon, active = false, label, className, onClick, children, ...props }: NavbarIconProps) {
  // Clonar el icono y añadir propiedades de estilo
  const styledIcon = React.cloneElement(icon, {
    className: cn("transition-all duration-200", icon.props.className),
    style: {
      width: "var(--navbar-icon-size)",
      height: "var(--navbar-icon-size)",
      ...icon.props.style,
    },
    // Aplicamos las transformaciones con clases en lugar de estilos inline
    // para evitar diferencias entre SSR y cliente
  })

  return (
    <button
      type="button"
      className={cn(
        "relative flex items-center justify-center p-2 rounded-md transition-all duration-200",
        "hover:scale-[var(--navbar-icon-hover-scale)] hover:text-[var(--navbar-icon-hover-color)]",
        active && "text-[var(--navbar-icon-hover-color)]",
        className,
      )}
      aria-label={label}
      onClick={onClick}
      {...props}
    >
      {styledIcon}
      {children}
    </button>
  )
}

