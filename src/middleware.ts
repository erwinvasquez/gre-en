import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

// Actualizar el tipo para incluir portugués
type SupportedLocale = "en" | "es" | "pt"

// URLs que requieren redirección (antiguas a nuevas)
const REDIRECTS: Record<string, { destination: string; permanent: boolean }> = {
  "/old-page": { destination: "/new-page", permanent: true },
  "/promo": { destination: "/products", permanent: false },
  // Añade más redirecciones según sea necesario
}

// Rutas protegidas que requieren autenticación
const PROTECTED_ROUTES = ["/admin", "/account"]

// En la función getPreferredLanguage, añadir soporte para portugués
function getPreferredLanguage(request: NextRequest): SupportedLocale {
  // Obtener el idioma de la cookie si existe
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value
  if (cookieLocale && (cookieLocale === "en" || cookieLocale === "es" || cookieLocale === "pt")) {
    return cookieLocale as SupportedLocale
  }

  // Obtener el idioma del encabezado Accept-Language
  const acceptLanguage = request.headers.get("accept-language")
  if (acceptLanguage) {
    // Parsear el encabezado para obtener el idioma preferido
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
      if (locale === "en") return "en"
      if (locale === "es") return "es"
      if (locale === "pt") return "pt"
    }
  }

  // Valor predeterminado si no se puede determinar
  return "es"
}

// Middleware personalizado que detecta el idioma y maneja redirecciones SEO
export default async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const { pathname } = url

  // 1. Manejar redirecciones configuradas
  if (pathname in REDIRECTS) {
    const { destination, permanent } = REDIRECTS[pathname]
    return NextResponse.redirect(new URL(destination, request.url), {
      status: permanent ? 301 : 302,
    })
  }

  // 2. Normalizar URLs (quitar barras finales excepto en la raíz)
  if (pathname !== "/" && pathname.endsWith("/")) {
    url.pathname = pathname.slice(0, -1)
    return NextResponse.redirect(url, { status: 301 })
  }

  // 3. Verificar autenticación para rutas protegidas
  // Verificamos si la ruta actual es una ruta protegida
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => {
    // Extraemos la parte de la ruta después del locale
    const pathParts = pathname.split("/")
    if (pathParts.length >= 3 && ["en", "es", "pt"].includes(pathParts[1])) {
      // La ruta sería algo como /en/admin o /es/account
      return route === `/${pathParts[2]}`
    }
    return false
  })

  if (isProtectedRoute) {
    // Verificar si hay un token de autenticación
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || "your-secret-key-here",
    })

    if (!token) {
      // Redirigir a la página principal si no hay token
      const locale = pathname.split("/")[1]
      return NextResponse.redirect(new URL(`/${locale}`, request.url))
    }
  }

  // 4. Detectar idioma preferido
  const preferredLanguage = getPreferredLanguage(request)

  // 5. Crear el middleware de next-intl con la configuración de enrutamiento
  const intlMiddleware = createMiddleware({
    ...routing,
    defaultLocale: preferredLanguage,
  })

  // 6. Aplicar el middleware de internacionalización
  return intlMiddleware(request)
}

export const config = {
  // Excluir archivos estáticos y API routes
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)"],
}
 







