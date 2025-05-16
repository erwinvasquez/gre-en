import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Section } from "@/components/ui/section"
import { Container } from "@/components/ui/container"
import { getDefaultMetadata } from "@/lib/seo/metadata"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ArrowRight, CheckCircle, Info, Zap, Settings, FileText } from "lucide-react"
import { AnimatedElement } from "@/components/AnimatedElement"

// Generar metadatos para SEO
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getDefaultMetadata("/products/bipv", params.locale)
}

export default async function BIPVPage({ params: { locale } }: { params: { locale: string } }) {
  // Obtener traducciones
  const t = await getTranslations({ locale, namespace: "BIPVPage" })

  return (
    <main className="flex-1 overflow-hidden">
      {/* Hero Section */}
      <Section id="bipv-hero" heightType="content" fullWidth={true} className="relative">
        <Container size="large" className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedElement animation="fade-in" duration="slow">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">{t("hero.title")}</h1>
              <p className="text-xl text-muted-foreground mb-8">{t("hero.subtitle")}</p>
            </AnimatedElement>
          </div>
        </Container>
      </Section>

      {/* Vidrios Fotovoltaicos */}
      <Section id="vidrios-fotovoltaicos" heightType="content">
        <Container size="large" className="py-16 overflow-hidden">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-primary">
            {t("photovoltaicGlass.title")}
          </h2>

          {/* Sección 1: ¿Qué es y Ventajas? */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-20">
            <AnimatedElement animation="slide-in-left" duration="slow" className="order-2 lg:order-1">
              <h3 className="text-2xl font-bold mb-6 flex items-center text-primary">
                <Info className="mr-3 h-6 w-6" />
                {t("photovoltaicGlass.whatIs.title")}
              </h3>
              <p className="text-lg mb-6">{t("photovoltaicGlass.whatIs.description")}</p>

              <h4 className="text-xl font-semibold mb-4">{t("photovoltaicGlass.advantages.title")}:</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium">{t("photovoltaicGlass.advantages.advantage1.title")}:</span>{" "}
                    {t("photovoltaicGlass.advantages.advantage1.description")}
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium">{t("photovoltaicGlass.advantages.advantage2.title")}:</span>{" "}
                    {t("photovoltaicGlass.advantages.advantage2.description")}
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium">{t("photovoltaicGlass.advantages.advantage3.title")}:</span>{" "}
                    {t("photovoltaicGlass.advantages.advantage3.description")}
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium">{t("photovoltaicGlass.advantages.advantage4.title")}:</span>{" "}
                    {t("photovoltaicGlass.advantages.advantage4.description")}
                  </div>
                </li>
              </ul>
            </AnimatedElement>
            <AnimatedElement
              animation="slide-in-right"
              duration="slow"
              className="order-1 lg:order-2 relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-xl"
            >
              <Image
                src="/images/bipv/photovoltaic-glass-building.png"
                alt="Edificio con vidrios fotovoltaicos integrados"
                fill
                className="object-cover"
              />
            </AnimatedElement>
          </div>

          {/* Sección 2: ¿Cómo Funciona? */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-20">
            <AnimatedElement
              animation="slide-up"
              duration="slow"
              className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-xl"
            >
              <Image
                src="/images/bipv/diagram.png"
                alt="Diagrama de funcionamiento de vidrios fotovoltaicos"
                fill
                className="object-contain"
              />
            </AnimatedElement>
            <AnimatedElement animation="slide-up" duration="slow">
              <h3 className="text-2xl font-bold mb-6 flex items-center text-primary">
                <Zap className="mr-3 h-6 w-6" />
                {t("photovoltaicGlass.howItWorks.title")}
              </h3>
              <h4 className="text-xl font-semibold mb-4">{t("photovoltaicGlass.howItWorks.subtitle")}</h4>
              <p className="text-lg mb-4">{t("photovoltaicGlass.howItWorks.description1")}</p>
              <p className="text-lg mb-4">{t("photovoltaicGlass.howItWorks.description2")}</p>
              <p className="text-lg">{t("photovoltaicGlass.howItWorks.description3")}</p>
            </AnimatedElement>
          </div>

          {/* Sección 3: Información Técnica */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-12">
            <AnimatedElement animation="slide-in-left" duration="slow" className="order-2 lg:order-1">
              <h3 className="text-2xl font-bold mb-6 flex items-center text-primary">
                <Settings className="mr-3 h-6 w-6" />
                {t("photovoltaicGlass.technical.title")}
              </h3>

              <h4 className="text-xl font-semibold mb-4">{t("photovoltaicGlass.technical.specifications.title")}:</h4>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <FileText className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium">{t("photovoltaicGlass.technical.specifications.spec1.title")}:</span>{" "}
                    {t("photovoltaicGlass.technical.specifications.spec1.description")}
                  </div>
                </li>
                <li className="flex items-start">
                  <FileText className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium">{t("photovoltaicGlass.technical.specifications.spec2.title")}:</span>{" "}
                    {t("photovoltaicGlass.technical.specifications.spec2.description")}
                  </div>
                </li>
              </ul>

              <h4 className="text-xl font-semibold mb-4">{t("photovoltaicGlass.technical.applications.title")}:</h4>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
                  <div>{t("photovoltaicGlass.technical.applications.app1")}</div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
                  <div>{t("photovoltaicGlass.technical.applications.app2")}</div>
                </li>
              </ul>

              <h4 className="text-xl font-semibold mb-4">{t("photovoltaicGlass.technical.variety.title")}:</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
                  <div>{t("photovoltaicGlass.technical.variety.point1")}</div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
                  <div>{t("photovoltaicGlass.technical.variety.point2")}</div>
                </li>
              </ul>
            </AnimatedElement>
            <AnimatedElement
              animation="slide-in-right"
              duration="slow"
              className="order-1 lg:order-2 relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-xl"
            >
              <Image
                src="/images/bipv/photovoltaic-glass-transparency.png"
                alt="Especificaciones técnicas de vidrios fotovoltaicos"
                fill
                className="object-cover"
              />
            </AnimatedElement>
          </div>

          {/* CTA para Vidrios Fotovoltaicos */}
          <AnimatedElement animation="fade-in" duration="slow" className="text-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              {t("photovoltaicGlass.cta")} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </AnimatedElement>
        </Container>
      </Section>

      {/* Teja Solar (Placeholder) */}
      <Section id="teja-solar" heightType="content">
        <Container size="large" className="py-16 overflow-hidden">
          <AnimatedElement animation="fade-in" duration="slow">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-primary">{t("solarTile.title")}</h2>

            <div className="p-8 rounded-lg text-center">
              <p className="text-lg text-muted-foreground mb-6">{t("solarTile.comingSoon")}</p>
              <Button variant="outline">{t("solarTile.moreInfo")}</Button>
            </div>
          </AnimatedElement>
        </Container>
      </Section>

      {/* Panel Techo Solar */}
      <Section id="panel-techo-solar" heightType="content">
        <Container size="large" className="py-16 overflow-hidden">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-primary">{t("solarRoofPanel.title")}</h2>

          {/* Sección 1: ¿Qué es y Ventajas? */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-20">
            <AnimatedElement animation="slide-in-left" duration="slow" className="order-2 lg:order-1">
              <h3 className="text-2xl font-bold mb-6 flex items-center text-primary">
                <Info className="mr-3 h-6 w-6" />
                {t("solarRoofPanel.whatIs.title")}
              </h3>
              <p className="text-lg mb-6">{t("solarRoofPanel.whatIs.description")}</p>

              <h4 className="text-xl font-semibold mb-4">{t("solarRoofPanel.advantages.title")}:</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium">{t("solarRoofPanel.advantages.advantage1.title")}:</span>{" "}
                    {t("solarRoofPanel.advantages.advantage1.description")}
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium">{t("solarRoofPanel.advantages.advantage2.title")}:</span>{" "}
                    {t("solarRoofPanel.advantages.advantage2.description")}
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium">{t("solarRoofPanel.advantages.advantage3.title")}:</span>{" "}
                    {t("solarRoofPanel.advantages.advantage3.description")}
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium">{t("solarRoofPanel.advantages.advantage4.title")}:</span>{" "}
                    {t("solarRoofPanel.advantages.advantage4.description")}
                  </div>
                </li>
              </ul>
            </AnimatedElement>
            <AnimatedElement
              animation="slide-in-right"
              duration="slow"
              className="order-1 lg:order-2 relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-xl"
            >
              <Image
                src="/images/bipv/solar-roof-panel.png"
                alt="Panel de techo solar instalado en edificio moderno"
                fill
                className="object-cover"
              />
            </AnimatedElement>
          </div>

          {/* Sección 2: ¿Cómo Funciona? */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-20">
            <AnimatedElement
              animation="slide-up"
              duration="slow"
              className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-xl"
            >
              <Image
                src="/images/bipv/solar-roof-diagram.png"
                alt="Diagrama de funcionamiento del panel de techo solar"
                fill
                className="object-contain"
              />
            </AnimatedElement>
            <AnimatedElement animation="slide-up" duration="slow">
              <h3 className="text-2xl font-bold mb-6 flex items-center text-primary">
                <Zap className="mr-3 h-6 w-6" />
                {t("solarRoofPanel.howItWorks.title")}
              </h3>
              <h4 className="text-xl font-semibold mb-4">{t("solarRoofPanel.howItWorks.subtitle")}</h4>
              <p className="text-lg mb-4">{t("solarRoofPanel.howItWorks.description1")}</p>
              <p className="text-lg">{t("solarRoofPanel.howItWorks.description2")}</p>
            </AnimatedElement>
          </div>

          {/* Sección 3: Información Técnica */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-12">
            <AnimatedElement animation="slide-in-left" duration="slow" className="order-2 lg:order-1">
              <h3 className="text-2xl font-bold mb-6 flex items-center text-primary">
                <Settings className="mr-3 h-6 w-6" />
                {t("solarRoofPanel.technical.title")}
              </h3>

              <h4 className="text-xl font-semibold mb-4">{t("solarRoofPanel.technical.specifications.title")}:</h4>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <FileText className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium">{t("solarRoofPanel.technical.specifications.spec1.title")}:</span>{" "}
                    {t("solarRoofPanel.technical.specifications.spec1.description")}
                  </div>
                </li>
                <li className="flex items-start">
                  <FileText className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium">{t("solarRoofPanel.technical.specifications.spec2.title")}:</span>{" "}
                    {t("solarRoofPanel.technical.specifications.spec2.description")}
                  </div>
                </li>
                <li className="flex items-start">
                  <FileText className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium">{t("solarRoofPanel.technical.specifications.spec3.title")}:</span>{" "}
                    {t("solarRoofPanel.technical.specifications.spec3.description")}
                  </div>
                </li>
                <li className="flex items-start">
                  <FileText className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium">{t("solarRoofPanel.technical.specifications.spec4.title")}:</span>{" "}
                    {t("solarRoofPanel.technical.specifications.spec4.description")}
                  </div>
                </li>
                <li className="flex items-start">
                  <FileText className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium">{t("solarRoofPanel.technical.specifications.spec5.title")}:</span>{" "}
                    {t("solarRoofPanel.technical.specifications.spec5.description")}
                  </div>
                </li>
                <li className="flex items-start">
                  <FileText className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium">{t("solarRoofPanel.technical.specifications.spec6.title")}:</span>{" "}
                    {t("solarRoofPanel.technical.specifications.spec6.description")}
                  </div>
                </li>
              </ul>
            </AnimatedElement>
            <AnimatedElement
              animation="slide-in-right"
              duration="slow"
              className="order-1 lg:order-2 relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-xl"
            >
              <Image
                src="/images/bipv/solar-roof-specs.png"
                alt="Especificaciones técnicas del panel de techo solar"
                fill
                className="object-cover"
              />
            </AnimatedElement>
          </div>

          {/* CTA para Panel Techo Solar */}
          <AnimatedElement animation="fade-in" duration="slow" className="text-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              {t("solarRoofPanel.cta")} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </AnimatedElement>
        </Container>
      </Section>

      {/* Panel Solar Portátil */}
      <Section id="portatil" heightType="content">
        <Container size="large" className="py-16 overflow-hidden">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-primary">
            {t("portableSolarPanel.title")}
          </h2>

          {/* Sección 1: ¿Qué es y Ventajas? */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-20">
            <AnimatedElement animation="slide-in-left" duration="slow" className="order-2 lg:order-1">
              <h3 className="text-2xl font-bold mb-6 flex items-center text-primary">
                <Info className="mr-3 h-6 w-6" />
                {t("portableSolarPanel.whatIs.title")}
              </h3>
              <p className="text-lg mb-6">{t("portableSolarPanel.whatIs.description")}</p>

              <h4 className="text-xl font-semibold mb-4">{t("portableSolarPanel.advantages.title")}:</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium">{t("portableSolarPanel.advantages.advantage1.title")}:</span>{" "}
                    {t("portableSolarPanel.advantages.advantage1.description")}
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium">{t("portableSolarPanel.advantages.advantage2.title")}:</span>{" "}
                    {t("portableSolarPanel.advantages.advantage2.description")}
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium">{t("portableSolarPanel.advantages.advantage3.title")}:</span>{" "}
                    {t("portableSolarPanel.advantages.advantage3.description")}
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium">{t("portableSolarPanel.advantages.advantage4.title")}:</span>{" "}
                    {t("portableSolarPanel.advantages.advantage4.description")}
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium">{t("portableSolarPanel.advantages.advantage5.title")}:</span>{" "}
                    {t("portableSolarPanel.advantages.advantage5.description")}
                  </div>
                </li>
              </ul>
            </AnimatedElement>
            <AnimatedElement
              animation="slide-in-right"
              duration="slow"
              className="order-1 lg:order-2 relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-xl"
            >
              <Image
                src="/images/bipv/balcon.png"
                alt="Panel solar portátil instalado en un balcón"
                fill
                className="object-cover"
              />
            </AnimatedElement>
          </div>

          {/* Sección 2: ¿Cómo Funciona? */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-20">
            <AnimatedElement
              animation="slide-up"
              duration="slow"
              className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-xl"
            >
              <Image
                src="/images/bipv/noes .png"
                alt="Diagrama de instalación del panel solar portátil"
                fill
                className="object-contain"
              />
            </AnimatedElement>
            <AnimatedElement animation="slide-up" duration="slow">
              <h3 className="text-2xl font-bold mb-6 flex items-center text-primary">
                <Zap className="mr-3 h-6 w-6" />
                {t("portableSolarPanel.howItWorks.title")}
              </h3>
              <h4 className="text-xl font-semibold mb-4">{t("portableSolarPanel.howItWorks.subtitle")}</h4>
              <p className="text-lg mb-4">{t("portableSolarPanel.howItWorks.description1")}</p>
              <p className="text-lg mb-4">{t("portableSolarPanel.howItWorks.description2")}</p>
              <ol className="list-decimal pl-5 space-y-2 mb-4">
                <li className="text-lg">{t("portableSolarPanel.howItWorks.step1")}</li>
                <li className="text-lg">{t("portableSolarPanel.howItWorks.step2")}</li>
                <li className="text-lg">{t("portableSolarPanel.howItWorks.step3")}</li>
              </ol>
              <p className="text-lg">
                <span className="font-medium">{t("portableSolarPanel.howItWorks.keyBenefit")}</span>
              </p>
            </AnimatedElement>
          </div>

          {/* Sección 3: Información Técnica */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-12">
            <AnimatedElement animation="slide-in-left" duration="slow" className="order-2 lg:order-1">
              <h3 className="text-2xl font-bold mb-6 flex items-center text-primary">
                <Settings className="mr-3 h-6 w-6" />
                {t("portableSolarPanel.technical.title")}
              </h3>

              <h4 className="text-xl font-semibold mb-4">{t("portableSolarPanel.technical.features.title")}:</h4>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <FileText className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium">{t("portableSolarPanel.technical.features.feature1.title")}:</span>{" "}
                    {t("portableSolarPanel.technical.features.feature1.description")}
                  </div>
                </li>
                <li className="flex items-start">
                  <FileText className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium">{t("portableSolarPanel.technical.features.feature2.title")}:</span>{" "}
                    {t("portableSolarPanel.technical.features.feature2.description")}
                  </div>
                </li>
                <li className="flex items-start">
                  <FileText className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium">{t("portableSolarPanel.technical.features.feature3.title")}:</span>{" "}
                    {t("portableSolarPanel.technical.features.feature3.description")}
                  </div>
                </li>
                <li className="flex items-start">
                  <FileText className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium">{t("portableSolarPanel.technical.features.feature4.title")}:</span>{" "}
                    {t("portableSolarPanel.technical.features.feature4.description")}
                  </div>
                </li>
              </ul>

              <h4 className="text-xl font-semibold mb-4">{t("portableSolarPanel.technical.warranty.title")}:</h4>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium">{t("portableSolarPanel.technical.warranty.point1.title")}:</span>{" "}
                    {t("portableSolarPanel.technical.warranty.point1.description")}
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-medium">{t("portableSolarPanel.technical.warranty.point2.title")}:</span>{" "}
                    {t("portableSolarPanel.technical.warranty.point2.description")}
                  </div>
                </li>
              </ul>

              <h4 className="text-xl font-semibold mb-4">{t("portableSolarPanel.technical.applications.title")}:</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
                  <div>{t("portableSolarPanel.technical.applications.app1")}</div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
                  <div>{t("portableSolarPanel.technical.applications.app2")}</div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
                  <div>{t("portableSolarPanel.technical.applications.app3")}</div>
                </li>
              </ul>
            </AnimatedElement>
            <AnimatedElement
              animation="slide-in-right"
              duration="slow"
              className="order-1 lg:order-2 relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-xl"
            >
              <Image
                src="/images/bipv/balcon2.png"
                alt="Aplicaciones del panel solar portátil"
                fill
                className="object-cover"
              />
            </AnimatedElement>
          </div>

          {/* CTA para Panel Solar Portátil */}
          <AnimatedElement animation="fade-in" duration="slow" className="text-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              {t("portableSolarPanel.cta")} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </AnimatedElement>
        </Container>
      </Section>

      {/* Sección de Contacto */}
      <Section id="bipv-contact" heightType="content">
        <Container size="large" className="py-16 overflow-hidden">
          <AnimatedElement animation="fade-in" duration="slow" className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t("contact.title")}</h2>
            <p className="text-xl mb-8">{t("contact.description")}</p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              {t("contact.button")} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </AnimatedElement>
        </Container>
      </Section>
    </main>
  )
}




