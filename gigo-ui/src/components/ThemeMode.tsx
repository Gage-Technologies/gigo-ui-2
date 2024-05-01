import {useEffect, useState} from 'react';
import {createTheme, PaletteMode, Theme} from '@mui/material';

// This function will ensure that the theme mode is always valid
const getValidThemeMode = (mode: string | null): PaletteMode => {
    return (mode === 'light' || mode === 'dark') ? mode : 'dark';
};

const useThemeMode = (): Theme => {
    const [mode, setMode] = useState<PaletteMode>('dark'); // Default to 'dark'

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        const validThemeMode: PaletteMode = getValidThemeMode(storedTheme);
        setMode(validThemeMode);
    }, []);

    return createTheme({
        palette: {
            mode,
        },
    });
};

export default useThemeMode;
