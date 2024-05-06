'use client'
import * as React from "react";
import {useEffect} from "react";
import {Box, Button, createTheme, CssBaseline, PaletteMode} from "@mui/material";
import {getAllTokens} from "@/theme";
import {useAppDispatch, useAppSelector} from "@/reducers/hooks";
import {initialAuthState, selectAuthState, updateAuthState} from "@/reducers/auth/auth";
import config from "@/config";
import swal from "sweetalert";
import {AwesomeButton} from "react-awesome-button";
import 'react-awesome-button/dist/styles.css';

import premiumImage from "@/img/croppedPremium.png";
import premiumGorilla from "@/img/pro/premiumGorilla.png";
import codeTeacher from "@/img/premiumPageIcons/graduation-cap.svg"
import streakFreeze from "@/img/premiumPageIcons/ice-cube.svg"
import workspaces from "@/img/premiumPageIcons/settings.svg"
import resources from "@/img/premiumPageIcons/technology.svg"
import privateWorkspace from "@/img/premiumPageIcons/padlock.svg"
import vscodeTheme from "@/img/premiumPageIcons/coding.svg"
import Image from "next/image";
import {useRouter, useSearchParams} from "next/navigation";

function AboutPagePremium() {
    let userPref = localStorage.getItem('theme')

    const [mode, setMode] = React.useState<PaletteMode>(userPref === 'light' ? 'light' : 'dark');

    const theme = React.useMemo(() => createTheme(getAllTokens(mode)), [mode]);

    // load auth state from storage
    const authState = useAppSelector(selectAuthState);

    const [loading, setLoading] = React.useState(false)
    const [inTrial, setInTrial] = React.useState(false)
    const [membership, setMembership] = React.useState(0)
    const [membershipDates, setMembershipDates] = React.useState({start: 0, last: 0, upcoming: 0})


    let router = useRouter();
    let dispatch = useAppDispatch();

    const stripeNavigate = async () => {
        let res = await fetch(
            `${config.rootPath}/api/stripe/premiumMembershipSession`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: '{}',
                credentials: 'include'
            }
        ).then(async (response) => response.json())

        if (res["message"] === "You must be logged in to access the GIGO system.") {
            let authState = Object.assign({}, initialAuthState)
            // @ts-ignore
            dispatch(updateAuthState(authState))
            router.push("/login?forward=" + encodeURIComponent(window.location.pathname))
        }
        if (res !== undefined && res["return url"] !== undefined) {
            window.location.replace(res["return url"])
        }
    }

    const getSubData = async () => {
        let follow = fetch(
            `${config.rootPath}/api/user/subscription`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: '{}',
                credentials: 'include'
            }
        ).then(async (response) => response.json())

        const [res] = await Promise.all([
            follow
        ])

        if (res === undefined) {
            swal("There has been an issue loading data. Please try again later.")
        }

        setMembershipDates({
            start: res["membershipStart"],
            last: res["lastPayment"],
            upcoming: res["upcomingPayment"]
        })
        setInTrial(res["inTrial"])
        setMembership(res["subscription"])

    }

    const getCountdown = (upcomingDateInSeconds: number) => {
        const upcomingDate = upcomingDateInSeconds * 1000; // Convert to milliseconds
        const now = new Date().getTime();
        const differenceInMilliseconds = upcomingDate - now;

        if (differenceInMilliseconds <= 0) {
            return "Expired";
        }

        const days = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
        const hours = Math.floor((differenceInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((differenceInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((differenceInMilliseconds % (1000 * 60)) / 1000);

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    // Changed "Become A Pro" to "Stay A Pro"

    useEffect(() => {
        if (authState.authenticated)
            getSubData()
    }, [])

    let height = 200
    let width = 200

    if (window.innerWidth <= 1000) {
        height = 180
        width = 180
    }

    let textWidth = "250px"

    if (window.innerWidth <= 1000) {
        if (window.innerWidth <= 280) {
            textWidth = "150px"
        } else {
            textWidth = "200px"
        }
    }

    const query = useSearchParams();
    const isMobile = query.get("viewport") === "mobile";

    return (
        <CssBaseline>
            <div>
                <Box style={!isMobile ? {
                    width: "100%",
                    height: "500px",
                    backgroundColor: theme.palette.secondary.light
                } : {width: "100%", height: "850px", backgroundColor: theme.palette.secondary.light}}>
                    <div style={!isMobile ? {
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-evenly"
                    } : {width: "100%", display: "flex", flexDirection: "column", height: "100%"}}>
                        <div style={!isMobile ? {
                            position: "relative",
                            top: "150px"
                        } : {position: "relative", height: "100%", top: "50px"}}>
                            {inTrial ? (
                                <div style={!isMobile ? {} : {
                                    left: "20px",
                                    position: "relative",
                                    width: "90%",
                                    lineHeight: 1.5
                                }}>
                                    <h1 style={{top: '1%'}}>
                                        1 Month Trial Expires in{' '}
                                        {!isMobile ? (
                                            <span style={!isMobile ? {
                                                backgroundColor: 'rgba(256, 256, 256, 0.6)', // adjust the transparency by changing the alpha value
                                                padding: '10px',
                                                borderRadius: '15px',
                                                marginLeft: '10px', // adjust the space between the text and the date
                                            } : {
                                                backgroundColor: 'rgba(256, 256, 256, 0.6)', // adjust the transparency by changing the alpha value
                                                padding: '10px',
                                                borderRadius: '15px',
                                                marginLeft: '10px', // adjust the space between the text and the date
                                                fontSize: "18px"
                                            }}>
                                                {getCountdown(membershipDates.upcoming)}
                                            </span>
                                        ) : (
                                            <div style={!isMobile ? {} : {marginTop: "20px"}}>
                                                <span style={!isMobile ? {
                                                    backgroundColor: 'rgba(256, 256, 256, 0.6)', // adjust the transparency by changing the alpha value
                                                    padding: '10px',
                                                    borderRadius: '15px',
                                                    marginLeft: '10px', // adjust the space between the text and the date
                                                } : {
                                                    backgroundColor: 'rgba(256, 256, 256, 0.6)', // adjust the transparency by changing the alpha value
                                                    padding: '10px',
                                                    borderRadius: '15px',
                                                    marginLeft: '10px', // adjust the space between the text and the date
                                                    fontSize: "18px"
                                                }}>
                                                    {getCountdown(membershipDates.upcoming)}
                                                </span>
                                            </div>
                                        )}
                                    </h1>
                                    {/*<h4> Dont want To see it go?</h4>*/}


                                    <h4>Don&#39;t want to see it go? Only $8/mo. Cancel anytime.</h4>
                                    <AwesomeButton style={{
                                        width: "auto",
                                        '--button-primary-color': theme.palette.secondary.main,
                                        '--button-primary-color-dark': theme.palette.secondary.dark,
                                        '--button-primary-color-light': theme.palette.text.primary,
                                        '--button-primary-color-hover': theme.palette.secondary.main,
                                        fontSize: "14px"
                                    }} type="primary" onPress={() => stripeNavigate()}>
                                        <Image src={premiumImage} alt={""}/>
                                    </AwesomeButton>
                                </div>
                            ) : membership !== 1 ? (
                                <div style={!isMobile ? {} : {
                                    left: "20px",
                                    position: "relative",
                                    width: "90%"
                                }}>
                                    <h1>Become a Pro</h1>
                                    <h4>Only $8/mo. Cancel anytime.</h4>
                                    <AwesomeButton style={{
                                        width: "auto",
                                        '--button-primary-color': theme.palette.secondary.main,
                                        '--button-primary-color-dark': theme.palette.secondary.dark,
                                        '--button-primary-color-light': theme.palette.text.primary,
                                        '--button-primary-color-hover': theme.palette.secondary.main,
                                        fontSize: "14px"
                                    }} type="primary" onPress={() => stripeNavigate()}>
                                        <Image src={premiumImage} alt={""}/>
                                    </AwesomeButton>
                                </div>
                            ) : (
                                <div style={!isMobile ? {} : {
                                    position: "relative",
                                    left: "20px",
                                    width: "90%",
                                    lineHeight: 1.5
                                }}>
                                    <h1>
                                        It Feels Good to Be A Pro
                                    </h1>
                                    <h4>No Limits. No Restrictions. True Freedom.</h4>
                                    <AwesomeButton style={{
                                        width: "auto",
                                        '--button-primary-color': theme.palette.secondary.main,
                                        '--button-primary-color-dark': theme.palette.secondary.dark,
                                        '--button-primary-color-light': theme.palette.text.primary,
                                        '--button-primary-color-hover': theme.palette.secondary.main,
                                        fontSize: "14px"
                                    }} type="primary" href={"/settings"} onPress={() => {
                                        window.sessionStorage.setItem("accountsPage", "membership");
                                    }}>
                                        <span>Manage Plan</span>
                                    </AwesomeButton>
                                </div>
                            )
                            }

                        </div>
                        <div>
                            <Image src={premiumGorilla} alt={""}/>
                        </div>
                    </div>
                </Box>
                <div style={!isMobile ? {height: "200px"} : {height: "100px"}}/>
                <Box>
                    <div style={!isMobile ? {
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        justifyContent: "space-evenly"
                    } : {display: "flex", flexDirection: "column", width: "100%", alignItems: "center"}}>
                        <div style={!isMobile ? {} : {marginBottom: "50px"}}>
                            <Button disabled={true} style={{backgroundColor: theme.palette.secondary.light}}>
                                <Image alt="" src={codeTeacher} width={width} height={height}/>
                            </Button>
                            <div style={!isMobile ? {width: textWidth} : {
                                width: textWidth,
                                wordWrap: "break-word"
                            }}>
                                <h4>Access to Code Teacher</h4>
                                <div>Your personal Magic tutor. Code Teacher works along side you to help you learn to
                                    code and solve problems.
                                </div>
                            </div>
                        </div>
                        <div style={!isMobile ? {} : {marginBottom: "50px"}}>
                            <Button disabled={true} style={{backgroundColor: theme.palette.secondary.light}}>
                                <Image alt="" src={privateWorkspace} width={width} height={height}/>
                            </Button>
                            <div style={!isMobile ? {width: textWidth} : {
                                width: textWidth,
                                wordWrap: "break-word"
                            }}>
                                <h4>Private Workspaces</h4>
                                <div>Keep your code personal. Work on projects privately, developing your skills in
                                    stealth mode.
                                </div>
                            </div>
                        </div>
                        <div style={!isMobile ? {} : {marginBottom: "50px"}}>
                            <Button disabled={true} style={{backgroundColor: theme.palette.secondary.light}}>
                                <Image alt="" src={resources} width={width} height={height}/>
                            </Button>
                            <div style={!isMobile ? {width: textWidth} : {
                                width: textWidth,
                                wordWrap: "break-word"
                            }}>
                                <h4>More Workspace Resources</h4>
                                <div>Get Access to 8 cpu cores, 8GB ram and 50GB disk. Run projects faster, reduce build
                                    times, and get the best experience.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{height: "100px"}}/>
                    <div style={!isMobile ? {
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        justifyContent: "space-evenly"
                    } : {display: "flex", flexDirection: "column", width: "100%", alignItems: "center"}}>
                        <div style={!isMobile ? {} : {marginBottom: "50px"}}>
                            <Button disabled={true} style={{backgroundColor: theme.palette.secondary.light}}>
                                <Image alt="" src={workspaces} width={width} height={height}/>
                            </Button>
                            <div style={!isMobile ? {width: textWidth} : {
                                width: textWidth,
                                wordWrap: "break-word"
                            }}>
                                <h4>Three Concurrent DevSpaces</h4>
                                <div>Run all the code you need, as much as you need. Work on multiple projects at the
                                    same time or with up to three concurrent DevSpaces.
                                </div>
                            </div>
                        </div>
                        <div style={!isMobile ? {} : {marginBottom: "50px"}}>
                            <Button disabled={true} style={{backgroundColor: theme.palette.secondary.light}}>
                                <Image alt="" src={streakFreeze} width={width} height={height}/>
                            </Button>
                            <div style={!isMobile ? {width: textWidth} : {
                                width: textWidth,
                                wordWrap: "break-word"
                            }}>
                                <h4>Two Streak Freezes a Week</h4>
                                <div>Keep your streak longer. Don&#39;t let a bad week kill your awesome streak! Streak
                                    freezes preserve your streak on days that you can&#39;t find the time.
                                </div>
                            </div>
                        </div>
                        <div style={!isMobile ? {} : {marginBottom: "50px"}}>
                            <Button disabled={true} style={{backgroundColor: theme.palette.secondary.light}}>
                                <Image alt="" src={vscodeTheme} width={width} height={height}/>
                            </Button>
                            <div style={!isMobile ? {width: textWidth} : {
                                width: textWidth,
                                wordWrap: "break-word"
                            }}>
                                <h4>Premium VsCode Theme</h4>
                                <div>A unique code theme to help you see the errors faster. Code the GIGO way with the
                                    custom GIGO editor theme!
                                </div>
                            </div>
                        </div>
                    </div>
                </Box>
                <div style={!isMobile ? {height: "200px"} : {height: "100px"}}/>
            </div>
        </CssBaseline>
    );
}

export default AboutPagePremium;