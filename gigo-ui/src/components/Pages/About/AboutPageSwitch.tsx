import * as React from "react";
import {
    Box, Button,
} from "@mui/material";

function AboutPageSwitch() {
    return (
        <Box sx={{display: "flex", justifyContent: "space-evenly", p:1}}>
            <Button variant='outlined' href="/about">
                GIGO
            </Button>
            <Button variant='outlined' href="/about/premium">
                Premium
            </Button>
            <Button variant='outlined' href="/about/journey">
                Journey
            </Button>
            <Button variant='outlined' href="/about/bytes">
                Bytes
            </Button>
        </Box>
    );
}

export default AboutPageSwitch;