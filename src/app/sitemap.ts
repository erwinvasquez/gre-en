import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/seo/metadata"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url
  const currentDate = new Date().toISOString()

  // Páginas estáticas en español
  const esPages = [
    {
      url: `${baseUrl}/es`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/es/products`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/es/tools`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ]

  // Páginas estáticas en inglés
  const enPages = [
    {
      url: `${baseUrl}/en`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/en/products`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/tools`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ]

  // Páginas estáticas en portugués
  const ptPages = [
    {
      url: `${baseUrl}/pt`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/pt/products`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pt/tools`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ]

  // Combinar todas las páginas
  return [...esPages, ...enPages, ...ptPages]
}





