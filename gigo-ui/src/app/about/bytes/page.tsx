import * as React from "react";
import {
    Box,
    CssBaseline,
} from "@mui/material";
import AboutBytes from "@/components/Pages/About/AboutPageBytes";

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
                <AboutBytes/>
            </Box>
        </CssBaseline>
    );
}

export default About;