import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Button, Typography, Box, PaletteMode, createTheme, Link } from '@mui/material';
import { styled } from '@mui/system';
import Image from 'next/image';

import backgroundImageWebP from "@/img/landing/gigo-landing-mobile.webp";
import { getAllTokens, themeHelpers } from '@/theme';
import LazyLoad from 'react-lazyload';
import { SocialIcon } from 'react-social-icons';
import GigoCircleIcon from '@/icons/GIGO/GigoCircleLogo';

// Responsive Hero container for mobile
const HeroContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    height: 'calc(100vh - 56px)', // Account for mobile status bars/navigation
    width: '100vw',
    display: 'flex',
    flexDirection: 'column', // Layout direction for mobile
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
}));

const HeroContent = styled(Box)({
    position: 'relative',
    textAlign: 'center',
    width: "90vw",
    zIndex: 999,
    color: '#fff',
    borderRadius: "10px",
    padding: "10px",
    ...themeHelpers.frostedGlass,
    backgroundColor: "#1D1D1D25",
    marginTop: 'auto',
    marginBottom: 'auto'
});

const GIGOLandingPageMobile: React.FC = () => {
    let userPref = localStorage.getItem('theme');
    const [mode, _] = React.useState<PaletteMode>(userPref === 'light' ? 'light' : 'dark');
    const theme = React.useMemo(() => createTheme(getAllTokens(mode)), [mode]);

    const [fireflies, setFireflies] = useState<string[]>([]);
    const endRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setFireflies(Array.from({ length: 15 }, (_, index) => {
            let moveX = Math.random() * window.innerWidth * (Math.random() > .5 ? -1 : 1);
            while (Math.abs(moveX) < 100) {
                moveX = Math.random() * window.innerWidth * (Math.random() > .5 ? -1 : 1);
            }
            let moveY = Math.random() * window.innerHeight * (Math.random() > .5 ? -1 : 1);
            while (Math.abs(moveY) < 100) {
                moveY = Math.random() * window.innerHeight * (Math.random() > .5 ? -1 : 1);
            }

            return `
                @keyframes move_${index} {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(${moveX}px, ${moveY}px); }
                }
            `;
        }));
    }, []);

    const glowAnimation = `
        @keyframes glow {
            0%, 100% { box-shadow: 0 0 8px 2px #FFFCAB; }
            50% { box-shadow: 0 0 14px 5px #FFFCAB; }
        }
    `;

    const fireflyMemo = useMemo(() => {
        return (
            <>
                <style>
                    {fireflies.join(' ')}
                    {glowAnimation}
                </style>
                {fireflies.map((_, index) => (
                    <LazyLoad key={index} once scroll unmountIfInvisible>
                        <Box
                            className="firefly"
                            sx={{
                                position: 'absolute',
                                borderRadius: '50%',
                                width: `${Math.max(Math.random() * 12, 5)}px`,
                                height: `${Math.max(Math.random() * 12, 5)}px`,
                                background: "#FFFCAB",
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animation: `move_${index} ${Math.max(Math.random() * 120, 15)}s ease-in-out infinite, glow 3s ease-in-out infinite`,
                            }}
                        />
                    </LazyLoad>
                ))}
            </>
        )
    }, [fireflies]);

    return (
        <>
            <HeroContainer>
                <Image
                    src={backgroundImageWebP}
                    alt="Mobile landing background"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                    priority={true}
                />
                {fireflyMemo}
                <HeroContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <GigoCircleIcon sx={{ height: '60px', width: '60px', color: "#fff" }}/>
                        <Typography variant="h4" gutterBottom>
                            Welcome to GIGO
                        </Typography>
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ maxWidth: "80vw" }}>
                        GIGO is the best place to learn how to code
                    </Typography>
                    <Typography variant="body2" gutterBottom sx={{ maxWidth: "80vw" }}>
                        Code in the cloud, learn from thousands of lessons, and work with the latest technologies from any machine, even a tablet!
                        Built by self-taught developers, GIGO focuses on aligning learning with the real world of development.
                        Click Start Your Journey to start learning now!
                    </Typography>
                    <Button
                        variant="outlined"
                        color="primary"
                        sx={{
                            mt: 2,
                            color: "white",
                            backgroundColor: theme.palette.primary.main + "50",
                            '&:hover': {
                                backgroundColor: theme.palette.primary.main + "99",
                            }
                        }}
                        href="/journey/main"
                    >
                        Start Your Journey
                    </Button>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                        <Link variant="caption" href="https://discord.gg/279hECYrfX" gutterBottom color="#ffffff" target="_blank">
                            Join us on Discord!
                        </Link>
                        <SocialIcon
                            network="discord"
                            url="https://discord.gg/279hECYrfX"
                            bgColor={"transparent"}
                            fgColor={mode === 'dark' ? "white" : "black"}
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

export default GIGOLandingPageMobile;
