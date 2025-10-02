import { whopSdk } from './whop-sdk'
import { NextRequest, NextResponse } from 'next/server'

export type AccessLevel = 'admin' | 'customer' | 'no_access'

export interface AuthResult {
  userId: string
  hasAccess: boolean
  accessLevel: AccessLevel
}

export interface AuthError {
  error: string
  status: number
}

/**
 * Verify user token and check experience access
 */
export async function verifyUserAccess(
  request: NextRequest | Headers,
  experienceId: string
): Promise<AuthResult | AuthError> {
  try {
    // Get headers from request or use headers directly
    const headers = request instanceof NextRequest ? request.headers : request

    // Verify the user token
    const { userId } = await whopSdk.verifyUserToken(headers)

    // Check if user has access to the experience
    const accessResult = await whopSdk.access.checkIfUserHasAccessToExperience({
      userId,
      experienceId,
    })

    return {
      userId,
      hasAccess: accessResult.hasAccess,
      accessLevel: accessResult.accessLevel as AccessLevel,
    }
  } catch (error) {
    console.error('Authentication error:', error)
    
    // Handle different types of authentication errors
    if (error instanceof Error) {
      if (error.message.includes('Invalid token') || error.message.includes('JWT')) {
        return {
          error: 'Invalid or missing authentication token',
          status: 401,
        }
      }
      
      if (error.message.includes('access')) {
        return {
          error: 'Access denied to this experience',
          status: 403,
        }
      }
    }

    return {
      error: 'Authentication failed',
      status: 401,
    }
  }
}

/**
 * Verify user token and check company access (for admin functions)
 */
export async function verifyCompanyAccess(
  request: NextRequest | Headers,
  companyId: string
): Promise<AuthResult | AuthError> {
  try {
    // Get headers from request or use headers directly
    const headers = request instanceof NextRequest ? request.headers : request

    // Verify the user token
    const { userId } = await whopSdk.verifyUserToken(headers)

    // Check if user has access to the company
    const accessResult = await whopSdk.access.checkIfUserHasAccessToCompany({
      userId,
      companyId,
    })

    return {
      userId,
      hasAccess: accessResult.hasAccess,
      accessLevel: accessResult.accessLevel as AccessLevel,
    }
  } catch (error) {
    console.error('Company access error:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('Invalid token') || error.message.includes('JWT')) {
        return {
          error: 'Invalid or missing authentication token',
          status: 401,
        }
      }
    }

    return {
      error: 'Company access verification failed',
      status: 401,
    }
  }
}

/**
 * Middleware helper to check if user is admin
 */
export function requireAdmin(authResult: AuthResult | AuthError): authResult is AuthResult {
  if ('error' in authResult) {
    return false
  }
  
  return authResult.hasAccess && authResult.accessLevel === 'admin'
}

/**
 * Middleware helper to check if user has any access
 */
export function requireAccess(authResult: AuthResult | AuthError): authResult is AuthResult {
  if ('error' in authResult) {
    return false
  }
  
  return authResult.hasAccess
}

/**
 * Create error response for authentication failures
 */
export function createAuthErrorResponse(authError: AuthError) {
  return NextResponse.json(
    { 
      error: authError.error,
      message: authError.error 
    },
    {
      status: authError.status,
    }
  )
}