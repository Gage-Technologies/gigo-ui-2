import 'typeface-poppins';
import "./home/globals.css";
import './global.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from "@/theme";
import StoreProvider from "@/app/StoreProvider";
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import { WebSocketProvider } from "@/services/websocket";
import { CtWebSocketProvider } from "@/services/ct_websocket";
import type { Metadata, Viewport } from 'next'
import React from "react";
import { CssBaseline } from "@mui/material";
import GoogleProvider from "@/app/GoogleProvider";
import WebTracking from '@/components/WebTracking';
import { GoogleAnalytics } from '@next/third-parties/google'
import Script from 'next/script';
import GoogleTranslateFix from '@/components/GTranslate/DOMMutationCatch'


export const metadata: Metadata = {
    metadataBase: new URL('https://www.gigo.dev'),
    applicationName: 'GIGO Dev',
    title: 'GIGO Dev - Learn to Code Fast',
    description: 'GIGO solves the problem we faced when learning to code: it\'s hard. Learn directly in your browser—no installation, no setup required. Get real-time help with GIGO\'s integrated learning assistant, Code Teacher.',
    keywords: ['coding', 'programming', 'learning', 'challenges', 'developers', 'cloud development'],
    openGraph: {
        title: 'GIGO Dev - Learn to Code Fast',
        description: 'GIGO solves the problem we faced when learning to code: it\'s hard. Learn directly in your browser—no installation, no setup required. Get real-time help with GIGO\'s integrated learning assistant, Code Teacher.',
        type: 'website',
        url: 'https://gigo.dev',
        images: [
            {
                url: 'https://gigo.dev/logo192.png',
                width: 192,
                height: 192,
                alt: 'GIGO Dev Logo',
            },
        ],
        siteName: 'GIGO Dev',
    },
    alternates: {
        canonical: './',
    }
}

export const viewport: Viewport = {
    themeColor: '#29C18C',
}

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html>
            <head>
                <Script
                    src="/assets/scripts/lang-config.js"
                    strategy="beforeInteractive"
                />
                <Script
                    src="/assets/scripts/translation.js"
                    strategy="beforeInteractive"
                />
                <Script
                    src="/assets/scripts/block-gtranslate-bar.js"
                    strategy="beforeInteractive"
                />
                <Script
                    src="//translate.google.com/translate_a/element.js?cb=TranslateInit"
                    strategy="afterInteractive"
                />
            </head>
            <body>
                <GoogleTranslateFix />
                <AppRouterCacheProvider>
                    <StoreProvider>
                        <WebSocketProvider>
                            <CtWebSocketProvider>
                                <GoogleProvider>
                                    <WebTracking>
                                        <ThemeProvider theme={theme}>
                                            <CssBaseline>
                                                <AppWrapper>
                                                    {children}
                                                </AppWrapper>
                                            </CssBaseline>
                                        </ThemeProvider>
                                    </WebTracking>
                                </GoogleProvider>
                            </CtWebSocketProvider>
                        </WebSocketProvider>
                    </StoreProvider>
                </AppRouterCacheProvider>
            </body>
            <GoogleAnalytics gaId="G-38KBFJZ6M6" />
        </html>
    );
}
