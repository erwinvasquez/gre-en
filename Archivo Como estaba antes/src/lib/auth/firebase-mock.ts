// Simulación de Firebase Authentication
// Esta clase simula las funcionalidades básicas de Firebase Auth

// Tipos para la simulación
export interface FirebaseUser {
    uid: string
    email: string | null
    displayName: string | null
    photoURL: string | null
    emailVerified: boolean
    providerId: string
  }
  
  export interface FirebaseCredential {
    providerId: string
    signInMethod: string
  }
  
  export interface FirebaseAuthError {
    code: string
    message: string
  }
  
  // Usuarios de prueba predefinidos
  const MOCK_USERS: Record<string, FirebaseUser> = {
    "demo@example.com": {
      uid: "user123",
      email: "demo@example.com",
      displayName: "Usuario Demo",
      photoURL: null,
      emailVerified: true,
      providerId: "password",
    },
  }
  
  // Clase para simular Firebase Auth
  export class FirebaseAuthMock {
    private currentUser: FirebaseUser | null = null
    private authStateListeners: Array<(user: FirebaseUser | null) => void> = []
  
    // Simular inicio de sesión con email y contraseña
    async signInWithEmailAndPassword(email: string, password: string): Promise<{ user: FirebaseUser }> {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 800))
  
      // Verificar credenciales
      if (email === "demo@example.com" && password === "password") {
        const user = MOCK_USERS[email]
        this.setCurrentUser(user)
        return { user }
      }
  
      // Simular error de autenticación
      throw this.createError("auth/wrong-password", "Email o contraseña incorrectos")
    }
  
    // Simular inicio de sesión con Google
    async signInWithPopup(): Promise<{
      user: FirebaseUser
      credential: FirebaseCredential
    }> {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 800))
  
      // Crear usuario de Google simulado
      const googleUser: FirebaseUser = {
        uid: "google123",
        email: "google@example.com",
        displayName: "Usuario Google",
        photoURL: "https://lh3.googleusercontent.com/a/default-user",
        emailVerified: true,
        providerId: "google.com",
      }
  
      this.setCurrentUser(googleUser)
  
      return {
        user: googleUser,
        credential: {
          providerId: "google.com",
          signInMethod: "google.com",
        },
      }
    }
  
    // Simular registro con email y contraseña
    async createUserWithEmailAndPassword(email: string, password: string): Promise<{ user: FirebaseUser }> {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 1000))
  
      // Verificar si el usuario ya existe
      if (MOCK_USERS[email]) {
        throw this.createError(
          "auth/email-already-in-use",
          "La dirección de correo electrónico ya está siendo utilizada por otra cuenta.",
        )
      }
  
      // Crear nuevo usuario
      const newUser: FirebaseUser = {
        uid: `user_${Date.now()}`,
        email,
        displayName: email.split("@")[0],
        photoURL: null,
        emailVerified: false,
        providerId: "password",
      }
  
      // Agregar a usuarios simulados (en una implementación real, esto sería persistente)
      MOCK_USERS[email] = newUser
      this.setCurrentUser(newUser)
  
      return { user: newUser }
    }
  
    // Simular actualización de perfil
    async updateProfile(user: FirebaseUser, profile: { displayName?: string; photoURL?: string }): Promise<void> {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 500))
  
      if (user && user.email && MOCK_USERS[user.email]) {
        if (profile.displayName) {
          MOCK_USERS[user.email].displayName = profile.displayName
        }
        if (profile.photoURL) {
          MOCK_USERS[user.email].photoURL = profile.photoURL
        }
  
        // Actualizar usuario actual si es el mismo
        if (this.currentUser && this.currentUser.uid === user.uid) {
          this.setCurrentUser({
            ...this.currentUser,
            ...profile,
          })
        }
      }
    }
  
    // Simular cierre de sesión
    async signOut(): Promise<void> {
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 500))
      this.setCurrentUser(null)
    }
  
    // Obtener usuario actual
    getCurrentUser(): FirebaseUser | null {
      return this.currentUser
    }
  
    // Observar cambios en el estado de autenticación
    onAuthStateChanged(callback: (user: FirebaseUser | null) => void): () => void {
      this.authStateListeners.push(callback)
  
      // Ejecutar callback inmediatamente con el estado actual
      callback(this.currentUser)
  
      // Devolver función para cancelar la suscripción
      return () => {
        this.authStateListeners = this.authStateListeners.filter((listener) => listener !== callback)
      }
    }
  
    // Método privado para actualizar el usuario actual y notificar a los listeners
    private setCurrentUser(user: FirebaseUser | null): void {
      this.currentUser = user
  
      // Notificar a todos los listeners
      this.authStateListeners.forEach((listener) => listener(user))
    }
  
    // Método privado para crear errores con formato similar a Firebase
    private createError(code: string, message: string): FirebaseAuthError {
      return { code, message }
    }
  }
  
  // Exportar una instancia única para usar en toda la aplicación
  export const auth = new FirebaseAuthMock()
  
  // Proveedor de Google simulado para usar con signInWithPopup
  export const GoogleAuthProvider = {
    PROVIDER_ID: "google.com",
  }
  
  