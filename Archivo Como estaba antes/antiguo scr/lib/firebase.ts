// Configuración de Firebase para la aplicación (sin Auth)
import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Inicializar Firebase solo una vez
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

// Exportar servicios de Firebase (sin Auth)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app



// // Configuración de Firebase para la aplicación
// import { initializeApp, getApps, getApp } from "firebase/app"
// import { getAuth, GoogleAuthProvider } from "firebase/auth"
// import { getFirestore } from "firebase/firestore"
// import { getStorage } from "firebase/storage"

// // Tu configuración de Firebase
// // Reemplaza estos valores con los de tu proyecto Firebase
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
// }

// // Inicializar Firebase solo una vez
// const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

// // Exportar servicios de Firebase
// export const auth = getAuth(app)
// export const db = getFirestore(app)
// export const storage = getStorage(app)
// export const googleProvider = new GoogleAuthProvider()

// // Configurar el proveedor de Google para solicitar más permisos si es necesario
// googleProvider.setCustomParameters({
//   prompt: "select_account",
// })

// export default app
