"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { useSession } from "next-auth/react"
import { Section } from "@/components/ui/section"
import { Container } from "@/components/ui/container"
import { AnimatedElement } from "@/components/AnimatedElement"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Calculator,
  Sun,
  TrendingUp,
  MapPin,
  Settings,
  FileText,
  Building,
  Factory,
  Home,
  Landmark,
  Tractor,
  Battery,
  Power,
  Clock,
  Zap,
  ArrowRight,
  TreesIcon as Tree2,
  Download,
} from "lucide-react"
import {
  getCotizadorConfig,
  getMainPanel,
  getInverterByPowerAndPhase,
  getSolarRadiationByDepartment,
  getSectorMultiplier,
  calculateTransportCost,
  getFixedCosts,
  calculateOptimalBatteryConfiguration,
  BOLIVIA_DEPARTMENTS,
  type CotizadorConfig,
  type Panel,
  type Inverter,
  type BatteryCalculationResult,
  type SectorType,
  type BoliviaDepartment,
  type PhaseType,
  getVariableCosts,
  applyVariableCosts,
  calculateElectricityCost,
  getExchangeRate,
} from "@/lib/firestore-products"
import Link from "next/link"

// Tipos para el formulario
type QuoteFormData = {
  monthlyConsumption: string
  department: BoliviaDepartment | ""
  sector: SectorType | ""
  phase: PhaseType | ""
  includeBattery: boolean
}

// Tipos para los resultados
type QuoteResults = {
  panelsNeeded: number
  totalPower: number
  inverterPower: number
  monthlyGeneration: number
  yearlyGeneration: number
  electricityCost: {
    monthlyBs: number
    monthlyUSD: number
    effectiveRateBs: number
    effectiveRateUSD: number
    rateType: string
    details: string
  }
  systemCost: {
    panels: number
    inverter: number
    battery: number
    fixedCosts: {
      tablero: number
      aterramiento: number
      proyecto: number
      pilastra: number
      cableado: number
      instalacion_inversor: number
      total: number
    }
    transport: number
    subtotal: number
    sectorAdjustment: number
    variableCosts: {
      utilidad: number
      comision: number
      it: number
      iva: number
      total: number
    }
    total: number
  }
  savings: {
    monthlyBs: number
    monthlyUSD: number
    yearlyBs: number
    yearlyUSD: number
    paybackPeriodYears: number
    totalSavings25YearsBs: number
    totalSavings25YearsUSD: number
  }
  technicalDetails: {
    solarRadiation: number
    department: string
    sector: string
    phase: string
    systemEfficiency: number
    panelInfo: Panel | null
    inverterInfo: Inverter | null
    batteryInfo: BatteryCalculationResult | null
    sectorMultiplier: number
    totalWeight: number
    transportCostPerKg: number
    includeBattery: boolean
    exchangeRate: number
  }
  environmental: {
    co2Reduction: number
    co2Reduction25Years: number
  }
}

const initialFormData: QuoteFormData = {
  monthlyConsumption: "",
  department: "",
  sector: "",
  phase: "",
  includeBattery: false,
}

// Configuración de sectores
const SECTORS = [
  {
    id: "residential" as SectorType,
    name: "Residencial",
    description: "Casas, departamentos y viviendas",
    icon: Home,
    electricityType: "Tarifa Residencial",
  },
  {
    id: "commercial" as SectorType,
    name: "Comercial",
    description: "Tiendas, oficinas, restaurantes",
    icon: Building,
    electricityType: "Tarifa Comercial",
  },
  {
    id: "industrial" as SectorType,
    name: "Industrial",
    description: "Fábricas, plantas de producción",
    icon: Factory,
    electricityType: "Tarifa Industrial",
  },
  {
    id: "public" as SectorType,
    name: "Público",
    description: "Escuelas, hospitales, municipios",
    icon: Landmark,
    electricityType: "Tarifa Comercial",
  },
  {
    id: "agricultural" as SectorType,
    name: "Agrícola",
    description: "Granjas, invernaderos, riego",
    icon: Tractor,
    electricityType: "Tarifa Industrial",
  },
]

// Configuración de fases
const PHASES = [
  {
    id: "P1" as PhaseType,
    name: "Monofásico (P1)",
    description: "Para instalaciones residenciales pequeñas",
    icon: Power,
  },
  {
    id: "P3" as PhaseType,
    name: "Trifásico (P3)",
    description: "Para instalaciones comerciales e industriales",
    icon: Power,
  },
]

export default function CotizadorPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations("QuoteSection")

  // USAR DIRECTAMENTE useSession EN LUGAR DEL HOOK useAuth
  const { data: session, status } = useSession()
  const isAdmin = session?.user?.role === "admin"

  // Estados para el formulario
  const [formData, setFormData] = useState<QuoteFormData>(initialFormData)
  const [isCalculating, setIsCalculating] = useState(false)
  const [results, setResults] = useState<QuoteResults | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [config, setConfig] = useState<CotizadorConfig | null>(null)
  const [isLoadingConfig, setIsLoadingConfig] = useState(true)
  const [configError, setConfigError] = useState<string | null>(null)

  // Estado para mostrar el costo de electricidad en tiempo real
  const [currentElectricityCost, setCurrentElectricityCost] = useState<{
    costBs: number
    costUSD: number
    rateType: string
    details: string
  } | null>(null)

  // Formatear números con comas para miles y puntos para decimales
  const formatNumber = (number: number | undefined | null): string => {
    if (number === undefined || number === null) {
      return "0"
    }
    return number.toLocaleString("es-BO", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
  }

  // LOGS SIMPLIFICADOS
  useEffect(() => {
    console.log("🔍 SESSION CHANGE:", {
      status,
      isAdmin,
      hasResults: !!results,
      timestamp: new Date().toISOString(),
    })
  }, [status, isAdmin, results])

  // Cargar configuración al montar el componente
  useEffect(() => {
    const loadConfiguration = async () => {
      try {
        setIsLoadingConfig(true)
        setConfigError(null)
        const cotizadorConfig = await getCotizadorConfig()
        if (!cotizadorConfig) {
          throw new Error("No se pudo cargar la configuración del cotizador")
        }
        setConfig(cotizadorConfig)
      } catch (error) {
        console.error("Error loading configuration:", error)
        setConfigError(error instanceof Error ? error.message : "Error desconocido")
      } finally {
        setIsLoadingConfig(false)
      }
    }

    loadConfiguration()
  }, [])

  // Calcular costo de electricidad en tiempo real cuando cambian consumo y sector
  useEffect(() => {
    if (config && formData.monthlyConsumption && formData.sector) {
      const consumption = Number.parseFloat(formData.monthlyConsumption)
      if (consumption > 0) {
        const electricityCost = calculateElectricityCost(config, consumption, formData.sector as SectorType)
        setCurrentElectricityCost({
          costBs: electricityCost.costBs,
          costUSD: electricityCost.costUSD,
          rateType: electricityCost.rateType,
          details: electricityCost.details,
        })
      } else {
        setCurrentElectricityCost(null)
      }
    } else {
      setCurrentElectricityCost(null)
    }
  }, [config, formData.monthlyConsumption, formData.sector])

  // Manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
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
      newErrors.monthlyConsumption = "El consumo mensual es requerido"
    } else if (Number.parseFloat(formData.monthlyConsumption) <= 0) {
      newErrors.monthlyConsumption = "El consumo debe ser mayor a 0"
    }

    if (!formData.department) {
      newErrors.department = "Debe seleccionar un departamento"
    }

    if (!formData.sector) {
      newErrors.sector = "Debe seleccionar un sector"
    }

    if (!formData.phase) {
      newErrors.phase = "Debe seleccionar el tipo de fase"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Calcular cotización
  const calculateQuote = async () => {
    console.log("🔍 STARTING CALCULATION:", {
      status,
      isAdmin,
      timestamp: new Date().toISOString(),
    })

    if (!validateForm() || !config) return

    setIsCalculating(true)

    try {
      // Obtener datos del formulario
      const monthlyConsumption = Number.parseFloat(formData.monthlyConsumption)

      // Obtener panel principal
      const selectedPanel = getMainPanel(config)
      if (!selectedPanel) {
        throw new Error("No se encontró el panel principal")
      }

      // Calcular configuración óptima de baterías si se incluye
      let batteryConfig: BatteryCalculationResult | null = null
      if (formData.includeBattery) {
        batteryConfig = calculateOptimalBatteryConfiguration(config, monthlyConsumption)
        if (!batteryConfig) {
          throw new Error("No se pudo calcular la configuración de baterías")
        }
      }

      // Obtener datos por departamento y sector
      const department = formData.department as BoliviaDepartment
      const sector = formData.sector as SectorType
      const phase = formData.phase as PhaseType
      const solarRadiation = getSolarRadiationByDepartment(config, department)
      const sectorMultiplier = getSectorMultiplier(sector)
      const exchangeRate = getExchangeRate(config)

      // Calcular costo de electricidad actual
      const electricityCost = calculateElectricityCost(config, monthlyConsumption, sector)

      // Parámetros del sistema
      const systemEfficiency = 0.85 // 85% eficiencia del sistema
      const daysPerMonth = 30

      // Cálculo de paneles necesarios - FÓRMULA CORREGIDA
      const dailyEnergyPerPanel = solarRadiation * selectedPanel.power_kw * systemEfficiency
      const monthlyEnergyPerPanel = dailyEnergyPerPanel * daysPerMonth
      const panelsNeeded = Math.ceil(monthlyConsumption / monthlyEnergyPerPanel)

      // Cálculos de potencia
      const totalPower = panelsNeeded * selectedPanel.power_kw

      // Cálculo de inversor con oversizing del 20%
      const inverterPower = totalPower / 1.2
      const selectedInverter = getInverterByPowerAndPhase(config, inverterPower, phase)
      if (!selectedInverter) {
        throw new Error(`No se encontró inversor adecuado para ${phase} y ${inverterPower.toFixed(1)}kW`)
      }

      // Cálculos de generación
      const monthlyGeneration = panelsNeeded * monthlyEnergyPerPanel
      const yearlyGeneration = monthlyGeneration * 12

      // Cálculos de costos usando la nueva estructura
      const panelsCost = panelsNeeded * selectedPanel.price_usd
      const inverterCost = selectedInverter.price
      const batteryCost = batteryConfig ? batteryConfig.totalCost : 0

      // Costos fijos
      const fixedCosts = getFixedCosts(config)
      const fixedCostsTotal = Object.values(fixedCosts).reduce((sum, cost) => sum + cost, 0)

      // Cálculo de transporte por peso
      const panelWeight = panelsNeeded * selectedPanel.weight_kg
      const batteryWeight = batteryConfig ? batteryConfig.totalWeight : 0
      const totalWeight = panelWeight + batteryWeight
      const transportCost = calculateTransportCost(config, department, totalWeight)

      const subtotal = panelsCost + inverterCost + batteryCost + fixedCostsTotal + transportCost
      const sectorAdjustment = subtotal * (sectorMultiplier - 1)
      const subtotalWithSector = subtotal + sectorAdjustment

      // Aplicar costos variables
      const variableCosts = getVariableCosts(config)
      const finalCostBreakdown = applyVariableCosts(subtotalWithSector, variableCosts)
      const totalCost = finalCostBreakdown.finalPrice

      // Cálculos de ahorro basados en el costo real de electricidad
      const monthlySavingsBs = electricityCost.costBs
      const monthlySavingsUSD = electricityCost.costUSD
      const yearlySavingsBs = monthlySavingsBs * 12
      const yearlySavingsUSD = monthlySavingsUSD * 12
      const paybackPeriodYears = totalCost / yearlySavingsUSD
      const totalSavings25YearsBs = yearlySavingsBs * 25
      const totalSavings25YearsUSD = yearlySavingsUSD * 25

      // Cálculos ambientales (asumiendo 0.5 kg CO2 por kWh)
      const co2FactorPerKwh = 0.5
      const co2Reduction = yearlyGeneration * co2FactorPerKwh
      const co2Reduction25Years = co2Reduction * 25

      // Comparaciones ambientales
      const treesEquivalent = co2Reduction / 20
      const carsRemoved = co2Reduction / 2500
      const gasolineSaved = co2Reduction / 2.3

      const quoteResults: QuoteResults = {
        panelsNeeded,
        totalPower,
        inverterPower: selectedInverter.power_kW,
        monthlyGeneration,
        yearlyGeneration,
        electricityCost: {
          monthlyBs: electricityCost.costBs,
          monthlyUSD: electricityCost.costUSD,
          effectiveRateBs: electricityCost.effectiveRateBs,
          effectiveRateUSD: electricityCost.effectiveRateUSD,
          rateType: electricityCost.rateType,
          details: electricityCost.details,
        },
        systemCost: {
          panels: panelsCost,
          inverter: inverterCost,
          battery: batteryCost,
          fixedCosts: {
            tablero: fixedCosts.tablero,
            aterramiento: fixedCosts.aterramiento,
            proyecto: fixedCosts.proyecto,
            pilastra: fixedCosts.pilastra,
            cableado: fixedCosts.cableado,
            instalacion_inversor: fixedCosts.instalacion_inversor,
            total: fixedCostsTotal,
          },
          transport: transportCost,
          subtotal,
          sectorAdjustment,
          variableCosts: {
            utilidad: finalCostBreakdown.breakdown.utilidad,
            comision: finalCostBreakdown.breakdown.comision,
            it: finalCostBreakdown.breakdown.it,
            iva: finalCostBreakdown.breakdown.iva,
            total: finalCostBreakdown.breakdown.total - finalCostBreakdown.breakdown.basePrice,
          },
          total: totalCost,
        },
        savings: {
          monthlyBs: monthlySavingsBs,
          monthlyUSD: monthlySavingsUSD,
          yearlyBs: yearlySavingsBs,
          yearlyUSD: yearlySavingsUSD,
          paybackPeriodYears,
          totalSavings25YearsBs,
          totalSavings25YearsUSD,
        },
        technicalDetails: {
          solarRadiation,
          department,
          sector,
          phase,
          systemEfficiency: systemEfficiency * 100,
          panelInfo: selectedPanel,
          inverterInfo: selectedInverter,
          batteryInfo: batteryConfig,
          sectorMultiplier,
          totalWeight,
          transportCostPerKg: config.costFactors.transportPerKg[department] || 0,
          includeBattery: formData.includeBattery,
          exchangeRate,
        },
        environmental: {
          co2Reduction,
          co2Reduction25Years,
        },
      }

      console.log("✅ SETTING RESULTS:", {
        status,
        isAdmin,
        resultsSet: true,
        timestamp: new Date().toISOString(),
      })

      setResults(quoteResults)
    } catch (error) {
      console.error("Error calculating quote:", error)
      setErrors({ general: error instanceof Error ? error.message : "Error en el cálculo" })
    } finally {
      setIsCalculating(false)
    }
  }

  // Función para manejar solicitud de cotización por WhatsApp
  const handleWhatsAppQuote = () => {
    if (!results) return

    const sectorName = SECTORS.find((s) => s.id === formData.sector)?.name || formData.sector
    const phaseName = PHASES.find((p) => p.id === formData.phase)?.name || formData.phase

    const systemCostBs = results.systemCost.total * results.technicalDetails.exchangeRate
    const actualMonthlySavingsBs = results.electricityCost.monthlyBs * 0.8
    const actualYearlySavingsBs = actualMonthlySavingsBs * 12
    const actualPaybackYears = systemCostBs / actualYearlySavingsBs

    const message = `¡Hola! Me interesa una cotización de sistema solar fotovoltaico:

📍 Departamento: ${formData.department}
🏢 Sector: ${sectorName} (${results.electricityCost.rateType})
⚡ Consumo mensual: ${formData.monthlyConsumption} kWh
💡 Gasto actual: ${formatNumber(results.electricityCost.monthlyBs)} Bs/mes
🔌 Tipo de instalación: ${phaseName}

💰 Inversión Generación Solar: ${formatNumber(systemCostBs)} Bs
📈 Retorno: ${formatNumber(actualPaybackYears)} años
💵 Ahorro anual permitido (80%): ${formatNumber(actualYearlySavingsBs)} Bs
🌱 Reducción CO₂: ${formatNumber(results?.environmental?.co2Reduction || 0)} kg/año

¿Podrían enviarme más información?`

    const whatsappUrl = `https://wa.me/59178901234?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  console.log("🔍 RENDER CHECK:", {
    hasResults: !!results,
    status,
    isAdmin,
    timestamp: new Date().toISOString(),
  })

  // Comparaciones ambientales
  const treesEquivalent = results?.environmental?.co2Reduction ? results.environmental.co2Reduction / 20 : 0
  const carsRemoved = results?.environmental?.co2Reduction ? results.environmental.co2Reduction / 2500 : 0
  const gasolineSaved = results?.environmental?.co2Reduction ? results.environmental.co2Reduction / 2.3 : 0

  return (
    <Section id="cotizador" heightType="content" fullWidth={true} className="bg-background">
      <Container size="xlarge" className="py-16 md:py-24">
        {/* Header */}
        <AnimatedElement animation="slide-up" className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="h-12 w-12 text-primary mr-4" />
            <h1 className="text-4xl font-bold text-foreground">{t("title")}</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("subtitle")}
          </p>
        </AnimatedElement>

        {/* Error de configuración general */}
        {configError && (
          <AnimatedElement animation="slide-up" className="mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error de Configuración</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{configError}</p>
                    <p className="mt-1">
                      Por favor, verifica que la configuración esté correctamente cargada en Firestore.
                    </p>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.reload()}
                      className="text-red-800 border-red-300 hover:bg-red-50"
                    >
                      Reintentar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedElement>
        )}

        {/* LAYOUT EN FILA - FORMULARIO Y RESULTADOS LADO A LADO */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* COLUMNA IZQUIERDA - FORMULARIO */}
          <div className="space-y-6 h-full">
            <AnimatedElement animation="slide-up" className="h-full">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    {t("form.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-6">
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
                      <p className="text-xs text-muted-foreground">
                        {t("form.monthlyConsumptionHelper")}
                      </p>
                      {errors.monthlyConsumption && <p className="text-xs text-red-500">{errors.monthlyConsumption}</p>}
                    </div>

                    {/* Departamento */}
                    <div className="space-y-2">
                      <label htmlFor="department" className="block text-sm font-medium text-muted-foreground">
                        <MapPin className="h-4 w-4 inline mr-1" />
                        {t("form.location")} <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={formData.department}
                        onValueChange={(value) => handleSelectChange("department", value)}
                      >
                        <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                          <SelectValue placeholder={t("form.locationPlaceholder")} />
                        </SelectTrigger>
                        <SelectContent>
                          {BOLIVIA_DEPARTMENTS.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formData.department && config && (
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-green-600 bg-green-50 p-2 rounded">
                            <Sun className="h-4 w-4 mr-1" />
                            <span>
                              {t("form.locationHelper")}:{" "}
                              {getSolarRadiationByDepartment(config, formData.department as BoliviaDepartment).toFixed(
                                1,
                              )}{" "}
                              kWh/m²/día
                            </span>
                          </div>
                        </div>
                      )}
                      {errors.department && <p className="text-xs text-red-500">{errors.department}</p>}
                    </div>

                    {/* Sector - ARREGLADO EL OVERFLOW */}
                    <div className="space-y-2">
                      <label htmlFor="sector" className="block text-sm font-medium text-muted-foreground">
                        <Building className="h-4 w-4 inline mr-1" />
                        {t("form.sector")} <span className="text-red-500">*</span>
                      </label>
                      <Select value={formData.sector} onValueChange={(value) => handleSelectChange("sector", value)}>
                        <SelectTrigger className={errors.sector ? "border-red-500" : ""}>
                          <SelectValue placeholder={t("form.sectorPlaceholder")} />
                        </SelectTrigger>
                        <SelectContent className="max-h-80 w-full min-w-[var(--radix-select-trigger-width)]">
                          {SECTORS.map((sector) => {
                            const IconComponent = sector.icon
                            return (
                              <SelectItem key={sector.id} value={sector.id} className="py-2">
                                <div className="flex items-center space-x-2 w-full max-w-full">
                                  <IconComponent className="h-4 w-4 flex-shrink-0" />
                                  <div className="flex-1 min-w-0 overflow-hidden">
                                    <div className="font-medium text-sm truncate">{sector.name}</div>
                                    <div className="text-xs text-muted-foreground truncate">{sector.description}</div>

                                  </div>
                                </div>
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                      {errors.sector && <p className="text-xs text-red-500">{errors.sector}</p>}
                    </div>

                    {/* Tipo de fase */}
                    <div className="space-y-2">
                      <label htmlFor="phase" className="block text-sm font-medium text-muted-foreground">
                        <Power className="h-4 w-4 inline mr-1" />
                        {t("form.phase")} <span className="text-red-500">*</span>
                      </label>
                      <Select value={formData.phase} onValueChange={(value) => handleSelectChange("phase", value)}>
                        <SelectTrigger className={errors.phase ? "border-red-500" : ""}>
                          <SelectValue placeholder={t("form.phasePlaceholder")} />
                        </SelectTrigger>
                        <SelectContent>
                          {PHASES.map((phase) => {
                            const IconComponent = phase.icon
                            return (
                              <SelectItem key={phase.id} value={phase.id} className="py-3">
                                <div className="flex items-start space-x-2">
                                  <IconComponent className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <div className="font-medium text-sm">{phase.name}</div>
                                    <div className="text-xs text-muted-foreground">{phase.description}</div>
                                  </div>
                                </div>
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                      {errors.phase && <p className="text-xs text-red-500">{errors.phase}</p>}
                    </div>

                    {/* Incluir batería */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="includeBattery"
                          name="includeBattery"
                          checked={formData.includeBattery}
                          onChange={handleChange}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="includeBattery" className="text-sm font-medium text-muted-foreground">
                          <Battery className="h-4 w-4 inline mr-1" />
                          {t("form.includeBattery")}
                        </label>
                      </div>
                      {formData.includeBattery && (
                        <div className="bg-yellow-50 p-3 rounded-lg text-sm">
                          <div className="flex items-center text-amber-600 mb-1">
                            <Clock className="h-4 w-4 mr-1" />
                            <span className="font-medium">{t("form.batteryDescription")}</span>
                          </div>
                          <p className="text-amber-700">
                            {t("form.batteryAutonomy")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mostrar costo de electricidad en tiempo real */}
                  {currentElectricityCost && (
                    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                      <div className="flex items-center text-yellow-700 mb-2">
                        <Zap className="h-4 w-4 mr-1" />
                        <span className="font-medium">{t("form.currentElectricityCost")}</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>{t("form.rateType")}:</span>
                          <span className="font-medium">{currentElectricityCost.rateType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t("form.costBs")}:</span>
                          <span className="font-semibold text-red-600">
                            {formatNumber(currentElectricityCost.costBs)} Bs
                          </span>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* Error general */}
                  {errors.general && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{errors.general}</p>
                    </div>
                  )}

                  {/* Botón de cálculo */}
                  <div className="flex justify-center">
                    <Button
                      onClick={calculateQuote}
                      disabled={isCalculating || !config || isLoadingConfig}
                      className="w-full"
                      size="lg"
                    >
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
                      ) : isLoadingConfig ? (
                        <span className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {t("form.loadingConfig")}
                        </span>
                      ) : !config ? (
                        <span className="flex items-center">
                          <span className="mr-2">⚠️</span>
                          {t("form.configError")}
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Calculator className="mr-2 h-5 w-5" />
                          {t("form.calculate")}
                        </span>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </AnimatedElement>
          </div>

          {/* COLUMNA DERECHA - RESULTADOS */}
          <div className="space-y-6 h-full">
            {results ? (
              <AnimatedElement animation="slide-up" className="h-full">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        <span className="text-xl font-bold text-primary">{t("results.systemSummary")}</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Number(formData.monthlyConsumption) < 1000 ? (
                      <div className="text-center py-8">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                          <h3 className="text-xl font-semibold text-blue-800 mb-3">{t("form.lowConsumption.title")}</h3>
                          <p className="text-blue-700 mb-6">{t("form.lowConsumption.message")}</p>
                          <Link href={`/${locale}/contacto`}>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                              {t("form.lowConsumption.button")}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Tu Gasto Actual de Electricidad */}
                        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold mb-3 flex items-center text-red-700">
                            <Zap className="h-5 w-5 mr-2" />
                            {t("results.currentElectricityCost")}
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <p className="text-muted-foreground mb-1">{t("results.monthlyBs")}</p>
                              <p className="text-2xl font-bold text-red-600">
                                {formatNumber(results.electricityCost?.monthlyBs) || "0"} Bs
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {results.electricityCost?.rateType || t("units.rateType")}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-muted-foreground mb-1">{t("results.yearlyBs")}</p>
                              <p className="text-2xl font-bold text-red-600">
                                {formatNumber(results.savings?.yearlyBs) || "0"} Bs
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">{t("units.yearly")}</p>
                            </div>
                          </div>
                        </div>

                        {/* Inversión Generación Solar */}
                        <div className="text-center bg-primary/10 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold mb-2">{t("results.systemCost")}</h3>
                          <p className="text-3xl font-bold text-primary">
                            {formatNumber((results.systemCost?.total || 0) * (results.technicalDetails?.exchangeRate || 1))}{" "}
                            Bs
                          </p>
                          {results.systemCost?.transport > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {t("results.transportIncluded")}
                            </p>
                          )}
                        </div>

                        {/* ROI (Retorno de Inversión) */}
                        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold mb-3 flex items-center text-green-700">
                            <ArrowRight className="h-5 w-5 mr-2" />
                            {t("results.roi")}
                          </h3>
                          <div className="space-y-3">
                            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                              <p className="text-s text-amber-700">
                                <strong>{t("results.note")}</strong>
                              </p>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                              <div className="text-center">
                                <p className="text-muted-foreground">{t("results.allowedSavings")}</p>
                                <p className="text-xl font-bold text-green-600">
                                  {formatNumber((results.electricityCost?.monthlyBs || 0) * 0.8 * 12)} Bs
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {formatNumber((results.electricityCost?.monthlyBs || 0) * 0.8)} Bs/mes
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-muted-foreground">{t("results.paybackPeriod")}</p>
                                <p className="text-xl font-bold text-blue-600">
                                  {formatNumber(
                                    ((results.systemCost?.total || 0) * (results.technicalDetails?.exchangeRate || 1)) /
                                    ((results.electricityCost?.monthlyBs || 0) * 0.8 * 12),
                                  )}{" "}
                                  {t("units.years")}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">{t("results.paybackPeriodHelper")}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-muted-foreground">{t("results.savings25Years")}</p>
                                <p className="text-xl font-bold text-green-600">
                                  {formatNumber(
                                    (results.electricityCost?.monthlyBs || 0) * 0.8 * 12 * 25 -
                                    (results.systemCost?.total || 0) * (results.technicalDetails?.exchangeRate || 1),
                                  )}{" "}
                                  Bs
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">{t("results.savings25YearsHelper")}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Impacto Ambiental */}
                        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold mb-3 flex items-center text-green-700">
                            <Tree2 className="h-5 w-5 mr-2" />
                            {t("results.environmental.title")}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="text-center">
                              <p className="text-muted-foreground mb-1">{t("results.environmental.treesEquivalent")}</p>
                              <p className="text-2xl font-bold text-green-600">{formatNumber(treesEquivalent)}</p>
                              <p className="text-xs text-muted-foreground mt-1">{t("results.environmental.trees")}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-muted-foreground mb-1">{t("results.environmental.carsRemoved")}</p>
                              <p className="text-2xl font-bold text-blue-600">{formatNumber(carsRemoved)}</p>
                              <p className="text-xs text-muted-foreground mt-1">{t("results.environmental.cars")}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-muted-foreground mb-1">{t("results.environmental.gasolineSaved")}</p>
                              <p className="text-2xl font-bold text-orange-600">{formatNumber(gasolineSaved)}</p>
                              <p className="text-xs text-muted-foreground mt-1">{t("results.environmental.liters")}</p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </AnimatedElement>
            ) : (
              <AnimatedElement animation="slide-up" className="h-full">
                <Card className="h-full">
                  <CardContent className="p-8 text-center">
                    <div className="text-muted-foreground">
                      <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">{t("form.noResults")}</p>
                      <p className="text-sm">
                        {t("form.noResultsHelper")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedElement>
            )}
          </div>
        </div>

        {/* Mensaje de aclaración y botón de contacto */}
        {results && Number(formData.monthlyConsumption) >= 1000 && (
          <AnimatedElement animation="slide-up" className="mt-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <p className="text-lg text-blue-800 mb-4">
                {t("results.disclaimer")}
              </p>
              <Link href={`/${locale}/contacto`}>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  {t("results.requestQuote")}
                </Button>
              </Link>
            </div>
          </AnimatedElement>
        )}
      </Container>

      <Container size="medium" className="py-16 md:py-4">
        {/* INFORMACIÓN DETALLADA DE COSTOS - ESTILO CONTABILIDAD (SOLO ADMIN) */}
        {results && isAdmin && (
          <AnimatedElement animation="slide-up" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  {t("results.costsTitle")}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {t("results.costsSubtitle")}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tabla de Costos Estilo Contabilidad */}
                <div className="bg-white border rounded-lg overflow-hidden">
                  {/* Header de la tabla */}
                  <div className="bg-slate-50 px-4 py-3 border-b">
                    <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-slate-700">
                      <div className="col-span-1">Item</div>
                      <div className="col-span-5">Descripción</div>
                      <div className="col-span-2 text-center">Cantidad</div>
                      <div className="col-span-2 text-right">Precio Unit.</div>
                      <div className="col-span-2 text-right">Subtotal</div>
                    </div>
                  </div>

                  {/* Equipos Principales */}
                  <div className="divide-y">
                    {/* Paneles Solares */}
                    <div className="px-4 py-3 hover:bg-slate-50">
                      <div className="grid grid-cols-12 gap-4 text-sm">
                        <div className="col-span-1 text-blue-600 font-medium">1</div>
                        <div className="col-span-5">
                          <div className="font-medium">Paneles Solares Bifaciales</div>
                          <div className="text-xs text-muted-foreground">
                            {results.technicalDetails?.panelInfo?.model || "Panel 630W"} -
                            {results.technicalDetails?.panelInfo?.efficiency?.toFixed(1)}% eficiencia
                          </div>
                        </div>
                        <div className="col-span-2 text-center">{formatNumber(results.panelsNeeded)} unidades</div>
                        <div className="col-span-2 text-right">
                          ${formatNumber(results.technicalDetails?.panelInfo?.price_usd) || 0}
                        </div>
                        <div className="col-span-2 text-right font-medium">
                          ${formatNumber(results.systemCost?.panels) || 0}
                        </div>
                      </div>
                    </div>

                    {/* Inversor */}
                    <div className="px-4 py-3 hover:bg-slate-50">
                      <div className="grid grid-cols-12 gap-4 text-sm">
                        <div className="col-span-1 text-green-600 font-medium">2</div>
                        <div className="col-span-5">
                          <div className="font-medium">Inversor {results.technicalDetails?.phase}</div>
                          <div className="text-xs text-muted-foreground">
                            {results.technicalDetails?.inverterInfo?.marca}{" "}
                            {results.technicalDetails?.inverterInfo?.Modelo} -
                            {results.technicalDetails?.inverterInfo?.power_kW} kW
                          </div>
                        </div>
                        <div className="col-span-2 text-center">1 unidad</div>
                        <div className="col-span-2 text-right">${formatNumber(results.systemCost?.inverter) || 0}</div>
                        <div className="col-span-2 text-right font-medium">
                          ${formatNumber(results.systemCost?.inverter) || 0}
                        </div>
                      </div>
                    </div>

                    {/* Baterías (si aplica) */}
                    {results.technicalDetails?.batteryInfo && (
                      <div className="px-4 py-3 hover:bg-slate-50">
                        <div className="grid grid-cols-12 gap-4 text-sm">
                          <div className="col-span-1 text-purple-600 font-medium">3</div>
                          <div className="col-span-5">
                            <div className="font-medium">Sistema de Baterías</div>
                            <div className="text-xs text-muted-foreground">
                              {results.technicalDetails.batteryInfo.selectedBattery.model} -
                              {results.technicalDetails.batteryInfo.selectedBattery.capacity_kWh} kWh -
                              {results.technicalDetails.batteryInfo.autonomyHours}h autonomía
                            </div>
                          </div>
                          <div className="col-span-2 text-center">
                            {formatNumber(results.technicalDetails.batteryInfo.quantity)} unidades
                          </div>
                          <div className="col-span-2 text-right">
                            $
                            {formatNumber(results.systemCost?.battery / results.technicalDetails.batteryInfo.quantity) ||
                              0}
                          </div>
                          <div className="col-span-2 text-right font-medium">
                            ${formatNumber(results.systemCost?.battery) || 0}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Subtotal Equipos */}
                  <div className="bg-blue-50 px-4 py-3 border-t">
                    <div className="grid grid-cols-12 gap-4 text-sm">
                      <div className="col-span-8"></div>
                      <div className="col-span-2 text-right font-semibold">Subtotal Equipos:</div>
                      <div className="col-span-2 text-right font-bold text-blue-600">
                        $
                        {formatNumber(
                          (results.systemCost?.panels || 0) +
                          (results.systemCost?.inverter || 0) +
                          (results.systemCost?.battery || 0),
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Costos de Instalación */}
                <div className="bg-white border rounded-lg overflow-hidden">
                  <div className="bg-green-50 px-4 py-3 border-b">
                    <h4 className="font-semibold text-green-700">{t("results.installationCosts")}</h4>
                  </div>
                  <div className="divide-y">
                    {Object.entries(results.systemCost?.fixedCosts || {}).map(([key, value], index) => {
                      if (key === "total") return null
                      const labels: Record<string, string> = {
                        tablero: "Tablero Eléctrico",
                        aterramiento: "Sistema de Aterramiento",
                        proyecto: "Diseño y Proyecto",
                        pilastra: "Estructura y Pilastra",
                        cableado: "Cableado y Conexiones",
                        instalacion_inversor: "Instalación de Inversor",
                      }
                      return (
                        <div key={key} className="px-4 py-2 hover:bg-slate-50">
                          <div className="grid grid-cols-12 gap-4 text-sm">
                            <div className="col-span-1 text-green-600 font-medium">{index + 4}</div>
                            <div className="col-span-7 font-medium">{labels[key] || key}</div>
                            <div className="col-span-2 text-center">1 servicio</div>
                            <div className="col-span-2 text-right font-medium">${formatNumber(value) || 0}</div>
                          </div>
                        </div>
                      )
                    })}

                    {/* Transporte */}
                    <div className="px-4 py-2 hover:bg-slate-50">
                      <div className="grid grid-cols-12 gap-4 text-sm">
                        <div className="col-span-1 text-orange-600 font-medium">10</div>
                        <div className="col-span-7">
                          <div className="font-medium">{t("results.transport")}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatNumber(results.technicalDetails?.totalWeight)} kg total
                          </div>
                        </div>
                        <div className="col-span-2 text-center">1 envío</div>
                        <div className="col-span-2 text-right font-medium">
                          ${formatNumber(results.systemCost?.transport) || 0}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subtotal Instalación */}
                  <div className="bg-green-50 px-4 py-3 border-t">
                    <div className="grid grid-cols-12 gap-4 text-sm">
                      <div className="col-span-8"></div>
                      <div className="col-span-2 text-right font-semibold">{t("results.installationSubtotal")}:</div>
                      <div className="col-span-2 text-right font-bold text-green-600">
                        $
                        {formatNumber(
                          (results.systemCost?.fixedCosts?.total || 0) + (results.systemCost?.transport || 0),
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ajustes y Costos Variables */}
                <div className="bg-white border rounded-lg overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b">
                    <h4 className="font-semibold text-slate-700">{t("results.adjustments")}</h4>
                  </div>
                  <div className="divide-y">
                    {/* Ajuste por Sector */}
                    {results.systemCost?.sectorAdjustment !== 0 && (
                      <div className="px-4 py-2 hover:bg-slate-50">
                        <div className="grid grid-cols-12 gap-4 text-sm">
                          <div className="col-span-1 text-orange-600 font-medium">11</div>
                          <div className="col-span-7">
                            <div className="font-medium">
                              {t("results.sectorAdjustment")}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {t("results.multiplier")}: {results.technicalDetails?.sectorMultiplier?.toFixed(2)}x
                            </div>
                          </div>
                          <div className="col-span-2 text-center">-</div>
                          <div className="col-span-2 text-right font-medium">
                            ${formatNumber(results.systemCost?.sectorAdjustment) || 0}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Costos Variables */}
                    <div className="px-4 py-2 hover:bg-slate-50">
                      <div className="grid grid-cols-12 gap-4 text-sm">
                        <div className="col-span-1 text-red-600 font-medium">12</div>
                        <div className="col-span-7 font-medium">{t("results.businessSavings")}</div>
                        <div className="col-span-2 text-center">-</div>
                        <div className="col-span-2 text-right font-medium">
                          ${formatNumber(results.systemCost?.variableCosts?.utilidad) || 0}
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-2 hover:bg-slate-50">
                      <div className="grid grid-cols-12 gap-4 text-sm">
                        <div className="col-span-1 text-red-600 font-medium">13</div>
                        <div className="col-span-7 font-medium">{t("results.salesCommission")}</div>
                        <div className="col-span-2 text-center">-</div>
                        <div className="col-span-2 text-right font-medium">
                          ${formatNumber(results.systemCost?.variableCosts?.comision) || 0}
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-2 hover:bg-slate-50">
                      <div className="grid grid-cols-12 gap-4 text-sm">
                        <div className="col-span-1 text-red-600 font-medium">14</div>
                        <div className="col-span-7 font-medium">{t("results.transactionTax")}</div>
                        <div className="col-span-2 text-center">-</div>
                        <div className="col-span-2 text-right font-medium">
                          ${formatNumber(results.systemCost?.variableCosts?.it) || 0}
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-2 hover:bg-slate-50">
                      <div className="grid grid-cols-12 gap-4 text-sm">
                        <div className="col-span-1 text-red-600 font-medium">15</div>
                        <div className="col-span-7 font-medium">{t("results.iva")}</div>
                        <div className="col-span-2 text-center">-</div>
                        <div className="col-span-2 text-right font-medium">
                          ${formatNumber(results.systemCost?.variableCosts?.iva) || 0}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Subtotal Ajustes y Costos Administrativos */}
                  <div className="bg-slate-50 px-4 py-3 border-t">
                    <div className="grid grid-cols-12 gap-4 text-sm">
                      <div className="col-span-8"></div>
                      <div className="col-span-2 text-right font-semibold">{t("results.adjustmentsSubtotal")}:</div>
                      <div className="col-span-2 text-right font-bold text-slate-600">
                        $
                        {formatNumber(
                          (results.systemCost?.sectorAdjustment || 0) + (results.systemCost?.variableCosts?.total || 0),
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total Final */}
                <div className="bg-primary/10 border-2 border-primary/20 rounded-lg overflow-hidden">
                  <div className="px-6 py-4">
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-8">
                        <div className="text-lg font-bold text-primary">{t("results.totalInvestment")}</div>
                        <div className="text-sm text-muted-foreground">{t("results.completeSystem")}</div>
                      </div>
                      <div className="col-span-4 text-right">
                        <div className="text-3xl font-bold text-primary">
                          ${formatNumber(results.systemCost?.total) || 0} USD
                        </div>
                        <div className="text-lg font-semibold text-slate-600">
                          {formatNumber((results.systemCost?.total || 0) * (results.technicalDetails?.exchangeRate || 1))}{" "}
                          Bs
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {t("results.exchangeRate")}: {results.technicalDetails?.exchangeRate} Bs/USD
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </AnimatedElement>
        )}
      </Container>
    </Section>
  )
}