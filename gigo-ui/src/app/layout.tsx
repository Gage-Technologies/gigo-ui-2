import 'typeface-poppins';
import "./home/globals.css";
import {AppRouterCacheProvider} from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import {defaultTheme} from "@/theme";
import StoreProvider from "@/app/StoreProvider";

export default function Layout({
                                   children,
                               }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>
            <AppRouterCacheProvider>
                <ThemeProvider theme={defaultTheme}>
                    <StoreProvider>
                        {children}
                    </StoreProvider>
                </ThemeProvider>
            </AppRouterCacheProvider>
        </body>
        </html>
    );
}
