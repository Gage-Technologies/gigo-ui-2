'use client'
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Box, Button, Link, Typography} from '@mui/material';
import {styled} from '@mui/system';
import Image from 'next/image';

import backgroundImageWebP from "@/img/landing/gigo-landing.webp";
import {useAppSelector} from '@/reducers/hooks';
import {selectAppWrapperChatOpen, selectAppWrapperSidebarOpen} from '@/reducers/appWrapper/appWrapper';
import {theme, themeHelpers} from '@/theme';
import LazyLoad from 'react-lazyload';
import {SocialIcon} from 'react-social-icons';
import GigoCircleIcon from '@/icons/GIGO/GigoCircleLogo';


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

const GIGOLandingPage: React.FC = () => {
    const [fireflies, setFireflies] = useState<string[]>([]);
    const leftOpen = useAppSelector(selectAppWrapperSidebarOpen);
    const rightOpen = useAppSelector(selectAppWrapperChatOpen);
    const endRef = useRef<HTMLDivElement | null>(null);

    // Define the move animation
    useEffect(() => {
        // Generate unique keyframes for each firefly
        setFireflies(Array.from({length: 30}, (_, index) => {
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

    // Define the glow animation
    const glowAnimation = `
        @keyframes glow {
            0%, 100% { box-shadow: 0 0 8px 2px #FFFCAB; }
            50% { box-shadow: 0 0 14px 5px #FFFCAB; }
        }
    `;

    const fireflyMemo = useMemo(() => {
        return (
            <>
                <style suppressHydrationWarning>
                    {fireflies.join(' ')}
                    {glowAnimation}
                </style>
                {fireflies.map((_, index) => {
                    let size = Math.max(Math.random() * 12, 5);
                    return (
                        <LazyLoad key={index} once scroll unmountIfInvisible>
                            <Box
                                key={index}
                                className="firefly"
                                sx={{
                                    position: 'absolute',
                                    borderRadius: '50%',
                                    width: `${size}px`,
                                    height: `${size}px`,
                                    background: "#FFFCAB",
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    animation: `move_${index} ${Math.max(Math.random() * 120, 15)}s ease-in-out infinite, glow 3s ease-in-out infinite`,
                                }}
                            />
                        </LazyLoad>
                    );
                })}
            </>
        )
    }, [fireflies]);

    let width: string;
    let widthSub = 0;
    if (leftOpen) {
        widthSub += 200;
    }
    if (rightOpen) {
        widthSub += 300;
    }
    width = widthSub > 0 ? `calc(100vw - ${widthSub}px)` : '100vw';

    return (
        <>
            <HeroContainer sx={{width}}>
                <Image
                    src={backgroundImageWebP}
                    alt="Landing background"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                    priority={true}
                />
                {fireflies.length > 0 && fireflyMemo}
                <HeroContent>
                    <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <GigoCircleIcon sx={{
                            height: '90px',
                            width: '90px',
                            marginRight: "20px",
                            marginBottom: "20px",
                            color: "#208562"
                        }}/>
                        <Typography variant="h3" gutterBottom>
                            Welcome to GIGO
                        </Typography>
                    </Box>
                    <Typography variant="h5" gutterBottom sx={{maxWidth: "40vw"}}>
                        GIGO is the best place to learn how to code
                    </Typography>
                    <Typography variant="body1" gutterBottom sx={{maxWidth: "40vw"}}>
                        Code in the cloud, learn from thousands of lessons, and work with the latest technologies from
                        any machine, even a tablet!
                        Built by self-taught developers, GIGO focuses on aligning learning with the real world of
                        development.
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
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mt: 2
                    }}>
                        <Link variant="caption" href="https://discord.gg/279hECYrfX" gutterBottom color="#ffffff"
                              target="_blank">
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

export default GIGOLandingPage;
