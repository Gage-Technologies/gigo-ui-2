'use client'
import {createTheme, PaletteMode} from "@mui/material";
import type * as CSS from 'csstype';

export enum Holiday {
    Halloween = "Halloween",
    NewYears = "New Years",
    Christmas = "Christmas",
    Valentines = "Valentines",
    Easter = "Easter",
    Independence = "Independence"
}

function createFontFamily(fontFamily: CSS.Property.FontFamily) {
    return {
        h1: {
            fontFamily: fontFamily,
            fontStyle: "normal",
            fontWeight: 600,
            fontSize: "72px",
            lineHeight: "95px",
            textTransform: "capitalize" as CSS.Property.TextTransform
        },
        h2: {
            fontFamily: fontFamily,
            fontStyle: "normal",
            fontWeight: 600,
            fontSize: "64px",
            lineHeight: "120%",
            textTransform: "capitalize" as CSS.Property.TextTransform
        },
        h3: {
            fontFamily: fontFamily,
            fontStyle: "normal",
            fontWeight: 600,
            fontSize: "48px",
            lineHeight: "72px",
            textTransform: "capitalize" as CSS.Property.TextTransform
        },
        h4: {
            fontFamily: fontFamily,
            fontStyle: "normal",
            fontWeight: 600,
            fontSize: "36px",
            lineHeight: "54px",
            textTransform: "capitalize" as CSS.Property.TextTransform
        },
        h5: {
            fontFamily: fontFamily,
            fontStyle: "normal",
            fontWeight: 600,
            fontSize: "28px",
            lineHeight: "42px",
            textTransform: "capitalize" as CSS.Property.TextTransform
        },
        h6: {
            fontFamily: fontFamily,
            fontStyle: "normal",
            fontWeight: 600,
            fontSize: "16px",
            lineHeight: "22px",
            textTransform: "capitalize" as CSS.Property.TextTransform
        },
        subtitle1: {
            fontFamily: fontFamily,
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "22px",
            lineHeight: "33px",
            textTransform: "capitalize" as CSS.Property.TextTransform
        },
        subtitle2: {
            fontFamily: fontFamily,
            fontStyle: "normal",
            fontWeight: 500,
            fontSize: "18px",
            lineHeight: "27px",
            textTransform: "uppercase" as CSS.Property.TextTransform
        },
        body1: {
            fontFamily: fontFamily,
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: "18px",
            lineHeight: "27px",
            textAlign: "left" as CSS.Property.TextAlign
        },
        body2: {
            fontFamily: fontFamily,
            fontStyle: "normal",
            fontWeight: 300,
            fontSize: "14px",
            lineHeight: "20px",
            textAlign: "left" as CSS.Property.TextAlign
        },
        button: {
            fontFamily: fontFamily,
            fontStyle: "normal",
            fontWeight: 600,
            fontSize: "16px",
            lineHeight: "24px",
            textTransform: "capitalize" as CSS.Property.TextTransform
        },
        caption: {
            fontFamily: fontFamily,
            fontStyle: "normal",
            fontWeight: 500,
            fontSize: "12px",
            lineHeight: "18px",
        },
        overline: {fontFamily},
        // fontFamily: { fontFamily }
    };
}

export const baseColors = [
    "#3D8EF7",
    "#29C18C",
    "#84E8A2",
    "#FFFCAB",
    "#1c1c1a",
    // "#0C0513",
    // "#363636",
    "#9B9B9B",
    "#1D1D1B"
]

export const getDesignTokens = (mode: PaletteMode) => ({
    palette: {
        mode,
        primary: {
            light: '#84E8A2',
            main: '#29C18C',
            dark: '#1c8762',
            contrastText: '#fff',
        },
        secondary: {
            light: '#63a4f8',
            main: '#3D8EF7',
            dark: '#2a63ac',
            contrastText: '#fff',
        },
        tertiary: {
            light: '#fffcbb',
            main: '#FFFCAB',
            dark: '#ffef62',
            contrastText: '#1c1c1a',
        },
        divider: "#2a63ac",
        background: {
            default: "#1c1c1a",
            codeEditorSide: "#70809010",
            paper: "#1c1c1a",
            codeEditor: '#18181b',
            card: '#282826',
            chat: '#131312',
            avatar: '#272727'
        },
        background2: {
            default: "#70809010"
        },
        text: {
            primary: "#fff",
            secondary: "#9B9B9B",
            codeEditor: "#fff"
        },
    },
    typography: createFontFamily("Poppins"),
    shape: {
        borderRadius: 10
    }
});


export const getHalloweenTokens = (mode: PaletteMode) => ({
    palette: {
        mode,
        ...(mode === 'light'
                ? {
                    // palette values for light mode
                    primary: {
                        light: '#84E8A2',
                        main: 'rgb(44,33,52)',
                        dark: '#1c8762',
                        contrastText: '#feefc8',
                    },
                    secondary: {
                        light: '#63a4f8',
                        main: '#3D8EF7',
                        dark: '#2a63ac',
                        contrastText: '#fff',
                    },
                    tertiary: {
                        light: '#fffcbb',
                        main: '#FFFCAB',
                        dark: '#ffef62',
                        contrastText: '#1c1c1a',
                    },
                    divider: "#2a63ac",
                    background: {
                        default: "#feefc8",
                        codeEditorSide: "#feefc8",
                        paper: "#feefc8",
                        codeEditor: "#feefc8",
                        card: '#feefc8',
                        chat: '#feefc8'
                    },
                    background2: {
                        default: "#feefc8"
                    },
                    text: {
                        primary: "#be5000",
                        secondary: "#ff6e1b",
                        codeEditor: "#1D1D1B"
                    }
                }
                :
                {
                    primary: {
                        light: '#63a4f8',
                        main: '#b74c0a',
                        dark: '#ff6e1b',
                        contrastText: '#feefc8',
                    },
                    secondary: {
                        light: '#84E8A2',
                        main: '#29C18C',
                        dark: '#1c8762',
                        contrastText: '#feefc8',
                    },
                    tertiary: {
                        light: '#fffcbb',
                        main: '#FFFCAB',
                        dark: '#ffef62',
                        contrastText: '#1c1c1a',
                    },
                    divider: "#2a63ac",
                    background: {
                        default: "#120d17",
                        codeEditorSide: "#70809010",
                        paper: "#261b31",
                        codeEditor: '#261b31',
                        card: '#1e1826',
                        chat: '#1e1826'
                    },
                    background2: {
                        default: "#70809010"
                    },
                    text: {
                        primary: "#feefc8",
                        secondary: "#b2a898",
                        codeEditor: "#feefc8"
                    },
                }
        ),
    },
    typography: createFontFamily("Poppins"),
    shape: {
        borderRadius: 10
    }
});


export const getChristmasTokens = (mode: PaletteMode) => ({
    palette: {
        mode,
        ...(mode === 'light'
                ? {
                    // palette values for light mode
                    primary: {
                        light: '#84E8A2',
                        main: '#cff8ff',
                        dark: '#4a7785',
                        contrastText: '#6acbf5',
                    },
                    secondary: {
                        light: '#63a4f8',
                        main: '#3D8EF7',
                        dark: '#2a63ac',
                        contrastText: '#fff',
                    },
                    tertiary: {
                        light: '#fffcbb',
                        main: '#FFFCAB',
                        dark: '#ffef62',
                        contrastText: '#1c1c1a',
                    },
                    divider: "#2a63ac",
                    background: {
                        default: "#94d3e8",
                        codeEditorSide: "#79bbd0",
                        paper: "#79bbd0",
                        codeEditor: "#79bbd0",
                        card: '#79bbd0',
                        chat: '#79bbd0'
                    },
                    background2: {
                        default: "#c19d3c"
                    },
                    text: {
                        primary: "#006f94",
                        secondary: "#73aabd",
                        codeEditor: "#1D1D1B"
                    }
                }
                :
                {
                    primary: {
                        light: '#63a4f8',
                        main: '#d9ffe4',
                        dark: '#770202',
                        contrastText: '#000000',
                    },
                    secondary: {
                        light: '#84E8A2',
                        main: '#29C18C',
                        dark: '#1c8762',
                        contrastText: '#225e6e',
                    },
                    tertiary: {
                        light: '#fffcbb',
                        main: '#FFFCAB',
                        dark: '#ffef62',
                        contrastText: '#1c1c1a',
                    },
                    divider: "#2a63ac",
                    background: {
                        default: "#3d0000",
                        codeEditorSide: "#70809010",
                        paper: '#880205',
                        codeEditor: '#ff7f7f',
                        card: '#1e1826',
                        chat: '#1e1826'
                    },
                    background2: {
                        default: "#70809010"
                    },
                    text: {
                        primary: "#ffffff",
                        secondary: "#b2a898",
                        codeEditor: "#c19d3c"
                    },
                }
        ),
    },
    typography: createFontFamily("Poppins"),
    shape: {
        borderRadius: 10
    }
});

export const getNewYearsTokens = (mode: PaletteMode) => ({
    palette: {
        mode,
        ...(mode === 'light'
                ? {
                    // palette values for light mode
                    primary: {
                        light: '#84E8A2',
                        main: '#00172e',
                        dark: '#0d3d72',
                        contrastText: '#d59b31',
                    },
                    secondary: {
                        light: '#63a4f8',
                        main: '#3D8EF7',
                        dark: '#2a63ac',
                        contrastText: '#fff',
                    },
                    tertiary: {
                        light: '#fffcbb',
                        main: '#FFFCAB',
                        dark: '#ffef62',
                        contrastText: '#1c1c1a',
                    },
                    divider: "#2a63ac",
                    background: {
                        default: "#f8f0da",
                        codeEditorSide: "#feefc8",
                        paper: "#feefc8",
                        codeEditor: "#feefc8",
                        card: '#feefc8',
                        chat: '#feefc8'
                    },
                    background2: {
                        default: "#feefc8"
                    },
                    text: {
                        primary: "#030f44",
                        secondary: "#121b44",
                        codeEditor: "#1D1D1B"
                    }
                }
                :
                {
                    primary: {
                        light: '#63a4f8',
                        main: '#deaf44',
                        dark: '#b98400',
                        contrastText: '#feefc8',
                    },
                    secondary: {
                        light: '#84E8A2',
                        main: '#29C18C',
                        dark: '#1c8762',
                        contrastText: '#feefc8',
                    },
                    tertiary: {
                        light: '#fffcbb',
                        main: '#FFFCAB',
                        dark: '#ffef62',
                        contrastText: '#1c1c1a',
                    },
                    divider: "#2a63ac",
                    background: {
                        default: "#00172e",
                        codeEditorSide: "#70809010",
                        paper: "#002d54",
                        codeEditor: '#261b31',
                        card: '#1e1826',
                        chat: '#1e1826'
                    },
                    background2: {
                        default: "#70809010"
                    },
                    text: {
                        primary: "#feefc8",
                        secondary: "#b2a898",
                        codeEditor: "#feefc8"
                    },
                }
        ),
    },
    typography: createFontFamily("Poppins"),
    shape: {
        borderRadius: 10
    }
});

export const getValentinesTokens = (mode: PaletteMode) => ({
    palette: {
        mode,
        ...(mode === 'light'
                ? {
                    // palette values for light mode
                    primary: {
                        light: '#f19b9e',
                        main: '#ff3b3f',
                        dark: '#8f1012',
                        contrastText: '#ffffff',
                    },
                    secondary: {
                        light: '#63a4f8',
                        main: '#3D8EF7',
                        dark: '#2a63ac',
                        contrastText: '#fff',
                    },
                    tertiary: {
                        light: '#fffcbb',
                        main: '#FFFCAB',
                        dark: '#ffef62',
                        contrastText: '#1c1c1a',
                    },
                    divider: "#2a63ac",
                    background: {
                        default: "#f6d4d8",
                        codeEditorSide: "#c19d3c",
                        paper: "#f19b9e",
                        codeEditor: "#c19d3c",
                        card: '#c19d3c',
                        chat: '#c19d3c'
                    },
                    background2: {
                        default: "#c19d3c"
                    },
                    text: {
                        primary: "#720a0b",
                        secondary: "#cb5156",
                        codeEditor: "#1D1D1B"
                    }
                }
                :
                {
                    primary: {
                        light: '#ff74ac',
                        main: '#f19b9e',
                        dark: '#ff3f8d',
                        contrastText: '#ffffff',
                    },
                    secondary: {
                        light: '#84E8A2',
                        main: '#29C18C',
                        dark: '#1c8762',
                        contrastText: '#225e6e',
                    },
                    tertiary: {
                        light: '#fffcbb',
                        main: '#FFFCAB',
                        dark: '#ffef62',
                        contrastText: '#1c1c1a',
                    },
                    divider: "#2a63ac",
                    background: {
                        default: "#671d3e",
                        codeEditorSide: "#70809010",
                        paper: '#6c334a',
                        codeEditor: '#ff7f7f',
                        card: '#1e1826',
                        chat: '#1e1826'
                    },
                    background2: {
                        default: "#70809010"
                    },
                    text: {
                        primary: "#ffffff",
                        secondary: "#b2a898",
                        codeEditor: "#c19d3c"
                    },
                }
        ),
    },
    typography: createFontFamily("Poppins"),
    shape: {
        borderRadius: 10
    }
});

export const getEasterTokens = (mode: PaletteMode) => ({
    palette: {
        mode,
        ...(mode === 'light'
                ? {
                    // palette values for light mode
                    primary: {
                        light: '#f19b9e',
                        main: '#a9d57c',
                        dark: '#e38eb1',
                        contrastText: '#ffffff',
                    },
                    secondary: {
                        light: '#63a4f8',
                        main: '#3D8EF7',
                        dark: '#2a63ac',
                        contrastText: '#fff',
                    },
                    tertiary: {
                        light: '#fffcbb',
                        main: '#FFFCAB',
                        dark: '#ffef62',
                        contrastText: '#1c1c1a',
                    },
                    divider: "#2a63ac",
                    background: {
                        default: "#fffab0",
                        codeEditorSide: "#c19d3c",
                        paper: "#fff9ce",
                        codeEditor: "#c19d3c",
                        card: '#c19d3c',
                        chat: '#c19d3c'
                    },
                    background2: {
                        default: "#c19d3c"
                    },
                    text: {
                        primary: "#337b98",
                        secondary: "#51a0cb",
                        codeEditor: "#1D1D1B"
                    }
                }
                :
                {
                    primary: {
                        light: '#63a4f8',
                        main: 'rgba(204,52,190,0.4)',
                        dark: '#f6b8d2',
                        contrastText: '#f6ecab',
                    },
                    secondary: {
                        light: '#84E8A2',
                        main: '#29C18C',
                        dark: '#1c8762',
                        contrastText: '#225e6e',
                    },
                    tertiary: {
                        light: '#fffcbb',
                        main: '#FFFCAB',
                        dark: '#ffef62',
                        contrastText: '#1c1c1a',
                    },
                    divider: "#2a63ac",
                    background: {
                        default: "#7fab87",
                        codeEditorSide: "#70809010",
                        paper: '#9fd5a9',
                        codeEditor: '#ff7f7f',
                        card: '#1e1826',
                        chat: '#1e1826'
                    },
                    background2: {
                        default: "#70809010"
                    },
                    text: {
                        primary: "#f6ecab",
                        secondary: "#f6ecab",
                        codeEditor: "#c19d3c"
                    },
                }
        ),
    },
    typography: createFontFamily("Poppins"),
    shape: {
        borderRadius: 10
    }
});

export const getIndependenceTokens = (mode: PaletteMode) => ({
    palette: {
        mode,
        ...(mode === 'light'
                ? {
                    // palette values for light mode
                    primary: {
                        light: '#ffffff',
                        main: '#ff0000',
                        dark: '#00d2fc',
                        contrastText: '#1f3867',
                    },
                    secondary: {
                        light: '#63a4f8',
                        main: '#3D8EF7',
                        dark: '#2a63ac',
                        contrastText: '#fff',
                    },
                    tertiary: {
                        light: '#fffcbb',
                        main: '#FFFCAB',
                        dark: '#ffef62',
                        contrastText: '#1c1c1a',
                    },
                    divider: "#2a63ac",
                    background: {
                        default: "#ffffff",
                        codeEditorSide: "#c19d3c",
                        paper: "#dbecf5",
                        codeEditor: "#c19d3c",
                        card: '#c19d3c',
                        chat: '#c19d3c'
                    },
                    background2: {
                        default: "#c19d3c"
                    },
                    text: {
                        primary: "#337b98",
                        secondary: "#51a0cb",
                        codeEditor: "#1D1D1B"
                    },
                }
                :
                {
                    primary: {
                        light: '#63a4f8',
                        main: 'rgb(255,0,0)',
                        dark: '#f6b8d2',
                        contrastText: '#1f3867',
                    },
                    secondary: {
                        light: '#84E8A2',
                        main: '#29C18C',
                        dark: '#1c8762',
                        contrastText: '#225e6e',
                    },
                    tertiary: {
                        light: '#fffcbb',
                        main: '#FFFCAB',
                        dark: '#ffef62',
                        contrastText: '#1c1c1a',
                    },
                    divider: "#2a63ac",
                    background: {
                        default: "#0d0d21",
                        codeEditorSide: "#70809010",
                        paper: '#1b1b41',
                        codeEditor: '#ff7f7f',
                        card: '#1e1826',
                        chat: '#1e1826'
                    },
                    background2: {
                        default: "#70809010"
                    },
                    text: {
                        primary: "#ffffff",
                        secondary: "#ff0000",
                        codeEditor: "#c19d3c"
                    }
                }
        ),
    },
    typography: createFontFamily("Poppins"),
    shape: {
        borderRadius: 10
    }
});

export const isHoliday = (): Holiday | null => {
    const today = new Date();

    if (today.getMonth() === 9) {
        // Halloween
        return Holiday.Halloween
    }

    if ((today.getMonth() === 11 && today.getDate() >= 26) || (today.getMonth() === 0 && today.getDate() <= 2)) {
        // New Years
        return Holiday.NewYears
    }

    if (today.getMonth() === 11) {
        // Christmas
        return Holiday.Christmas
    }

    if (today.getMonth() === 1 && today.getDate() < 14) {
        // Valentines
        return Holiday.Valentines
    }

    let easterMonth = gaussEaster(today.getFullYear());
     // Set Easter Range Each Year
     if (today.getMonth() === easterMonth){
         // Easter
         return Holiday.Easter
     }

    if ((today.getMonth() === 6 && today.getDate() >= 1) && (today.getMonth() === 6 && today.getDate() <= 7)) {
        // Independence
        return Holiday.Independence
    }
    
    return null
}

export const getAllTokens = (mode: PaletteMode) => {
    const holiday = isHoliday()

    if (holiday === Holiday.Halloween) {
        return getHalloweenTokens(mode);
    }

    if (holiday === Holiday.NewYears) {
        return getNewYearsTokens(mode);
    }

    if (holiday === Holiday.Christmas) {
        return getChristmasTokens(mode);
    }

    if (holiday === Holiday.Valentines) {
        return getValentinesTokens(mode);
    }

     // if (holiday === Holiday.Easter) {
     //     return getEasterTokens(mode);
     // }

    if (holiday === Holiday.Independence) {
        return getIndependenceTokens(mode)
    }

    return getDesignTokens(mode);
}

function gaussEaster(Y: any) {
    let A, B, C, P, Q, M, N, D, E;

    // All calculations done
    // on the basis of
    // Gauss Easter Algorithm
    A = Y % 19;
    B = Y % 4;
    C = Y % 7;
    P = Math.floor(Y / 100.0);

    Q = Math.floor((13 + 8 * P) / 25.0);
    M = Math.floor(15 - Q + P - Math.floor(P / 4)) % 30;
    N = Math.floor(4 + P - Math.floor(P / 4)) % 7;
    D = Math.floor(19 * A + M) % 30;
    E = Math.floor(2 * B + 4 * C + 6 * D + N) % 7;

    let days = Math.floor(22 + D + E);

    // A corner case,
    // when D is 29
    if ((D === 29) && (E === 6)) {
        return 3;
    }
        // Another corner case,
    // when D is 28
    else if ((D === 28) && (E === 6)) {
        process.stdout.write(Y + "-04-18");
        return 3;
    } else {
        // If days > 31, move to April
        // April = 4th Month
        if (days > 31) {
            return 3;
        } else {
            // Otherwise, stay on March
            // March = 3rd Month
            return 2;
        }
    }
}

export const themeHelpers = {
    frostedGlass: {
        backdropFilter: "blur(15px)",
        "-webkit-backdrop-filter": "blur(15px)",
        border: "1px solid rgba(255,255,255,0.18)",
        backgroundColor: "rgba(19,19,19,0.31)"
    },
    blur: {
        backdropFilter: "blur(15px)",
        "-webkit-backdrop-filter": "blur(15px)",
        border: "1px solid rgba(255,255,255,0.18)",
    },
    MoreTransparentFrostedGlass: {
        backdropFilter: "blur(15px)",
        "-webkit-backdrop-filter": "blur(15px)",
        border: "1px solid rgba(255,255,255,0.25)",
        backgroundColor: "rgba(255,255,255,0.2)",
    },
    frostedHalloween: {
        backdropFilter: "blur(15px)",
        "-webkit-backdrop-filter": "blur(15px)",
        border: "1px solid rgba(255,255,255,0.18)",
        backgroundColor: "rgba(118,4,255,1)",
    },
}

export const theme = createTheme(getDesignTokens('dark'));
export const holiday = isHoliday();