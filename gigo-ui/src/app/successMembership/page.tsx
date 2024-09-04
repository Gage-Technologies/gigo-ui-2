'use client'
import React, {useState} from "react"
import {Box, Typography} from "@mui/material";
import config from "@/config";
import {decodeToken} from "react-jwt";
import {sleep} from "@/services/utils";
import {LoadingButton} from "@mui/lab";
import {themeHelpers} from "@/theme";
import {Helmet, HelmetProvider} from "react-helmet-async";
import { useAppDispatch, useAppSelector } from "@/reducers/hooks";
import { TutorialState, initialAuthStateUpdate, selectAuthState, updateAuthState } from "@/reducers/auth/auth";

export default function StripeSuccessMembership() {
    const dispatch = useAppDispatch();
    const authState = useAppSelector(selectAuthState);

    const [sessionReloading, setSessionReloading] = useState(false);

    const [failed, setFailed] = useState(false);

    const updateToken = async (): Promise<boolean> => {
        let res = await fetch(
            `${config.rootPath}/api/auth/updateToken`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: '{}',
                credentials: 'include'
            }
        ).then(async (res) => await res.json())

        if (res && res["token"]) {
            let auth: {
                [key: string]: any
            } | null = decodeToken(res["token"]);
            if (!auth) {
                return false;
            }

            if (auth["user_status"] < 1) {
                return false
            }

            let authState = Object.assign({}, initialAuthStateUpdate)
            authState.authenticated = true
            authState.expiration = auth["exp"]
            authState.id = auth["user"]
            authState.role = auth["user_status"]
            authState.email = auth["email"]
            authState.phone = auth["phone"]
            authState.userName = auth["user_name"]
            authState.thumbnail = auth["thumbnail"]
            authState.backgroundColor = auth["color_palette"]
            authState.backgroundName = auth["name"]
            authState.backgroundRenderInFront = auth["render_in_front"]
            authState.exclusiveContent = auth["exclusive_account"]
            authState.exclusiveAgreement = auth["exclusive_agreement"]
            authState.tutorialState = auth["tutorials"] as TutorialState
            authState.tier = auth["tier"]
            authState.inTrial = auth["in_trial"]
            authState.alreadyCancelled = auth["already_cancelled"]
            authState.hasPaymentInfo = auth["has_payment_info"]
            authState.hasSubscription = auth["has_subscription"]
            authState.lastRefresh = Date.now()
            authState.usedFreeTrial = auth["used_free_trial"]
            authState.isAdmin = auth["is_admin"]
            dispatch(updateAuthState(authState))

            await sleep(1000)

            return true
        }

        return false
    }

    const loopUntilPro = async () => {
        setSessionReloading(true);
        for (let i = 0; i < 30; i++) {
            if (await updateToken()) {
                setSessionReloading(false);
                return
            }

            await sleep(1000);
        }
        setFailed(true)
        setSessionReloading(false);
    }

    React.useEffect(() => {
        if (authState.role >= 1 && authState.lastRefresh && Date.now() - authState.lastRefresh < 3_000)
            return
        loopUntilPro()
    }, [])

    return (
        <>
            <HelmetProvider>
                <Helmet>
                    {/* Twitter conversion tracking event code */}
                    {authState.authenticated && authState.id != "" && authState.role > 0 && (
                        <script type="text/javascript">
                            {`
                              // Insert Twitter Event ID
                              twq('event', 'tw-ojhyf-ojhyx', {
                                value: 15.00,
                                conversion_id: "${authState.id}"
                              });
                            `}
                        </script>
                    )}
                    {/* End Twitter conversion tracking event code */}
                </Helmet>
            </HelmetProvider>
            <Box sx={{
                backgroundColor: "black",
                backgroundImage: `url(${config.rootPath}/cloudstore/images/login_background.jpg)`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                overflowX: "hidden",
                msOverflowX: "hidden",
                overflowY: "hidden",
                height: "100vh",
                width: "100vw",
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Box
                    sx={{
                        width: window.innerWidth < 1000 ? "90vw" : undefined,
                        maxWidth: window.innerWidth < 1000 ? undefined : '800px',
                        textAlign: 'center',
                        padding: '2rem',
                        overflowY: 'hidden',
                        borderRadius: "10px",
                        ...themeHelpers.frostedGlass
                    }}
                >
                    {sessionReloading && authState.role !== 1 ? (
                        <>
                            <Typography variant="h4">
                                Thank You For Your Purchase!
                            </Typography>
                            <Typography variant="h5" sx={{mb: 2}}>
                                Hold on a minute while we get your new pro status setup.
                            </Typography>
                        </>
                    ) : failed ? (
                        <>
                            <Typography variant="h4">
                                Oops... Something Went Wrong
                            </Typography>
                            <Typography variant="h5" sx={{mb: 2}}>
                                We haven&apos;t been able to validate your payment. Try loggin out and back in.
                            </Typography>
                        </>
                    ) : (
                        <>
                            <Typography variant="h4">
                                Congratulations!
                            </Typography>
                            <Typography variant="h5" sx={{mb: 2}}>
                                You&apos;re a Pro!
                            </Typography>
                        </>
                    )}
                    <LoadingButton
                        loading={sessionReloading}
                        href="/home"
                        variant={"contained"}
                    >
                        Take Me Home
                    </LoadingButton>
                </Box>
            </Box>
        </>
    )
}