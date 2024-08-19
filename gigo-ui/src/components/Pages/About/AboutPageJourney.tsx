'use client'
import React, {useEffect, useState} from 'react';
import JourneyAboutPageIcon from "@/icons/Journey/JourneyAboutPageIcon";
import {theme} from "@/theme";
import JourneyPageCampIcon from "@/icons/Journey/JourneyPageCampIcon";
import {Grid} from "@mui/material";
import JourneyPagePumpIcon from "@/icons/Journey/JourneyPagePumpIcon";
import {AwesomeButton} from "react-awesome-button";
import {useSearchParams} from "next/navigation";
import {Box} from "@mui/material";
import AboutPageJourneyMobile from "@/components/Pages/About/AboutPageJourneyMobile";
import {fontSize} from "@mui/system";
import {useAppSelector} from "@/reducers/hooks";
import {selectAuthState} from "@/reducers/auth/auth";
import useIsMobile from "@/hooks/isMobile";

function AboutPageJourney() {
    const query = useSearchParams();
    const authState = useAppSelector(selectAuthState);
    const [sidebarOpen, setSidebarOpen] = React.useState(query.get("menu") === "true");
    const [chatOpen, setChatOpen] = React.useState(query.get("chat") === "true" && authState.authenticated);
    const isMobile = useIsMobile();

    const aspectRatio = useAspectRatio();

    const containerStyles: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: "#1c1c1a",
    };

    const [width, setWidth] = useState('100vw'); // default value
    const [left, setLeft] = useState('0%'); // default value


    useEffect(() => {
        const updateLeftOpen = () => {
            setSidebarOpen(query.get("menu") === "true");
        };

        const updateRightOpen = () => {
            setChatOpen(query.get("chat") === "true");
        };


        // Update leftOpen based on query parameter
        updateLeftOpen();
        updateRightOpen();

        const calculateWidth = () => {
            if (sidebarOpen) {
                return  '80vw';
            } else if (chatOpen) {
                return  '75vw';
            } else {
                return  '100vw';
            }
        };
        const calculateLeft = () => {
            if (sidebarOpen) {
                return  '15%';
            } else if (chatOpen) {
                return  '6%';
            } else {
                return  '0%';
            }
        };


        setWidth(calculateWidth());
        setLeft(calculateLeft());
    }, [query, sidebarOpen, chatOpen]);

    const iconContainerStyles: React.CSSProperties = {
        width:
            sidebarOpen
                ? 'calc(95vw - 15vw)'
                : chatOpen ? 'calc(95vw - 15vw)'
                    : '95vw',
        height: '90vh', // Set to 100% of viewport height
        position: 'relative',
        zIndex: 0,
    };


    const vignetteStyles: React.CSSProperties = {
        width:
            aspectRatio === "21:9" ?
                '100vw'
            :
                width,
            //     sidebarOpen
            //         ? 'calc(25w - 0vw)'
            //         : chatOpen ? 'calc(100vw - 0vw)'
            //             : '100vw',

        height: aspectRatio !== '21:9' ? '100vh' : '120vh',
        background: `radial-gradient(circle, rgba(0,0,0,0) 40%, ${hexToRGBA(theme.palette.background.default)} 70%, ${hexToRGBA(theme.palette.background.default)} 83%), 
                 linear-gradient(180deg, rgba(0,0,0,0) 51%, rgba(0,0,0,0) 52%, ${hexToRGBA(theme.palette.background.default)} 92%, ${hexToRGBA(theme.palette.background.default)} 100%),
                 linear-gradient(0deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 30%, ${hexToRGBA(theme.palette.background.default)} 100%, ${hexToRGBA(theme.palette.background.default)} 90%)`, // Vignette gradient
        position: 'absolute',
        left:  aspectRatio === "21:9" ?
            '0%'
            :
            left,
        bottom: (aspectRatio !== '21:9') && (sidebarOpen || chatOpen) ? '-3%' :
                    aspectRatio === '21:9' ? '-35%'
                        : '-15%',
        zIndex: 2, // Set a higher zIndex to appear above the SVG
    };



    const iconStyles: React.CSSProperties = {
        width: '95%',
        height: '110%',
    };

    const textStyles: React.CSSProperties = {
        position: 'absolute',
        top: '28%',
        left: '55%',
        transform: 'translate(-50%, -50%)',
        fontSize: '3vw',
        fontWeight: 'bold',
        color: '#e4c8b5',
        zIndex: 4,
        whiteSpace: 'nowrap',
    };

    const textStyles2: React.CSSProperties = {
        position: 'absolute',
        top: '28%',
        left: '55.3%',
        transform: 'translate(-50%, -50%)',
        fontSize: '3vw',
        fontWeight: 'bold',
        color: '#915d5d',
        zIndex: 3,
        whiteSpace: 'nowrap',
    };

    const [buttonHover, setButtonHover] = React.useState(false);

    const buttonShine: React.CSSProperties = {
        position: 'absolute',
        borderRadius: '50%',
        width: '10%',
        height: '10%',

        animation: 'shine 2s infinite linear',
    };

    const textBoxStyles: React.CSSProperties = {
        height: '130vh', // Set to 100% of viewport height
        padding: '20px', // Adds some padding around the text
        zIndex: 2, // Set a higher zIndex to appear above the SVG
        backgroundColor: theme.palette.background.default,
    }


    const buttonSize = aspectRatio === '21:9' ? '6vw' : '7vw';

    const buttonStyles: React.CSSProperties = {
        animation: 'godRays 5s infinite linear',
        backgroundRepeat: 'repeat',
        backgroundPosition: '50% 50%',
        marginTop: "2%",
        position: 'absolute',
        top: '37.6%',
        left: '55.8%',
        transform: 'translate(-50%, -50%)',
        width: buttonSize,
        height: buttonSize,

        backgroundColor: '#e9c6af',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#fff',
        boxShadow: buttonHover
            ? '0 0 20px 15px rgba(256, 256, 256, 0.5)'
            : '0 0 16px 13px rgba(256, 256, 256, 0.2)',
        borderRadius: '50%', // 50% border-radius to create a perfect circle
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center', // To center the text inside the circle
        overflow: 'hidden', // Hide the overflowing part of the shine effect
        zIndex: 3, // Set a higher zIndex to appear above the SVG
    };


    const finalButtonStyles: React.CSSProperties = {
        backgroundColor: buttonHover ? '#58cc02' : '#4da902', /* Duolingo green */
        color: 'white',
        border: 'none',
        borderRadius: '25px', /* Rounded corners */
        padding: '12px 24px', /* Padding for aesthetics */
        fontSize: '16px',
        cursor: 'pointer', /* Pointer cursor on hover */
        transition: 'background-color 0.3s ease' /* Transition effect */
    };

    const contentStyles: React.CSSProperties = {
        flex: '1',
        overflowY: 'scroll',
        backgroundColor: theme.palette.background.default,
    };

    const renderDesktop = () => {
        return (
            <div style={containerStyles}>
                <div style={vignetteStyles}/>
                <JourneyAboutPageIcon style={iconStyles} aspectRatio={aspectRatio.toString()}/>
                <div style={textStyles}>Your Journey Starts Here</div>
                <div style={textStyles2}>Your Journey Starts Here</div>
                <button
                    style={buttonStyles}
                    onMouseEnter={() => setButtonHover(true)}
                    onMouseLeave={() => setButtonHover(false)}
                    onClick={() => window.location.href = '/journey'}
                >
                    <div style={buttonShine}/>
                    <p style={{fontSize: '1vw', margin: 0, padding: 0}}>Get Started</p>

                </button>
                <Box sx={{
                    display: "flex",
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 5
                }}>
                    <div style={{
                        fontFamily: 'Arial, sans-serif',
                        lineHeight: '1.5',
                        textAlign: 'left',
                        maxWidth: '80%'
                    }}>
                        <h1 style={{textAlign: 'center', zIndex: 4}}>GIGO Journey System</h1>
                        <br/>
                        <br/>
                        <Grid container style={{zIndex: 4}} spacing={0}>
                            <Grid item xs={6}>
                                <p>GIGO Journeys focus on delivering comprehensive programming education. The
                                    journey is structured to provide programmers of various skill levels with
                                    concise, well-defined, and efficient paths to enhance their programming
                                    expertise.</p>
                                <ol>
                                    <strong>Incremental Learning Path</strong>
                                    <p>For Entry-Level Programmers: The journey starts with the basics of
                                        programming. Entry-level participants engage in simple exercises and
                                        challenges that introduce fundamental concepts like variables, loops,
                                        and functions.</p>
                                    <p>For Experienced Programmers: Intermediate and advanced units are
                                        available. These include complex algorithms, design patterns, data
                                        structures, and specialized areas like machine learning or distributed
                                        systems.</p>
                                    <li>
                                        <strong>Bite-Sized Lessons</strong>
                                        <p>Lessons are broken down into manageable, easily digestible segments.
                                            This allows participants to learn at their own pace and facilitates
                                            understanding by focusing on one concept at a time.</p>
                                        <p>Practical examples and hands-on exercises are integrated within each
                                            lesson to ensure understanding and retention.</p>
                                    </li>
                                </ol>
                            </Grid>
                            <Grid item xs={6}>
                                <JourneyPageCampIcon style={iconStyles} aspectRatio={aspectRatio.toString()}/>
                            </Grid>

                        </Grid>
                        <Grid container spacing={0}>
                            <Grid item xs={11}>

                            </Grid>
                            <Grid item xs={6}>
                                <JourneyPagePumpIcon style={iconStyles} aspectRatio={aspectRatio.toString()}/>
                            </Grid>


                            <Grid item xs={6}>
                                <div style={{textAlign: 'left', justifyContent: 'center'}}>
                                    <h2>Curriculum</h2>
                                </div>
                                <p>The curriculum is designed with a wide array of programming languages and
                                    paradigms, allowing flexibility and personalization for each participant. It
                                    covers:</p>
                                <ul>
                                    <li>Fundamentals: Data types, control structures, error handling, etc.</li>
                                    <li>Intermediate Concepts: Object-oriented programming, APIs, databases,
                                        etc.
                                    </li>
                                    <li>Advanced Topics: Multi-threading, distributed computing, cloud-native
                                        technologies, etc.
                                    </li>
                                    <li>Specialized Paths: In-depth mastery in areas like machine learning,
                                        network programming, etc.
                                    </li>
                                </ul>


                                <h3>Code Teacher Tutor Support</h3>
                                <p>Never venture alone! Code Teacher helps students overcome obstacles and
                                    achieve success together.</p>
                            </Grid>
                            <Grid item xs={12}>
                                <br/>
                                <br/>

                            </Grid>
                            <Grid container xs={12} style={{justifyContent: "center", alignItems: "center"}}>
                                <AwesomeButton style={{
                                    width: "30%", height: "100%",
                                    '--button-primary-color': theme.palette.primary.main,
                                    '--button-primary-color-dark': theme.palette.primary.dark,
                                    '--button-primary-color-light': theme.palette.text.primary,
                                    '--button-primary-color-hover': theme.palette.primary.main,
                                    '--button-default-height': '5vh',
                                    '--button-default-font-size': '2vh',
                                    '--button-default-border-radius': '12px',
                                    '--button-horizontal-padding': '27px',
                                    '--button-raise-level': '6px',
                                    '--button-hover-pressure': '1',
                                    '--transform-speed': '0.185s',


                                    borderRadius: "25px",
                                    fontSize: "100%",
                                }} type="primary" href={"/journey"}>
                                    Embark On Your Journey
                                </AwesomeButton>
                                <br/>
                                <br/>
                                <br/>
                            </Grid>
                            <Grid item xs={12}>
                                <h3>Conclusion</h3>
                                <p>The GIGO Journey system stands as a robust educational framework catering to
                                    different skill levels. Its incremental and bite-sized approach to lessons
                                    ensures that learners can progress at a comfortable pace without feeling
                                    overwhelmed. By connecting foundational concepts to advanced mastery through
                                    a well-structured pathway, it ensures a coherent and fulfilling learning
                                    experience for anyone looking to either start their coding journey or
                                    elevate their existing skills to complete mastery. Whether a novice seeking
                                    full competency or an experienced programmer aiming for complete mastery,
                                    the GIGO Journeys have the tools, resources, and support needed to reach
                                    those goals.</p>
                                <br/>
                            </Grid>
                        </Grid>
                    </div>
                </Box>
            </div>
        )
    }

    const renderMobile = () => {
        return (
            <AboutPageJourneyMobile/>
        )
    }

    return (
        isMobile ? renderMobile() : renderDesktop()
    )
}

function hexToRGBA(hex: any, alpha = 1) {
    let r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function useAspectRatio() {
    const [aspectRatio, setAspectRatio] = useState('');

    useEffect(() => {
        function gcd(a: any, b: any): any {
            return b === 0 ? a : gcd(b, a % b);
        }

        function calculateAspectRatio() {
            const width = window.screen.width;
            const height = window.screen.height;
            let divisor = gcd(width, height);
            ;
            // Dividing by GCD and truncating into integers
            let simplifiedWidth = Math.trunc(width / divisor);
            let simplifiedHeight = Math.trunc(height / divisor);

            divisor = Math.ceil(simplifiedWidth / simplifiedHeight);
            simplifiedWidth = Math.trunc(simplifiedWidth / divisor);
            simplifiedHeight = Math.trunc(simplifiedHeight / divisor);
            setAspectRatio(`${simplifiedWidth}:${simplifiedHeight}`);
        }

        calculateAspectRatio();

        window.addEventListener('resize', calculateAspectRatio);


        return () => {
            window.removeEventListener('resize', calculateAspectRatio);
        };
    }, []);

    return aspectRatio;
}

export default AboutPageJourney;

