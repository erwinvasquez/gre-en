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
  return getPageMetadata("home", "/", params.locale)
}

export default async function HomePage({ params }: { params: { locale: string } }) {
  // Obtener traducciones para metadatos
  const t = await getTranslations({ locale: params.locale, namespace: "Metadata" })

  // Generar Schema.org para la página de inicio
  const pageSchema = await generatePageSchema({
    title: t("home.title"),
    description: t("home.description"),
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://tudominio.com"}/${params.locale}`,
    locale: params.locale,
    datePublished: "2023-01-01T00:00:00Z", // Fecha de publicación inicial
    dateModified: new Date().toISOString(), // Fecha de última modificación
    breadcrumbs: [
      {
        name: t("home.title"),
        item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://tudominio.com"}/${params.locale}`,
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
    </main>
  )
}





