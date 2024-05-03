import * as React from "react";
import {
    Box,
    CssBaseline,
} from "@mui/material";

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
                <AboutPagePremium />
            </Box>
        </CssBaseline>
    );
}

export default About;