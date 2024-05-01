import { CacheProvider, ThemeProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { CssBaseline } from '@mui/material';
import { ReactNode } from 'react';
import { Theme } from '@mui/material/styles';

const cache = createCache({ key: 'css' });

interface ThemeRegistryProps {
    children: ReactNode;
    theme: Theme;
}

function ThemeRegistry({ children, theme }: ThemeRegistryProps) {
    return (
        <CacheProvider value={cache}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </CacheProvider>
    );
}

export default ThemeRegistry;
