import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest, event: NextFetchEvent) {
  const token = await getToken({ req });
  const isAuthenticated = !!token;
  console.log("🚀 ~ middleware ~ isAuthenticated:", isAuthenticated)

  // If the user is authenticated and trying to access / or /login, redirect to /dashboard
  if (isAuthenticated && (req.nextUrl.pathname === "/signin" || req.nextUrl.pathname === "/signup")) {
    const rootUrl = new URL("/", req.url);
    rootUrl.search = ""; // Clear query parameters
    return NextResponse.redirect(rootUrl);
  }

  // If the user is not authenticated and trying to access /dashboard or /login, continue with authentication middleware
  if (!isAuthenticated && req.nextUrl.pathname !== "/signup" && req.nextUrl.pathname !== "/signin") {
    const authMiddleware = await withAuth({
      pages: {
        signIn: `/signin`,
      },
    });

    // @ts-expect-error
    return authMiddleware(req, event);
  }

  // For other routes, continue processing the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/signin',
    '/signup'
  ],
};

// import { NextResponse } from 'next/server'
// import { NextRequestWithAuth, withAuth } from 'next-auth/middleware'
// import { verify } from 'jsonwebtoken'

// const verifyToken = (token: string): boolean => {
//   try {
//     verify(token, process.env.JWT_SECRET!)
//     return true
//   } catch {
//     return false
//   }
// }

// // Define NextAuth internal and public routes to skip middleware checks
// const publicRoutes = [
//   '/api/auth/signin',
//   '/api/auth/session',
//   '/api/auth/callback',
//   '/api/signin',
// ]

// export default withAuth(
//   function middleware(request: NextRequestWithAuth) {
//     const { pathname } = request.nextUrl
//     const isApiRoute = pathname.startsWith('/api/')
//     console.log("🚀 ~ middleware ~ isApiRoute:", isApiRoute)

//     // Skip checks for public routes
//     if (publicRoutes.includes(pathname)) {
//       return NextResponse.next()
//     }

//     // API Route Handling: Respond with 401 Unauthorized if no valid token
//     if (isApiRoute) {
//       const authHeader = request.headers.get('authorization')
//       if (authHeader?.startsWith('Bearer ')) {
//         const token = authHeader.split(' ')[1]
//         console.log("🚀 ~ middleware ~ token:", token)
//         return NextResponse.next()
//         // if (verifyToken(token)) {
//         //   return NextResponse.next()
//         // }
//       }
//       return new NextResponse(
//         JSON.stringify({ message: 'Unauthorized' }),
//         { status: 401, headers: { 'content-type': 'application/json' } }
//       )
//     }

//     // Page Route Handling: Redirect to /signin if not authenticated
//     console.log("🚀 ~ middleware ~ request.nextauth.token:", request.nextauth.token)
//     if (!request.nextauth.token) {
//       return NextResponse.redirect(new URL('/signin', request.url))
//     }

//     return NextResponse.next()
//   },
//   // {
//   //   callbacks: {
//   //     authorized: ({ token }) => !!token,
//   //   },
//   // }
// )

// export const config = {
//   matcher: ['/','/category','/api/categories'],
// }
