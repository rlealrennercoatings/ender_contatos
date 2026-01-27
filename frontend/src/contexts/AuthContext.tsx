import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import * as jwt_decode from 'jwt-decode'

interface User {
  oid: string
  email: string
  name: string
  groups: string[]
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, groups: string[]) => Promise<void>
  logout: () => void
  hasPermission: (permission: string) => boolean
  setTokenFromCallback: (token: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Recuperar token do localStorage na inicialização
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token')
    if (storedToken) {
      setToken(storedToken)
      // Decodificar e extrair usuário do token
      try {
        const decoded: any = jwt_decode.jwtDecode(storedToken)
        setUser({
          oid: decoded.oid,
          email: decoded.email,
          name: decoded.name,
          groups: decoded.groups || [],
        })
      } catch (error) {
        console.error('Erro ao decodificar token:', error)
        localStorage.removeItem('auth_token')
        setToken(null)
      }
    }
    setLoading(false)
  }, [])

  const getApiUrl = (endpoint: string) => {
    const protocol = window.location.protocol
    const host = window.location.hostname
    return `${protocol}//${host}${endpoint}`
  }

  const login = async (email: string, groups: string[]) => {
    try {
      setLoading(true)
      const response = await axios.post(getApiUrl('/auth/login-manual'), { email, groups })
      const { token, user } = response.data

      setToken(token)
      setUser(user)
      localStorage.setItem('auth_token', token)

      navigate('/')
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const setTokenFromCallback = (newToken: string) => {
    try {
      // Decodificar o token para extrair informações do usuário
      const decoded: any = jwt_decode.jwtDecode(newToken)

      const userData: User = {
        oid: decoded.oid,
        email: decoded.email,
        name: decoded.name,
        groups: decoded.groups || [],
      }

      setToken(newToken)
      setUser(userData)
      localStorage.setItem('auth_token', newToken)
    } catch (error) {
      console.error('Erro ao processar token de callback:', error)
      throw error
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('auth_token')
    navigate('/login')
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false

    const permissionsMap: { [key: string]: string[] } = {
      'ENDER_ADMINISTRADORES': ['CREATE', 'EDIT', 'DELETE', 'VIEW'],
      'ENDER_EDITORES': ['CREATE', 'EDIT', 'VIEW'],
      'ENDER_LEITORES': ['VIEW'],
    }

    for (const group of user.groups) {
      const groupPermissions = permissionsMap[group] || []
      if (groupPermissions.includes(permission)) {
        return true
      }
    }

    return false
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, hasPermission, setTokenFromCallback }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}
