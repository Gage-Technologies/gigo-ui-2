import { NextRequest, NextResponse } from 'next/server'
import {NextURL} from "next/dist/server/web/next-url";

export function handleDocumentationRedirect(url: NextURL): NextResponse | null {
    // extract the path from the url
    const path = url.pathname;

    // handle empty documentation path
    if (path === "/documentation" || path === "/documentation/") {
        url.pathname = "/documentation/introduction/intro.md"
        return NextResponse.redirect(url)
    }
    return null
}
