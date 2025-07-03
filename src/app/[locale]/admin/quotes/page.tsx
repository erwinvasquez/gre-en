"use client"

import { useState, useEffect } from "react"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminGuard } from "@/components/auth/RoleGuard"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  getQuotes,
  getQuoteStats,
  deleteQuote,
  formatQuoteDate,
  getSectorDisplayName,
  getPhaseDisplayName,
  type QuoteData,
  type QuoteFilters,
  type QuoteStats,
} from "@/lib/quotes"
import {
  Calculator,
  Search,
  Filter,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  Building,
  Phone,
  User,
  Zap,
  RefreshCw,
  Download,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

export default function QuotesManagementPage() {
  // Estados
  const [quotes, setQuotes] = useState<QuoteData[]>([])
  const [stats, setStats] = useState<QuoteStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<QuoteFilters>({ status: "all" })
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([])
  const [notification, setNotification] = useState<{
    message: string
    type: "success" | "error" | "info"
  } | null>(null)

  // Función para mostrar notificaciones
  const showNotification = (message: string, type: "success" | "error" | "info" = "info") => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  // Cargar datos
  useEffect(() => {
    loadQuotes()
    loadStats()
  }, [filters])

  const loadQuotes = async () => {
    try {
      setLoading(true)
      // Ajustar filtros: si status es 'all', eliminarlo para traer todas las cotizaciones
      const filtersToSend = { ...filters }
      if (filtersToSend.status === "all") {
        delete filtersToSend.status
      }
      const result = await getQuotes(filtersToSend)
      setQuotes(result.quotes)
    } catch (error) {
      console.error("Error loading quotes:", error)
      showNotification("Error al cargar cotizaciones", "error")
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const quoteStats = await getQuoteStats()
      setStats(quoteStats)
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  // Filtrar cotizaciones por término de búsqueda
  const filteredQuotes = quotes.filter((quote) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      quote.clientInfo.name.toLowerCase().includes(searchLower) ||
      quote.clientInfo.phone.includes(searchTerm) ||
      quote.formData.department.toLowerCase().includes(searchLower) ||
      getSectorDisplayName(quote.formData.sector).toLowerCase().includes(searchLower)
    )
  })

  // Manejar eliminación de cotización
  const handleDeleteQuote = async (quoteId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta cotización?")) {
      return
    }

    try {
      await deleteQuote(quoteId)
      await loadQuotes()
      await loadStats()
      showNotification("Cotización eliminada exitosamente", "success")
    } catch (error) {
      console.error("Error deleting quote:", error)
      showNotification("Error al eliminar cotización", "error")
    }
  }

  // Manejar eliminación múltiple
  const handleDeleteSelected = async () => {
    if (selectedQuotes.length === 0) return

    if (!confirm(`¿Estás seguro de que quieres eliminar ${selectedQuotes.length} cotizaciones?`)) {
      return
    }

    try {
      await Promise.all(selectedQuotes.map((id) => deleteQuote(id)))
      setSelectedQuotes([])
      await loadQuotes()
      await loadStats()
      showNotification(`${selectedQuotes.length} cotizaciones eliminadas exitosamente`, "success")
    } catch (error) {
      console.error("Error deleting quotes:", error)
      showNotification("Error al eliminar cotizaciones", "error")
    }
  }

  // Manejar selección de cotizaciones
  const handleSelectQuote = (quoteId: string) => {
    setSelectedQuotes((prev) => (prev.includes(quoteId) ? prev.filter((id) => id !== quoteId) : [...prev, quoteId]))
  }

  const handleSelectAll = () => {
    if (selectedQuotes.length === filteredQuotes.length) {
      setSelectedQuotes([])
    } else {
      setSelectedQuotes(filteredQuotes.map((quote) => quote.id))
    }
  }

  if (loading && quotes.length === 0) {
    return (
      <AdminGuard>
        <Section className="py-8">
          <Container>
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          </Container>
        </Section>
      </AdminGuard>
    )
  }

  return (
    <AdminGuard>
      <Section className="py-8">
        <Container size="xlarge">
          {/* Notificación */}
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
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center">
                  <Calculator className="h-8 w-8 mr-3 text-primary" />
                  Gestión de Cotizaciones
                </h1>
                <p className="text-muted-foreground mt-2">
                  Administra todas las cotizaciones realizadas por los clientes
                </p>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                <Button variant="outline" onClick={loadQuotes} disabled={loading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  Actualizar
                </Button>
                <Button variant="outline" disabled>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Cotizaciones</CardTitle>
                  <Calculator className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">Todas las cotizaciones</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cotizaciones Nuevas</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.byStatus["Nueva Cotización"] || 0}</div>
                  <p className="text-xs text-muted-foreground">Pendientes de revisión</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recientes</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.recent}</div>
                  <p className="text-xs text-muted-foreground">Últimos 7 días</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Departamento Principal</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {Object.entries(stats.byDepartment).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {Object.entries(stats.byDepartment).sort(([, a], [, b]) => b - a)[0]?.[1] || 0} cotizaciones
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filtros y Búsqueda */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filtros y Búsqueda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Búsqueda */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Buscar</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Nombre, teléfono, departamento..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Filtro por Estado */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Estado</label>
                  <Select
                    value={filters.status || "all"}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value || undefined }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="Nueva Cotización">Nueva Cotización</SelectItem>
                      <SelectItem value="En Revisión">En Revisión</SelectItem>
                      <SelectItem value="Contactado">Contactado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtro por Departamento */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Departamento</label>
                  <Select
                    value={filters.department || "all"}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, department: value || undefined }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los departamentos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los departamentos</SelectItem>
                      {stats &&
                        Object.keys(stats.byDepartment).map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept} ({stats.byDepartment[dept]})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtro por Sector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sector</label>
                  <Select
                    value={filters.sector || "all"}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, sector: value || undefined }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los sectores" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los sectores</SelectItem>
                      {stats &&
                        Object.keys(stats.bySector).map((sector) => (
                          <SelectItem key={sector} value={sector}>
                            {getSectorDisplayName(sector)} ({stats.bySector[sector]})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Acciones de selección múltiple */}
              {selectedQuotes.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800">
                      {selectedQuotes.length} cotizaciones seleccionadas
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedQuotes([])}>
                        Deseleccionar
                      </Button>
                      <Button variant="destructive" size="sm" onClick={handleDeleteSelected}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Eliminar Seleccionadas
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lista de Cotizaciones */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Cotizaciones ({filteredQuotes.length})
                </CardTitle>
                {filteredQuotes.length > 0 && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedQuotes.length === filteredQuotes.length}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                    <span className="text-sm text-muted-foreground">Seleccionar todas</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : filteredQuotes.length === 0 ? (
                <div className="text-center py-12">
                  <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">No hay cotizaciones</h3>
                  <p className="text-sm text-muted-foreground">
                    {searchTerm || Object.keys(filters).length > 0
                      ? "No se encontraron cotizaciones con los filtros aplicados"
                      : "Aún no se han realizado cotizaciones"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredQuotes.map((quote) => (
                    <div
                      key={quote.id}
                      className={`border rounded-lg p-4 hover:bg-muted/30 transition-colors ${
                        selectedQuotes.includes(quote.id) ? "bg-blue-50 border-blue-200" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={selectedQuotes.includes(quote.id)}
                            onChange={() => handleSelectQuote(quote.id)}
                            className="mt-1 rounded"
                          />
                          <div className="flex-1">
                            {/* Información del Cliente */}
                            <div className="flex items-center gap-4 mb-3">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-blue-600" />
                                <span className="font-medium">{quote.clientInfo.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-green-600" />
                                <span className="text-sm text-muted-foreground">{quote.clientInfo.phone}</span>
                              </div>
                            </div>

                            {/* Información de la Cotización */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-yellow-600" />
                                <span>
                                  <strong>Consumo:</strong> {quote.formData.monthlyConsumption} kWh/mes
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-red-600" />
                                <span>
                                  <strong>Departamento:</strong> {quote.formData.department}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Building className="h-4 w-4 text-purple-600" />
                                <span>
                                  <strong>Sector:</strong> {getSectorDisplayName(quote.formData.sector)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-orange-600" />
                                <span>
                                  <strong>Fase:</strong> {getPhaseDisplayName(quote.formData.phase)}
                                </span>
                              </div>
                            </div>

                            {/* Metadatos */}
                            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatQuoteDate(quote.createdAt)}
                              </div>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                {quote.status}
                              </span>
                              <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                                {quote.source}
                              </span>
                              {quote.formData.includeBattery && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                                  Con Batería
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Acciones */}
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/quotes/${quote.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteQuote(quote.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </Container>
      </Section>
    </AdminGuard>
  )
}


