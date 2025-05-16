
"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { useTranslations } from "next-intl"
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api"
import { Section } from "@/components/ui/section"
import { Container } from "@/components/ui/container"
import { AnimatedElement } from "@/components/AnimatedElement"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, Sun, Zap, DollarSign, Leaf, TrendingUp, MapPin, Settings } from "lucide-react"


// Tipos para el formulario
type QuoteFormData = {
  monthlyConsumption: string
  location: {
    address: string
    lat: number
    lng: number
  } | null
  panelType: string
  systemType: string
}

// Agregar tipo para el mapa
type MapContainerStyle = {
  width: string
  height: string
}

const mapContainerStyle: MapContainerStyle = {
  width: "100%",
  height: "300px",
}

// Centro por defecto (Santa Cruz, Bolivia)
const defaultCenter = {
  lat: -17.8146,
  lng: -63.1561,
}

// Tipos para los resultados
type QuoteResults = {
  panelsNeeded: number
  totalPower: number
  monthlyGeneration: number
  yearlyGeneration: number
  systemCost: {
    panels: number
    inverter: number
    installation: number
    additional: number
    total: number
  }
  savings: {
    monthly: number
    yearly: number
    paybackPeriod: number
  }
  technicalDetails: {
    solarRadiation: number
    systemEfficiency: number
    inverterEfficiency: number
    performanceRatio: number
  }
  environmental: {
    co2Reduction: number
  }
}

// Configuración de paneles
const panelConfigs = {
  monocrystalline: { power: 0.6, efficiency: 0.22, costPerWatt: 0.8 },
  polycrystalline: { power: 0.55, efficiency: 0.2, costPerWatt: 0.7 },
  bifacial: { power: 0.65, efficiency: 0.24, costPerWatt: 0.9 },
}

// Configuración de sistemas
const systemConfigs = {
  "grid-tied": { multiplier: 1.0, batteryCost: 0 },
  "off-grid": { multiplier: 1.3, batteryCost: 2000 },
  hybrid: { multiplier: 1.2, batteryCost: 1500 },
}

const initialFormData: QuoteFormData = {
  monthlyConsumption: "",
  location: null,
  panelType: "",
  systemType: "",
}

export default function CotizadorPage() {
  const t = useTranslations("QuoteSection")

  // Estados para el formulario
  const [formData, setFormData] = useState<QuoteFormData>(initialFormData)
  const [isCalculating, setIsCalculating] = useState(false)
  const [results, setResults] = useState<QuoteResults | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [mapCenter, setMapCenter] = useState(defaultCenter)
  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)

  // Manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // Manejar cambios en los selects
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.monthlyConsumption) {
      newErrors.monthlyConsumption = t("validation.consumptionRequired")
    } else if (Number.parseFloat(formData.monthlyConsumption) <= 0) {
      newErrors.monthlyConsumption = t("validation.consumptionMin")
    }

    if (!formData.location) {
      newErrors.location = t("validation.locationRequired")
    }

    if (!formData.panelType) {
      newErrors.panelType = t("validation.panelTypeRequired")
    }

    if (!formData.systemType) {
      newErrors.systemType = t("validation.systemTypeRequired")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Función para obtener radiación solar real desde OpenWeatherMap
  const getSolarRadiation = async (lat: number, lng: number): Promise<number> => {
    try {
      const response = await fetch(`/api/weather?lat=${lat}&lng=${lng}`)

      if (!response.ok) {
        throw new Error("Failed to fetch weather data")
      }

      const data = await response.json()

      // OpenWeatherMap devuelve radiación en MJ/m²/day, convertir a kWh/m²/day
      // 1 MJ/m²/day = 0.278 kWh/m²/day
      const solarRadiationKwh = data.solarRadiation * 0.278

      return Math.max(solarRadiationKwh, 3.5) // Mínimo 3.5 kWh/m²/day
    } catch (error) {
      console.error("Error fetching solar radiation:", error)
      // Fallback a valores por defecto basados en coordenadas
      return getDefaultSolarRadiation(lat, lng)
    }
  }

  // Función fallback para radiación solar
  const getDefaultSolarRadiation = (lat: number, lng: number): number => {
    // Valores aproximados para Bolivia basados en latitud
    const absLat = Math.abs(lat)

    if (absLat < 15) return 5.8 // Trópico
    if (absLat < 20) return 5.2 // Subtropical
    if (absLat < 25) return 4.8 // Templado

    return 4.5 // Por defecto
  }

  // Manejar clic en el mapa
  const handleMapClick = useCallback(
    async (event: any) => {
      if (event.latLng) {
        const lat = event.latLng.lat()
        const lng = event.latLng.lng()

        setSelectedPosition({ lat, lng })
        setIsLoadingLocation(true)

        try {
          // Obtener dirección usando geocoding reverso
          const geocoder = new google.maps.Geocoder()
          const result = await new Promise<any>((resolve, reject) => {
            geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
              if (status === "OK" && results) {
                resolve(results)
              } else {
                reject(new Error("Geocoding failed"))
              }
            })
          })

          const address = result[0]?.formatted_address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`

          setFormData((prev) => ({
            ...prev,
            location: { address, lat, lng },
          }))

          // Limpiar error de ubicación si existe
          if (errors.location) {
            setErrors((prev) => ({ ...prev, location: "" }))
          }
        } catch (error) {
          console.error("Error getting address:", error)
          setFormData((prev) => ({
            ...prev,
            location: {
              address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
              lat,
              lng,
            },
          }))
        } finally {
          setIsLoadingLocation(false)
        }
      }
    },
    [errors.location],
  )

  // Manejar carga del mapa
  const handleMapLoad = useCallback(() => {
    setIsMapLoaded(true)
  }, [])

  // Calcular cotización
  const calculateQuote = async () => {
    if (!validateForm()) return

    setIsCalculating(true)

    try {
      // Obtener datos del formulario
      const monthlyConsumption = Number.parseFloat(formData.monthlyConsumption)
      const panelConfig = panelConfigs[formData.panelType as keyof typeof panelConfigs]
      const systemConfig = systemConfigs[formData.systemType as keyof typeof systemConfigs]

      // Obtener radiación solar real
      const solarRadiation = await getSolarRadiation(formData.location!.lat, formData.location!.lng)

      // Parámetros del sistema
      const inverterEfficiency = 0.95
      const systemEfficiency = 0.9
      const daysPerMonth = 30

      // Cálculo de paneles necesarios
      const dailyEnergyPerPanel = solarRadiation * panelConfig.power * inverterEfficiency * systemEfficiency
      const monthlyEnergyPerPanel = dailyEnergyPerPanel * daysPerMonth
      const panelsNeeded = Math.ceil(monthlyConsumption / monthlyEnergyPerPanel)

      // Cálculos de generación
      const totalPower = panelsNeeded * panelConfig.power
      const monthlyGeneration = panelsNeeded * monthlyEnergyPerPanel
      const yearlyGeneration = monthlyGeneration * 12

      // Cálculos de costos
      const panelsCost = panelsNeeded * panelConfig.power * 1000 * panelConfig.costPerWatt
      const inverterCost = totalPower * 200 // $200 por kW de inversor
      const installationCost = panelsCost * 0.3 // 30% del costo de paneles
      const additionalCost = panelsCost * 0.2 + systemConfig.batteryCost // 20% + baterías si aplica
      const totalCost = (panelsCost + inverterCost + installationCost + additionalCost) * systemConfig.multiplier

      // Cálculos de ahorros (asumiendo $0.12 por kWh)
      const electricityRate = 0.12
      const monthlySavings = monthlyGeneration * electricityRate
      const yearlySavings = monthlySavings * 12
      const paybackPeriod = totalCost / yearlySavings

      // Cálculos ambientales (0.5 kg CO2 por kWh)
      const co2Reduction = yearlyGeneration * 0.5

      const quoteResults: QuoteResults = {
        panelsNeeded,
        totalPower,
        monthlyGeneration,
        yearlyGeneration,
        systemCost: {
          panels: panelsCost,
          inverter: inverterCost,
          installation: installationCost,
          additional: additionalCost,
          total: totalCost,
        },
        savings: {
          monthly: monthlySavings,
          yearly: yearlySavings,
          paybackPeriod,
        },
        technicalDetails: {
          solarRadiation,
          systemEfficiency: systemEfficiency * 100,
          inverterEfficiency: inverterEfficiency * 100,
          performanceRatio: systemEfficiency * inverterEfficiency * 100,
        },
        environmental: {
          co2Reduction,
        },
      }

      setResults(quoteResults)
    } catch (error) {
      console.error("Error calculating quote:", error)
      setErrors({ general: t("errors.calculationFailed") })
    } finally {
      setIsCalculating(false)
    }
  }

  return (
    <Section id="cotizador" heightType="content" fullWidth={true} className="bg-background">
      <Container size="xlarge" className="py-16 md:py-24">
        {/* Header */}
        <AnimatedElement animation="slide-up" className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="h-12 w-12 text-primary mr-4" />
            <h1 className="text-4xl font-bold text-foreground">{t("title")}</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t("subtitle")}</p>
        </AnimatedElement>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario */}
          <AnimatedElement animation="slide-up" className="lg:sticky lg:top-8 lg:self-start">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  {t("form.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Consumo mensual */}
                <div className="space-y-2">
                  <label htmlFor="monthlyConsumption" className="block text-sm font-medium text-muted-foreground">
                    {t("form.monthlyConsumption")} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="monthlyConsumption"
                    name="monthlyConsumption"
                    type="number"
                    value={formData.monthlyConsumption}
                    onChange={handleChange}
                    placeholder={t("form.monthlyConsumptionPlaceholder")}
                    className={errors.monthlyConsumption ? "border-red-500" : ""}
                  />
                  <p className="text-xs text-muted-foreground">{t("form.monthlyConsumptionHelper")}</p>
                  {errors.monthlyConsumption && <p className="text-xs text-red-500">{errors.monthlyConsumption}</p>}
                </div>

                {/* Ubicación con mapa */}
                <div className="space-y-2">
                  <label htmlFor="location" className="block text-sm font-medium text-muted-foreground">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    {t("form.location")} <span className="text-red-500">*</span>
                  </label>

                  {/* Input de ubicación */}
                  <Input
                    id="location"
                    value={formData.location?.address || ""}
                    placeholder={t("form.locationPlaceholder")}
                    readOnly
                    className={errors.location ? "border-red-500" : ""}
                  />

                  {/* Mapa de Google */}
                  <div className="border rounded-lg overflow-hidden">
                    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!} onLoad={handleMapLoad}>
                      <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={selectedPosition || mapCenter}
                        zoom={10}
                        onClick={handleMapClick}
                        options={{
                          zoomControl: true,
                          streetViewControl: false,
                          mapTypeControl: false,
                          fullscreenControl: false,
                        }}
                      >
                        {selectedPosition && (
                          <Marker position={selectedPosition} animation={google.maps.Animation.DROP} />
                        )}
                      </GoogleMap>
                    </LoadScript>
                  </div>

                  {isLoadingLocation && (
                    <p className="text-xs text-blue-600 flex items-center">
                      <svg className="animate-spin h-3 w-3 mr-1" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Obteniendo dirección...
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground">{t("form.locationHelper")}</p>
                  {errors.location && <p className="text-xs text-red-500">{errors.location}</p>}
                </div>

                {/* Tipo de panel */}
                <div className="space-y-2">
                  <label htmlFor="panelType" className="block text-sm font-medium text-muted-foreground">
                    <Sun className="h-4 w-4 inline mr-1" />
                    {t("form.panelType")} <span className="text-red-500">*</span>
                  </label>
                  <Select value={formData.panelType} onValueChange={(value) => handleSelectChange("panelType", value)}>
                    <SelectTrigger className={errors.panelType ? "border-red-500" : ""}>
                      <SelectValue placeholder={t("form.panelTypePlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monocrystalline">{t("form.panelTypes.monocrystalline")}</SelectItem>
                      <SelectItem value="polycrystalline">{t("form.panelTypes.polycrystalline")}</SelectItem>
                      <SelectItem value="bifacial">{t("form.panelTypes.bifacial")}</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.panelType && <p className="text-xs text-red-500">{errors.panelType}</p>}
                </div>

                {/* Tipo de sistema */}
                <div className="space-y-2">
                  <label htmlFor="systemType" className="block text-sm font-medium text-muted-foreground">
                    <Zap className="h-4 w-4 inline mr-1" />
                    {t("form.systemType")} <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.systemType}
                    onValueChange={(value) => handleSelectChange("systemType", value)}
                  >
                    <SelectTrigger className={errors.systemType ? "border-red-500" : ""}>
                      <SelectValue placeholder={t("form.systemTypePlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid-tied">{t("form.systemTypes.grid-tied")}</SelectItem>
                      <SelectItem value="off-grid">{t("form.systemTypes.off-grid")}</SelectItem>
                      <SelectItem value="hybrid">{t("form.systemTypes.hybrid")}</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.systemType && <p className="text-xs text-red-500">{errors.systemType}</p>}
                </div>

                {/* Error general */}
                {errors.general && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{errors.general}</p>
                  </div>
                )}

                {/* Botón de cálculo */}
                <Button onClick={calculateQuote} disabled={isCalculating} className="w-full" size="lg">
                  {isCalculating ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {t("form.calculating")}
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Calculator className="mr-2 h-5 w-5" />
                      {results ? t("form.recalculate") : t("form.calculate")}
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>
          </AnimatedElement>

          {/* Resultados */}
          {results && (
            <AnimatedElement animation="slide-up" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    {t("results.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Resumen del sistema */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">{t("results.systemSummary")}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">{t("results.panelsNeeded")}</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {results.panelsNeeded} {t("units.panels")}
                        </p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">{t("results.totalPower")}</p>
                        <p className="text-2xl font-bold text-green-600">
                          {results.totalPower.toFixed(1)} {t("units.kw")}
                        </p>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">{t("results.monthlyGeneration")}</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {results.monthlyGeneration.toFixed(0)} {t("units.kwh")}
                        </p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">{t("results.yearlyGeneration")}</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {results.yearlyGeneration.toFixed(0)} {t("units.kwh")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Costos del sistema */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <DollarSign className="h-5 w-5 mr-2" />
                      {t("results.systemCost")}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>{t("results.panelsCost")}</span>
                        <span className="font-semibold">
                          ${results.systemCost.panels.toFixed(0)} {t("units.usd")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t("results.inverterCost")}</span>
                        <span className="font-semibold">
                          ${results.systemCost.inverter.toFixed(0)} {t("units.usd")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t("results.installationCost")}</span>
                        <span className="font-semibold">
                          ${results.systemCost.installation.toFixed(0)} {t("units.usd")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t("results.additionalCost")}</span>
                        <span className="font-semibold">
                          ${results.systemCost.additional.toFixed(0)} {t("units.usd")}
                        </span>
                      </div>
                      <hr />
                      <div className="flex justify-between text-lg font-bold">
                        <span>{t("results.totalCost")}</span>
                        <span className="text-primary">
                          ${results.systemCost.total.toFixed(0)} {t("units.usd")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ahorros estimados */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">{t("results.savings")}</h3>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex justify-between">
                        <span>{t("results.monthlySavings")}</span>
                        <span className="font-semibold text-green-600">
                          ${results.savings.monthly.toFixed(0)} {t("units.usd")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t("results.yearlySavings")}</span>
                        <span className="font-semibold text-green-600">
                          ${results.savings.yearly.toFixed(0)} {t("units.usd")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t("results.paybackPeriod")}</span>
                        <span className="font-semibold">
                          {results.savings.paybackPeriod.toFixed(1)} {t("units.years")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Impacto ambiental */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <Leaf className="h-5 w-5 mr-2" />
                      {t("results.co2Reduction")}
                    </h3>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {results.environmental.co2Reduction.toFixed(0)} {t("units.kg")}
                      </p>
                    </div>
                  </div>

                  {/* Detalles técnicos */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">{t("results.technicalDetails")}</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span>{t("results.solarRadiation")}</span>
                        <span>
                          {results.technicalDetails.solarRadiation.toFixed(1)} {t("units.kwhPerM2PerDay")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t("results.systemEfficiency")}</span>
                        <span>
                          {results.technicalDetails.systemEfficiency.toFixed(0)}
                          {t("units.percent")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t("results.inverterEfficiency")}</span>
                        <span>
                          {results.technicalDetails.inverterEfficiency.toFixed(0)}
                          {t("units.percent")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t("results.performanceRatio")}</span>
                        <span>
                          {results.technicalDetails.performanceRatio.toFixed(0)}
                          {t("units.percent")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="flex-1">{t("results.requestQuote")}</Button>
                    <Button variant="outline" className="flex-1">
                      {t("results.downloadReport")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </AnimatedElement>
          )}
        </div>
      </Container>
    </Section>
  )
}
