"use client"

import type React from "react"
import { useState, useCallback, useMemo } from "react"
import { HomeIcon } from "@primer/octicons-react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { NavbarSection, ActiveLink, ThemeToggle } from "@/components"
import { SwitchLanguage } from "../switchlanguage/SwitchLanguage"
import { ShoppingCartIcon, UserIcon } from "@heroicons/react/16/solid"
import { MobileMenu } from "../mobile-menu/MobileMenu"
import { Submenu, type PageWithSubmenu } from "../submenu/Submenu"
import { Layers, Sun, Wind } from "lucide-react"
import { AuthDrawer } from "../auth/AuthDrawer"
import { useAuth, useLocalization, useScrollPosition } from "@/hooks"
import { NavbarIcon } from "@/components/ui/navbar-icon"
import { cn } from "@/lib/utils"
import { Container } from "@/components/ui/container"

export const Navbar = () => {
  const S = useTranslations("Sections")
  const P = useTranslations("Pages")
  const A = useTranslations("Admin")
  const t = useTranslations()
  const [hoveredPath, setHoveredPath] = useState<string | null>(null)
  const [isAuthDrawerOpen, setIsAuthDrawerOpen] = useState(false)
  const { session, status } = useAuth()
  const { locale, getLocalizedPath } = useLocalization()

  // Usar el hook de scroll para detectar cuando el usuario está haciendo scroll
  const { isScrolling, scrollY } = useScrollPosition(5, 300)

  // Determinar la clase de la navbar basada en el estado del scroll
  const navbarClass = cn("navbar", isScrolling ? "navbar-scrolling" : "navbar-static")

  // Usar useCallback para memoizar funciones
  const handleUserIconClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsAuthDrawerOpen(true)
  }, [])

  // Usar useCallback para memoizar la función de cierre del drawer
  const handleCloseAuthDrawer = useCallback(() => {
    setIsAuthDrawerOpen(false)
  }, [])

  // Función para manejar el clic en enlaces con submenu
  const handleSubmenuToggle = useCallback((e: React.MouseEvent, path: string) => {
    e.preventDefault()
    setHoveredPath((current) => (current === path ? null : path))
  }, [])

  // Memoizar la construcción de páginas simples para evitar recálculos en cada renderizado
  const simplePages = useMemo(() => {
    const pages: Array<{ path: string; text: string }> = []

    if (status === "authenticated" && session) {
      pages.push({
        path: "/admin",
        text: A("adminPanel"),
      })
    }

    return pages
  }, [status, session, A])

  // Páginas con submenu (memoizado para evitar recreaciones en cada renderizado)
  const pagesWithSubmenu: PageWithSubmenu[] = useMemo(
    () => [
      {
        path: "/products",
        text: t("Navbar.products"),
        subpages: [
          {
            path: "/bipv",
            title: t("SolutionsSection.bipv.title"),
            description: t("SolutionsSection.bipv.subtitle"),
            icon: <Layers className="h-5 w-5" />,
            sections: [
              {
                id: "vidrios-fotovoltaicos",
                title: t("BIPVPage.photovoltaicGlass.title"),
              },
              {
                id: "teja-solar",
                title: t("BIPVPage.solarTile.title"),
              },
              {
                id: "panel-techo-solar",
                title: t("BIPVPage.solarRoofPanel.title"),
              },
              {
                id: "portatil",
                title: t("BIPVPage.portableSolarPanel.title"),
              },
            ],
          },
          {
            path: "/photovoltaic",
            title: t("SolutionsSection.photovoltaic.title"),
            description: t("SolutionsSection.photovoltaic.subtitle"),
            icon: <Sun className="h-5 w-5" />,
          },
          {
            path: "/wind",
            title: t("SolutionsSection.wind.title"),
            description: t("SolutionsSection.wind.subtitle"),
            icon: <Wind className="h-5 w-5" />,
          },
        ],
      },
    ],
    [t],
  )

  // Definimos las secciones que queremos mostrar en el NavbarSection
  const sections = useMemo(
    () => [
      { id: "home", label: S("home") },
      { id: "future-energy", label: S("future-energy") },
      { id: "sectors", label: S("sectors") },
      { id: "solutions", label: S("solutions") },
      // { id: "about-us", label: S("about-us") },
       { id: "contact", label: S("contact") },
    ],
    [S],
  )

  return (
    <div className="navbar-container" onMouseLeave={() => setHoveredPath(null)}>
      <nav className={navbarClass}>
        <Container size="xlarge">
          <div className="flex items-center justify-between">
            {/* Columna izquierda: HomeIcon y botón de menú móvil */}
            <div
              className="w-1/4 flex items-center justify-start"
              style={{ gap: "var(--navbar-link-spacing)" }}
              onMouseEnter={() => setHoveredPath(null)}
            >
              <MobileMenu sections={sections} pages={simplePages} pagesWithSubmenu={pagesWithSubmenu} />
              <Link href={`/${locale}`} className="flex items-center gap-4 sm:gap-4 h-12">
  {/* Wrapper con límite visual */}
  <div className="h-12 w-auto">
    <img
      src="/images/Logovf.png"
      alt="Logo Icon"
      className="h-full scale-[3.5] origin-left lg:scale-100 lg:h-10 object-contain"
    />
  </div>
</Link>
            </div>

            {/* Columna central: Menú de navegación (visible solo en desktop) */}
            <div className="hidden lg:flex w-2/4 justify-center" style={{ gap: "var(--navbar-link-spacing)" }}>
              {/* Secciones - al pasar el cursor sobre ellas, ocultar cualquier submenu */}
              <div onMouseEnter={() => setHoveredPath(null)}>
                <NavbarSection sections={sections} />
              </div>

              {/* Páginas simples - al pasar el cursor sobre ellas, ocultar cualquier submenu */}
              {simplePages.map((page) => (
                <div key={page.path} onMouseEnter={() => setHoveredPath(null)}>
                  <ActiveLink path={page.path} text={page.text} />
                </div>
              ))}

              {/* Páginas con submenu */}
              {pagesWithSubmenu.map((page) => (
                <div key={page.path} onMouseEnter={() => setHoveredPath(page.path)}>
                  <ActiveLink
                    path={page.path}
                    text={page.text}
                    hasSubmenu={true}
                    onClick={(e) => handleSubmenuToggle(e, page.path)}
                  />
                </div>
              ))}
            </div>

            {/* Columna derecha: Íconos y selector de idioma */}
            <div
              className="w-1/4 flex justify-end items-center"
              style={{ gap: "var(--navbar-icon-spacing)" }}
              onMouseEnter={() => setHoveredPath(null)}
            >
              {/* Grupo 1: Preferencias (tema e idioma) */}
              <div className="flex items-center" style={{ gap: "var(--navbar-icon-spacing)" }}>
                {/* <ThemeToggle /> */}
                <SwitchLanguage />
              </div>

              {/* Grupo 2: Acciones de usuario (cuenta y carrito) */}
              <div className="flex items-center" style={{ gap: "var(--navbar-icon-spacing)" }}>
                {/* Icono de usuario con indicador de estado */}
                <div className="relative">
                  <NavbarIcon
                    icon={<UserIcon className="h-6 w-6" />}
                    onClick={handleUserIconClick}
                    label="User account"
                  />
                  {status === "authenticated" && session && (
                    <span
                      className="absolute h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"
                      style={{
                        top: "var(--navbar-icon-indicator-top)",
                        right: "var(--navbar-icon-indicator-right)",
                      }}
                    ></span>
                  )}
                </div>

                {/* Icono de carrito */}
                {/* <NavbarIcon
                  icon={<ShoppingCartIcon className="h-6 w-6" />}
                  label="Shopping cart"
                  onClick={() => (window.location.href = `/${locale}/cart`)}
                /> */}
              </div>
            </div>
          </div>
        </Container>
      </nav>

      {/* Submenu desplegable (solo para desktop) */}
      <Submenu pages={pagesWithSubmenu} hoveredPath={hoveredPath} />

      {/* Drawer de autenticación */}
      <AuthDrawer isOpen={isAuthDrawerOpen} onClose={handleCloseAuthDrawer} />
    </div>
  )
}






































// import { HomeIcon } from '@primer/octicons-react';
// import Link from 'next/link';
// import { useTranslations } from 'next-intl';
// import { NavbarSection, ActiveLink } from '@/components';
// import { SwitchLanguage } from '../switchlanguage/SwitchLanguage';
// import { ShoppingCartIcon, UserIcon } from '@heroicons/react/16/solid';




// export const Navbar = () => {
//     const S = useTranslations('Sections');
//     const P = useTranslations('Pages');

//     const pages = [
//         { path: '/products', text: P('products') },
//     ]

//     // Definimos las secciones que queremos mostrar en el NavbarSection
//     const sections = [
//         { id: 'home', label: S('home') },
//         { id: 'resources', label: S('resources') },
//         { id: 'pricing', label: S('pricing') },
//         { id: 'about-us', label: S('about-us') },
//         { id: 'contact', label: S('contact') }
//     ];

//     const rightIcons = [
//         { path: '/account', text: <UserIcon className='h-6 w-6' /> },
//         { path: '/cart', text: <ShoppingCartIcon className='h-6, w-6' /> }
//     ]



//     console.log(sections)
//     return (
//         <nav className="navbar">
//             <div className="container mx-auto flex items-center justify-between">
//                 {/* Columna izquierda: HomeIcon */}
//                 <div className="w-1/4 flex justify-start">
//                     <Link href="/">
//                         <HomeIcon size={24} />
//                     </Link>
//                 </div>

//                 {/* Columna central: Menú de navegación */}
//                 <div className="w-2/4 flex justify-center space-x-2 ">
//                     <NavbarSection sections={sections} />
//                     {pages.map((page) => (
//                         <ActiveLink key={page.path} path={page.path} text={page.text} />
//                     ))}
//                 </div>

//                 {/* Columna derecha: Íconos y selector de idioma */}
//                 <div className="w-1/4 flex justify-end space-x-4 items-center">
//                     <SwitchLanguage />
//                     {rightIcons.map((icon) => (
//                         <ActiveLink key={icon.path} path={icon.path} icon={icon.text} />
//                     ))}
//                 </div>
//             </div>
//         </nav>
//     );
// };

