import {decodeToken} from "react-jwt";
import {RequestCookie} from "next/dist/compiled/@edge-runtime/cookies";
import {cookies} from "next/headers";
import {ReadonlyRequestCookies} from "next/dist/server/web/spec-extension/adapters/request-cookies";

/**
 * Returns a promise that when awaited sleeps for the specified time in millis
 * @param millis time in millis to sleep
 */
export async function sleep(millis: number) {
    return new Promise<void>(resolve => setTimeout(resolve, millis));
}

export async function createHash(input: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
     // convert Bytes to hex string
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function simpleHash(input: string) {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash.toString();
}

export function checkSessionStatus(sessionCookie: RequestCookie | undefined): boolean {
    if (sessionCookie === undefined) {
        return false;
    }

    let decodedToken: {exp: number} | null = decodeToken(sessionCookie.value);
    if (decodedToken === null || decodedToken === undefined) {
        return false;
    }

    let expires = new Date(decodedToken.exp * 1000);
    return expires.getTime() >= Date.now();
}

export function getSessionCookies(cookies: ReadonlyRequestCookies): string {
    let cookieHeader = `gigoAuthToken=${cookies.get('gigoAuthToken')?.value || ''}`;
    if (cookies.get('gigo-session-affinity') !== null) {
        cookieHeader += `;gigo-session-affinity=${cookies.get('gigo-session-affinity')?.value || ''}`;
    }
    return cookieHeader;
}

export function constructAuthorizationHeader(username: string, password: string) {
    return "Basic " + Buffer.from(username + ":" + password).toString("base64");
}
