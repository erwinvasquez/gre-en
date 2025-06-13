import type { Metadata } from "next"
import { getPageMetadata } from "@/lib/seo/metadata"
import { generatePageSchema } from "@/lib/seo/schema"
import { SchemaOrg } from "@/components/seo/SchemaOrg"
import { getTranslations } from "next-intl/server"
import HomeSection from "./[home]/home-section/HomeSection"
import ContactSection from "./[home]/contact-section/ContacSection"
import AboutSection from "./[home]/about-section/AboutSection"
import SolutionsSection from "./[home]/solutions-section/SolutionsSection"
import PricingSection from "./[home]/pricing-section/PricingSection"
import SectorsSection from "./[home]/sector-sections/SectorsSection"
import FutureEnergySection from "./[home]/future-energy-sectino/FutureEnergySection"


// Generar metadatos para la página de inicio
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getPageMetadata("/", params.locale)
}

export default async function HomePage({ params }: { params: { locale: string } }) {
  // Obtener traducciones para metadatos
  const t = await getTranslations({ locale: params.locale, namespace: "Metadata" })
  const schemaT = await getTranslations({ locale: params.locale, namespace: "Schema" })

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://greenenergy.com.bo"

  // Generar Schema.org para la página de inicio con todos los campos
  const pageSchema = await generatePageSchema({
    title: t("title"),
    description: t("description"),
    url: `${baseUrl}/${params.locale}`,
    locale: params.locale,
    datePublished: schemaT("dates.sitePublished"),
    dateModified: new Date().toISOString(),
    breadcrumbs: [
      {
        name: schemaT("breadcrumbs.home"),
        item: `${baseUrl}/${params.locale}`,
      },
    ],
  })

  return (
    <main className="flex flex-col items-center">
      {/* Schema.org específico para esta página */}
      <SchemaOrg schema={pageSchema} />

      <HomeSection />
      <FutureEnergySection />
      <SectorsSection />
      <SolutionsSection />
      <ContactSection />
      <AboutSection />
    </main>
  )
}





