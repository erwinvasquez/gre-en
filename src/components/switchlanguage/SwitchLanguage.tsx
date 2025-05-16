"use client"

import { useState, useEffect, useRef } from "react"
import { useLocalization } from "@/hooks"
import { NavbarIcon } from "@/components/ui/navbar-icon"

// Componentes de banderas SVG
const SpainFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 500" className="w-6 h-4" aria-label="Bandera de España">
    <rect width="750" height="500" fill="#c60b1e" />
    <rect width="750" height="250" fill="#ffc400" y="125" />
  </svg>
)

const USAFlag = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 750 500"
    className="w-6 h-4"
    aria-label="Bandera de Estados Unidos"
  >
    <rect width="750" height="500" fill="#fff" />
    <g fill="#bf0a30">
      <rect width="750" height="38.5" y="38.5" />
      <rect width="750" height="38.5" y="115.5" />
      <rect width="750" height="38.5" y="192.5" />
      <rect width="750" height="38.5" y="269.5" />
      <rect width="750" height="38.5" y="346.5" />
      <rect width="750" height="38.5" y="423.5" />
    </g>
    <rect width="300" height="269.5" fill="#002868" />
    <g fill="#fff">
      {/* Simplificación de estrellas */}
      <circle cx="30" cy="30" r="10" />
      <circle cx="90" cy="30" r="10" />
      <circle cx="150" cy="30" r="10" />
      <circle cx="210" cy="30" r="10" />
      <circle cx="270" cy="30" r="10" />
      <circle cx="30" cy="90" r="10" />
      <circle cx="90" cy="90" r="10" />
      <circle cx="150" cy="90" r="10" />
      <circle cx="210" cy="90" r="10" />
      <circle cx="270" cy="90" r="10" />
      <circle cx="30" cy="150" r="10" />
      <circle cx="90" cy="150" r="10" />
      <circle cx="150" cy="150" r="10" />
      <circle cx="210" cy="150" r="10" />
      <circle cx="270" cy="150" r="10" />
      <circle cx="30" cy="210" r="10" />
      <circle cx="90" cy="210" r="10" />
      <circle cx="150" cy="210" r="10" />
      <circle cx="210" cy="210" r="10" />
      <circle cx="270" cy="210" r="10" />
    </g>
  </svg>
)

// Actualizar el array de idiomas para incluir portugués y añadir la bandera de Brasil
const BrazilFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 500" className="w-6 h-4" aria-label="Bandera de Brasil">
    <rect width="750" height="500" fill="#009c3b" />
    <path d="M375,70 L675,250 L375,430 L75,250 L375,70z" fill="#ffdf00" />
    <circle cx="375" cy="250" r="98" fill="#002776" stroke="#fff" strokeWidth="5" />
    <path d="M375,190 A60,60 0 0 1 375,310" fill="#002776" stroke="#fff" strokeWidth="5" />
  </svg>
)

const languages = [
  { code: "en", label: "English", flag: <USAFlag /> },
  { code: "es", label: "Español", flag: <SpainFlag /> },
  { code: "pt", label: "Português", flag: <BrazilFlag /> },
]

export const SwitchLanguage = () => {
  const { locale, changeLocale } = useLocalization()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)

    // Asegurarse de que el idioma se inicialice correctamente
    // Obtener el idioma de la URL
    if (typeof window !== "undefined") {
      const pathSegments = window.location.pathname.split("/")
      if (pathSegments.length > 1) {
        const urlLocale = pathSegments[1]
        if (["en", "es", "pt"].includes(urlLocale) && urlLocale !== locale) {
          // Solo actualizar si es necesario para evitar renders innecesarios
          changeLocale(urlLocale)
        }
      }
    }
  }, [])

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale !== locale) {
      changeLocale(newLocale)
    }
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Si no está montado, renderizar un placeholder con las mismas dimensiones
  if (!mounted) {
    return <div className="w-6 h-4 opacity-0"></div>
  }

  // Encontrar el idioma actual
  const currentLanguage =
    languages.find((lang) => lang.code === locale) ||
    // Fallback a la URL si el estado no está sincronizado
    (typeof window !== "undefined"
      ? languages.find((lang) => lang.code === window.location.pathname.split("/")[1])
      : null) ||
    languages[0] // Último fallback

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <NavbarIcon
        icon={currentLanguage.flag}
        onClick={() => setIsOpen(!isOpen)}
        label="Cambiar idioma"
        aria-expanded={isOpen}
      />

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => handleLanguageChange(lang.code)}
            >
              <span className="flex-shrink-0">{lang.flag}</span>
              <span className="text-sm font-medium">{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
















// 'use client';

// import { useParams, useRouter, usePathname } from 'next/navigation';
// import { useState, useEffect, useRef } from 'react';

// const languages = [
//   { code: 'en', label: 'English', short: 'ENG' },
//   { code: 'es', label: 'Español', short: 'ESP' },
//   { code: 'fr', label: 'Français', short: 'FR' },
// ];

// export const SwitchLanguage = () => {
//   const router = useRouter();
//   const pathname = usePathname();
//   const { locale } = useParams();
//   const [isOpen, setIsOpen] = useState(false); // Controla si el menú está abierto
//   const dropdownRef = useRef<HTMLDivElement>(null); // Referencia al contenedor del dropdown

  
//   const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0];

//   const handleLanguageChange = (newLocale: string) => {
//     const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
//     router.push(newPath); // Navegar a la nueva ruta con el idioma seleccionado
//     setIsOpen(false); // Cerrar el dropdown
//   };

//   return (
//     <div className="relative inline-block text-left">
//       {/* Botón principal que muestra la abreviatura del idioma */}
//       <button
//         className="flex items-center px-3 py-2 text-sm font-medium text-white hover:text-black focus:outline-none"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         {currentLanguage.short} <span className="ml-2">&#9662;</span>
//       </button>

//       {/* Dropdown de idiomas */}
//       {isOpen && (
//         <ul className="absolute right-0 mt-2 w-28 bg-white shadow-lg rounded-md">
//           {languages.map((lang) => (
//             <li
//               key={lang.code}
//               className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
//               onClick={() => handleLanguageChange(lang.code)}
//             >
//               {lang.label}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };



// 'use client';

// import { useParams, useRouter, usePathname } from 'next/navigation';
// import { useState } from 'react';

// const languages = [
//   { code: 'en', label: 'English', flag: 'https://flagcdn.com/w40/gb.png' },
//   { code: 'es', label: 'Español', flag: 'https://flagcdn.com/w40/es.png' },
// ];

// export const SwitchLanguage = () => {
//   const router = useRouter();
//   const pathname = usePathname();
//   const { locale } = useParams();
//   const [isOpen, setIsOpen] = useState(false); // Controla la apertura del dropdown

//   const handleLanguageChange = (newLocale: string) => {
//     const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
//     router.push(newPath); // Navegar a la ruta con el nuevo idioma
//     setIsOpen(false); // Cerrar el dropdown
//   };

//   const currentLanguage = languages.find((lang) => lang.code === locale);

//   return (
//     <div className="flex items-center text-left">
//               <label htmlFor="language-select" className="mr-2 text-white">
//         Language:
//       </label>
//       {/* Botón para abrir/cerrar el dropdown */}
//       <div
//         className="flex items-center cursor-pointe text-white px-3 py-2 rounded-md"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <img
//           src={currentLanguage?.flag}
//           alt={currentLanguage?.label}
//           className="w-6 h-6 mr-2"
//         />
//         {currentLanguage?.label}
//       </div>

//       {/* Dropdown */}
//       {isOpen && (
//         <ul className="absolute mt-2 w-40 bg-white rounded-md shadow-lg">
//           {languages.map((lang) => (
//             <li
//               key={lang.code}
//               className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100"
//               onClick={() => handleLanguageChange(lang.code)}
//             >
//               <img
//                 src={lang.flag}
//                 alt={lang.label}
//                 className="w-6 h-6 mr-2"
//               />
//               {lang.label}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };
