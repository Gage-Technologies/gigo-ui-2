'use client'
import * as React from "react";
import { useEffect } from "react";
import {
    Box, Button,
    Card,
    CardContent,
    CssBaseline,
    Grid,
    SxProps,
    ThemeProvider,
    Typography,
} from "@mui/material";
import { theme } from "@/theme";
import config from "@/config";
import swal from "sweetalert";
import premiumImage from "@/img/croppedPremium.png";
import premiumGorilla from "@/img/pro-pop-up-icon-plain.svg";
import GoProDisplay from "@/components/GoProDisplay";
import { useAppDispatch, useAppSelector } from "@/reducers/hooks";
import { initialAuthState, selectAuthState } from "@/reducers/auth/auth";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import MuiAwesomeButton from "@/components/MuiAwesomeButton";
import { Subscription } from "@/models/subscription";

// Define the types for the benefits
type BenefitType = {
    title: string;
    tagline: string;
    description: string;
};

const Benefit: React.FC<{ benefit: BenefitType, sx?: SxProps }> = ({ benefit, sx }) => {
    return (
        <Box sx={{
            width: '100%',
            mb: 1,
            borderRadius: '8px',
            ...sx,  // Spread the sx prop here
        }}>
            <Typography variant="subtitle2" color={"secondary"} sx={{ textAlign: "left", mb: 1 }}>
                {benefit.title}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "1rem" }}>
                {benefit.tagline}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
                {benefit.description}
            </Typography>
        </Box>
    );
};

interface SubscriptionCardProps {
    title: string;
    subtitle: string;
    benefits: BenefitType[];
    price: string;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ title, subtitle, benefits }) => {
    return (
        <Card sx={{ width: { xs: 'calc(100% - 20px)', md: '500px' }, margin: 2, textAlign: 'center' }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {title}
                </Typography>
                <Typography variant="subtitle2" component="div" sx={{ mb: 2 }}>
                    {subtitle}
                </Typography>
                <Grid container direction="column" spacing={1} sx={{ p: 0 }}>
                    {benefits.map((benefit, index) => (
                        <Grid item xs={12} sx={{ paddingLeft: "0px" }} key={index}>
                            <Benefit benefit={benefit} />
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    );
};

function PremiumDescription() {
    const searchParams = useSearchParams();
    const isMobile = searchParams.get("viewport") === "mobile";

    // load auth state from storage
    const authState = useAppSelector(selectAuthState);

    const [membership, setMembership] = React.useState(0)

    const [goProPopup, setGoProPopup] = React.useState(false)


    let router = useRouter();

    const getSubData = async () => {
        let follow = fetch(
            `${config.rootPath}/api/user/subscription`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: '{}',
                credentials: "include"
            }
        ).then(res => res.json());

        const [res] = await Promise.all([
            follow
        ])

        if (res === undefined) {
            swal("There has been an issue loading data. Please try again later.")
        }

        let sub = res as Subscription

        setMembership(sub.current_subscription)
    }

    const handleButtonClick = () => {
        if (authState.authenticated) {
            setGoProPopup(true)
        } else {
            router.push("/signup")
        }
    }

    // Changed "Become A Pro" to "Stay A Pro"

    useEffect(() => {
        if (authState.authenticated)
            getSubData()
    }, [])

    let height = 200
    let width = 200

    if (isMobile) {
        height = 180
        width = 180
    }

    return (
        <>
            <GoProDisplay open={goProPopup} onClose={() => setGoProPopup(false)} />
            <Box
                sx={{
                    width: '100%',
                    height: { xs: '850px', md: '500px' },
                    backgroundColor: theme.palette.primary.light,
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: { xs: 2, md: 15 }
                }}
            >
                <Box
                    sx={{
                        width: { xs: '90%', md: 'auto' },
                        lineHeight: 1.5,
                        textAlign: 'left',
                    }}
                >
                    {membership < 1 ? (
                        <>
                            <Typography variant="h1">Become a Pro</Typography>
                            <Typography variant="h4">Only $3/mo. Cancel anytime.</Typography>
                            <MuiAwesomeButton
                                backgroundColor={theme.palette.secondary.main}
                                hoverColor={theme.palette.secondary.light}
                                secondaryColor={theme.palette.secondary.dark}
                                textColor={theme.palette.text.primary}
                                onClick={handleButtonClick}
                                sx={{
                                    mt: 2
                                }}
                            >
                                <Image src={premiumImage} width={110} height={25} alt="" />
                            </MuiAwesomeButton>
                        </>
                    ) : (
                        <>
                            <Typography variant="h1">It Feels Good to Be A Pro</Typography>
                            <Typography variant="h4">Learn More. Build More.</Typography>
                            <MuiAwesomeButton
                                backgroundColor={theme.palette.secondary.main}
                                hoverColor={theme.palette.secondary.light}
                                secondaryColor={theme.palette.secondary.dark}
                                textColor={theme.palette.text.primary}
                                onClick={handleButtonClick}
                                sx={{
                                    mt: 2
                                }}
                            >
                                <Typography variant="h5">Manage Plan</Typography>
                            </MuiAwesomeButton>
                        </>
                    )}
                </Box>
                <Box>
                    <Image src={premiumGorilla} width={200} height={220} alt="" style={{ filter: 'brightness(0) invert(1)' }} />
                </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h5" sx={{ textAlign: 'center', mb: 4, mt: 4 }}>
                    Pro Membership Options
                </Typography>
                <Grid container spacing={2} direction={{ xs: 'column', md: 'row' }}>
                    <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                        <SubscriptionCard
                            title="Basic"
                            subtitle="$3/month"
                            benefits={[
                                {
                                    title: 'Unlimited Retries',
                                    tagline: "No daily restrictions on Journeys & Bytes.",
                                    description: 'Ditch the hearts and make the most out of your learning experience without any limitations.'
                                },
                                {
                                    title: 'Freeze Your Streak',
                                    tagline: "Two streak freezes per week to keep your streak alive on your off days.",
                                    description: 'This feature allows you to maintain your progress even when you need to take a break, ensuring that your hard-earned streaks are preserved and you stay motivated.'
                                }
                            ]}
                            price="$3/month"
                        />
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                        <SubscriptionCard
                            title="Advanced"
                            subtitle="$8/month"
                            benefits={[
                                {
                                    title: "Basic",
                                    tagline: "Everything in the Basic plan.",
                                    description: ""
                                },
                                {
                                    title: 'Access to Challenges',
                                    tagline: "GIGO's project-based learning experience.",
                                    description: 'Engage in practical learning by tackling real-world projects in a web-based VSCode editor. These challenges are crafted to help you develop professional-level programming skills and build confidence through hands-on experience.'
                                },
                                {
                                    title: 'Larger DevSpaces',
                                    tagline: "8 CPU cores, 8GB RAM, 50GB disk.",
                                    description: 'Gain access to a larger DevSpace, enabling you to tackle more complex projects and enhance your development capabilities.'
                                }
                            ]}
                            price="$8/month"
                        />
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                        <SubscriptionCard
                            title="Max"
                            subtitle="$15/month"
                            benefits={[
                                {
                                    title: "Advanced",
                                    tagline: "Everything in the Advanced plan.",
                                    description: ""
                                },
                                {
                                    title: 'Smarter Code Teacher',
                                    tagline: 'The best personalized help AI can offer.',
                                    description: 'Accelerate your learning with the most advanced version of Code Teacher, designed to provide you with expert guidance and support on GIGO.'
                                }
                            ]}
                            price="$15/month"
                        />
                    </Grid>
                </Grid>

                {membership < 1 ? (
                    <MuiAwesomeButton
                        backgroundColor={theme.palette.secondary.main}
                        hoverColor={theme.palette.secondary.light}
                        secondaryColor={theme.palette.secondary.dark}
                        textColor={theme.palette.text.primary}
                        onClick={handleButtonClick}
                        sx={{
                            marginTop: 5,
                            marginBottom: 5
                        }}
                    >
                        <Image src={premiumImage} width={110} height={25} alt="" />
                    </MuiAwesomeButton>
                ) : (
                    <MuiAwesomeButton
                        backgroundColor={theme.palette.primary.main}
                        hoverColor={theme.palette.primary.light}
                        secondaryColor={theme.palette.primary.dark}
                        textColor={theme.palette.text.primary}
                        onClick={handleButtonClick}
                        sx={{
                            marginTop: 5,
                            marginBottom: 5
                        }}
                    >
                        <Typography variant="h5">Manage Plan</Typography>
                    </MuiAwesomeButton>
                )}
            </Box>
        </>
    );
}

export default PremiumDescription;