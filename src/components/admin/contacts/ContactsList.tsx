"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import {
  getContacts,
  updateContactStatus,
  updateContactType,
  updateContactSector,
  type Contact,
  type ContactFilters,
  type ContactStatus,
  type GenerationType,
  type Sector,
} from "@/lib/contacts"
import { Search, Filter, Users, RefreshCw, Eye, MessageSquare } from "lucide-react"
import Link from "next/link"
import { formatPhoneNumber } from "@/lib/whatsapp"
import { useSession } from "next-auth/react"

// Icono de WhatsApp personalizado
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
  </svg>
)

interface ContactsListProps {
  contacts: Contact[]
  loading: boolean
  onContactSelect: (contact: Contact | null) => void
  showNotification: (message: string, type?: "success" | "error" | "info") => void
  adminId: string
}

export function ContactsList({
  contacts: initialContacts,
  loading: initialLoading,
  onContactSelect,
  showNotification,
  adminId,
}: ContactsListProps) {
  const { data: session } = useSession()

  // Estados locales para manejar la lista
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)
  const [loading, setLoading] = useState(initialLoading)
  const [filters, setFilters] = useState<ContactFilters>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalContacts, setTotalContacts] = useState(0)

  // Actualizar cuando cambien las props
  useEffect(() => {
    setContacts(initialContacts)
    setLoading(initialLoading)
    setTotalContacts(initialContacts.length)
  }, [initialContacts, initialLoading])

  // Cargar datos cuando cambien los filtros
  useEffect(() => {
    loadContacts()
  }, [filters])

  const loadContacts = async () => {
    try {
      setLoading(true)
      console.log("Loading contacts with filters:", filters, "search:", searchTerm)

      const result = await getContacts({ ...filters, search: searchTerm }, itemsPerPage * 3)
      console.log("Contacts loaded successfully:", result.contacts.length)

      setContacts(result.contacts)
      setTotalContacts(result.contacts.length)
    } catch (error) {
      console.error("Error loading contacts:", error)
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      showNotification(`Error al cargar contactos: ${errorMessage}`, "error")
      setContacts([])
      setTotalContacts(0)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (contactId: string, newStatus: string) => {
    try {
      console.log("Changing status for contact:", contactId, "to:", newStatus)

      const currentAdminId = session?.user?.email || adminId || "admin"

      // Actualización optimista
      const updatedContacts = contacts.map((contact) =>
        contact.id === contactId ? { ...contact, status: newStatus as ContactStatus } : contact,
      )
      setContacts(updatedContacts)

      await updateContactStatus(contactId, newStatus as ContactStatus, currentAdminId)
      showNotification("Estado actualizado correctamente", "success")
    } catch (error) {
      console.error("Error updating status:", error)
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      showNotification(`Error al actualizar estado: ${errorMessage}`, "error")
      loadContacts() // Recargar en caso de error
    }
  }

  const handleTypeChange = async (contactId: string, newType: string) => {
    try {
      console.log("Changing type for contact:", contactId, "to:", newType)

      const currentAdminId = session?.user?.email || adminId || "admin"

      // Actualización optimista
      const updatedContacts = contacts.map((contact) =>
        contact.id === contactId ? { ...contact, generationType: newType as GenerationType } : contact,
      )
      setContacts(updatedContacts)

      await updateContactType(contactId, newType as GenerationType, currentAdminId)
      showNotification("Tipo actualizado correctamente", "success")
    } catch (error) {
      console.error("Error updating type:", error)
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      showNotification(`Error al actualizar tipo: ${errorMessage}`, "error")
      loadContacts() // Recargar en caso de error
    }
  }

  const handleSectorChange = async (contactId: string, newSector: string) => {
    try {
      console.log("Changing sector for contact:", contactId, "to:", newSector)

      const currentAdminId = session?.user?.email || adminId || "admin"

      // Actualización optimista
      const updatedContacts = contacts.map((contact) =>
        contact.id === contactId ? { ...contact, sector: newSector as Sector } : contact,
      )
      setContacts(updatedContacts)

      await updateContactSector(contactId, newSector as Sector, currentAdminId)
      showNotification("Sector actualizado correctamente", "success")
    } catch (error) {
      console.error("Error updating sector:", error)
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      showNotification(`Error al actualizar sector: ${errorMessage}`, "error")
      loadContacts() // Recargar en caso de error
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    setFilters((prev) => ({ ...prev, search: searchTerm }))
  }

  const handleFilterChange = (key: keyof ContactFilters, value: string) => {
    setCurrentPage(1)
    setFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
    }))
  }

  const clearFilters = () => {
    setFilters({})
    setSearchTerm("")
    setCurrentPage(1)
    showNotification("Filtros limpiados", "info")
  }

  // Formatear fecha
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Traducir tipo de generación
  const translateGenerationType = (type?: string) => {
    switch (type) {
      case "photovoltaic":
        return "Solar Fotovoltaico"
      case "wind":
        return "Eólica"
      case "bipv":
        return "BIPV"
      default:
        return "No especificado"
    }
  }

  // Traducir sector
  const translateSector = (sector?: string) => {
    switch (sector) {
      case "residential":
        return "Residencial"
      case "commercial":
        return "Comercial"
      case "industrial":
        return "Industrial"
      case "agriculture":
        return "Agrícola"
      case "public":
        return "Público"
      default:
        return "No especificado"
    }
  }

  // Obtener estilo del estado
  const getStatusStyle = (status: ContactStatus) => {
    switch (status) {
      case "Nuevo Contacto":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "En Revisión":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Contactado":
        return "bg-cyan-100 text-cyan-800 border-cyan-200"
      case "Cotización Enviada":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Negociación":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Cerrado - Ganado":
        return "bg-green-100 text-green-800 border-green-200"
      case "Cerrado - Perdido":
        return "bg-red-100 text-red-800 border-red-200"
      case "Seguimiento":
        return "bg-indigo-100 text-indigo-800 border-indigo-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Obtener estilo del tipo
  const getTypeStyle = (type?: string) => {
    switch (type) {
      case "photovoltaic":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "wind":
        return "bg-sky-100 text-sky-800 border-sky-200"
      case "bipv":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Obtener estilo del sector
  const getSectorStyle = (sector?: string) => {
    switch (sector) {
      case "residential":
        return "bg-green-100 text-green-800 border-green-200"
      case "commercial":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "industrial":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "agriculture":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "public":
        return "bg-indigo-100 text-indigo-800 border-indigo-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Calcular número total de páginas
  const totalPages = Math.ceil(totalContacts / itemsPerPage)

  // Generar enlace de WhatsApp
  const getWhatsAppLink = (contact: Contact) => {
    const formattedPhone = formatPhoneNumber(contact.phone || contact.phoneNumber || "", contact.phoneCountryCode)
    const message = `Hola ${contact.name}, te contacto desde GRE-EN respecto a tu consulta sobre ${translateGenerationType(contact.generationType)} para el sector ${translateSector(contact.sector)}.`
    return `https://wa.me/${formattedPhone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
  }

  return (
    <div className="space-y-6">
      {/* Búsqueda y Filtros */}
      <Card>
        <CardContent className="p-4">
          {/* Búsqueda */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nombre, email o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSearch} className="flex-shrink-0">
                <Search className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Buscar</span>
              </Button>
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex-shrink-0">
                <Filter className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Filtros</span>
              </Button>
              <Button variant="outline" onClick={loadContacts} className="flex-shrink-0">
                <RefreshCw className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Actualizar</span>
              </Button>
            </div>
          </div>

          {/* Filtros */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
              <Select onValueChange={(value) => handleFilterChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="Nuevo Contacto">Nuevo Contacto</SelectItem>
                  <SelectItem value="En Revisión">En Revisión</SelectItem>
                  <SelectItem value="Contactado">Contactado</SelectItem>
                  <SelectItem value="Cotización Enviada">Cotización Enviada</SelectItem>
                  <SelectItem value="Negociación">Negociación</SelectItem>
                  <SelectItem value="Cerrado - Ganado">Cerrado - Ganado</SelectItem>
                  <SelectItem value="Cerrado - Perdido">Cerrado - Perdido</SelectItem>
                  <SelectItem value="Seguimiento">Seguimiento</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => handleFilterChange("generationType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de Energía" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="photovoltaic">Solar Fotovoltaico</SelectItem>
                  <SelectItem value="wind">Eólica</SelectItem>
                  <SelectItem value="bipv">BIPV</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => handleFilterChange("sector", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los sectores</SelectItem>
                  <SelectItem value="residential">Residencial</SelectItem>
                  <SelectItem value="commercial">Comercial</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="agriculture">Agrícola</SelectItem>
                  <SelectItem value="public">Público</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={clearFilters}>
                Limpiar Filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selector de items por página */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Mostrar</span>
          <Select
            value={String(itemsPerPage)}
            onValueChange={(value) => {
              setItemsPerPage(Number(value))
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-500">por página</span>
        </div>

        <div className="text-sm text-gray-500">
          Mostrando {contacts.length} de {totalContacts} contactos
        </div>
      </div>

      {/* Tabla de Contactos */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : contacts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron contactos</h3>
            <p className="text-muted-foreground">
              {Object.keys(filters).length > 0 || searchTerm
                ? "Intenta ajustar los filtros de búsqueda"
                : "Aún no hay contactos registrados"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-3 text-center font-medium text-gray-500">Nombre</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500">Contacto</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500">Fecha</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500">Tipo</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500">Sector</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500">Estado</th>
                  <th className="px-4 py-3 text-center font-medium text-gray-500">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {contacts.map((contact) => {
                  const formattedPhone = formatPhoneNumber(
                    contact.phone || contact.phoneNumber || "",
                    contact.phoneCountryCode,
                  )

                  return (
                    <tr key={contact.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-center">{contact.name}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex flex-col">
                          <span className="text-gray-900">{contact.email}</span>
                          <span className="text-gray-500">{formattedPhone}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-center">{formatDate(contact.createdAt)}</td>
                      <td className="px-4 py-3 text-center">
                        <Select onValueChange={(value) => handleTypeChange(contact.id, value)}>
                          <SelectTrigger
                            className={`h-8 w-[140px] text-xs border mx-auto ${getTypeStyle(contact.generationType)}`}
                          >
                            <SelectValue placeholder={translateGenerationType(contact.generationType)} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="photovoltaic">Solar Fotovoltaico</SelectItem>
                            <SelectItem value="wind">Eólica</SelectItem>
                            <SelectItem value="bipv">BIPV</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Select onValueChange={(value) => handleSectorChange(contact.id, value)}>
                          <SelectTrigger
                            className={`h-8 w-[140px] text-xs border mx-auto ${getSectorStyle(contact.sector)}`}
                          >
                            <SelectValue placeholder={translateSector(contact.sector)} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="residential">Residencial</SelectItem>
                            <SelectItem value="commercial">Comercial</SelectItem>
                            <SelectItem value="industrial">Industrial</SelectItem>
                            <SelectItem value="agriculture">Agrícola</SelectItem>
                            <SelectItem value="public">Público</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Select onValueChange={(value) => handleStatusChange(contact.id, value)}>
                          <SelectTrigger
                            className={`h-8 w-[140px] text-xs border mx-auto ${getStatusStyle(contact.status)}`}
                          >
                            <SelectValue placeholder={contact.status} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Nuevo Contacto">Nuevo Contacto</SelectItem>
                            <SelectItem value="En Revisión">En Revisión</SelectItem>
                            <SelectItem value="Contactado">Contactado</SelectItem>
                            <SelectItem value="Cotización Enviada">Cotización Enviada</SelectItem>
                            <SelectItem value="Negociación">Negociación</SelectItem>
                            <SelectItem value="Cerrado - Ganado">Cerrado - Ganado</SelectItem>
                            <SelectItem value="Cerrado - Perdido">Cerrado - Perdido</SelectItem>
                            <SelectItem value="Seguimiento">Seguimiento</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center space-x-2">
                          {contact.message && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              title="Ver mensaje"
                              onClick={() => {
                                showNotification(contact.message || "", "info")
                              }}
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          )}

                          <Link href={`/admin/contacts/${contact.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8" title="Ver detalles">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>

                          <a
                            href={getWhatsAppLink(contact)}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Contactar por WhatsApp"
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <WhatsAppIcon className="h-4 w-4" />
                            </Button>
                          </a>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}










