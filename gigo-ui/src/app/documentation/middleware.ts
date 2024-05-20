import {NextURL} from "next/dist/server/web/next-url";

export function handleDocumentationRedirect(url: NextURL): {url: NextURL, redirect: boolean} {
    // extract the path from the url
    const path = url.pathname;

    // handle empty documentation path
    let redirect = false;
    if (path === "/documentation" || path === "/documentation/") {
        url.pathname = "/documentation/introduction/intro.md"
        redirect = true
    }
    return {url, redirect}
}
