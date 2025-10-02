import { NextRequest } from 'next/server'
import { handleAuth, ApiResponse } from '@/lib/api-utils'

/**
 * Test endpoint to verify authentication middleware is working
 * GET /api/auth/test?experienceId=<experienceId>
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const experienceId = searchParams.get('experienceId')

    if (!experienceId) {
      return ApiResponse.error('experienceId parameter is required', 400)
    }

    // Test authentication using the middleware
    const authCheck = await handleAuth(request, experienceId)
    if (!authCheck.success) {
      return authCheck.response
    }

    const { auth } = authCheck

    return ApiResponse.success({
      message: 'Authentication successful',
      user: {
        userId: auth.userId,
        accessLevel: auth.accessLevel,
        hasAccess: auth.hasAccess,
      },
      experienceId,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Auth test error:', error)
    return ApiResponse.error('Internal server error', 500)
  }
}

/**
 * Test endpoint to verify admin authentication
 * POST /api/auth/test?experienceId=<experienceId>
 */
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const experienceId = searchParams.get('experienceId')

    if (!experienceId) {
      return ApiResponse.error('experienceId parameter is required', 400)
    }

    // Test admin authentication
    const authCheck = await handleAuth(request, experienceId, { requireAdmin: true })
    if (!authCheck.success) {
      return authCheck.response
    }

    const { auth } = authCheck

    return ApiResponse.success({
      message: 'Admin authentication successful',
      user: {
        userId: auth.userId,
        accessLevel: auth.accessLevel,
        hasAccess: auth.hasAccess,
      },
      experienceId,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Admin auth test error:', error)
    return ApiResponse.error('Internal server error', 500)
  }
}