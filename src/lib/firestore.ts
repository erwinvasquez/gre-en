// Utilidades para trabajar con Firestore usando la sesión de NextAuth
import { db } from "@/lib/firebase"
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where, getDocs } from "firebase/firestore"
import type { Session } from "next-auth"

/**
 * Guarda datos de usuario en Firestore
 * @param userId ID del usuario (de NextAuth)
 * @param data Datos a guardar
 */
export async function saveUserData(userId: string, data: any) {
  try {
    const userRef = doc(db, "users", userId)
    await setDoc(userRef, data, { merge: true })
    return true
  } catch (error) {
    console.error("Error al guardar datos de usuario:", error)
    return false
  }
}

/**
 * Obtiene datos de usuario de Firestore
 * @param userId ID del usuario (de NextAuth)
 */
export async function getUserData(userId: string) {
  try {
    const userRef = doc(db, "users", userId)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      return userSnap.data()
    } else {
      return null
    }
  } catch (error) {
    console.error("Error al obtener datos de usuario:", error)
    return null
  }
}

/**
 * Guarda un documento en una colección con permisos basados en el usuario
 * @param session Sesión de NextAuth
 * @param collectionName Nombre de la colección
 * @param docId ID del documento (opcional)
 * @param data Datos a guardar
 */
export async function saveDocument(session: Session | null, collectionName: string, data: any, docId?: string) {
  if (!session?.user?.id) {
    throw new Error("Usuario no autenticado")
  }

  try {
    // Añadir metadatos del usuario
    const dataWithMetadata = {
      ...data,
      userId: session.user.id,
      userEmail: session.user.email,
      updatedAt: new Date(),
      createdAt: new Date(),
    }

    let docRef
    if (docId) {
      // Actualizar documento existente
      docRef = doc(db, collectionName, docId)
      await updateDoc(docRef, {
        ...dataWithMetadata,
        createdAt: undefined, // No actualizar la fecha de creación
      })
    } else {
      // Crear nuevo documento
      const collectionRef = collection(db, collectionName)
      docRef = doc(collectionRef)
      await setDoc(docRef, dataWithMetadata)
    }

    return docRef.id
  } catch (error) {
    console.error(`Error al guardar documento en ${collectionName}:`, error)
    throw error
  }
}

/**
 * Obtiene documentos de una colección filtrados por usuario
 * @param session Sesión de NextAuth
 * @param collectionName Nombre de la colección
 */
export async function getUserDocuments(session: Session | null, collectionName: string) {
  if (!session?.user?.id) {
    throw new Error("Usuario no autenticado")
  }

  try {
    const q = query(collection(db, collectionName), where("userId", "==", session.user.id))
    const querySnapshot = await getDocs(q)

    const documents: any[] = []
    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return documents
  } catch (error) {
    console.error(`Error al obtener documentos de ${collectionName}:`, error)
    throw error
  }
}

/**
 * Elimina un documento verificando que pertenezca al usuario
 * @param session Sesión de NextAuth
 * @param collectionName Nombre de la colección
 * @param docId ID del documento
 */
export async function deleteUserDocument(session: Session | null, collectionName: string, docId: string) {
  if (!session?.user?.id) {
    throw new Error("Usuario no autenticado")
  }

  try {
    // Verificar que el documento pertenece al usuario
    const docRef = doc(db, collectionName, docId)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      throw new Error("Documento no encontrado")
    }

    const docData = docSnap.data()
    if (docData.userId !== session.user.id) {
      throw new Error("No tienes permiso para eliminar este documento")
    }

    // Eliminar el documento
    await deleteDoc(docRef)
    return true
  } catch (error) {
    console.error(`Error al eliminar documento de ${collectionName}:`, error)
    throw error
  }
}
