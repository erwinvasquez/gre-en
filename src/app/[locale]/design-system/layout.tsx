import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sistema de Diseño | Base V3",
  description: "Documentación del sistema de diseño centralizado",
}

export default function DesignSystemLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-background">{children}</div>
}
