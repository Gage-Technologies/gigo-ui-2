'use client'
import React, {useRef} from 'react';
import {Box, Button, Link, Typography} from '@mui/material';
import {styled} from '@mui/system';

import {theme, themeHelpers} from '@/theme';
// @ts-ignore
import {SocialIcon} from 'react-social-icons/component';
import 'react-social-icons/discord'
import GigoCircleIcon from '@/icons/GIGO/GigoCircleLogo';
import Snowfall from 'react-snowfall';
import {useSearchParams} from "next/navigation";
import config from "@/config";


// Hero container with jungle-themed background
const HeroContainer = styled(Box)(({theme}) => ({
    position: 'relative',
    height: '100vh',
    width: '100vw', // Adjust for the sidebar width
    marginLeft: 0,
    marginRight: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: `
        url(${config.rootPath + "/cloudstore/images/gigo-landing-christmas.webp"})
    `,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    overflow: 'hidden',
}));

const HeroContent = styled(Box)({
    position: 'relative',
    textAlign: 'center',
    width: "fit-content",
    zIndex: 100,
    color: '#fff',
    borderRadius: "10px",
    padding: "20px",
    ...themeHelpers.frostedGlass,
    backgroundColor: "#1D1D1D25"
});


const GIGOLandingPageChristmas: React.FC = () => {
    const query = useSearchParams();
    const leftOpen = query.get('menu') === 'true';
    const rightOpen = query.get('chat') === 'true';
    const endRef = useRef<HTMLDivElement | null>(null);

    let width = '100vw'
    let widthSub = 0;
    if (leftOpen) {
        widthSub += 200
    }
    if (rightOpen) {
        widthSub += 300
    }
    if (widthSub > 0) {
        width = `calc(100vw - ${widthSub}px)`
    }

    return (
        <>
            <HeroContainer sx={{width: width}}>
                <Snowfall/>
                <HeroContent>
                    <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <GigoCircleIcon sx={{
                            height: '90px',
                            width: '90px',
                            marginRight: "20px",
                            marginBottom: "20px",
                            color: "white"
                        }}/>
                        <Typography variant="h3" gutterBottom>
                            Welcome to GIGO
                        </Typography>
                    </Box>
                    <Typography variant="h5" gutterBottom sx={{maxWidth: "40vw"}}>
                        GIGO is the best place to learn how to code
                    </Typography>
                    <Typography variant="body1" gutterBottom sx={{maxWidth: "40vw"}}>
                        Built by self-taught developers, GIGO focuses on aligning learning with the real world of
                        development.
                        Code in the cloud, work on real projects, and learn the latest technologies from any device,
                        even a tablet!
                        Click Start Your Journey to start learning now!
                    </Typography>
                    <Button
                        variant="outlined"
                        color="primary"
                        sx={{
                            mt: 2,
                            color: "white",
                            backgroundColor: theme.palette.error.main + "50",
                            borderColor: theme.palette.error.main,
                            // highlight on hover
                            '&:hover': {
                                backgroundColor: theme.palette.error.main + "99",
                                borderColor: theme.palette.error.main,
                            }
                        }}
                        href="/journey"
                        // onClick={() => {
                        //     if (endRef.current) {
                        //         endRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' });
                        //     }
                        // }}
                    >
                        Explore The North Pole
                    </Button>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mt: 2
                    }}>
                        <Link variant="caption" href="https://discord.gg/279hECYrfX" gutterBottom color="#ffffff"
                              target="_blank"> {/* Change typography variant */}
                            Join us on Discord!
                        </Link>
                        <SocialIcon
                            network="discord"
                            url="https://discord.gg/279hECYrfX"
                            bgColor={"transparent"}
                            fgColor={theme.palette.mode === 'dark' ? "white" : "black"}
                            target="_blank"
                            style={{
                                height: "32px",
                                width: "32px",
                                marginBottom: "5px"
                            }}
                        />
                    </Box>
                </HeroContent>
            </HeroContainer>
            <div ref={endRef} id="end-landing"/>
        </>
    );
};

export default GIGOLandingPageChristmas;
