// Utilidades para trabajar con Firebase Storage usando la sesión de NextAuth
import { storage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from "firebase/storage"
import type { Session } from "next-auth"

/**
 * Sube un archivo a Firebase Storage
 * @param session Sesión de NextAuth
 * @param file Archivo a subir
 * @param path Ruta en Storage (sin el userId)
 * @returns URL del archivo subido
 */
export async function uploadFile(session: Session | null, file: File, path: string) {
  if (!session?.user?.id) {
    throw new Error("Usuario no autenticado")
  }

  try {
    // Crear una ruta única que incluya el ID del usuario
    const userPath = `users/${session.user.id}/${path}`
    const storageRef = ref(storage, userPath)

    // Subir el archivo
    const snapshot = await uploadBytes(storageRef, file)

    // Obtener la URL de descarga
    const downloadURL = await getDownloadURL(snapshot.ref)

    return {
      url: downloadURL,
      path: userPath,
    }
  } catch (error) {
    console.error("Error al subir archivo:", error)
    throw error
  }
}

/**
 * Elimina un archivo de Firebase Storage
 * @param session Sesión de NextAuth
 * @param path Ruta completa del archivo en Storage
 */
export async function deleteFile(session: Session | null, path: string) {
  if (!session?.user?.id) {
    throw new Error("Usuario no autenticado")
  }

  try {
    // Verificar que la ruta pertenece al usuario
    if (!path.includes(`users/${session.user.id}/`)) {
      throw new Error("No tienes permiso para eliminar este archivo")
    }

    // Eliminar el archivo
    const storageRef = ref(storage, path)
    await deleteObject(storageRef)

    return true
  } catch (error) {
    console.error("Error al eliminar archivo:", error)
    throw error
  }
}

/**
 * Obtiene todos los archivos de una carpeta del usuario
 * @param session Sesión de NextAuth
 * @param folder Carpeta dentro del espacio del usuario
 */
export async function getUserFiles(session: Session | null, folder: string) {
  if (!session?.user?.id) {
    throw new Error("Usuario no autenticado")
  }

  try {
    // Crear la ruta de la carpeta del usuario
    const userFolder = `users/${session.user.id}/${folder}`
    const folderRef = ref(storage, userFolder)

    // Listar todos los archivos
    const fileList = await listAll(folderRef)

    // Obtener las URLs de descarga
    const files = await Promise.all(
      fileList.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef)
        return {
          name: itemRef.name,
          path: itemRef.fullPath,
          url,
        }
      }),
    )

    return files
  } catch (error) {
    console.error("Error al obtener archivos:", error)
    throw error
  }
}
