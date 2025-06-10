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
  Download,
  FileText,
  MessageCircle,
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
  Leaf,
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

export default function CotizadorPage() {
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
💡 Gasto actual: ${results.electricityCost.monthlyBs.toFixed(0)} Bs/mes
🔌 Tipo de instalación: ${phaseName}

💰 Inversión Generación Solar: ${systemCostBs.toFixed(0)} Bs
📈 Retorno: ${actualPaybackYears.toFixed(1)} años
💵 Ahorro anual permitido (80%): ${actualYearlySavingsBs.toFixed(0)} Bs
🌱 Reducción CO₂: ${results.environmental.co2Reduction.toFixed(0)} kg/año

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

  return (
    <Section id="cotizador" heightType="content" fullWidth={true} className="bg-background">
      <Container size="xlarge" className="py-16 md:py-24">
        {/* Header */}
        <AnimatedElement animation="slide-up" className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Calculator className="h-12 w-12 text-primary mr-4" />
            <h1 className="text-4xl font-bold text-foreground">Cotizador Solar</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Calcula tu sistema solar fotovoltaico personalizado para Bolivia
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

        {/* LAYOUT EN COLUMNA - FORMULARIO ARRIBA */}
        <div className="space-y-8">
          {/* Formulario */}
          <AnimatedElement animation="slide-up">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Configuración del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Consumo mensual */}
                  <div className="space-y-2">
                    <label htmlFor="monthlyConsumption" className="block text-sm font-medium text-muted-foreground">
                      Consumo Mensual (kWh) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="monthlyConsumption"
                      name="monthlyConsumption"
                      type="number"
                      value={formData.monthlyConsumption}
                      onChange={handleChange}
                      placeholder="Ej: 300"
                      className={errors.monthlyConsumption ? "border-red-500" : ""}
                    />
                    <p className="text-xs text-muted-foreground">
                      Revisa tu factura de electricidad para obtener este dato
                    </p>
                    {errors.monthlyConsumption && <p className="text-xs text-red-500">{errors.monthlyConsumption}</p>}
                  </div>

                  {/* Departamento */}
                  <div className="space-y-2">
                    <label htmlFor="department" className="block text-sm font-medium text-muted-foreground">
                      <MapPin className="h-4 w-4 inline mr-1" />
                      Departamento <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => handleSelectChange("department", value)}
                    >
                      <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                        <SelectValue placeholder="Selecciona tu departamento" />
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
                            Radiación solar:{" "}
                            {getSolarRadiationByDepartment(config, formData.department as BoliviaDepartment).toFixed(1)}{" "}
                            kWh/m²/día
                          </span>
                        </div>
                      </div>
                    )}
                    {errors.department && <p className="text-xs text-red-500">{errors.department}</p>}
                  </div>

                  {/* Sector */}
                  <div className="space-y-2">
                    <label htmlFor="sector" className="block text-sm font-medium text-muted-foreground">
                      <Building className="h-4 w-4 inline mr-1" />
                      Sector <span className="text-red-500">*</span>
                    </label>
                    <Select value={formData.sector} onValueChange={(value) => handleSelectChange("sector", value)}>
                      <SelectTrigger className={errors.sector ? "border-red-500" : ""}>
                        <SelectValue placeholder="Selecciona el sector" />
                      </SelectTrigger>
                      <SelectContent>
                        {SECTORS.map((sector) => {
                          const IconComponent = sector.icon
                          return (
                            <SelectItem key={sector.id} value={sector.id}>
                              <div className="flex items-center">
                                <IconComponent className="h-4 w-4 mr-2" />
                                <div>
                                  <div className="font-medium">{sector.name}</div>
                                  <div className="text-xs text-muted-foreground">{sector.description}</div>
                                  <div className="text-xs text-blue-600">{sector.electricityType}</div>
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
                      Tipo de Instalación <span className="text-red-500">*</span>
                    </label>
                    <Select value={formData.phase} onValueChange={(value) => handleSelectChange("phase", value)}>
                      <SelectTrigger className={errors.phase ? "border-red-500" : ""}>
                        <SelectValue placeholder="Selecciona el tipo de fase" />
                      </SelectTrigger>
                      <SelectContent>
                        {PHASES.map((phase) => {
                          const IconComponent = phase.icon
                          return (
                            <SelectItem key={phase.id} value={phase.id}>
                              <div className="flex items-center">
                                <IconComponent className="h-4 w-4 mr-2" />
                                <div>
                                  <div className="font-medium">{phase.name}</div>
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
                        Incluir sistema de respaldo con batería
                      </label>
                    </div>
                    {formData.includeBattery && (
                      <div className="bg-yellow-50 p-3 rounded-lg text-sm">
                        <div className="flex items-center text-amber-600 mb-1">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="font-medium">Sistema de Emergencia</span>
                        </div>
                        <p className="text-amber-700">
                          Se calculará automáticamente la configuración óptima de baterías para proporcionar{" "}
                          <strong>4 horas de autonomía</strong> completa en caso de emergencia.
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
                      <span className="font-medium">Tu Gasto Actual de Electricidad</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span>Tarifa aplicable:</span>
                        <span className="font-medium">{currentElectricityCost.rateType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Costo mensual:</span>
                        <span className="font-semibold text-red-600">
                          {currentElectricityCost.costBs.toFixed(0)} Bs
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Costo anual:</span>
                        <span className="font-semibold text-red-600">
                          {(currentElectricityCost.costBs * 12).toFixed(0)} Bs
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
                    className="w-full max-w-md"
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
                        Calculando...
                      </span>
                    ) : isLoadingConfig ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Cargando configuración...
                      </span>
                    ) : !config ? (
                      <span className="flex items-center">
                        <span className="mr-2">⚠️</span>
                        Error de configuración
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Calculator className="mr-2 h-5 w-5" />
                        {results ? "Recalcular Sistema" : "Calcular Sistema"}
                      </span>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AnimatedElement>

          {/* RESULTADOS - RENDERIZADO DIRECTO SIN CONDICIONES COMPLEJAS */}
          {results && (
            <AnimatedElement animation="slide-up">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      <span className="text-2xl font-bold text-primary">Resultado de Cotización</span>
                    </div>
                    <Badge variant="secondary">Vista Administrador</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Tu Gasto Actual de Electricidad */}
                  <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 flex items-center text-red-700">
                      <Zap className="h-6 w-6 mr-2" />
                      Tu Gasto Actual de Electricidad
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">Gasto Mensual</p>
                        <p className="text-4xl font-bold text-red-600">
                          {results.electricityCost?.monthlyBs?.toFixed(0) || "0"} Bs
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {results.electricityCost?.rateType || "Tarifa no disponible"}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">Gasto Anual</p>
                        <p className="text-4xl font-bold text-red-600">
                          {results.savings?.yearlyBs?.toFixed(0) || "0"} Bs
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">12 meses</p>
                      </div>
                    </div>
                  </div>

                  {/* Sistema Propuesto - Solo para admins */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Sistema Propuesto</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Paneles:</p>
                        <p className="font-semibold">{results.panelsNeeded || 0} × 630W bifaciales</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Inversor:</p>
                        <p className="font-semibold">
                          {results.technicalDetails?.inverterInfo?.Modelo || "No disponible"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Potencia Total:</p>
                        <p className="font-semibold">{results.totalPower?.toFixed(1) || "0"} kW</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Tipo:</p>
                        <p className="font-semibold">
                          {PHASES.find((p) => p.id === formData.phase)?.name || "No seleccionado"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Inversión Generación Solar */}
                  <div className="text-center bg-primary/10 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">Inversión Generación Solar</h3>
                    <p className="text-5xl font-bold text-primary">
                      {((results.systemCost?.total || 0) * (results.technicalDetails?.exchangeRate || 1)).toFixed(0)} Bs
                    </p>
                    {results.systemCost?.transport > 0 && (
                      <p className="text-sm text-muted-foreground mt-2">(Incluye transporte a {formData.department})</p>
                    )}
                  </div>

                  {/* ROI (Retorno de Inversión) */}
                  <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 flex items-center text-green-700">
                      <ArrowRight className="h-6 w-6 mr-2" />
                      ROI (Retorno de Inversión)
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                        <p className="text-sm text-amber-700">
                          <strong>Nota Regulatoria:</strong> El ente regulador permite reducir hasta el 80% de tu
                          factura eléctrica con energía solar.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-2">Ahorro Anual Permitido (80%)</p>
                          <p className="text-4xl font-bold text-green-600">
                            {((results.electricityCost?.monthlyBs || 0) * 0.8 * 12).toFixed(0)} Bs
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {((results.electricityCost?.monthlyBs || 0) * 0.8).toFixed(0)} Bs/mes
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-2">Tiempo de Retorno</p>
                          <p className="text-4xl font-bold text-blue-600">
                            {(
                              ((results.systemCost?.total || 0) * (results.technicalDetails?.exchangeRate || 1)) /
                              ((results.electricityCost?.monthlyBs || 0) * 0.8 * 12)
                            ).toFixed(1)}{" "}
                            años
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">Para recuperar inversión</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información Detallada del Sistema - Solo para admins */}
                  <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 flex items-center text-slate-700">
                      <Settings className="h-6 w-6 mr-2" />
                      Información Detallada del Sistema
                    </h3>

                    {/* Equipos Seleccionados */}
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded border">
                        <h4 className="font-semibold mb-3 text-slate-700">Equipos Seleccionados</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          {/* Panel Solar */}
                          <div className="space-y-2">
                            <p className="font-medium text-blue-600">Panel Solar</p>
                            <div className="space-y-1">
                              <p>
                                <span className="text-muted-foreground">Modelo:</span>{" "}
                                {results.technicalDetails?.panelInfo?.model || "N/A"}
                              </p>
                              <p>
                                <span className="text-muted-foreground">Potencia:</span>{" "}
                                {results.technicalDetails?.panelInfo?.power_watt || 0}W
                              </p>
                              <p>
                                <span className="text-muted-foreground">Eficiencia:</span>{" "}
                                {results.technicalDetails?.panelInfo?.efficiency?.toFixed(1) || 0}%
                              </p>
                              <p>
                                <span className="text-muted-foreground">Tipo:</span>{" "}
                                {results.technicalDetails?.panelInfo?.type || "N/A"}
                              </p>
                              <p>
                                <span className="text-muted-foreground">Cantidad:</span> {results.panelsNeeded} unidades
                              </p>
                              <p>
                                <span className="text-muted-foreground">Precio unitario:</span> $
                                {results.technicalDetails?.panelInfo?.price_usd || 0}
                              </p>
                              <p>
                                <span className="text-muted-foreground">Total paneles:</span> $
                                {results.systemCost?.panels?.toFixed(0) || 0}
                              </p>
                            </div>
                          </div>

                          {/* Inversor */}
                          <div className="space-y-2">
                            <p className="font-medium text-green-600">Inversor</p>
                            <div className="space-y-1">
                              <p>
                                <span className="text-muted-foreground">Modelo:</span>{" "}
                                {results.technicalDetails?.inverterInfo?.Modelo || "N/A"}
                              </p>
                              <p>
                                <span className="text-muted-foreground">Marca:</span>{" "}
                                {results.technicalDetails?.inverterInfo?.marca || "N/A"}
                              </p>
                              <p>
                                <span className="text-muted-foreground">Potencia:</span>{" "}
                                {results.technicalDetails?.inverterInfo?.power_kW || 0} kW
                              </p>
                              <p>
                                <span className="text-muted-foreground">Fase:</span>{" "}
                                {results.technicalDetails?.inverterInfo?.phase || "N/A"}
                              </p>
                              <p>
                                <span className="text-muted-foreground">Versión:</span>{" "}
                                {results.technicalDetails?.inverterInfo?.version || "N/A"}
                              </p>
                              <p>
                                <span className="text-muted-foreground">Precio:</span> $
                                {results.systemCost?.inverter?.toFixed(0) || 0}
                              </p>
                            </div>
                          </div>

                          {/* Batería (si aplica) */}
                          {results.technicalDetails?.batteryInfo && (
                            <div className="space-y-2 md:col-span-2">
                              <p className="font-medium text-purple-600">Sistema de Baterías</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <p>
                                    <span className="text-muted-foreground">Modelo:</span>{" "}
                                    {results.technicalDetails.batteryInfo.selectedBattery.model}
                                  </p>
                                  <p>
                                    <span className="text-muted-foreground">Tecnología:</span>{" "}
                                    {results.technicalDetails.batteryInfo.selectedBattery.technology}
                                  </p>
                                  <p>
                                    <span className="text-muted-foreground">Capacidad unitaria:</span>{" "}
                                    {results.technicalDetails.batteryInfo.selectedBattery.capacity_kWh} kWh
                                  </p>
                                  <p>
                                    <span className="text-muted-foreground">Capacidad usable:</span>{" "}
                                    {results.technicalDetails.batteryInfo.selectedBattery.usable_kWh} kWh
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <p>
                                    <span className="text-muted-foreground">Cantidad:</span>{" "}
                                    {results.technicalDetails.batteryInfo.quantity} unidades
                                  </p>
                                  <p>
                                    <span className="text-muted-foreground">Capacidad total:</span>{" "}
                                    {results.technicalDetails.batteryInfo.totalCapacity} kWh
                                  </p>
                                  <p>
                                    <span className="text-muted-foreground">Autonomía:</span>{" "}
                                    {results.technicalDetails.batteryInfo.autonomyHours} horas
                                  </p>
                                  <p>
                                    <span className="text-muted-foreground">Total baterías:</span> $
                                    {results.systemCost?.battery?.toFixed(0) || 0}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Desglose de Costos */}
                      <div className="bg-white p-4 rounded border">
                        <h4 className="font-semibold mb-3 text-slate-700">Desglose Detallado de Costos</h4>
                        <div className="space-y-3">
                          {/* Costos de Equipos */}
                          <div>
                            <p className="font-medium text-blue-600 mb-2">Costos de Equipos</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                              <div className="flex justify-between">
                                <span>Paneles:</span>
                                <span>${results.systemCost?.panels?.toFixed(0) || 0}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Inversor:</span>
                                <span>${results.systemCost?.inverter?.toFixed(0) || 0}</span>
                              </div>
                              {results.systemCost?.battery > 0 && (
                                <div className="flex justify-between">
                                  <span>Baterías:</span>
                                  <span>${results.systemCost?.battery?.toFixed(0) || 0}</span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span>Transporte:</span>
                                <span>${results.systemCost?.transport?.toFixed(0) || 0}</span>
                              </div>
                            </div>
                          </div>

                          {/* Costos Fijos */}
                          <div>
                            <p className="font-medium text-green-600 mb-2">Costos Fijos de Instalación</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                              <div className="flex justify-between">
                                <span>Tablero:</span>
                                <span>${results.systemCost?.fixedCosts?.tablero?.toFixed(0) || 0}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Aterramiento:</span>
                                <span>${results.systemCost?.fixedCosts?.aterramiento?.toFixed(0) || 0}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Proyecto:</span>
                                <span>${results.systemCost?.fixedCosts?.proyecto?.toFixed(0) || 0}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Pilastra:</span>
                                <span>${results.systemCost?.fixedCosts?.pilastra?.toFixed(0) || 0}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Cableado:</span>
                                <span>${results.systemCost?.fixedCosts?.cableado?.toFixed(0) || 0}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Instalación:</span>
                                <span>${results.systemCost?.fixedCosts?.instalacion_inversor?.toFixed(0) || 0}</span>
                              </div>
                            </div>
                            <div className="mt-2 pt-2 border-t">
                              <div className="flex justify-between font-medium">
                                <span>Total Costos Fijos:</span>
                                <span>${results.systemCost?.fixedCosts?.total?.toFixed(0) || 0}</span>
                              </div>
                            </div>
                          </div>

                          {/* Ajuste por Sector */}
                          {results.systemCost?.sectorAdjustment !== 0 && (
                            <div>
                              <p className="font-medium text-orange-600 mb-2">Ajuste por Sector</p>
                              <div className="text-sm">
                                <div className="flex justify-between">
                                  <span>
                                    Multiplicador sector {SECTORS.find((s) => s.id === formData.sector)?.name}:
                                  </span>
                                  <span>{results.technicalDetails?.sectorMultiplier?.toFixed(2) || 1}x</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Ajuste:</span>
                                  <span>${results.systemCost?.sectorAdjustment?.toFixed(0) || 0}</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Costos Variables */}
                          <div>
                            <p className="font-medium text-red-600 mb-2">Costos Variables</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                              <div className="flex justify-between">
                                <span>Utilidad (40%):</span>
                                <span>${results.systemCost?.variableCosts?.utilidad?.toFixed(0) || 0}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Comisión (3%):</span>
                                <span>${results.systemCost?.variableCosts?.comision?.toFixed(0) || 0}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>IT (3%):</span>
                                <span>${results.systemCost?.variableCosts?.it?.toFixed(0) || 0}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>IVA (13%):</span>
                                <span>${results.systemCost?.variableCosts?.iva?.toFixed(0) || 0}</span>
                              </div>
                            </div>
                            <div className="mt-2 pt-2 border-t">
                              <div className="flex justify-between font-medium">
                                <span>Total Variables:</span>
                                <span>${results.systemCost?.variableCosts?.total?.toFixed(0) || 0}</span>
                              </div>
                            </div>
                          </div>

                          {/* Total Final */}
                          <div className="bg-primary/10 p-3 rounded">
                            <div className="flex justify-between text-lg font-bold text-primary">
                              <span>TOTAL SISTEMA:</span>
                              <span>${results.systemCost?.total?.toFixed(0) || 0} USD</span>
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground mt-1">
                              <span>En Bolivianos:</span>
                              <span>
                                {(
                                  (results.systemCost?.total || 0) * (results.technicalDetails?.exchangeRate || 1)
                                ).toFixed(0)}{" "}
                                Bs
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ganancias */}
                  <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 flex items-center text-emerald-700">
                      <TrendingUp className="h-6 w-6 mr-2" />
                      Ganancias
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded border">
                        <p className="text-sm text-muted-foreground mb-3">
                          Después de{" "}
                          {(
                            ((results.systemCost?.total || 0) * (results.technicalDetails?.exchangeRate || 1)) /
                            ((results.electricityCost?.monthlyBs || 0) * 0.8 * 12)
                          ).toFixed(1)}{" "}
                          años, durante los próximos{" "}
                          {(
                            25 -
                            ((results.systemCost?.total || 0) * (results.technicalDetails?.exchangeRate || 1)) /
                              ((results.electricityCost?.monthlyBs || 0) * 0.8 * 12)
                          ).toFixed(1)}{" "}
                          años de vida útil del sistema:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Ganancia Mensual</p>
                            <p className="text-2xl font-bold text-emerald-600">
                              {((results.electricityCost?.monthlyBs || 0) * 0.8).toFixed(0)} Bs
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Ganancia Anual</p>
                            <p className="text-2xl font-bold text-emerald-600">
                              {((results.electricityCost?.monthlyBs || 0) * 0.8 * 12).toFixed(0)} Bs
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Ganancia Total</p>
                            <p className="text-2xl font-bold text-emerald-600">
                              {(
                                (results.electricityCost?.monthlyBs || 0) *
                                0.8 *
                                12 *
                                (25 -
                                  ((results.systemCost?.total || 0) * (results.technicalDetails?.exchangeRate || 1)) /
                                    ((results.electricityCost?.monthlyBs || 0) * 0.8 * 12))
                              ).toFixed(0)}{" "}
                              Bs
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              En{" "}
                              {(
                                25 -
                                ((results.systemCost?.total || 0) * (results.technicalDetails?.exchangeRate || 1)) /
                                  ((results.electricityCost?.monthlyBs || 0) * 0.8 * 12)
                              ).toFixed(1)}{" "}
                              años
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Impacto Ambiental */}
                  <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 flex items-center text-green-700">
                      <Leaf className="h-6 w-6 mr-2" />
                      Impacto Ambiental
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-2">Reducción CO₂ Anual</p>
                          <p className="text-3xl font-bold text-green-600">
                            {(results.environmental?.co2Reduction || 0).toFixed(0)} kg
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-2">Reducción CO₂ (25 años)</p>
                          <p className="text-3xl font-bold text-green-600">
                            {(results.environmental?.co2Reduction25Years || 0).toFixed(0)} kg
                          </p>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded border">
                        <h4 className="font-semibold mb-3 text-green-700">Equivalencias Tangibles</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="text-center p-3 bg-green-50 rounded">
                            <div className="text-2xl mb-2">🌳</div>
                            <p className="font-semibold text-green-700">
                              {Math.round((results.environmental?.co2Reduction || 0) / 22)} árboles
                            </p>
                            <p className="text-xs text-muted-foreground">plantados y creciendo por 10 años</p>
                          </div>
                          <div className="text-center p-3 bg-blue-50 rounded">
                            <div className="text-2xl mb-2">🚗</div>
                            <p className="font-semibold text-blue-700">
                              {Math.round((results.environmental?.co2Reduction || 0) / 0.12).toLocaleString()} km
                            </p>
                            <p className="text-xs text-muted-foreground">menos de conducción en auto</p>
                          </div>
                          <div className="text-center p-3 bg-orange-50 rounded">
                            <div className="text-2xl mb-2">🏠</div>
                            <p className="font-semibold text-orange-700">1 casa</p>
                            <p className="text-xs text-muted-foreground">sin electricidad por un año</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={handleWhatsAppQuote} className="flex-1">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      {isAdmin ? "Enviar por WhatsApp" : "Solicitar Cotización"}
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Download className="mr-2 h-5 w-5" />
                      Descargar Reporte
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <FileText className="mr-2 h-5 w-5" />
                      Reporte Técnico PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </AnimatedElement>
          )}

          {/* Panel de depuración temporal */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
            <p>
              <strong>Debug:</strong> Resultados disponibles: {results ? "✅" : "❌"}
            </p>
            <p>
              <strong>Auth Status:</strong> {status}
            </p>
            <p>
              <strong>Admin:</strong> {isAdmin ? "Sí" : "No"}
            </p>
            <p>
              <strong>Renderizado:</strong> {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </Container>
    </Section>
  )
}
