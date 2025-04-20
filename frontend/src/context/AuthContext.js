import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

// Create the context
const AuthContext = createContext()

// Create the provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Check authentication on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }

      try {
        // Verify token with backend
        const response = await axios.get('/api/auth/verify', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setUser(response.data.user)
      } catch (error) {
        localStorage.removeItem('token')
        console.error('Authentication check failed:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password
      })
      
      localStorage.setItem('token', response.data.token)
      setUser(response.data.user)
      navigate('/dashboard')
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      }
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/login')
  }

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role
  }

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.includes(user?.role)
  }

  // The context value
  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    hasRole,
    hasAnyRole
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

// Custom hook for easy access
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}