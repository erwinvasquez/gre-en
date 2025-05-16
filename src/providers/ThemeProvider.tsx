// // src/providers/ThemeProvider.tsx (versión corregida)

// "use client"

// import type React from "react"
// import { ThemeProvider as NextThemesProvider } from "next-themes"
// import { useAppSelector } from "@/redux/hooks"

// interface CustomThemeProviderProps {
//   children: React.ReactNode
// }

// export function ThemeProvider({ children }: CustomThemeProviderProps) {
//   const { theme } = useAppSelector((state) => state.theme)

//   return (
//     <NextThemesProvider attribute="class" defaultTheme={theme} enableSystem={theme === "system"}>
//       {children}
//     </NextThemesProvider>
//   )
// }

