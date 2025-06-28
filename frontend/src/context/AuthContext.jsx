import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Parse JWT token
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      return null
    }
  }

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const decoded = parseJwt(token)
      if (decoded && decoded.userId) {
        setIsAuthenticated(true)
        setUser({
          id: decoded.userId,
          name: decoded.name,
          isPremium: decoded.ispremiumuser || false
        })
      } else {
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }, [])

  const login = (token) => {
    localStorage.setItem('token', token)
    const decoded = parseJwt(token)
    if (decoded) {
      setIsAuthenticated(true)
      setUser({
        id: decoded.userId,
        name: decoded.name,
        isPremium: decoded.ispremiumuser || false
      })
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    setUser(null)
  }

  const updateUserPremiumStatus = (isPremium) => {
    setUser(prev => ({ ...prev, isPremium }))
  }

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    updateUserPremiumStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}