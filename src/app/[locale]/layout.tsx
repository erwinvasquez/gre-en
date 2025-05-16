import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import { Footer, Navbar } from "@/components"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import "../globals.css"
import { Providers } from "@/redux/Providers"
import { SchemaOrg } from "@/components/seo/SchemaOrg"
import { generateWebsiteSchema } from "@/lib/seo/schema"
import { getDefaultMetadata } from "@/lib/seo/metadata"
import { AuthProvider } from "@/providers/AuthProvider"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"

// Metadatos por defecto para el sitio
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getDefaultMetadata("/", params.locale)
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // Obtener la sesión del servidor
  const session = await getServerSession(authOptions)

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages()

  // Generar Schema.org para el sitio web
  const websiteSchema = await generateWebsiteSchema(locale)

  return (
    <Providers>
      <AuthProvider session={session}>
        <NextIntlClientProvider messages={messages}>
          {/* Schema.org global para el sitio web y la organización */}
          <SchemaOrg schema={websiteSchema} />

          <Navbar />
          {children}
          <Footer />
          {/* Añadir el componente de depuración */}
          {/* <SessionDebug /> */}
        </NextIntlClientProvider>
      </AuthProvider>
    </Providers>
  )
}











