'use client'
import * as React from "react";
import {useEffect} from "react";
import {Box, Button, CssBaseline, IconButton, Modal, ThemeProvider, Typography,} from "@mui/material";
import {styled} from "@mui/material/styles";
import {theme} from "@/theme";
import {keyframes} from "@emotion/react";
import LinearProgress from "@mui/material/LinearProgress";
import {Fade} from "react-awesome-reveal"
import LootPopup from "./LootPopup";
import {selectAuthState} from "@/reducers/auth/auth";
import {useAppSelector} from "@/reducers/hooks";
import premiumGorilla from "@/img/pro/pro-pop-up-icon-plain.svg"
import proBackground from "@/img/pro/popu-up-backgraound-plain.svg"
import config from "../../config";
import {Close} from "@mui/icons-material";
import {LoadingButton} from "@mui/lab";
import Image from "next/image";
import useIsMobile from "@/hooks/isMobile";

interface IProps {
    oldXP: number;
    newXP: number;
    nextLevel: number;
    maxXP: number;
    levelUp: boolean;
    gainedXP: number;
    reward: string | null;
    renown: number;
    popupClose: () => void | null;
    homePage: boolean;
}

const XpPopup = (props: IProps) => {
    const isMobile = useIsMobile();

    const [isClient, setIsClient] = React.useState(false)
    React.useEffect(() => {
        setIsClient(true)
    }, [])

    const [showConfetti, setShowConfetti] = React.useState(false);

    const [startXP, setStartXP] = React.useState(props.oldXP);
    const [extraXP, setExtraXP] = React.useState(props.newXP - props.oldXP);
    const [totalXP, setTotalXP] = React.useState(props.maxXP);
    const [currentLevel, setCurrentLevel] = React.useState(props.nextLevel);
    const [nextLevel, setNextLevel] = React.useState(props.nextLevel + 1);
    const [xpTitle, setXpTitle] = React.useState(props.gainedXP);
    const [open, setOpen] = React.useState(true);
    const [lootBox, setLootBox] = React.useState(false);
    const [showLoot, setShowLoot] = React.useState(false);
    const [reward, setReward] = React.useState(props.reward);
    const [renown, setRenown] = React.useState(props.renown + 1);
    const [showPro, setShowPro] = React.useState(false);
    const [proMonthlyLink, setProMonthlyLink] = React.useState("");
    const [proYearlyLink, setProYearlyLink] = React.useState("");
    const [proUrlsLoading, setProUrlsLoading] = React.useState(false);

    const [steps, setSteps] = React.useState([{
        content: <h2>Let&#39;s begin our journey!</h2>,
        locale: {skip: <strong aria-label="skip">Skip</strong>},
        placement: 'center',
        target: 'body',
    }, {content: <h2>You earn XP by doing activities on the platform.</h2>, target: '.button', placement: 'bottom'}]);

    const [run, setRun] = React.useState(props.homePage)


    const progressKeyframes = keyframes`
        0% {
            width: ${0}%;
        }
        100% {
            width: ${startXP + extraXP}%;
        }
    `;

    const authState = useAppSelector(selectAuthState);


    useEffect(() => {
        let premium = authState.role.toString()
        // //remove
        // premium = "0"
        if (authState.authenticated && premium === "0") {
            retrieveProUrls()
        }
        if (props.levelUp) {
            setTimeout(function () {
                setLootBox(true)
                setShowConfetti(true);
                setStartXP(0);
                setExtraXP(0);
                setCurrentLevel(currentLevel);
                setNextLevel(nextLevel);
            }, 1800)
        }
    }, [])

    const StyledLinearProgress = styled(LinearProgress)(({theme}) => ({
        height: 50,
        borderRadius: 25,
        outline: "solid 5px grey",
        [`& .MuiLinearProgress-bar`]: {
            borderRadius: 5,
            background: `linear-gradient(to right, #20A51A, #308fe8)`,
            animation: `${progressKeyframes} 1.5s forwards`,
            boxShadow: `0 0 10px #308fe8, 0 0 5px #308fe8`,
        },
    }));

    const confirmButton = React.useCallback(() => {
        if (!isClient) {
            return null
        }

        let premium = authState.role.toString()
        // //remove
        // premium = "0"
        if (premium === "0") {
            setShowPro(proMonthlyLink !== "" || proUrlsLoading)
        } else if (lootBox) {
            setShowLoot(true);
        } else {
            setOpen(false);
            if (props.popupClose !== null) {
                props.popupClose();
            }
            window.sessionStorage.setItem("loginXP", "undefined")
            window.sessionStorage.setItem("attemptXP", "undefined")
        }
    }, [isClient])

    const retrieveProUrls = async (): Promise<{ monthly: string, yearly: string } | null> => {
        setProUrlsLoading(true)
        let res = await fetch(
            `${config.rootPath}/api/stripe/premiumMembershipSession`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: '{}',
                cache: "no-cache",
                credentials: 'include'
            }
        ).then(async (response) => response.json())

        setProUrlsLoading(false)

        if (res !== undefined && res["return url"] !== undefined && res["return year"] !== undefined) {
            setProMonthlyLink(res["return url"])
            setProYearlyLink(res["return year"])
            return {
                "monthly": res["return url"],
                "yearly": res["return year"],
            }
        }

        return null
    }

    const closePopupLoot = React.useCallback(() => {
        if (!isClient) {
            return
        }

        setOpen(false)
        if (props.popupClose !== null) {
            props.popupClose();
        }
        window.sessionStorage.setItem("loginXP", "undefined")
        window.sessionStorage.setItem("attemptXP", "undefined")
    }, [isClient])

    const xpBarMemo = React.useMemo(() => (
        <Box sx={{width: "75%"}}>
            <StyledLinearProgress variant="determinate"/>
        </Box>
    ), [])

    const renderXPPopup = () => {
        if (showLoot) {
            return (
                <div>
                    <LootPopup closePopup={closePopupLoot}
                        //@ts-ignore
                               reward={props.reward}/>
                </div>
            )
        } else if (showPro) {
            return (
                <>
                    <style>
                    </style>
                    <div style={{
                        borderRadius: "10px",
                        padding: "20px",
                        textAlign: "center",
                    }}>
                        <IconButton
                            edge="end"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                if (lootBox) {
                                    setShowLoot(true);
                                    setShowPro(false);
                                } else {
                                    if (!isClient) {
                                        return
                                    }

                                    setOpen(false);
                                    if (props.popupClose !== null) {
                                        props.popupClose();
                                    }
                                    window.sessionStorage.setItem("loginXP", "undefined");
                                    window.sessionStorage.setItem("attemptXP", "undefined");
                                }
                            }}

                            sx={isMobile ? {
                                position: "absolute",
                                top: '20vh',
                                right: '15vw',
                                color: "white"
                            } : {
                                position: "absolute",
                                top: '20vh',
                                right: '38vw', color: "white"
                            }}
                        >
                            <Close/>
                        </IconButton>
                        <Image alt={""} src={premiumGorilla}
                               style={isMobile ? {width: "20%", marginBottom: "5px"} : {
                                   width: "30%",
                                   marginBottom: "20px"
                               }}/>
                        <Typography variant={isMobile ? "h5" : "h4"}
                                    style={{marginBottom: "10px", color: "white"}} align={"center"}>GIGO
                            Pro</Typography>
                        <Typography variant={isMobile ? "body2" : "body1"}
                                    style={{marginLeft: "20px", marginRight: "20px", color: "white"}} align={"center"}>
                            Learn faster with a smarter Code Teacher!
                        </Typography>
                        <Typography variant={isMobile ? "body2" : "body1"}
                                    style={{
                                        marginBottom: "20px",
                                        marginLeft: "20px",
                                        marginRight: "20px",
                                        color: "white"
                                    }}
                                    align={"center"}>
                            Do more with larger DevSpaces!
                        </Typography>
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row",
                            width: "100%"
                        }}>
                            <div style={isMobile ? {
                                backgroundColor: "#070D0D",
                                borderRadius: "10px",
                                padding: "20px",
                                margin: "10px",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                                textAlign: "center",
                                height: "fit-content"
                            } : {
                                backgroundColor: "#070D0D",
                                borderRadius: "10px",
                                padding: "20px",
                                margin: "10px",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                                textAlign: "center",
                                width: "200px"
                            }}>
                                <Typography variant={isMobile ? "subtitle2" : "subtitle1"}
                                            style={{marginBottom: "10px", color: "white"}}
                                            align={"center"}>Monthly</Typography>
                                <Typography variant={isMobile ? "h6" : "h5"}
                                            style={{marginBottom: "10px", color: "white"}}
                                            align={"center"}>$8</Typography>
                                <LoadingButton
                                    loading={proUrlsLoading}
                                    variant="contained"
                                    href={proMonthlyLink}
                                    target="_blank"
                                    style={{backgroundColor: theme.palette.secondary.dark}}
                                >
                                    Select
                                </LoadingButton>
                            </div>
                            <div style={isMobile ? {
                                backgroundColor: "#070D0D",
                                borderRadius: "10px",
                                padding: "20px",
                                margin: "10px",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                                textAlign: "center",
                                height: "fit-content"
                            } : {
                                backgroundColor: "#070D0D",
                                borderRadius: "10px",
                                padding: "20px",
                                margin: "10px",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                                textAlign: "center",
                                width: "200px"
                            }}>
                                <Typography variant={isMobile ? "subtitle2" : "subtitle1"}
                                            style={{marginBottom: "10px", color: "white"}}
                                            align={"center"}>Yearly</Typography>
                                <Typography variant={isMobile ? "h6" : "h5"}
                                            style={{marginBottom: "10px", color: "white"}}
                                            align={"center"}>$80</Typography>
                                <LoadingButton
                                    loading={proUrlsLoading}
                                    variant="contained"
                                    href={proYearlyLink}
                                    target="_blank"
                                    style={{backgroundColor: theme.palette.secondary.dark}}
                                >
                                    Select
                                </LoadingButton>
                            </div>
                        </div>
                        <Typography
                            variant="body1"
                            style={{marginTop: "20px", color: "white", cursor: "pointer"}}
                            align="center"
                            component="a" // Render the Typography as an <a> tag
                            href="/premium" // Specify the target URL
                            target="_blank"
                        >
                            Learn More About Pro
                        </Typography>
                    </div>
                </>
            )
        } else {
            return (
                <div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "start",
                            justifyContent: "center",
                        }}
                    >
                        <Fade cascade damping={1e-1} direction={"left"}>
                            <h1>{"You Earned " + xpTitle + " XP"}</h1>
                        </Fade>
                    </div>
                    <div style={{height: "5vh"}}/>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "start",
                            justifyContent: "center",
                        }}
                    >
                        <h3>{"Renown " +
                            renown}</h3>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                        }}
                    >
                        <h4>{"Lvl " + currentLevel}</h4>
                        <div style={{width: "20px"}}/>
                        {xpBarMemo}
                        <div style={{width: "20px"}}/>
                        <h4>{"Lvl " + nextLevel}</h4>
                    </div>
                    <div style={{height: "5vh"}}/>
                    <div style={{display: "flex", alignItems: "end", justifyContent: "center"}}>
                        <Button variant={"contained"}
                                sx={{
                                    width: "25%",
                                    height: "60px",
                                    backgroundColor: "#29C18C",
                                    color: "white",
                                    borderRadius: "25px",
                                    boxShadow: '0 5px 0 #235d30',
                                    '&:active': {transform: 'translateY(5px)', boxShadow: 'none'},
                                    '&:hover': {
                                        backgroundColor: "#29C18C",
                                        cursor: 'pointer',
                                        '&:before': {
                                            transform: 'translateX(300px) skewX(-15deg)',
                                            opacity: 0.6,
                                            transition: '.7s'
                                        }
                                    }
                                }} disableRipple={true} onClick={() => confirmButton()}
                                id={"button"} className={'button'} style={{zIndex: "600000"}}
                        >
                            Confirm
                        </Button>
                    </div>
                </div>
            )
        }
    }


    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline>
                    <Modal open={open} style={{display: 'flex', justifyContent: "center", alignItems: "center"}}>
                        <Box
                            sx={showPro ? {
                                width: isMobile ? "90vw" : "28vw",
                                height: isMobile || isMobile ? "78vh" : "70vh",
                                minHeight: "420px",
                                // justifyContent: "center",
                                // marginLeft: "25vw",
                                // marginTop: "5vh",
                                outlineColor: "black",
                                borderRadius: 7,
                                boxShadow:
                                    "0px 12px 6px -6px rgba(0,0,0,0.6),0px 6px  0px rgba(0,0,0,0.6),0px 6px 18px 0px rgba(0,0,0,0.6)",
                                // backgroundColor: theme.palette.background.default,
                                backgroundImage: `url(${proBackground})`,
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center center"
                                // ...themeHelpers.frostedGlass
                            } : {
                                width: "40vw",
                                height: "45vh",
                                minHeight: "420px",
                                // justifyContent: "center",
                                // marginLeft: "25vw",
                                // marginTop: "5vh",
                                outlineColor: "black",
                                borderRadius: 1,
                                boxShadow:
                                    "0px 12px 6px -6px rgba(0,0,0,0.6),0px 6px 6px 0px rgba(0,0,0,0.6),0px 6px 18px 0px rgba(0,0,0,0.6)",
                                backgroundColor: theme.palette.background.default,
                            }}
                        >
                            {renderXPPopup()}
                        </Box>
                    </Modal>
                </CssBaseline>
            </ThemeProvider>
        </>
    );
};

export default XpPopup;