'use client'
import * as React from "react";
import {
    Box,
    Button,
    CssBaseline,
    Grid,
    TextField,
    ThemeProvider,
    Typography,
} from "@mui/material";
import { Holiday, isHoliday, theme } from "@/theme";
import LockPersonIcon from '@mui/icons-material/LockPerson';
import loginImg from "../img/login/login_background.png";
import config from "@/config";
import swal from "sweetalert";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";


function ForgotPassword() {
    const searchParams = useSearchParams()
    const isMobile = searchParams.get("viewport") === "mobile"

    const styles = {
        themeButton: {
            display: "flex",
            justifyContent: "right"
        },
        missingCredentials: {
            display: "flex",
            marginLeft: "auto",
            marginTop: "6%",
            paddingLeft: "34.5%",
            fontSize: "200%"
        },
        textField: {
            color: `text.secondary`
        },
        card: {
            backgroundColor: theme.palette.background
        }
    };

    //const authState = useAppSelector(selectAuthState);

    let router = useRouter();

    const [email, setEmail] = React.useState("")
    const [isEmailValid, setIsEmailValid] = React.useState(false)
    const emailRef = React.useRef("")

    // todo: change to real url after testing
    const url = "www.gigo.dev"

    function isValidEmail(email: string) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function handleEmailChange(e: { target: { value: any; }; }) {
        const newEmail = e.target.value;
        setEmail(newEmail);
        setIsEmailValid(isValidEmail(newEmail));
        emailRef.current = newEmail;
    }

    const sendResetValidation = async () => {

        const currentEmail = emailRef.current

        if (currentEmail === null || currentEmail.length < 5) {
            //@ts-ignore
            swal("Invalid Credentials", "Please enter your username and the email you used to sign up")
            return
        }

        let res = await fetch(
            `${config.rootPath}/api/user/forgotPasswordValidation`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: email, url: url }),
                credentials: "include"
            }
        ).then(res => res.json())

        if (res === undefined || res["message"] === undefined) {
            if (sessionStorage.getItem("alive") === null)
                //@ts-ignore
                swal(
                    "Server Error",
                    "We are unable to connect with the GIGO servers at this time. We're sorry for the inconvenience!"
                );
            return;
        }

        if (res["message"] === "must provide email for password recovery") {
            //@ts-ignore
            swal("Account Not Found", "We could not find an account with that email address and username. Please try again, or create an account if you don't already have one.")
            return
        }

        if (res["message"] === "account not found") {
            //@ts-ignore
            swal("Account Not Found", "We could not find an account with that email address and username. Please try again, or create an account if you don't already have one.")
            return
        }

        if (res["message"] === "failed to store reset token" || res["message"] === "failed to send password reset email") {
            //@ts-ignore
            swal("Server Error", "We are having an issue with the GIGO servers at this time. We're sorry for the inconvenience! Please try again later.")
            return
        }

        if (res["message"] === "Password reset email sent") {
            //@ts-ignore
            swal("Check your Email", "We have sent an email with instructions on how to reset your password.")
            router.push("/login")
        }

    }

    const aspectRatio = useAspectRatio();

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
                backgroundColor: "black",
                backgroundImage: `url(${renderLanding()})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                width: '100vw',
                height: '100vh'
            }}>
            <ThemeProvider theme={theme}>
                <CssBaseline>
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
                                    width: !isMobile ? "35%" : "55%",
                                    borderRadius: 1,
                                    backgroundColor: theme.palette.background.default
                                }} direction="column" alignItems="center"
                            >
                                <Typography component={"div"} variant={"h6"} sx={{
                                    width: !isMobile ? `28vw` : `100%`,
                                    display: "flex",
                                    justifyContent: "center",
                                    paddingTop: "10px"
                                }}>
                                    Forgot Password
                                </Typography>
                                <TextField
                                    label={"Email"}
                                    variant={`outlined`}
                                    color={"primary"}
                                    size={!isMobile ? `medium` : `small`}
                                    helperText={"Please enter the email associated with your account"}
                                    required={true}
                                    inputProps={
                                        styles.textField
                                    }
                                    onChange={handleEmailChange}
                                    sx={{
                                        width: !isMobile ? "23vw" : "90%",
                                        marginLeft: "3.5vw",
                                        marginRight: "3.5vw",
                                        mt: "3.5vh",
                                        mb: "20px"
                                    }}
                                >
                                </TextField>
                                <Button
                                    disabled={!isEmailValid}
                                    onClick={sendResetValidation}
                                    variant={`contained`}
                                    color={"primary"}
                                    endIcon={<LockPersonIcon />}
                                    sx={{
                                        borderRadius: 1,
                                        minHeight: "5vh",
                                        minWidth: '15vw',
                                        justifyContent: "center",
                                        lineHeight: "35px",
                                        marginBottom: "5px"
                                    }}
                                >
                                    Submit
                                </Button>

                                <Button
                                    onClick={async () => {
                                        router.push("/login")
                                    }}
                                    variant={`text`}
                                    color={"primary"}
                                    sx={{
                                        width: !isMobile ? '7vw' : "20vw",
                                        justifyContent: "center",
                                    }}
                                >
                                    Login
                                </Button>
                                <Button
                                    onClick={async () => {
                                        router.push("/signup")
                                    }}
                                    variant={`text`}
                                    color={"primary"}
                                    sx={{
                                        width: !isMobile ? '7vw' : "40vw",
                                        justifyContent: "center",
                                        marginBottom: "15px"
                                    }}
                                >
                                    Sign Up
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
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

export default ForgotPassword;