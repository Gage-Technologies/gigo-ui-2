import React, {useEffect, useState} from 'react';

import {Box, Button, createTheme, PaletteMode, Typography, Grid, Paper, SxProps} from '@mui/material';
import backgroundImage from '@/img/welcome-background.png';
import {AwesomeButton} from "react-awesome-button"; // Adjust the import path according to your file structure
import {getAllTokens} from "@/theme";
import {LoadingButton} from "@mui/lab";
import swal from "sweetalert";
import call from "@/services/api-call";
import config from "@/config";
import styled, {css, keyframes} from 'styled-components';
import {selectAuthState} from "@/reducers/auth/auth";
import {useAppSelector} from "@/reducers/hooks";
import premiumGorilla from "@/img/pro-pop-up-icon-plain.svg";
import { useSearchParams} from "next/navigation";
import Image from "next/image";


const WelcomeMobilePage: React.FC = () => {

    const [showSubscription, setShowSubscription] = useState(false);
    let userPref = localStorage.getItem('theme')
    const [mode, setMode] = React.useState<PaletteMode>(userPref === 'light' ? 'light' : 'dark');
    const theme = React.useMemo(() => createTheme(getAllTokens(mode)), [mode]);
    const query = useSearchParams();
    const forwardPath = query.get("forward") ? decodeURIComponent(query.get("forward") || "") : "";

    const authState = useAppSelector(selectAuthState)

    const [basicLink, setBasicLink] = useState("");
    const [advancedLink, setAdvancedLink] = useState("");
    const [maxLink, setMaxLink] = useState("");
    const [loadingProLinks, setLoadingProLinks] = useState<string | null>(null)

    const retrieveProUrls = async (): Promise<{ basic: string, advanced: string, max: string } | null> => {
        let res = await call(
            "/api/stripe/premiumMembershipSession",
            "post",
            null,
            null,
            null,
            // @ts-ignore
            {},
            null,
            config.rootPath
        )

        if (res !== undefined && res["basic"] !== undefined && res["advanced"] !== undefined && res["max"] !== undefined) {
            setBasicLink(res["basic"])
            setAdvancedLink(res["advanced"])
            setMaxLink(res["max"])
            return {
                "basic": res["basic"],
                "advanced": res["advanced"],
                "max": res["max"],
            }
        }

        return null
    }

    const handleClaimButtonClick = React.useCallback(async (plan: string) => {
        // first let's check if we have a cached session - we hope so cause it'll be way faster
        let bLink = basicLink
        let aLink = advancedLink
        let mLink = maxLink
        if (bLink === "") {
            setLoadingProLinks(plan)
            // retrieve the urls if they aren't cached
            let links = await retrieveProUrls()
            if (links === null) {
                swal("Server Error", "This is awkward... The server is having a fit. We hope you claim your trial another time!", "error")
                return
            }
            bLink = links.basic
            aLink = links.advanced
            mLink = links.max
            setLoadingProLinks(null)
        }

        // open the monthly link in a new tab
        if (plan === "advanced") {
            window.open(aLink, "_blank");
        } else if (plan === "max") {
            window.open(mLink, "_blank");
        } else {
            window.open(bLink, "_blank");
        }
    }, [basicLink, advancedLink, maxLink])

    useEffect(() => {
        if (!authState.authenticated) {
            return
        }
        retrieveProUrls();
    }, [authState.authenticated]);

    // Define the types for the benefits
    type BenefitType = {
        title: string;
        description: string;
        learnMoreLink?: string;
    };

// Define the props for the Plan component
    type PlanProps = {
        title: string;
        price: string;
        billingPeriod: string;
        benefits: BenefitType[];
        trialText?: string;
        discountText?: string;
    };

// Component to render individual benefits
    const Benefit: React.FC<{ benefit: BenefitType, sx?: SxProps }> = ({benefit, sx}) => {
        return (
            <Box sx={{
                width: '100%',
                mb: 1,
                borderRadius: '8px',
                ...sx,  // Spread the sx prop here
            }}>
                <Typography variant="subtitle2" color={"secondary"} sx={{fontSize: "0.8rem", textAlign: "left"}}>
                    {benefit.title}
                </Typography>
                <Typography variant="body2" sx={{mb: 1}}>
                    {benefit.description}
                </Typography>
                {benefit.learnMoreLink && (
                    <Typography variant="body2" component="a" href={benefit.learnMoreLink}
                                sx={{display: 'block', mt: 1}}>
                        Learn More
                    </Typography>
                )}
            </Box>
        );
    };


// Component to render the plan card
    const Plan: React.FC<PlanProps> = ({title, price, billingPeriod, benefits, trialText, discountText}) => {
        return (
            <Grid container justifyContent="center">
                <Box>
                    <Typography variant="h6" sx={{fontWeight: 'bold', mb: 2, textAlign: "center"}}>{title}</Typography>
                    <Box sx={{
                        width: '100%',
                        mb: 2,
                        // border: '1px solid', // Adds an outline
                        borderColor: 'grey.300', // Adjust the color as needed
                        borderRadius: '18px', // Optional: adds rounded corners
                        p: 2, // Adds some padding inside the box
                    }}>
                        <Typography variant="h4" sx={{fontWeight: 'bold', mb: 2, textAlign: "center", width: "100%"}}>{price}</Typography>
                    </Box>
                    <Typography variant="subtitle1" sx={{mb: 2, textAlign: 'left'}}>{billingPeriod}</Typography>
                    <Grid item xs={12} sm={12} md={12}>
                        {benefits.map((benefit, index) => (

                            <Benefit key={index} benefit={benefit}/>

                        ))}
                    </Grid>
                    {trialText && <Typography variant="body2" sx={{mb: 2, textAlign: 'left'}}>{trialText}</Typography>}
                    {discountText && <Typography variant="body2" sx={{
                        color: 'secondary.main',
                        mb: 2,
                        textAlign: 'left'
                    }}>{discountText}</Typography>}
                </Box>
            </Grid>
        );
    };


    const basicBenefits: BenefitType[] = [
        {
            title: 'Unlimited Retries',
            description: 'No daily restrictions on Journeys & Bytes.'
        },
        {
            title: 'Freeze Your Streak',
            description: 'Get two streak freezes per week to keep your streak alive on your off days.'
        },
    ];

    const advancedBenefits: BenefitType[] = [
        {
            title: 'Basic',
            description: 'Everything from the Basic plan.'
        },
        {
            title: 'Access to Challenges',
            description: 'GIGO\'s project-based learning experience.'
        },
        {
            title: 'Larger DevSpaces',
            description: '8 CPU cores, 8GB RAM, 50GB disk'
        }
    ];

    const maxBenefits: BenefitType[] = [
        {
            title: 'Advanced',
            description: 'Everything from the Advanced plan.'
        },
        {
            title: 'Smarter Code Teacher',
            description: 'Learn faster with the smartest version of Code Teacher, your personal tutor on GIGO.'
        }
    ];

    const rainbowAnimation = keyframes`
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    `;

    const RainbowButton = styled(LoadingButton)`
        ${({variant}) => variant === 'outlined' && css`
            position: relative;
            overflow: hidden;
            background-size: 200% 200%;
            background-image: linear-gradient(45deg, #29C18C, #63a4f8, #2a63ac, #84E8A2);
            animation: ${rainbowAnimation} 10s ease infinite;
            color: white;
            border: 1px solid transparent; // Ensure the outline is visible

            // Adding a glow effect
            box-shadow: 0 0 8px 2px rgba(255, 255, 255, 0.6); // Adjust the color and size as needed

            &:hover {
                animation-play-state: paused; // Optional: Pause animation on hover
            }
        `}
    `;

    if (showSubscription) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between', // This will space out the main and bottom sections
                alignItems: 'center',
                height: 'calc(100% + 64px)',
                // backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
                textAlign: 'center',
                padding: '20px 0', // Add padding to avoid content touching the edges
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: -1, // Make sure the image is behind all other elements
                    overflow: 'hidden',
                }}>
                    <Image
                        src={backgroundImage}
                        alt="backgroundImage"
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center"
                        quality={100} // Set image quality to high
                    />
                </div>
                <Box sx={{flexGrow: 1, mt: 1, p: 3, maxWidth: '1000px'}}> {/* Adjust background color as needed */}
                    <Box
                        display={"inline-flex"}
                        justifyContent={"space-between"}
                        sx={{
                            width: "100%",
                            marginBottom: "8px"
                        }}
                    >
                        <Box>
                            <Typography variant={"h4"} style={{color: "white"}} align={"center"}>
                                Try GIGO Pro
                            </Typography>
                            <Typography variant={"subtitle1"} style={{color: "white", textAlign: "left"}}
                                        align={"center"}>
                                Free for 1 month
                            </Typography>
                            <Typography variant={"body2"} style={{textAlign: "left", width: "100%"}}>
                                <a href="#bottom" style={{color: "#ffffff70"}}>
                                    Skip Offer At Bottom Of Page
                                </a>
                            </Typography>
                        </Box>
                        <Image alt={"premiumGorilla"} width={60} height={60} src={premiumGorilla} style={{
                            width: "80px",
                            marginBottom: "20px"
                        }}/>
                    </Box>
                    {/*<Box*/}
                    {/*    display={"inline-flex"}*/}
                    {/*    justifyContent={"space-between"}*/}
                    {/*    sx={{ width: "100%", marginBottom: "8px", mt: 2 }}*/}
                    {/*>*/}
                    {/*    <Typography variant={"h6"} style={{ color: "white" }} align={"center"}>*/}
                    {/*        How The Free Trial Works*/}
                    {/*    </Typography>*/}
                    {/*</Box>*/}
                    {/*<Box*/}
                    {/*    position="relative"*/}
                    {/*    display="flex"*/}
                    {/*    justifyContent="space-around"*/}
                    {/*    alignItems="center"*/}
                    {/*    sx={{ width: "100%", mb: 4, mt: 2 }}*/}
                    {/*>*/}
                    {/*    /!* Dotted Line *!/*/}
                    {/*    <Box*/}
                    {/*        position="absolute"*/}
                    {/*        top="50%"*/}
                    {/*        left="10%"*/}
                    {/*        right="10%"*/}
                    {/*        height="2px"*/}
                    {/*        bgcolor="white"*/}
                    {/*        sx={{ zIndex: 99 }}*/}
                    {/*        style={{*/}
                    {/*            borderBottom: "2px solid white",*/}
                    {/*            transform: "translateY(-50%)",*/}
                    {/*        }}*/}
                    {/*    />*/}

                    {/*    /!* Stage 1 *!/*/}
                    {/*    <Paper*/}
                    {/*        elevation={4}*/}
                    {/*        sx={{*/}
                    {/*            padding: 2,*/}
                    {/*            maxWidth: 200,*/}
                    {/*            textAlign: "center",*/}
                    {/*            color: "white",*/}
                    {/*            zIndex: 100,*/}
                    {/*        }}*/}
                    {/*    >*/}
                    {/*        <Typography variant="h6">Start Trial</Typography>*/}
                    {/*    </Paper>*/}

                    {/*    /!* Stage 2 *!/*/}
                    {/*    <Paper*/}
                    {/*        elevation={4}*/}
                    {/*        sx={{*/}
                    {/*            padding: 2,*/}
                    {/*            maxWidth: 200,*/}
                    {/*            textAlign: "center",*/}
                    {/*            color: "white",*/}
                    {/*            zIndex: 100,*/}
                    {/*        }}*/}
                    {/*    >*/}
                    {/*        <Typography variant="h6">2 Day Reminder</Typography>*/}
                    {/*        <Typography variant="body2">Email sent 2 days before the trial ends</Typography>*/}
                    {/*    </Paper>*/}

                    {/*    /!* Stage 3 *!/*/}
                    {/*    <Paper*/}
                    {/*        elevation={4}*/}
                    {/*        sx={{*/}
                    {/*            padding: 2,*/}
                    {/*            maxWidth: 200,*/}
                    {/*            textAlign: "center",*/}
                    {/*            color: "white",*/}
                    {/*            zIndex: 100,*/}
                    {/*        }}*/}
                    {/*    >*/}
                    {/*        <Typography variant="h6">Account Charged</Typography>*/}
                    {/*        <Typography variant="body2">You are charged at the end of the trial</Typography>*/}
                    {/*    </Paper>*/}
                    {/*</Box>*/}
                    <Grid container spacing={4} justifyContent="center">
                        <Grid item xs={12} sm={6} md={4}>
                            <Paper elevation={3} sx={{p: 2, display: 'flex', flexDirection: 'column', height: '100%'}}>
                                <Plan
                                    title="Basic"
                                    price="$3"
                                    billingPeriod="billed per month"
                                    benefits={basicBenefits}
                                    trialText="1 month free trial"
                                    // Include any special text or offers for the monthly plan here
                                />
                                <LoadingButton
                                    variant="contained"
                                    sx={{mt: 'auto'}}
                                    onClick={() => handleClaimButtonClick("basic")}
                                    loading={loadingProLinks === "basic"}
                                    disabled={loadingProLinks !== null}
                                >
                                    Claim Free Trial
                                </LoadingButton>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Paper elevation={3} sx={{p: 2, display: 'flex', flexDirection: 'column', height: '100%'}}>
                                <Plan
                                    title="Advanced"
                                    price="$8"
                                    billingPeriod="billed per month"
                                    benefits={advancedBenefits}
                                    trialText="1 month free trial"
                                />
                                <LoadingButton
                                    variant="contained"
                                    sx={{mt: 'auto'}}
                                    onClick={() => handleClaimButtonClick("advanced")}
                                    loading={loadingProLinks === "advanced"}
                                    disabled={loadingProLinks !== null}
                                >
                                    Claim Free Trial
                                </LoadingButton>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Paper elevation={3} sx={{p: 2, display: 'flex', flexDirection: 'column', height: '100%'}}>
                                <Plan
                                    title="Max"
                                    price="$15"
                                    billingPeriod="billed per month"
                                    benefits={maxBenefits}
                                    trialText="1 month free trial"
                                />
                                <LoadingButton
                                    variant="contained"
                                    sx={{mt: 'auto'}}
                                    onClick={() => handleClaimButtonClick("max")}
                                    loading={loadingProLinks === "max"}
                                    disabled={loadingProLinks !== null}
                                >
                                    Claim Free Trial
                                </LoadingButton>
                            </Paper>
                        </Grid>
                    </Grid>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center', // Centers the button horizontally
                        alignItems: 'center', // Centers the button vertically if needed
                        height: '64px', // Gives the container a height so that alignItems has an effect
                        mt: 4, // Adds margin at the top for spacing from the grid
                    }}>
                        <AwesomeButton href={forwardPath || "/home"} style={{
                            width: "auto",
                            height: "30px",
                            '--button-primary-color': '#29c18c',
                            '--button-primary-color-dark': '#1c8762',
                            '--button-primary-color-light': "white",
                            '--button-primary-color-hover': '#29c18c',
                            '--button-default-border-radius': "12px",
                            fontSize: "16px",
                        }}>
                            Skip Offer
                        </AwesomeButton>
                    </Box>
                    <div id="bottom" style={{textAlign: "center"}}/>
                </Box>
            </div>
        );
    } else {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                // backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                p: 2,
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: -1, // Make sure the image is behind all other elements
                    overflow: 'hidden',
                }}>
                    <Image
                        src={backgroundImage}
                        alt="backgroundImage"
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center"
                        quality={100} // Set image quality to high
                    />
                </div>
                <Typography variant="h4" align="center" gutterBottom>Welcome to GIGO</Typography>
                <Typography variant="body1" align="center" sx={{mb: 4}}>
                    Learn something new today!
                </Typography>
                <Button variant="contained" onClick={() => setShowSubscription(true)} sx={{mb: 2}}>
                    Continue
                </Button>
            </Box>
        );
    }


};

export default WelcomeMobilePage;
