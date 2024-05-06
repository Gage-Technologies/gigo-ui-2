import { NextRequest, NextResponse, userAgent } from 'next/server'
import {handleDocumentationRedirect} from "@/app/documentation/middleware";
import {decodeToken} from "react-jwt";

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
    let cookie = request.cookies.get("gigoAuthToken");
    if (cookie) {
        let decodedToken: any = decodeToken(cookie?.value || "");
        if (!decodedToken) {
            // clear the token and redirect to login
            request.cookies.delete("gigoAuthToken");
            return NextResponse.redirect(url);
        }

        let exp: number | undefined = decodedToken["exp"];
        if (!exp || exp * 1000 < Date.now()) {
            // clear the token and redirect to login
            request.cookies.delete("gigoAuthToken");
            return NextResponse.redirect(url);
        }
    }

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

    // handle overwrite of chat state for logged out users
    if (url.searchParams.get("chat") === "true" && !cookie) {
        console.log("overwriting chat state for logged out user");
        url.searchParams.delete("chat");
        redirect = true;
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