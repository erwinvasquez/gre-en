"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAppSelector } from "@/redux/hooks"

// Tipo para las subpáginas
export interface SubPage {
  path: string
  title: string
  description?: string
  icon?: React.ReactNode
  sections?: Array<{
    id: string
    title: string
    description?: string
  }>
}

// Tipo para las páginas con subpáginas
export interface PageWithSubmenu {
  path: string
  text: string
  subpages: SubPage[]
}

interface SubmenuProps {
  pages: PageWithSubmenu[]
  hoveredPath: string | null
}

export function Submenu({ pages, hoveredPath }: SubmenuProps) {
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const pathname = usePathname()
  const locale = useAppSelector((state) => state.language.locale)
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  // Controlar la visibilidad y el submenu activo
  useEffect(() => {
    // Limpiar cualquier timeout pendiente
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current)
    }

    if (hoveredPath) {
      // Actualizar inmediatamente el submenu activo
      setActiveSubmenu(hoveredPath)
      // Pequeño retraso para la animación de entrada
      transitionTimeoutRef.current = setTimeout(() => {
        setIsVisible(true)
      }, 50)
    } else {
      // Iniciar la animación de salida
      setIsVisible(false)
      // Esperar a que termine la animación antes de limpiar el submenu activo
      transitionTimeoutRef.current = setTimeout(() => {
        setActiveSubmenu(null)
      }, 300) // Debe coincidir con la duración de la transición
    }

    // Limpiar timeout al desmontar
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current)
      }
    }
  }, [hoveredPath])

  // Si no está montado, no renderizar nada para evitar errores de hidratación
  if (!mounted) return null

  // Si no hay submenu activo, no mostrar nada
  if (!activeSubmenu) return null

  // Encontrar la página activa
  const currentPage = pages.find((page) => page.path === activeSubmenu)

  if (!currentPage) return null

  return (
    <div
      className="fixed left-0 right-0 top-[var(--navbar-height)] overflow-hidden transition-all duration-300 ease-in-out border-t bg-white dark:bg-gray-900"
      style={{
        borderColor: "var(--submenu-border-color)",
        boxShadow: "var(--submenu-shadow)",
        zIndex: "var(--submenu-z-index)",
        transition: "var(--submenu-transition)",
        maxHeight: isVisible ? "var(--submenu-max-height)" : "0",
        opacity: isVisible ? "1" : "0",
        transform: isVisible ? "translateY(0)" : "translateY(-1rem)",
      }}
    >
      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentPage.subpages.map((subpage) => (
            <div key={subpage.path} className="group">
              <Link
                href={`/${locale}${currentPage.path}${subpage.path}`}
                className="p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors block"
              >
                <div className="flex items-start">
                  {subpage.icon && (
                    <div className="mr-4 text-gray-500 dark:text-gray-400 group-hover:text-primary">{subpage.icon}</div>
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary">
                      {subpage.title}
                    </h3>
                    {subpage.description && (
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subpage.description}</p>
                    )}
                  </div>
                </div>
              </Link>

              {/* Tercer nivel: Secciones dentro de cada subpágina */}
              {subpage.sections && subpage.sections.length > 0 && (
                <div className="mt-2 pl-8 border-l border-gray-200 dark:border-gray-700">
                  <div className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-1 font-medium">Secciones</div>
                  <div className="space-y-1">
                    {subpage.sections.map((section) => (
                      <Link
                        key={section.id}
                        href={`/${locale}${currentPage.path}${subpage.path}#${section.id}`}
                        className="block text-sm py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300 hover:text-primary"
                      >
                        {section.title}
                        {section.description && (
                          <span className="block text-xs text-gray-500 dark:text-gray-400">{section.description}</span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}








