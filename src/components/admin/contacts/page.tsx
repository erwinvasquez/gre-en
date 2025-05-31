"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { ContactCard } from "@/components/admin/contacts/ContactCard"
import { AdminGuard } from "@/components/auth/RoleGuard"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import {
  getContacts,
  getContactStats,
  updateContactStatus,
  type Contact,
  type ContactFilters,
  type ContactStatus,
} from "@/lib/contacts"
import { useAuth } from "@/hooks/useAuth"
import { Search, Filter, Users, TrendingUp, Clock, CheckCircle, RefreshCw } from "lucide-react"

export default function ContactsAdminPage() {
  const t = useTranslations("Admin")
  const { session, isAuthenticated } = useAuth()

  // Estados
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [filters, setFilters] = useState<ContactFilters>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [notification, setNotification] = useState<{
    message: string
    type: "success" | "error" | "info"
  } | null>(null)

  // Función simple para mostrar notificaciones
  const showNotification = (message: string, type: "success" | "error" | "info" = "info") => {
    setNotification({ message, type })
    // Auto-ocultar después de 3 segundos
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  // Cargar datos iniciales
  useEffect(() => {
    loadContacts()
    loadStats()
  }, [filters])

  const loadContacts = async () => {
    try {
      setLoading(true)
      const result = await getContacts({ ...filters, search: searchTerm })
      setContacts(result.contacts)
    } catch (error) {
      console.error("Error loading contacts:", error)
      showNotification("Error al cargar contactos", "error")
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const statsData = await getContactStats()
      setStats(statsData)
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  const handleStatusChange = async (contactId: string, newStatus: string) => {
    if (!isAuthenticated || !session?.user) return

    try {
      await updateContactStatus(contactId, newStatus as ContactStatus, session.user.id)
      showNotification("Estado actualizado correctamente", "success")
      loadContacts()
      loadStats()
    } catch (error) {
      console.error("Error updating status:", error)
      showNotification("Error al actualizar estado", "error")
    }
  }

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, search: searchTerm }))
  }

  const handleFilterChange = (key: keyof ContactFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
    }))
  }

  const clearFilters = () => {
    setFilters({})
    setSearchTerm("")
    showNotification("Filtros limpiados", "info")
  }

  return (
    <AdminGuard>
      <Section className="py-8">
        <Container size="xlarge">
          {/* Notificación simple */}
          {notification && (
            <div
              className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg max-w-sm ${
                notification.type === "success"
                  ? "bg-green-500 text-white"
                  : notification.type === "error"
                    ? "bg-red-500 text-white"
                    : "bg-blue-500 text-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{notification.message}</span>
                <button onClick={() => setNotification(null)} className="ml-2 text-white hover:text-gray-200">
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Gestión de Contactos</h1>
              <p className="text-muted-foreground mt-2">
                Administra y da seguimiento a todos los contactos de clientes potenciales
              </p>
            </div>

            <div className="flex gap-2 mt-4 md:mt-0">
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              <Button variant="outline" onClick={loadContacts}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
            </div>
          </div>

          {/* Estadísticas */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Total Contactos</p>
                      <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Nuevos</p>
                      <p className="text-2xl font-bold">{stats.byStatus["Nuevo Contacto"] || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">En Proceso</p>
                      <p className="text-2xl font-bold">
                        {(stats.byStatus["En Revisión"] || 0) +
                          (stats.byStatus["Contactado"] || 0) +
                          (stats.byStatus["Cotización Enviada"] || 0) +
                          (stats.byStatus["Negociación"] || 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Cerrados</p>
                      <p className="text-2xl font-bold">
                        {(stats.byStatus["Cerrado - Ganado"] || 0) + (stats.byStatus["Cerrado - Perdido"] || 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Búsqueda y Filtros */}
          <Card className="mb-6">
            <CardContent className="p-4">
              {/* Búsqueda */}
              <div className="flex gap-2 mb-4">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar por nombre, email o teléfono..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
              </div>

              {/* Filtros */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
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

          {/* Lista de Contactos */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onViewDetails={setSelectedContact}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </AdminGuard>
  )
}

