'use client'
import * as React from "react";
import {
    Box,
    Button, createTheme,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    PaletteMode, styled,
    Tooltip,
    Typography
} from "@mui/material";
import TutorialClaimTrialButton from "@/components/Pages/Home/TutorialClaimTrialButton";
import CheckIcon from "@mui/icons-material/CheckCircleOutline";
import StarIcon from "@mui/icons-material/Star";
import {getAllTokens, themeHelpers} from "@/theme";
import {
    initialAuthStateUpdate,
    selectAuthState,
    selectAuthStateTutorialState,
    updateAuthState
} from "@/reducers/auth/auth";
import call from "@/services/api-call";
import {keyframes} from "@mui/system";
import {useAppSelector} from "@/reducers/hooks";
import {LoadingButton} from "@mui/lab";

const gradientAnimation = keyframes`
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

const StartCodingButton = styled(LoadingButton)`
    animation: startCodingAuraEffect 5s infinite alternate;

    @keyframes startCodingAuraEffect {
        0% {
            background-color: #84E8A2;
            border: 1px solid #84E8A2;
        }
        20% {
            background-color: #29C18C;
            border: 1px solid #29C18C;
        }
        40% {
            background-color: #1C8762;
            border: 1px solid #1C8762;
        }
        60% {
            background-color: #2A63AC;
            border: 1px solid #2A63AC;
        }
        80% {
            background-color: #3D8EF7;
            border: 1px solid #3D8EF7;
        }
        100% {
            background-color: #63A4F8;
            border: 1px solid #63A4F8;
        }
    }
`;

export default function Tutorial() {
    // let userPref = localStorage.getItem('theme')
    let userPref = 'dark'
    const [mode, _] = React.useState<PaletteMode>('dark');
    const theme = React.useMemo(() => createTheme(getAllTokens(mode)), [mode]);

    const authState = useAppSelector(selectAuthState);
    const tutorialState = useAppSelector(selectAuthStateTutorialState);
    const [runTutorial, setRunTutorial] = React.useState(!tutorialState.home && authState.authenticated)
    const [tutorialStepIndex, setTutorialStepIndex] = React.useState(0)
    const [openTooltip, setOpenTooltip] = React.useState(false);
    const [startingByte, setStartingByte] = React.useState(false);

    // this enables us to push tutorial restarts from the app wrapper down into this page
    React.useEffect(() => {
        if (tutorialState.home === !runTutorial) {
            return
        }
        setRunTutorial(!tutorialState.home && authState.authenticated)
    }, [tutorialState])

    const handleReferralButtonClick = async () => {
        try {
            await navigator.clipboard.writeText(`https://gigo.dev/referral/${encodeURIComponent(authState.userName)}`);
            setOpenTooltip(true);
            setTimeout(() => {
                setOpenTooltip(false);
            }, 2000); // Tooltip will hide after 2 seconds
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    let steps: {
        "title": string | React.ReactElement,
        "content": string | React.ReactElement
    }[] = [
        {
            title: "Welcome to GIGO!",
            content: "GIGO is a platform to help developers learn to code, practice their skills, and experiment quickly.",
        },
        {
            title: (
                <DialogTitle
                    sx={{
                        width: window.innerWidth > 1000 ? 450 : undefined,
                        maxWidth: window.innerWidth > 1000 ? undefined : "90vw",
                        background: "linear-gradient(90deg, #84E8A2, #63a4f8, #84E8A2)",
                        backgroundSize: "200% 200%",
                        animation: `${gradientAnimation} 3s ease infinite`,
                        fontSize: "1.6em",
                        textAlign: "center",
                        paddingTop: "20px",
                        paddingBottom: "20px",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        MozBackgroundClip: "text",
                        MozTextFillColor: "transparent",
                    }}
                >
                    GIGO Pro
                </DialogTitle>
            ),
            content: (
                <>
                    {authState.role != 1 && (
                        <>
                            <Typography variant="body2" sx={{fontSize: ".8em", mb: 2, textAlign: 'center'}}>
                                You've received a free month of GIGO Pro!
                            </Typography>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                                mb: 2
                            }}>
                                <TutorialClaimTrialButton />
                            </Box>
                        </>
                    )}
                    <Typography variant="body2" sx={{fontSize: ".8em", mb: 2, textAlign: 'center'}}>
                        Give a month, Get a month! For every friend you refer, both of you get a free month of GIGO
                        Pro!
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column'
                    }}>
                        <Tooltip
                            open={openTooltip}
                            disableFocusListener
                            disableHoverListener
                            disableTouchListener
                            title={
                                <React.Fragment>
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                        Referral Link Copied
                                        <CheckIcon sx={{color: theme.palette.success.main, ml: 1}}/>
                                    </div>
                                </React.Fragment>
                            }
                            placement="top"
                            arrow
                        >
                            <Button variant="contained" onClick={handleReferralButtonClick}>
                                Referral Link
                            </Button>
                        </Tooltip>
                    </Box>
                    <Box sx={{my: 2}}>
                        <Typography variant="body1" component="div" sx={{display: 'flex', alignItems: 'center'}}>
                            <StarIcon sx={{fontSize: ".8em", mr: 1}}/>
                            <span style={{}}>Smarter Code Teacher</span>
                        </Typography>
                        <Typography variant="body1" component="div" sx={{fontSize: ".7em", ml: 3}}>
                            Get better help and guidance on your coding journey.
                        </Typography>
                        <Typography variant="body1" component="div" sx={{display: 'flex', alignItems: 'center'}}>
                            <StarIcon sx={{fontSize: ".8em", mr: 1}}/>
                            <span style={{}}>Private Projects</span>
                        </Typography>
                        <Typography variant="body1" component="div" sx={{fontSize: ".7em", ml: 3}}>
                            Learn in stealth mode.
                        </Typography>
                        <Typography variant="body1" component="div" sx={{display: 'flex', alignItems: 'center'}}>
                            <StarIcon sx={{fontSize: ".8em", mr: 1}}/>
                            <span style={{}}>More DevSpace Resources</span>
                        </Typography>
                        <Typography variant="body1" component="div" sx={{fontSize: ".7em", ml: 3}}>
                            8 CPU cores, 8GB RAM, 50GB disk space.
                        </Typography>
                        <Typography variant="body1" component="div" sx={{display: 'flex', alignItems: 'center'}}>
                            <StarIcon sx={{fontSize: ".8em", mr: 1}}/>
                            <span style={{}}>Three Concurrent DevSpaces</span>
                        </Typography>
                        <Typography variant="body1" component="div" sx={{fontSize: ".7em", ml: 3}}>
                            Run multiple projects.
                        </Typography>
                        <Typography variant="body1" component="div" sx={{display: 'flex', alignItems: 'center'}}>
                            <StarIcon sx={{fontSize: ".8em", mr: 1}}/>
                            <span style={{}}>Two Streak Freezes a Week</span>
                        </Typography>
                        <Typography variant="body1" component="div" sx={{fontSize: ".7em", ml: 3}}>
                            Preserve your streak.
                        </Typography>
                        <Typography variant="body1" component="div" sx={{display: 'flex', alignItems: 'center'}}>
                            <StarIcon sx={{fontSize: ".8em", mr: 1}}/>
                            <span style={{}}>Premium VsCode Theme</span>
                        </Typography>
                        <Typography variant="body1" component="div" sx={{fontSize: ".7em", ml: 3}}>
                            Enhance your coding experience.
                        </Typography>
                    </Box>
                </>
            ),
        },
        {
            title: "How to use tutorials",
            content: "Tutorials will start on important app to guide you through the platform. This is the only mandatory tutorial. If you skip a tutorial, you can always restart it using the help button at the bottom of the left-hand sidebar (desktop) or the User icon drop down (mobile).",
        },
        {
            title: "Let's Get Started!",
            content: "Start coding now, or select either a Byte or a Challenge to initiate your journey!"
        }
    ]

    return (
        <Dialog
            open={runTutorial}
            onClose={(event, reason) => {
                if (reason === 'backdropClick') {
                    return;
                }
                setRunTutorial(false)
            }}
            BackdropProps={{
                sx: {
                    backdropFilter: tutorialStepIndex <= 1 ? "blur(5px)" : undefined,
                    backgroundColor: "transparent",
                }
            }}
            PaperProps={{
                sx: {
                    ...themeHelpers.frostedGlass,
                }
            }}
            disableEscapeKeyDown={true}
        >
            {typeof steps[tutorialStepIndex]["title"] === "string" ? (
                <DialogTitle
                    sx={window.innerWidth < 1000 ? {
                        maxWidth: "90vw",
                        backgroundColor: "transparent",
                        fontSize: "1.2em",
                        // center the text
                        textAlign: "center",
                        paddingTop: "20px",
                        paddingBottom: "20px",
                    } : {
                        width: 450,
                        backgroundColor: "transparent",
                        fontSize: "1.2em",
                        // center the text
                        textAlign: "center",
                        paddingTop: "20px",
                        paddingBottom: "20px",
                    }}
                >
                    {steps[tutorialStepIndex]["title"]}
                </DialogTitle>
            ) : (
                steps[tutorialStepIndex]["title"]
            )}
            <DialogContent
                sx={window.innerWidth < 1000 ? {
                    maxWidth: "90vw",
                    backgroundColor: "transparent",
                } : {
                    width: 450,
                    backgroundColor: "transparent",
                }}
            >
                {typeof steps[tutorialStepIndex]["content"] === "string" ? (
                    <Typography variant="body1" gutterBottom sx={{
                        fontSize: ".8em",
                        paddingTop: "10px",
                    }}>
                        {steps[tutorialStepIndex]["content"]}
                    </Typography>
                ) : (
                    steps[tutorialStepIndex]["content"]
                )}
            </DialogContent>
            <DialogActions
                sx={{
                    backgroundColor: 'transparent',
                }}
            >
                {tutorialStepIndex !== 0 && (
                    <Button
                        onClick={() => setTutorialStepIndex(tutorialStepIndex - 1)}
                        variant="contained"
                        color="primary"
                        sx={{
                            fontSize: "0.8rem",
                        }}
                    >
                        Back
                    </Button>
                )}
                {tutorialStepIndex === steps.length - 1 ? (
                    <>
                        {window.innerWidth > 1000 && (
                            <Button
                                onClick={async () => {
                                    setRunTutorial(false)
                                    let authState = Object.assign({}, initialAuthStateUpdate)
                                    // copy the existing state
                                    let state = Object.assign({}, tutorialState)
                                    // update the state
                                    state.home = true
                                    authState.tutorialState = state
                                    // @ts-ignore
                                    dispatch(updateAuthState(authState))

                                    // send api call to backend to mark the challenge tutorial as completed
                                    await call(
                                        "/api/user/markTutorial",
                                        "post",
                                        null,
                                        null,
                                        null,
                                        // @ts-ignore
                                        {
                                            tutorial_key: "home"
                                        }
                                    )
                                }}
                                variant="contained"
                                color={"primary"}
                                sx={{
                                    fontSize: "0.8rem",
                                }}
                            >
                                Browse
                            </Button>
                        )}
                        <StartCodingButton
                            loading={startingByte}
                            onClick={async () => {
                                setStartingByte(true)

                                let authState = Object.assign({}, initialAuthStateUpdate)
                                // copy the existing state
                                let state = Object.assign({}, tutorialState)
                                // update the state
                                state.home = true
                                authState.tutorialState = state
                                // @ts-ignore
                                dispatch(updateAuthState(authState))

                                // send api call to backend to mark the challenge tutorial as completed
                                await call(
                                    "/api/user/markTutorial",
                                    "post",
                                    null,
                                    null,
                                    null,
                                    // @ts-ignore
                                    {
                                        tutorial_key: "home"
                                    }
                                )

                                setStartingByte(false)
                                setRunTutorial(false)

                                window.location.assign("/byte/1750943457427324928")
                            }}
                            variant="contained"
                            color="success"
                            sx={{
                                // fontSize: "0.8rem",
                            }}
                        >
                            Start Coding!
                        </StartCodingButton>
                    </>
                ) : (
                    <Button
                        onClick={() => setTutorialStepIndex(tutorialStepIndex + 1)}
                        variant="contained"
                        color="primary"
                        sx={{
                            fontSize: "0.8rem",
                        }}
                    >
                        Next
                    </Button>
                )
                }
            </DialogActions>
        </Dialog>
    )
}