import { API_BASE_URL } from '@/config/api'

interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
}

interface LoginResponse {
  access_token: string
  refresh_token: string
}

interface UserResponse {
  id: string
  name: string
  email: string
  phone: string
  cpf: string
  created_at: string
  academy?: {
    id: string
    teacher_id: string
    name: string
    billing_day: number
    photo_url: string | null
    created_at: string
  }
}

interface TokenData {
  access_token: string
  refresh_token: string
}

class ApiService {
  private accessToken: string | null = null
  private refreshToken: string | null = null

  constructor() {
    this.loadTokensFromStorage()
  }

  private loadTokensFromStorage() {
    const stored = localStorage.getItem('auth_tokens')
    if (stored) {
      try {
        const { access_token, refresh_token } = JSON.parse(stored)
        this.accessToken = access_token
        this.refreshToken = refresh_token
      } catch {
        this.clearTokens()
      }
    }
  }

  private saveTokensToStorage(tokens: TokenData) {
    localStorage.setItem('auth_tokens', JSON.stringify(tokens))
    this.accessToken = tokens.access_token
    this.refreshToken = tokens.refresh_token
  }

  private clearTokens() {
    localStorage.removeItem('auth_tokens')
    this.accessToken = null
    this.refreshToken = null
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false

    try {
      const response = await fetch(`${API_BASE_URL}/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refresh_token: this.refreshToken })
      })

      const result = await response.json() as ApiResponse<LoginResponse>

      if (result.success && result.data) {
        this.saveTokensToStorage(result.data)
        return true
      }

      this.clearTokens()
      return false
    } catch {
      this.clearTokens()
      return false
    }
  }

  private async fetchWithAuth<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(typeof options.headers === 'object' && options.headers !== null ? options.headers : {})
    }

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`
    }

    let response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    })

    if (response.status === 401 && this.refreshToken) {
      const refreshed = await this.refreshAccessToken()
      if (refreshed && this.accessToken) {
        headers['Authorization'] = `Bearer ${this.accessToken}`
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers
        })
      } else {
        this.clearTokens()
        throw new Error('Session expired. Please login again.')
      }
    }

    const data = await response.json() as ApiResponse<T>

    if (!response.ok && !data.success) {
      throw new Error(data.message || `API Error: ${response.status}`)
    }

    return data
  }

  async register(
    name: string,
    email: string,
    cpf: string,
    password: string
  ): Promise<ApiResponse<void>> {
    return this.fetchWithAuth('/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, cpf, password })
    })
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.fetchWithAuth<LoginResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })

    if (response.success && response.data) {
      this.saveTokensToStorage(response.data)
      return response.data
    }

    throw new Error(response.message || 'Login failed')
  }

  async getUser(): Promise<UserResponse> {
    const response = await this.fetchWithAuth<UserResponse>('/user')

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || 'Failed to fetch user')
  }

  async getHomeDashboard() {
    const response = await this.fetchWithAuth('/home-dashboard')

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || 'Failed to fetch dashboard')
  }

  async getStudents(status?: string) {
    const query = status ? `?status=${status}` : ''
    const response = await this.fetchWithAuth(`/students${query}`)

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || 'Failed to fetch students')
  }

  async registerStudentPublic(academyId: string, studentData: any) {
    const payload = {
      academy_id: academyId,
      name: studentData.name,
      phone: studentData.phone,
      cpf: studentData.cpf || null,
      date_of_birth: studentData.date_of_birth || null,
      emergency_contact_name: studentData.emergency_contact_name || null,
      emergency_contact_phone: studentData.emergency_contact_phone || null,
      belt: studentData.belt || null
    }

    const response = await fetch(`${API_BASE_URL}/register-student-public`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await response.json() as ApiResponse<any>

    if (!response.ok && !data.success) {
      throw new Error(data.message || `API Error: ${response.status}`)
    }

    return data
  }

  async registerStudentTeacher(academyId: string, studentData: any) {
    const payload = {
      academy_id: academyId,
      name: studentData.name,
      phone: studentData.phone,
      cpf: studentData.cpf || null,
      date_of_birth: studentData.date_of_birth || null,
      emergency_contact_name: studentData.emergency_contact_name || null,
      emergency_contact_phone: studentData.emergency_contact_phone || null,
      belt: studentData.belt || null
    }

    const response = await this.fetchWithAuth('/register-student-teacher', {
      method: 'POST',
      body: JSON.stringify(payload)
    })

    if (response.success) {
      return response
    }

    throw new Error(response.message || 'Failed to register student')
  }

  async getPendingPayments(pending: boolean = true) {
    const query = pending ? '?pending=true' : '?pending=false'
    const response = await this.fetchWithAuth(`/pending-payments${query}`)

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || 'Failed to fetch payments')
  }

  async markPaymentPaid(studentId: string, paymentMonth: string) {
    const response = await this.fetchWithAuth('/mark-payment-paid', {
      method: 'POST',
      body: JSON.stringify({ student_id: studentId, payment_month: paymentMonth })
    })

    if (response.success) {
      return response.data
    }

    throw new Error(response.message || 'Failed to mark payment')
  }

  async registerAcademy(name: string, billingDay: number, monthlyFee: number, image?: File) {
    const formData = new FormData()
    formData.append('name', name)
    formData.append('billing_day', billingDay.toString())
    formData.append('monthly_fee', monthlyFee.toString())
    if (image) {
      formData.append('image', image)
    }

    const headers: any = {}
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`
    }

    const response = await fetch(`${API_BASE_URL}/register-academy`, {
      method: 'POST',
      headers,
      body: formData
    })

    const data = await response.json() as ApiResponse<any>

    if (!response.ok && !data.success) {
      throw new Error(data.message || `API Error: ${response.status}`)
    }

    return data.data
  }

  async deletePayment(paymentId: string) {
    const response = await this.fetchWithAuth('/delete-payment', {
      method: 'DELETE',
      body: JSON.stringify({ payment_id: paymentId })
    })

    if (response.success) {
      return response.data
    }

    throw new Error(response.message || 'Failed to delete payment')
  }

  async updateStudent(studentId: string, studentData: any) {
    const payload = {
      id: studentId,
      name: studentData.name || undefined,
      phone: studentData.phone || undefined,
      cpf: studentData.cpf || undefined,
      date_of_birth: studentData.date_of_birth || undefined,
      emergency_contact_name: studentData.emergency_contact_name || undefined,
      emergency_contact_phone: studentData.emergency_contact_phone || undefined,
      belt: studentData.belt || undefined,
      status: studentData.status !== undefined ? studentData.status : undefined
    }

    const response = await this.fetchWithAuth('/update-student', {
      method: 'POST',
      body: JSON.stringify(payload)
    })

    if (response.success) {
      return response
    }

    throw new Error(response.message || 'Failed to update student')
  }

  logout() {
    this.clearTokens()
  }

  isAuthenticated(): boolean {
    return !!this.accessToken
  }

  getAccessToken(): string | null {
    return this.accessToken
  }
}

export const apiService = new ApiService()
