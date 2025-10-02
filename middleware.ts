import { NextRequest, NextResponse } from 'next/server'
import { verifyUserAccess, createAuthErrorResponse } from './lib/auth'

/**
 * Next.js middleware for Whop authentication and access control
 * This middleware runs on all requests to protected routes and validates:
 * 1. JWT token from x-whop-user-token header
 * 2. User access to the specific experience
 * 3. Access level (admin, customer, no_access)
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files, API routes that don't need auth, and public routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/webhooks') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/assets') ||
    pathname === '/'
  ) {
    return NextResponse.next()
  }

  // Extract experienceId from the URL path
  // Expected format: /experiences/[experienceId]/...
  const experienceMatch = pathname.match(/^\/experiences\/([^\/]+)/)
  
  if (!experienceMatch) {
    // If not an experience route, allow through (for dashboard, etc.)
    return NextResponse.next()
  }

  const experienceId = experienceMatch[1]

  try {
    // Verify user authentication and experience access
    const authResult = await verifyUserAccess(request, experienceId)

    // Handle authentication errors
    if ('error' in authResult) {
      // For API routes, return JSON error response
      if (pathname.startsWith('/api/')) {
        return createAuthErrorResponse(authResult)
      }

      // For page routes, redirect to appropriate error page or show access denied
      if (authResult.status === 401) {
        // Unauthorized - invalid or missing token
        return new NextResponse(
          `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Authentication Required</title>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style>
                body { 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  margin: 0;
                  background: #f8fafc;
                }
                .container {
                  text-align: center;
                  padding: 2rem;
                  background: white;
                  border-radius: 8px;
                  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                  max-width: 400px;
                }
                h1 { color: #dc2626; margin-bottom: 1rem; }
                p { color: #64748b; margin-bottom: 1.5rem; }
                .button {
                  display: inline-block;
                  padding: 0.75rem 1.5rem;
                  background: #3b82f6;
                  color: white;
                  text-decoration: none;
                  border-radius: 6px;
                  font-weight: 500;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Authentication Required</h1>
                <p>You need to be logged in to access this experience.</p>
                <a href="/" class="button">Return to Home</a>
              </div>
            </body>
          </html>
          `,
          {
            status: 401,
            headers: {
              'Content-Type': 'text/html',
            },
          }
        )
      }

      if (authResult.status === 403) {
        // Forbidden - no access to experience
        return new NextResponse(
          `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Access Denied</title>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style>
                body { 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  margin: 0;
                  background: #f8fafc;
                }
                .container {
                  text-align: center;
                  padding: 2rem;
                  background: white;
                  border-radius: 8px;
                  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                  max-width: 400px;
                }
                h1 { color: #dc2626; margin-bottom: 1rem; }
                p { color: #64748b; margin-bottom: 1.5rem; }
                .button {
                  display: inline-block;
                  padding: 0.75rem 1.5rem;
                  background: #3b82f6;
                  color: white;
                  text-decoration: none;
                  border-radius: 6px;
                  font-weight: 500;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Access Denied</h1>
                <p>You do not have access to this experience.</p>
                <a href="/" class="button">Return to Home</a>
              </div>
            </body>
          </html>
          `,
          {
            status: 403,
            headers: {
              'Content-Type': 'text/html',
            },
          }
        )
      }
    }

    // Authentication successful - add user info to headers for downstream use
    const response = NextResponse.next()
    
    // Add user information to request headers for use in components and API routes
    // We know authResult is not an error at this point since we handled errors above
    if ('userId' in authResult) {
      response.headers.set('x-user-id', authResult.userId)
      response.headers.set('x-access-level', authResult.accessLevel)
      response.headers.set('x-has-access', authResult.hasAccess.toString())
      response.headers.set('x-experience-id', experienceId)
    }

    return response

  } catch (error) {
    console.error('Middleware error:', error)
    
    // For API routes, return JSON error
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }

    // For page routes, show error page
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Server Error</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: #f8fafc;
            }
            .container {
              text-align: center;
              padding: 2rem;
              background: white;
              border-radius: 8px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              max-width: 400px;
            }
            h1 { color: #dc2626; margin-bottom: 1rem; }
            p { color: #64748b; margin-bottom: 1.5rem; }
            .button {
              display: inline-block;
              padding: 0.75rem 1.5rem;
              background: #3b82f6;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 500;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Server Error</h1>
            <p>Something went wrong. Please try again later.</p>
            <a href="/" class="button">Return to Home</a>
          </div>
        </body>
      </html>
      `,
      {
        status: 500,
        headers: {
          'Content-Type': 'text/html',
        },
      }
    )
  }
}

/**
 * Configure which routes the middleware should run on
 * This middleware will run on:
 * - All experience routes (/experiences/*)
 * - All API routes except webhooks (/api/* except /api/webhooks/*)
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (public assets)
     * - api/webhooks (webhook endpoints that don't need auth)
     */
    '/((?!_next/static|_next/image|favicon.ico|assets).*)',
    '/api/((?!webhooks).*)',
  ],
}