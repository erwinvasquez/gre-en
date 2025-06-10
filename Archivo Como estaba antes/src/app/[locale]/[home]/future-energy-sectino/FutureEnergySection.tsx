"use client"

import { useTranslations } from "next-intl"
import { Lightbulb, Leaf, Home, TrendingUp, Shield } from "lucide-react"
import { Section } from "@/components/ui/section"
import { AnimatedElement } from "@/components/AnimatedElement"
import { useTheme } from "next-themes"
import { Container } from "@/components/ui/container"
import Image from "next/image"

export default function FutureEnergySection() {
  const t = useTranslations("FutureEnergySection")
  const { theme } = useTheme()

  // Determinar la opacidad basada en el tema actual
  const overlayOpacity = theme === "dark" ? "bg-background/90" : "bg-background/60"

  const solutions = [
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: t("solution1.title"),
      subtitle: t("solution1.subtitle"),
      description: t("solution1.description"),
      color: "var(--solution-1)",
      animation: "slide-in-left" as const,
    },
    {
      icon: <Leaf className="h-8 w-8" />,
      title: t("solution2.title"),
      subtitle: t("solution2.subtitle"),
      description: t("solution2.description"),
      color: "var(--solution-2)",
      animation: "slide-up" as const,
    },
    {
      icon: <Home className="h-8 w-8" />,
      title: t("solution3.title"),
      subtitle: t("solution3.subtitle"),
      description: t("solution3.description"),
      color: "var(--solution-3)",
      animation: "slide-in-right" as const,
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: t("solution4.title"),
      subtitle: t("solution4.subtitle"),
      description: t("solution4.description"),
      color: "var(--solution-1)",
      animation: "slide-in-left" as const,
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: t("solution5.title"),
      subtitle: t("solution5.subtitle"),
      description: t("solution5.description"),
      color: "var(--solution-3)",
      animation: "slide-in-right" as const,
    },
  ]

  return (
    <Section id="future-energy" heightType="content" fullWidth={true} className="relative">
      {/* Imagen de fondo con superposición */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image src="/images/background-light2.jpg" alt="Background" fill className="object-cover" priority />
        {/* Superposición con opacidad dinámica según el tema */}
        <div className={`absolute inset-0 ${overlayOpacity}`}></div>
      </div>

      <Container size="large" className="py-16 md:py-24 relative z-10 overflow-hidden">
        {/* Título y descripción sin delay */}
        <AnimatedElement animation="slide-up" className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-6">{t("header")}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t("description")}</p>
        </AnimatedElement>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
          {/* Primera fila - 3 elementos con animaciones escalonadas */}
          {solutions.slice(0, 3).map((solution, index) => (
            <AnimatedElement
              key={index}
              animation={solution.animation}
              index={index}
              staggerDelay={850}
              className="flex group"
            >
              <div
                className="p-4 rounded-full mr-6 h-16 w-16 flex items-center justify-center flex-shrink-0 text-white shadow-md transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:shadow-lg"
                style={{ backgroundColor: solution.color }}
              >
                <div className="transition-transform duration-300 ease-in-out group-hover:rotate-12">
                  {solution.icon}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-2xl text-foreground mb-2">{solution.title}</h3>
                <p className="text-lg text-muted-foreground font-medium mb-3">{solution.subtitle}</p>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{solution.description}</p>
              </div>
            </AnimatedElement>
          ))}

          {/* Segunda fila - 2 elementos centrados con animaciones escalonadas */}
          <div className="md:col-span-3 flex flex-col md:flex-row justify-center gap-16 mt-4">
            {solutions.slice(3, 5).map((solution, index) => (
              <AnimatedElement
                key={index + 3}
                animation={solution.animation}
                index={index + 3}
                staggerDelay={850}
                className="flex max-w-md group"
              >
                <div
                  className="p-4 rounded-full mr-6 h-16 w-16 flex items-center justify-center flex-shrink-0 text-white shadow-md transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:shadow-lg"
                  style={{ backgroundColor: solution.color }}
                >
                  <div className="transition-transform duration-300 ease-in-out group-hover:rotate-12">
                    {solution.icon}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-2xl text-foreground mb-2">{solution.title}</h3>
                  <p className="text-lg text-muted-foreground font-medium mb-3">{solution.subtitle}</p>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{solution.description}</p>
                </div>
              </AnimatedElement>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}


