import { headers } from 'next/headers'
import { type AuthResult, type AccessLevel } from '../auth'

/**
 * Function to access authenticated user information in server components
 * This reads the user data that was set by the authentication middleware
 */
export async function getAuthHeaders(): Promise<AuthResult | null> {
  try {
    const headersList = await headers()
    
    const userId = headersList.get('x-user-id')
    const accessLevel = headersList.get('x-access-level') as AccessLevel
    const hasAccess = headersList.get('x-has-access') === 'true'
    const experienceId = headersList.get('x-experience-id')

    if (!userId || !accessLevel || !experienceId) {
      return null
    }

    return {
      userId,
      hasAccess,
      accessLevel,
    }
  } catch (error) {
    // This will happen in client components where headers() is not available
    console.warn('getAuthHeaders can only be used in server components')
    return null
  }
}

/**
 * Type guard to check if user has admin access
 */
export function isAdmin(auth: AuthResult | null): boolean {
  return auth?.accessLevel === 'admin' && auth.hasAccess
}

/**
 * Type guard to check if user has any access
 */
export function hasAccess(auth: AuthResult | null): boolean {
  return auth?.hasAccess === true
}

/**
 * Type guard to check if user is a customer
 */
export function isCustomer(auth: AuthResult | null): boolean {
  return auth?.accessLevel === 'customer' && auth.hasAccess
}