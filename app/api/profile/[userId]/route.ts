import { NextRequest, NextResponse } from 'next/server'
import { handleAuth, ApiResponse } from '@/lib/api-utils'
import { db } from '@/lib/db'

/**
 * Get user profile by userId
 * GET /api/profile/[userId]?experienceId=exp_xxx
 */
export async function GET(
  request: NextRequest,
  context: { params: { userId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const experienceId = searchParams.get('experienceId')

    if (!experienceId) {
      return ApiResponse.error('experienceId query parameter is required', 400)
    }

    // Handle authentication
    const authCheck = await handleAuth(request, experienceId)
    if (!authCheck.success) {
      return authCheck.response
    }

    // Fetch the profile
    const profile = await db.profile.findUnique({
      where: {
        userId_experienceId: {
          userId: context.params.userId,
          experienceId: experienceId,
        },
      },
    })

    if (!profile) {
      return ApiResponse.notFound('Profile')
    }

    return ApiResponse.success({
      id: profile.id,
      userId: profile.userId,
      experienceId: profile.experienceId,
      role: profile.role,
      data: profile.data,
      isComplete: profile.isComplete,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    })
  } catch (error) {
    console.error('Get profile error:', error)
    return ApiResponse.error('Internal server error', 500)
  }
}

/**
 * Update user profile
 * PATCH /api/profile/[userId]
 */
export async function PATCH(
  request: NextRequest,
  context: { params: { userId: string } }
) {
  try {
    const body = await request.json()
    const { experienceId, data, isComplete } = body

    if (!experienceId) {
      return ApiResponse.error('experienceId is required', 400)
    }

    // Handle authentication
    const authCheck = await handleAuth(request, experienceId)
    if (!authCheck.success) {
      return authCheck.response
    }

    const { auth } = authCheck

    // Verify the user is updating their own profile
    if (auth.userId !== context.params.userId) {
      return ApiResponse.forbidden('You can only update your own profile')
    }

    // Update the profile
    const profile = await db.profile.update({
      where: {
        userId_experienceId: {
          userId: context.params.userId,
          experienceId: experienceId,
        },
      },
      data: {
        data: data,
        isComplete: isComplete !== undefined ? isComplete : undefined,
        updatedAt: new Date(),
      },
    })

    return ApiResponse.success({
      id: profile.id,
      role: profile.role,
      isComplete: profile.isComplete,
      message: 'Profile updated successfully'
    })
  } catch (error) {
    console.error('Update profile error:', error)
    return ApiResponse.error('Internal server error', 500)
  }
}