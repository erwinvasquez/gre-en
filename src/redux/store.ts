import { configureStore } from "@reduxjs/toolkit"
import languageReducer from "./slices/languageSlice"

export const store = configureStore({
  reducer: {
    language: languageReducer, // Mantener solo el reducer de idioma
  },
})

// Tipos para TypeScript
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

