import { isAuthErrorModalOpen } from '@/stores/authError'

const BASE_URL = 'https://nciylzkjnkiwyyshupjp.supabase.co/functions/v1'
const API_KEY = 'sb_publishable_9zww-IMFpv5sAcazEPSWWQ_NZAvqjw1'
const PUBLIC_ENDPOINTS = ['/register', '/login', '/register-student']

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  // Add API key for public endpoints
  if (PUBLIC_ENDPOINTS.includes(path)) {
    headers['apikey'] = API_KEY
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  const data = await res.json()

  if (!res.ok || data.success === false) {
    // Handle 401 - trigger auth error modal
    if (res.status === 401) {
      const modal = isAuthErrorModalOpen()
      if (modal) {
        modal.value = true
      }
    }
    throw new ApiError(data.message || `Erro ${res.status}`, res.status)
  }

  return data
}
