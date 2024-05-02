import 'typeface-poppins';
import "./home/globals.css";
import {AppRouterCacheProvider} from '@mui/material-nextjs/v13-appRouter';
import {ThemeProvider} from '@mui/material/styles';
import {defaultTheme} from "@/theme";
import StoreProvider from "@/app/StoreProvider";
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import {WebSocketProvider} from "@/services/websocket";
import {CtWebSocketProvider} from "@/services/ct_websocket";
import type { Metadata, Viewport } from 'next'
import React from "react";
import {CssBaseline} from "@mui/material";

export const metadata: Metadata = {
    applicationName: 'GIGO Dev',
    title: 'GIGO Dev - Learn to Code with Interactive Challenges',
    description: 'GIGO is a fully integrated learn-to-code platform. Gigo provides cloud development environments, interactive coding challenges, and access to a global community of developers. Join now and start coding!',
    keywords: ['coding', 'programming', 'learning', 'challenges', 'developers', 'cloud development'],
    openGraph: {
        title: 'GIGO Dev - Learn to Code with Interactive Challenges',
        description: 'GIGO is a fully integrated learn-to-code platform. Gigo provides cloud development environments, interactive coding challenges, and access to a global community of developers. Join now and start coding!',
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
        <html lang="en">
        <body>
        <AppRouterCacheProvider>
            <StoreProvider>
                <WebSocketProvider>
                    <CtWebSocketProvider>
                        <ThemeProvider theme={defaultTheme}>
                            <CssBaseline>
                                <AppWrapper>
                                    {children}
                                </AppWrapper>
                            </CssBaseline>
                        </ThemeProvider>
                    </CtWebSocketProvider>
                </WebSocketProvider>
            </StoreProvider>
        </AppRouterCacheProvider>
        </body>
        </html>
    );
}
