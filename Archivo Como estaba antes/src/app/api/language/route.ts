import { type NextRequest, NextResponse } from "next/server"

// Definimos el tipo para los idiomas soportados
type SupportedLocale = "en" | "es"

// Esta API permite obtener o establecer el idioma preferido
export async function GET(request: NextRequest) {
  // Obtener el idioma de la cookie
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value

  if (cookieLocale && (cookieLocale === "en" || cookieLocale === "es")) {
    return NextResponse.json({ locale: cookieLocale })
  }

  // Si no hay cookie, intentar obtener del encabezado Accept-Language
  const acceptLanguage = request.headers.get("accept-language")
  if (acceptLanguage) {
    const preferredLocales = acceptLanguage
      .split(",")
      .map((lang) => {
        const [locale, priority = "q=1.0"] = lang.trim().split(";")
        const q = Number.parseFloat(priority.split("=")[1])
        return { locale: locale.split("-")[0], q }
      })
      .sort((a, b) => b.q - a.q)

    // Buscar el primer idioma que coincida con nuestros idiomas soportados
    for (const { locale } of preferredLocales) {
      if (locale === "en" || locale === "es") {
        return NextResponse.json({ locale })
      }
    }
  }

  return NextResponse.json({ locale: "es" })
}

// Esta API permite establecer el idioma preferido (para uso futuro)
export async function POST(request: NextRequest) {
  const body = await request.json()
  const locale = body.locale as string

  if (!locale || (locale !== "en" && locale !== "es")) {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 })
  }

  // Crear una respuesta con la cookie establecida
  const response = NextResponse.json({ success: true })
  response.cookies.set("NEXT_LOCALE", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 año
    sameSite: "strict",
  })

  return response
}

