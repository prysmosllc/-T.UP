import { NextRequest, NextResponse } from 'next/server'
import { verifyUserAccess, createAuthErrorResponse, requireAccess } from '@/lib/auth'
import { put } from '@vercel/blob'

/**
 * Upload file using Whop's Upload media feature
 * POST /api/upload
 */
export async function POST(request: NextRequest) {
  try {
    // Get experienceId from query parameters or form data
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

    // Get the uploaded file from form data
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type and size
    const allowedTypes = [
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, PPT, and PPTX files are allowed.' },
        { status: 400 }
      )
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    try {
      // Convert File to Buffer for Vercel Blob
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Upload using Vercel Blob storage
      const blob = await put(file.name, buffer, {
        access: 'public',
        contentType: file.type,
      })

      if (!blob || !blob.url) {
        throw new Error('Upload failed: No URL returned')
      }

      return NextResponse.json({
        success: true,
        data: {
          url: blob.url,
          filename: file.name,
          size: file.size,
          type: file.type,
          message: 'File uploaded successfully'
        },
      })
    } catch (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload file. Please try again.' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}