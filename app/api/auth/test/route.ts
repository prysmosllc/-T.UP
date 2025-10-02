import { NextRequest, NextResponse } from 'next/server'
import { verifyUserAccess, createAuthErrorResponse, requireAccess } from '@/lib/auth'

/**
 * Test authentication endpoint
 * GET /api/auth/test?experienceId=exp_xxx
 */
export async function GET(request: NextRequest) {
  try {
    // Get experienceId from query parameters
    const { searchParams } = new URL(request.url)
    const experienceId = searchParams.get('experienceId')

    if (!experienceId) {
      return NextResponse.json(
        { error: 'experienceId query parameter is required' },
        { status: 400 }
      )
    }

    // Verify user authentication and access
    const authResult = await verifyUserAccess(request, experienceId)

    // Check for authentication errors
    if ('error' in authResult) {
      return createAuthErrorResponse(authResult)
    }

    // Check access requirements
    if (!requireAccess(authResult)) {
      return NextResponse.json(
        { error: 'Access denied to this experience' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        message: 'Authentication successful',
        user: {
          userId: authResult.userId,
          hasAccess: authResult.hasAccess,
          accessLevel: authResult.accessLevel,
        },
      },
    })
  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}