import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Section } from "@/components/ui/section"
import { Container } from "@/components/ui/container"
import { Card } from "@/components/ui/card"
import { AnimatedElement } from "@/components/AnimatedElement"
import { getDefaultMetadata } from "@/lib/seo/metadata"
import { CheckCircle, Zap, Shield, Thermometer, Wind, Factory, TrendingUp, FileText, Download, Calculator, MessageCircle } from "lucide-react"
import Image from "next/image"

// Generar metadatos para SEO
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "WindPage.meta" })

  return {
    title: t("title"),
    description: t("description"),
    ...getDefaultMetadata("/products/wind", params.locale),
  }
}

export default async function WindPage({ params: { locale } }: { params: { locale: string } }) {
  // Obtener traducciones
  const t = await getTranslations({ locale, namespace: "WindPage" })

  return (
    <main className="flex-1">
      <Section id="wind-content" heightType="content">
        <Container size="xlarge" className="py-12 md:py-16">
          {/* Hero Section con Introducción Técnica */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
            <AnimatedElement animation="slide-up" duration="slow" delay={200}>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
                  {t("hero.title")}
                </h1>
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{t("hero.power")}</div>
                    <div className="text-sm text-muted-foreground">{t("hero.powerLabel")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">{t("hero.efficiency")}</div>
                    <div className="text-sm text-muted-foreground">{t("hero.efficiencyLabel")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                      {t("hero.lifespan")}
                    </div>
                    <div className="text-sm text-muted-foreground">{t("hero.lifespanLabel")}</div>
                  </div>
                </div>
                <p className="text-lg text-muted-foreground mb-6">{t("hero.description")}</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="/contacto" className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {t("cta.contact")}
                  </a>
                </div>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="slide-up" duration="slow" delay={400}>
              <div className="relative">
                <Image
                  src="/images/wind/wind.png"
                  alt={t("hero.title")}
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </AnimatedElement>
          </div>

          {/* Especificaciones Técnicas */}
          <AnimatedElement animation="slide-up" duration="slow" delay={200}>
            <div className="mb-24">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">{t("specifications.title")}</h2>

              <Card className="p-8 mb-12">
                <div className="grid md:grid-cols-2 gap-12">
                  {/* Especificaciones Eléctricas */}
                  <AnimatedElement animation="slide-up" duration="normal" delay={300}>
                    <div>
                      <h3 className="text-xl font-semibold mb-6 flex items-center border-b pb-3">
                        <Zap className="w-6 h-6 mr-3 text-yellow-500" />
                        {t("specifications.electrical.title")}
                      </h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-muted">
                          <span className="font-medium">{t("specifications.electrical.nominalPower")}</span>
                          <span className="text-right font-semibold text-primary">3000 W</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-muted">
                          <span className="font-medium">{t("specifications.electrical.nominalVoltage")}</span>
                          <span className="text-right font-semibold text-primary">220 V</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-muted">
                          <span className="font-medium">{t("specifications.electrical.initialWindSpeed")}</span>
                          <span className="text-right">3 m/s</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-muted">
                          <span className="font-medium">{t("specifications.electrical.nominalWindSpeed")}</span>
                          <span className="text-right">11 m/s</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-muted">
                          <span className="font-medium">{t("specifications.electrical.safeWindSpeed")}</span>
                          <span className="text-right">50 m/s</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2">
                          <span className="font-medium">{t("specifications.electrical.generatorType")}</span>
                          <span className="text-right">{t("specifications.electrical.generatorTypeValue")}</span>
                        </div>
                      </div>
                    </div>
                  </AnimatedElement>

                  {/* Especificaciones Físicas */}
                  <AnimatedElement animation="slide-up" duration="normal" delay={400}>
                    <div>
                      <h3 className="text-xl font-semibold mb-6 flex items-center border-b pb-3">
                        <Shield className="w-6 h-6 mr-3 text-blue-500" />
                        {t("specifications.physical.title")}
                      </h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-muted">
                          <span className="font-medium">{t("specifications.physical.bladeDiameter")}</span>
                          <span className="text-right">4.1 m</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-muted">
                          <span className="font-medium">{t("specifications.physical.bladeCount")}</span>
                          <span className="text-right">3</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-muted">
                          <span className="font-medium">{t("specifications.physical.bladeMaterial")}</span>
                          <span className="text-right">{t("specifications.physical.bladeMaterialValue")}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-muted">
                          <span className="font-medium">{t("specifications.physical.bodyMaterial")}</span>
                          <span className="text-right">{t("specifications.physical.bodyMaterialValue")}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-muted">
                          <span className="font-medium">{t("specifications.physical.steelMaterial")}</span>
                          <span className="text-right">{t("specifications.physical.steelMaterialValue")}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-muted">
                          <span className="font-medium">{t("specifications.physical.weight")}</span>
                          <span className="text-right">95 kg / 110 kg</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2">
                          <span className="font-medium">{t("specifications.physical.protection")}</span>
                          <span className="text-right">IP54</span>
                        </div>
                      </div>
                    </div>
                  </AnimatedElement>
                </div>

                {/* Sistema de Control */}
                <AnimatedElement animation="slide-up" duration="normal" delay={500}>
                  <div className="mt-12 pt-8 border-t">
                    <h3 className="text-xl font-semibold mb-6 flex items-center">
                      <Wind className="w-6 h-6 mr-3 text-blue-500" />
                      {t("specifications.control.title")}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <div className="flex justify-between py-1">
                          <span className="font-medium">{t("specifications.control.method")}</span>
                          <span>{t("specifications.control.methodValue")}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="font-medium">{t("specifications.control.windDirection")}</span>
                          <span>{t("specifications.control.windDirectionValue")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedElement>
              </Card>
            </div>
          </AnimatedElement>

          {/* Beneficios */}
          <AnimatedElement animation="slide-up" duration="slow" delay={200}>
            <div className="mb-24">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">{t("benefits.title")}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <Card className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <Wind className="w-12 h-12 text-green-500 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{t("benefits.efficiency.title")}</h3>
                    <p className="text-muted-foreground">{t("benefits.efficiency.description")}</p>
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <Factory className="w-12 h-12 text-blue-500 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{t("benefits.versatility.title")}</h3>
                    <p className="text-muted-foreground">{t("benefits.versatility.description")}</p>
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <Shield className="w-12 h-12 text-orange-500 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{t("benefits.durability.title")}</h3>
                    <p className="text-muted-foreground">{t("benefits.durability.description")}</p>
                  </div>
                </Card>
                <Card className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <TrendingUp className="w-12 h-12 text-purple-500 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{t("benefits.safety.title")}</h3>
                    <p className="text-muted-foreground">{t("benefits.safety.description")}</p>
                  </div>
                </Card>
              </div>
            </div>
          </AnimatedElement>

          {/* CTA Section */}
          <AnimatedElement animation="slide-up" duration="slow" delay={200}>
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6">{t("cta.title")}</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">{t("cta.description")}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/contacto" className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                <MessageCircle className="w-5 h-5 mr-2" />
                {t("cta.contact")}
                </a>
              </div>
            </div>
          </AnimatedElement>
        </Container>
      </Section>
    </main>
  )
}
