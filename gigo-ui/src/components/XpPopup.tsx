'use client'
import * as React from "react";
import {
    createTheme,
    CssBaseline,
    PaletteMode,
    ThemeProvider,
    Box,
    Modal,
    IconButton,
    Typography,
    Snackbar,
    Slide,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {theme} from "@/theme";
import { keyframes } from "@emotion/react";
import LinearProgress from "@mui/material/LinearProgress";
import {useEffect, useState, useMemo, useCallback} from "react";
import { Button } from "@mui/material"
import {Fade} from "react-awesome-reveal"
import LootPopup from "./LootPopup";
import { selectAuthState } from "@/reducers/auth/auth";
import { useAppSelector } from "@/reducers/hooks";
import GoProDisplay from "./GoProDisplay";
import GigoCircleIcon from "@/icons/GIGO/GigoCircleLogo";
import Close from "@mui/icons-material/Close";
import premiumGorilla from "@/img/pro/pro-pop-up-icon-plain.svg"
import { useSearchParams } from "next/navigation";

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
    const [showConfetti, setShowConfetti] = useState(false);
    const [startXP, setStartXP] = useState(props.oldXP);
    const [extraXP, setExtraXP] = useState(props.newXP - props.oldXP);
    const [totalXP, setTotalXP] = useState(props.maxXP);
    const [currentLevel, setCurrentLevel] = useState(props.nextLevel - 1);
    const [nextLevel, setNextLevel] = useState(props.nextLevel);
    const [xpTitle, setXpTitle] = useState(props.gainedXP);
    const [open, setOpen] = useState(true);
    const [lootBox, setLootBox] = useState(props.reward !== null);
    const [showLoot, setShowLoot] = useState(false);
    const [reward, setReward] = useState(props.reward);
    const [renown, setRenown] = useState(props.renown);
    const [showPro, setShowPro] = useState(false);
    const [progressValue, setProgressValue] = useState(0);

    const authState = useAppSelector(selectAuthState);

    let query = useSearchParams();
    let isMobile = query.get("viewport") === "mobile";
    const [steps, setSteps] = React.useState([{
        content: <h2>Let&apos;s begin our journey!</h2>,
        locale: { skip: <strong aria-label="skip">Skip</strong> },
        placement: 'center',
        target: 'body',
    },{content: <h2>You earn XP by doing activities on the platform.</h2>, target: '.button', placement: 'bottom'}]);


    useEffect(() => {
        if (props.levelUp) {
            const timer = setTimeout(() => {
                setShowConfetti(true);
                setStartXP(0);
                setExtraXP(0);
                setCurrentLevel(props.nextLevel - 1);
                setNextLevel(props.nextLevel);
                setLootBox(true);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [props.levelUp, props.nextLevel]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setProgressValue((props.newXP / props.maxXP) * 100);
        }, 100);
        return () => clearTimeout(timer);
    }, [props.newXP, props.maxXP]);

    const closePopup = useCallback(() => {
        setOpen(false);
        if (props.popupClose) {
            props.popupClose();
        }
        window.sessionStorage.setItem("loginXP", "undefined");
        window.sessionStorage.setItem("attemptXP", "undefined");
    }, [props.popupClose]);

    const handleProClick = useCallback(() => {
        const premium = authState.role > 0;
        if (!premium) {
            setShowPro(true);
        } else if (lootBox) {
            setShowLoot(true);
        } else {
            closePopup();
        }
    }, [authState.role, lootBox, closePopup]);

    const closePopupLoot = useCallback(() => {
        setShowLoot(false);
        closePopup();
    }, [closePopup]);

    const renderXPSnackbar = useMemo(() => (
        <Snackbar
            open={open}
            TransitionComponent={Slide}
            key={"slide"}
            autoHideDuration={3000}
            onClose={() => setOpen(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            sx={{
                marginBottom: "-25px"
            }}
        >
            <Box
                sx={{
                    width: "100vw",
                    height: "175px",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px',
                    position: 'relative',
                    backdropFilter: "blur(15px)",
                    WebkitBackdropFilter: "blur(15px)",
                    borderTop: `2px solid rgba(255,255,255,0.18)`,
                    borderColor: "#06ea9a",
                    background: "radial-gradient(circle, rgba(28,135,98,0.8) 0%, rgba(28,28,26,0.8) 47%)",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                    }}
                >
                    <GigoCircleIcon
                        sx={{
                            position: 'absolute',
                            height: '300px',
                            width: '300px',
                            color: "white",
                            opacity: 0.08,
                            zIndex: 0,
                            paddingBottom: "50px"
                        }}
                    />
                </Box>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '0%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'rgba(0, 0, 0, 1)',
                        borderRadius: '2px',
                        padding: '8px 16px',
                        zIndex: 1,
                        border: `2px solid rgba(255,255,255,0.18)`,
                        borderColor: '#06ea9a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '35px',
                        width: "450px"
                    }}
                >
                    <Typography
                        sx={{
                            color: '#fff',
                            fontSize: "25px",
                        }}
                    >
                        You Gained {props.gainedXP} XP
                    </Typography>
                </Box>
                <Box
                    sx={{
                        width: isMobile ? '95%' : '40%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        zIndex: 1,
                        position: 'absolute',
                        top: '50%',
                        transform: 'translateY(-50%)',
                    }}
                >
                    <Typography variant="h6" sx={{ color: '#fff' }}>
                        Lvl {currentLevel}
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={progressValue}
                        sx={{
                            width: '70%',
                            height: '25px',
                            borderRadius: '5px',
                            border: "2px solid #06ea9a",
                            backgroundColor: hexToRGBA('#1c1c1a', 0.5),
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: hexToRGBA('#06ea9a', 0.8),
                                transition: 'transform 1.5s ease-in-out',
                            },
                        }}
                    />
                    <Typography variant="h6" sx={{ color: '#fff' }}>
                        Lvl {nextLevel}
                    </Typography>
                </Box>
            </Box>
        </Snackbar>
    ), [open, props.gainedXP, currentLevel, nextLevel, progressValue]);

    const renderLootBox = useMemo(() => (
        showLoot && (
            <div>
                <LootPopup closePopup={closePopupLoot}
                //@ts-ignore
                           reward={props.reward} />
            </div>
        )
    ), [showLoot, closePopupLoot, props.reward]);

    const renderProPopup = useMemo(() => (
        showPro && (
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
                            closePopup();
                        }
                    }}
                    sx={{
                        position: "absolute",
                        top: '20vh',
                        right: '38vw',
                        color: "white"
                    }}
                >
                    <Close />
                </IconButton>
                <img alt="" src={premiumGorilla}
                     style={{width: "30%", marginBottom: "20px"}} />
                <Typography variant="h4"
                            style={{marginBottom: "10px", color: "white"}} align="center">GIGO
                    Pro</Typography>
                <Typography variant="body1"
                            style={{marginLeft: "20px", marginRight: "20px", color: "white"}} align="center">
                    Learn faster with a smarter Code Teacher!
                </Typography>
                <Typography variant="body1"
                            style={{
                                marginBottom: "20px",
                                marginLeft: "20px",
                                marginRight: "20px",
                                color: "white"
                            }}
                            align="center">
                    Do more with larger DevSpaces!
                </Typography>
            </div>
        )
    ), [showPro, lootBox, closePopup]);

    useEffect(() => {
        if (lootBox && !showPro) {
            setShowLoot(true);
        }
    }, [lootBox, showPro]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline>
                {renderXPSnackbar}
                {renderLootBox}
                {renderProPopup}
            </CssBaseline>
        </ThemeProvider>
    );
};

export default XpPopup;

function hexToRGBA(hex: string, alpha: string | number) {
    let r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}