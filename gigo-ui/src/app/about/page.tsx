import * as React from "react";
import {
    Box,
    CssBaseline,
} from "@mui/material";
import AboutGIGO from "@/components/Pages/About/AboutPageGIGO";
import AboutPageSwitch from "@/components/Pages/About/AboutPageSwitch";

function About() {
    return (
        <CssBaseline>
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                zIndex: 99,
                flexDirection: "column",
            }}>
                <AboutPageSwitch/>
                <AboutGIGO />
            </Box>
        </CssBaseline>
    );
}

export default About;