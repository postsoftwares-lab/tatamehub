import { supabase } from '@/lib/supabase'
import type { AuthError, User } from '@supabase/supabase-js'

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User | null
  error: AuthError | null
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (error) {
        return { user: null, error }
      }

      return { user: data.user, error: null }
    } catch (error) {
      return {
        user: null,
        error: error as AuthError,
      }
    }
  }

  async logout(): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null)
    })
  }
}

export const authService = new AuthService()
