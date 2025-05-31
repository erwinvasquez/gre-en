"use client"

import React from "react"

import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import style from "./ActiveLink.module.css"
import { useState } from "react"
import type { JSX } from "react"

interface Props {
  path: string
  text?: string
  icon?: JSX.Element
  hasSubmenu?: boolean
  onClick?: (e: React.MouseEvent) => void
}

export const ActiveLink = ({ path, text, icon, hasSubmenu = false, onClick }: Props) => {
  const pathName = usePathname() // Detecta la ruta actual
  const { locale } = useParams() // Obtenemos el idioma actual de la ruta
  const [isHovered, setIsHovered] = useState(false)

  const getLocalePath = (path: string) => `/${locale}${path}` // Construimos la ruta con el idioma

  const linkClass = icon ? style["icon-link"] : style["text-link"] // Elegimos la clase según si hay un ícono o no
  // Determinamos la clase activa dinámicamente
  const activeClass = pathName.startsWith(`/${locale}${path}`)
    ? icon
      ? style["active-icon-link"]
      : style["active-text-link"]
    : ""

  // Renderizar el icono con efecto de escala
  const renderIcon = () => {
    if (!icon) return null

    // Clonar el icono y añadir propiedades de estilo
    return React.cloneElement(icon as React.ReactElement, {
      style: {
        transition: "var(--navbar-icon-transition)",
        transform: isHovered ? `scale(var(--navbar-icon-hover-scale))` : "scale(1)",
        color: isHovered ? "var(--navbar-icon-hover-color)" : "",
      },
    })
  }

  return (
    <div className="flex items-center">
      <Link
        className={`${linkClass} ${activeClass}`}
        href={getLocalePath(path)} // Enlace con prefijo del idioma
        onMouseOver={() => setIsHovered(true)}
        onMouseOut={() => setIsHovered(false)}
        onClick={onClick}
      >
        {icon ? renderIcon() : text}
      </Link>
    </div>
  )
}





