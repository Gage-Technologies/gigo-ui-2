import * as React from "react";
import {
    Box, Button,
    createTheme,
    CssBaseline,
    Grid, IconButton,
    PaletteMode, Tab, Tabs,
    ThemeProvider, Tooltip,
    Typography
} from "@mui/material";
import {theme} from "@/theme";
import AboutPageJourney from "@/components/Pages/About/AboutPageJourney";
import AboutBytes from "@/components/Pages/About/AboutPageBytes";
import PremiumDescription from "@/components/Pages/About/AboutPagePremium";
import AboutGIGO from "@/components/Pages/About/AboutPageGIGO";
import AboutPageJourneyMobile from "@/components/Pages/About/AboutPageJourneyMobile";
import {redirect, useRouter, useSearchParams} from "next/navigation";
import AboutPagePremium from "@/components/Pages/About/AboutPagePremium";
import AboutPageSwitch from "@/components/Pages/About/AboutPageSwitch";

function About() {
    return (
        <CssBaseline>
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                zIndex: 99,
                flexDirection: "column"
            }}>
                <AboutPageSwitch/>
                {/*<AboutPagePremium />*/}
            </Box>
        </CssBaseline>
    );
}

export default About;