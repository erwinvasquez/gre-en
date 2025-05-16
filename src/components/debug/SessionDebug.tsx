"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export function SessionDebug() {
  const { data: session, status } = useSession()
  const [sessionHistory, setSessionHistory] = useState<string[]>([])

  // Registrar cambios en el estado de la sesión
  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString()
    setSessionHistory((prev) => [
      `${timestamp} - Status: ${status}${session ? ` - User: ${session.user?.name || "N/A"}` : ""}`,
      ...prev.slice(0, 4), // Mantener solo los últimos 5 cambios
    ])
  }, [status, session])

  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs z-50 max-w-xs overflow-auto">
      <h3 className="font-bold mb-2">Session Debug</h3>
      <p>
        Current Status:{" "}
        <span
          className={
            status === "authenticated"
              ? "text-green-400"
              : status === "unauthenticated"
                ? "text-red-400"
                : "text-yellow-400"
          }
        >
          {status}
        </span>
      </p>

      {session ? (
        <>
          <p>User: {session.user?.name || "N/A"}</p>
          <p>Email: {session.user?.email || "N/A"}</p>
          <p>Verified: {String(session.user?.emailVerified)}</p>
          <p>Provider: {session.user?.providerId || "N/A"}</p>
        </>
      ) : (
        <p>No session</p>
      )}

      <div className="mt-2 pt-2 border-t border-gray-600">
        <p className="font-bold mb-1">Session History:</p>
        <ul className="space-y-1">
          {sessionHistory.map((entry, index) => (
            <li key={index} className="text-xs opacity-80">
              {entry}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}


