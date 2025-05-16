"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, Mail, Lock, User, AlertCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useAuth, useLocalization } from "@/hooks"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export function AuthDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const t = useTranslations("Auth")
  const router = useRouter()
  const { session, status, login, loginWithGoogle, logout, error, isLoading } = useAuth()
  const { locale, getLocalizedPath } = useLocalization()

  const [formState, setFormState] = useState({
    email: "",
    password: "",
    displayName: "",
    isLogin: true,
  })

  // Log cuando cambia el estado de la sesión
  useEffect(() => {
    console.log("🔍 AuthDrawer: Estado de sesión cambiado:", status)
    console.log("🔍 AuthDrawer: Datos de sesión:", session)
  }, [status, session])

  // Log cuando se abre/cierra el drawer
  useEffect(() => {
    console.log("🔍 AuthDrawer: Drawer " + (isOpen ? "abierto" : "cerrado"))
    if (isOpen) {
      setFormState({
        email: "",
        password: "",
        displayName: "",
        isLogin: true,
      })
    }
  }, [isOpen])

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formState.isLogin) {
      // Login con email/password
      const success = await login({
        email: formState.email,
        password: formState.password,
      })

      if (success) {
        // Close the drawer before the page reload
        onClose()
      }
    } else {
      // Registro (simulado)
      console.log("🔄 AuthDrawer: Intento de registro (no implementado)")
      // Aquí implementarías el registro real
    }
  }

  // Navegar a la página de cuenta
  const goToAccount = () => {
    onClose()
    router.push(getLocalizedPath("/account"))
  }

  // Cambiar entre login y registro
  const toggleAuthMode = () => {
    setFormState((prev) => ({
      ...prev,
      isLogin: !prev.isLogin,
    }))
  }

  // Actualizar campo del formulario
  const updateFormField = (field: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Manejar login con Google usando NextAuth
  const handleGoogleLogin = async () => {
    console.log("🔄 AuthDrawer: Iniciando login con Google...")

    // Cerrar el drawer antes de iniciar el proceso de login
    onClose()

    // Iniciar el proceso de login con Google usando NextAuth
    await loginWithGoogle()
  }

  // Manejar logout
  const handleLogout = async () => {
    console.log("🔄 AuthDrawer: Cerrando sesión...")

    // Cerrar el drawer antes de cerrar sesión
    onClose()

    // Cerrar sesión - ahora con redirección automática
    await logout()

    // No necesitamos hacer nada más aquí, ya que logout maneja la redirección
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={onClose} />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white dark:bg-gray-900 shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            {session ? t("myAccount") : formState.isLogin ? t("login") : t("register")}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {status === "loading" ? (
            <div className="flex justify-center items-center h-full">
              <LoadingSpinner size="md" />
            </div>
          ) : session ? (
            // Usuario autenticado
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  {session.user.image ? (
                    <img
                      src={session.user.image || "/placeholder.svg"}
                      alt={session.user.name || "Usuario"}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{session.user.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{session.user.email}</p>
                  {!session.user.emailVerified && (
                    <div className="flex items-center text-amber-600 text-xs mt-1">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {t("emailNotVerified")}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={goToAccount}
                  className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {t("manageAccount")}
                </button>
                <button
                  onClick={() => handleLogout()}
                  className="w-full py-2 px-4 flex items-center justify-center space-x-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span>{t("logout")}</span>
                </button>
              </div>
            </div>
          ) : (
            // Formulario de login/registro
            <div className="space-y-6">
              {error && (
                <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-3 rounded-md text-sm">
                  {error.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!formState.isLogin && (
                  <div>
                    <label htmlFor="displayName" className="block text-sm font-medium mb-1">
                      {t("name")}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="displayName"
                        type="text"
                        value={formState.displayName}
                        onChange={(e) => updateFormField("displayName", e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder={t("namePlaceholder")}
                        required={!formState.isLogin}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    {t("email")}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={formState.email}
                      onChange={(e) => updateFormField("email", e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={t("emailPlaceholder")}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-1">
                    {t("password")}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      value={formState.password}
                      onChange={(e) => updateFormField("password", e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={t("passwordPlaceholder")}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <LoadingSpinner size="sm" color="white" className="mr-2" />
                      {t("loading")}
                    </span>
                  ) : formState.isLogin ? (
                    t("loginButton")
                  ) : (
                    t("registerButton")
                  )}
                </button>
              </form>

              <div className="relative flex items-center">
                <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400 text-sm">{t("orContinueWith")}</span>
                <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
              </div>

              <button
                onClick={() => handleGoogleLogin()}
                className="w-full py-2 px-4 flex items-center justify-center space-x-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                disabled={isLoading}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                <span>{t("continueWithGoogle")}</span>
              </button>

              <div className="text-center text-sm">
                {formState.isLogin ? (
                  <p>
                    {t("noAccount")}{" "}
                    <button type="button" className="text-primary hover:underline" onClick={toggleAuthMode}>
                      {t("registerNow")}
                    </button>
                  </p>
                ) : (
                  <p>
                    {t("alreadyHaveAccount")}{" "}
                    <button type="button" className="text-primary hover:underline" onClick={toggleAuthMode}>
                      {t("loginNow")}
                    </button>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}



// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { X, Mail, Lock, User, AlertCircle } from "lucide-react"
// import { useTranslations } from "next-intl"
// import { useRouter } from "next/navigation"
// import { useAuth, useLocalization } from "@/hooks"
// import { LoadingSpinner } from "@/components/ui/loading-spinner"

// export function AuthDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
//   const t = useTranslations("Auth")
//   const router = useRouter()
//   const { session, status, login, loginWithGoogle, logout, error, isLoading } = useAuth()
//   const { locale, getLocalizedPath } = useLocalization()

//   const [formState, setFormState] = useState({
//     email: "",
//     password: "",
//     displayName: "",
//     isLogin: true,
//   })

//   // Log cuando cambia el estado de la sesión
//   useEffect(() => {
//     console.log("🔍 AuthDrawer: Estado de sesión cambiado:", status)
//     console.log("🔍 AuthDrawer: Datos de sesión:", session)
//   }, [status, session])

//   // Log cuando se abre/cierra el drawer
//   useEffect(() => {
//     console.log("🔍 AuthDrawer: Drawer " + (isOpen ? "abierto" : "cerrado"))
//     if (isOpen) {
//       setFormState({
//         email: "",
//         password: "",
//         displayName: "",
//         isLogin: true,
//       })
//     }
//   }, [isOpen])

//   // Manejar envío del formulario
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (formState.isLogin) {
//       // Login con email/password
//       const success = await login({
//         email: formState.email,
//         password: formState.password,
//       })

//       if (success) {
//         // Close the drawer before the page reload
//         onClose()
//       }
//     } else {
//       // Registro (simulado)
//       console.log("🔄 AuthDrawer: Intento de registro (no implementado)")
//       // Aquí implementarías el registro real
//     }
//   }

//   // Navegar a la página de cuenta
//   const goToAccount = () => {
//     onClose()
//     router.push(getLocalizedPath("/account"))
//   }

//   // Cambiar entre login y registro
//   const toggleAuthMode = () => {
//     setFormState((prev) => ({
//       ...prev,
//       isLogin: !prev.isLogin,
//     }))
//   }

//   // Actualizar campo del formulario
//   const updateFormField = (field: string, value: string) => {
//     setFormState((prev) => ({
//       ...prev,
//       [field]: value,
//     }))
//   }

//   // Update the handleGoogleLogin function to close the drawer before redirecting
//   const handleGoogleLogin = () => {
//     loginWithGoogle().then((success) => {
//       if (success) {
//         // Close the drawer before the page reload
//         onClose()
//       }
//     })
//   }

//   // Update the logout function to close the drawer before logging out
//   const handleLogout = () => {
//     // Close the drawer first to avoid UI issues
//     onClose()
//     // Then logout
//     logout()
//   }

//   if (!isOpen) return null

//   return (
//     <div className="fixed inset-0 z-50 overflow-hidden">
//       {/* Overlay */}
//       <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={onClose} />

//       {/* Drawer */}
//       <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white dark:bg-gray-900 shadow-xl flex flex-col">
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 border-b">
//           <h2 className="text-lg font-semibold">
//             {session ? t("myAccount") : formState.isLogin ? t("login") : t("register")}
//           </h2>
//           <button
//             onClick={onClose}
//             className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
//             aria-label="Cerrar"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="flex-1 overflow-y-auto p-4">
//           {status === "loading" ? (
//             <div className="flex justify-center items-center h-full">
//               <LoadingSpinner size="md" />
//             </div>
//           ) : session ? (
//             // Usuario autenticado
//             <div className="space-y-6">
//               <div className="flex items-center space-x-4">
//                 <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
//                   {session.user.image ? (
//                     <img
//                       src={session.user.image || "/placeholder.svg"}
//                       alt={session.user.name || "Usuario"}
//                       className="h-16 w-16 rounded-full object-cover"
//                     />
//                   ) : (
//                     <User className="h-8 w-8 text-gray-500 dark:text-gray-400" />
//                   )}
//                 </div>
//                 <div>
//                   <h3 className="font-medium">{session.user.name}</h3>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">{session.user.email}</p>
//                   {!session.user.emailVerified && (
//                     <div className="flex items-center text-amber-600 text-xs mt-1">
//                       <AlertCircle className="h-3 w-3 mr-1" />
//                       {t("emailNotVerified")}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <button
//                   onClick={goToAccount}
//                   className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
//                 >
//                   {t("manageAccount")}
//                 </button>
//                 <button
//                   onClick={() => handleLogout()}
//                   className="w-full py-2 px-4 flex items-center justify-center space-x-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//                 >
//                   <span>{t("logout")}</span>
//                 </button>
//               </div>
//             </div>
//           ) : (
//             // Formulario de login/registro
//             <div className="space-y-6">
//               {error && (
//                 <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-3 rounded-md text-sm">
//                   {error.message}
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="space-y-4">
//                 {!formState.isLogin && (
//                   <div>
//                     <label htmlFor="displayName" className="block text-sm font-medium mb-1">
//                       {t("name")}
//                     </label>
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <User className="h-5 w-5 text-gray-400" />
//                       </div>
//                       <input
//                         id="displayName"
//                         type="text"
//                         value={formState.displayName}
//                         onChange={(e) => updateFormField("displayName", e.target.value)}
//                         className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
//                         placeholder={t("namePlaceholder")}
//                         required={!formState.isLogin}
//                       />
//                     </div>
//                   </div>
//                 )}

//                 <div>
//                   <label htmlFor="email" className="block text-sm font-medium mb-1">
//                     {t("email")}
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <Mail className="h-5 w-5 text-gray-400" />
//                     </div>
//                     <input
//                       id="email"
//                       type="email"
//                       value={formState.email}
//                       onChange={(e) => updateFormField("email", e.target.value)}
//                       className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
//                       placeholder={t("emailPlaceholder")}
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label htmlFor="password" className="block text-sm font-medium mb-1">
//                     {t("password")}
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <Lock className="h-5 w-5 text-gray-400" />
//                     </div>
//                     <input
//                       id="password"
//                       type="password"
//                       value={formState.password}
//                       onChange={(e) => updateFormField("password", e.target.value)}
//                       className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
//                       placeholder={t("passwordPlaceholder")}
//                       required
//                     />
//                   </div>
//                 </div>

//                 <button
//                   type="submit"
//                   className="w-full py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? (
//                     <span className="flex items-center justify-center">
//                       <LoadingSpinner size="sm" color="white" className="mr-2" />
//                       {t("loading")}
//                     </span>
//                   ) : formState.isLogin ? (
//                     t("loginButton")
//                   ) : (
//                     t("registerButton")
//                   )}
//                 </button>
//               </form>

//               <div className="relative flex items-center">
//                 <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
//                 <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400 text-sm">{t("orContinueWith")}</span>
//                 <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
//               </div>

//               <button
//                 onClick={() => handleGoogleLogin()}
//                 className="w-full py-2 px-4 flex items-center justify-center space-x-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
//                 disabled={isLoading}
//               >
//                 <svg className="h-5 w-5" viewBox="0 0 24 24">
//                   <path
//                     d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                     fill="#4285F4"
//                   />
//                   <path
//                     d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                     fill="#34A853"
//                   />
//                   <path
//                     d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                     fill="#FBBC05"
//                   />
//                   <path
//                     d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                     fill="#EA4335"
//                   />
//                   <path d="M1 1h22v22H1z" fill="none" />
//                 </svg>
//                 <span>{t("continueWithGoogle")}</span>
//               </button>

//               <div className="text-center text-sm">
//                 {formState.isLogin ? (
//                   <p>
//                     {t("noAccount")}{" "}
//                     <button type="button" className="text-primary hover:underline" onClick={toggleAuthMode}>
//                       {t("registerNow")}
//                     </button>
//                   </p>
//                 ) : (
//                   <p>
//                     {t("alreadyHaveAccount")}{" "}
//                     <button type="button" className="text-primary hover:underline" onClick={toggleAuthMode}>
//                       {t("loginNow")}
//                     </button>
//                   </p>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }








