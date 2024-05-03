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
    let url = request.nextUrl
    let redirect = false;

    // handle root redirect to home page
    if (url.pathname === "/") {
        url.pathname = "/home"
        redirect = true
    }

    // handle middleware for documentation path
    let docOut = handleDocumentationRedirect(url);
    if (docOut.redirect) {
        url = docOut.url
        redirect = true
    }

    // Handle device redirects
    const { device } = userAgent(request)
    const viewport = device.type === 'mobile' ? 'mobile' : 'desktop'
    if (url.searchParams.get('viewport') !== viewport) {
        url.searchParams.set('viewport', viewport)
        redirect = true
    }
    ////

    if (redirect) {
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}