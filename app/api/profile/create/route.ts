import { NextRequest, NextResponse } from 'next/server'
import { handleAuth, ApiResponse, validateRequiredFields } from '@/lib/api-utils'
import { db } from '@/lib/db'
import { Role } from '@prisma/client'
import { z } from 'zod'

const createProfileSchema = z.object({
  userId: z.string(),
  experienceId: z.string(),
  role: z.enum(['FOUNDER', 'INVESTOR']),
  data: z.record(z.string(), z.any()),
  isComplete: z.boolean().default(false)
})

/**
 * Create or update user profile
 * POST /api/profile/create
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    const validatedData = createProfileSchema.parse(body)

    // Handle authentication using middleware or direct verification
    const authCheck = await handleAuth(request, validatedData.experienceId)
    if (!authCheck.success) {
      return authCheck.response
    }

    const { auth } = authCheck

    // Verify the user is creating their own profile
    if (auth.userId !== validatedData.userId) {
      return ApiResponse.forbidden('You can only create your own profile')
    }

    // Create or update the profile
    const profile = await db.profile.upsert({
      where: {
        userId_experienceId: {
          userId: validatedData.userId,
          experienceId: validatedData.experienceId,
        },
      },
      update: {
        role: validatedData.role as Role,
        data: validatedData.data,
        isComplete: validatedData.isComplete,
        updatedAt: new Date(),
      },
      create: {
        userId: validatedData.userId,
        experienceId: validatedData.experienceId,
        role: validatedData.role as Role,
        data: validatedData.data,
        isComplete: validatedData.isComplete,
      },
    })

    return ApiResponse.success({
      id: profile.id,
      role: profile.role,
      isComplete: profile.isComplete,
      message: validatedData.isComplete ? 'Profile created successfully!' : 'Profile saved as draft'
    })
  } catch (error) {
    console.error('Profile creation error:', error)
    
    if (error instanceof z.ZodError) {
      return ApiResponse.error('Invalid profile data', 400, error.issues)
    }

    return ApiResponse.error('Internal server error', 500)
  }
}