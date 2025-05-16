"use client"

import { useState, useEffect } from "react"

type ScrollState = {
  isScrolling: boolean
  scrollY: number
  direction: "up" | "down" | null
}

/**
 * Hook para detectar la posición y estado del scroll
 *
 * @param threshold - Número de píxeles que debe desplazarse para considerar que está haciendo scroll (default: 10)
 * @param delay - Tiempo en ms para considerar que el scroll ha terminado (default: 200)
 * @returns Objeto con el estado del scroll
 *
 * @example
 * const { isScrolling, scrollY, direction } = useScrollPosition();
 *
 * // Usar el estado para aplicar clases condicionales
 * const navbarClass = isScrolling ? "navbar-scrolling" : "navbar-static";
 */
export function useScrollPosition(threshold = 10, delay = 200): ScrollState {
  const [scrollState, setScrollState] = useState<ScrollState>({
    isScrolling: false,
    scrollY: typeof window !== "undefined" ? window.scrollY : 0,
    direction: null,
  })

  useEffect(() => {
    if (typeof window === "undefined") return

    let lastScrollY = window.scrollY
    let scrollTimeout: NodeJS.Timeout | null = null

    // Función para manejar el evento de scroll con throttling
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const direction = currentScrollY > lastScrollY ? "down" : "up"

      // Actualizar el estado solo si el cambio es mayor que el umbral
      if (Math.abs(currentScrollY - lastScrollY) > threshold) {
        setScrollState({
          isScrolling: true,
          scrollY: currentScrollY,
          direction,
        })

        lastScrollY = currentScrollY

        // Limpiar el timeout anterior si existe
        if (scrollTimeout) {
          clearTimeout(scrollTimeout)
        }

        // Establecer un nuevo timeout para detectar cuando el scroll se detiene
        scrollTimeout = setTimeout(() => {
          setScrollState((prev) => ({
            ...prev,
            isScrolling: false,
          }))
        }, delay)
      }
    }

    // Throttle function para limitar la frecuencia de ejecución
    const throttle = (callback: Function, limit = 100) => {
      let waiting = false
      // Usar una función de flecha para evitar problemas con 'this'
      return (...args: any[]) => {
        if (!waiting) {
          callback(...args)
          waiting = true
          setTimeout(() => {
            waiting = false
          }, limit)
        }
      }
    }

    // Aplicar throttling al evento de scroll
    const throttledHandleScroll = throttle(handleScroll, 50)

    // Agregar el event listener
    window.addEventListener("scroll", throttledHandleScroll)

    // Inicializar el estado con la posición actual
    setScrollState({
      isScrolling: false,
      scrollY: window.scrollY,
      direction: null,
    })

    // Limpiar el event listener al desmontar
    return () => {
      window.removeEventListener("scroll", throttledHandleScroll)
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
    }
  }, [threshold, delay])

  return scrollState
}
