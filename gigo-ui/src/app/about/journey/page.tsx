import * as React from "react";
import {
    Box,
    CssBaseline,
} from "@mui/material";
import AboutPageJourney from "@/components/Pages/About/AboutPageJourney";
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
                {/*<AboutPageJourney />*/}
            </Box>
        </CssBaseline>
    );
}

export default About;