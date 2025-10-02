import { NextRequest, NextResponse } from 'next/server'
import { verifyUserAccess, createAuthErrorResponse, requireAccess } from '@/lib/auth'
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

    // Verify user authentication and access
    const authResult = await verifyUserAccess(request, validatedData.experienceId)

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

    // Verify the user is creating their own profile
    if (authResult.userId !== validatedData.userId) {
      return NextResponse.json(
        { error: 'You can only create your own profile' },
        { status: 403 }
      )
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

    return NextResponse.json({
      success: true,
      data: {
        id: profile.id,
        role: profile.role,
        isComplete: profile.isComplete,
        message: validatedData.isComplete ? 'Profile created successfully!' : 'Profile saved as draft'
      },
    })
  } catch (error) {
    console.error('Profile creation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid profile data',
          details: error.issues 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}