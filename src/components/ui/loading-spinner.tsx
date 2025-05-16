import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const spinnerVariants = cva("animate-spin rounded-full border-solid border-t-transparent", {
  variants: {
    size: {
      sm: "h-4 w-4 border-2",
      md: "h-8 w-8 border-2",
      lg: "h-12 w-12 border-3",
      xl: "h-16 w-16 border-4",
    },
    color: {
      default: "border-gray-900 dark:border-white",
      primary: "border-primary",
      secondary: "border-secondary",
      white: "border-white",
    },
  },
  defaultVariants: {
    size: "md",
    color: "default",
  },
})

export interface LoadingSpinnerProps extends VariantProps<typeof spinnerVariants> {
  fullScreen?: boolean
  className?: string
  label?: string
}

/**
 * Componente reutilizable para mostrar un spinner de carga
 *
 * @example
 * // Spinner básico
 * <LoadingSpinner />
 *
 * // Spinner a pantalla completa
 * <LoadingSpinner fullScreen />
 *
 * // Spinner con tamaño y color personalizados
 * <LoadingSpinner size="lg" color="primary" />
 *
 * // Spinner con etiqueta
 * <LoadingSpinner label="Cargando datos..." />
 */
export function LoadingSpinner({ fullScreen = false, size, color, className, label }: LoadingSpinnerProps) {
  const spinner = (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        fullScreen && "fixed inset-0 bg-background/50 backdrop-blur-sm z-50",
        !fullScreen && "w-full",
        className,
      )}
    >
      <div className={cn(spinnerVariants({ size, color }))} aria-hidden="true" />
      {label && <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{label}</p>}
      {!label && <span className="sr-only">Cargando...</span>}
    </div>
  )

  return spinner
}
