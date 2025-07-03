// Utilidades para trabajar con cotizaciones en Firestore
import { db } from "@/lib/firebase"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  limit,
  where,
  type Timestamp,
} from "firebase/firestore"

// Tipos para las cotizaciones
export interface QuoteData {
  id: string
  formData: {
    monthlyConsumption: string
    department: string
    sector: string
    phase: string
    includeBattery: boolean
  }
  clientInfo: {
    name: string
    phone: string
    phoneCountryCode: string
    phoneNumber: string
  }
  createdAt: Timestamp
  status: string
  source: string
}

export interface QuoteFilters {
  status?: string
  department?: string
  sector?: string
  dateFrom?: Date
  dateTo?: Date
}

export interface QuoteStats {
  total: number
  byStatus: Record<string, number>
  byDepartment: Record<string, number>
  bySector: Record<string, number>
  recent: number
}

/**
 * Obtiene todas las cotizaciones con filtros opcionales
 */
export async function getQuotes(filters: QuoteFilters = {}, limitCount?: number) {
  try {
    let q = query(collection(db, "quotes"), orderBy("createdAt", "desc"))

    // Aplicar filtros
    if (filters.status) {
      q = query(q, where("status", "==", filters.status))
    }
    if (filters.department) {
      q = query(q, where("formData.department", "==", filters.department))
    }
    if (filters.sector) {
      q = query(q, where("formData.sector", "==", filters.sector))
    }

    // Aplicar límite si se especifica
    if (limitCount) {
      q = query(q, limit(limitCount))
    }

    const querySnapshot = await getDocs(q)
    const quotes: QuoteData[] = []

    querySnapshot.forEach((doc) => {
      quotes.push({
        id: doc.id,
        ...doc.data(),
      } as QuoteData)
    })

    return {
      quotes,
      total: quotes.length,
    }
  } catch (error) {
    console.error("Error getting quotes:", error)
    throw error
  }
}

/**
 * Obtiene una cotización específica por ID
 */
export async function getQuoteById(quoteId: string): Promise<QuoteData | null> {
  try {
    const docRef = doc(db, "quotes", quoteId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as QuoteData
    } else {
      return null
    }
  } catch (error) {
    console.error("Error getting quote:", error)
    throw error
  }
}

/**
 * Elimina una cotización por ID
 */
export async function deleteQuote(quoteId: string): Promise<boolean> {
  try {
    const docRef = doc(db, "quotes", quoteId)
    await deleteDoc(docRef)
    return true
  } catch (error) {
    console.error("Error deleting quote:", error)
    throw error
  }
}

/**
 * Obtiene estadísticas de las cotizaciones
 */
export async function getQuoteStats(): Promise<QuoteStats> {
  try {
    const { quotes } = await getQuotes()

    const stats: QuoteStats = {
      total: quotes.length,
      byStatus: {},
      byDepartment: {},
      bySector: {},
      recent: 0,
    }

    // Calcular fecha de hace 7 días para cotizaciones recientes
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    quotes.forEach((quote) => {
      // Estadísticas por estado
      const status = quote.status || "Sin Estado"
      stats.byStatus[status] = (stats.byStatus[status] || 0) + 1

      // Estadísticas por departamento
      const department = quote.formData.department || "Sin Departamento"
      stats.byDepartment[department] = (stats.byDepartment[department] || 0) + 1

      // Estadísticas por sector
      const sector = quote.formData.sector || "Sin Sector"
      stats.bySector[sector] = (stats.bySector[sector] || 0) + 1

      // Cotizaciones recientes (últimos 7 días)
      if (quote.createdAt && quote.createdAt.toDate() >= sevenDaysAgo) {
        stats.recent++
      }
    })

    return stats
  } catch (error) {
    console.error("Error getting quote stats:", error)
    throw error
  }
}

/**
 * Formatea la fecha de una cotización
 */
export function formatQuoteDate(timestamp: Timestamp): string {
  if (!timestamp) return "Fecha no disponible"

  const date = timestamp.toDate()
  return new Intl.DateTimeFormat("es-BO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

/**
 * Obtiene el nombre legible del sector
 */
export function getSectorDisplayName(sectorId: string): string {
  const sectorNames: Record<string, string> = {
    residential: "Residencial",
    commercial: "Comercial",
    industrial: "Industrial",
    public: "Público",
    agricultural: "Agrícola",
  }

  return sectorNames[sectorId] || sectorId
}

/**
 * Obtiene el nombre legible de la fase
 */
export function getPhaseDisplayName(phaseId: string): string {
  const phaseNames: Record<string, string> = {
    P1: "Monofásico (P1)",
    P3: "Trifásico (P3)",
  }

  return phaseNames[phaseId] || phaseId
}



