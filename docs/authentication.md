# Authentication Middleware Documentation

## Overview

The Whop authentication middleware provides automatic JWT token verification and experience access validation for all protected routes in the application. It runs on every request to `/experiences/*` and `/api/*` routes (except webhooks).

## How It Works

1. **Token Verification**: Extracts and verifies the JWT token from the `x-whop-user-token` header
2. **Experience Access**: Validates that the user has access to the specific experience
3. **Access Level**: Determines the user's access level (admin, customer, no_access)
4. **Header Injection**: Adds user information to request headers for downstream use

## Files Created/Modified

### Core Middleware
- `middleware.ts` - Main Next.js middleware file
- `lib/auth.ts` - Authentication utilities (enhanced)
- `lib/api-utils.ts` - API helper functions (enhanced)

### Helper Functions
- `lib/hooks/useAuth.ts` - Server component auth helpers
- `lib/contexts/AuthContext.tsx` - Client component auth context
- `app/api/auth/test/route.ts` - Test endpoint for auth verification

## Usage Examples

### In API Routes

```typescript
import { handleAuth, ApiResponse } from '@/lib/api-utils'

export async function POST(request: NextRequest) {
  // Handle authentication with middleware optimization
  const authCheck = await handleAuth(request, experienceId)
  if (!authCheck.success) {
    return authCheck.response
  }

  const { auth } = authCheck
  // Use auth.userId, auth.accessLevel, auth.hasAccess
}

// For admin-only endpoints
export async function DELETE(request: NextRequest) {
  const authCheck = await handleAuth(request, experienceId, { requireAdmin: true })
  if (!authCheck.success) {
    return authCheck.response
  }
}
```

### In Server Components

```typescript
import { getAuthHeaders } from '@/lib/hooks/useAuth'

export default async function MyPage() {
  const auth = await getAuthHeaders()
  
  if (!auth) {
    // This shouldn't happen due to middleware, but handle gracefully
    return <div>Authentication error</div>
  }

  // Use auth.userId, auth.accessLevel, auth.hasAccess
}
```

### In Client Components

```typescript
'use client'

import { AuthProvider, useAuth } from '@/lib/contexts/AuthContext'

// Wrap your app with AuthProvider
function App({ experienceId }: { experienceId: string }) {
  return (
    <AuthProvider experienceId={experienceId}>
      <MyComponent />
    </AuthProvider>
  )
}

// Use auth in components
function MyComponent() {
  const { user, isLoading, isAdmin, hasAccess } = useAuth()
  
  if (isLoading) return <div>Loading...</div>
  if (!hasAccess) return <div>No access</div>
  
  return <div>Welcome {user?.userId}</div>
}
```

### Protected Components

```typescript
import { withAuth } from '@/lib/contexts/AuthContext'

const AdminPanel = withAuth(
  function AdminPanel() {
    return <div>Admin only content</div>
  },
  { requireAdmin: true }
)
```

## Error Handling

The middleware handles different error scenarios:

- **401 Unauthorized**: Invalid or missing JWT token
- **403 Forbidden**: User lacks access to the experience
- **500 Internal Server Error**: Server-side authentication errors

For page routes, it returns HTML error pages. For API routes, it returns JSON error responses.

## Performance Optimization

The middleware adds user information to request headers, allowing API routes and server components to skip redundant authentication calls:

- Headers added: `x-user-id`, `x-access-level`, `x-has-access`, `x-experience-id`
- API utilities automatically use these headers when available
- Falls back to full authentication if headers are missing

## Testing

Use the test endpoint to verify authentication:

```bash
# Test basic auth
GET /api/auth/test?experienceId=exp_123

# Test admin auth
POST /api/auth/test?experienceId=exp_123
```

## Security Considerations

- All authentication happens server-side
- JWT tokens are verified using Whop SDK
- Experience access is validated for every request
- No sensitive data is exposed in client-side code
- Middleware runs before any application code

## Route Configuration

The middleware runs on:
- All `/experiences/*` routes
- All `/api/*` routes except `/api/webhooks/*`
- Excludes static files, images, and public assets

Configure in `middleware.ts` matcher if you need to modify which routes are protected.