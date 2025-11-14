import axios from 'axios'

// Create an axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // your backend URL
  withCredentials: true, // send cookies automatically
  headers: {
    'Content-Type': 'application/json',
  },
})

// Optional: Add request interceptor (e.g., auth token, logging)
api.interceptors.request.use(
  (config) => {
    // Can attach token if using localStorage/sessionStorage (not needed if using HTTP-only cookie)
    return config
  },
  (error) => Promise.reject(error),
)

// Optional: Add response interceptor for errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // handle 401, 403 globally
    if (error.response?.status === 401) {
      // redirect to login page if needed
      console.warn('Unauthorized - redirect to login')
    }
    return Promise.reject(error)
  },
)

export default api
