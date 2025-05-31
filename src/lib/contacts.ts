import { db } from "@/lib/firebase"
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore"

// Tipos
export type ContactStatus =
  | "Nuevo Contacto"
  | "En Revisión"
  | "Contactado"
  | "Cotización Enviada"
  | "Negociación"
  | "Cerrado - Ganado"
  | "Cerrado - Perdido"
  | "Seguimiento"

export type GenerationType = "photovoltaic" | "wind" | "bipv" | string
export type Sector = "residential" | "commercial" | "industrial" | "agriculture" | "public" | string

export interface Contact {
  id: string
  name: string
  email: string
  phone: string
  phoneCountryCode?: string
  phoneNumber?: string
  city?: string
  message?: string
  generationType?: GenerationType
  sector?: Sector
  status: ContactStatus
  createdAt: Date
  updatedAt?: Date
  assignedTo?: string
  lastContactDate?: Date
  nextFollowUp?: Date
  notes?: ContactNote[]
  statusHistory?: StatusChange[]
}

export interface ContactNote {
  id: string
  text: string
  createdBy: string
  createdAt: Date
}

export interface StatusChange {
  status: ContactStatus
  changedBy: string
  changedAt: Date
  note?: string
}

export interface ContactFilters {
  status?: ContactStatus
  generationType?: GenerationType
  sector?: Sector
  search?: string
  assignedTo?: string
  dateFrom?: Date
  dateTo?: Date
}

export interface ContactsResult {
  contacts: Contact[]
  lastDoc?: QueryDocumentSnapshot<DocumentData>
  hasMore: boolean
}

// Funciones

/**
 * Obtiene contactos con filtros y paginación
 */
export async function getContacts(
  filters: ContactFilters = {},
  pageSize = 20,
  lastDoc?: QueryDocumentSnapshot<DocumentData>,
): Promise<ContactsResult> {
  try {
    console.log("🔍 Iniciando getContacts con filtros:", JSON.stringify(filters))

    const contactsRef = collection(db, "contacts")

    // Construir la consulta base
    let q = query(contactsRef, orderBy("createdAt", "desc"))

    // NO aplicar filtros en la consulta de Firestore por ahora
    // Los haremos client-side para debugging
    console.log("📊 Obteniendo todos los contactos para filtrar client-side...")

    // Solo aplicar límite
    q = query(q, limit(pageSize * 2)) // Obtener más para poder filtrar

    // Ejecutar la consulta
    const snapshot = await getDocs(q)
    console.log(`✅ Consulta ejecutada. Documentos encontrados: ${snapshot.size}`)

    // Procesar resultados y mostrar datos reales
    const contacts: Contact[] = snapshot.docs.map((doc) => {
      const data = doc.data()

      // Log para ver qué datos tenemos realmente
      console.log(`📄 Documento ${doc.id}:`, {
        name: data.name,
        generationType: data.generationType,
        sector: data.sector,
        status: data.status,
        allFields: Object.keys(data),
      })

      return {
        id: doc.id,
        name: data.name || "Sin nombre",
        email: data.email || "",
        phone: data.phone || data.phoneNumber || "",
        phoneCountryCode: data.phoneCountryCode,
        phoneNumber: data.phoneNumber,
        city: data.city,
        message: data.message,
        generationType: data.generationType || data.generation_type || data.type,
        sector: data.sector,
        status: data.status || "Nuevo Contacto",
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate(),
        lastContactDate: data.lastContactDate?.toDate(),
        nextFollowUp: data.nextFollowUp?.toDate(),
        notes: Array.isArray(data.notes)
          ? data.notes.map((note: any) => ({
              ...note,
              createdAt: note.createdAt?.toDate() || new Date(),
            }))
          : [],
        statusHistory: Array.isArray(data.statusHistory)
          ? data.statusHistory.map((change: any) => ({
              ...change,
              changedAt: change.changedAt?.toDate() || new Date(),
            }))
          : [],
      } as Contact
    })

    console.log(`✅ Procesados ${contacts.length} contactos`)

    // Aplicar filtros client-side
    let filteredContacts = contacts

    if (filters.status) {
      filteredContacts = filteredContacts.filter((contact) => contact.status === filters.status)
      console.log(`🔍 Filtro de estado aplicado: ${filters.status}. Resultados: ${filteredContacts.length}`)
    }

    if (filters.generationType) {
      filteredContacts = filteredContacts.filter((contact) => contact.generationType === filters.generationType)
      console.log(`🔍 Filtro de tipo aplicado: ${filters.generationType}. Resultados: ${filteredContacts.length}`)
    }

    if (filters.sector) {
      filteredContacts = filteredContacts.filter((contact) => contact.sector === filters.sector)
      console.log(`🔍 Filtro de sector aplicado: ${filters.sector}. Resultados: ${filteredContacts.length}`)
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filteredContacts = filteredContacts.filter(
        (contact) =>
          (contact.name && contact.name.toLowerCase().includes(searchLower)) ||
          (contact.email && contact.email.toLowerCase().includes(searchLower)) ||
          (contact.phone && contact.phone.toLowerCase().includes(searchLower)) ||
          (contact.city && contact.city.toLowerCase().includes(searchLower)),
      )
      console.log(`🔍 Filtro de búsqueda aplicado: ${filters.search}. Resultados: ${filteredContacts.length}`)
    }

    // Limitar resultados finales
    const finalContacts = filteredContacts.slice(0, pageSize)

    console.log(`🏁 getContacts completado. Retornando ${finalContacts.length} contactos`)
    return {
      contacts: finalContacts,
      lastDoc: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : undefined,
      hasMore: filteredContacts.length > pageSize,
    }
  } catch (error) {
    console.error("❌❌❌ Error crítico en getContacts:", error)
    throw new Error(`Error al obtener contactos: ${error instanceof Error ? error.message : "Error desconocido"}`)
  }
}

/**
 * Actualiza el tipo de generación de un contacto
 */
export async function updateContactType(contactId: string, newType: GenerationType, adminId = "admin"): Promise<void> {
  try {
    console.log("Updating contact type:", { contactId, newType, adminId })

    if (!contactId) {
      throw new Error("Contact ID is required")
    }

    if (!newType) {
      throw new Error("New type is required")
    }

    const contactRef = doc(db, "contacts", contactId)

    // Verificar si el documento existe
    const contactSnap = await getDoc(contactRef)
    if (!contactSnap.exists()) {
      throw new Error("Contact not found")
    }

    // Actualizar documento
    const updateData = {
      generationType: newType,
      updatedAt: new Date(),
    }

    console.log("Updating with data:", updateData)

    await updateDoc(contactRef, updateData)

    console.log("Contact type updated successfully")
  } catch (error) {
    console.error("Error updating contact type:", error)
    throw error
  }
}

/**
 * Actualiza el sector de un contacto
 */
export async function updateContactSector(contactId: string, newSector: Sector, adminId = "admin"): Promise<void> {
  try {
    console.log("Updating contact sector:", { contactId, newSector, adminId })

    if (!contactId) {
      throw new Error("Contact ID is required")
    }

    if (!newSector) {
      throw new Error("New sector is required")
    }

    const contactRef = doc(db, "contacts", contactId)

    // Verificar si el documento existe
    const contactSnap = await getDoc(contactRef)
    if (!contactSnap.exists()) {
      throw new Error("Contact not found")
    }

    // Actualizar documento
    const updateData = {
      sector: newSector,
      updatedAt: new Date(),
    }

    console.log("Updating with data:", updateData)

    await updateDoc(contactRef, updateData)

    console.log("Contact sector updated successfully")
  } catch (error) {
    console.error("Error updating contact sector:", error)
    throw error
  }
}

/**
 * Obtiene un contacto por ID
 */
export async function getContactById(contactId: string): Promise<Contact | null> {
  try {
    const contactRef = doc(db, "contacts", contactId)
    const contactSnap = await getDoc(contactRef)

    if (!contactSnap.exists()) {
      return null
    }

    const data = contactSnap.data()
    return {
      id: contactSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate(),
      lastContactDate: data.lastContactDate?.toDate(),
      nextFollowUp: data.nextFollowUp?.toDate(),
      notes: data.notes?.map((note: any) => ({
        ...note,
        createdAt: note.createdAt?.toDate() || new Date(),
      })),
      statusHistory: data.statusHistory?.map((change: any) => ({
        ...change,
        changedAt: change.changedAt?.toDate() || new Date(),
      })),
    } as Contact
  } catch (error) {
    console.error("Error getting contact:", error)
    throw new Error("Failed to get contact")
  }
}

/**
 * Actualiza el estado de un contacto
 */
export async function updateContactStatus(
  contactId: string,
  newStatus: ContactStatus,
  adminId = "admin",
  note?: string,
): Promise<void> {
  try {
    console.log("Updating contact status:", { contactId, newStatus, adminId })

    if (!contactId) {
      throw new Error("Contact ID is required")
    }

    if (!newStatus) {
      throw new Error("New status is required")
    }

    const contactRef = doc(db, "contacts", contactId)

    // Verificar si el documento existe
    const contactSnap = await getDoc(contactRef)
    if (!contactSnap.exists()) {
      throw new Error("Contact not found")
    }

    const contactData = contactSnap.data()
    const currentStatus = contactData.status

    console.log("Current status:", currentStatus, "New status:", newStatus)

    // Crear entrada de historial con Date() en lugar de serverTimestamp()
    const statusChange = {
      status: newStatus,
      changedBy: adminId || "admin",
      changedAt: new Date(),
      note: note || `Estado cambiado de "${currentStatus}" a "${newStatus}"`,
    }

    // Obtener el historial actual y agregar el nuevo cambio
    const currentHistory = contactData.statusHistory || []
    const updatedHistory = [...currentHistory, statusChange]

    // Actualizar documento con el historial completo
    const updateData = {
      status: newStatus,
      updatedAt: new Date(),
      statusHistory: updatedHistory,
    }

    console.log("Updating with data:", updateData)

    await updateDoc(contactRef, updateData)

    console.log("Contact status updated successfully")
  } catch (error) {
    console.error("Error updating contact status:", error)
    throw error
  }
}

/**
 * Añade una nota a un contacto
 */
export async function addContactNote(contactId: string, text: string, adminId: string): Promise<void> {
  try {
    const contactRef = doc(db, "contacts", contactId)
    const contactSnap = await getDoc(contactRef)

    if (!contactSnap.exists()) {
      throw new Error("Contact not found")
    }

    const contactData = contactSnap.data()

    const newNote = {
      id: `note_${Date.now()}`,
      text,
      createdBy: adminId,
      createdAt: new Date(),
    }

    const currentNotes = contactData.notes || []
    const updatedNotes = [...currentNotes, newNote]

    await updateDoc(contactRef, {
      notes: updatedNotes,
      updatedAt: new Date(),
      lastContactDate: new Date(),
    })
  } catch (error) {
    console.error("Error adding contact note:", error)
    throw new Error("Failed to add contact note")
  }
}

/**
 * Asigna un contacto a un administrador
 */
export async function assignContact(contactId: string, adminId: string): Promise<void> {
  try {
    const contactRef = doc(db, "contacts", contactId)

    await updateDoc(contactRef, {
      assignedTo: adminId,
      updatedAt: new Date(),
    })
  } catch (error) {
    console.error("Error assigning contact:", error)
    throw new Error("Failed to assign contact")
  }
}

/**
 * Obtiene estadísticas de contactos
 */
export async function getContactStats() {
  try {
    const snapshot = await getDocs(collection(db, "contacts"))

    const contacts = snapshot.docs.map((doc) => doc.data())
    const total = contacts.length

    // Agrupar por estado
    const byStatus: Record<string, number> = {}
    contacts.forEach((contact) => {
      const status = contact.status || "Desconocido"
      byStatus[status] = (byStatus[status] || 0) + 1
    })

    // Agrupar por tipo de generación
    const byGenerationType: Record<string, number> = {}
    contacts.forEach((contact) => {
      const type = contact.generationType || "Desconocido"
      byGenerationType[type] = (byGenerationType[type] || 0) + 1
    })

    // Agrupar por sector
    const bySector: Record<string, number> = {}
    contacts.forEach((contact) => {
      const sector = contact.sector || "Desconocido"
      bySector[sector] = (bySector[sector] || 0) + 1
    })

    return {
      total,
      byStatus,
      byGenerationType,
      bySector,
    }
  } catch (error) {
    console.error("Error getting contact stats:", error)
    throw new Error("Failed to get contact statistics")
  }
}




  