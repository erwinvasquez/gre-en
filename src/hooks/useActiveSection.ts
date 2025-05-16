"use client"

import { useEffect, useState } from "react"
import { DEFAULT_SECTION_DETECTION } from "@/lib/animation-config"
import { usePathname } from "next/navigation"
import { useAppSelector } from "@/redux/hooks"

interface ActiveSectionOptions {
  /**
   * Valor entre 0 y 1 que indica qué porcentaje de la sección debe ser visible
   */
  threshold?: number

  /**
   * Margen alrededor de la sección para la detección
   */
  rootMargin?: string

  /**
   * Selector CSS para identificar las secciones
   */
  selectorPattern?: string
}

/**
 * Hook para detectar qué sección está actualmente visible en el viewport
 *
 * @example
 * const activeSection = useActiveSection();
 *
 * return (
 *   <nav>
 *     <a className={activeSection === 'home' ? 'active' : ''} href="#home">Home</a>
 *     <a className={activeSection === 'about' ? 'active' : ''} href="#about">About</a>
 *   </nav>
 * );
 */
export function useActiveSection({
  threshold = DEFAULT_SECTION_DETECTION.threshold,
  rootMargin = DEFAULT_SECTION_DETECTION.rootMargin,
  selectorPattern = DEFAULT_SECTION_DETECTION.selectorPattern,
}: ActiveSectionOptions = {}) {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const pathname = usePathname()
  const locale = useAppSelector((state) => state.language.locale) || "en"

  // Reiniciar el estado cuando cambie la página
  useEffect(() => {
    // Solo reiniciamos el estado si no estamos en la página principal
    // o si la URL no contiene un hash (indicador de sección)
    if (!pathname.endsWith(`/${locale}`) && !pathname.includes("#")) {
      setActiveSection(null)
    }
  }, [pathname, locale])

  useEffect(() => {
    const sections = document.querySelectorAll(selectorPattern)
    if (sections.length === 0) return

    // Configuración mejorada del observer
    const observer = new IntersectionObserver(
      (entries) => {
        // Ordenamos las entradas por su ratio de intersección (de mayor a menor)
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        // Si hay entradas visibles, usamos la que tiene mayor visibilidad
        if (visibleEntries.length > 0) {
          const id = visibleEntries[0].target.id
          if (id) {
            setActiveSection(id)
          }
        }
      },
      {
        threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], // Múltiples umbrales para mejor precisión
        rootMargin,
      },
    )

    sections.forEach((section) => {
      observer.observe(section)
    })

    // Verificar si hay un hash en la URL al cargar y establecer la sección activa
    const hash = window.location.hash.substring(1)
    if (hash) {
      setActiveSection(hash)
    }

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, selectorPattern])

  return activeSection
}



