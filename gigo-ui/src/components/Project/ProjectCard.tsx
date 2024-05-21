'use client'
import * as React from "react"
import { useEffect } from "react"
import {
    Box,
    Button,
    ButtonBase,
    Card,
    CardContent,
    CardMedia,
    Chip,
    createTheme,
    Dialog,
    Grid,
    PaletteMode,
    Tooltip,
    Typography
} from "@mui/material";
import { getAllTokens, theme } from "@/theme";
import UserIcon from "@/icons/User/UserIcon";
import HorseIcon from "@/icons/ProjectCard/Horse"
import HoodieIcon from "@/icons/ProjectCard/Hoodie";
import { KeyboardDoubleArrowUp, LockOutlined, QuestionMark } from "@mui/icons-material";
import TrophyIcon from "@/icons/ProjectCard/Trophy";
import GraduationIcon from "@/icons/ProjectCard/Graduation";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import renown1 from "@/img/renown/renown1.svg"
import renown2 from "@/img/renown/renown2.svg"
import renown3 from "@/img/renown/renown3.svg"
import renown4 from "@/img/renown/renown4.svg"
import renown5 from "@/img/renown/renown5.svg"
import renown6 from "@/img/renown/renown6.svg"
import renown7 from "@/img/renown/renown7.svg"
import renown8 from "@/img/renown/renown8.svg"
import renown9 from "@/img/renown/renown9.svg"
import renown10 from "@/img/renown/renown10.svg"
import DebugIcon from "@/icons/ProjectCard/Debug";
import Image from "next/image";
import { useAppSelector } from "@/reducers/hooks";
import { selectAuthState } from "@/reducers/auth/auth";
import Lock from "@mui/icons-material/Lock";
import GoProDisplay from "../GoProDisplay";


interface IProps {
    role: any | null;
    width: number | string,
    height: number | string,
    imageWidth: number | string,
    imageHeight: number | string,
    projectId: string,
    projectTitle: string,
    projectDesc: string,
    projectThumb: string,
    projectDate: Date,
    projectType: string,
    renown: number,
    onClick: () => void,
    userTier: string | number,
    userThumb: string,
    userId: string,
    username: string,
    backgroundName: string | null,
    backgroundPalette: string | null,
    backgroundRender: boolean | null,
    hover: boolean,
    attempt: boolean,
    exclusive: boolean | null,
    animate: boolean,
    estimatedTime: number | null
}

export default function ProjectCard(props: IProps) {
    const authState = useAppSelector(selectAuthState);

    const [goProPopup, setGoProPopup] = React.useState(false)

    const styles = {
        card: {
            width: props.width,
            // boxShadow: "0px 6px 3px -3px rgba(0,0,0,0.3),0px 3px 3px 0px rgba(0,0,0,0.3),0px 3px 9px 0px rgba(0,0,0,0.3)",
            // backgroundColor: theme.palette.background.default
            border: "none",
            boxShadow: "none",
            backgroundColor: "transparent",
            backgroundImage: "none",
            animation: props.animate ? 'auraEffect 2s infinite alternate' : 'none',
            overflow: "visible"
        },
        image: {
            borderRadius: "10px",
            // width: props.imageWidth,
            height: props.imageHeight,
            width: "100%",
            minWidth: 200,
            backgroundImage: "linear-gradient(45deg, rgba(255,255,255,0) 45%, rgba(0,0,0,1) 91%), url(" + props.projectThumb + ")",
            position: "relative",
            // objectFit: "fill",
        },
        date: {
            textOverflow: "ellipsis",
            overflow: "hidden",
            display: '-webkit-box',
            WebkitLineClamp: 5,
            WebkitBoxOrient: 'vertical',
            color: theme.palette.text.secondary,
            fontWeight: 200,
            fontSize: "0.55em",
            textAlign: "left",
            // paddingLeft: "10px",
        },
        title: {
            textOverflow: "ellipsis",
            overflow: "hidden",
            display: '-webkit-box',
            // WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            textAlign: "left",
            fontSize: "1rem",
        },
        username: {
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            width: "9ch", // approximately 4 characters wide
            fontSize: "0.65rem",
            fontWeight: 400,
        },
    };

    let hoverStartRef = React.useRef<Date | null>(null);
    let [showHover, setShowHover] = React.useState<boolean>(false);
    let [exit, setExit] = React.useState<boolean>(false);

    let imgSrc;
    switch (props.renown) {
        case 0:
            imgSrc = renown1;
            break;
        case 1:
            imgSrc = renown2;
            break;
        case 2:
            imgSrc = renown3;
            break;
        case 3:
            imgSrc = renown4;
            break;
        case 4:
            imgSrc = renown5;
            break;
        case 5:
            imgSrc = renown6;
            break;
        case 6:
            imgSrc = renown7;
            break;
        case 7:
            imgSrc = renown8;
            break;
        case 8:
            imgSrc = renown9;
            break;
        case 9:
            imgSrc = renown10;
            break;

    }

    const hoverWatcherRoutine = async () => {
        while (!exit) {
            if (!showHover && hoverStartRef.current !== null && (new Date().getTime() - hoverStartRef.current.getTime()) > 800) {
                setShowHover(true)
            }
            await new Promise(r => setTimeout(r, 3000));
        }
    }

    const getProjectIcon = (projectType: string) => {
        switch (projectType) {
            case "Playground":
                return (
                    <HorseIcon sx={{ width: "20px", height: "20px" }} />
                )
            case "Casual":
                return (
                    <HoodieIcon sx={{ width: "14px", height: "14px" }} />
                )
            case "Competitive":
                return (
                    <TrophyIcon sx={{ width: "16px", height: "16px" }} />
                )
            case "Interactive":
                return (
                    <GraduationIcon sx={{ width: "16px", height: "16px" }} />
                )
            case "Debug":
                return (
                    <DebugIcon sx={{ width: "18px", height: "18px" }} />
                )
            default:
                return (
                    <QuestionMark sx={{ width: "18px", height: "18px" }} />
                )
        }
    }

    /**
     * Convert millis duration to a well formatted time string with a min precision of minutes (ex: 1h2m)
     */
    const millisToTime = (millisDuration: number) => {
        const minutes = Math.floor((millisDuration / (1000 * 60)) % 60);
        const hours = Math.floor((millisDuration / (1000 * 60 * 60)) % 24);
        const days = Math.floor(millisDuration / (1000 * 60 * 60 * 24));

        let timeString = "";

        if (days > 0) {
            timeString += `${days}d `;
        }
        if (hours > 0) {
            timeString += `${hours}h `;
        }
        if (minutes > 0) {
            timeString += `${minutes}m `;
        }

        return timeString.trim();
    };

    const hoverModal = () => {
        return (
            <Dialog
                open={props.hover && showHover}
                fullWidth={true}
                maxWidth={"lg"}
                onClose={() => setShowHover(false)}
                componentsProps={{
                    backdrop: {
                        style: {
                            backdropFilter: "blur(15px)",
                            backgroundColor: "rgba(255,255,255,0.2)"
                        },
                    }
                }}
            >
                <Button
                    href={`/${props.attempt ? "attempt" : "challenge"}/${props.projectId}`}
                    sx={{
                        position: "absolute",
                        top: "20px",
                        float: "right",
                        right: "20px",
                    }}
                >
                    Open {props.attempt ? "Attempt" : "project"}
                </Button>
                <iframe
                    style={{
                        height: "85vh",
                        border: "none",
                        borderRadius: "10px",
                    }}
                    src={`/${props.attempt ? "attempt" : "challenge"}/${props.projectId}?embed=true`}
                    title={"Challenge Hover: " + props.projectId}
                />
            </Dialog>
        )
    }

    useEffect(() => {
        if (props.hover)
            hoverWatcherRoutine()
        return () => {
            setExit(true)
        }
    }, []);

    // @ts-ignore
    return (
        <>
            <style>
                {`
            @keyframes auraEffect {
                0% {
                    box-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px ${theme.palette.primary.main}, 0 0 20px ${theme.palette.primary.main}, 0 0 25px ${theme.palette.primary.main}, 0 0 30px ${theme.palette.primary.main} 0 0 35px ${theme.palette.primary.main};
                }
                100% {
                    box-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 25px ${theme.palette.primary.main}, 0 0 30px ${theme.palette.primary.main}, 0 0 35px ${theme.palette.primary.main}, 0 0 40px ${theme.palette.primary.main}, 0 0 50px ${theme.palette.primary.main};
                }
            }
            `}
            </style>
            {hoverModal()}
            <Card sx={styles.card}>
                <ButtonBase
                    href={`/${props.attempt ? "attempt" : "challenge"}/${props.projectId}`}
                    // onClick={props.onClick}
                    onMouseOver={() => {
                        if (hoverStartRef.current !== null)
                            return
                        hoverStartRef.current = new Date()
                    }}
                    onMouseLeave={() => {
                        hoverStartRef.current = null
                    }}
                    sx={{width: "100%"}}
                >
                    <Box sx={{ 
                        display: "flex", 
                        flexDirection: "column", 
                        justifyContent: "center", 
                        alignItems: "center", 
                        width: "100%", 
                        height: "fit-content",
                    }}>
                        <CardMedia
                            component="div"
                            sx={styles.image}
                        >
                            <Tooltip
                                title={`Renown ${props.renown + 1}`}
                            >
                                <Image
                                    style={{
                                        height: `calc(${props.imageHeight} / 4)`,
                                        width: "auto",
                                        opacity: "0.85",
                                        overflow: "hidden",
                                        position: "absolute",
                                        top: "10px",
                                        right: "10px",
                                    }}
                                    src={imgSrc}
                                    alt={""}
                                />
                            </Tooltip>
                        </CardMedia>
                        <CardContent
                            sx={{
                                paddingBottom: "8px !important",
                                paddingTop: "10px",
                                paddingLeft: "8px",
                                paddingRight: "8px",
                                width: "100%",
                            }}
                        >
                            <Grid container rowSpacing={1} columnSpacing={2} justifyContent={"space-between"}>
                                <Grid item xs={3}>
                                    <UserIcon
                                        size={30}
                                        userId={props.userId}
                                        userTier={props.userTier}
                                        userThumb={props.userThumb}
                                        backgroundName={props.backgroundName}
                                        backgroundPalette={props.backgroundPalette}
                                        backgroundRender={props.backgroundRender}
                                        pro={props.role !== null && props.role.toString() === "1"}
                                    />
                                    <Tooltip
                                        title={`@${props.username}`}
                                    >
                                        <Typography gutterBottom variant="caption" component="div" sx={styles.username}>
                                            @{props.username}
                                        </Typography>
                                    </Tooltip>
                                    <Typography gutterBottom variant="h6" component="div" sx={styles.date}>
                                        {new Date(props.projectDate).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography gutterBottom variant="h6" component="div" sx={styles.title}>
                                        {props.projectTitle}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Box>
                </ButtonBase>
                <Grid container rowSpacing={1} columnSpacing={2} justifyContent={"space-between"}>
                    <Grid item xs={6}>
                        <Chip
                            sx={{ float: "left", fontSize: "0.6rem", height: "28px" }}
                            icon={getProjectIcon(props.projectType)}
                            color="primary"
                            label={props.projectType}
                            variant="outlined"
                        />
                        {props.exclusive !== null && props.exclusive !== undefined && props.exclusive ? (
                            <AttachMoneyIcon />
                        ) : null}
                    </Grid>
                    {(authState.role > 1 || !authState.authenticated) && props.estimatedTime !== null && props.estimatedTime > 0 ? (
                        <Grid item xs={3} sx={{ justifyContent: "right", alignItems: "center", display: "flex" }}>
                            <Tooltip title={"Estimated Tutorial Time"}>
                                <Typography
                                    sx={{ color: "grey" }}
                                    color="primary"
                                    variant="caption"
                                >{millisToTime(props.estimatedTime)}</Typography>
                            </Tooltip>
                        </Grid>
                    ) : null}
                    {authState.authenticated && authState.role <= 1 ? (
                        <Grid item xs={6} sx={{ justifyContent: "right", alignItems: "center", display: "flex" }}>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    e.preventDefault()
                                    setGoProPopup(true)
                                }}
                                startIcon={(
                                    <KeyboardDoubleArrowUp sx={{ fontSize: "0.5rem" }} />
                                )}
                                size="small"
                                sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    p: 0.5,
                                    minWidth: "0px",
                                    lineHeight: "0px",
                                    fontSize: "0.6rem",
                                }}
                            >
                                Pro Advanced+
                            </Button>
                        </Grid>
                    ) : null}
                </Grid>
            </Card>
            <GoProDisplay open={goProPopup} onClose={() => setGoProPopup(false)} />
        </>
    )
}

ProjectCard.defaultProps = {
    width: "20vw",
    height: "25vh",
    imageWidth: "20vw",
    imageHeight: "16vh",
    projectId: 0,
    projectTitle: "",
    projectDesc: "",
    projectThumb: "",
    projectDate: "",
    projectType: "",
    userTier: 0,
    userThumb: "",
    userId: "",
    username: "",
    backgroundName: null,
    backgroundPalette: null,
    backgroundRender: null,
    hover: true,
    attempt: false,
    role: null,
    animate: false,
    estimatedTime: 0,
    onClick: () => { }
}

