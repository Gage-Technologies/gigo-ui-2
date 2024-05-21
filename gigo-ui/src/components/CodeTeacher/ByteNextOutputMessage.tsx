import { alpha, CircularProgress, createTheme, PaletteMode, styled, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getAllTokens } from "@/theme";
import { useGlobalCtWebSocket } from "@/services/ct_websocket";
import {
    CtByteNextOutputRequest,
    CtByteNextOutputResponse,
    CtCodeFile,
    CtGenericErrorPayload,
    CtMessage,
    CtMessageOrigin,
    CtMessageType,
    CtValidationErrorPayload
} from "@/models/ct_websocket";
import MarkdownRenderer from "../Markdown/MarkdownRenderer";
import { Box, Typography, Button } from '@mui/material';
import { BugReportOutlined, Close } from "@mui/icons-material";
import * as byteSuccess from "../../img/byteSuccess.json"
import CodeTeacherChatIcon from "./CodeTeacherChatIcon";
import { LoadingButton } from "@mui/lab";
import { Player } from "@lottiefiles/react-lottie-player";
import config from "../../config";
import BytesCard from "../BytesCard";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/reducers/hooks";
import { selectAuthState } from "@/reducers/auth/auth";
import GoProDisplay from "../GoProDisplay";
import { AwesomeButton } from "react-awesome-button";
import SkipNextIcon from '@mui/icons-material/SkipNext';
import HeartDisabledIcon from "@/icons/HeartDisabledIcon";
import {useRouter} from "next/navigation";

export type ByteNextOutputMessageProps = {
    open: boolean;
    trigger: boolean;
    acceptedCallback: () => void;
    onExpand: () => void;
    onHide: () => void;
    onSuccess: () => void;
    onFail: () => void;
    code: CtCodeFile[];
    byteId: string;
    description: string;
    dev_steps: string;
    maxWidth: string;
    codeOutput: string;
    nextByte?: any;
    journey: boolean
    containerRef: React.MutableRefObject<null>;
    onTryHarderVersionClick?: () => void;
    nodeBelowId: string | null;
    mobile?: boolean;
};

enum State {
    LOADING = 'loading',
    COMPLETED = 'completed'
}

export default function ByteNextOutputMessage(props: ByteNextOutputMessageProps) {
    let userPref = localStorage.getItem("theme");
    let authState = useAppSelector(selectAuthState);
    const [mode, _] = useState<PaletteMode>(userPref === "light" ? "light" : "dark");
    const theme = React.useMemo(() => createTheme(getAllTokens(mode)), [mode]);
    const [response, setResponse] = useState<string>("");
    const [success, setSuccess] = useState<boolean | null>(null);
    const [state, setState] = useState<State>(State.LOADING);
    const [executingOutputMessage, setExecutingOutputMessage] = useState<boolean>(false)
    const [goProPopup, setGoProPopup] = useState(false)


    const ctWs = useGlobalCtWebSocket();

    const navigate = useRouter();

    const HiddenButton = styled(Button)`
        background-color: transparent;
        padding: 8px;
        min-width: 0px;
        color: ${alpha(theme.palette.text.primary, 0.6)};

        &:hover {
            background-color: ${alpha(theme.palette.text.primary, 0.4)};
            color: ${theme.palette.text.primary};
        }
    `;

    const HiddenLoadingButton = styled(LoadingButton)`
        background-color: transparent;
        padding: 8px;
        min-width: 0px;
        color: ${alpha(theme.palette.text.primary, 0.6)};

        &:hover {
            background-color: ${alpha(theme.palette.text.primary, 0.4)};
            color: ${theme.palette.text.primary};
        }
    `;

    const AnimCircularProgress = styled(CircularProgress)`
        animation: mui-rotation 2s linear infinite, respondingEffect 2s infinite alternate;

        @keyframes respondingEffect {
            0% {
                color: #84E8A2;
            }
            20% {
                color: #29C18C;
            }
            40% {
                color: #1C8762;
            }
            60% {
                color: #2A63AC;
            }
            80% {
                color: #3D8EF7;
            }
            100% {
                color: #63A4F8;
            }
        }

        @keyframes mui-rotation {
            100% {
                transform: rotate(360deg);
            }
        }
    `;

    const hide = () => {
        props.onHide()
    }

    const expand = () => {
        props.onExpand()
    }


    const renderHidden = React.useMemo(() => (
        <Tooltip title={"Debug"}>
            <span>
                <HiddenButton
                    sx={{
                        height: "30px",
                        width: "30px",
                        minWidth: "24px",
                        marginLeft: props.mobile ? "0px" : "10px"
                    }}
                    onClick={() => expand()}
                >
                    <BugReportOutlined style={{ fontSize: "24px" }} />
                </HiddenButton>
            </span>
        </Tooltip>
    ), [])

    const renderHiddenDisabled = React.useMemo(() => (
        <Tooltip title={"Debug"}>
            <span>
                <HiddenButton
                    disabled={true}
                    sx={{
                        height: "30px",
                        width: "30px",
                        minWidth: "24px",
                        marginLeft: props.mobile ? "0px" : "10px"
                    }}
                >
                    <BugReportOutlined style={{ fontSize: "24px" }} />
                </HiddenButton>
            </span>
        </Tooltip>
    ), [])

    const renderHiddenLoading = React.useMemo(() => (
        <Tooltip title={"Checking Your Code"}>
            <span>
                <HiddenLoadingButton
                    loading={true}
                    sx={{
                        height: "30px",
                        width: "30px",
                        minWidth: "24px",
                        marginLeft: props.mobile ? "0px" : "10px"
                    }}
                >
                    <BugReportOutlined style={{ fontSize: "24px" }} />
                </HiddenLoadingButton>
            </span>
        </Tooltip>
    ), [])

    const getOutputMessage = () => {
        if (executingOutputMessage) {
            return
        }
        setExecutingOutputMessage(true)
        props.acceptedCallback()

        ctWs.sendWebsocketMessage({
            sequence_id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            type: CtMessageType.WebSocketMessageTypeByteNextOutputMessageRequest,
            origin: CtMessageOrigin.WebSocketMessageOriginClient,
            created_at: Date.now(),
            payload: {
                byte_id: props.byteId,
                byte_description: props.description,
                byte_development_steps: props.dev_steps,
                // @ts-ignore
                byte_output: props.codeOutput, // changed from codeOutput["stdout"][0] because of an error
                code: props.code
            }
        } satisfies CtMessage<CtByteNextOutputRequest>, (msg: CtMessage<CtGenericErrorPayload | CtValidationErrorPayload | CtByteNextOutputResponse>) => {
            if (msg.type !== CtMessageType.WebSocketMessageTypeByteNextOutputMessageResponse) {
                console.log("failed next output message", msg)
                setExecutingOutputMessage(false)
                return true
            }
            const p: CtByteNextOutputResponse = msg.payload as CtByteNextOutputResponse;

            setSuccess(p.success)
            setState(State.COMPLETED)
            if (p.success) {
                setResponse("")
                props.onSuccess()
            } else {
                props.onFail()
                setResponse(p.explanation)
            }
            expand()
            setExecutingOutputMessage(false)
            return true
        })
    };

    let premium = authState.role > 0
    // //remove after testing
    // premium = "0"

    useEffect(() => {
        if (!props.trigger || executingOutputMessage)
            return
        setState(State.LOADING)
        setSuccess(null)
        setResponse("")
        getOutputMessage()
    }, [props.trigger])

    const loadingAnim = React.useMemo(() => (
        <Box sx={{ width: "100%", height: "fit-content" }}>
            <AnimCircularProgress
                size={16}
                sx={{
                    float: 'right',
                    m: 1,
                }}
            />
        </Box>
    ), [])

    const headerLoadingAnim = React.useMemo(() => (
        <AnimCircularProgress size={24} />
    ), [])

    const renderExpanded = () => {
        return (
            <Box
                sx={{
                    overflow: "auto",
                    pl: 1,
                    height: "100%",
                    backgroundColor: "transparent",
                    border: "none",
                    boxShadow: "none",
                    width: "100%"
                }}
            >
                <Box
                    display={"inline-flex"}
                    justifyContent={"space-between"}
                    sx={{
                        border: `1px solid ${theme.palette.text.primary}`,
                        borderRadius: "6px",
                        mb: 2,
                        p: 1,
                        width: "100%"
                    }}
                >
                    <CodeTeacherChatIcon
                        style={{
                            height: "24px",
                            width: "24px"
                        }}
                    />
                    <Box
                        sx={{
                            ml: 2
                        }}
                    >
                        Debug
                    </Box>
                    {state !== State.LOADING || response.length > 0 ? (
                        <Button
                            variant="text"
                            color="error"
                            sx={{
                                borderRadius: "50%",
                                padding: 0.5,
                                minWidth: "0px",

                                height: "24px",
                                width: "24px"
                            }}
                            onClick={() => hide()}
                        >
                            <Close />
                        </Button>
                    ) : headerLoadingAnim}
                </Box>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <MarkdownRenderer
                        markdown={response}
                        style={{
                            overflowWrap: 'break-word',
                            borderRadius: '10px',
                            padding: '0px',
                        }}
                    />
                    <Box sx={{ display: 'inline-flex', justifyContent: 'space-between', marginTop: '10px' }}>
                        {!premium && (
                            <Box
                                sx={{
                                    display: 'inline-flex',
                                    marginLeft: "8px",
                                    maxWidth: "60%",
                                }}
                            >
                                <HeartDisabledIcon style={{ fontSize: "36px" }} />
                                <Typography variant="caption" color="error" style={{ marginLeft: "8px", fontSize: "0.6em" }}>
                                    You lost a heart for this attempt.<br/>
                                    Try asking Code Teacher for help!
                                </Typography>
                            </Box>
                        )}
                        {!premium && (
                            <Tooltip title={"Get Access to more coding help and resources by going pro"}>
                                <Button
                                    onClick={(event) => {
                                        setGoProPopup(true)
                                    }}
                                    variant={"outlined"}
                                    sx={{
                                        width: "100px",
                                        marginLeft: "auto",
                                    }}
                                >
                                    Go Pro
                                </Button>
                            </Tooltip>
                        )}
                    </Box>
                </div>
                {state === State.LOADING && response.length > 0 && loadingAnim}
            </Box>
        )
    }

    const toggleProPopup = () => setGoProPopup(!goProPopup)


    const renderSuccesPage = () => {
        return (
            <Box
                display={"flex"}
                flexDirection={"column"}
                sx={{
                    alignItems: 'center',
                    maxWidth: props.maxWidth,
                    height: "100%",
                    width: "100%"
                }}
            >
                <Typography component={Box} variant="h4">
                    Byte Completed!
                </Typography>
                <Player
                    src={byteSuccess}
                    loop={false}
                    keepLastFrame={true}
                    autoplay={true}
                    renderer="svg"
                />
                {props.nextByte && (
                    <>
                        <Typography component={Box} variant="h6" sx={{ mb: 2 }}>
                            Next Up
                        </Typography>
                        <BytesCard
                            bytesId={props.nextByte._id}
                            bytesTitle={props.nextByte.name}
                            bytesThumb={config.rootPath + "/static/bytes/t/" + props.nextByte._id}
                            onClick={() => navigate.push(`/byte/${props.nextByte._id}`)}
                            style={{ cursor: 'pointer', transition: 'transform 0.3s ease' }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            width="10vw"
                            height="20vh"
                            imageWidth="10vw"
                            imageHeight="15vh"
                        />
                    </>
                )}
                <Box
                    display={"flex"}
                    flexDirection={"row"}
                    justifyContent={"space-between"}
                    sx={{
                        width: "100%",
                        marginTop: "auto",
                        mb: 2
                    }}
                >
                    <Button
                        variant="outlined"
                        color="primary"
                        sx={{
                            ml: "20px",
                        }}
                        onClick={() => {
                            hide()
                        }}
                    >
                        Keep Hacking
                    </Button>
                    <Button
                        variant="outlined"
                        color="success"
                        sx={{
                            mr: "10px",
                            color: "#15cf91",
                            border: "1px solid #15cf9160",
                            "&:hover": {
                                color: "#15cf91",
                                backgroundColor: "#15cf9140",
                                border: "1px solid #15cf91",
                            }
                        }}
                        onClick={() => {
                            setSuccess(false)
                            setResponse("")
                            setState(State.LOADING)
                            hide()
                            navigate.push(`/byte/${props.nextByte._id}`)
                        }}
                    >
                        Continue
                    </Button>
                </Box>
            </Box>
        )
    }

    function extractIdFromUrl(urlString: string): string | null {
        try {
            // Create a URL object from the urlString
            const url = new URL(urlString);

            // Split the pathname part of the URL into segments
            const pathSegments = url.pathname.split('/');

            // Find the index of the segment 'byte'
            const byteIndex = pathSegments.findIndex(segment => segment === 'byte');

            // Check if 'byte' segment is found and it's not the last segment
            if (byteIndex >= 0 && byteIndex < pathSegments.length - 1) {
                // The ID should be the segment immediately after 'byte'
                return pathSegments[byteIndex + 1];
            }
        } catch (error) {
            console.error("Error parsing the URL:", error);
        }
        return null; // Return null if the ID couldn't be extracted
    }

    const currentUrl = window.location.href;
    let byteId = extractIdFromUrl(currentUrl)

    const renderSuccesPageJourney = () => {
        return (
            <Box
                display={"flex"}
                flexDirection={"column"}
                sx={{
                    alignItems: 'center',
                    maxWidth: props.maxWidth,
                    height: "100%",
                    width: "100%"
                }}
            >
                <Typography component={Box} variant="h5">
                    Journey Task Completed!
                </Typography>
                <Player
                    src={byteSuccess}
                    loop={false}
                    keepLastFrame={true}
                    autoplay={true}
                    renderer="svg"
                />
                <Box
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    sx={{
                        width: "100%",
                        marginTop: "auto",
                        mb: 2,
                        justifyContent: 'center',
                    }}
                >
                    <AwesomeButton style={{
                        width: "auto",
                        //@ts-ignore
                        '--button-primary-color': theme.palette.tertiary.dark,
                        '--button-primary-color-dark': "#afa33d",
                        '--button-primary-color-light': "#dfce53",
                        //@ts-ignore
                        '--button-primary-color-active': theme.palette.tertiary.dark,
                        //@ts-ignore
                        '--button-primary-color-hover': theme.palette.tertiary.main,
                        '--button-default-border-radius': "24px",
                        '--button-hover-pressure': "4",
                        height: "10vh",
                        '--button-raise-level': "10px"
                    }} type="primary" href={`/journey/main?last_task_id=${props.byteId}`}>
                        <h1 style={{ fontSize: "36px", paddingRight: "1vw", paddingLeft: "1vw" }}>
                            Continue
                        </h1>
                    </AwesomeButton>
                    {props.nodeBelowId !== undefined && props.nodeBelowId !== null ? (
                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                            justifyContent: "space-evenly"
                        }}>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    hide()
                                    props.onTryHarderVersionClick?.()
                                }}
                                sx={{
                                    mt: 1,
                                    fontSize: '0.8rem',
                                    padding: '6px 16px',
                                }}
                            >
                                Try a harder version 🌊
                            </Button>
                            <Button
                                variant="contained"
                                href={`/byte/${props.nodeBelowId}?journey`}
                                sx={{
                                    mt: 1,
                                    fontSize: '0.8rem',
                                    padding: '6px 16px',
                                }}
                            >
                                Next Task
                                <SkipNextIcon />
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={() => {
                                hide()
                                props.onTryHarderVersionClick?.()
                            }}
                            sx={{
                                mt: 2,
                                fontSize: '0.875rem',
                                padding: '6px 16px',
                            }}
                        >
                            Try a harder version 🌊
                        </Button>
                    )}
                </Box>
            </Box>
        )
    }


    const renderContent = () => {
        if (!props.open && (response.length > 0 || success)) {
            return renderHidden
        }

        if (!props.open && state === State.LOADING && (props.trigger || executingOutputMessage)) {
            return renderHiddenLoading
        }

        if (!props.open) {
            return renderHiddenDisabled
        }

        if (success && props.journey) {
            return renderSuccesPageJourney()
        }

        if (success) {
            return renderSuccesPage()
        }

        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'start',
                    p: 1,
                    zIndex: 5,
                    boxShadow: "none",
                    backgroundColor: "transparent",
                    width: props.maxWidth,
                    height: "100%"
                }}
            >
                {renderExpanded()}
                <GoProDisplay open={goProPopup} onClose={toggleProPopup} />
            </Box>
        )
    }

    return renderContent()
}
