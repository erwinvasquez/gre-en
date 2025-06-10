"use client"

import { useCallback, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { setLanguage } from "@/redux/slices/languageSlice"

/**
 * Hook para manejar la internacionalización y cambios de idioma
 *
 * @returns Objeto con métodos y estado de localización
 *
 * @example
 * const { locale, changeLocale, getLocalizedPath } = useLocalization();
 *
 * // Cambiar idioma
 * const handleLanguageChange = () => {
 *   changeLocale(locale === 'en' ? 'es' : 'en');
 * };
 *
 * // Obtener ruta localizada
 * const localizedPath = getLocalizedPath('/products');
 */
export function useLocalization() {
  const dispatch = useAppDispatch()
  const locale = useAppSelector((state) => state.language.locale)
  const router = useRouter()
  const pathname = usePathname()

  const getInitialLocale = (): string => {
    if (typeof window === "undefined") {
      return "es" // Valor por defecto en SSR
    }

    // Obtener de la URL
    const pathSegments = window.location.pathname.split("/")
    if (pathSegments.length > 1) {
      const urlLocale = pathSegments[1]
      if (["en", "es", "pt"].includes(urlLocale)) {
        return urlLocale
      }
    }

    // Obtener de localStorage como fallback
    const savedLocale = localStorage.getItem("locale")
    if (savedLocale && ["en", "es", "pt"].includes(savedLocale)) {
      return savedLocale
    }

    return "es" // Valor por defecto
  }

  useEffect(() => {
    // Inicializar el estado de Redux con el locale detectado
    const initialLocale = getInitialLocale()
    if (initialLocale !== locale) {
      dispatch(setLanguage(initialLocale))
    }
  }, [])

  /**
   * Cambiar el idioma actual y navegar a la ruta equivalente
   */
  const changeLocale = useCallback(
    (newLocale: string) => {
      if (newLocale === locale) return

      console.log(`🌐 useLocalization: Cambiando idioma de ${locale} a ${newLocale}`)

      // Actualizar el estado en Redux
      dispatch(setLanguage(newLocale))

      // Guardar preferencia en el servidor
      try {
        fetch("/api/language", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ locale: newLocale }),
        })
      } catch (error) {
        console.error("Error al guardar el idioma en el servidor:", error)
      }

      // Construir la nueva ruta con el nuevo idioma
      const currentPath = pathname || ""
      const segments = currentPath.split("/")

      // Si la ruta actual ya tiene un locale, lo reemplazamos
      if (segments.length > 1 && (segments[1] === "en" || segments[1] === "es")) {
        segments[1] = newLocale
        const newPath = segments.join("/")
        router.push(newPath)
      } else {
        // Si no tiene locale, añadimos el nuevo
        router.push(`/${newLocale}`)
      }
    },
    [locale, pathname, router, dispatch],
  )

  /**
   * Obtener la ruta con el prefijo del idioma actual
   */
  const getLocalizedPath = useCallback(
    (path: string) => {
      // Si la ruta ya comienza con un locale, lo reemplazamos
      if (path.startsWith("/en/") || path.startsWith("/es/")) {
        const segments = path.split("/")
        segments[1] = locale
        return segments.join("/")
      }

      // Si la ruta comienza con / pero no tiene locale, añadimos el locale
      if (path.startsWith("/")) {
        return `/${locale}${path}`
      }

      // Si la ruta no comienza con /, añadimos / y el locale
      return `/${locale}/${path}`
    },
    [locale],
  )

  /**
   * Obtener el idioma de la ruta actual
   */
  const getLocaleFromPath = useCallback(() => {
    const segments = pathname?.split("/") || []
    if (segments.length > 1) {
      const potentialLocale = segments[1]
      if (potentialLocale === "en" || potentialLocale === "es") {
        return potentialLocale
      }
    }
    return locale
  }, [pathname, locale])

  /**
   * Obtener la parte de la ruta sin el prefijo del idioma
   */
  const getPathWithoutLocale = useCallback(() => {
    const segments = pathname?.split("/") || []
    if (segments.length > 1 && (segments[1] === "en" || segments[1] === "es")) {
      return "/" + segments.slice(2).join("/")
    }
    return pathname || "/"
  }, [pathname])

  return {
    locale,
    changeLocale,
    getLocalizedPath,
    getLocaleFromPath,
    getPathWithoutLocale,
    supportedLocales: ["en", "es"],
  }
}


