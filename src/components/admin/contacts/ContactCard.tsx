"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "./StatusBadge"
import { WhatsAppButton } from "./WhatsAppButton"
import type { Contact, ContactStatus } from "@/lib/contacts"
import { formatPhoneNumber } from "@/lib/whatsapp"
import { Calendar, MapPin, Mail, Phone, MessageSquare, ChevronDown, Building, Zap, Eye } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

interface ContactCardProps {
  contact: Contact
  onViewDetails: (contact: Contact) => void
  onStatusChange: (contactId: string, newStatus: ContactStatus) => void
}

export function ContactCard({ contact, onViewDetails, onStatusChange }: ContactCardProps) {
  const [showStatusMenu, setShowStatusMenu] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showStatusMenu) {
        setShowStatusMenu(false)
      }
    }

    if (showStatusMenu) {
      document.addEventListener("click", handleClickOutside)
    }

    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [showStatusMenu])

  // Formatear fecha
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
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

  // Manejar cambio de estado
  const handleStatusChange = (newStatus: ContactStatus) => {
    onStatusChange(contact.id, newStatus)
    setShowStatusMenu(false)
  }

  // Formatear teléfono
  const formattedPhone = formatPhoneNumber(contact.phone || contact.phoneNumber || "", contact.phoneCountryCode)

  return (
    <Card className="group relative overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
      {/* Header con gradiente sutil */}
      <CardHeader className="relative bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-100 p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h3 className="font-semibold text-xl text-gray-900 group-hover:text-gray-700 transition-colors">
              {contact.name}
            </h3>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formatDate(contact.createdAt)}</span>
            </div>
          </div>
          <StatusBadge status={contact.status} />
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        {/* Información de contacto con mejor diseño */}
        <div className="space-y-3">
          <div className="flex items-center group/item">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 mr-3 group-hover/item:bg-gray-200 transition-colors">
              <Mail className="h-4 w-4 text-gray-600" />
            </div>
            <a
              href={`mailto:${contact.email}`}
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              {contact.email}
            </a>
          </div>

          <div className="flex items-center group/item">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 mr-3 group-hover/item:bg-gray-200 transition-colors">
              <Phone className="h-4 w-4 text-gray-600" />
            </div>
            <a
              href={`tel:${formattedPhone}`}
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              {formattedPhone}
            </a>
          </div>

          {contact.city && (
            <div className="flex items-center group/item">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 mr-3 group-hover/item:bg-gray-200 transition-colors">
                <MapPin className="h-4 w-4 text-gray-600" />
              </div>
              <span className="text-gray-700 font-medium">{contact.city}</span>
            </div>
          )}
        </div>

        {/* Detalles del proyecto con mejor diseño */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center p-3 bg-amber-50 rounded-lg border border-amber-100">
            <Zap className="h-5 w-5 mr-2 text-amber-600" />
            <span className="text-sm font-medium text-amber-800">
              {translateGenerationType(contact.generationType)}
            </span>
          </div>

          <div className="flex items-center p-3 bg-emerald-50 rounded-lg border border-emerald-100">
            <Building className="h-5 w-5 mr-2 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-800">{translateSector(contact.sector)}</span>
          </div>
        </div>

        {/* Mensaje con mejor presentación */}
        {contact.message && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="flex items-center mb-2">
              <MessageSquare className="h-4 w-4 mr-2 text-gray-500" />
              <span className="font-medium text-gray-700 text-sm">Mensaje:</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{contact.message}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0 space-y-4">
        {/* Dropdown de estado */}
        <div className="relative w-full">
          <Button
            variant="outline"
            className="w-full justify-between border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            onClick={() => setShowStatusMenu(!showStatusMenu)}
          >
            <span className="text-gray-700">Cambiar Estado</span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </Button>

          {showStatusMenu && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-xl rounded-lg border border-gray-200 z-50 max-h-64 overflow-y-auto">
              <div className="py-2">
                {[
                  "Nuevo Contacto",
                  "En Revisión",
                  "Contactado",
                  "Cotización Enviada",
                  "Negociación",
                  "Cerrado - Ganado",
                  "Cerrado - Perdido",
                  "Seguimiento",
                ].map((status) => (
                  <button
                    key={status}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    onClick={() => handleStatusChange(status as ContactStatus)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3">
          <WhatsAppButton
            phone={formattedPhone}
            contactData={{
              name: contact.name,
              generationType: contact.generationType,
              sector: contact.sector,
              city: contact.city,
            }}
            size="sm"
            className="flex-1"
          />

          <Link href={`/admin/contacts/${contact.id}`} className="flex-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700"
            >
              <Eye className="h-4 w-4 mr-2" />
              Ver Detalles
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}


