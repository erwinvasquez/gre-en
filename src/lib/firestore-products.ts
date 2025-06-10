import { doc, getDoc } from "firebase/firestore"
import { db } from "./firebase"

// Tipos para la nueva estructura
export interface Panel {
  model: string
  power_watt: number
  power_kw: number
  type: string
  efficiency: number
  dimensions_mm: number[]
  voltage_vmp: number
  current_imp: number
  voltage_voc: number
  current_isc: number
  weight_kg: number
  certifications: string[]
  warranty: {
    product_years: number
    performance_years: number
    power_after_30_years: number
  }
  price_usd: number
}

export interface Battery {
  model: string
  technology: string
  voltage: number
  capacity_kWh: number
  usable_kWh: number
  max_discharge_kw: number
  peak_discharge_kw: number
  weight_kg: number
  dimensions_mm: number[]
  cycles: number
  dod: number
  communication: string[]
  ip_rating: string
  warranty_years: number
  price_usd: number
}

export interface Inverter {
  Modelo: string
  marca: string
  power_kW: number
  phase: "P1" | "P3"
  version: string
  price: number
}

export interface CotizadorConfig {
  panels: Panel[]
  batteries: Battery[]
  radiation_by_department: Record<string, number>
  costFactors: {
    fixedCosts: {
      tablero: number
      aterramiento: number
      proyecto: number
      pilastra: number
      cableado: number
      instalacion_inversor: number
    }
    variableCosts: {
      utilidad: number
      comision: number
      it: number
      iva: number
    }
    transportPerKg: Record<string, number>
    exchangeRate: number // Tipo de cambio Bs a USD
  }
  electricityRates: {
    residential: {
      minCharge_kWh: number
      minCharge_Bs: number
      tiers: Array<{
        from: number
        to: number | null
        rate_Bs: number
      }>
      tarifaDignidad: {
        max_kWh: number
        discountPercent: number
      }
    }
    commercial: {
      minCharge_kWh: number
      minCharge_Bs: number
      tiers: Array<{
        from: number
        to: number | null
        rate_Bs: number
      }>
    }
    industrial: {
      note: string
      flatEstimate_Bs_per_kWh: number
    }
  }
  inverters: Inverter[]
}

// Tipo para el resultado del cálculo de baterías
export interface BatteryCalculationResult {
  selectedBattery: Battery
  quantity: number
  totalCapacity: number
  totalUsableCapacity: number
  totalCost: number
  totalWeight: number
  autonomyHours: number
  reason: string
}

// Departamentos de Bolivia
export const BOLIVIA_DEPARTMENTS = [
  "Santa Cruz",
  "La Paz",
  "Cochabamba",
  "Potosí",
  "Chuquisaca",
  "Oruro",
  "Tarija",
  "Beni",
  "Pando",
] as const

export type BoliviaDepartment = (typeof BOLIVIA_DEPARTMENTS)[number]

// Tipos de fase
export type PhaseType = "P1" | "P3"

// Tipos para sectores (mantenemos los mismos)
export type SectorType = "residential" | "commercial" | "industrial" | "public" | "agricultural"

/**
 * Obtener configuración completa del cotizador
 */
export async function getCotizadorConfig(): Promise<CotizadorConfig | null> {
  try {
    const configRef = doc(db, "cotizador_config", "bolivia")
    const docSnap = await getDoc(configRef)

    if (!docSnap.exists()) {
      console.warn("Cotizador config not found")
      return null
    }

    return docSnap.data() as CotizadorConfig
  } catch (error) {
    console.error("Error getting cotizador config:", error)
    return null
  }
}

/**
 * Obtener panel principal (el primero de la lista)
 */
export function getMainPanel(config: CotizadorConfig): Panel | null {
  return config.panels.length > 0 ? config.panels[0] : null
}

/**
 * Obtener baterías disponibles
 */
export function getAvailableBatteries(config: CotizadorConfig): Battery[] {
  return config.batteries
}

/**
 * Calcular la mejor configuración de baterías para 4 horas de autonomía
 */
export function calculateOptimalBatteryConfiguration(
  config: CotizadorConfig,
  monthlyConsumptionKwh: number,
): BatteryCalculationResult | null {
  const batteries = getAvailableBatteries(config)
  if (batteries.length === 0) return null

  // Calcular energía necesaria para 4 horas de autonomía
  const dailyConsumption = monthlyConsumptionKwh / 30 // kWh por día
  const hourlyConsumption = dailyConsumption / 24 // kWh por hora
  const energyNeeded4Hours = hourlyConsumption * 4 // kWh para 4 horas

  // Considerar eficiencia del sistema de baterías (90%)
  const systemEfficiency = 0.9
  const requiredCapacity = energyNeeded4Hours / systemEfficiency

  // Evaluar cada tipo de batería
  const batteryOptions: BatteryCalculationResult[] = []

  batteries.forEach((battery) => {
    // Calcular cantidad necesaria basada en capacidad usable
    const quantityNeeded = Math.ceil(requiredCapacity / battery.usable_kWh)

    // Verificar que no exceda la capacidad máxima de descarga
    const maxDischargeCapacity = battery.max_discharge_kw * 4 // kWh en 4 horas
    const totalMaxDischarge = maxDischargeCapacity * quantityNeeded

    // Si la capacidad de descarga es suficiente
    if (totalMaxDischarge >= energyNeeded4Hours) {
      const result: BatteryCalculationResult = {
        selectedBattery: battery,
        quantity: quantityNeeded,
        totalCapacity: battery.capacity_kWh * quantityNeeded,
        totalUsableCapacity: battery.usable_kWh * quantityNeeded,
        totalCost: battery.price_usd * quantityNeeded,
        totalWeight: battery.weight_kg * quantityNeeded,
        autonomyHours: 4,
        reason: `${quantityNeeded} × ${battery.model} (${battery.capacity_kWh}kWh c/u)`,
      }
      batteryOptions.push(result)
    }
  })

  if (batteryOptions.length === 0) return null

  // Seleccionar la opción más económica
  const bestOption = batteryOptions.reduce((best, current) => {
    // Priorizar por costo total, luego por menor cantidad de unidades
    if (current.totalCost < best.totalCost) return current
    if (current.totalCost === best.totalCost && current.quantity < best.quantity) return current
    return best
  })

  return bestOption
}

/**
 * Obtener inversor apropiado por potencia y fase
 */
export function getInverterByPowerAndPhase(
  config: CotizadorConfig,
  requiredPower: number,
  phase: PhaseType,
): Inverter | null {
  // Filtrar inversores por fase
  const invertersForPhase = config.inverters.filter((inv) => inv.phase === phase)

  // Buscar el inversor más pequeño que cubra la potencia requerida
  const suitableInverters = invertersForPhase
    .filter((inv) => inv.power_kW >= requiredPower)
    .sort((a, b) => a.power_kW - b.power_kW)

  if (suitableInverters.length > 0) {
    return suitableInverters[0]
  }

  // Si no hay inversor que cubra exactamente, buscar el más cercano
  const allInverters = invertersForPhase.sort(
    (a, b) => Math.abs(a.power_kW - requiredPower) - Math.abs(b.power_kW - requiredPower),
  )

  return allInverters.length > 0 ? allInverters[0] : null
}

/**
 * Obtener radiación solar por departamento
 */
export function getSolarRadiationByDepartment(config: CotizadorConfig, department: BoliviaDepartment): number {
  return config.radiation_by_department[department] || config.radiation_by_department["Desconocido"] || 5.2
}

/**
 * Calcular costo de transporte por peso
 */
export function calculateTransportCost(
  config: CotizadorConfig,
  department: BoliviaDepartment,
  totalWeightKg: number,
): number {
  const costPerKg = config.costFactors.transportPerKg[department] || 0
  return totalWeightKg * costPerKg
}

/**
 * Obtener costos fijos
 */
export function getFixedCosts(config: CotizadorConfig) {
  return config.costFactors.fixedCosts
}

/**
 * Multiplicadores por sector (mantenemos los mismos)
 */
export const SECTOR_MULTIPLIERS: Record<SectorType, number> = {
  residential: 1.0,
  commercial: 1.1,
  industrial: 1.2,
  public: 0.95,
  agricultural: 1.05,
}

/**
 * Obtener multiplicador por sector
 */
export function getSectorMultiplier(sector: SectorType): number {
  return SECTOR_MULTIPLIERS[sector] || 1.0
}

/**
 * Obtener inversores disponibles por fase
 */
export function getInvertersByPhase(config: CotizadorConfig, phase: PhaseType): Inverter[] {
  return config.inverters.filter((inv) => inv.phase === phase).sort((a, b) => a.power_kW - b.power_kW)
}

/**
 * Mapear sector a tipo de tarifa eléctrica
 */
export function mapSectorToElectricityRate(sector: SectorType): "residential" | "commercial" | "industrial" {
  switch (sector) {
    case "residential":
      return "residential"
    case "commercial":
    case "public": // Sector público usa tarifa comercial
      return "commercial"
    case "industrial":
    case "agricultural": // Sector agrícola usa tarifa industrial
      return "industrial"
    default:
      return "commercial" // Fallback
  }
}

/**
 * Calcular costo de electricidad mensual según sector y consumo
 */
export function calculateElectricityCost(
  config: CotizadorConfig,
  monthlyConsumptionKwh: number,
  sector: SectorType,
): {
  costBs: number
  costUSD: number
  effectiveRateBs: number
  effectiveRateUSD: number
  details: string
  rateType: string
} {
  const rates = config.electricityRates
  const exchangeRate = config.costFactors.exchangeRate
  const rateType = mapSectorToElectricityRate(sector)

  let result: { costBs: number; effectiveRateBs: number; details: string }

  switch (rateType) {
    case "residential":
      result = calculateResidentialElectricityCost(rates.residential, monthlyConsumptionKwh)
      break
    case "commercial":
      result = calculateCommercialElectricityCost(rates.commercial, monthlyConsumptionKwh)
      break
    case "industrial":
      result = calculateIndustrialElectricityCost(rates.industrial, monthlyConsumptionKwh)
      break
    default:
      result = calculateCommercialElectricityCost(rates.commercial, monthlyConsumptionKwh)
  }

  const costUSD = result.costBs / exchangeRate
  const effectiveRateUSD = result.effectiveRateBs / exchangeRate

  return {
    costBs: result.costBs,
    costUSD,
    effectiveRateBs: result.effectiveRateBs,
    effectiveRateUSD,
    details: result.details,
    rateType: rateType === "residential" ? "Residencial" : rateType === "commercial" ? "Comercial" : "Industrial",
  }
}

/**
 * Calcular costo residencial con tarifas escalonadas y Tarifa Dignidad
 */
function calculateResidentialElectricityCost(
  rates: CotizadorConfig["electricityRates"]["residential"],
  monthlyKwh: number,
): { costBs: number; effectiveRateBs: number; details: string } {
  let totalCostBs = 0
  let remainingKwh = monthlyKwh
  let details = ""

  // Aplicar cargo mínimo si el consumo es menor al mínimo
  if (monthlyKwh <= rates.minCharge_kWh) {
    totalCostBs = rates.minCharge_Bs
    details = `Cargo mínimo: ${rates.minCharge_kWh} kWh = ${rates.minCharge_Bs.toFixed(2)} Bs`
  } else {
    // Calcular por rangos
    const calculations: string[] = []

    for (const tier of rates.tiers) {
      if (remainingKwh <= 0) break

      const tierStart = tier.from
      const tierEnd = tier.to || Number.POSITIVE_INFINITY
      const tierConsumption = Math.min(remainingKwh, tierEnd - tierStart + 1)

      if (tierConsumption > 0) {
        const tierCost = tierConsumption * tier.rate_Bs
        totalCostBs += tierCost
        calculations.push(
          `${tierConsumption.toFixed(0)} kWh (${tierStart}-${tier.to || "∞"}) × ${tier.rate_Bs} Bs = ${tierCost.toFixed(2)} Bs`,
        )
        remainingKwh -= tierConsumption
      }
    }

    details = calculations.join("\n")
  }

  // Aplicar Tarifa Dignidad si aplica (descuento del 25% hasta 70 kWh)
  if (monthlyKwh <= rates.tarifaDignidad.max_kWh) {
    const discount = totalCostBs * (rates.tarifaDignidad.discountPercent / 100)
    totalCostBs -= discount
    details += `\nTarifa Dignidad (-${rates.tarifaDignidad.discountPercent}%): -${discount.toFixed(2)} Bs`
  }

  const effectiveRateBs = totalCostBs / monthlyKwh

  return {
    costBs: totalCostBs,
    effectiveRateBs,
    details: `${details}\nTotal: ${totalCostBs.toFixed(2)} Bs`,
  }
}

/**
 * Calcular costo comercial con tarifas escalonadas
 */
function calculateCommercialElectricityCost(
  rates: CotizadorConfig["electricityRates"]["commercial"],
  monthlyKwh: number,
): { costBs: number; effectiveRateBs: number; details: string } {
  let totalCostBs = 0
  let remainingKwh = monthlyKwh
  let details = ""

  // Aplicar cargo mínimo si el consumo es menor al mínimo
  if (monthlyKwh <= rates.minCharge_kWh) {
    totalCostBs = rates.minCharge_Bs
    details = `Cargo mínimo: ${rates.minCharge_kWh} kWh = ${rates.minCharge_Bs.toFixed(2)} Bs`
  } else {
    // Calcular por rangos
    const calculations: string[] = []

    for (const tier of rates.tiers) {
      if (remainingKwh <= 0) break

      const tierStart = tier.from
      const tierEnd = tier.to || Number.POSITIVE_INFINITY
      const tierConsumption = Math.min(remainingKwh, tierEnd - tierStart + 1)

      if (tierConsumption > 0) {
        const tierCost = tierConsumption * tier.rate_Bs
        totalCostBs += tierCost
        calculations.push(
          `${tierConsumption.toFixed(0)} kWh (${tierStart}-${tier.to || "∞"}) × ${tier.rate_Bs} Bs = ${tierCost.toFixed(2)} Bs`,
        )
        remainingKwh -= tierConsumption
      }
    }

    details = calculations.join("\n")
  }

  const effectiveRateBs = totalCostBs / monthlyKwh

  return {
    costBs: totalCostBs,
    effectiveRateBs,
    details: `${details}\nTotal: ${totalCostBs.toFixed(2)} Bs`,
  }
}

/**
 * Calcular costo industrial con tarifa plana
 */
function calculateIndustrialElectricityCost(
  rates: CotizadorConfig["electricityRates"]["industrial"],
  monthlyKwh: number,
): { costBs: number; effectiveRateBs: number; details: string } {
  const totalCostBs = monthlyKwh * rates.flatEstimate_Bs_per_kWh
  const effectiveRateBs = rates.flatEstimate_Bs_per_kWh

  return {
    costBs: totalCostBs,
    effectiveRateBs,
    details: `${rates.note}\nTarifa plana: ${monthlyKwh} kWh × ${rates.flatEstimate_Bs_per_kWh} Bs = ${totalCostBs.toFixed(2)} Bs`,
  }
}

/**
 * Aplicar costos variables al precio final del sistema
 */
export function applyVariableCosts(
  basePrice: number,
  variableCosts: CotizadorConfig["costFactors"]["variableCosts"],
): {
  finalPrice: number
  breakdown: {
    basePrice: number
    utilidad: number
    comision: number
    it: number
    iva: number
    total: number
  }
} {
  // Aplicar costos en cascada
  let currentPrice = basePrice

  // 1. Utilidad (40%)
  const utilidad = currentPrice * variableCosts.utilidad
  currentPrice += utilidad

  // 2. Comisión (3%)
  const comision = currentPrice * variableCosts.comision
  currentPrice += comision

  // 3. IT (3%)
  const it = currentPrice * variableCosts.it
  currentPrice += it

  // 4. IVA (13%)
  const iva = currentPrice * variableCosts.iva
  currentPrice += iva

  return {
    finalPrice: currentPrice,
    breakdown: {
      basePrice,
      utilidad,
      comision,
      it,
      iva,
      total: currentPrice,
    },
  }
}

/**
 * Obtener costos variables
 */
export function getVariableCosts(config: CotizadorConfig) {
  return config.costFactors.variableCosts
}

/**
 * Obtener tipo de cambio
 */
export function getExchangeRate(config: CotizadorConfig): number {
  return config.costFactors.exchangeRate
}
