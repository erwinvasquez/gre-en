"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { generateWhatsAppLink, generateContactMessage } from "@/lib/whatsapp"
import { MessageSquare } from "lucide-react"

interface WhatsAppButtonProps {
  phone: string
  contactData: {
    name: string
    generationType?: string
    sector?: string
    city?: string
  }
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  showText?: boolean
  className?: string
}

export function WhatsAppButton({
  phone,
  contactData,
  variant = "default",
  size = "default",
  showText = true,
  className = "",
}: WhatsAppButtonProps) {
  // Generar mensaje personalizado
  const message = generateContactMessage(contactData)

  // Generar enlace de WhatsApp
  const whatsappLink = generateWhatsAppLink(phone, message)

  // Manejar clic en el botón
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Evitar que el clic se propague (importante si está dentro de un card clickeable)
    window.open(whatsappLink, "_blank")
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={`bg-green-600 hover:bg-green-700 ${className}`}
      onClick={handleClick}
    >
      <MessageSquare className="h-4 w-4 mr-2" />
      {showText && "WhatsApp"}
    </Button>
  )
}

