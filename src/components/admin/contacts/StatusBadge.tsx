import type { ContactStatus } from "@/lib/contacts"

interface StatusBadgeProps {
  status: ContactStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyle = (status: ContactStatus) => {
    switch (status) {
      case "Nuevo Contacto":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "En Revisión":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "Contactado":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Cotización Enviada":
        return "bg-purple-100 text-purple-800 border-purple-200"
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

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(status)}`}
    >
      {status}
    </span>
  )
}


