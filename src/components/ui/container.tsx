import { cn } from "@/lib/utils"
import type React from "react"

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Tamaño del contenedor. Determina el ancho máximo.
   * @default "default"
   */
  size?: "small" | "default" | "medium" | "large" | "xlarge" | "full"
  /**
   * Si el contenedor debe tener padding horizontal.
   * @default true
   */
  withPadding?: boolean
  /**
   * Si el contenedor debe centrarse horizontalmente.
   * @default true
   */
  centered?: boolean
  /**
   * Elemento HTML a renderizar.
   * @default "div"
   */
  as?: React.ElementType
}

/**
 * Componente Container que limita el ancho del contenido y lo centra horizontalmente.
 * Diseñado para usarse dentro de Section cuando se necesita contenido de ancho limitado
 * mientras otros elementos (como imágenes) pueden ocupar el ancho completo.
 *
 * @example
 * <Section>
 *   <img className="w-full h-80 object-cover" src="/hero.jpg" alt="Hero" />
 *   <Container>
 *     <h2>Título de la Sección</h2>
 *     <p>Contenido limitado en ancho y centrado</p>
 *   </Container>
 * </Section>
 */
export function Container({
  className,
  children,
  size = "default",
  withPadding = true,
  centered = true,
  as: Component = "div",
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn(
        // Clases base
        "w-full",

        // Tamaños de contenedor usando variables CSS
        size === "small" && "max-w-3xl", // --container-sm: 640px
        size === "default" && "max-w-5xl", // --container-md: 768px
        size === "medium" && "max-w-6xl", // --container-lg: 1024px
        size === "large" && "max-w-7xl", // --container-xl: 1280px
        size === "xlarge" && "max-w-[1536px]", // --container-2xl: 1536px (NUEVO)
        size === "full" && "max-w-none", // --container-full: 100%

        // Padding horizontal
        withPadding && "px-4 sm:px-6 lg:px-8",

        // Centrado
        centered && "mx-auto",

        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
