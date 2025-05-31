import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Section } from "@/components/ui/section"
import { Container } from "@/components/ui/container"
import { getDefaultMetadata } from "@/lib/seo/metadata"

// Generar metadatos para SEO
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getDefaultMetadata("/products/wind", params.locale)
}

export default async function WindEnergyPage({ params: { locale } }: { params: { locale: string } }) {
  // Obtener traducciones
  const t = await getTranslations({ locale, namespace: "SolutionsSection" })

  return (
    <main className="flex-1">
      <Section
        id="wind-hero"
        heightType="content"
        fullWidth={true}
        className="bg-gradient-to-b from-teal-50 to-background dark:from-teal-950/30 dark:to-background"
      >
        <Container size="large" className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">{t("wind.title")}</h1>
            <p className="text-xl text-muted-foreground mb-8">{t("wind.subtitle")}</p>
            <div className="h-1 w-20 bg-teal-500 mx-auto rounded-full"></div>
          </div>
        </Container>
      </Section>

      <Section id="wind-content" heightType="content">
        <Container size="large" className="py-16">
          <div className="prose prose-lg dark:prose-invert max-w-3xl mx-auto">
            <p className="lead">{t("wind.description")}</p>

            {/* Aquí se puede agregar más contenido específico de la página */}
            <div className="p-6 border border-teal-200 dark:border-teal-800 rounded-lg bg-teal-50 dark:bg-teal-950/30 mt-8">
              <h3 className="text-teal-700 dark:text-teal-300 font-medium">Página en desarrollo</h3>
              <p className="text-teal-600 dark:text-teal-400">
                Esta página está actualmente en desarrollo. Pronto se añadirá más información sobre {t("wind.title")}.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  )
}
