'use client'
import React, { useEffect, useState } from 'react';
import { Typography, IconButton, Dialog, PaletteMode, createTheme, Box, Card, CardContent, CardActions, Button, Grid, SxProps, Tooltip } from '@mui/material';
import Close from '@mui/icons-material/Close'; // Assuming you're using MUI icons
import { LoadingButton } from '@mui/lab';
import premiumGorilla from "../img/pro-pop-up-icon-plain.svg";
import { theme } from "../theme";
import call from "../services/api-call";
import config from "../config";
import { initialAuthStateUpdate, selectAuthState, updateAuthState } from "../reducers/auth/auth"; // Adjust import based on actual location
import { Subscription, SubscriptionStatus } from "@/models/subscription";
import stripeWhite from '../img/powered-stripe-white.svg'
import stripeBlack from '../img/powered-stripe-black.svg'
import { useAppDispatch, useAppSelector } from '@/reducers/hooks';
import Image from "next/image";
import { useGetProUrls } from '@/hooks/getProUrls';
import { useGetUserSubData } from '@/hooks/getUserSubData';
import CheckIcon from '@mui/icons-material/Check';
import useIsMobile from '@/hooks/isMobile';

// Define the types for the benefits
type BenefitType = {
    title: string;
    description: string;
    learnMoreLink?: string;
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

const Benefit: React.FC<{ benefit: BenefitType, sx?: SxProps }> = ({ benefit, sx }) => {
    return (
        <Box sx={{
            width: '100%',
            mb: 1,
            borderRadius: '8px',
            ...sx,  // Spread the sx prop here
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

interface SubscriptionCardProps {
    title: string;
    benefits: BenefitType[];
    price: string;
    loading: boolean;
    href: string;
    onClick?: () => void;
    active: boolean;
    previewPrice?: string;
    downgradeDate?: string;
    pendingDowngrade?: string;
    referralLink?: string;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ title, benefits, price, loading, href, onClick, active, previewPrice, downgradeDate, pendingDowngrade, referralLink }) => {
    const [openTooltip, setOpenTooltip] = useState(false);

    // handle copying referral link to clipboard
    const handleReferralButtonClick = async () => {
        if (!referralLink) {
            return
        }
        try {
            await navigator.clipboard.writeText(referralLink);
            setOpenTooltip(true);
            setTimeout(() => {
                setOpenTooltip(false);
            }, 2000); // tooltip will hide after 2 seconds
        } catch (err) {
            console.error('failed to copy text: ', err);
        }
    };

    let buttonText = price;
    let buttonTextColor: "primary" | "error" = "primary"
    if (active) {
        buttonText = "Active"
    }
    if (downgradeDate) {
        buttonText = "Confirm Downgrade"
    }
    if (previewPrice) {
        buttonText = "Confirm Upgrade"
    }
    if (pendingDowngrade) {
        buttonTextColor = "error"
        buttonText = "Cancel Downgrade"
    }

    return (
        <Card sx={{ minWidth: 225, margin: 2, textAlign: 'center' }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {title}
                </Typography>
                <Grid container direction="column" spacing={1} sx={{ p: 0 }}>
                    {benefits.map((benefit, index) => (
                        <Grid item xs={12} sx={{ paddingLeft: "0px" }} key={index}>
                            <Benefit benefit={benefit} />
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
            <CardActions sx={{ justifyContent: "center" }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', flexDirection: 'column' }}>
                    {previewPrice && (
                        <Typography variant="caption" sx={{ color: "white" }}>
                            Prorated cost: ${parseFloat(previewPrice).toFixed(2)}
                        </Typography>
                    )}
                    {(downgradeDate || pendingDowngrade) && (
                        <Typography variant="caption" sx={{ color: "white" }}>
                            You will be downgraded on: {pendingDowngrade || downgradeDate}
                        </Typography>
                    )}
                    {onClick ? (
                        <LoadingButton
                            onClick={onClick}
                            disabled={active}
                            loading={loading}
                            sx={{
                                width: "100%"
                            }}
                            variant="contained"
                            color={buttonTextColor}
                        >
                            {buttonText}
                        </LoadingButton>
                    ) : (
                        <LoadingButton
                            href={href}
                            disabled={active}
                            loading={loading}
                            target="_blank"
                            sx={{
                                width: "100%"
                            }}
                            variant="contained"
                            color={buttonTextColor}
                        >
                            {buttonText}
                        </LoadingButton>
                    )}
                    {referralLink && (
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
                            <Button sx={{ mt: 1, fontSize: "0.6em" }} variant="text" color="inherit" onClick={handleReferralButtonClick}>
                                Get A Free Month For Each Referral
                            </Button>
                        </Tooltip>
                    )}
                </Box>
            </CardActions>
        </Card>
    );
};

interface GoProPopupProps {
    open: boolean;
    onClose: () => void;
}

const GoProDisplay: React.FC<GoProPopupProps> = ({ open, onClose }) => {
    const dispatch = useAppDispatch();
    const authState = useAppSelector(selectAuthState);

    const isMobile = useIsMobile();

    const [previewLoading, setPreviewLoading] = React.useState<string | null>(null)
    const [preview, setPreview] = React.useState<{ status: string, price?: string, downgradeDate?: string } | null>(null)
    const [proUrlsLoading, setProUrlsLoading] = useState(false);
    const [basicLink, setBasicLink] = useState('');
    const [advancedLink, setAdvancedLink] = useState('');
    const [maxLink, setMaxLink] = useState('');
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [openTooltip, setOpenTooltip] = useState(false);
    const [showReferralPage, setShowReferralPage] = useState(false);

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

    const getProUrls = useGetProUrls()
    const getUserSubData = useGetUserSubData()

    const retrieveProUrls = async (): Promise<{ basic: string, advanced: string, max: string } | null> => {
        let res = await getProUrls()
        console.log("res: ", res)

        if (res !== undefined && res !== null) {
            setBasicLink(res.basic)
            setAdvancedLink(res.advanced)
            setMaxLink(res.max)
            return res
        }

        return null
    }

    const getSubData = async (): Promise<Subscription | null> => {
        let subscription = await getUserSubData();

        if (subscription === undefined || subscription === null) {
            return null
        }

        setSubscription(subscription)
        return subscription
    }

    const updateSubscription = async (targetStatus: SubscriptionStatus, preview: boolean): Promise<{ success: boolean, prorated_cost: string | null } | null> => {
        let subscription = await call(
            "/api/stripe/updateSubscription",
            "post",
            null,
            null,
            null,
            //@ts-ignore
            {
                target_status: targetStatus,
                preview: preview,
            },
            null,
            config.rootPath
        )

        if (subscription === undefined || (subscription["prorated_cost"] === undefined && subscription["success"] === undefined)) {
            return null
        }

        return {
            success: subscription["success"] || false,
            prorated_cost: subscription["prorated_cost"] || null
        }
    }

    const cancelSubscriptionDowngrade = async (target: string): Promise<boolean> => {
        setPreviewLoading(target)
        let subscription = await call(
            "/api/stripe/cancelSubscriptionDowngrade",
            "post",
            null,
            null,
            null,
            //@ts-ignore
            {},
            null,
            config.rootPath
        )

        if (subscription === undefined || subscription["success"] === undefined) {
            return false
        }

        if (subscription["success"]) {
            getSubData().then(() => setPreviewLoading(null))
        } else {
            setPreviewLoading(null)
        }
        return subscription["success"]
    }

    const bootstrap = async () => {
        setProUrlsLoading(true)
        let subData = await getSubData()
        if (subData !== null && subData.current_subscription === SubscriptionStatus.Free) {
            await retrieveProUrls()
        }
        setProUrlsLoading(false)
    }

    useEffect(() => {
        if (authState.authenticated) {
            bootstrap()
        }
    }, [authState.authenticated, open])

    const handleUpgradeClick = async (targetStatus: SubscriptionStatus, force: boolean) => {
        if (subscription === null || subscription.current_subscription === SubscriptionStatus.Free) {
            return
        }

        // set the preview loading state
        let preview = "basic"
        if (targetStatus === SubscriptionStatus.ProMax) {
            preview = "max"
        } else if (targetStatus === SubscriptionStatus.ProAdvanced) {
            preview = "advanced"
        }
        setPreviewLoading(preview)

        // determine if this is an upgrade or downgrade
        let upgrade = false
        if (subscription.current_subscription < targetStatus) {
            upgrade = true
        }

        if (!upgrade && !force) {
            setPreview({
                status: preview,
                downgradeDate: new Date(subscription.upcomingPayment * 1000).toLocaleDateString()
            })
            setPreviewLoading(null)
            return
        }

        // execute the upgrade or downgrade
        let res = await updateSubscription(targetStatus, upgrade && !force)
        if (res !== null) {
            if (res.success) {
                if (upgrade) {
                    let sub = JSON.parse(JSON.stringify(subscription))
                    sub.current_subscription = targetStatus
                    setSubscription(sub)
                    let authStateUpdate = Object.assign({}, initialAuthStateUpdate)
                    authStateUpdate.role = targetStatus
                    dispatch(updateAuthState(authStateUpdate))
                }
                setPreview(null)
                getSubData()
                onClose()
            }

            if (res.prorated_cost !== null) {
                setPreview({
                    status: preview,
                    price: res.prorated_cost
                })
            }
        }
        setPreviewLoading(null)
    }

    const renderMainPage = () => {
        return (
            <>
                {subscription && !subscription.usedFreeTrial && !isMobile && (
                    <Typography variant="body1" sx={{ mx: 2.5, color: "white", mt: 1, maxWidth: "60%" }}>
                        Claim Your Free Month!
                    </Typography>
                )}
                {!isMobile && (
                    <Box sx={{ width: "100%", display: "flex", justifyContent: "center", mt: 2.5 }}>
                        <Button sx={{ mt: 1, fontSize: "0.8em" }} variant="contained" color="secondary" onClick={() => setShowReferralPage(true)}>
                            Get A Free Month Of Max
                        </Button>
                    </Box>
                )}
                <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ p: 2 }}>
                    {subscription && !subscription.usedFreeTrial && isMobile && (
                        <Grid item xs={12}>
                            <Typography variant="body1" sx={{ color: "white", mt: 1, width: "100%", textAlign: "center" }}>
                                Claim Your Free Month!
                            </Typography>
                        </Grid>
                    )}
                    {isMobile && (
                        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                            <Button sx={{ mt: 1, fontSize: "0.8em" }} variant="contained" color="secondary" onClick={() => setShowReferralPage(true)}>
                                Get A Free Month Of Pro Max
                            </Button>
                        </Grid>
                    )}
                    <Grid item xs={12} md={4}>
                        <SubscriptionCard
                            title="Basic"
                            benefits={basicBenefits}
                            price="$3/month"
                            loading={proUrlsLoading || previewLoading === "basic"}
                            href={basicLink}
                            active={subscription !== null && subscription.current_subscription === SubscriptionStatus.ProBasic}
                            previewPrice={preview === null || !preview.price || preview.status !== "basic" ? undefined : preview.price}
                            onClick={
                                subscription !== null &&
                                    subscription.scheduledDowngrade === SubscriptionStatus.ProBasic ?
                                    () => cancelSubscriptionDowngrade("basic")
                                    :
                                    subscription !== null &&
                                        subscription.current_subscription !== SubscriptionStatus.Free ?
                                        () => handleUpgradeClick(SubscriptionStatus.ProBasic, preview !== null && preview.status === "basic")
                                        :
                                        undefined
                            }
                            downgradeDate={preview === null || !preview.downgradeDate || preview.status !== "basic" ? undefined : preview.downgradeDate}
                            pendingDowngrade={subscription !== null && subscription.scheduledDowngrade === SubscriptionStatus.ProBasic ? new Date(subscription.upcomingPayment * 1000).toLocaleDateString() : undefined}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <SubscriptionCard
                            title="Advanced"
                            benefits={advancedBenefits}
                            price="$8/month"
                            loading={proUrlsLoading || previewLoading === "advanced"}
                            href={advancedLink}
                            active={subscription !== null && subscription.current_subscription === SubscriptionStatus.ProAdvanced}
                            previewPrice={preview === null || preview.status !== "advanced" ? undefined : preview.price}
                            onClick={
                                subscription !== null &&
                                    subscription.scheduledDowngrade === SubscriptionStatus.ProAdvanced ?
                                    () => cancelSubscriptionDowngrade("advanced")
                                    :
                                    subscription !== null &&
                                        subscription.current_subscription !== SubscriptionStatus.Free ?
                                        () => handleUpgradeClick(SubscriptionStatus.ProAdvanced, preview !== null && preview.status === "advanced")
                                        :
                                        undefined
                            }
                            downgradeDate={preview === null || !preview.downgradeDate || preview.status !== "advanced" ? undefined : preview.downgradeDate}
                            pendingDowngrade={subscription !== null && subscription.scheduledDowngrade === SubscriptionStatus.ProAdvanced ? new Date(subscription.upcomingPayment * 1000).toLocaleDateString() : undefined}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <SubscriptionCard
                            title="Max"
                            benefits={maxBenefits}
                            price="$15/month"
                            loading={proUrlsLoading || previewLoading === "max"}
                            href={maxLink}
                            active={subscription !== null && subscription.current_subscription === SubscriptionStatus.ProMax}
                            previewPrice={preview === null || preview.status !== "max" ? undefined : preview.price}
                            onClick={
                                subscription !== null &&
                                    subscription.scheduledDowngrade === SubscriptionStatus.ProMax ?
                                    () => cancelSubscriptionDowngrade("max")
                                    :
                                    subscription !== null &&
                                        subscription.current_subscription !== SubscriptionStatus.Free ?
                                        () => handleUpgradeClick(SubscriptionStatus.ProMax, preview !== null && preview.status === "max")
                                        :
                                        undefined
                            }
                            downgradeDate={preview === null || !preview.downgradeDate || preview.status !== "max" ? undefined : preview.downgradeDate}
                            pendingDowngrade={subscription !== null && subscription.scheduledDowngrade === SubscriptionStatus.ProMax ? new Date(subscription.upcomingPayment * 1000).toLocaleDateString() : undefined}
                        />
                    </Grid>
                </Grid>
            </>
        )
    }

    const renderReferralPage = () => {
        return (
            <Box sx={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                px: { xs: 2, md: 4 },
                pb: { xs: 4, md: 6 },
            }}>
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
                        fontSize: { xs: "1em", md: "1.2em" },
                        lineHeight: { xs: "1em", md: "1.2em" },
                        mt: { xs: 4, md: 8 },
                        mb: { xs: 3, md: 5 }
                    }}>
                        Refer A Friend<br />For A Free Month Of Max
                    </Typography>
                    <Typography variant="body1" sx={{
                        width: { xs: "100%", md: "60%" },
                        textAlign: "center",
                        px: { xs: 1, md: 2 },
                        mb: { xs: 2, md: 4 }
                    }}>
                        You will get a free month of GIGO Pro Max for each friend that signs up with your referral link.<br/>
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
                            copy referral link
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
                        back
                    </Button>
                </Box>
            </Box>
        )
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={isMobile ? "xl" : "md"}
            sx={{
                width: isMobile ? "100vw" : "auto",
                minHeight: isMobile ? "100vh" : undefined,
                maxHeight: "100vh"
            }}
            PaperProps={{
                sx: {
                    borderRadius: isMobile ? "0px" : "10px",
                    overflow: "auto",
                    backgroundColor: "background.default",
                    margin: isMobile ? "0px" : undefined,
                    maxHeight: isMobile ? "100vh" : undefined
                }
            }}
        >
            <Box sx={{
                position: "relative",
                boxShadow: "0px 12px 6px -6px rgba(0,0,0,0.6),0px 6px  0px rgba(0,0,0,0.6),0px 6px 18px 0px rgba(0,0,0,0.6)",
                backgroundImage: `linear-gradient(to bottom right, ${theme.palette.primary.dark} 0%, ${theme.palette.background.default} 45%, ${theme.palette.background.default} 55%, ${theme.palette.secondary.dark} 100%)`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
                paddingBottom: "16px",
                minHeight: isMobile ? "100vh" : undefined,
            }}>
                <IconButton
                    edge="end"
                    color="inherit"
                    size="small"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        top: { xs: '3vh', md: '20px' },
                        right: { xs: '3vw', md: '30px' },
                        color: "white"
                    }}
                >
                    <Close />
                </IconButton>
                <Box
                    sx={{
                        mb: { xs: 1, md: 2.5 },
                        position: "absolute",
                        top: { xs: '3vh', md: '20px' },
                        right: { xs: 'calc(3vw + 25px)', md: '60px' },
                    }}
                >
                    <Image
                        src={premiumGorilla}
                        width={100}
                        height={100}
                        alt=""
                    />
                </Box>
                <Typography variant="h4" sx={{ mb: 1.25, color: "white", marginLeft: 2, marginTop: 2 }}>
                    GIGO Pro
                </Typography>
                <Typography variant="body1" sx={{ mx: 2.5, color: "white", mb: 1, maxWidth: "60%" }}>
                    Unlimited retries on Journeys & Bytes.
                </Typography>
                <Typography variant="body1" sx={{ mx: 2.5, color: "white", mt: 1, maxWidth: "60%", mb: subscription && !subscription.usedFreeTrial && !isMobile ? 1 : undefined }}>
                    Freeze your Streak.
                </Typography>
                {showReferralPage ? renderReferralPage() : renderMainPage()}
                {!showReferralPage && (
                    <Box sx={{
                        display: 'inline-flex',
                        width: "100%",
                        justifyContent: "space-between",
                    }}>
                        <Typography
                            variant="body1"
                            sx={{ mx: 2, color: "white", cursor: "pointer" }}
                            align="center"
                            component="a"
                            href="/premium"
                            onClick={(e) => {
                                e.preventDefault();
                                window.open("/premium", "_blank");
                            }}
                        >
                            Learn More About Pro
                        </Typography>
                        <Image
                            height={36}
                            width={150}
                            style={{
                                marginLeft: "auto",
                                marginRight: "16px"
                            }}
                            src={theme.palette.mode === "light" ? stripeBlack : stripeWhite}
                            alt=""
                        />
                    </Box>
                )}
            </Box>
        </Dialog>
    );
};

export default GoProDisplay;

