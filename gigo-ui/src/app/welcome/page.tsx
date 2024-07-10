'use client';
import React, { useEffect, useState } from 'react';
import { Box, Button, createTheme, Grid, PaletteMode, Paper, SxProps, Tooltip, Typography } from '@mui/material';
import backgroundImage from '@/img/welcome-background.png';
import { AwesomeButton } from "react-awesome-button"; // Adjust the import path according to your file structure
import { LoadingButton } from "@mui/lab";
import swal from "sweetalert";
import config from "@/config";
import styled, { css, keyframes } from 'styled-components';
import { selectAuthState } from "@/reducers/auth/auth";
import { useAppSelector } from "@/reducers/hooks";
import premiumGorilla from "@/img/pro-pop-up-icon-plain.svg";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import WelcomeMobilePage from "@/components/Welcome/welcomeMobile";
import CheckIcon from '@mui/icons-material/Check';
import { theme } from '@/theme';
import MuiAwesomeButton from '@/components/MuiAwesomeButton';


const WelcomePage: React.FC = () => {

    const [showSubscription, setShowSubscription] = useState(false);
    const query = useSearchParams();
    const forwardPath = query.get("forward") ? decodeURIComponent(query.get("forward") || "") : "";

    let isMobile = query.get("viewport") === "mobile";

    const authState = useAppSelector(selectAuthState)

    const [basicLink, setBasicLink] = useState("");
    const [advancedLink, setAdvancedLink] = useState("");
    const [maxLink, setMaxLink] = useState("");
    const [loadingProLinks, setLoadingProLinks] = useState<string | null>(null)
    const [showReferralPage, setShowReferralPage] = useState(false);
    const [openTooltip, setOpenTooltip] = useState(false);

    // handle copying referral link to clipboard
    const handleReferralButtonClick = async () => {
        try {
            await navigator.clipboard.writeText(`https://gigo.dev/referral/${encodeURIComponent(authState.userName)}`);
            setOpenTooltip(true);
            setTimeout(() => {
                setOpenTooltip(false);
            }, 2000); // tooltip will hide after 2 seconds
        } catch (err) {
            console.error('failed to copy text: ', err);
        }
    };


    const retrieveProUrls = async (): Promise<{ basic: string, advanced: string, max: string } | null> => {
        let res = await fetch(
            `${config.rootPath}/api/stripe/premiumMembershipSession`,
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({}),
                credentials: 'include'
            }
        ).then(res => res.json());

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
        // First let's check if we have a cached session - we hope so cause it'll be way faster
        let bLink = basicLink;
        let aLink = advancedLink;
        let mLink = maxLink;

        if (bLink === "") {
            setLoadingProLinks(plan);
            // Retrieve the URLs if they aren't cached
            let links = await retrieveProUrls();
            if (links === null) {
                swal("Server Error", "This is awkward... The server is having a fit. We hope you claim your trial another time!", "error");
                setLoadingProLinks(null);
                return;
            }
            bLink = links.basic;
            aLink = links.advanced;
            mLink = links.max;
            setLoadingProLinks(null);
        }

        // Open the monthly link in a new tab
        if (plan === "advanced") {
            window.open(aLink, "_blank");
        } else if (plan === "max") {
            window.open(mLink, "_blank");
        } else {
            window.open(bLink, "_blank");
        }
    }, [basicLink, advancedLink, maxLink]);



    useEffect(() => {
        if (authState.authenticated) {
            retrieveProUrls();
        }
    }, [authState.authenticated]);

    if (isMobile) {
        return <WelcomeMobilePage />
    }


    // Define the types for the benefits
    type BenefitType = {
        title: string;
        description: string;
        learnMoreLink?: string;
    };

    type PlanProps = {
        title: string;
        price: string;
        billingPeriod: string;
        benefits: BenefitType[];
        trialText?: string;
        discountText?: string;
    };

    const Benefit: React.FC<{ benefit: BenefitType, sx?: SxProps }> = ({ benefit, sx }) => {
        return (
            <Box sx={{
                width: '100%',
                mb: 1,
                borderRadius: '8px',
                ...sx,
            }}>
                <Typography variant="subtitle2" color={"secondary"} sx={{ fontSize: "0.8rem", textAlign: "left" }}>
                    {benefit.title}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                    {benefit.description}
                </Typography>
                {benefit.learnMoreLink && (
                    <Typography variant="body2" component="a" href={benefit.learnMoreLink}
                        sx={{ display: 'block', mt: 1 }}>
                        Learn More
                    </Typography>
                )}
            </Box>
        );
    };

    const Plan: React.FC<PlanProps> = ({ title, price, billingPeriod, benefits, trialText, discountText }) => {
        return (
            <Grid container justifyContent="center" sx={{ height: "100%" }}>
                <Box sx={{ position: "relative", height: "100%" }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, textAlign: "center" }}>{title}</Typography>
                    <Box sx={{
                        width: '100%',
                        mb: 1,
                        // border: '1px solid', // Adds an outline
                        borderColor: 'grey.300', // Adjust the color as needed
                        borderRadius: '18px', // Optional: adds rounded corners
                        p: 2, // Adds some padding inside the box
                    }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>{price}</Typography>
                    </Box>
                    <Typography variant="subtitle1" sx={{ mb: 1, textAlign: 'left' }}>{billingPeriod}</Typography>
                    <Grid item xs={12} sm={12} md={12}>
                        {benefits.map((benefit, index) => (
                            <Benefit key={index} benefit={benefit} />
                        ))}
                    </Grid>
                    <Box sx={{ marginTop: "32px" }} />
                    <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
                        {trialText && <Typography variant="body2" sx={{ mb: 1, textAlign: 'left' }}>{trialText}</Typography>}
                        {discountText && <Typography variant="body2" sx={{
                            color: 'secondary.main',
                            mb: 1,
                            textAlign: 'left'
                        }}>{discountText}</Typography>}
                    </Box>
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
        ${({ variant }) => variant === 'outlined' && css`
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
        if (showReferralPage) {
            return (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between', // This will space out the main and bottom sections
                    alignItems: 'center',
                    height: 'calc(100% + 64px)',
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
                    <Box sx={{ flexGrow: 1, mt: 1, p: 3, maxWidth: '1000px' }}> {/* Adjust background color as needed */}
                        <Box
                            display={"inline-flex"}
                            justifyContent={"space-between"}
                            sx={{
                                width: "100%",
                                marginBottom: "8px"
                            }}
                        >
                            <Box>
                                <Typography variant={"h4"} style={{ color: "white" }} align={"center"}>
                                    Try GIGO Pro
                                </Typography>
                            </Box>
                            <Image src={premiumGorilla} width={100} height={100} alt={"premiumGorilla"} style={{
                                width: "80px",
                                marginBottom: "20px"
                            }} />
                        </Box>
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            flexGrow: 1
                        }}>
                            <Typography variant="h4" sx={{
                                width: "100%",
                                textAlign: "center",
                                fontSize: { xs: "1em", md: "1.8em" },
                                lineHeight: { xs: "1em", md: "1.8em" },
                                mt: { xs: 4, md: 8 },
                                mb: { xs: 3, md: 5 }
                            }}>
                                Refer A Friend For A Free Month Of Max
                            </Typography>
                            <Typography variant="body1" sx={{
                                width: { xs: "100%", md: "60%" },
                                textAlign: "center",
                                px: { xs: 1, md: 2 },
                                mb: { xs: 2, md: 4 }
                            }}>
                                You will get a free month of GIGO Pro Max for each friend that signs up with your referral link.<br />
                            </Typography>
                            <Typography variant="body1" sx={{
                                width: { xs: "100%", md: "60%" },
                                textAlign: "center",
                                px: { xs: 1, md: 2 },
                                mb: { xs: 2, md: 4 }
                            }}>
                                No credit card required.
                            </Typography>
                        </Box>
                        <Box sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                            alignItems: "center"
                        }}>
                            <Tooltip
                                open={openTooltip}
                                disableFocusListener
                                disableHoverListener
                                disableTouchListener
                                title={
                                    <React.Fragment>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            Referral Link Copied
                                            <CheckIcon sx={{ color: theme.palette.success.main, ml: 1 }} />
                                        </div>
                                    </React.Fragment>
                                }
                                placement="top"
                                arrow
                            >
                                <Button sx={{
                                    mt: 1,
                                    fontSize: { xs: "0.7em", md: "0.8em" },
                                    width: "fit-content",
                                    px: { xs: 2, md: 3 }
                                }}
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleReferralButtonClick}>
                                    Copy Referral Link
                                </Button>
                            </Tooltip>
                            <Button sx={{
                                mt: 1,
                                fontSize: { xs: "0.7em", md: "0.8em" },
                                width: "fit-content",
                                px: { xs: 2, md: 3 }
                            }}
                                variant="outlined"
                                color="secondary"
                                onClick={() => setShowReferralPage(false)}>
                                Back To Pro Plans
                            </Button>
                        </Box>
                    </Box>
                </Box>
            )
        }

        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between', // This will space out the main and bottom sections
                alignItems: 'center',
                height: 'calc(100% + 64px)',
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
                <Box sx={{ flexGrow: 1, mt: 1, p: 3, maxWidth: '1000px' }}> {/* Adjust background color as needed */}
                    <Box
                        display={"inline-flex"}
                        justifyContent={"space-between"}
                        sx={{
                            width: "100%",
                            marginBottom: "8px"
                        }}
                    >
                        <Box>
                            <Typography variant={"h4"} style={{ color: "white" }} align={"center"}>
                                Try GIGO Pro
                            </Typography>
                        </Box>
                        <Image src={premiumGorilla} width={100} height={100} alt={"premiumGorilla"} style={{
                            width: "80px",
                            marginBottom: "20px"
                        }} />
                    </Box>
                    <Grid container spacing={4} justifyContent="center" sx={{ mt: 3 }}>
                        <Grid item xs={12}>
                            <Box sx={{ width: "100%", display: "flex", justifyContent: "center", mt: 2.5 }}>
                                <Button sx={{ mt: 1, fontSize: "0.8em" }} variant="contained" color="secondary" onClick={() => setShowReferralPage(true)}>
                                    Get A Free Month Of Max
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <Plan
                                    title="Basic"
                                    price="$3"
                                    billingPeriod="billed per month"
                                    benefits={basicBenefits}
                                // Include any special text or offers for the monthly plan here
                                />
                                <LoadingButton
                                    variant="contained"
                                    sx={{ mt: 'auto' }}
                                    onClick={() => handleClaimButtonClick("basic")}
                                    loading={loadingProLinks === "basic"}
                                    disabled={loadingProLinks !== null}
                                >
                                    $3/month
                                </LoadingButton>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <Plan
                                    title="Advanced"
                                    price="$8"
                                    billingPeriod="billed per month"
                                    benefits={advancedBenefits}
                                />
                                <LoadingButton
                                    variant="contained"
                                    sx={{ mt: 'auto' }}
                                    onClick={() => handleClaimButtonClick("advanced")}
                                    loading={loadingProLinks === "advanced"}
                                    disabled={loadingProLinks !== null}
                                >
                                    $8/month
                                </LoadingButton>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <Plan
                                    title="Max"
                                    price="$15"
                                    billingPeriod="billed per month"
                                    benefits={maxBenefits}
                                />
                                <LoadingButton
                                    variant="contained"
                                    sx={{ mt: 'auto' }}
                                    onClick={() => handleClaimButtonClick("max")}
                                    loading={loadingProLinks === "max"}
                                    disabled={loadingProLinks !== null}
                                >
                                    $15/month
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
                </Box>
            </div>
        );
    } else {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between', // This will space out the main and bottom sections
                alignItems: 'center',
                height: '93vh',
                // backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
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
                {/* Middle section for Welcome Text and Get Started Button */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%', // Take full height to center content vertically
                }}>
                    <h1>Welcome to GIGO</h1>
                    <br />
                    <p>Learn something new today!</p>
                    <br />
                    <AwesomeButton style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        '--button-primary-color': "#29C18C",
                        '--button-primary-color-dark': "#1c8762",
                        '--button-primary-color-light': "#1c8762",
                        '--button-primary-color-active': "#1c8762",
                        '--button-primary-color-hover': "#29C18C",
                        '--button-default-font-size': '24px',
                        '--button-default-border-radius': '10px',
                        '--button-horizontal-padding': '8px',
                        '--button-raise-level': '6px',
                        '--button-hover-pressure': '3',
                        '--transform-speed': '0.275s',
                    }} type="primary"
                        // onClick={() => setShowSubscription(true)}
                        href={forwardPath || "/home"}
                    >
                        Get Started!
                    </AwesomeButton>
                </div>
            </div>
        );
    }


};

export default WelcomePage;
