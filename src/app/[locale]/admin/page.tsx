"use client"
import { Users, ShoppingBag, Settings, BarChart3, FileText, Bell, HelpCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import { format } from "date-fns"
import { useProtectedRoute } from "@/hooks"
import { LoadingSpinner } from "@/components/ui/loading-spinner"


export default function AdminPage() {
  const { session, isLoading } = useProtectedRoute()
  const t = useTranslations("Admin")

  // Mostrar spinner mientras se verifica la autenticación
  if (isLoading) {
    return <LoadingSpinner fullScreen size="lg" label={t("loading")} />
  }

  // Estructura de los módulos del panel de administración
  const adminModules = [
    {
      id: "dashboard",
      title: t("dashboard"),
      description: t("dashboardDesc"),
      icon: <BarChart3 className="h-8 w-8" />,
    },
    {
      id: "users",
      title: t("users"),
      description: t("usersDesc"),
      icon: <Users className="h-8 w-8" />,
    },
    {
      id: "products",
      title: t("products"),
      description: t("productsDesc"),
      icon: <ShoppingBag className="h-8 w-8" />,
    },
    {
      id: "orders",
      title: t("orders"),
      description: t("ordersDesc"),
      icon: <FileText className="h-8 w-8" />,
    },
    {
      id: "notifications",
      title: t("notifications"),
      description: t("notificationsDesc"),
      icon: <Bell className="h-8 w-8" />,
    },
    {
      id: "settings",
      title: t("settings"),
      description: t("settingsDesc"),
      icon: <Settings className="h-8 w-8" />,
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t("adminPanel")}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {t("welcome")}, {session?.user.name}
          </p>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg flex items-center">
          <div className="mr-3">
            <div className="text-sm font-medium">{t("lastLogin")}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{format(new Date(), "dd/MM/yyyy")}</div>
          </div>
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            {session?.user.image ? (
              <img
                src={session.user.image || "/placeholder.svg"}
                alt={session.user.name || "Usuario"}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-lg font-medium">{session?.user.name?.charAt(0).toUpperCase() || "U"}</span>
            )}
          </div>
        </div>
      </div>

      {/* Resumen de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: t("totalUsers"), value: "1,234", change: "+12%" },
          { label: t("totalProducts"), value: "567", change: "+5%" },
          { label: t("totalOrders"), value: "892", change: "+18%" },
          { label: t("revenue"), value: "$12,345", change: "+8%" },
        ].map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
            <div className="flex items-end mt-2">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="ml-2 text-sm text-green-500">{stat.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Módulos de administración */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminModules.map((module) => (
          <div
            key={module.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center mb-4">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mr-4">{module.icon}</div>
              <h3 className="text-xl font-semibold">{module.title}</h3>
            </div>
            <p className="text-gray-500 dark:text-gray-400">{module.description}</p>
          </div>
        ))}
      </div>

      {/* Ayuda */}
      <div className="mt-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 flex items-start">
        <HelpCircle className="h-6 w-6 text-primary mr-4 flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-medium">{t("needHelp")}</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t("helpText")}</p>
          <button className="mt-2 text-primary hover:underline">{t("viewDocs")}</button>
        </div>
      </div>
    </div>
  )
}


