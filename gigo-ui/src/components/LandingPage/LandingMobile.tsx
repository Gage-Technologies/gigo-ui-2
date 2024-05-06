'use client'
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Box, Button, Link, Typography} from '@mui/material';
import {styled} from '@mui/system';

import {theme, themeHelpers} from '@/theme';
import LazyLoad from 'react-lazyload';
// @ts-ignore
import {SocialIcon} from 'react-social-icons/component';
import 'react-social-icons/discord'
import GigoCircleIcon from '@/icons/GIGO/GigoCircleLogo';
import config from "@/config";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

// Responsive Hero container for mobile
const HeroContainer = styled(Box)(({theme}) => ({
    position: 'relative',
    height: 'calc(100vh - 56px)',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column', // Change to column for mobile
    alignItems: 'center',
    justifyContent: 'flex-start', // Change alignment for mobile
    backgroundImage: `url(${config.rootPath + "/cloudstore/images/gigo-landing-mobile.webp"})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    overflow: 'hidden',
}));

const HeroContent = styled(Box)({
    position: 'relative',
    textAlign: 'center',
    width: "90vw", // Adjust width for mobile
    zIndex: 100,
    color: '#fff',
    borderRadius: "10px",
    padding: "10px", // Adjust padding for mobile
    ...themeHelpers.frostedGlass,
    backgroundColor: "#1d1d1d50",
    marginTop: 'auto', // Adjust margin for mobile layout
    marginBottom: 'auto'
});

const GIGOLandingPageMobile: React.FC = () => {
    const [fireflies, setFireflies] = useState<string[]>([]);
    const endRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setFireflies(Array.from({length: 15}, (_, index) => {
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
                {fireflies.map((_, index) => {
                    let size = Math.max(Math.random() * 12, 5)
                    return (
                        <LazyLoad key={index} once scroll unmountIfInvisible>
                            <Box
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
                    )
                })}
            </>
        )
    }, [fireflies]);

    return (
        <>
            <HeroContainer>
                {fireflies.length > 0 && fireflyMemo}
                <HeroContent>
                    <Box
                        sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                        <GigoCircleIcon sx={{height: '60px', width: '60px', color: "#fff"}}/>
                        <Typography variant="h4" gutterBottom> {/* Change typography variant */}
                            Welcome to GIGO
                        </Typography>
                    </Box>
                    <Typography variant="h6" gutterBottom
                                sx={{maxWidth: "80vw"}}> {/* Change typography variant and max width */}
                        Learn to code for free with thousands of lessons!
                    </Typography>
                    <Typography variant="body2" gutterBottom
                                sx={{maxWidth: "80vw"}}> {/* Change typography variant and max width */}
                        Code in the cloud, learn from thousands of lessons, and work with the latest technologies from
                        any device, even a tablet!
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
                        href="/journey"
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
                              target="_blank"> {/* Change typography variant */}
                            Join us on Discord!
                        </Link>
                        <SocialIcon
                            network="discord"
                            url="https://discord.gg/279hECYrfX"
                            bgColor={"transparent"}
                            fgColor={theme.palette.mode === 'dark' ? "white" : "black"}
                            style={{
                                height: "32px",
                                width: "32px",
                                marginBottom: "5px"
                            }}
                        />
                    </Box>
                    <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <Link variant="caption" href="/about" gutterBottom
                              color="#ffffff"> {/* Change typography variant */}
                            Learn more about GIGO
                        </Link>
                        <InfoOutlinedIcon style={{fontSize: "18px", marginBottom: "5px", marginLeft: "5px"}}/>
                    </Box>
                </HeroContent>
            </HeroContainer>
            <div ref={endRef} id="end-landing"/>
        </>
    );
};

export default GIGOLandingPageMobile;
