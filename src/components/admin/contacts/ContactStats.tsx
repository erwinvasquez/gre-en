import type React from "react"

interface ContactStatsProps {
  stats: {
    total: number
    byStatus: Record<string, number>
    byGenerationType: Record<string, number>
    bySector: Record<string, number>
  } | null // Hacerlo nullable para evitar errores
}

export const ContactStats: React.FC<ContactStatsProps> = ({ stats }) => {
  if (!stats) return null // Manejar caso cuando stats es null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-card rounded-lg shadow p-6 border">
        <h3 className="text-lg font-medium mb-2">Total Contactos</h3>
        <p className="text-3xl font-bold">{stats.total}</p>
      </div>

      <div className="bg-card rounded-lg shadow p-6 border">
        <h3 className="text-lg font-medium mb-2">Por Estado</h3>
        <div className="space-y-2">
          {Object.entries(stats.byStatus)
            .slice(0, 3)
            .map(([status, count]) => (
              <div key={status} className="flex justify-between">
                <span>{status}</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
        </div>
      </div>

      <div className="bg-card rounded-lg shadow p-6 border">
        <h3 className="text-lg font-medium mb-2">Por Tipo</h3>
        <div className="space-y-2">
          {Object.entries(stats.byGenerationType)
            .slice(0, 3)
            .map(([type, count]) => (
              <div key={type} className="flex justify-between">
                <span>
                  {type === "photovoltaic" ? "Solar" : type === "wind" ? "Eólica" : type === "bipv" ? "BIPV" : type}
                </span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
        </div>
      </div>

      <div className="bg-card rounded-lg shadow p-6 border">
        <h3 className="text-lg font-medium mb-2">Por Sector</h3>
        <div className="space-y-2">
          {Object.entries(stats.bySector)
            .slice(0, 3)
            .map(([sector, count]) => (
              <div key={sector} className="flex justify-between">
                <span>
                  {sector === "residential"
                    ? "Residencial"
                    : sector === "commercial"
                      ? "Comercial"
                      : sector === "industrial"
                        ? "Industrial"
                        : sector === "agriculture"
                          ? "Agrícola"
                          : sector === "public"
                            ? "Público"
                            : sector}
                </span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

