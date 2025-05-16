// src/redux/slices/languageSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface LanguageState {
  locale: string
}

// Actualizar la función getInitialLocale para incluir portugués
const getInitialLocale = (): string => {
  // Evitar acceso a window durante SSR
  if (typeof window === "undefined") {
    return "es" // Valor predeterminado para SSR
  }

  // Obtener de la URL primero (prioridad más alta)
  const pathname = window.location.pathname
  const localeFromPath = pathname.split("/")[1]
  if (["en", "es", "pt"].includes(localeFromPath)) {
    return localeFromPath
  }

  // Cliente: intentar obtener de localStorage
  const savedLocale = localStorage.getItem("locale")
  if (savedLocale && ["en", "es", "pt"].includes(savedLocale)) {
    return savedLocale
  }

  // Obtener de la cookie como último recurso
  const cookies = document.cookie.split(";")
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=")
    if (name === "NEXT_LOCALE" && ["en", "es", "pt"].includes(value)) {
      return value
    }
  }

  return "es" // Valor predeterminado
}

// Estado inicial seguro para SSR
const initialState: LanguageState = {
  locale: "es", // Valor predeterminado para SSR
}

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.locale = action.payload
      // Guardamos el idioma seleccionado en localStorage (solo en el cliente)
      if (typeof window !== "undefined") {
        localStorage.setItem("locale", action.payload)
        // También establecemos una cookie para que el servidor la pueda leer
        document.cookie = `NEXT_LOCALE=${action.payload}; path=/; max-age=31536000; SameSite=Strict`
      }
    },
    // Acción para inicializar el idioma en el cliente después de la hidratación
    initializeLanguage: (state) => {
      if (typeof window !== "undefined") {
        state.locale = getInitialLocale()
      }
    },
    // Añadir esta acción para sincronizar con la URL
    syncWithUrl: (state) => {
      if (typeof window !== "undefined") {
        const urlLocale = window.location.pathname.split("/")[1]
        if (["en", "es", "pt"].includes(urlLocale)) {
          state.locale = urlLocale
        }
      }
    },
  },
})

export const { setLanguage, initializeLanguage, syncWithUrl } = languageSlice.actions
export default languageSlice.reducer



