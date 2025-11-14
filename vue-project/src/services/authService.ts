import api from './apiService'

export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password })

export const logout = () => api.post('/auth/logout')

export const fetchProfile = () => api.get('/auth/profile')
