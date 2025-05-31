// Asegurarse de que este archivo esté correctamente configurado
import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"

// Crear el manejador de autenticación
const handler = NextAuth(authOptions)

// Exportar el manejador para GET y POST
export { handler as GET, handler as POST }


// // Importar NextAuth y las opciones de configuración desde el archivo separado
// import NextAuth from "next-auth"
// import { authOptions } from "@/lib/auth/auth-options"

// // Log para verificar que el handler se está creando
// console.log("🔄 NextAuth: Creando handler")

// // Manejador de autenticación para la ruta
// const handler = NextAuth(authOptions)

// // Log para verificar que el handler se ha creado correctamente
// console.log("✅ NextAuth: Handler creado")

// export { handler as GET, handler as POST }
