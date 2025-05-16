import { defineRouting } from "next-intl/routing"
import { createSharedPathnamesNavigation } from "next-intl/navigation"

export const routing = defineRouting({
  // Actualizar la lista de locales soportados para incluir portugués
  locales: ["en", "es", "pt"],

  // Used when no locale matches
  defaultLocale: "en",
})

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation(routing)
