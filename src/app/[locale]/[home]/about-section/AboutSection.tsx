"use client"

import { useTranslations } from "next-intl"
import Image from "next/image"
import { AnimatedElement } from "@/components/AnimatedElement"
import { Container } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Award, Handshake, Globe } from "lucide-react"
import { Section } from "@/components/ui/section"

export default function AboutSection() {
  const t = useTranslations("AboutSection")

  return (
    <Section id="about-us" heightType="content" fullWidth={true} className="relative bg-background">
      <Container size="large">
        {/* Header */}
        <AnimatedElement animation="fade-in" className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{t("title")}</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{t("subtitle")}</p>
        </AnimatedElement>

        {/* Misión y Visión */}
        <AnimatedElement animation="slide-up" className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center mb-4">
                <Globe className="h-6 w-6 text-primary mr-2" />
                <h3 className="text-xl font-bold">{t("mission.title")}</h3>
              </div>
              <p className="text-muted-foreground">{t("mission.description")}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center mb-4">
                <Award className="h-6 w-6 text-primary mr-2" />
                <h3 className="text-xl font-bold">{t("vision.title")}</h3>
              </div>
              <p className="text-muted-foreground">{t("vision.description")}</p>
            </div>
          </div>
        </AnimatedElement>

        {/* Representación Oficial */}
        <AnimatedElement animation="slide-up" className="mb-16">
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 md:p-8 lg:p-10">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
                <Badge className="mb-2 bg-primary">{t("partnership.badge")}</Badge>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">{t("partnership.title")}</h3>
                <p className="text-muted-foreground mb-6">{t("partnership.description")}</p>

                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{t(`partnership.benefits.benefit${i}`)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:w-1/2 w-full relative">
                <div className="relative rounded-lg overflow-hidden shadow-lg border-4 border-white w-full h-[350px] md:h-[400px]">
                  <Image
                    src="/images/about/foto-gerencia.jpg"
                    alt={t("partnership.images.signing.alt")}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover object-center"
                    priority
                    unoptimized
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white text-sm font-medium">{t("partnership.images.signing.caption")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedElement>

        {/* Título de la galería */}
        <h3 className="text-2xl font-bold mb-8 text-center">{t("gallery.title")}</h3>

        {/* Galería de Imágenes - Diseño Mejorado */}
        <div className="relative">
          {/* Primera imagen (vertical) - Más grande y destacada */}
          <div className="relative mb-8 mx-auto max-w-md">
            <AnimatedElement animation="fade-in" delay={200}>
              <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-lg border-4 border-white">
                <Image
                  src="/images/about/foto-firmando.jpg"
                  alt={t("gallery.images.signing.alt")}
                  fill
                  className="object-cover object-center"
                />
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md max-w-[90%] mx-auto -mt-12 relative z-10">
                <p className="font-medium text-center">{t("gallery.images.signing.caption")}</p>
              </div>
            </AnimatedElement>
          </div>

          {/* Contenedor para las otras dos imágenes en diseño escalonado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-12">
            {/* Segunda imagen (cuadrada) */}
            <div className="relative md:mt-12">
              <AnimatedElement animation="fade-in" delay={400}>
                <div className="aspect-square rounded-xl overflow-hidden shadow-lg border-4 border-white">
                  <Image
                    src="/images/about/foto-maqueta.jpg"
                    alt={t("gallery.images.representatives.alt")}
                    fill
                    className="object-cover object-center"
                  />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md max-w-[90%] mx-auto -mt-8 relative z-10">
                  <p className="font-medium text-center">{t("gallery.images.representatives.caption")}</p>
                </div>
              </AnimatedElement>
            </div>

            {/* Tercera imagen (panorámica) */}
            <div className="relative md:mt-12">
              <AnimatedElement animation="fade-in" delay={400}>
                <div className="aspect-square rounded-xl overflow-hidden shadow-lg border-4 border-white">
                  <Image
                    src="/images/about/foto-grupal.jpg"
                    alt={t("gallery.images.ceremony.alt")}
                    fill
                    className="object-cover object-center"
                  />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md max-w-[90%] mx-auto -mt-8 relative z-10">
                  <p className="font-medium text-center">{t("gallery.images.ceremony.caption")}</p>
                </div>
              </AnimatedElement>
            </div>
          </div>

          {/* Elemento decorativo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-primary/5 -z-10 blur-3xl"></div>
        </div>

        {/* CTA */}
        <AnimatedElement animation="fade-in" className="text-center mt-20">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">{t("cta.title")}</h3>
            <p className="text-muted-foreground mb-6">{t("cta.description")}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <a href="#contact">
                  <Handshake className="mr-2 h-5 w-5" />
                  {t("cta.primaryButton")}
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/products/bipv">{t("cta.secondaryButton")}</a>
              </Button>
            </div>
          </div>
        </AnimatedElement>
      </Container>
    </Section>
  )
}









  