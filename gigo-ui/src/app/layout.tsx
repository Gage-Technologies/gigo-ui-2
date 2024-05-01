import 'typeface-poppins';
import "./home/globals.css";
import {AppRouterCacheProvider} from '@mui/material-nextjs/v13-appRouter';
import {ThemeProvider} from '@mui/material/styles';
import {defaultTheme} from "@/theme";
import StoreProvider from "@/app/StoreProvider";
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import {WebSocketProvider} from "@/services/websocket";
import {CtWebSocketProvider} from "@/services/ct_websocket";

export default function Layout({
                                   children,
                               }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <head>
        <meta charSet="utf-8"/>
        <link rel="icon" href="%PUBLIC_URL%/favicon.ico"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="theme-color" content="#29C18C"/>
        <meta name="title" content="GIGO Dev - Learn to Code with Interactive Challenges"/>
        <meta name="description"
              content="GIGO is a fully integrated learn-to-code platform. Gigo provides cloud development environments, interactive coding challenges, and access to a global community of developers. Join now and start coding!"/>
        <meta name="keywords" content="coding, programming, learning, challenges, developers, cloud development"/>
        <meta property="og:title" content="GIGO Dev - Learn to Code with Interactive Challenges"/>
        <meta property="og:description"
              content="GIGO is a fully integrated learn-to-code platform. Gigo provides cloud development environments, interactive coding challenges, and access to a global community of developers. Join now and start coding!"/>
        <meta property="og:image" content="%PUBLIC_URL%/logo192.png"/>
        <meta property="og:url" content="https://gigo.dev"/>
        <meta property="og:type" content="website"/>
        <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png"/>
        <link rel="canonical" href="https://gigo.dev"/>
        <link rel="manifest" href="%PUBLIC_URL%/manifest.json"/>
        <title>GIGO Dev</title>
        </head>

        <body>
        <AppRouterCacheProvider>
            <StoreProvider>
                <WebSocketProvider>
                    <CtWebSocketProvider>
                        <ThemeProvider theme={defaultTheme}>
                            <AppWrapper>
                                {children}
                            </AppWrapper>
                        </ThemeProvider>
                    </CtWebSocketProvider>
                </WebSocketProvider>
            </StoreProvider>
        </AppRouterCacheProvider>
        </body>
        </html>
    );
}
