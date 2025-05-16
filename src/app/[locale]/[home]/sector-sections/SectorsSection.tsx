"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { useState, useRef } from "react"
import { Section } from "@/components/ui/section"
import { Container } from "@/components/ui/container"
import { FlagIcon as Government, Building2, Factory, Home, Leaf, CheckCircle } from "lucide-react"
import { useIntersectionObserver } from "@/hooks"
import { AnimatedElement } from "@/components/AnimatedElement"
import Image from "next/image"

export default function SectorsSection() {
  const t = useTranslations("SectorsSection")
  const sectionRef = useRef<HTMLDivElement>(null)
  const observer = useIntersectionObserver()

  // Observar el elemento cuando el componente se monta
  React.useEffect(() => {
    if (sectionRef.current) {
      observer.observeElement(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserveElement(sectionRef.current)
      }
    }
  }, [observer])

  const [activeIcon, setActiveIcon] = useState<string>("public")
  const [isChanging, setIsChanging] = useState(false)

  // Función para manejar el cambio de sector con animación
  const handleSectorChange = (sectorId: string) => {
    if (activeIcon === sectorId) return

    setIsChanging(true)
    setTimeout(() => {
      setActiveIcon(sectorId)
      setTimeout(() => {
        setIsChanging(false)
      }, 100)
    }, 300)
  }

  // Datos de los sectores con imágenes
  const sectors = [
    {
      id: "public",
      icon: <Government className="h-6 w-6" />,
      title: t("public.title"),
      subtitle: t("public.subtitle"),
      description: t("public.description"),
      benefits: [t("public.benefits.benefit1"), t("public.benefits.benefit2"), t("public.benefits.benefit3")],
      bgImage: "/images/sectors/bg-public-sector.jpg",
    },
    {
      id: "commercial",
      icon: <Building2 className="h-6 w-6" />,
      title: t("commercial.title"),
      subtitle: t("commercial.subtitle"),
      description: t("commercial.description"),
      benefits: [
        t("commercial.benefits.benefit1"),
        t("commercial.benefits.benefit2"),
        t("commercial.benefits.benefit3"),
      ],
      bgImage: "/images/sectors/bg-commercial-sector.jpg",
    },
    {
      id: "industrial",
      icon: <Factory className="h-6 w-6" />,
      title: t("industrial.title"),
      subtitle: t("industrial.subtitle"),
      description: t("industrial.description"),
      benefits: [
        t("industrial.benefits.benefit1"),
        t("industrial.benefits.benefit2"),
        t("industrial.benefits.benefit3"),
      ],
      bgImage: "/images/sectors/bg-industrial-sector.jpg",
    },
    {
      id: "residential",
      icon: <Home className="h-6 w-6" />,
      title: t("residential.title"),
      subtitle: t("residential.subtitle"),
      description: t("residential.description"),
      benefits: [
        t("residential.benefits.benefit1"),
        t("residential.benefits.benefit2"),
        t("residential.benefits.benefit3"),
      ],
      bgImage: "/images/sectors/bg-residential-sector.jpg",
    },
    {
      id: "agricultural",
      icon: <Leaf className="h-6 w-6" />,
      title: t("agricultural.title"),
      subtitle: t("agricultural.subtitle"),
      description: t("agricultural.description"),
      benefits: [
        t("agricultural.benefits.benefit1"),
        t("agricultural.benefits.benefit2"),
        t("agricultural.benefits.benefit3"),
      ],
      bgImage: "/images/sectors/bg-agricultural-sector.jpg",
    },
  ]

  return (
    <Section id="sectors" heightType="content" className="relative overflow-hidden py-0" fullWidth>
      {/* Imágenes de fondo que cambian según el sector activo */}
      {sectors.map((sector) => (
        <div
          key={`bg-${sector.id}`}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
            activeIcon === sector.id ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={sector.bgImage || "/placeholder.svg?height=1080&width=1920&query=abstract green energy background"}
            alt=""
            fill
            className="object-cover"
            priority={activeIcon === sector.id}
          />
          {/* Overlay para mejorar la legibilidad del contenido */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
        </div>
      ))}

      {/* Container que delimita el ancho del contenido */}
      <Container size="xlarge"className="relative z-10 py-16 md:py-24 h-full flex flex-col overflow-hidden">
        <div ref={sectionRef} className="flex-1 flex flex-col">
          {/* Título y descripción con la misma animación que en SolutionsSection */}
          <AnimatedElement animation="slide-up" className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t("title")}</h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">{t("description")}</p>
          </AnimatedElement>

          {/* Iconos de navegación con animación */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {sectors.map((sector, index) => (
              <AnimatedElement
                key={`icon-${sector.id}`}
                animation="scale-in"
                duration="normal"
                delay={(index * 100) as any}
                className="transform transition-all duration-300 hover:scale-105"
              >
                <button
                  className={`p-4 rounded-lg flex flex-col items-center transition-all duration-300 ${
                    activeIcon === sector.id
                      ? "bg-primary text-white scale-110 shadow-lg"
                      : "bg-white/10 backdrop-blur-sm hover:bg-primary/20 text-white"
                  }`}
                  onClick={() => handleSectorChange(sector.id)}
                  aria-label={`Ver ${sector.title}`}
                >
                  {React.cloneElement(sector.icon, {
                    className: `h-12 w-12 ${activeIcon === sector.id ? "text-white" : "text-primary-100"}`,
                  })}
                  <span className="mt-2 font-medium text-base">{sector.title}</span>
                </button>
              </AnimatedElement>
            ))}
          </div>

          {/* Contenido del sector - Diseño de dos columnas con animaciones */}
          <div
            className={`flex-1 flex items-center transition-opacity duration-300 ${isChanging ? "opacity-0" : "opacity-100"}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              {sectors.map((sector) => (
                <div
                  key={`content-${sector.id}`}
                  className={`transition-all duration-500 ${
                    activeIcon === sector.id ? "opacity-100 translate-y-0" : "opacity-0 absolute -translate-y-8"
                  }`}
                >
                  {activeIcon === sector.id && (
                    <AnimatedElement animation="slide-in-left" duration="normal">
                      <div className="mb-6">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="p-4 rounded-full bg-primary/20 text-white">
                            {React.cloneElement(sector.icon, { className: "h-10 w-10" })}
                          </div>
                          <h3 className="text-4xl font-bold text-white">{sector.title}</h3>
                        </div>
                        <p className="text-2xl text-gray-200 ml-16">{sector.subtitle}</p>
                      </div>
                      <div className="ml-16">
                        <p className="text-xl text-white mb-6 leading-relaxed">{sector.description}</p>
                      </div>
                    </AnimatedElement>
                  )}
                </div>
              ))}

              {/* Beneficios - Siempre en la segunda columna */}
              {sectors.map(
                (sector) =>
                  activeIcon === sector.id && (
                    <AnimatedElement
                      key={`benefits-${sector.id}`}
                      animation="slide-in-right"
                      duration="normal"
                      className="bg-white/10 backdrop-blur-md p-6 rounded-lg self-start"
                    >
                      <h4 className="font-semibold text-2xl mb-4 text-primary-100 text-white">{t("public.benefits.title")}</h4>
                      <ul className="space-y-4">
                        {sector.benefits.map((benefit, index) => (
                          <AnimatedElement
                            key={index}
                            animation="fade-in"
                            duration="fast"
                            delay={((index + 1) * 100) as any}
                            className="flex items-start"
                          >
                            <CheckCircle className="h-7 w-7 text-primary-100 shrink-0 mt-0.5 text-white" />
                            <span className="ml-3 text-xl text-white">{benefit}</span>
                          </AnimatedElement>
                        ))}
                      </ul>
                    </AnimatedElement>
                  ),
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}


