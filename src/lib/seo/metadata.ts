import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

// Tipos para nuestro sistema de metadatos
export interface SeoProps {
  title: string
  description: string
  keywords?: string[]
  image?: string
  path: string
  locale?: string
  type?: "website" | "article" | "profile" // Tipos compatibles con Next.js OpenGraph
  noindex?: boolean
}

// Configuración base del sitio
export const siteConfig = {
  name: "Tu Marca",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://tudominio.com",
  defaultLocale: "es",
  supportedLocales: ["es", "en"],
  defaultImage: "/images/og-image.jpg", // Imagen por defecto para compartir
  twitterHandle: "@tuempresa",
}

/**
 * Genera metadatos para Next.js basados en los parámetros proporcionados
 */
export function generateMetadata({
  title,
  description,
  keywords = [],
  image,
  path,
  locale = siteConfig.defaultLocale,
  type = "website",
  noindex = false,
}: SeoProps): Metadata {
  // Construir URLs completas
  const fullUrl = `${siteConfig.url}/${locale}${path}`
  const imageUrl = image ? `${siteConfig.url}${image}` : `${siteConfig.url}${siteConfig.defaultImage}`

  // Construir título completo
  const fullTitle = `${title} | ${siteConfig.name}`

  // Generar alternativas de idioma
  const alternateLanguages: Record<string, string> = {}
  siteConfig.supportedLocales.forEach((supportedLocale) => {
    alternateLanguages[supportedLocale] = `${siteConfig.url}/${supportedLocale}${path}`
  })

  return {
    // Metadatos básicos
    title: fullTitle,
    description,
    keywords: keywords.join(", "),

    // Metadatos para robots
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },

    // Metadatos Open Graph
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale,
      type, // Usamos el tipo proporcionado
    },

    // Metadatos Twitter
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
      creator: siteConfig.twitterHandle,
      site: siteConfig.twitterHandle,
    },

    // URLs alternativas y canónica
    alternates: {
      canonical: fullUrl,
      languages: alternateLanguages,
    },
  }
}

/**
 * Obtiene los metadatos desde los archivos de traducción para una página específica
 */
export async function getPageMetadata(
  pageName: string,
  path: string,
  locale: string = siteConfig.defaultLocale,
): Promise<Metadata> {
  try {
    // Obtener traducciones para metadatos
    const t = await getTranslations({ locale, namespace: "Metadata" })

    // Obtener metadatos específicos de la página
    const pageTitle = t(`${pageName}.title`)
    const pageDescription = t(`${pageName}.description`)
    const pageKeywords = t(`${pageName}.keywords`).split(", ")

    // Generar metadatos usando la función existente
    return generateMetadata({
      title: pageTitle,
      description: pageDescription,
      keywords: pageKeywords,
      path,
      locale,
    })
  } catch (error) {
    console.error(`Error loading metadata for page ${pageName}:`, error)

    // Fallback a metadatos por defecto
    return getDefaultMetadata(path, locale)
  }
}

/**
 * Obtiene los metadatos por defecto para una ruta e idioma específicos
 */
export async function getDefaultMetadata(path: string, locale: string = siteConfig.defaultLocale): Promise<Metadata> {
  try {
    // Obtener traducciones para metadatos
    const t = await getTranslations({ locale, namespace: "Metadata" })

    // Determinar qué página es basado en la ruta
    let pageName = "home"
    if (path.includes("/products")) pageName = "products"
    else if (path.includes("/account")) pageName = "account"
    else if (path.includes("/contact")) pageName = "contact"

    // Obtener metadatos específicos de la página
    return getPageMetadata(pageName, path, locale)
  } catch (error) {
    console.error(`Error loading default metadata:`, error)

    // Fallback a metadatos estáticos
    return {
      title: locale === "es" ? "Tu Marca" : "Your Brand",
      description:
        locale === "es" ? "Plataforma líder en soluciones digitales" : "Leading platform for digital solutions",
    }
  }
}





