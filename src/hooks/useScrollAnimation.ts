"use client"

import { useEffect, useRef } from "react"
import { useIntersectionObserver } from "./useIntersectionObserver"
import { DEFAULT_SCROLL_DETECTION, type ScrollDetectionConfig } from "@/lib/animation-config"

/**
 * Hook para detectar cuando un elemento entra en el viewport y aplicar animaciones
 *
 * @example
 * // Uso básico
 * const elementRef = useScrollAnimation();
 * return <div ref={elementRef} className="animate-on-scroll fade-in">Contenido</div>;
 *
 * @example
 * // Con opciones personalizadas
 * const elementRef = useScrollAnimation({
 *   threshold: 0.5,
 *   once: true,
 * });
 */
export function useScrollAnimation(options: Partial<ScrollDetectionConfig> = {}) {
  // Combinar opciones predeterminadas con las proporcionadas
  const config = { ...DEFAULT_SCROLL_DETECTION, ...options }
  const elementRef = useRef<HTMLDivElement | null>(null)

  // Usar el hook base de intersection observer
  const { isIntersecting } = useIntersectionObserver(elementRef, {
    threshold: config.threshold,
    rootMargin: config.rootMargin,
    once: config.once,
    resetOnLeave: config.resetOnLeave,
  })

  // Aplicar la clase de visibilidad cuando el elemento es visible
  useEffect(() => {
    if (!elementRef.current) return

    if (isIntersecting(elementRef.current)) {
      elementRef.current.classList.add(config.visibleClass)
    } else if (config.resetOnLeave) {
      elementRef.current.classList.remove(config.visibleClass)
    }
  }, [isIntersecting, config.visibleClass, config.resetOnLeave])

  return elementRef
}

/**
 * Hook para animar múltiples elementos hijos en secuencia cuando el padre entra en el viewport
 *
 * @example
 * const { parentRef, getDelayClass } = useStaggeredAnimation();
 *
 * return (
 *   <ul ref={parentRef}>
 *     {items.map((item, index) => (
 *       <li key={item.id} className={`animate-on-scroll fade-in ${getDelayClass(index)}`}>
 *         {item.name}
 *       </li>
 *     ))}
 *   </ul>
 * );
 */
export function useStaggeredAnimation({
  baseDelay = 100,
  maxItems = 10,
  threshold = DEFAULT_SCROLL_DETECTION.threshold,
  once = DEFAULT_SCROLL_DETECTION.once,
}: {
  baseDelay?: number
  maxItems?: number
  threshold?: number
  once?: boolean
} = {}) {
  const parentRef = useScrollAnimation({ threshold, once })

  // Generar clase de retraso basada en el índice
  const getDelayClass = (index: number) => {
    const delay = Math.min(index, maxItems) * baseDelay

    if (delay <= 100) return "delay-100"
    if (delay <= 200) return "delay-200"
    if (delay <= 300) return "delay-300"
    if (delay <= 400) return "delay-400"
    if (delay <= 500) return "delay-500"
    if (delay <= 700) return "delay-700"
    return "delay-1000"
  }

  return { parentRef, getDelayClass }
}


