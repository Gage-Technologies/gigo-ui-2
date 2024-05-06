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
import HeartIcon from '@/icons/GIGO/Heart';
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
        url(${config.rootPath + "/cloudstore/images/gigo-landing-valentines.webp"})
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

const GIGOLandingPageValentines: React.FC = () => {
    const query = useSearchParams();
    const leftOpen = query.get('menu') === 'true';
    const rightOpen = query.get('chat') === 'true';
    const [hearts, setHearts] = useState<string[]>([]);
    const endRef = useRef<HTMLDivElement | null>(null);

    // Define the move animation
    useEffect(() => {
        // Generate unique keyframes for each heart
        setHearts(Array.from({length: 30}, (_, index) => {
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

    const heartsMemo = useMemo(() => {
        return (
            <>
                <style>
                    {hearts.join(' ')}
                </style>
                {hearts.map((_, index) => {
                    let size = Math.max(Math.random() * 12, 5);
                    return (
                        <LazyLoad once scroll unmountIfInvisible key={index}>
                            <HeartIcon
                                key={index}
                                sx={{
                                    color: "pink",
                                    position: 'absolute',
                                    width: `${size}px`,
                                    height: `${size}px`,
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    animation: `move_${index} ${Math.max(Math.random() * 120, 15)}s ease-in-out infinite`,
                                }}
                            />
                        </LazyLoad>
                    )
                })}
            </>
        )
    }, [hearts])

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
                {hearts.length > 0 && heartsMemo}
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
                            backgroundColor: theme.palette.primary.main + "50",
                            // highlight on hover
                            '&:hover': {
                                backgroundColor: theme.palette.primary.main + "99",
                            }
                        }}
                        href="/journey"
                        // onClick={() => {
                        //     if (endRef.current) {
                        //         endRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' });
                        //     }
                        // }}
                    >
                        Fall In Love With GIGO
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

export default GIGOLandingPageValentines;
