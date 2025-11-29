import apiClient from './client'
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, ApiError } from '@/lib/types/auth.types'
import { AxiosError } from 'axios'

/**
 * Login user
 * @param credentials - User email and password
 * @returns Login response with token and user data
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials)
    
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('auth_token', response.data.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.data.user))
    }
    
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>
    
    console.error('Login error details:', {
      message: axiosError.message,
      status: axiosError.response?.status,
      data: axiosError.response?.data,
      url: axiosError.config?.url,
      baseURL: axiosError.config?.baseURL
    })
    
    const errorMessage = axiosError.response?.data?.message || 
                        axiosError.response?.data?.error ||
                        (axiosError.response?.status === 404 ? 'API endpoint not found. Check if backend is running.' :
                        axiosError.code === 'ECONNREFUSED' ? 'Cannot connect to server. Make sure backend is running on http://localhost:3000' :
                        axiosError.code === 'ERR_NETWORK' ? 'Network error. Check if backend server is running.' :
                        'Login failed. Please try again.')
    
    throw new Error(errorMessage)
  }
}

/**
 * Register new user (Admin only)
 * @param userData - User email, password, and role
 * @returns Register response with user data
 */
export const register = async (userData: RegisterRequest): Promise<RegisterResponse> => {
  try {
    const response = await apiClient.post<RegisterResponse>('/auth/register', userData)
    return response.data
  } catch (error) {
    const axiosError = error as AxiosError<ApiError>

    console.error('Register error details:', {
      message: axiosError.message,
      status: axiosError.response?.status,
      data: axiosError.response?.data,
      url: axiosError.config?.url,
      baseURL: axiosError.config?.baseURL
    })
    
    const errorMessage = axiosError.response?.data?.message || 
                        axiosError.response?.data?.error ||
                        (axiosError.response?.status === 404 ? 'API endpoint not found. Check if backend is running.' :
                        axiosError.code === 'ECONNREFUSED' ? 'Cannot connect to server. Make sure backend is running on http://localhost:3000' :
                        axiosError.code === 'ERR_NETWORK' ? 'Network error. Check if backend server is running.' :
                        'Registration failed. Please try again.')
    
    throw new Error(errorMessage)
  }
}

/**
 * Logout user
 * Clears local storage and redirects to login
 */
export const logout = (): void => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user')
  window.location.href = '/login'
}

/**
 * Get current user profile from API
 * @returns User profile
 */
export const getMe = async () => {
  try {
    const response = await apiClient.get('/auth/me')
    if (response.data.success && response.data.data) {
      localStorage.setItem('user', JSON.stringify(response.data.data))
      return response.data.data
    }
    return null
  } catch (error) {
    console.error('Get me error:', error)
    return null
  }
}

/**
 * Get current user from localStorage
 * @returns User object or null
 */
export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null
  
  const userStr = localStorage.getItem('user')
  if (!userStr) return null
  
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

/**
 * Check if user is authenticated
 * @returns boolean
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem('auth_token')
}

/**
 * Get auth token
 * @returns token string or null
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}
