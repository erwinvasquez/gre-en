// Utilidades para manejo de roles de usuario en Firestore
import { db } from "@/lib/firebase"
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore"

export interface UserRole {
  id: string
  email: string
  name: string | null
  role: "admin" | "user"
  provider: string
  createdAt: any
  updatedAt: any
  lastLogin: any
  image?: string | null
}

/**
 * Obtiene el rol de un usuario desde Firestore
 * @param userId ID del usuario
 * @returns Rol del usuario o "user" por defecto
 */
export async function getUserRole(userId: string): Promise<"admin" | "user"> {
  try {
    console.log("🔍 Firestore: Obteniendo rol para usuario:", userId)

    const userRef = doc(db, "users", userId)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const userData = userSnap.data() as UserRole
      console.log("✅ Firestore: Rol encontrado:", userData.role)
      return userData.role || "user"
    } else {
      console.log("⚠️ Firestore: Usuario no encontrado, asignando rol 'user'")
      return "user"
    }
  } catch (error) {
    console.error("❌ Firestore: Error al obtener rol:", error)
    return "user" // Rol por defecto en caso de error
  }
}

/**
 * Crea o actualiza un usuario en Firestore
 * @param userData Datos del usuario
 * @returns true si fue exitoso, false si hubo error
 */
export async function createOrUpdateUser(userData: {
  id: string
  email: string | null
  name: string | null
  provider: string
  image?: string | null
}): Promise<UserRole> {
  try {
    console.log("🔄 Firestore: Creando/actualizando usuario:", userData.id)

    const userRef = doc(db, "users", userData.id)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      // Usuario existe, actualizar lastLogin y datos básicos
      const existingData = userSnap.data() as UserRole
      const updatedData = {
        ...existingData,
        name: userData.name || existingData.name,
        email: userData.email || existingData.email,
        image: userData.image !== undefined ? userData.image : existingData.image,
        lastLogin: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      await updateDoc(userRef, updatedData)
      console.log("✅ Firestore: Usuario actualizado")
      return { ...updatedData, role: existingData.role || "user" } as UserRole
    } else {
      // Usuario nuevo, crear con rol "user" por defecto
      const newUserData: UserRole = {
        id: userData.id,
        email: userData.email || "", // Corregir: asegurar que no sea undefined
        name: userData.name,
        role: "user", // Rol por defecto
        provider: userData.provider,
        image: userData.image || null, // Corregir: asegurar que no sea undefined
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      }

      await setDoc(userRef, newUserData)
      console.log("✅ Firestore: Nuevo usuario creado con rol 'user'")
      return newUserData
    }
  } catch (error) {
    console.error("❌ Firestore: Error al crear/actualizar usuario:", error)
    // Retornar datos básicos con rol "user" en caso de error
    return {
      id: userData.id,
      email: userData.email || "", // Corregir: asegurar que no sea undefined
      name: userData.name,
      role: "user",
      provider: userData.provider,
      image: userData.image || null, // Corregir: asegurar que no sea undefined
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: new Date(),
    }
  }
}

/**
 * Actualiza el rol de un usuario
 * @param userId ID del usuario
 * @param role Nuevo rol
 * @returns true si fue exitoso
 */
export async function updateUserRole(userId: string, role: "admin" | "user"): Promise<boolean> {
  try {
    console.log(`🔄 Firestore: Actualizando rol de ${userId} a ${role}`)

    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, {
      role,
      updatedAt: serverTimestamp(),
    })

    console.log("✅ Firestore: Rol actualizado exitosamente")
    return true
  } catch (error) {
    console.error("❌ Firestore: Error al actualizar rol:", error)
    return false
  }
}

/**
 * Verifica si un usuario tiene un rol específico
 * @param userId ID del usuario
 * @param requiredRole Rol requerido
 * @returns true si tiene el rol
 */
export async function hasRole(userId: string, requiredRole: "admin" | "user"): Promise<boolean> {
  try {
    const userRole = await getUserRole(userId)
    return userRole === requiredRole
  } catch (error) {
    console.error("❌ Firestore: Error al verificar rol:", error)
    return false
  }
}

/**
 * Verifica si un usuario es administrador
 * @param userId ID del usuario
 * @returns true si es admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
  return await hasRole(userId, "admin")
}

/**
 * Obtiene todos los datos de un usuario incluyendo rol
 * @param userId ID del usuario
 * @returns Datos completos del usuario o null
 */
export async function getUserData(userId: string): Promise<UserRole | null> {
  try {
    console.log("🔍 Firestore: Obteniendo datos completos para usuario:", userId)

    const userRef = doc(db, "users", userId)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const userData = userSnap.data() as UserRole
      console.log("✅ Firestore: Datos de usuario obtenidos")
      return userData
    } else {
      console.log("⚠️ Firestore: Usuario no encontrado")
      return null
    }
  } catch (error) {
    console.error("❌ Firestore: Error al obtener datos de usuario:", error)
    return null
  }
}

