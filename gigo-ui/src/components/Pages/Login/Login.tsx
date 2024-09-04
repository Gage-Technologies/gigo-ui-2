'use client'
import * as React from "react";
import { useEffect, useState } from "react";
import {
    Box,
    Button,
    createTheme,
    CssBaseline,
    Grid,
    PaletteMode,
    TextField,
    ThemeProvider,
    Typography
} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import config from "@/config";
import { authorize, authorizeGithub, authorizeGoogle } from "@/services/auth";
import { gapi } from "gapi-script";
import { useGoogleLogin } from "@react-oauth/google";
import githubNameLight from "@/img/github/gh_name_light.png"
import githubNameDark from "@/img/github/gh_name_dark.png"
import githubLogoLight from "@/img/github/gh_logo_light.svg"
import githubLogoDark from "@/img/github/gh_logo_dark.svg"
import LoginGithub from "@/components/Login/Github/LoginGithub";
import googleDark from "@/img/login/google-logo-white.png"
import googleLight from "@/img/login/google_light.png"
import googleLogo from "@/img/login/google_g.png"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { LoadingButton } from "@mui/lab";
import ReactGA from "react-ga4";
import { useTracking } from 'react-tracking';
import { RecordWebUsage, WebTrackingEvent } from "@/models/web_usage";
import GigoCircleIcon from "@/icons/GigoCircleLogo";
import { sleep } from "@/services/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch } from "@/reducers/hooks";
import { TutorialState, initialAuthStateUpdate, updateAuthState } from "@/reducers/auth/auth";
import { theme, isHoliday, Holiday } from "@/theme";
import Image from "next/image";
import useIsMobile from "@/hooks/isMobile";


function Login(this: any) {
    const { trackEvent } = useTracking({}, {
        dispatch: (data: any) => {
            fetch(
                `${config.rootPath}/api/recordUsage`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data),
                    credentials: 'include'
                }
            )
        }
    });

    const searchParams = useSearchParams();
    const forwardPath = searchParams.get("forward") ? decodeURIComponent(searchParams.get("forward") || "") : "";

    const isMobile = useIsMobile();

    const styles = {
        themeButton: {
            display: "flex",
            justifyContent: "right"
        },
        login: {
            display: "flex",
            marginLeft: "-.7%",
            marginTop: "5vh",
            paddingLeft: "45%",
            fontSize: "225%"
        },
        textField: {
            color: `text.secondary`
        },
        card: {
            backgroundColor: theme.palette.background
        }
    };
    // Update the theme only if the mode changes
    const [username, setUsername] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [external, setExternal] = React.useState(false)
    const [externalLogin, setExternalLogin] = React.useState("")
    const [externalToken, setExternalToken] = React.useState("")
    const [showPass, setShowPass] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [ghConfirm, setGhConfirm] = React.useState(false)
    const ShowButton = () => (
        <Button
            onClick={() => setShowPass(!showPass)}>
            {showPass ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </Button>
    )

    ReactGA.initialize("G-38KBFJZ6M6");

    let router = useRouter();
    const dispatch = useAppDispatch();
    useEffect(() => {
        const initClient = () => {
            gapi.auth2.init({
                clientId: config.googleClient,
                scope: 'profile'
            });
        };
        gapi.load('client:auth2', initClient)
    }, [])

    // transferring data from google login
    const onSuccessGoogle = async (usr: any) => {
        setExternal(true)
        setExternalToken(usr.access_token)
        setExternalLogin("Google")
    }

    const googleButton = useGoogleLogin({
        onSuccess: (usr: any) => onSuccessGoogle(usr)
    });

    const startGoogle = () => {
        const payload: RecordWebUsage = {
            host: window.location.host,
            event: WebTrackingEvent.LoginStart,
            timespent: 0,
            path: location.pathname,
            latitude: null,
            longitude: null,
            metadata: { "auth_provider": "google" },
        }
        trackEvent(payload);
        googleButton()
    }

    const googleSignIn = async () => {
        setLoading(true)
        let auth = await authorizeGoogle(externalToken, password);

        if (auth === "User not found") {
            //@ts-ignore
            swal("This google account is not linked with GIGO. Try logging in with the same email or sign up!");
            setLoading(false)
            return
        }

        // @ts-ignore
        if (auth["user"] !== undefined) {
            let authState = Object.assign({}, initialAuthStateUpdate)
            authState.authenticated = true
            // @ts-ignore
            authState.expiration = auth["exp"]
            // @ts-ignore
            authState.id = auth["user"]
            // @ts-ignore
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
            authState.usedFreeTrial = auth["used_free_trial"]
            authState.isAdmin = auth["is_admin"]
            dispatch(updateAuthState(authState))

            await sleep(1000)

            window.location.href = forwardPath || "/home";

        } else {
            if (sessionStorage.getItem("alive") === null || auth["user"] === undefined)
                //@ts-ignore
                swal("Login failed. The provided username and password did not match.");
            setLoading(false)
        }

        const payload: RecordWebUsage = {
            host: window.location.host,
            event: WebTrackingEvent.Login,
            timespent: 0,
            path: location.pathname,
            latitude: null,
            longitude: null,
            metadata: { "auth_provider": "google" },
        }
        trackEvent(payload);
    }

    const onSuccessGithub = async (gh: any) => {
        const payload: RecordWebUsage = {
            host: window.location.host,
            event: WebTrackingEvent.LoginStart,
            timespent: 0,
            path: location.pathname,
            latitude: null,
            longitude: null,
            metadata: { "auth_provider": "github" },
        }
        trackEvent(payload);

        setExternal(true)
        setExternalToken(gh["code"])
        setExternalLogin("Github")
        setLoading(true)
        let res = await fetch(
            `${config.rootPath}/api/auth/loginWithGithub`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    external_auth: gh["code"],
                }),
                credentials: 'include'
            }
        ).then(async (response) => response.json())

        if (res["auth"] === false) {
            //@ts-ignore
            swal("Incorrect credentials, please try again");
            setLoading(false)
        }

        setGhConfirm(true)
        setLoading(false)
    }

    const githubConfirm = async () => {
        if (ghConfirm !== true) {
            //@ts-ignore
            swal("BAD")
            setLoading(false)
        }
        setLoading(true)
        let res = await fetch(
            `${config.rootPath}/api/auth/confirmLoginWithGithub`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    password: password,
                }),
                credentials: 'include'
            }
        ).then(async (response) => response.json())

        let auth = await authorizeGithub(password);

        window.sessionStorage.setItem("loginXP", JSON.stringify(res["xp"]));

        // @ts-ignore
        if (auth["user"] !== undefined) {
            let authState = Object.assign({}, initialAuthStateUpdate)
            authState.authenticated = true
            // @ts-ignore
            authState.expiration = auth["exp"]
            // @ts-ignore
            authState.id = auth["user"]
            // @ts-ignore
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
            authState.usedFreeTrial = auth["used_free_trial"]
            authState.isAdmin = auth["is_admin"]
            dispatch(updateAuthState(authState))

            await sleep(1000)

            window.location.href = forwardPath || "/home";

        } else {
            if (sessionStorage.getItem("alive") === null)
                //@ts-ignore
                swal("Login failed. The provided username or password is incorrect.");
            setLoading(false)
        }

        const payload: RecordWebUsage = {
            host: window.location.host,
            event: WebTrackingEvent.Login,
            timespent: 0,
            path: location.pathname,
            latitude: null,
            longitude: null,
            metadata: { "auth_provider": "github" },
        }
        trackEvent(payload);
    }

    const onFailureGithub = (gh: any) => {
        ;
    };

    const retrieveOTPLink = async () => {
        // @ts-ignore
        let res = await call(
            "/api/otp/generateUserOtpUri",
            "post",
            null,
            null,
            null,
            //@ts-ignore
            {},
            null,
            config.rootPath
        );

        if (res === undefined) {
            if (sessionStorage.getItem("alive") === null)
                //@ts-ignore
                swal(
                    "Server Error",
                    "We failed to retrieve your 2FA QR code. Please try again later."
                );
            setLoading(false)
            return;
        }

        if (res["message"] === "You must be logged in to access the GIGO system.") {
            let authState = Object.assign({}, initialAuthStateUpdate)
            // @ts-ignore
            dispatch(updateAuthState(authState))
            router.push("/login")
        }

        if (res["message"] !== undefined) {
            if (sessionStorage.getItem("alive") === null)
                //@ts-ignore
                swal(
                    "Server Error",
                    res["message"] !== "logout"
                        ? res["message"]
                        : "An unexpected error occurred while retrieving your 2FA QR code. Please try again later."
                );
            setLoading(false)
            return;
        }

        if (res["otp_uri"] === undefined) {
            if (sessionStorage.getItem("alive") === null)
                //@ts-ignore
                swal(
                    "Server Error",
                    "An unexpected error occurred while retrieving your 2FA QR code. Please try again later."
                );
            setLoading(false)
            return;
        }

        // this.setState({
        //     otpLink: res["otp_uri"]
        // });
    }

    const loginFunction = async () => {
        setLoading(true)

        const payload: RecordWebUsage = {
            host: window.location.host,
            event: WebTrackingEvent.LoginStart,
            timespent: 0,
            path: location.pathname,
            latitude: null,
            longitude: null,
            metadata: {},
        }
        trackEvent(payload);

        let auth = await authorize(username, password);

        // @ts-ignore
        if (auth["user"] !== undefined) {
            let authState = Object.assign({}, initialAuthStateUpdate)
            authState.authenticated = true
            // @ts-ignore
            authState.expiration = auth["exp"]
            // @ts-ignore
            authState.id = auth["user"]
            // @ts-ignore
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
            authState.usedFreeTrial = auth["used_free_trial"]
            authState.isAdmin = auth["is_admin"]
            dispatch(updateAuthState(authState))


            await sleep(1000)

            window.location.href = forwardPath || "/home";
            const payload: RecordWebUsage = {
                host: window.location.host,
                event: WebTrackingEvent.Login,
                timespent: 0,
                path: location.pathname,
                latitude: null,
                longitude: null,
                metadata: {},
            }
            trackEvent(payload);
        } else if (auth.includes("Too many failed attempts")) {
            //@ts-ignore
            swal("Login failed.", auth);
            setLoading(false)
        } else {
            if (sessionStorage.getItem("alive") === null || auth["user"] === undefined) {
                let messageString = "The provided username and password did not match. You have " + auth[0] + " attempts remaining."
                //@ts-ignore
                swal("Login Failed", messageString);
                setLoading(false)
            }
        }
    }

    let renderLogin = () => {
        return (
            <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
                justifyContent={"center"}
                sx={{
                    width: "100%",
                    height: "100%",
                }}
            >
                <Box
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    sx={{
                        backgroundColor: theme.palette.background.default,
                        p: isMobile ? 2 : 4,
                        borderRadius: 2,
                        maxWidth: "calc(100vw - 40px)",
                    }}
                >
                    <Typography component={"div"} variant={"h5"} sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                    }}>
                        Sign In
                    </Typography>
                    <TextField
                        label={"Username/Email"}
                        variant={`outlined`}
                        size={!isMobile ? `medium` : `small`}
                        color={"primary"}
                        helperText={"Please enter your username or email"}
                        inputProps={
                            styles.textField
                        }
                        onChange={e => setUsername(e.target.value)}
                        sx={{
                            maxWidth: "375px",
                            mt: "3.5vh",
                            minWidth: "275px",
                        }}
                    >
                    </TextField>
                    <TextField
                        label={"Password"}
                        variant={`outlined`}
                        size={!isMobile ? `medium` : `small`}
                        type={showPass ? `text` : `password`}
                        color={`primary`}
                        helperText={"Please enter your password"}
                        onKeyDown={
                            e => {
                                if (e.key === "Enter") {
                                    loginFunction()
                                }
                            }}
                        onChange={e => setPassword(e.target.value)}
                        sx={{
                            maxWidth: "375px",
                            mt: "3.5vh",
                            paddingBottom: "1.5vw",
                            minWidth: "275px",
                        }}
                        InputProps={{
                            endAdornment: <ShowButton />
                        }}
                    >
                    </TextField>
                    <LoadingButton
                        loading={loading}
                        onClick={async () => {
                            await loginFunction()
                        }}
                        variant={`contained`}
                        color={"primary"}
                        endIcon={<SendIcon />}
                        sx={{
                            borderRadius: 1,
                            minHeight: "5vh",
                            minWidth: '10vw',
                            justifyContent: "center",
                            lineHeight: "35px",
                            width: !isMobile ? '' : '50vw',
                        }}
                    >
                        Login
                    </LoadingButton>
                    <Button
                        onClick={async () => {
                            router.push("/forgotPassword")
                        }}
                        variant={`text`}
                        color={"primary"}
                        sx={{
                            width: !isMobile ? '15vw' : '80vw',
                            justifyContent: "center",
                            paddingTop: !isMobile ? '' : "8%",
                        }}
                    >
                        Forgot Password
                    </Button>
                    <Button
                        onClick={async () => {
                            router.push("/signup?forward=" + encodeURIComponent(forwardPath || ""))
                        }}
                        variant={`text`}
                        color={"primary"}
                        sx={{
                            width: !isMobile ? '15vw' : '60vw',
                            justifyContent: "center",
                            paddingTop: !isMobile ? '' : "5%",
                        }}
                    >
                        No Account? Register
                    </Button>
                    <Typography component={"div"} variant={"h6"} sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        paddingTop: "25px"
                    }}>
                        or sign in with linked account:
                    </Typography>
                    <Grid container sx={{
                        justifyContent: "center",
                        width: "100%",
                        paddingBottom: "10px"
                    }} direction="row" alignItems="center">
                        <Button onClick={() => startGoogle()} sx={{
                            padding: "15px"
                        }}>
                            <Box display="inline-flex" justifyContent="center" alignItems="center" alignContent="center">
                                <Box display={"flex"} justifyContent="center" alignItems="center" alignContent="center">
                                    <Image
                                        width={40}
                                        height={40}
                                        alt={"Google Logo"}
                                        src={googleLogo}
                                    />
                                </Box>
                                <Box display={"flex"} justifyContent="center" alignItems="center" alignContent="center" sx={{ height: "100%", marginLeft: "5px" }}>
                                    <Image
                                        width={72}
                                        height={25}
                                        alt={"Google Name"}
                                        src={theme.palette.mode === "light" ? googleLight : googleDark}
                                    />
                                </Box>
                            </Box>
                        </Button>
                        <LoginGithub
                            color={"primary"}
                            sx={{
                                justifyContent: "center",
                                padding: "15px"
                            }}
                            clientId="9ac1616be22aebfdeb3e"
                            redirectUri={""}
                            onSuccess={onSuccessGithub}
                            onFailure={onFailureGithub}
                        >
                            <Box display="inline-flex" justifyContent="center" alignItems="center" alignContent="center">
                                <Box display={"flex"} justifyContent="center" alignItems="center" alignContent="center">
                                    <Image
                                        width={40}
                                        height={40}
                                        alt={"Github Logo"}
                                        src={theme.palette.mode === "light" ? githubLogoDark : githubLogoLight}
                                    />
                                </Box>
                                <Box display={"flex"} justifyContent="center" alignItems="center" alignContent="center" sx={{ height: "100%", marginLeft: "5px" }}>
                                    <Image
                                        width={68}
                                        height={28}
                                        alt={"Github Name"}
                                        src={theme.palette.mode === "light" ? githubNameDark : githubNameLight}
                                    />
                                </Box>
                            </Box>
                        </LoginGithub>
                    </Grid>
                </Box>
            </Box>
        )
    }

    let renderExternal = () => {
        return (
            <Box sx={{
                display: 'flex', // Enable Flexbox
                flexDirection: 'column', // Stack children vertically
                justifyContent: 'center', // Center children vertically in the container
                alignItems: 'center', // Center children horizontally in the container
                height: '100vh', // Full viewport height
            }}>
                <Grid container justifyContent="center">
                    <Grid container
                        sx={{
                            justifyContent: "center",
                            outlineColor: "black",
                            width: !isMobile ? "35%" : "70%",
                            borderRadius: 1,
                            backgroundColor: theme.palette.background.default,
                            paddingBottom: "1.5vw"
                        }} direction="column" alignItems="center"
                    >
                        <Typography component={"div"} variant={"h5"} sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            paddingTop: "10px",
                        }}>
                            Enter Password
                        </Typography>

                        <TextField
                            label={"Password"}
                            variant={`outlined`}
                            size={`medium`}
                            type={showPass ? `text` : `password`}
                            color={`primary`}
                            helperText={"Please enter your password"}
                            onKeyDown={
                                e => {
                                    if (e.key === "Enter") {
                                        externalLogin === "Google" ? googleSignIn() : githubConfirm()
                                    }
                                }}
                            onChange={e => setPassword(e.target.value)}
                            sx={{
                                width: !isMobile ? "28vw" : "60vw",
                                marginLeft: "3.5vw",
                                marginRight: "3.5vw",
                                mt: "3.5vh",
                                paddingBottom: !isMobile ? "1.5vh" : "3.0vh"
                            }}
                            InputProps={{
                                endAdornment: <ShowButton />
                            }}
                        >
                        </TextField>
                        <LoadingButton
                            loading={loading}
                            onClick={() => {
                                externalLogin === "Google" ? googleSignIn() : githubConfirm()
                            }}
                            variant={`contained`}
                            color={"primary"}
                            endIcon={<SendIcon />}
                            sx={{
                                borderRadius: 1,
                                minHeight: "5vh",
                                minWidth: '15vw',
                                justifyContent: "center",
                                lineHeight: "35px",
                            }}
                        >
                            Login
                        </LoadingButton>
                        <Typography variant="h5" component="div"
                            sx={{ fontSize: "75%" }}
                        >
                            Haven&apos;t linked your account yet?
                        </Typography>
                        <Button
                            onClick={async () => {
                                router.push("/signup?forward=" + encodeURIComponent(forwardPath || ""))
                            }}
                            variant={`text`}
                            color={"primary"}
                        >
                            sign up
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        )
    }

    const aspectRatio = useAspectRatio();

    const iconContainerStyles: React.CSSProperties = {
        width: aspectRatio === '21:9' ? '100vw' : '100vw',
        height: aspectRatio === '21:9' ? '100vh' : '100vh', // Set to 100% of viewport height
        position: 'absolute',
        zIndex: 0,
    };

    const iconStyles: React.CSSProperties = {
        width: '100%',
        height: '100%',
    };

    const containerStyles: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        height: '90vh',
        width: '100vw',
        top: '10%',
        position: 'absolute',
        zIndex: 2,

    };


    const vignetteStyles: React.CSSProperties = {
        width: '100vw',
        height: '100vh',
        background: `linear-gradient(270deg, rgba(0,0,0,0) 51%, rgba(0,0,0,0) 80%, ${hexToRGBA(theme.palette.background.default)} 95%, ${hexToRGBA(theme.palette.background.default)}), linear-gradient(90deg, rgba(0,0,0,0) 51%, rgba(0,0,0,0) 80%, ${hexToRGBA(theme.palette.background.default)} 95%, ${hexToRGBA(theme.palette.background.default)}), linear-gradient(180deg, rgba(0,0,0,0) 51%, rgba(0,0,0,0) 52%, ${hexToRGBA(theme.palette.background.default)} 92%, ${hexToRGBA(theme.palette.background.default)}), linear-gradient(0deg, rgba(0,0,0,0) 51%, rgba(0,0,0,0) 92%, ${hexToRGBA(theme.palette.background.default)} 98%, ${hexToRGBA(theme.palette.background.default)}`, // Vignette gradient
        position: 'absolute',
        left: '0%',
        bottom: '0%',
        zIndex: 1, // Set a higher zIndex to appear above the SVG
    };

    const renderLanding = () => {
        const holiday = isHoliday()
        if (aspectRatio === "21:9") {
            if (holiday === Holiday.Christmas) {
                return `${config.rootPath}/cloudstore/images/christmas-login-21-9.png`
            }
            return `${config.rootPath}/cloudstore/images/login_background-21-9.jpg`
        } else {
            if (holiday === Holiday.Christmas) {
                return `${config.rootPath}/cloudstore/images/christmas-login.png`
            }
            return `${config.rootPath}/cloudstore/images/login_background.jpg`
        }
    }

    return (
        <div
            style={{
                backgroundColor: `${theme.palette.background.default}`,
                backgroundImage: `url(${renderLanding()})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                width: '100vw',
                height: '100vh',
                overflow: 'hidden',
            }}
        >
            <ThemeProvider theme={theme}>
                <CssBaseline>
                    {/* Your Logo */}
                    {!isMobile && (
                        <Box display={"inline-flex"} sx={{
                            position: 'absolute',
                            top: '20px', // Adjust the top position as needed
                            left: '35px', // Adjust the left position as needed
                            height: 'auto',
                            color: "white"
                        }}>
                            <GigoCircleIcon
                                sx={{
                                    width: '120px', // Adjust the width as needed
                                    height: 'auto', // Maintain aspect ratio
                                    color: 'white',
                                }}
                            />
                            {/* Slogan */}
                            <Typography
                                variant="body1"
                                style={{
                                    paddingTop: "15px",
                                    paddingLeft: "15px",
                                    fontWeight: 'bold', // Customize the text style,
                                    fontSize: '2em', // Adjust the font size,
                                    // fontFamily: 'Kanit',
                                    color: 'white',
                                }}
                            >
                                works on our machine.
                            </Typography>
                        </Box>
                    )}
                    {(!external) ? renderLogin() : renderExternal()}
                </CssBaseline>
            </ThemeProvider>
        </div>
    );
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

function hexToRGBA(hex: any, alpha = 1) {
    let r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}


export default Login;