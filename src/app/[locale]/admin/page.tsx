"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminGuard } from "@/components/auth/RoleGuard"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { getContactStats, getContacts } from "@/lib/contacts"
import { useAuth } from "@/hooks/useAuth"
import {
  Users,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
  BarChart3,
  FileText,
  Calculator,
  Calendar,
  ExternalLink,
  Plus,
  Filter,
  Download,
} from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalContacts: number
  newContacts: number
  inProgress: number
  closed: number
  conversionRate: number
  recentContacts: any[]
}

export default function AdminDashboard() {
  const t = useTranslations("Admin")
  const { session } = useAuth()

  // Estados
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState<{
    message: string
    type: "success" | "error" | "info"
  } | null>(null)

  // Función simple para mostrar notificaciones
  const showNotification = (message: string, type: "success" | "error" | "info" = "info") => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  // Cargar estadísticas del dashboard
  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      setLoading(true)

      // Obtener estadísticas generales
      const contactStats = await getContactStats()

      // Obtener contactos recientes (últimos 5)
      const recentContactsResult = await getContacts({}, 5)

      // Calcular estadísticas del dashboard
      const totalContacts = contactStats.total || 0
      const newContacts = contactStats.byStatus["Nuevo Contacto"] || 0
      const inProgress =
        (contactStats.byStatus["En Revisión"] || 0) +
        (contactStats.byStatus["Contactado"] || 0) +
        (contactStats.byStatus["Cotización Enviada"] || 0) +
        (contactStats.byStatus["Negociación"] || 0)
      const closed =
        (contactStats.byStatus["Cerrado - Ganado"] || 0) + (contactStats.byStatus["Cerrado - Perdido"] || 0)
      const conversionRate =
        totalContacts > 0 ? ((contactStats.byStatus["Cerrado - Ganado"] || 0) / totalContacts) * 100 : 0

      setStats({
        totalContacts,
        newContacts,
        inProgress,
        closed,
        conversionRate,
        recentContacts: recentContactsResult.contacts || [],
      })
    } catch (error) {
      console.error("Error loading dashboard stats:", error)
      showNotification("Error al cargar estadísticas del dashboard", "error")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
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

          {/* Header del Dashboard */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard Administrativo</h1>
                <p className="text-muted-foreground mt-2">
                  Bienvenido, {session?.user?.name}. Gestiona tu plataforma desde aquí.
                </p>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                <Button variant="outline" onClick={loadDashboardStats}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Actualizar
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          </div>

          {/* Estadísticas Principales */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Contactos</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalContacts}</div>
                  <p className="text-xs text-muted-foreground">Todos los contactos registrados</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Contactos Nuevos</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.newContacts}</div>
                  <p className="text-xs text-muted-foreground">Requieren atención</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{stats.inProgress}</div>
                  <p className="text-xs text-muted-foreground">En seguimiento activo</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.conversionRate.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">Contactos cerrados exitosamente</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Acciones Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Gestión de Contactos */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                  Gestión de Contactos
                </CardTitle>
                <CardDescription>Administra y da seguimiento a todos los contactos de clientes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link href="/admin/contacts">
                    <Button className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Ver Todos los Contactos
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </Button>
                  </Link>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/admin/contacts?status=Nuevo Contacto">
                      <Button variant="outline" size="sm" className="text-xs w-full bg-transparent">
                        <Filter className="h-3 w-3 mr-1" />
                        Nuevos
                      </Button>
                    </Link>
                    <Link href="/admin/contacts?status=En Revisión">
                      <Button variant="outline" size="sm" className="text-xs w-full bg-transparent">
                        <Clock className="h-3 w-3 mr-1" />
                        En Proceso
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gestión de Cotizaciones - REEMPLAZA GESTIÓN DE USUARIOS */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2 text-green-600" />
                  Gestión de Cotizaciones
                </CardTitle>
                <CardDescription>Administra todas las cotizaciones realizadas por los clientes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link href="/admin/quotes">
                    <Button className="w-full justify-start">
                      <Calculator className="h-4 w-4 mr-2" />
                      Ver Todas las Cotizaciones
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </Button>
                  </Link>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/admin/quotes?status=Nueva Cotización">
                      <Button variant="outline" size="sm" className="text-xs w-full bg-transparent">
                        <Plus className="h-3 w-3 mr-1" />
                        Nuevas
                      </Button>
                    </Link>
                    <Link href="/admin/quotes?filter=recent">
                      <Button variant="outline" size="sm" className="text-xs w-full bg-transparent">
                        <Clock className="h-3 w-3 mr-1" />
                        Recientes
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reportes y Análisis */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                  Reportes y Análisis
                </CardTitle>
                <CardDescription>Estadísticas y métricas del negocio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start bg-transparent" variant="outline" disabled>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Ver Reportes
                    <span className="ml-auto text-xs text-muted-foreground">Próximamente</span>
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="text-xs bg-transparent" disabled>
                      <FileText className="h-3 w-3 mr-1" />
                      Exportar
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs bg-transparent" disabled>
                      <Calendar className="h-3 w-3 mr-1" />
                      Programar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actividad Reciente y Alertas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contactos Recientes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Contactos Recientes
                </CardTitle>
                <CardDescription>Últimos contactos que requieren atención</CardDescription>
              </CardHeader>
              <CardContent>
                {stats?.recentContacts && stats.recentContacts.length > 0 ? (
                  <div className="space-y-3">
                    {stats.recentContacts.slice(0, 5).map((contact: any, index: number) => (
                      <div
                        key={contact.id || index}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{contact.name || "Sin nombre"}</p>
                          <p className="text-xs text-muted-foreground">{contact.email || "Sin email"}</p>
                          <p className="text-xs text-muted-foreground">
                            {contact.generationType && `${contact.generationType} - `}
                            {contact.city || "Sin ubicación"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              contact.status === "Nuevo Contacto"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {contact.status || "Nuevo"}
                          </span>
                        </div>
                      </div>
                    ))}
                    <Link href="/admin/contacts">
                      <Button variant="outline" className="w-full mt-3 bg-transparent">
                        Ver Todos los Contactos
                        <ExternalLink className="h-3 w-3 ml-2" />
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No hay contactos recientes</p>
                    <Link href="/admin/contacts">
                      <Button variant="outline" className="mt-3 bg-transparent">
                        Ver Gestión de Contactos
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Alertas y Notificaciones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Alertas y Tareas
                </CardTitle>
                <CardDescription>Elementos que requieren tu atención</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.newContacts && stats.newContacts > 0 && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-blue-600 mr-2" />
                        <div>
                          <p className="font-medium text-sm">Contactos nuevos</p>
                          <p className="text-xs text-muted-foreground">
                            {stats.newContacts} contactos esperando revisión
                          </p>
                        </div>
                      </div>
                      <Link href="/admin/contacts?status=Nuevo Contacto">
                        <Button size="sm" variant="outline">
                          Revisar
                        </Button>
                      </Link>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      <div>
                        <p className="font-medium text-sm">Sistema funcionando</p>
                        <p className="text-xs text-muted-foreground">Todas las funciones operativas</p>
                      </div>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">OK</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center">
                      <Settings className="h-4 w-4 text-muted-foreground mr-2" />
                      <div>
                        <p className="font-medium text-sm">Configuración</p>
                        <p className="text-xs text-muted-foreground">Revisa la configuración del sistema</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" disabled>
                      Configurar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </AdminGuard>
  )
}







