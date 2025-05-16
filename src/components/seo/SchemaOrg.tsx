"use client"

import { useEffect, useState } from "react"

interface SchemaOrgProps {
  schema: Record<string, any> | Record<string, any>[]
}

/**
 * Componente para renderizar Schema.org como JSON-LD
 * Este componente toma un objeto de esquema (o un array de objetos)
 * y lo renderiza como una etiqueta script de tipo application/ld+json
 */
export function SchemaOrg({ schema }: SchemaOrgProps) {
  // Evitar problemas de hidratación usando useEffect
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Convertir a array si no lo es
  const schemas = Array.isArray(schema) ? schema : [schema]

  return (
    <>
      {schemas.map((schemaItem, index) => (
        <script
          key={`schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaItem) }}
        />
      ))}
    </>
  )
}




