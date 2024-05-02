'use client'
import React, { useRef } from 'react';
import { Button, Typography, Box, PaletteMode, createTheme, Link } from '@mui/material';
import { styled } from '@mui/system';

import backgroundImageWebP from "@/img/landing/gigo-landing-new-years.webp"
import backgroundImageLargeWebP from "@/img/landing/gigo-landing-new-years-large.webp"
import { useAppSelector } from '@/reducers/hooks';
import { selectAppWrapperChatOpen, selectAppWrapperSidebarOpen } from '@/reducers/appWrapper/appWrapper';
import { getAllTokens, themeHelpers } from '@/theme';
import { SocialIcon } from 'react-social-icons';
import GigoCircleIcon from '@/icons/GIGO/GigoCircleLogo';
import Confetti from "react-confetti";


// Hero container with jungle-themed background
const HeroContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    height: '100vh',
    width: '100vw', // Adjust for the sidebar width
    marginLeft: 0,
    marginRight: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: `
        url(${window.innerWidth > 2000 ? backgroundImageLargeWebP : backgroundImageWebP})
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


const GIGOLandingPageNewYears: React.FC = () => {
    // retrieve theme from local storage
    let userPref = localStorage.getItem('theme')
    const [mode, _] = React.useState<PaletteMode>(userPref === 'light' ? 'light' : 'dark');
    const theme = React.useMemo(() => createTheme(getAllTokens(mode)), [mode]);

    const leftOpen = useAppSelector(selectAppWrapperSidebarOpen)
    const rightOpen = useAppSelector(selectAppWrapperChatOpen)
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
            <HeroContainer sx={{ width: width }}>
                <Confetti gravity={0.035} numberOfPieces={100} wind={0.001} colors={['#ad7832', '#dcb468', '#716c6c', '#8e8888']} friction={1} />
                <HeroContent>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <GigoCircleIcon sx={{ height: '90px', width: '90px', marginRight: "20px", marginBottom: "20px", color: "white" }}/>
                        <Typography variant="h3" gutterBottom>
                            Welcome to GIGO
                        </Typography>
                    </Box>
                    <Typography variant="h5" gutterBottom sx={{ maxWidth: "40vw" }}>
                        GIGO is the best place to learn how to code
                    </Typography>
                    <Typography variant="body1" gutterBottom sx={{ maxWidth: "40vw" }}>
                        Built by self-taught developers, GIGO focuses on aligning learning with the real world of development.
                        Code in the cloud, work on real projects, and learn the latest technologies from any machine, even a tablet!
                        Click Start Your Journey to start learning now!
                    </Typography>
                    <Button
                        variant="outlined"
                        color="primary"
                        sx={{
                            mt: 2,
                            color: "white",
                            backgroundColor: theme.palette.primary.main + "50",
                            borderColor: theme.palette.primary.main,
                            // highlight on hover
                            '&:hover': {
                                backgroundColor: theme.palette.primary.main + "99",
                                borderColor: theme.palette.primary.main,
                            }
                        }}
                        href="/journey/main"
                        // onClick={() => {
                        //     if (endRef.current) {
                        //         endRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' });
                        //     }
                        // }}
                    >
                        Explore The New Year
                    </Button>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                        <Link variant="caption" href="https://discord.gg/279hECYrfX" gutterBottom color="#ffffff" target="_blank" > {/* Change typography variant */}
                            Join us on Discord!
                        </Link>
                        <SocialIcon
                            network="discord"
                            url="https://discord.gg/279hECYrfX"
                            bgColor={"transparent"}
                            fgColor={mode === 'dark' ? "white" : "black"}
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
            <div ref={endRef} id="end-landing" />
        </>
    );
};

export default GIGOLandingPageNewYears;
