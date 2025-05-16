"use client"

import React from "react"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  FlagIcon as Government,
  Building2,
  Factory,
  Home,
  Leaf,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function VisualizationsPage() {
  const t = useTranslations("SectorsSection")
  const [activeAccordion, setActiveAccordion] = useState<string | null>("public")
  const [activeIcon, setActiveIcon] = useState<string>("public")
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0)
  const [activeTimeline, setActiveTimeline] = useState<string>("public")
  const [activeFlipCard, setActiveFlipCard] = useState<string | null>(null)
  const [activeHexagon, setActiveHexagon] = useState<string>("public")

  // Lista de sectores para iterar
  const sectors = [
    {
      id: "public",
      icon: <Government className="h-6 w-6" />,
      title: t("public.title"),
      subtitle: t("public.subtitle"),
      description: t("public.description"),
      benefits: [t("public.benefits.benefit1"), t("public.benefits.benefit2"), t("public.benefits.benefit3")],
      image: "/images/sectors/public-sector.png",
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
      image: "/images/sectors/commercial-sector.png",
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
      image: "/images/sectors/industrial-sector.png",
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
      image: "/images/sectors/residential-sector.png",
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
      image: "/images/sectors/agricultural-sector.jpg",
    },
  ]

  // Función para manejar el carrusel
  const handleCarouselNav = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setActiveCarouselIndex((prev) => (prev === 0 ? sectors.length - 1 : prev - 1))
    } else {
      setActiveCarouselIndex((prev) => (prev === sectors.length - 1 ? 0 : prev + 1))
    }
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">Visualizaciones de Sectores</h1>
          <Link href="/" className="text-primary hover:underline">
            Volver al inicio
          </Link>
        </div>

        <Tabs defaultValue="cards" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 mb-8">
            <TabsTrigger value="cards">Tarjetas Grid</TabsTrigger>
            <TabsTrigger value="tabs">Pestañas</TabsTrigger>
            <TabsTrigger value="carousel">Carrusel</TabsTrigger>
            <TabsTrigger value="icons">Iconos Interactivos</TabsTrigger>
            <TabsTrigger value="accordion">Acordeón</TabsTrigger>
            <TabsTrigger value="timeline">Línea de Tiempo</TabsTrigger>
            <TabsTrigger value="flipcards">Tarjetas Flip</TabsTrigger>
            <TabsTrigger value="hexagon">Hexágonos</TabsTrigger>
          </TabsList>

          {/* 1. Visualización en Tarjetas Grid */}
          <TabsContent value="cards">
            <h2 className="text-2xl font-semibold text-center mb-8">Visualización en Tarjetas Grid</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sectors.map((sector, index) => (
                <Card
                  key={`card-${sector.id}`}
                  className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <CardHeader className="bg-primary/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/20 text-primary">{sector.icon}</div>
                      <CardTitle>{sector.title}</CardTitle>
                    </div>
                    <CardDescription className="mt-2 text-sm font-medium">{sector.subtitle}</CardDescription>
                  </CardHeader>
                  <div className="relative w-full h-40">
                    <Image src={sector.image || "/placeholder.svg"} alt={sector.title} fill className="object-cover" />
                  </div>
                  <CardContent className="pt-4">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{sector.description}</p>
                    <div>
                      <h4 className="font-semibold mb-2 text-primary">{t("public.benefits.title")}</h4>
                      <ul className="space-y-1">
                        {sector.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span className="ml-2">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 2. Visualización con Pestañas Interactivas */}
          <TabsContent value="tabs">
            <h2 className="text-2xl font-semibold text-center mb-8">Visualización con Pestañas Interactivas</h2>
            <Tabs defaultValue="public" className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
                {sectors.map((sector) => (
                  <TabsTrigger key={`tab-${sector.id}`} value={sector.id} className="flex items-center gap-2">
                    <span className="hidden md:inline-block">{sector.icon}</span>
                    <span className="truncate">{sector.title}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              {sectors.map((sector) => (
                <TabsContent key={`tab-content-${sector.id}`} value={sector.id}>
                  <Card>
                    <CardHeader className="bg-primary/5">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-primary/20 text-primary">{sector.icon}</div>
                        <div>
                          <CardTitle>{sector.title}</CardTitle>
                          <CardDescription className="mt-1">{sector.subtitle}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <div className="relative w-full h-64">
                      <Image
                        src={sector.image || "/placeholder.svg"}
                        alt={sector.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="pt-6">
                      <p className="text-gray-600 dark:text-gray-300 mb-6">{sector.description}</p>
                      <div>
                        <h4 className="font-semibold mb-3 text-primary">{t("public.benefits.title")}</h4>
                        <ul className="space-y-2">
                          {sector.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start">
                              <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                              <span className="ml-2">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>

          {/* 3. Visualización en Carrusel */}
          <TabsContent value="carousel">
            <h2 className="text-2xl font-semibold text-center mb-8">Visualización en Carrusel</h2>
            <div className="relative max-w-4xl mx-auto">
              <div className="overflow-hidden rounded-lg border">
                <div className="relative">
                  {sectors.map((sector, index) => (
                    <div
                      key={`carousel-${sector.id}`}
                      className={`transition-opacity duration-500 ${
                        index === activeCarouselIndex ? "opacity-100" : "opacity-0 absolute inset-0"
                      }`}
                    >
                      <div className="relative w-full h-64">
                        <Image
                          src={sector.image || "/placeholder.svg"}
                          alt={sector.title}
                          fill
                          className="object-cover"
                          priority={index === activeCarouselIndex}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                          <div className="p-6 text-white">
                            <h3 className="text-2xl font-bold">{sector.title}</h3>
                            <p className="text-white/80">{sector.subtitle}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="text-gray-600 dark:text-gray-300 mb-6">{sector.description}</p>
                        <div className="bg-muted p-4 rounded-lg">
                          <h4 className="font-semibold mb-3 text-primary">{t("public.benefits.title")}</h4>
                          <ul className="space-y-2">
                            {sector.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-start">
                                <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                <span className="ml-2">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCarouselNav("prev")}
                  className="rounded-full"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>

                <div className="flex gap-2">
                  {sectors.map((_, index) => (
                    <button
                      key={`indicator-${index}`}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === activeCarouselIndex ? "bg-primary" : "bg-gray-300 hover:bg-primary/50"
                      }`}
                      onClick={() => setActiveCarouselIndex(index)}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCarouselNav("next")}
                  className="rounded-full"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* 4. Visualización con Iconos Interactivos */}
          <TabsContent value="icons">
            <h2 className="text-2xl font-semibold text-center mb-8">Visualización con Iconos Interactivos</h2>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {sectors.map((sector) => (
                <button
                  key={`icon-${sector.id}`}
                  className={`p-4 rounded-lg flex flex-col items-center transition-all duration-300 ${
                    activeIcon === sector.id
                      ? "bg-primary text-white scale-110"
                      : "bg-gray-100 dark:bg-gray-800 hover:bg-primary/20"
                  }`}
                  onClick={() => setActiveIcon(sector.id)}
                >
                  {React.cloneElement(sector.icon, {
                    className: `h-10 w-10 ${activeIcon === sector.id ? "text-white" : "text-primary"}`,
                  })}
                  <span className="mt-2 font-medium text-sm">{sector.title}</span>
                </button>
              ))}
            </div>

            <div className="transition-all duration-500">
              {sectors.map((sector) => (
                <div key={`icon-content-${sector.id}`} className={`${activeIcon === sector.id ? "block" : "hidden"}`}>
                  <Card>
                    <CardHeader className="bg-primary/5">
                      <CardTitle>{sector.title}</CardTitle>
                      <CardDescription>{sector.subtitle}</CardDescription>
                    </CardHeader>
                    <div className="relative w-full h-64">
                      <Image
                        src={sector.image || "/placeholder.svg"}
                        alt={sector.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="pt-6">
                      <p className="text-gray-600 dark:text-gray-300 mb-6">{sector.description}</p>
                      <div>
                        <h4 className="font-semibold mb-3 text-primary">{t("public.benefits.title")}</h4>
                        <ul className="space-y-2">
                          {sector.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start">
                              <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                              <span className="ml-2">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* 5. Visualización en Acordeón */}
          <TabsContent value="accordion">
            <h2 className="text-2xl font-semibold text-center mb-8">Visualización en Acordeón</h2>
            <div className="max-w-4xl mx-auto space-y-4">
              {sectors.map((sector) => (
                <div key={`accordion-${sector.id}`} className="border rounded-lg overflow-hidden">
                  <button
                    className={`w-full p-4 flex items-center justify-between text-left ${
                      activeAccordion === sector.id ? "bg-primary text-white" : "bg-gray-50 dark:bg-gray-800"
                    }`}
                    onClick={() => setActiveAccordion(activeAccordion === sector.id ? null : sector.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          activeAccordion === sector.id ? "bg-white/20 text-white" : "bg-primary/20 text-primary"
                        }`}
                      >
                        {sector.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold">{sector.title}</h3>
                        <p
                          className={`text-sm ${
                            activeAccordion === sector.id ? "text-white/80" : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {sector.subtitle}
                        </p>
                      </div>
                    </div>
                    {activeAccordion === sector.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      activeAccordion === sector.id ? "max-h-[800px]" : "max-h-0"
                    }`}
                  >
                    <div className="relative w-full h-48">
                      <Image
                        src={sector.image || "/placeholder.svg"}
                        alt={sector.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-900">
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{sector.description}</p>
                      <div>
                        <h4 className="font-semibold mb-2 text-primary">{t("public.benefits.title")}</h4>
                        <ul className="space-y-2">
                          {sector.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start">
                              <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                              <span className="ml-2">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* 6. Visualización en Línea de Tiempo */}
          <TabsContent value="timeline">
            <h2 className="text-2xl font-semibold text-center mb-8">Visualización en Línea de Tiempo</h2>
            <div className="flex overflow-x-auto pb-4 mb-8 scrollbar-hide">
              <div className="flex space-x-4">
                {sectors.map((sector) => (
                  <button
                    key={`timeline-btn-${sector.id}`}
                    className={`flex-shrink-0 px-4 py-2 rounded-full transition-colors ${
                      activeTimeline === sector.id
                        ? "bg-primary text-white"
                        : "bg-gray-100 dark:bg-gray-800 hover:bg-primary/20"
                    }`}
                    onClick={() => setActiveTimeline(sector.id)}
                  >
                    <div className="flex items-center gap-2">
                      {React.cloneElement(sector.icon, {
                        className: `h-5 w-5 ${activeTimeline === sector.id ? "text-white" : "text-primary"}`,
                      })}
                      <span>{sector.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20"></div>

              <div className="max-w-3xl mx-auto">
                {sectors.map((sector, index) => (
                  <div
                    key={`timeline-${sector.id}`}
                    className={`transition-opacity duration-500 ${
                      activeTimeline === sector.id ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none"
                    }`}
                  >
                    <div
                      className={`relative mb-8 ${index % 2 === 0 ? "ml-auto pl-8" : "mr-auto pr-8"}`}
                      style={{ width: "calc(50% - 1rem)" }}
                    >
                      <div className="absolute top-0 left-0 right-0 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center z-10">
                          {React.cloneElement(sector.icon, { className: "h-4 w-4 text-white" })}
                        </div>
                      </div>

                      <Card className="mt-4">
                        <div className="relative w-full h-48">
                          <Image
                            src={sector.image || "/placeholder.svg"}
                            alt={sector.title}
                            fill
                            className="object-cover rounded-t-lg"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                            <div className="p-4 text-white">
                              <h3 className="text-xl font-bold">{sector.title}</h3>
                              <p className="text-white/80">{sector.subtitle}</p>
                            </div>
                          </div>
                        </div>
                        <CardContent className="pt-4">
                          <p className="text-gray-600 dark:text-gray-300 mb-4">{sector.description}</p>
                          <div>
                            <h4 className="font-semibold mb-2 text-primary">{t("public.benefits.title")}</h4>
                            <ul className="space-y-2">
                              {sector.benefits.map((benefit, index) => (
                                <li key={index} className="flex items-start">
                                  <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                  <span className="ml-2">{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* 7. Visualización en Tarjetas Flip */}
          <TabsContent value="flipcards">
            <h2 className="text-2xl font-semibold text-center mb-8">Visualización en Tarjetas Flip</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sectors.map((sector) => (
                <div
                  key={`flip-${sector.id}`}
                  className={`relative h-96 perspective-1000 cursor-pointer ${
                    activeFlipCard === sector.id ? "flip" : ""
                  }`}
                  onClick={() => setActiveFlipCard(activeFlipCard === sector.id ? null : sector.id)}
                >
                  <div
                    className={`absolute inset-0 transition-all duration-500 transform ${
                      activeFlipCard === sector.id ? "rotate-y-180 opacity-0 pointer-events-none" : ""
                    }`}
                  >
                    <div className="h-full rounded-lg overflow-hidden border shadow-md">
                      <div className="relative h-1/2">
                        <Image
                          src={sector.image || "/placeholder.svg"}
                          alt={sector.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                          <div className="p-4 text-white">
                            <h3 className="text-xl font-bold">{sector.title}</h3>
                            <p className="text-white/80">{sector.subtitle}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 h-1/2 flex flex-col justify-between">
                        <p className="text-gray-600 dark:text-gray-300 line-clamp-3">{sector.description}</p>
                        <div className="text-center mt-4">
                          <span className="text-primary font-medium">Click para ver más</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`absolute inset-0 transition-all duration-500 transform ${
                      activeFlipCard === sector.id ? "" : "rotate-y-180 opacity-0 pointer-events-none"
                    }`}
                  >
                    <div className="h-full rounded-lg overflow-hidden border shadow-md bg-white dark:bg-gray-900 p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 rounded-full bg-primary/20 text-primary">{sector.icon}</div>
                        <h3 className="text-xl font-bold">{sector.title}</h3>
                      </div>
                      <div className="overflow-auto h-[calc(100%-4rem)]">
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{sector.description}</p>
                        <div>
                          <h4 className="font-semibold mb-2 text-primary">{t("public.benefits.title")}</h4>
                          <ul className="space-y-2">
                            {sector.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-start">
                                <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                <span className="ml-2">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="text-center mt-4">
                          <span className="text-primary font-medium">Click para volver</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* 8. Visualización en Hexágonos */}
          <TabsContent value="hexagon">
            <h2 className="text-2xl font-semibold text-center mb-8">Visualización en Hexágonos</h2>
            <div className="flex justify-center mb-12">
              <div className="grid grid-cols-3 gap-4 max-w-3xl">
                {sectors.map((sector, index) => {
                  // Posicionamiento especial para el hexágono central
                  const isCenter = index === 2
                  const colSpan = isCenter ? "col-span-1" : ""
                  const margin = isCenter ? "" : index < 2 ? "mt-12" : ""

                  return (
                    <div key={`hex-${sector.id}`} className={`${colSpan} ${margin} flex justify-center`}>
                      <button
                        className={`hexagon relative w-32 h-32 flex items-center justify-center transition-all duration-300 ${
                          activeHexagon === sector.id
                            ? "bg-primary text-white scale-110"
                            : "bg-gray-100 dark:bg-gray-800 hover:bg-primary/20"
                        }`}
                        onClick={() => setActiveHexagon(sector.id)}
                      >
                        <div className="flex flex-col items-center gap-2 z-10">
                          {React.cloneElement(sector.icon, {
                            className: `h-8 w-8 ${activeHexagon === sector.id ? "text-white" : "text-primary"}`,
                          })}
                          <span className="text-sm font-medium text-center">{sector.title}</span>
                        </div>
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="transition-all duration-500 max-w-4xl mx-auto">
              {sectors.map((sector) => (
                <div key={`hex-content-${sector.id}`} className={`${activeHexagon === sector.id ? "block" : "hidden"}`}>
                  <Card>
                    <CardHeader className="bg-primary/5">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-primary/20 text-primary">{sector.icon}</div>
                        <div>
                          <CardTitle>{sector.title}</CardTitle>
                          <CardDescription>{sector.subtitle}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <div className="relative w-full h-64">
                      <Image
                        src={sector.image || "/placeholder.svg"}
                        alt={sector.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="pt-6">
                      <p className="text-gray-600 dark:text-gray-300 mb-6">{sector.description}</p>
                      <div>
                        <h4 className="font-semibold mb-3 text-primary">{t("public.benefits.title")}</h4>
                        <ul className="space-y-2">
                          {sector.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start">
                              <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                              <span className="ml-2">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .hexagon {
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        }
      `}</style>
    </div>
  )
}
