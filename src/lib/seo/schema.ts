import { siteConfig } from "./metadata"
import { getTranslations } from "next-intl/server"

/**
 * Genera el Schema.org para el sitio web y la organización
 */
export async function generateWebsiteSchema(locale: string = siteConfig.defaultLocale) {
  // Obtener traducciones para metadatos
  const t = await getTranslations({ locale, namespace: "Metadata" })

  return {
    "@context": "https://schema.org",
    "@graph": [
      // Schema de sitio web
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: t("siteName"),
        description: t("siteDescription"),
        inLanguage: locale,
        potentialAction: [
          {
            "@type": "SearchAction",
            target: `${siteConfig.url}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        ],
      },
      // Schema de organización
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: t("siteName"),
        url: siteConfig.url,
        logo: {
          "@type": "ImageObject",
          url: `${siteConfig.url}/logo.png`,
          width: 192,
          height: 192,
        },
        sameAs: [
          "https://www.facebook.com/tuempresa",
          "https://www.instagram.com/tuempresa",
          "https://twitter.com/tuempresa",
          "https://www.linkedin.com/company/tuempresa",
        ],
      },
    ],
  }
}

/**
 * Genera Schema.org para una página
 */
export async function generatePageSchema({
  title,
  description,
  url,
  locale = siteConfig.defaultLocale,
  datePublished,
  dateModified,
  breadcrumbs = [],
}: {
  title: string
  description: string
  url: string
  locale?: string
  datePublished?: string
  dateModified?: string
  breadcrumbs?: Array<{ name: string; item: string }>
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      // Schema de página web
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        inLanguage: locale,
        isPartOf: {
          "@id": `${siteConfig.url}/#website`,
        },
        datePublished: datePublished || new Date().toISOString(),
        dateModified: dateModified || new Date().toISOString(),
      },
      // Schema de breadcrumbs si existen
      breadcrumbs.length > 0
        ? {
            "@type": "BreadcrumbList",
            itemListElement: breadcrumbs.map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.name,
              item: item.item,
            })),
          }
        : null,
    ].filter(Boolean),
  }
}

/**
 * Genera Schema.org para un producto
 */
export function generateProductSchema({
  name,
  description,
  url,
  image,
  sku,
  price,
  currency = "EUR",
  availability = "InStock",
  brand,
  reviews = [],
  aggregateRating,
}: {
  name: string
  description: string
  url: string
  image: string
  sku: string
  price: number
  currency?: string
  availability?: "InStock" | "OutOfStock" | "PreOrder"
  brand: string
  reviews?: Array<{
    author: string
    datePublished: string
    reviewBody: string
    reviewRating: {
      ratingValue: number
    }
  }>
  aggregateRating?: {
    ratingValue: number
    reviewCount: number
  }
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    sku,
    image,
    url,
    brand: {
      "@type": "Brand",
      name: brand,
    },
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: currency,
      availability: `https://schema.org/${availability}`,
      url,
    },
    ...(reviews.length > 0 && {
      review: reviews.map((review) => ({
        "@type": "Review",
        author: {
          "@type": "Person",
          name: review.author,
        },
        datePublished: review.datePublished,
        reviewBody: review.reviewBody,
        reviewRating: {
          "@type": "Rating",
          ratingValue: review.reviewRating.ratingValue,
        },
      })),
    }),
    ...(aggregateRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: aggregateRating.ratingValue,
        reviewCount: aggregateRating.reviewCount,
      },
    }),
  }
}

/**
 * Genera Schema.org para una página de FAQ
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}




