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
