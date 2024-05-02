import { NextRequest, NextResponse, userAgent } from 'next/server'
import {handleDocumentationRedirect} from "@/app/documentation/middleware";

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}

export function middleware(request: NextRequest) {
    const url = request.nextUrl

    // handle middleware for documentation path
    let docOut = handleDocumentationRedirect(url)
    if (docOut) {
        return docOut
    }

    // Handle device redirects
    const { device } = userAgent(request)
    const viewport = device.type === 'mobile' ? 'mobile' : 'desktop'
    let redirecting = false;
    if (url.searchParams.get('viewport') !== viewport) {
        url.searchParams.set('viewport', viewport)
        redirecting = true
    }
    if (redirecting) {
        return NextResponse.redirect(url)
    }
    ////

    return NextResponse.next()
}