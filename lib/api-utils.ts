import { NextRequest, NextResponse } from 'next/server'
import { verifyUserAccess, createAuthErrorResponse, requireAccess, requireAdmin, type AuthResult } from './auth'

/**
 * Helper function to handle authentication in API routes
 * Use this in your API route handlers for consistent auth handling
 */
export async function handleAuth(
  request: NextRequest,
  experienceId: string,
  options: {
    requireAdmin?: boolean
  } = {}
): Promise<{ success: true; auth: AuthResult } | { success: false; response: NextResponse }> {
  try {
    // Verify user authentication and access
    const authResult = await verifyUserAccess(request, experienceId)

    // Check for authentication errors
    if ('error' in authResult) {
      return {
        success: false,
        response: createAuthErrorResponse(authResult)
      }
    }

    // Check access requirements
    if (!requireAccess(authResult)) {
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Access denied to this experience' },
          { status: 403 }
        )
      }
    }

    // Check admin requirements if specified
    if (options.requireAdmin && !requireAdmin(authResult)) {
      return {
        success: false,
        response: NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        )
      }
    }

    return {
      success: true,
      auth: authResult
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

/**
 * Extract and validate request body
 */
export async function getRequestBody<T>(request: NextRequest): Promise<T | null> {
  try {
    const body = await request.json()
    return body as T
  } catch (error) {
    console.error('Failed to parse request body:', error)
    return null
  }
}

/**
 * Create standardized API responses
 */
export class ApiResponse {
  static success<T>(data: T, status = 200) {
    return NextResponse.json({ success: true, data }, { status })
  }

  static error(message: string, status = 400, details?: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: message,
        ...(details && { details })
      },
      { status }
    )
  }

  static notFound(resource = 'Resource') {
    return NextResponse.json(
      { success: false, error: `${resource} not found` },
      { status: 404 }
    )
  }

  static unauthorized(message = 'Unauthorized') {
    return NextResponse.json(
      { success: false, error: message },
      { status: 401 }
    )
  }

  static forbidden(message = 'Forbidden') {
    return NextResponse.json(
      { success: false, error: message },
      { status: 403 }
    )
  }

  static validation(errors: Record<string, string>) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Validation failed',
        errors 
      },
      { status: 422 }
    )
  }
}

/**
 * Validate required fields in request body
 */
export function validateRequiredFields<T extends Record<string, any>>(
  data: T,
  requiredFields: (keyof T)[]
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}

  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      errors[field as string] = `${String(field)} is required`
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}