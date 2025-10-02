import { NextRequest, NextResponse } from 'next/server'
import { verifyUserAccess, createAuthErrorResponse, requireAccess } from '@/lib/auth'
import { db } from '@/lib/db'

/**
 * Check if user has a profile
 * GET /api/profile/check?experienceId=exp_xxx
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

    // Check if user has a profile
    const profile = await db.profile.findUnique({
      where: {
        userId_experienceId: {
          userId: authResult.userId,
          experienceId: experienceId,
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        hasProfile: !!profile,
        isComplete: profile?.isComplete || false,
        role: profile?.role || null,
      },
    })
  } catch (error) {
    console.error('Profile check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}