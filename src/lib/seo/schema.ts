import { getTranslations } from "next-intl/server"

export interface SchemaOrgProps {
  title: string
  description: string
  url: string
  locale: string
  datePublished?: string
  dateModified?: string
  breadcrumbs?: Array<{
    name: string
    item: string
  }>
}

/**
 * Genera el Schema.org completo para el sitio web
 */
export async function generateWebsiteSchema(locale: string) {
  const t = await getTranslations({ locale, namespace: "Schema" })
  const metaT = await getTranslations({ locale, namespace: "Metadata" })

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://greenenergy.com.bo"

  return {
    "@context": "https://schema.org",
    "@graph": [
      // Website Schema
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: metaT("siteName"),
        description: metaT("description"),
        publisher: {
          "@id": `${baseUrl}/#organization`,
        },
        inLanguage: locale,
      },
      // Organization Schema
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: t("mainEntityOfPage.name"),
        url: t("mainEntityOfPage.url"),
        logo: {
          "@type": "ImageObject",
          url: t("mainEntityOfPage.logo"),
          width: 200,
          height: 60,
        },
        sameAs: t("mainEntityOfPage.sameAs"),
        contactPoint: {
          "@type": "ContactPoint",
          telephone: t("contactPoint.telephone"),
          contactType: t("contactPoint.contactType"),
          areaServed: t("contactPoint.areaServed"),
          availableLanguage: t("contactPoint.availableLanguage"),
        },
      },
    ],
  }
}

/**
 * Genera el Schema.org para páginas específicas
 */
export async function generatePageSchema({
  title,
  description,
  url,
  locale,
  datePublished,
  dateModified,
  breadcrumbs = [],
}: SchemaOrgProps) {
  const t = await getTranslations({ locale, namespace: "Schema" })
  const metaT = await getTranslations({ locale, namespace: "Metadata" })

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://greenenergy.com.bo"

  // Generar breadcrumbs schema
  const breadcrumbSchema =
    breadcrumbs.length > 0
      ? {
          "@type": "BreadcrumbList",
          itemListElement: breadcrumbs.map((crumb, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: crumb.name,
            item: crumb.item,
          })),
        }
      : null

  return {
    "@context": "https://schema.org",
    "@graph": [
      // WebPage Schema
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url: url,
        name: title,
        description: description,
        datePublished: datePublished || t("dates.sitePublished"),
        dateModified: dateModified || new Date().toISOString(),
        inLanguage: locale,
        isPartOf: {
          "@id": `${baseUrl}/#website`,
        },
        about: {
          "@id": `${baseUrl}/#organization`,
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: metaT("og:image"),
        },
      },
      // Organization Schema (referencia)
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: t("mainEntityOfPage.name"),
        url: t("mainEntityOfPage.url"),
        logo: {
          "@type": "ImageObject",
          url: t("mainEntityOfPage.logo"),
        },
        sameAs: t("mainEntityOfPage.sameAs"),
        contactPoint: {
          "@type": "ContactPoint",
          telephone: t("contactPoint.telephone"),
          contactType: t("contactPoint.contactType"),
          areaServed: t("contactPoint.areaServed"),
          availableLanguage: t("contactPoint.availableLanguage"),
        },
      },
      // Product Schema (para páginas de productos)
      {
        "@type": "Product",
        name: t("product.name"),
        description: t("product.description"),
        brand: {
          "@type": "Brand",
          name: t("product.brand"),
        },
        offers: {
          "@type": "Offer",
          url: t("product.offers.url"),
          priceCurrency: t("product.offers.priceCurrency"),
          price: t("product.offers.price"),
          priceValidUntil: t("product.offers.priceValidUntil"),
          availability: "https://schema.org/InStock",
          seller: {
            "@id": `${baseUrl}/#organization`,
          },
        },
      },
      // Breadcrumbs Schema (si existen)
      ...(breadcrumbSchema ? [breadcrumbSchema] : []),
    ],
  }
}

/**
 * Genera Schema.org específico para productos
 */
export async function generateProductSchema(
  productName: string,
  productDescription: string,
  productPrice: string,
  locale: string,
) {
  const t = await getTranslations({ locale, namespace: "Schema" })
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://greenenergy.com.bo"

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName,
    description: productDescription,
    brand: {
      "@type": "Brand",
      name: "GreenEnergy",
    },
    manufacturer: {
      "@id": `${baseUrl}/#organization`,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "BOB",
      price: productPrice,
      availability: "https://schema.org/InStock",
      seller: {
        "@id": `${baseUrl}/#organization`,
      },
    },
    category: "Renewable Energy Equipment",
  }
}





