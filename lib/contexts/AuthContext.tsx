'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { type AuthResult, type AccessLevel } from '../auth'

interface AuthContextType {
  user: AuthResult | null
  isLoading: boolean
  isAdmin: boolean
  hasAccess: boolean
  isCustomer: boolean
  experienceId: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
  experienceId: string
}

/**
 * Authentication context provider for client components
 * This fetches and manages user authentication state on the client side
 */
export function AuthProvider({ children, experienceId }: AuthProviderProps) {
  const [user, setUser] = useState<AuthResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchAuthStatus() {
      try {
        const response = await fetch(`/api/auth/test?experienceId=${experienceId}`)
        
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data.user) {
            setUser({
              userId: data.data.user.userId,
              accessLevel: data.data.user.accessLevel as AccessLevel,
              hasAccess: data.data.user.hasAccess,
            })
          }
        } else {
          // User is not authenticated or doesn't have access
          setUser(null)
        }
      } catch (error) {
        console.error('Failed to fetch auth status:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAuthStatus()
  }, [experienceId])

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAdmin: user?.accessLevel === 'admin' && user.hasAccess,
    hasAccess: user?.hasAccess === true,
    isCustomer: user?.accessLevel === 'customer' && user.hasAccess,
    experienceId,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook to access authentication context in client components
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

/**
 * Higher-order component to protect routes that require authentication
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    requireAdmin?: boolean
    fallback?: React.ComponentType
  } = {}
) {
  return function AuthenticatedComponent(props: P) {
    const { user, isLoading, isAdmin, hasAccess } = useAuth()
    
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )
    }

    if (!hasAccess) {
      if (options.fallback) {
        return <options.fallback />
      }
      
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-600">You do not have access to this experience.</p>
          </div>
        </div>
      )
    }

    if (options.requireAdmin && !isAdmin) {
      if (options.fallback) {
        return <options.fallback />
      }
      
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Admin Access Required</h1>
            <p className="text-gray-600">You need admin privileges to access this page.</p>
          </div>
        </div>
      )
    }

    return <Component {...props} />
  }
}