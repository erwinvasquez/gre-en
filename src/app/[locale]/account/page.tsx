"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { User, Mail, Camera, LogOut, ChevronRight, Shield, Bell, CreditCard } from "lucide-react"
import Head from "next/head"
import { format } from "date-fns"
import { useProtectedRoute, useAuth } from "@/hooks"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function AccountPage() {
  const { session, isLoading: isRouteLoading } = useProtectedRoute()
  const { logout } = useAuth()
  const t = useTranslations("Account")

  const [displayName, setDisplayName] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Inicializar formulario con datos del usuario
  useEffect(() => {
    if (session?.user) {
      setDisplayName(session.user.name || "")
    }
  }, [session])

  // Manejar actualización de perfil
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session?.user) return

    setIsSaving(true)

    try {
      // En una implementación real, aquí llamaríamos a una API para actualizar el perfil
      // Por ahora, solo simulamos un retraso
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Actualizar el estado local
      setIsEditing(false)
    } catch (error) {
      console.error("Error al actualizar perfil:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Mostrar spinner mientras se verifica la autenticación
  if (isRouteLoading) {
    return <LoadingSpinner fullScreen size="lg" label={t("loading")} />
  }

  // Metadatos para páginas protegidas (no indexables)
  const pageTitle = `${t("myAccount")} | Tu Marca`

  return (
    <>
      {/* Metadatos para páginas protegidas (no indexables) */}
      <Head>
        <title>{pageTitle}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">{t("myAccount")}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    {session?.user.image ? (
                      <img
                        src={session.user.image || "/placeholder.svg"}
                        alt={session.user.name || "Usuario"}
                        className="h-24 w-24 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 text-gray-500 dark:text-gray-400" />
                    )}
                  </div>
                  <button
                    className="absolute bottom-0 right-0 bg-gray-100 dark:bg-gray-700 p-2 rounded-full border border-gray-300 dark:border-gray-600"
                    aria-label="Cambiar foto"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <h2 className="text-xl font-semibold">{session?.user.name}</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{session?.user.email}</p>
              </div>

              <div className="mt-6 space-y-2">
                <button
                  onClick={() => logout()}
                  className="w-full py-2 px-4 flex items-center justify-center space-x-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t("logout")}</span>
                </button>
              </div>
            </div>

            <nav className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-medium">{t("accountSettings")}</h3>
              </div>
              <ul>
                {[
                  { icon: <User className="h-5 w-5" />, label: t("profile"), active: true },
                  { icon: <Shield className="h-5 w-5" />, label: t("security") },
                  { icon: <Bell className="h-5 w-5" />, label: t("notifications") },
                  { icon: <CreditCard className="h-5 w-5" />, label: t("billing") },
                ].map((item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className={`flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        item.active ? "bg-gray-50 dark:bg-gray-700" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Main content */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">{t("profileInformation")}</h2>
                <button onClick={() => setIsEditing(!isEditing)} className="text-sm text-primary hover:underline">
                  {isEditing ? t("cancel") : t("edit")}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdateProfile}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="displayName" className="block text-sm font-medium mb-1">
                        {t("name")}
                      </label>
                      <input
                        id="displayName"
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">
                        {t("email")}
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={session?.user.email || ""}
                        disabled
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      />
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t("emailCannotBeChanged")}</p>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <span className="flex items-center justify-center">
                            <LoadingSpinner size="sm" color="white" className="mr-2" />
                            {t("saving")}
                          </span>
                        ) : (
                          t("saveChanges")
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("name")}</h3>
                      <p>{session?.user.name}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("email")}</h3>
                      <p>{session?.user.email}</p>
                      {!session?.user.emailVerified && (
                        <div className="flex items-center text-amber-600 text-xs mt-1">
                          <span className="bg-amber-100 text-amber-600 px-2 py-1 rounded text-xs">
                            {t("notVerified")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      {t("accountProvider")}
                    </h3>
                    <div className="flex items-center">
                      {session?.user.providerId === "google.com" ? (
                        <>
                          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
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
                          <span>Google</span>
                        </>
                      ) : (
                        <>
                          <Mail className="h-5 w-5 mr-2" />
                          <span>{t("emailPassword")}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">{t("accountActivity")}</h2>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {t("lastLogin")}: {format(new Date(), "dd/MM/yyyy")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}








// const Account: React.FC = () => (
//     <h1 className="text-3xl text-center mt-20">Account Page</h1>
//   );
//   export default Account;
  