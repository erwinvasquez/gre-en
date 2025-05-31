import type React from "react"
import type { Metadata } from "next"
import { getDefaultMetadata } from "@/lib/seo/metadata"

// Generar metadatos para SEO
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getDefaultMetadata("/products", params.locale)
}

export default function SolutionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
