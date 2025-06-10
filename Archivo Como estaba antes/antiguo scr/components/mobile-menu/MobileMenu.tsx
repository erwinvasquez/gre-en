"use client"

import { useState, useEffect, useCallback } from "react"
import { Menu, X } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useAppSelector } from "@/redux/hooks"
import type { PageWithSubmenu } from "../submenu/Submenu"

interface MobileMenuProps {
  sections: Array<{ id: string; label: string }>
  pages: Array<{ path: string; text: string }>
  pagesWithSubmenu?: PageWithSubmenu[]
}

export function MobileMenu({ sections, pages, pagesWithSubmenu = [] }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [targetId, setTargetId] = useState<string | null>(null)
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const locale = useAppSelector((state) => state.language.locale)

  const [isSubpageExpanded, setIsSubpageExpanded] = useState<{ [key: string]: boolean }>({})

  // Cerrar el menú cuando cambia la ruta
  useEffect(() => {
    setIsOpen(false)
    setExpandedSubmenu(null)
  }, [pathname])

  // Prevenir scroll cuando el menú está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  // Función para hacer scroll suave hacia una sección
  const handleScroll = useCallback((id: string) => {
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  // Función para manejar la navegación hacia una sección
  const handleNavigation = (id: string) => {
    setIsOpen(false) // Cerrar el menú

    if (pathname === `/${locale}`) {
      // Si ya estamos en la página principal, solo hacemos scroll
      handleScroll(id)
    } else {
      // Si estamos en otra página, guardamos el ID y navegamos a la página principal
      setTargetId(id)
      router.push(`/${locale}`)
    }
  }

  // Aplicar el scroll después de cambiar a la página principal
  useEffect(() => {
    if (targetId && pathname === `/${locale}`) {
      const timeout = setTimeout(() => {
        handleScroll(targetId)
        setTargetId(null)
      }, 100)
      return () => clearTimeout(timeout)
    }
  }, [pathname, targetId, handleScroll, locale])

  // Verificar si una página tiene submenu
  const hasSubmenu = (path: string): boolean => {
    return pagesWithSubmenu.some((page) => page.path === path)
  }

  // Obtener el submenu de una página
  const getSubmenu = (path: string) => {
    return pagesWithSubmenu.find((page) => page.path === path)
  }

  // Alternar la expansión del submenu
  const toggleSubmenu = (path: string) => {
    setExpandedSubmenu(expandedSubmenu === path ? null : path)
  }

  const toggleSubpage = (pagePath: string, subpagePath: string) => {
    setIsSubpageExpanded((prevState) => ({
      ...prevState,
      [subpagePath]: !prevState[subpagePath],
    }))
  }

  return (
    <>
      {/* Botón de hamburguesa */}
      <button
        className="lg:hidden flex items-center justify-center p-2"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menú"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Overlay y drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay oscuro */}
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />

          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-white dark:bg-gray-900 shadow-xl flex flex-col">
            {/* Cabecera del drawer */}
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-bold">Menú</span>
              <button onClick={() => setIsOpen(false)} className="p-2" aria-label="Cerrar menú">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Contenido del drawer */}
            <div className="flex-1 overflow-y-auto p-4">
              <nav className="flex flex-col space-y-4">
                {/* Secciones */}
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="py-2 hover:text-navbar-hover transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      handleNavigation(section.id)
                    }}
                  >
                    {section.label}
                  </a>
                ))}

                {/* Páginas sin submenu */}
                {pages
                  .filter((page) => !hasSubmenu(page.path))
                  .map((page) => (
                    <Link
                      key={page.path}
                      href={`/${locale}${page.path}`}
                      className="py-2 hover:text-navbar-hover transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {page.text}
                    </Link>
                  ))}

                {/* Páginas con submenu */}
                {pagesWithSubmenu.map((page) => (
                  <div key={page.path} className="border-b pb-2 mb-2 last:border-b-0 last:pb-0 last:mb-0">
                    <button
                      className="py-2 w-full text-left flex items-center justify-between hover:text-navbar-hover transition-colors"
                      onClick={() => toggleSubmenu(page.path)}
                    >
                      <span>{page.text}</span>
                      <span className="text-xs ml-2">{expandedSubmenu === page.path ? "−" : "+"}</span>
                    </button>

                    {/* Submenu expandible */}
                    {expandedSubmenu === page.path && (
                      <div className="pl-4 mt-2 space-y-2 border-l-2 border-gray-200 dark:border-gray-700">
                        {page.subpages.map((subpage) => (
                          <div key={subpage.path} className="py-1">
                            <div className="flex items-center justify-between">
                              <Link
                                href={`/${locale}${page.path}${subpage.path}`}
                                className="flex items-center hover:text-navbar-hover transition-colors"
                                onClick={() => setIsOpen(false)}
                              >
                                {subpage.icon && (
                                  <span className="mr-2 text-gray-500 dark:text-gray-400">{subpage.icon}</span>
                                )}
                                <span>{subpage.title}</span>
                              </Link>

                              {subpage.sections && subpage.sections.length > 0 && (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    toggleSubpage(page.path, subpage.path)
                                  }}
                                  className="p-1 ml-2"
                                >
                                  <span className="text-xs">{isSubpageExpanded[subpage.path] ? "−" : "+"}</span>
                                </button>
                              )}
                            </div>

                            {subpage.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-1">
                                {subpage.description}
                              </p>
                            )}

                            {/* Tercer nivel: Secciones */}
                            {isSubpageExpanded[subpage.path] && subpage.sections && subpage.sections.length > 0 && (
                              <div className="pl-4 mt-2 space-y-1 border-l border-gray-200 dark:border-gray-700">
                                {subpage.sections.map((section) => (
                                  <Link
                                    key={section.id}
                                    href={`/${locale}${page.path}${subpage.path}#${section.id}`}
                                    className="block text-sm py-1 hover:text-navbar-hover transition-colors"
                                    onClick={() => setIsOpen(false)}
                                  >
                                    {section.title}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  )
}






