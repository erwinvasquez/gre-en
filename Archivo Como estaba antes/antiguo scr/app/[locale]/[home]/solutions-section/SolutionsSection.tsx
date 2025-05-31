"use client"

import { useTranslations } from "next-intl"
import { Section } from "@/components/ui/section"
import { Container } from "@/components/ui/container"
import { AnimatedElement } from "@/components/AnimatedElement"
import { CheckCircle, ArrowUpRight, Zap, Shield, BarChart3 } from "lucide-react"
import Image from "next/image"
import { useTheme } from "next-themes"
import { Link } from "@/i18n/routing"

export default function SolutionsSection() {
  const t = useTranslations("SolutionsSection")
  const { theme } = useTheme()

  // Determinar la opacidad basada en el tema
  const overlayOpacity = theme === "dark" ? "opacity-80" : "opacity-60"
  const decorativeOpacity = theme === "dark" ? "opacity-90" : "opacity-70"
  const bgOverlayOpacity = theme === "dark" ? "bg-background/90" : "bg-background/70"

  const solutions = [
    {
      id: "bipv",
      title: t("bipv.title"),
      subtitle: t("bipv.subtitle"),
      description: t("bipv.description"),
      image: "/images/solutions/bipv-solution.jpg",
      icon: <Zap className="h-6 w-6" />,
      features: [t("bipv.features.feature1"), t("bipv.features.feature2"), t("bipv.features.feature3")],
      ctaText: t("bipv.cta"),
      accentColor: "from-emerald-500 to-green-600",
      lightBg: "bg-emerald-50",
      darkBg: "dark:bg-emerald-950/30",
      borderColor: "border-emerald-200 dark:border-emerald-800",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/50",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      id: "photovoltaic",
      title: t("photovoltaic.title"),
      subtitle: t("photovoltaic.subtitle"),
      description: t("photovoltaic.description"),
      image: "/images/solutions/photovoltaic-solution.jpg",
      icon: <BarChart3 className="h-6 w-6" />,
      features: [
        t("photovoltaic.features.feature1"),
        t("photovoltaic.features.feature2"),
        t("photovoltaic.features.feature3"),
      ],
      ctaText: t("photovoltaic.cta"),
      accentColor: "from-lime-500 to-green-500",
      lightBg: "bg-lime-50",
      darkBg: "dark:bg-lime-900/30",
      borderColor: "border-lime-200 dark:border-lime-800",
      iconBg: "bg-lime-100 dark:bg-lime-900/50",
      iconColor: "text-lime-600 dark:text-lime-400",
    },
    {
      id: "wind",
      title: t("wind.title"),
      subtitle: t("wind.subtitle"),
      description: t("wind.description"),
      image: "/images/solutions/wind-solution.jpg",
      icon: <Shield className="h-6 w-6" />,
      features: [t("wind.features.feature1"), t("wind.features.feature2"), t("wind.features.feature3")],
      ctaText: t("wind.cta"),
      accentColor: "from-teal-500 to-cyan-600",
      lightBg: "bg-teal-50",
      darkBg: "dark:bg-teal-950/30",
      borderColor: "border-teal-200 dark:border-teal-800",
      iconBg: "bg-teal-100 dark:bg-teal-900/50",
      iconColor: "text-teal-600 dark:text-teal-400",
    },
  ]

  // Función para determinar la animación según el índice
  const getAnimationByIndex = (index: number) => {
    switch (index) {
      case 0:
        return "slide-in-left" // Tarjeta izquierda entra desde la izquierda
      case 1:
        return "slide-up" // Tarjeta central entra desde abajo
      case 2:
        return "slide-in-right" // Tarjeta derecha entra desde la derecha
      default:
        return "fade-in"
    }
  }

  return (
    <Section id="solutions" heightType="content" fullWidth={true} className="relative bg-background">
      {/* Imagen de fondo con superposición */}
      <div className="absolute inset-0 z-0">
        <Image src="/images/background-light.jpg" alt="Background" fill className="object-cover" priority />
        <div className={`absolute inset-0 ${bgOverlayOpacity}`}></div>
      </div>

      <Container size="xlarge" className="py-16 md:py-24 relative z-10 overflow-hidden">
        <AnimatedElement animation="slide-up" className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-6">{t("header")}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t("description")}</p>
        </AnimatedElement>

        {/* Solutions Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {solutions.map((solution, index) => (
            <AnimatedElement
              key={solution.id}
              animation={getAnimationByIndex(index)}
              index={index}
              staggerDelay={500}
              className="flex flex-col h-full"
            >
              <div
                className={`
                  relative h-full rounded-xl overflow-hidden
                  ${solution.lightBg} ${solution.darkBg}
                  border ${solution.borderColor}
                  transition-all duration-300 ease-out
                  hover:shadow-xl hover:-translate-y-1
                  group
                `}
              >
                {/* Card Header with Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={solution.image || "/placeholder.svg"}
                    alt={solution.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r ${solution.accentColor} ${overlayOpacity}`}></div>

                  {/* Title Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <div className="flex items-center mb-2">
                      <div className={`p-2 rounded-full ${solution.iconBg} ${solution.iconColor} mr-3`}>
                        {solution.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-white drop-shadow-lg">{solution.title}</h3>
                    </div>
                    <p className="text-white/90 text-sm drop-shadow-lg">{solution.subtitle}</p>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <p className="text-gray-700 dark:text-gray-300 mb-6 line-clamp-3">{solution.description}</p>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {solution.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start">
                        <CheckCircle className={`h-5 w-5 ${solution.iconColor} mr-2 flex-shrink-0 mt-0.5`} />
                        <p className="text-gray-700 dark:text-gray-300 text-sm">{feature}</p>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Link href={`/products/${solution.id}`}>
                      <button
                        className={`
                          w-full py-3 px-4 rounded-lg
                          bg-gradient-to-r ${solution.accentColor} text-white
                          flex items-center justify-center
                          transition-all duration-300 ease-out
                          hover:brightness-110 hover:shadow-md
                          group-hover:scale-[1.02]
                        `}
                      >
                        <span>{solution.ctaText}</span>
                        <ArrowUpRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Decorative Corner */}
                <div
                  className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl ${solution.accentColor} ${decorativeOpacity} rounded-bl-3xl`}
                ></div>
              </div>
            </AnimatedElement>
          ))}
        </div>
      </Container>
    </Section>
  )
}







