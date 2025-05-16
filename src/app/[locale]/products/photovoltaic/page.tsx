import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Section } from "@/components/ui/section"
import { Container } from "@/components/ui/container"
import { getDefaultMetadata } from "@/lib/seo/metadata"

// Generar metadatos para SEO
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getDefaultMetadata("/products/photovoltaic", params.locale)
}

export default async function PhotovoltaicPage({ params: { locale } }: { params: { locale: string } }) {
  // Obtener traducciones
  const t = await getTranslations({ locale, namespace: "SolutionsSection" })

  return (
    <main className="flex-1">
      <Section
        id="photovoltaic-hero"
        heightType="content"
        fullWidth={true}
        className="bg-gradient-to-b from-blue-50 to-background dark:from-blue-950/30 dark:to-background"
      >
        <Container size="large" className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">{t("photovoltaic.title")}</h1>
            <p className="text-xl text-muted-foreground mb-8">{t("photovoltaic.subtitle")}</p>
            <div className="h-1 w-20 bg-blue-500 mx-auto rounded-full"></div>
          </div>
        </Container>
      </Section>

      <Section id="photovoltaic-content" heightType="content">
        <Container size="large" className="py-16">
          <div className="prose prose-lg dark:prose-invert max-w-3xl mx-auto">
            <p className="lead">{t("photovoltaic.description")}</p>

            {/* Aquí se puede agregar más contenido específico de la página */}
            <div className="p-6 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-950/30 mt-8">
              <h3 className="text-blue-700 dark:text-blue-300 font-medium">Página en desarrollo</h3>
              <p className="text-blue-600 dark:text-blue-400">
                Esta página está actualmente en desarrollo. Pronto se añadirá más información sobre{" "}
                {t("photovoltaic.title")}.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  )
}
