"use client"

import type React from "react"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useCallback, useState } from "react"
import { useAppSelector } from "@/redux/hooks"
import { useActiveSection } from "@/hooks"
import style from "../active-link/ActiveLink.module.css"
import { DEFAULT_SECTION_DETECTION } from "@/lib/animation-config"

interface Section {
  id: string
  label: string
}

interface NavbarSectionProps {
  sections: Section[]
}

export const NavbarSection: React.FC<NavbarSectionProps> = ({ sections }) => {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useAppSelector((state) => state.language.locale)
  const [targetId, setTargetId] = useState<string | null>(null)

  // Verificar si estamos en la página principal
  const isHomePage = pathname === `/${locale}`

  // Usar nuestro hook unificado para detectar la sección activa
  const activeSection = useActiveSection({
    threshold: DEFAULT_SECTION_DETECTION.threshold,
    selectorPattern: DEFAULT_SECTION_DETECTION.selectorPattern,
  })

  // Scroll suave hacia una sección específica
  const handleScroll = useCallback((id: string) => {
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  // Navegar entre secciones o a la página principal
  const handleNavigation = (id: string) => {
    if (pathname === `/${locale}`) {
      handleScroll(id)
      // Actualizar manualmente el hash sin recargar la página
      window.history.pushState(null, "", `#${id}`)
    } else {
      setTargetId(id)
      // Navegar primero a la página principal sin hash para permitir el scroll suave
      router.push(`/${locale}`)
    }
  }

  // Aplicar el scroll después de cambiar de página
  useEffect(() => {
    if (targetId && pathname === `/${locale}`) {
      const timeout = setTimeout(() => {
        handleScroll(targetId)
        // Actualizar manualmente el hash sin recargar la página
        window.history.pushState(null, "", `#${targetId}`)
        setTargetId(null)
      }, 300) // Aumentamos el tiempo para asegurar que la página esté completamente cargada
      return () => clearTimeout(timeout)
    }
  }, [pathname, targetId, handleScroll, locale])

  // Determinar si una sección está activa
  const isSectionActive = (sectionId: string) => {
    // Verificar si hay un hash en la URL que coincida con el ID de la sección
    const hash = window.location.hash.substring(1)

    // Si estamos en la página principal, usar el activeSection del hook o el hash
    if (isHomePage) {
      return activeSection === sectionId || hash === sectionId
    }

    // Si estamos en otra página, verificar si la URL coincide con el ID de la sección
    const currentPage = pathname.split("/").pop()?.toLowerCase() || ""
    return currentPage === sectionId.toLowerCase()
  }

  return (
    <div className="flex items-center" style={{ gap: "var(--navbar-link-spacing)" }}>
      {sections.map((section) => (
        <Link
          key={section.id}
          href={`/${locale}#${section.id}`}
          scroll={false}
          className={`${style["text-link"]} ${isSectionActive(section.id) ? style["active-text-link"] : ""}`}
          onClick={(e) => {
            e.preventDefault()
            handleNavigation(section.id)
          }}
        >
          {section.label}
        </Link>
      ))}
    </div>
  )
}










// 'use client';

// import Link from 'next/link';
// import { useRouter, usePathname } from 'next/navigation';
// import { useEffect, useCallback, useState } from 'react';
// import style from '../active-link/ActiveLink.module.css'; // Importamos estilos


// export const NavbarSection: React.FC = () => {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [activeSection, setActiveSection] = useState<string | null>(null); // Estado para la sección activa
//   const [targetId, setTargetId] = useState<string | null>(null); // ID de la sección objetivo

//   // Extraer el idioma de la ruta
//   const getLocaleFromPathname = () => {
//     const locale = pathname.split('/')[1];
//     return ['en', 'es'].includes(locale) ? locale : 'en';
//   };

//   const locale = getLocaleFromPathname();

//   // Scroll suave hacia la sección
//   const handleScroll = useCallback((id: string) => {
//     const section = document.getElementById(id);
//     if (section) {
//       section.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, []);

//   // Navegar hacia la sección o página principal
//   const handleNavigation = (id: string) => {
//     if (pathname === `/${locale}`) {
//       handleScroll(id); // Si estamos en la página principal, desplazamos
//     } else {
//       setTargetId(id); // Guardamos el ID temporalmente
//       router.push(`/${locale}`); // Navegamos a la raíz del idioma
//     }
//   };

//   // Aplicar scroll después de cambiar a la página principal
//   useEffect(() => {
//     if (targetId && pathname === `/${locale}`) {
//       const timeout = setTimeout(() => {
//         handleScroll(targetId); // Scroll a la sección objetivo
//         setTargetId(null); // Limpiamos el estado
//       }, 100);
//       return () => clearTimeout(timeout); // Limpiamos el timeout al desmontar
//     }
//   }, [pathname, targetId, handleScroll]);

//   // Detectar la sección activa usando Intersection Observer
//   useEffect(() => {
//     if (pathname !== `/${locale}`) {
//       setActiveSection(null); // Reseteamos la sección activa si estamos en otra página
//       return; // No ejecutamos el observer si no estamos en la página principal
//     }

//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             setActiveSection(entry.target.id); // Actualizamos la sección activa
//           }
//         });
//       },
//       { threshold: 0.6 } // La sección está activa si el 60% es visible
//     );

//     const sections = document.querySelectorAll('section');
//     sections.forEach((section) => observer.observe(section));

//     return () => observer.disconnect(); // Desconectamos el observer al desmontar
//   }, [pathname, locale]);

//   return (
//     <>
//       <div className='flex items-center'>
//         <Link
//           href={`/${locale}#home`}
//           scroll={false}
//           className={`${style.link} ${activeSection === 'home' ? style['active-link'] : ''
//             } mx-2 cursor-pointer`}
//           onClick={(e) => {
//             e.preventDefault();
//             handleNavigation('home');
//           }}
//         >
//           Home
//         </Link>

//         <Link
//           href={`/${locale}#contact`}
//           scroll={false}
//           className={`${style.link} ${activeSection === 'contact' ? style['active-link'] : ''
//             } mx-2 cursor-pointer`}
//           onClick={(e) => {
//             e.preventDefault();
//             handleNavigation('contact');
//           }}
//         >
//           Contact
//         </Link>
//       </div>
//     </>
//   );
// };





// 'use client';

// import Link from 'next/link';
// import { useRouter, usePathname } from 'next/navigation';
// import { useEffect, useCallback, useState } from 'react';

// export const NavbarSection: React.FC = () => {
//   const router = useRouter();
//   const pathname = usePathname(); // Obtenemos la ruta actual completa
//   const [targetId, setTargetId] = useState<string | null>(null); // Guardamos el ID de la sección temporalmente

//   // Función para obtener el idioma actual desde la ruta
//   const getLocaleFromPathname = () => {
//     const locale = pathname.split('/')[1]; // Obtenemos la primera parte de la ruta
//     return ['en', 'es'].includes(locale) ? locale : 'en'; // Si no es un idioma válido, usamos 'en' como default
//   };

//   const locale = getLocaleFromPathname(); // Detectamos el idioma actual

//   // Función para hacer scroll suave a una sección específica
//   const handleScroll = useCallback((id: string) => {
//     const section = document.getElementById(id);
//     if (section) {
//       section.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, []);

//   // Función para manejar la navegación hacia una sección
//   const handleNavigation = (id: string) => {
//     if (pathname.startsWith(`/${locale}`) && pathname === `/${locale}`) {
//       // Si estamos en la página principal del idioma, desplazamos suavemente
//       handleScroll(id);
//     } else {
//       // Si estamos en otra página, navegamos primero a la raíz con el idioma
//       setTargetId(id); // Guardamos el ID temporalmente
//       router.push(`/${locale}`); // Navegamos a la raíz del idioma
//     }
//   };

//   // Aplicar el scroll después de navegar a la página principal
//   useEffect(() => {
//     if (targetId && pathname === `/${locale}`) {
//       const timeout = setTimeout(() => {
//         handleScroll(targetId); // Scroll suave a la sección objetivo
//         setTargetId(null); // Limpiamos el estado después del scroll
//       }, 100); // Aseguramos que el DOM esté listo
//       return () => clearTimeout(timeout); // Limpiamos el timeout al desmontar
//     }
//   }, [pathname, targetId, handleScroll]);

//   return (
//     <>
//       {/* Enlace hacia la sección "home" con el prefijo del idioma */}
//       <Link
//         href={`/${locale}#home`}
//         scroll={false}
//         className="mx-2 cursor-pointer"
//         onClick={(e) => {
//           e.preventDefault(); // Prevenimos la navegación automática
//           handleNavigation('home'); // Navegamos manualmente a la sección
//         }}
//       >
//         Home Section
//       </Link>

//       {/* Enlace hacia la sección "contact" con el prefijo del idioma */}
//       <Link
//         href={`/${locale}#contact`}
//         scroll={false}
//         className="mx-2 cursor-pointer"
//         onClick={(e) => {
//           e.preventDefault(); // Prevenimos la navegación automática
//           handleNavigation('contact'); // Navegamos manualmente a la sección
//         }}
//       >
//         Contact Section
//       </Link>
//     </>
//   );
// };




// 'use client';

// import Link from 'next/link';
// import { useRouter, usePathname, useParams } from 'next/navigation';
// import { useEffect, useCallback, useState } from 'react';

// export const NavbarSection: React.FC = () => {
//   const router = useRouter();
//   const pathname = usePathname();
//   const { locale } = useParams(); // Obtener el idioma activo
//   const [targetId, setTargetId] = useState<string | null>(null); // Guardamos el ID temporalmente

//   // Función para hacer scroll suave a una sección
//   const handleScroll = useCallback((id: string) => {
//     const section = document.getElementById(id);
//     if (section) {
//       section.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, []);

//   // Navegar hacia la sección considerando el idioma activo
//   const handleNavigation = (id: string) => {
//     const localePath = `/${locale}`; // Construimos el prefijo de idioma

//     if (pathname.startsWith(localePath)) {
//       // Si ya estamos en la página principal del idioma, desplazamos suavemente
//       handleScroll(id);
//     } else {
//       // Si estamos en otra página, navegamos primero a la principal con idioma
//       setTargetId(id); // Guardamos el ID temporalmente
//       router.push(`${localePath}`); // Navegamos a la raíz del idioma
//     }
//   };

//   // Aplicar el scroll después de cambiar de página
//   useEffect(() => {
//     if (targetId) {
//       const timeout = setTimeout(() => {
//         handleScroll(targetId);
//         setTargetId(null); // Limpiamos el estado
//       }, 100); // Aseguramos que el DOM esté listo
//       return () => clearTimeout(timeout); // Limpiamos el timeout si el componente se desmonta
//     }
//   }, [pathname, targetId, handleScroll]);

//   return (
//     <>
//       {/* Usamos Link con prefijo de idioma y manejamos el scroll manualmente */}
//       <Link
//         href={`/${locale}#home`}
//         scroll={false}
//         className="mx-2 cursor-pointer"
//         onClick={(e) => {
//           e.preventDefault(); // Prevenimos la navegación automática del navegador
//           handleNavigation('home'); // Manejamos la navegación manualmente
//         }}
//       >
//         Home Section
//       </Link>

//       <Link
//         href={`/${locale}#contact`}
//         scroll={false}
//         className="mx-2 cursor-pointer"
//         onClick={(e) => {
//           e.preventDefault(); // Prevenimos la navegación automática del navegador
//           handleNavigation('contact'); // Manejamos la navegación manualmente
//         }}
//       >
//         Contact Section
//       </Link>
//     </>
//   );
// };


// 'use client';

// import Link from 'next/link';
// import { useRouter, usePathname } from 'next/navigation';
// import { useEffect, useCallback, useState } from 'react';

// export const NavbarSection: React.FC = () => {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [targetId, setTargetId] = useState<string | null>(null); // Guardamos el ID temporalmente

//   // Función para hacer scroll suave a una sección
//   const handleScroll = useCallback((id: string) => {
//     const section = document.getElementById(id);
//     if (section) {
//       section.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, []);

//   // Navegar hacia la sección
//   const handleNavigation = (id: string) => {
//     if (pathname === '/') {
//       // Si ya estamos en la página principal, desplazamos suavemente
//       handleScroll(id);
//     } else {
//       // Si estamos en otra página, navegamos primero sin cambiar el hash automáticamente
//       setTargetId(id); // Guardamos el ID temporalmente
//       router.push('/'); // Navegamos a la página principal sin hash
//     }
//   };

//   // Aplicar el scroll después de cambiar de página
//   useEffect(() => {
//     if (targetId) {
//       const timeout = setTimeout(() => {
//         handleScroll(targetId);
//         setTargetId(null); // Limpiamos el estado
//       }, 100); // Aseguramos que el DOM esté listo
//       return () => clearTimeout(timeout); // Limpiamos el timeout si el componente se desmonta
//     }
//   }, [pathname, targetId, handleScroll]);

//   return (
//     <>
//       {/* Usamos Link pero mantenemos la lógica del onClick para manejar el scroll */}
//       <Link
//         href="#home"
//         scroll={false}
//         className="mx-2 cursor-pointer"
//         onClick={(e) => {
//           e.preventDefault(); // Prevenimos la navegación automática del navegador
//           handleNavigation('home'); // Manejamos la navegación manualmente
//         }}
//       >
//         Home Section
//       </Link>

//       <Link
//         href="#contact"
//         scroll={false}
//         className="mx-2 cursor-pointer"
//         onClick={(e) => {
//           e.preventDefault(); // Prevenimos la navegación automática del navegador
//           handleNavigation('contact'); // Manejamos la navegación manualmente
//         }}
//       >
//         Contact Section
//       </Link>
//     </>
//   );
// };


