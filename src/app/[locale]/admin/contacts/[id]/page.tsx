"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Container } from "@/components/ui/container"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminGuard } from "@/components/auth/RoleGuard"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { StatusBadge } from "@/components/admin/contacts/StatusBadge"
import { WhatsAppButton } from "@/components/admin/contacts/WhatsAppButton"
import { getContactById, updateContactStatus, type Contact, type ContactStatus } from "@/lib/contacts"
import { formatPhoneNumber } from "@/lib/whatsapp"
import { useAuth } from "@/hooks/useAuth"
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Building, Zap, MessageSquare } from "lucide-react"

export default function ContactDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { session } = useAuth()
  const contactId = params.id as string

  const [contact, setContact] = useState<Contact | null>(null)
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

  useEffect(() => {
    loadContact()
  }, [contactId])

  const loadContact = async () => {
    try {
      setLoading(true)
      const contactData = await getContactById(contactId)
      setContact(contactData)
    } catch (error) {
      console.error("Error loading contact:", error)
      showNotification("Error al cargar el contacto", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: ContactStatus) => {
    if (!contact || !session?.user) return

    try {
      await updateContactStatus(contact.id, newStatus, session.user.id)
      setContact({ ...contact, status: newStatus })
      showNotification("Estado actualizado correctamente", "success")
    } catch (error) {
      console.error("Error updating status:", error)
      showNotification("Error al actualizar estado", "error")
    }
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
        return type || "No especificado"
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
        return sector || "No especificado"
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

  if (!contact) {
    return (
      <AdminGuard>
        <Section className="py-8">
          <Container>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Contacto no encontrado</h2>
              <Button onClick={() => router.push("/admin/contacts")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Contactos
              </Button>
            </div>
          </Container>
        </Section>
      </AdminGuard>
    )
  }

  const formattedPhone = formatPhoneNumber(contact.phone || contact.phoneNumber || "", contact.phoneCountryCode)

  return (
    <AdminGuard>
      <Section className="py-8">
        <Container size="large">
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
          <div className="mb-8">
            <Button variant="outline" onClick={() => router.push("/admin/contacts")} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Contactos
            </Button>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-foreground">{contact.name}</h1>
                <p className="text-muted-foreground mt-2">Detalles del contacto</p>
              </div>
              <StatusBadge status={contact.status} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Información Principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Datos de Contacto */}
              <Card>
                <CardHeader>
                  <CardTitle>Información de Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Email</p>
                      <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                        {contact.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Teléfono</p>
                      <a href={`tel:${formattedPhone}`} className="hover:underline">
                        {formattedPhone}
                      </a>
                    </div>
                  </div>

                  {contact.city && (
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-3 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Ciudad</p>
                        <p>{contact.city}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Fecha de Contacto</p>
                      <p>
                        {new Intl.DateTimeFormat("es-ES", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(contact.createdAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detalles del Proyecto */}
              <Card>
                <CardHeader>
                  <CardTitle>Detalles del Proyecto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Zap className="h-5 w-5 mr-3 text-amber-500" />
                    <div>
                      <p className="font-medium">Tipo de Energía</p>
                      <p>{translateGenerationType(contact.generationType)}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Building className="h-5 w-5 mr-3 text-blue-500" />
                    <div>
                      <p className="font-medium">Sector</p>
                      <p>{translateSector(contact.sector)}</p>
                    </div>
                  </div>

                  {contact.message && (
                    <div className="flex items-start">
                      <MessageSquare className="h-5 w-5 mr-3 text-muted-foreground mt-1" />
                      <div>
                        <p className="font-medium">Mensaje</p>
                        <p className="text-muted-foreground">{contact.message}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Panel de Acciones */}
            <div className="space-y-6">
              {/* Acciones Rápidas */}
              <Card>
                <CardHeader>
                  <CardTitle>Acciones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <WhatsAppButton
                    phone={formattedPhone}
                    contactData={{
                      name: contact.name,
                      generationType: contact.generationType,
                      sector: contact.sector,
                      city: contact.city,
                    }}
                    className="w-full"
                  />

                  <Button variant="outline" className="w-full" asChild>
                    <a href={`mailto:${contact.email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar Email
                    </a>
                  </Button>

                  <Button variant="outline" className="w-full" asChild>
                    <a href={`tel:${formattedPhone}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Llamar
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Cambiar Estado */}
              <Card>
                <CardHeader>
                  <CardTitle>Estado del Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      variant={contact.status === "Nuevo Contacto" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStatusChange("Nuevo Contacto")}
                    >
                      Nuevo Contacto
                    </Button>
                    <Button
                      variant={contact.status === "En Revisión" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStatusChange("En Revisión")}
                    >
                      En Revisión
                    </Button>
                    <Button
                      variant={contact.status === "Contactado" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStatusChange("Contactado")}
                    >
                      Contactado
                    </Button>
                    <Button
                      variant={contact.status === "Cotización Enviada" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStatusChange("Cotización Enviada")}
                    >
                      Cotización Enviada
                    </Button>
                    <Button
                      variant={contact.status === "Negociación" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStatusChange("Negociación")}
                    >
                      Negociación
                    </Button>
                    <Button
                      variant={contact.status === "Cerrado - Ganado" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStatusChange("Cerrado - Ganado")}
                    >
                      Cerrado - Ganado
                    </Button>
                    <Button
                      variant={contact.status === "Cerrado - Perdido" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStatusChange("Cerrado - Perdido")}
                    >
                      Cerrado - Perdido
                    </Button>
                    <Button
                      variant={contact.status === "Seguimiento" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStatusChange("Seguimiento")}
                    >
                      Seguimiento
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </AdminGuard>
  )
}
