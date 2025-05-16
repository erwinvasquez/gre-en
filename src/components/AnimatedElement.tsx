"use client"

import type React from "react"
import { forwardRef } from "react"
import { useScrollAnimation } from "@/hooks"
import { cn } from "@/lib/utils"
import {
  type AnimationType,
  type AnimationDuration,
  type AnimationEasing,
  type AnimationDelay,
  DEFAULT_SCROLL_DETECTION,
} from "@/lib/animation-config"

export interface AnimatedElementProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Tipo de animación a aplicar cuando el elemento entra en el viewport
   */
  animation?: AnimationType

  /**
   * Variante de duración de la animación
   */
  duration?: AnimationDuration

  /**
   * Función de temporización de la animación
   */
  ease?: AnimationEasing

  /**
   * Retraso antes de que comience la animación (en ms)
   */
  delay?: AnimationDelay

  /**
   * Valor entre 0 y 1 que indica qué porcentaje del elemento debe ser visible
   * antes de activar la animación
   */
  threshold?: number

  /**
   * Si la animación debe ejecutarse solo una vez
   */
  once?: boolean

  /**
   * Si la animación debe reiniciarse cuando el elemento sale del viewport
   */
  resetOnLeave?: boolean

  /**
   * Etiqueta HTML a renderizar
   */
  as?: React.ElementType

  /**
   * Índice del elemento para animaciones escalonadas
   * Si se proporciona, se utilizará para calcular un retraso automático
   */
  index?: number

  /**
   * Retraso base en ms para animaciones escalonadas (cuando se usa index)
   * Por defecto es 100ms
   */
  staggerDelay?: number

  /**
   * Número máximo de elementos para calcular el retraso máximo
   * Por defecto es 10
   */
  maxItems?: number
}

/**
 * Componente AnimatedElement que se anima cuando entra en el viewport
 *
 * @example
 * <AnimatedElement animation="fade-in">
 *   Contenido que aparece gradualmente al entrar en la vista
 * </AnimatedElement>
 *
 * @example
 * <AnimatedElement
 *   animation="slide-up"
 *   duration="slow"
 *   delay={300}
 *   className="p-4 bg-white rounded-lg shadow-md"
 * >
 *   Contenido que se desliza hacia arriba con un retraso
 * </AnimatedElement>
 */
export const AnimatedElement = forwardRef<HTMLDivElement, AnimatedElementProps>(
  (
    {
      children,
      animation = "fade-in",
      duration = "slow",
      ease = "in-out",
      delay,
      threshold = DEFAULT_SCROLL_DETECTION.threshold,
      once = DEFAULT_SCROLL_DETECTION.once,
      resetOnLeave = DEFAULT_SCROLL_DETECTION.resetOnLeave,
      className,
      as: Component = "div",
      index,
      staggerDelay = 100,
      maxItems = 10,
      ...props
    },
    ref,
  ) => {
    // Si se proporciona un índice, utilizamos useStaggeredAnimation
    // para calcular el retraso basado en el índice
    let calculatedDelay: AnimationDelay | undefined = delay

    if (index !== undefined) {
      // Calculamos el retraso basado en el índice
      const delayValue = Math.min(index, maxItems) * staggerDelay

      // Convertimos el valor numérico a la clase de retraso correspondiente
      // Asegurándonos de que coincida con los valores permitidos en AnimationDelay
      if (delayValue <= 100) calculatedDelay = 100
      else if (delayValue <= 200) calculatedDelay = 200
      else if (delayValue <= 300) calculatedDelay = 300
      else if (delayValue <= 400) calculatedDelay = 400
      else if (delayValue <= 500) calculatedDelay = 500
      else if (delayValue <= 700) calculatedDelay = 700
      else calculatedDelay = 1000
    }

    const animationRef = useScrollAnimation({
      threshold,
      once,
      resetOnLeave,
    })

    // Combinar los refs si se proporciona un ref externo
    const combinedRef = (node: HTMLDivElement) => {
      animationRef.current = node
      if (typeof ref === "function") {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    }

    return (
      <Component
        ref={combinedRef}
        className={cn(
          "animate-on-scroll",
          animation,
          `duration-${duration}`,
          `ease-${ease}`,
          calculatedDelay && `delay-${calculatedDelay}`,
          className,
        )}
        {...props}
      >
        {children}
      </Component>
    )
  },
)

AnimatedElement.displayName = "AnimatedElement"
