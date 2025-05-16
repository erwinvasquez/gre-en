// Configuración de idiomas disponibles
export const locales = ["en", "es", "pt"]
export const defaultLocale = "en"

// Mapeo de locales a nombres completos (para UI)
export const localeNames: Record<string, string> = {
  en: "English",
  es: "Español",
  pt: "Português",
}

// Configuración de rutas que no requieren prefijo de idioma
export const publicRoutes: string[] = []

