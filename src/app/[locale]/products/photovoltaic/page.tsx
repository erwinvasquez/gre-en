import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Section } from "@/components/ui/section"
import { Container } from "@/components/ui/container"
import { Card } from "@/components/ui/card"
import { AnimatedElement } from "@/components/AnimatedElement"
import { getDefaultMetadata } from "@/lib/seo/metadata"
import { CheckCircle, Zap, Shield, Thermometer, Sun, Factory, TrendingUp, FileText, Download, Calculator, MessageCircle } from "lucide-react"
import Image from "next/image"

// Generar metadatos para SEO
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: "PhotovoltaicPage.meta" })

  return {
    title: t("title"),
    description: t("description"),
    ...getDefaultMetadata("/products/photovoltaic", params.locale),
  }
}

export default async function PhotovoltaicPage({ params: { locale } }: { params: { locale: string } }) {
  // Obtener traducciones
  const t = await getTranslations({ locale, namespace: "PhotovoltaicPage" })

  return (
    <main className="flex-1">
      <Section id="photovoltaic-content" heightType="content">
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
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{t("hero.powerRange")}</div>
                    <div className="text-sm text-muted-foreground">{t("hero.powerLabel")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">{t("hero.efficiency")}</div>
                    <div className="text-sm text-muted-foreground">{t("hero.efficiencyLabel")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                      {t("hero.bifacialGain")}
                    </div>
                    <div className="text-sm text-muted-foreground">{t("hero.bifacialLabel")}</div>
                  </div>
                </div>
                <p className="text-lg text-muted-foreground mb-6">{t("hero.description")}</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="/calculadora" className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                    <Calculator className="w-5 h-5 mr-2" />
                    {t("cta.calc")}
                  </a>
                </div>
              </div>
            </AnimatedElement>

            <AnimatedElement animation="slide-up" duration="slow" delay={400}>
              <div className="relative">
                <Image
                  src="/images/photovoltaic/1.png"
                  alt={t("hero.title")}
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </AnimatedElement>
          </div>

          {/* Sección de Tecnología TOPCon */}
          <AnimatedElement animation="slide-up" duration="slow" delay={200}>
            <div className="mb-24">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("technology.title")}</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t("technology.subtitle")}</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12 mb-16">
                <AnimatedElement animation="slide-up" duration="normal" delay={300}>
                  <div className="relative">
                    <Image
                      src="/images/photovoltaic/TOPCon.png"
                      alt="Diagrama tecnología TOPCon"
                      width={600}
                      height={400}
                      className="rounded-lg shadow-md"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg p-3">
                      <div className="text-sm font-medium">TOPCon Structure</div>
                      <div className="text-xs text-muted-foreground">Passivated Contact</div>
                    </div>
                  </div>
                </AnimatedElement>

                <AnimatedElement animation="slide-up" duration="normal" delay={400}>
                  <div>
                    <h3 className="text-2xl font-semibold mb-6">{t("technology.whatIs.title")}</h3>
                    <div className="space-y-4 text-muted-foreground">
                      <p>
                        <strong className="text-foreground">TOPCon (Tunnel Oxide Passivated Contact)</strong>{" "}
                        {t("technology.whatIs.description1")}
                      </p>
                      <p>{t("technology.whatIs.description2")}</p>
                    </div>
                    <div className="mt-8 grid grid-cols-2 gap-6">
                      <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {t("technology.whatIs.degradation")}
                        </div>
                        <div className="text-sm text-green-700 dark:text-green-300">
                          {t("technology.whatIs.degradationLabel")}
                        </div>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {t("technology.whatIs.lifespan")}
                        </div>
                        <div className="text-sm text-blue-700 dark:text-blue-300">
                          {t("technology.whatIs.lifespanLabel")}
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedElement>
              </div>
            </div>
          </AnimatedElement>

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
                          <span className="text-right font-semibold text-primary">
                            {t("specifications.electrical.nominalPowerValue")}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-muted">
                          <span className="font-medium">{t("specifications.electrical.moduleEfficiency")}</span>
                          <span className="text-right font-semibold text-primary">
                            {t("specifications.electrical.moduleEfficiencyValue")}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-muted">
                          <span className="font-medium">{t("specifications.electrical.voltagePmax")}</span>
                          <span className="text-right">{t("specifications.electrical.voltagePmaxValue")}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-muted">
                          <span className="font-medium">{t("specifications.electrical.currentPmax")}</span>
                          <span className="text-right">{t("specifications.electrical.currentPmaxValue")}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-muted">
                          <span className="font-medium">{t("specifications.electrical.openCircuitVoltage")}</span>
                          <span className="text-right">{t("specifications.electrical.openCircuitVoltageValue")}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-muted">
                          <span className="font-medium">{t("specifications.electrical.shortCircuitCurrent")}</span>
                          <span className="text-right">{t("specifications.electrical.shortCircuitCurrentValue")}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2">
                          <span className="font-medium">{t("specifications.electrical.bifacialGain")}</span>
                          <span className="text-right font-semibold text-green-600">
                            {t("specifications.electrical.bifacialGainValue")}
                          </span>
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
                          <span className="font-medium">{t("specifications.physical.cellType")}</span>
                          <span className="text-right font-semibold text-primary">
                            {t("specifications.physical.cellTypeValue")}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-muted">
                          <span className="font-medium">{t("specifications.physical.technology")}</span>
                          <span className="text-right font-semibold text-primary">
                            {t("specifications.physical.technologyValue")}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-muted">
                          <span className="font-medium">{t("specifications.physical.cellSize")}</span>
                          <span className="text-right">{t("specifications.physical.cellSizeValue")}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-muted">
                          <span className="font-medium">{t("specifications.physical.configuration")}</span>
                          <span className="text-right">{t("specifications.physical.configurationValue")}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-muted">
                          <span className="font-medium">{t("specifications.physical.dimensions")}</span>
                          <span className="text-right">{t("specifications.physical.dimensionsValue")}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2 border-b border-muted">
                          <span className="font-medium">{t("specifications.physical.weight")}</span>
                          <span className="text-right">{t("specifications.physical.weightValue")}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 py-2">
                          <span className="font-medium">{t("specifications.physical.frame")}</span>
                          <span className="text-right">{t("specifications.physical.frameValue")}</span>
                        </div>
                      </div>
                    </div>
                  </AnimatedElement>
                </div>

                {/* Condiciones Ambientales */}
                <AnimatedElement animation="slide-up" duration="normal" delay={500}>
                  <div className="mt-12 pt-8 border-t">
                    <h3 className="text-xl font-semibold mb-6 flex items-center">
                      <Thermometer className="w-6 h-6 mr-3 text-red-500" />
                      {t("specifications.environmental.title")}
                    </h3>
                    <div className="grid md:grid-cols-3 gap-8">
                      <div className="space-y-3">
                        <div className="flex justify-between py-1">
                          <span className="font-medium">{t("specifications.environmental.operatingTemp")}</span>
                          <span>{t("specifications.environmental.operatingTempValue")}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="font-medium">{t("specifications.environmental.connectors")}</span>
                          <span>{t("specifications.environmental.connectorsValue")}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between py-1">
                          <span className="font-medium">{t("specifications.environmental.frontGlass")}</span>
                          <span>{t("specifications.environmental.frontGlassValue")}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="font-medium">{t("specifications.environmental.backGlass")}</span>
                          <span>{t("specifications.environmental.backGlassValue")}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between py-1">
                          <span className="font-medium">{t("specifications.environmental.certifications")}</span>
                          <span className="text-sm">{t("specifications.environmental.certificationsValue")}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="font-medium">{t("specifications.environmental.iso")}</span>
                          <span className="text-sm">{t("specifications.environmental.isoValue")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedElement>
              </Card>
            </div>
          </AnimatedElement>

          {/* Rendimiento y Beneficios */}
          <AnimatedElement animation="slide-up" duration="slow" delay={200}>
            <div className="mb-24">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">{t("performance.title")}</h2>

              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <AnimatedElement animation="slide-up" duration="normal" delay={300}>
                  <div>
                    <h3 className="text-2xl font-semibold mb-6">{t("performance.subtitle")}</h3>
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">{t("performance.advantages.energyGeneration.title")}</h4>
                          <p className="text-muted-foreground">
                            {t("performance.advantages.energyGeneration.description")}
                          </p>
                          <div className="text-sm font-medium text-green-600 dark:text-green-400 mt-2">
                            {t("performance.advantages.energyGeneration.metrics")}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">{t("performance.advantages.degradation.title")}</h4>
                          <p className="text-muted-foreground">{t("performance.advantages.degradation.description")}</p>
                          <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-2">
                            {t("performance.advantages.degradation.metrics")}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Thermometer className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">{t("performance.advantages.thermal.title")}</h4>
                          <p className="text-muted-foreground">{t("performance.advantages.thermal.description")}</p>
                          <div className="text-sm font-medium text-orange-600 dark:text-orange-400 mt-2">
                            {t("performance.advantages.thermal.metrics")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedElement>

                <AnimatedElement animation="slide-up" duration="normal" delay={400}>
                  <div className="relative">
                    <Image
                      src="/images/photovoltaic/Rendimiento.png"
                      alt="Gráfico de rendimiento comparativo"
                      width={600}
                      height={400}
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </AnimatedElement>
              </div>
            </div>
          </AnimatedElement>

          {/* Aplicaciones Optimizadas */}
          <AnimatedElement animation="slide-up" duration="slow" delay={200}>
            <div className="mb-24">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">{t("applications.title")}</h2>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <AnimatedElement animation="slide-up" duration="normal" delay={300} index={0} staggerDelay={100}>
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Factory className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-3">{t("applications.utilityScale.title")}</h3>
                        <p className="text-muted-foreground mb-4">{t("applications.utilityScale.description")}</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>{t("applications.utilityScale.recommendedPower")}</span>
                            <span className="font-medium">{t("applications.utilityScale.recommendedPowerValue")}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{t("applications.utilityScale.roi")}</span>
                            <span className="font-medium text-green-600">
                              {t("applications.utilityScale.roiValue")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </AnimatedElement>

                <AnimatedElement animation="slide-up" duration="normal" delay={300} index={1} staggerDelay={100}>
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-3">{t("applications.industrial.title")}</h3>
                        <p className="text-muted-foreground mb-4">{t("applications.industrial.description")}</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>{t("applications.industrial.recommendedPower")}</span>
                            <span className="font-medium">{t("applications.industrial.recommendedPowerValue")}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{t("applications.industrial.energySaving")}</span>
                            <span className="font-medium text-green-600">
                              {t("applications.industrial.energySavingValue")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </AnimatedElement>

                <AnimatedElement animation="slide-up" duration="normal" delay={300} index={2} staggerDelay={100}>
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Sun className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-3">{t("applications.groundMounted.title")}</h3>
                        <p className="text-muted-foreground mb-4">{t("applications.groundMounted.description")}</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>{t("applications.groundMounted.bifacialGain")}</span>
                            <span className="font-medium text-yellow-600">
                              {t("applications.groundMounted.bifacialGainValue")}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>{t("applications.groundMounted.recommendedHeight")}</span>
                            <span className="font-medium">
                              {t("applications.groundMounted.recommendedHeightValue")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </AnimatedElement>

                <AnimatedElement animation="slide-up" duration="normal" delay={300} index={3} staggerDelay={100}>
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-3">{t("applications.extreme.title")}</h3>
                        <p className="text-muted-foreground mb-4">{t("applications.extreme.description")}</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>{t("applications.extreme.thermalRange")}</span>
                            <span className="font-medium">{t("applications.extreme.thermalRangeValue")}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{t("applications.extreme.snowLoad")}</span>
                            <span className="font-medium">{t("applications.extreme.snowLoadValue")}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </AnimatedElement>
              </div>
            </div>
          </AnimatedElement>

          {/* Botones de acción al final */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
            <a href="/calculadora" className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              <Calculator className="w-5 h-5 mr-2" />
              {t("cta.calc")}
            </a>
            <a href="/contacto" className="inline-flex items-center px-6 py-3 border border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition-colors">
              <MessageCircle className="w-5 h-5 mr-2" />
              {t("cta.contact")}
            </a>
          </div>
        </Container>
      </Section>
    </main>
  )
}



