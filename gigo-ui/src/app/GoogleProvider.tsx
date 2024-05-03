'use client'
import React, { useRef } from 'react'
import config from "@/config";
import {GoogleOAuthProvider} from "@react-oauth/google";


export default function GoogleProvider({
                                          children
                                      }: {
    children: React.ReactNode
}) {

    return (

        <GoogleOAuthProvider clientId={config.googleClient}>
            {children}
        </GoogleOAuthProvider>
    )
}