import * as React from "react";
import {
    Box,
    CssBaseline,
} from "@mui/material";

import AboutPageSwitch from "@/components/Pages/About/AboutPageSwitch";
import PremiumDescription from "@/app/premium/page";

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
                <PremiumDescription />
            </Box>
        </CssBaseline>
    );
}

export default About;