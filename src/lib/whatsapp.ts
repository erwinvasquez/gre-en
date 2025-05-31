/**
 * Utilidades para generar enlaces de WhatsApp
 */

export interface WhatsAppMessageOptions {
    phone: string
    message?: string
    countryCode?: string
  }
  
  /**
   * Genera un enlace de WhatsApp para contactar a un cliente
   */
  export function generateWhatsAppLink(phoneNumber: string, message?: string): string {
    // Limpiar el número de teléfono (eliminar espacios, guiones, paréntesis)
    const cleanPhone = phoneNumber.replace(/[\s\-$$$$]/g, "")
  
    // Construir la URL base
    const baseUrl = "https://wa.me/"
  
    // Añadir el mensaje si existe
    const queryParams = message ? `?text=${encodeURIComponent(message)}` : ""
  
    return `${baseUrl}${cleanPhone}${queryParams}`
  }
  
  /**
   * Genera mensaje personalizado según el tipo de generación
   */
  export function generateCustomMessage(contactData: {
    name: string
    generationType: string
    sector: string
    city: string
  }): string {
    const { name, generationType, sector, city } = contactData
  
    const generationTypeText =
      {
        photovoltaic: "paneles solares fotovoltaicos",
        wind: "energía eólica",
        bipv: "paneles solares integrados (BIPV)",
      }[generationType] || "energía renovable"
  
    const sectorText =
      {
        residential: "residencial",
        commercial: "comercial",
        industrial: "industrial",
        agriculture: "agrícola",
        public: "público",
      }[sector] || sector
  
    return `Hola ${name}, me comunico desde nuestra empresa para darle seguimiento a su consulta sobre ${generationTypeText} para el sector ${sectorText} en ${city}. ¿Cuándo sería un buen momento para conversar sobre su proyecto?`
  }
  
  /**
   * Genera un mensaje personalizado basado en los datos del contacto
   * @param contactData Datos del contacto
   * @returns Mensaje personalizado
   */
  export function generateContactMessage(contactData: {
    name: string
    generationType?: string
    sector?: string
    city?: string
  }): string {
    const { name, generationType, sector, city } = contactData
  
    let message = `Hola ${name}, soy de Energía Solar. `
  
    // Personalizar según tipo de generación
    if (generationType) {
      switch (generationType) {
        case "photovoltaic":
          message += "Recibimos tu consulta sobre paneles solares fotovoltaicos. "
          break
        case "wind":
          message += "Recibimos tu consulta sobre energía eólica. "
          break
        case "bipv":
          message += "Recibimos tu consulta sobre integración fotovoltaica en edificios (BIPV). "
          break
        default:
          message += "Recibimos tu consulta sobre soluciones de energía renovable. "
      }
    } else {
      message += "Recibimos tu consulta sobre nuestros productos. "
    }
  
    // Personalizar según sector
    if (sector) {
      switch (sector) {
        case "residential":
          message += "Tenemos soluciones específicas para hogares. "
          break
        case "commercial":
          message += "Tenemos soluciones específicas para negocios comerciales. "
          break
        case "industrial":
          message += "Tenemos soluciones específicas para el sector industrial. "
          break
        case "agriculture":
          message += "Tenemos soluciones específicas para el sector agrícola. "
          break
        case "public":
          message += "Tenemos soluciones específicas para el sector público. "
          break
      }
    }
  
    // Añadir ubicación si está disponible
    if (city) {
      message += `¿Podemos agendar una llamada para discutir las mejores opciones para tu proyecto en ${city}?`
    } else {
      message += "¿Podemos agendar una llamada para discutir las mejores opciones para tu proyecto?"
    }
  
    return message
  }
  
  /**
   * Abre WhatsApp en una nueva ventana/pestaña
   */
  export function openWhatsApp(options: WhatsAppMessageOptions): void {
    const link = generateWhatsAppLink(options.phone, options.message)
    window.open(link, "_blank", "noopener,noreferrer")
  }
  
  /**
   * Formatea un número de teléfono para mostrar
   * @param phoneNumber Número completo o parcial
   * @param countryCode Código de país opcional
   * @returns Número formateado
   */
  export function formatPhoneNumber(phoneNumber: string, countryCode?: string): string {
    // Si ya tiene el código de país incluido
    if (phoneNumber.startsWith("+")) {
      return phoneNumber
    }
  
    // Si tenemos código de país separado
    if (countryCode) {
      return `+${countryCode} ${phoneNumber}`
    }
  
    // Si no hay código de país, devolver el número tal cual
    return phoneNumber
  }
  
  