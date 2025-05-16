import { cn } from "@/lib/utils"
import type React from "react"

/**
 * Tipo de altura para la sección
 * - exact: Altura exacta de la pantalla
 * - min: Altura mínima de la pantalla (puede crecer)
 * - content: Altura determinada por el contenido
 * - custom: Usa la clase proporcionada en className
 */
type HeightType = "exact" | "min" | "content" | "custom"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * ID único para la sección, usado para navegación y scroll.
   */
  id?: string
  /**
   * Tipo de altura para la sección.
   * - exact: Altura exacta de la pantalla
   * - min: Altura mínima de la pantalla (puede crecer)
   * - content: Altura determinada por el contenido
   * - custom: Usa la clase proporcionada en className
   * @default "min"
   */
  heightType?: HeightType
  /**
   * Si la sección debe ocupar al menos la altura completa de la ventana.
   * @deprecated Use heightType en su lugar
   * @default true
   */
  fullHeight?: boolean
  /**
   * Si la sección no debe tener padding vertical.
   * @default false
   */
  noPadding?: boolean
  /**
   * Si el contenido debe centrarse vertical y horizontalmente.
   * @default false
   */
  centered?: boolean
  /**
   * Si la sección debe ocupar el ancho completo de la pantalla sin limitaciones.
   * @default false
   */
  fullWidth?: boolean
  /**
   * Elemento HTML a renderizar.
   * @default "section"
   */
  as?: "section" | "div" | "article"
  /**
   * Color de fondo opcional para la sección.
   */
  bgColor?: string
}

/**
 * Componente Section que aplica estilos consistentes a las secciones.
 * Este componente NO limita el ancho del contenido - para eso, usa el
 * componente Container dentro de Section.
 *
 * @example
 * <Section id="about" heightType="exact">
 *   <Container>
 *     <h2>About Us</h2>
 *     <p>Content goes here</p>
 *   </Container>
 * </Section>
 *
 * @example
 * <Section id="hero" fullWidth heightType="content">
 *   <img className="w-full h-80 object-cover" src="/hero.jpg" alt="Hero" />
 *   <Container>
 *     <h1>Welcome to our site</h1>
 *   </Container>
 * </Section>
 */
export function Section({
  id,
  className,
  heightType = "min",
  fullHeight = true, // Mantenido para compatibilidad
  noPadding = false,
  centered = false,
  fullWidth = false,
  as: Component = "section",
  bgColor,
  children,
  ...props
}: SectionProps) {
  // Determinar la clase de altura basada en heightType
  let heightClass = ""

  if (heightType === "exact") {
    heightClass = "h-screen"
  } else if (heightType === "min") {
    heightClass = "min-h-screen"
  } else if (heightType === "content") {
    // No aplicar ninguna clase de altura, usar el contenido
    // Asegurarse de que no se aplique ninguna clase de altura
    heightClass = "h-auto" // Forzar altura automática basada en contenido
  } else if (heightType === "custom") {
    // La altura se controlará a través de className
    heightClass = ""
  } else if (fullHeight) {
    // Compatibilidad con versiones anteriores
    heightClass = "min-h-screen"
  }

  return (
    <Component
      id={id}
      className={cn(
        fullWidth ? "w-full" : "section-container w-full",
        !noPadding && "py-12 md:py-16",
        heightClass,
        centered && "flex flex-col items-center justify-center",
        bgColor,
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

