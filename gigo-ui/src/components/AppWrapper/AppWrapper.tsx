'use client'
import * as React from 'react';
import LoginIcon from '@mui/icons-material/Login';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from "@mui/icons-material/Explore";
import Drawer from "@mui/material/Drawer";
import {styled} from "@mui/material/styles";
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {AppBarProps as MuiAppBarProps} from "@mui/material/AppBar/AppBar";
import {BoxProps as MuiBoxProps} from "@mui/material/Box/Box";
import {AwesomeButton} from "react-awesome-button";
import 'react-awesome-button/dist/styles.css';
import premiumImage from "../../img/croppedPremium.png"
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ErrorIcon from '@mui/icons-material/Error';
import codeTeacher from "../../img/premiumPageIcons/graduation-cap.svg"
import resources from "../../img/premiumPageIcons/technology.svg"
import privateWorkspace from "../../img/premiumPageIcons/padlock.svg"
import proGorilla from "../../img/icons/proPopupFace.svg"
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import {
    Button,
    Card,
    CardContent,
    CssBaseline,
    Link,
    ListItemButton,
    Menu,
    Modal,
    SpeedDial,
    SpeedDialAction,
    TextField,
    ThemeProvider,
    Tooltip,
} from "@mui/material";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import FeedIcon from '@mui/icons-material/Feed';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CalculateIcon from '@mui/icons-material/Calculate';
import FolderIcon from '@mui/icons-material/Folder';
import UserIcon from "@/icons/User/UserIcon";
import {Holiday, holiday, theme, themeHelpers} from "@/theme";
import TopSearchBar from "../TopSearchBar";
import config from "@/config";
import swal from "sweetalert";
import {useAppDispatch, useAppSelector} from "@/reducers/hooks";
import {
    initialAuthState,
    initialAuthStateUpdate,
    selectAuthState,
    selectAuthStateAlreadyCancelled,
    selectAuthStateBackgroundName,
    selectAuthStateColorPalette,
    selectAuthStateExclusiveAgreement,
    selectAuthStateHasPaymentInfo,
    selectAuthStateHasSubscription,
    selectAuthStateInTrial,
    selectAuthStateThumbnail,
    selectAuthStateTutorialState,
    selectAuthStateUserName,
    TutorialState,
    updateAuthState,
} from "@/reducers/auth/auth";
import {isChrome} from "react-device-detect";
import {LocalFireDepartment, Quiz} from "@mui/icons-material";
import {Icon as IconifyIcon} from "@iconify/react";
import Snowfall from "react-snowfall";
import Confetti from "react-confetti";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import ChatContainer from "../Chat/ChatContainer";
import {
    initialAppWrapperStateUpdate,
    resetAppWrapper,
    selectAppWrapperClosedMobileWelcomeBanner,
    updateAppWrapper
} from "@/reducers/appWrapper/appWrapper";
import {clearProjectState} from "@/reducers/createProject/createProject";
import {clearSearchParamsState} from "@/reducers/searchParams/searchParams";
import {clearJourneyFormState} from "@/reducers/journeyForm/journeyForm";
import {ChatBubbleOutline, FolderOutlined, HomeOutlined, InfoOutlined} from "@mui/icons-material";
import Notification from "@/models/notification";
import NotificationPopup from "../NotificationPopup";
import {clearCache} from "@/reducers/pageCache/pageCache";
import CloseIcon from "@mui/icons-material/Close";
import {clearChatState} from "@/reducers/chat/chat";
import {clearMessageCache} from "@/reducers/chat/cache";
import {SocialIcon} from 'react-social-icons'
import Snackbar from '@mui/material/Snackbar';
import {RecordWebUsage, WebTrackingEvent} from '@/models/web_usage';
import {useTracking} from 'react-tracking';
import Pro from '@/icons/Pro';
import DevSpaceControls from '../DevSpaceControls';
import {sleep} from '@/services/utils';
import {decodeToken} from 'react-jwt';
import {clearBytesState} from "@/reducers/bytes/bytes";
import Image from "next/image";


interface IProps {
}


export default function AppWrapper(props: React.PropsWithChildren<IProps>) {
    const drawerWidth = 200;
    let router = useRouter();
    let query = useSearchParams();
    let pathname = usePathname();
    let isMobile = query.get("viewport") === "mobile";
    const [isClient, setIsClient] = React.useState(false)
    React.useEffect(() => {
        setIsClient(true)
    }, [])

    const {trackEvent} = useTracking({}, {
        dispatch: (data: any) => {
            fetch(
                `${config.rootPath}/api/recordUsage`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }
            )
        }
    });

    // Check if the current page is ByteMobile
    const isByteMobilePage = pathname.startsWith('/byte/') && isMobile;

    const dispatch = useAppDispatch();

    let loggedIn = false
    const authState = useAppSelector(selectAuthState);
    if (authState.authenticated) {
        loggedIn = true
    }

    let onHomePage = (
        (pathname === '/home' || pathname === '/home/' ||
            pathname === '' || pathname === '/')
    )

    let homePageLockedDrawer = loggedIn && onHomePage && !isMobile

    const thumbnail = useAppSelector(selectAuthStateThumbnail);
    const exclusiveAgreement = useAppSelector(selectAuthStateExclusiveAgreement);
    const colorPalette = useAppSelector(selectAuthStateColorPalette);
    const backgroundName = useAppSelector(selectAuthStateBackgroundName);
    const username = useAppSelector(selectAuthStateUserName)
    const tutorialState = useAppSelector(selectAuthStateTutorialState)
    const mobileWelcomeBannerClosed = useAppSelector(selectAppWrapperClosedMobileWelcomeBanner)
    const inTrial = useAppSelector(selectAuthStateInTrial)
    const hasPaymentInfo = useAppSelector(selectAuthStateHasPaymentInfo)
    const hasSubscription = useAppSelector(selectAuthStateHasSubscription)
    const alreadyCancelled = useAppSelector(selectAuthStateAlreadyCancelled)

    const [leftOpen, setLeftOpen] = React.useState(query.get("menu") === "true");
    const [rightOpen, setRightOpen] = React.useState(query.get("chat") === "true" && authState.authenticated);
    const [speedDialOpen, setSpeedDialOpen] = React.useState(false);
    const [reportPopup, setReportPopup] = React.useState(false)

    const textFieldRef = React.useRef();
    const [notifications, setNotifications] = React.useState<Notification[]>([]);
    const [notificationCount, setNotificationCount] = React.useState<number>(0);
    const [showReferPopup, setShowReferPopup] = React.useState(false)
    const [isOpen, setIsOpen] = React.useState(false);
    const [openSetup, setOpenSetup] = React.useState(false)
    const toggleButtonRef = React.useRef(null);

    const [renderDevelopment, setRenderDevelopment] = React.useState(config.development)

    const styles = {
        regular: {
            ...themeHelpers.frostedGlass,
            zIndex: 999,
            border: "none",
            backgroundColor: theme.palette.primary.main + "20",
        },
        holiday: {
            ...themeHelpers.frostedGlass,
            zIndex: 999,
            border: "none",
            backgroundColor: theme.palette.primary.main,
        },
        christmas: {
            zIndex: 999,
            border: "none",
            backgroundImage: `url(/img/candycane.svg)`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
        },
        independence: {
            zIndex: 999,
            border: "none",
            backgroundImage: `url(/img/us_flag.svg)`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
        },
    };

    let holidayStyle: any = styles.regular;
    let gigoColor = theme.palette.primary.contrastText

    if (holiday !== null) {
        switch (holiday) {
            case Holiday.Christmas:
                if (theme.palette.mode === 'light') {
                    gigoColor = theme.palette.text.primary
                    break
                }
                holidayStyle = styles.christmas;
                break;
            case Holiday.Independence:
                console.log("Independence Set")
                holidayStyle = styles.independence;
                gigoColor = "white"
                break;
            default:
                holidayStyle = styles.holiday;
        }
    }

    console.log("holiday: ", holidayStyle)


    const DrawerHeader = styled('div')(({theme}) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    }));

    const DrawerFooter = styled('div')(({theme}) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'center',
        marginTop: 'auto',
    }));

    const handleDrawerOpen = () => {
        setLeftOpen(true);
        let q = new URLSearchParams(query);
        q.set("menu", "true");
        if (rightOpen) {
            q.delete("chat");
            setRightOpen(false);
        }

        router.push(pathname + "?" + q.toString(), {scroll: false});
    };
    const handleDrawerClose = () => {
        setLeftOpen(false);
        let q = new URLSearchParams(query);
        q.delete("menu");
        router.push(pathname + "?" + q.toString(), {scroll: false});
    };

    const handleChatButton = () => {
        let action = true;
        if (rightOpen) {
            action = false;
        }

        setRightOpen(action);
        let q = new URLSearchParams(query);
        if (action) {
            q.set("chat", "true");
        } else {
            q.delete("chat");
        }

        if (action && leftOpen) {
            q.delete("menu");
            setLeftOpen(false);
        }

        router.push(pathname + "?" + q.toString(), {scroll: false});
    }

    const handleCloseMobileWelcomeBanner = () => {
        let appWrapperState = Object.assign({}, initialAppWrapperStateUpdate);
        appWrapperState.closedMobileWelcomeBanner = true;
        dispatch(updateAppWrapper(appWrapperState))
    }


    interface AppBarProps extends MuiAppBarProps {
        leftopen?: boolean;
        rightopen?: boolean;
    }

    const AppBar = styled(MuiAppBar, {
        shouldForwardProp: (prop) => prop !== 'leftopen' && prop !== 'rightopen',
    })<AppBarProps>(({theme, leftopen, rightopen}) => ({
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(leftopen && {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: `${drawerWidth}px`,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
        ...(rightopen && {
            width: `calc(100% - ${drawerWidth * 1.5}px)`,
            marginRight: `${drawerWidth * 1.5}px`,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
        ...(leftopen && rightopen && {
            width: `calc(100% - ${drawerWidth * 2.5}px)`,
            marginLeft: `${drawerWidth}px`,
            marginRight: `${drawerWidth * 1.5}px`,
        }),
    }));

    interface ContentContainerProps extends MuiBoxProps {
        leftOpen?: boolean;
        rightOpen?: boolean;
    }

    const ContentContainer = styled(Box, {
        shouldForwardProp: (prop) => prop !== 'leftOpen' && prop !== 'rightOpen',
    })<ContentContainerProps>(({theme, leftOpen, rightOpen}) => ({
        overflowX: 'hidden',
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(leftOpen && !rightOpen && {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: `${drawerWidth}px`,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
        ...(rightOpen && !leftOpen && {
            width: `calc(100% - ${drawerWidth * 1.5}px)`,
            marginRight: `${drawerWidth * 1.5}px`,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
        ...(leftOpen && rightOpen && {
            width: `calc(100% - ${drawerWidth * 2.5}px)`,
            marginLeft: `${drawerWidth}px`,
            marginRight: `${drawerWidth * 1.5}px`,
        }),
    }));

    const memoizedChildren = React.useMemo(() => (
        <ContentContainer
            leftOpen={leftOpen || homePageLockedDrawer}
            rightOpen={rightOpen}
            style={{
                marginTop: isByteMobilePage
                    ? "0px"
                    : pathname.startsWith("/launchpad/") && query.get("editor") === "true"
                        ? "28px"
                        : "64px"
            }}
            id={"contentContainer"}
        >
            {props.children}
        </ContentContainer>
    ), [leftOpen, homePageLockedDrawer, rightOpen, props.children]);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCreateAccount = () => {
        router.push("/signup?forward=" + encodeURIComponent(pathname))
    }

    const handleLogin = () => {
        router.push("/login?forward=" + encodeURIComponent(pathname))
    }


    const handleProfile = () => {
        setAnchorEl(null);
        router.push("/profile")
    };

    const clearReducers = () => {
        let authState = Object.assign({}, initialAuthState)
        // @ts-ignore
        dispatch(updateAuthState(authState))

        dispatch(resetAppWrapper())
        dispatch(clearProjectState())
        dispatch(clearSearchParamsState())
        dispatch(clearJourneyFormState())
        dispatch(clearCache())
        dispatch(clearMessageCache())
        dispatch(clearChatState())
        dispatch(clearBytesState())
    }

    const updateToken = async () => {
        let res = await fetch(
            `${config.rootPath}/api/auth/updateToken`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: '{}',
                credentials: 'include'
            }
        ).then(async (response) => {
            let data: any = await response.json();
            if (data.token) {
                let auth: {
                    [key: string]: any
                } | null = decodeToken(data.token);
                if (!auth) {
                    return;
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
                dispatch(updateAuthState(authState))

                await sleep(1000)
            }
        })
    }

    const restartTutorialClick = () => {
        let authState = Object.assign({}, initialAuthStateUpdate)
        // copy the existing state
        let state = Object.assign({}, tutorialState)
        // update the state
        switch (pathname.split("/")[1]) {
            case "home":
                state.home = false
                break;
            case "challenge":
                state.challenge = false
                break;
            case "workspace":
                state.workspace = false
                break;
            case "streak":
                state.stats = false
                break;
            case "nemesis":
                state.nemesis = false
                break;
            case "launchpad":
                // reset the vscode tutorial if editor query param is true
                if (query.has("editor") && query.get("editor") === "true") {
                    state.vscode = false
                } else {
                    state.launchpad = false
                }
                break;
            case "create-challenge":
                state.create_project = false
                break;
            case "byte":
                state.bytes = false
                break;
        }
        authState.tutorialState = state
        // @ts-ignore
        dispatch(updateAuthState(authState))
    }

    const reportIssue = async () => {
        if (!textFieldRef.current) {
            swal("Error", "Please enter a description of the issue you are having!", "error")
            return
        }

        let res = await fetch(
            `${config.rootPath}/api/reportIssue`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    page: pathname,
                    // @ts-ignore
                    issue: textFieldRef.current.value,
                }),
                credentials: 'include'
            }
        ).then(async (response) => {
            let data: any = await response.json();
            if (data["message"] === "You must be logged in to access the GIGO system.") {
                clearReducers()
            }
            if (data["message"] !== undefined && data["message"] === "Thank you for your feedback!") {
                setReportPopup(false)
                swal("Thank you for your feedback!")
            } else {
                swal("Something went wrong, please try again.")
            }
        })
    }

    const handleLogout = React.useCallback(async () => {
        if (!isClient) {
            return
        }

        const forwardPath = encodeURIComponent(pathname);
        clearReducers()

        let res = await fetch(
            `${config.rootPath}/api/auth/logout`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: '{}',
                credentials: 'include'
            }
        ).then(async (response) => {
            let data: any = await response.json();

            const payload: RecordWebUsage = {
                host: window.location.host,
                event: WebTrackingEvent.Logout,
                timespent: 0,
                path: pathname,
                latitude: null,
                longitude: null,
                metadata: {},
            }
            trackEvent(payload);

            if (data["message"] === "You must be logged in to access the GIGO system.") {
                clearReducers()
            }
            if (data["message"] !== undefined && data["message"] === "success") {
                router.push("/login?forward=" + forwardPath)
            }
            const persistOptions = {};
            // persistStore(store, persistOptions).purge()
        })
    }, [isClient])

    const getNotifications = async () => {
        if (!authState) {
            setNotifications([])
            return;
        }

        setNotifications([])
        let res = await fetch(
            `${config.rootPath}/api/notification/get`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: '{}',
                credentials: 'include'
            }
        ).then(async (response) => {
            let data: any = await response.json();
            if (data["message"] === "You must be logged in to access the GIGO system.") {
                return
            }
            if (data["notifications"] === undefined) {
                return
            }
            setNotifications(data["notifications"])
            setNotificationCount(data["notifications"].length)
        })
    }

    const handleSettings = () => {
        setAnchorEl(null);
        router.push("/settings")
    };

    React.useEffect(() => {
        if (loggedIn) {
            getNotifications();
            // refresh the user token when the enter the app if they haven't been here within the last hour
            // this doesn't extend their session just ensures they have the latest session metadata
            if (authState.lastRefresh === null || Date.now() - authState.lastRefresh < 1000 * 60 * 60)
                updateToken()
        }

    }, []);


    const handleExclusiveContent = React.useCallback(() => {
        if (!isClient) {
            return
        }

        setAnchorEl(null);
        if (exclusiveAgreement || window.sessionStorage.getItem('exclusiveAgreement') === "true") {
            window.sessionStorage.setItem("exclusiveProject", "true")
            router.push("/create-challenge")
        } else {
            router.push("/aboutExclusive")
        }
    }, [isClient])

    const handleCurateContent = () => {
        setAnchorEl(null);

        if (username === "gigo") {
            router.push("/curateAdmin")
        }
    };

    const reportIssueMemo = React.useMemo(() => (
        <Box
            sx={{
                width: "40vw",
                height: "30vh",
                justifyContent: "center",
                marginLeft: "30vw",
                marginTop: "30vh",
                outlineColor: "black",
                borderRadius: 1,
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1);",
                backgroundColor: theme.palette.background.default,
            }}
        >
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    height: "100%",
                }}
            >
                <Typography variant="h5"
                            component="h2"
                            align="center"
                            style={{
                                marginTop: "-10px",
                                marginBottom: "10px",
                                color: theme.palette.text.primary,
                            }}>
                    Report Issue
                </Typography>
                <TextField
                    inputRef={textFieldRef}
                    id="errorReport"
                    variant="outlined"
                    color="primary"
                    label="Describe your issue or just give us feedback!"
                    required={true}
                    margin="normal"
                    multiline={true}
                    minRows={3}
                    maxRows={15}
                    sx={{
                        width: "30vw",
                        marginBottom: "25px",
                    }}
                />
                <Button
                    sx={{
                        marginBottom: "-15px",
                    }}
                    onClick={() => reportIssue()}>Submit</Button>
            </div>
        </Box>
    ), [])

    const renderTutorialButton = () => {
        if (!(
            pathname.startsWith('/home') ||
            pathname.startsWith('/challenge') ||
            pathname.startsWith('/workspace') ||
            pathname.startsWith('/launchpad') ||
            pathname.startsWith('/create-challenge') ||
            pathname.startsWith('/streak') ||
            pathname.startsWith('/nemesis') ||
            pathname.startsWith('/byte')
        )) {
            return null;
        }

        return (
            <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                <Tooltip title={"Restart Tutorial. Click to close at any point."}>
                    <Button onClick={() => restartTutorialClick()}>
                        <HelpOutlineIcon height={"25"} width={"25"}/>
                    </Button>
                </Tooltip>
            </div>
        )
    }

    const copyToClipboard = React.useCallback(async () => {
        if (!isClient) {
            return
        }

        const urlLink = window.location.href
        const regex = /https?:\/\/[^\/]+/;
        const referralLink =
            //@ts-ignore
            urlLink.match(regex)[0] + "/referral/" + encodeURIComponent(username)

        try {
            await navigator.clipboard.writeText(referralLink);
            console.log('Text copied to clipboard');
        } catch (err) {
            console.log('Failed to copy text: ', err);
        }
    }, [isClient])


    const userIconMemoLarge = React.useMemo(() => {
        return (
            <UserIcon
                userId={authState.id}
                userTier={authState.tier}
                userThumb={config.rootPath + thumbnail}
                size={40}
                backgroundName={authState.backgroundName}
                backgroundPalette={authState.backgroundColor}
                backgroundRender={authState.backgroundRenderInFront}
                profileButton={false}
                pro={authState.role.toString() === "1"}
                mouseMove={false}
            />
        )
    }, [authState, thumbnail])

    const userIconMemoSmall = React.useMemo(() => {
        return (
            <UserIcon
                userId={authState.id}
                userTier={authState.tier}
                userThumb={config.rootPath + thumbnail}
                size={25}
                backgroundName={authState.backgroundName}
                backgroundPalette={authState.backgroundColor}
                backgroundRender={authState.backgroundRenderInFront}
                profileButton={false}
                pro={authState.role.toString() === "1"}
                mouseMove={false}
            />
        )
    }, [authState, thumbnail])


    const renderAppBar = () => {
        if (isByteMobilePage) return null;

        let referralLink = ""
        if (isClient) {
            const urlLink = window.location.href
            const regex = /https?:\/\/[^\/]+/;
            referralLink =
                //@ts-ignore
                urlLink.match(regex)[0] + "/referral/" + encodeURIComponent(username)
        }

        return (
            <AppBar
                position="fixed"
                leftopen={false}
                elevation={5}
                style={{
                    height: "64px",
                    backgroundImage: `conic-gradient(from 0deg at 50% 50%, #FEDC5A20 0deg, #FFFCAB20 73.13deg, #29C18C20 155.62deg, #3D8EF720 249.37deg, #84E8A220 339.37deg, #FEDC5A20 360deg)`,
                    zIndex: 999,
                    border: "none",
                    boxShadow: (theme.palette.mode === 'dark') ? "0px 3px 5px -1px #ffffff20, 0px 5px 8px 0px #ffffff14, 0px 1px 14px 0px #ffffff12" :
                        "0px 3px 5px -1px #00000020, 0px 5px 8px 0px #00000014, 0px 1px 14px 0px #00000012",
                }}
            >
                <Toolbar
                    sx={holidayStyle}
                >
                    {!homePageLockedDrawer ? (
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            sx={{mr: 2}}
                            onClick={() => leftOpen ? handleDrawerClose() : handleDrawerOpen()}
                        >
                            <MenuIcon style={{color: gigoColor}}/>
                        </IconButton>
                    ) : (
                        <div/>
                    )}
                    <Button href={"/home"} style={{color: theme.palette.text.primary, zIndex: "600000"}}>
                        <Box>
                            <Typography variant="h6" component="span" style={{color: gigoColor}}>
                                GIGO
                            </Typography>
                            <Typography variant="caption" component="span" style={{
                                fontSize: '8px',
                                marginLeft: '5px',
                                textTransform: 'lowercase',
                                color: gigoColor
                            }}>
                                [beta]
                            </Typography>
                        </Box>
                    </Button>
                    <TopSearchBar width={"35vw"} height={"auto"} />
                    <Box sx={{flexGrow: 1}}/>
                    {loggedIn ? (
                        <Box>
                            <NotificationPopup
                                notificationCount={notificationCount}
                                notifications={notifications}
                                setNotifications={setNotifications}
                                setNotificationCount={setNotificationCount}
                            />
                        </Box>
                    ) : (
                        <div/>
                    )}
                    <div style={{width: "20px"}}/>
                    <Box sx={{width: "50px"}}/>
                    {loggedIn ? (
                        <Box sx={{
                            overflow: "hidden",
                        }}>
                            <Button
                                size={"small"}
                                aria-label="account of current user"
                                onClick={handleMenu}
                                variant="text"
                            >
                                <Typography
                                    sx={{color: theme.palette.primary.contrastText, mr: 2, textTransform: "none"}}>
                                    {username}
                                </Typography>
                                {userIconMemoLarge}
                                {inTrial && !hasPaymentInfo && (
                                    <ErrorIcon
                                        style={{
                                            color: "orange",
                                            position: 'absolute',
                                            bottom: 0, // align to the bottom
                                            right: 0, // align to the right
                                            fontSize: '1rem'
                                        }}
                                    />
                                )}
                            </Button>
                            <Menu
                                id="menu-appbar"
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                                <MenuItem onClick={handleSettings}>Account Settings</MenuItem>
                                <MenuItem onClick={handleExclusiveContent}>Exclusive Content</MenuItem>
                                {username === "gigo" && (
                                    <MenuItem onClick={handleCurateContent}>Curate Content</MenuItem>
                                )}
                                <MenuItem onClick={async () => {
                                    await handleLogout()
                                }}>Logout</MenuItem>
                                <MenuItem onClick={() => setShowReferPopup(true)}>Refer A Friend</MenuItem>
                                {inTrial && !hasPaymentInfo && (
                                    <MenuItem onClick={() => setOpenSetup(true)}>
                                        <h4 style={{color: "red", paddingRight: "5px"}}>Finish Setup</h4>
                                        <ErrorIcon style={{color: "orange"}}/>
                                    </MenuItem>
                                )}
                            </Menu>
                            <Modal open={showReferPopup} onClose={() => setShowReferPopup(false)}>
                                <Box
                                    sx={{
                                        width: "30vw",
                                        minHeight: "340px",
                                        height: "30vh",
                                        justifyContent: "center",
                                        marginLeft: "35vw",
                                        marginTop: "35vh",
                                        outlineColor: "black",
                                        borderRadius: 1,
                                        boxShadow: "0px 12px 6px -6px rgba(0,0,0,0.6),0px 6px 6px 0px rgba(0,0,0,0.6),0px 6px 18px 0px rgba(0,0,0,0.6)",
                                        backgroundColor: theme.palette.background.default,
                                    }}
                                >
                                    <Button onClick={() => setShowReferPopup(false)}>
                                        <CloseIcon/>
                                    </Button>
                                    <div style={{
                                        width: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        flexDirection: "column"
                                    }}>
                                        <h3>Refer a Friend.</h3>
                                        <h4>Give a Month, Get a Month.</h4>
                                        <div style={{
                                            display: "flex",
                                            width: "100%",
                                            flexDirection: "row",
                                            justifyContent: "center"
                                        }}>
                                            <h5 style={{outline: "solid gray", borderRadius: "5px", padding: "8px"}}
                                                id={"url"}>{referralLink.length > 50 ? referralLink.slice(0, 50) + "..." : referralLink}</h5>
                                            <Button onClick={() => copyToClipboard()}>
                                                <ContentCopyIcon/>
                                            </Button>
                                        </div>
                                    </div>
                                </Box>
                            </Modal>
                            <Modal open={openSetup} onClose={() => setOpenSetup(false)}>
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: 'auto',
                                        maxWidth: '600px',
                                        p: 4,
                                        borderRadius: 5,
                                        boxShadow: "0px 12px 6px -6px rgba(0,0,0,0.6),0px 6px 6px 0px rgba(0,0,0,0.6),0px 6px 18px 0px rgba(0,0,0,0.6)",
                                        // backgroundColor: theme.palette.background.default,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        background: 'linear-gradient(45deg, #142623 30%, #306c57)'
                                    }}
                                >
                                    <Box mb={2} style={{position: "absolute", top: 5, right: 10}}>
                                        <Button onClick={() => setOpenSetup(false)}>
                                            <CloseIcon/>
                                        </Button>
                                    </Box>
                                    <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                        <Image alt={""} src={proGorilla} width={170} height={130}/>
                                        <div style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            height: "auto",
                                            justifyContent: "center"
                                        }}>
                                            <h1 style={{
                                                marginBottom: '0',
                                                lineHeight: '.5',
                                                marginLeft: "25%",
                                                textShadow: "-4px 1px #618a7c",
                                                fontWeight: "bold",
                                                fontStyle: "italic",
                                                color: "#9dbab0"
                                            }}>PRO</h1>
                                            <h1 style={{fontWeight: "300", color: "#9dbab0"}}>GIGO</h1>
                                        </div>
                                    </div>
                                    <div style={{height: "15px"}}/>
                                    <Card style={{
                                        background: 'linear-gradient(45deg, #2c473f 30%, #376454)',
                                        borderRadius: "12%"
                                    }}>
                                        <Typography id="pro-membership-modal-title" variant="h6" component="h2"
                                                    color={"#829c93"} textAlign="center" mb={3} marginTop={"10px"}
                                                    marginBottom={"-5px"}>
                                            Keep enjoying these features
                                        </Typography>
                                        <CardContent>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                mb: 2,
                                                p: 2,
                                                borderRadius: '30px',
                                                backgroundColor: "#648378",
                                                height: "110px"
                                            }}>
                                                <Box sx={{mr: 2, display: 'flex', alignItems: 'center'}}>
                                                    {/* Replace with actual icon */}
                                                    <Image alt={""} src={codeTeacher} width={50} height={50}/>
                                                </Box>
                                                <Box>
                                                    <Typography variant="subtitle1"
                                                                style={{fontWeight: "bold", color: "#9dbab0"}}>
                                                        Code Teacher
                                                    </Typography>
                                                    <Typography variant="body2" color="#9dbab0">
                                                        Unrestricted access to the best integrated programming tutor.
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                        <CardContent>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                mb: 2,
                                                p: 2,
                                                borderRadius: '30px',
                                                backgroundColor: "#648378",
                                                height: "110px"
                                            }}>
                                                <Box sx={{mr: 2, display: 'flex', alignItems: 'center'}}>
                                                    {/* Replace with actual icon */}
                                                    <Image alt={""} src={resources} width={50} height={50}/>
                                                </Box>
                                                <Box>
                                                    <Typography variant="subtitle1"
                                                                style={{fontWeight: "bold", color: "#9dbab0"}}>
                                                        Improved Resource Limit
                                                    </Typography>
                                                    <Typography variant="body2" color="#9dbab0">
                                                        More resources, better compute, more possibilities.
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                        <CardContent>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                mb: 2,
                                                p: 2,
                                                borderRadius: '30px',
                                                backgroundColor: "#648378",
                                                height: "110px"
                                            }}>
                                                <Box sx={{mr: 2, display: 'flex', alignItems: 'center'}}>
                                                    {/* Replace with actual icon */}
                                                    <Image alt={""} src={privateWorkspace} width={50} height={50}/>
                                                </Box>
                                                <Box>
                                                    <Typography variant="subtitle1"
                                                                style={{fontWeight: "bold", color: "#9dbab0"}}>
                                                        Private Projects
                                                    </Typography>
                                                    <Typography variant="body2" color="#9dbab0">
                                                        Keep your top-secret work for your eyes only.
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                        <CardContent style={{textAlign: "center", marginTop: "-10px"}}>
                                            <AwesomeButton href={"/premium"} style={{
                                                '--button-primary-color': "#628277",
                                                '--button-primary-color-dark': "#4e6c61",
                                                '--button-primary-color-light': "#41594f",
                                                '--button-primary-color-hover': "#4e6c61",
                                                margin: "auto",
                                                "--button-default-border-radius": "20px"
                                            }}>
                                                Learn More
                                            </AwesomeButton>
                                        </CardContent>
                                    </Card>
                                    <Box textAlign="center" mt={3}>
                                        <AwesomeButton onPress={() => stripeNavigate()} style={{
                                            '--button-primary-color': "#9dbab0",
                                            '--button-primary-color-dark': "#4a5d5b",
                                            '--button-primary-color-light': "#4a5d5b",
                                            '--button-primary-color-hover': "#8aa49b",
                                            "--button-default-border-radius": "20px"
                                        }}>
                                            Add Payment Method
                                        </AwesomeButton>
                                    </Box>
                                </Box>
                            </Modal>
                        </Box>
                    ) : (
                        <Box sx={{display: {xs: 'none', md: 'flex'}}}>
                            <Tooltip title={"Login or Create Account!"}>
                                <Button
                                    size="large"
                                    aria-label="account of current user"
                                    aria-haspopup="true"
                                    onClick={handleMenu}
                                    color="primary"
                                    variant='outlined'
                                    sx={{
                                        color: theme.palette.primary.contrastText,
                                        borderColor: theme.palette.primary.contrastText,
                                        backdropFilter: "blur(3px)",
                                    }}
                                >
                                    Signup / Login
                                </Button>
                            </Tooltip>
                            <Menu
                                id="menu-appbar"
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}>
                                <MenuItem onClick={handleCreateAccount}>Create Account</MenuItem>
                                <MenuItem onClick={handleLogin}>Login</MenuItem>
                            </Menu>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>
        )
    }

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
        ).then(async (response) => {
            let data: any = await response.json();
            if (data["message"] === "You must be logged in to access the GIGO system.") {
                let authState = Object.assign({}, initialAuthStateUpdate)
                // @ts-ignore
                dispatch(updateAuthState(authState))
                router.push("/login?forward=" + encodeURIComponent(pathname))
            }

            if (data["return url"] !== undefined) {
                router.push(data["return url"])
            }
        })
    }

    const renderDevSpaceControls = () => {
        if (!isClient) {
            return null
        }

        return (
            <>
                <div style={{
                    position: 'fixed',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 1000,
                }}>
                    <DevSpaceControls
                        wsId={window.location.href.split("/launchpad/")[1].split('?')[0]}
                    />
                </div>
            </>
        )
    }

    const renderWorkspaceAppBar = () => {
        let toolbarStyles = JSON.parse(JSON.stringify(holidayStyle));
        toolbarStyles.height = "32px"
        toolbarStyles.minHeight = "32px !important"


        return (
            <AppBar
                position="fixed"
                leftopen={false}
                elevation={5}
                style={{
                    height: "32px",
                    backgroundImage: `conic-gradient(from 0deg at 50% 50%, #FEDC5A20 0deg, #FFFCAB20 73.13deg, #29C18C20 155.62deg, #3D8EF720 249.37deg, #84E8A220 339.37deg, #FEDC5A20 360deg)`,
                    zIndex: 1000,
                    border: "none",
                    boxShadow: (theme.palette.mode === 'dark') ? "0px 3px 5px -1px #ffffff20, 0px 5px 8px 0px #ffffff14, 0px 1px 14px 0px #ffffff12" :
                        "0px 3px 5px -1px #00000020, 0px 5px 8px 0px #00000014, 0px 1px 14px 0px #00000012",
                }}
            >
                <Toolbar
                    sx={toolbarStyles}
                >
                    {loggedIn && !homePageLockedDrawer ? (
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            sx={{mr: 2}}
                            onClick={() => leftOpen ? handleDrawerClose() : handleDrawerOpen()}
                        >
                            <MenuIcon style={{color: gigoColor}}/>
                        </IconButton>
                    ) : (
                        <div/>
                    )}
                    <Button href={"/home"} style={{color: theme.palette.text.primary, zIndex: "600000"}}>
                        <Box>
                            <Typography variant="h6" component="span" style={{color: gigoColor}}>
                                GIGO
                            </Typography>
                            <Typography variant="caption" component="span" style={{
                                fontSize: '8px',
                                marginLeft: '5px',
                                textTransform: 'lowercase',
                                color: gigoColor
                            }}>
                                [beta]
                            </Typography>
                        </Box>
                    </Button>
                    {loggedIn ? renderDevSpaceControls() : (
                        <Button onClick={async () => {
                            router.push("/signup?forward=" + encodeURIComponent(pathname))
                        }} sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '18%',
                            height: '55px',
                            left: '8% ',
                            color: theme.palette.primary.contrastText
                        }}>
                            New accounts get 1 month of Pro!
                        </Button>
                    )}
                    <Box sx={{flexGrow: 1}}/>

                    <div style={{width: "20px"}}/>
                    <Box sx={{width: "50px"}}/>
                    {loggedIn ? (
                        <Box sx={{
                            overflow: "hidden",
                        }}>
                            <Button
                                size={"small"}
                                aria-label="account of current user"
                                onClick={handleMenu}
                                variant="text"
                            >
                                <Typography
                                    sx={{color: theme.palette.primary.contrastText, mr: 2, textTransform: "none"}}>
                                    {username}
                                </Typography>
                                {userIconMemoSmall}
                            </Button>
                            <Menu
                                id="menu-appbar"
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                                <MenuItem onClick={handleSettings}>Account Settings</MenuItem>
                                <MenuItem onClick={handleExclusiveContent}>Exclusive Content</MenuItem>
                                {username === "gigo" && (
                                    <MenuItem onClick={handleCurateContent}>Curate Content</MenuItem>
                                )}
                                <MenuItem onClick={async () => {
                                    await handleLogout()
                                }}>Logout</MenuItem>
                            </Menu>
                        </Box>
                    ) : (
                        <Box sx={{display: {xs: 'none', md: 'flex'}}}>
                            <Tooltip title={"Login or Create Account!"}>
                                <Button
                                    size="large"
                                    aria-label="account of current user"
                                    aria-haspopup="true"
                                    onClick={handleMenu}
                                    color="primary"
                                    variant='outlined'
                                    sx={{
                                        color: theme.palette.primary.contrastText,
                                        borderColor: theme.palette.primary.contrastText,
                                    }}
                                >
                                    Signup / Login
                                </Button>
                            </Tooltip>
                            <Menu
                                id="menu-appbar"
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}>
                                <MenuItem onClick={handleCreateAccount}>Create Account</MenuItem>
                                <MenuItem onClick={handleLogin}>Login</MenuItem>
                            </Menu>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>
        )
    }

    const closeChat = () => {
        setRightOpen(false);
        let q = new URLSearchParams(query);
        q.delete("menu");
        router.push(pathname + "?" + q.toString(), {scroll: false});
    }

    const actions = [
        {
            icon: <InfoOutlined/>, name: 'About', action: () => {
                closeChat();
                router.push('/about')
            }
        },
        {
            icon: <span role="img" aria-label="banana">🍌</span>, name: 'Bytes', action: () => {
                closeChat();
                router.push('/bytesMobile')
            }
        },
        {
            icon: <HomeOutlined/>, name: 'Home', action: () => {
                closeChat();
                router.push('/home')
            }
        },
        {
            icon: <FolderOutlined/>, name: 'Active', action: () => {
                closeChat();
                router.push('/active')
            }
        },
        {
            icon: <ChatBubbleOutline/>, name: 'Chat', action: handleChatButton
        },
        {
            icon: <AutoStoriesIcon/>, name: 'Articles', action: () => {
                closeChat();
                router.push('/articles')
            }
        },
    ];

    const actionsLoggedOut = [
        {
            icon: <InfoOutlined/>, name: 'About', action: () => {
                closeChat();
                router.push('/about')
            }
        },
        {
            icon: <span role="img" aria-label="banana">🍌</span>, name: 'Bytes', action: () => {
                closeChat();
                router.push('/bytesMobile')
            }
        },
        {
            icon: <HomeOutlined/>, name: 'Home', action: () => {
                closeChat();
                router.push('/home')
            }
        },
        {
            icon: <AutoStoriesIcon/>, name: 'Articles', action: () => {
                closeChat();
                router.push('/articles')
            }
        },
    ];

    const handleAction = (actionFunction: () => void) => {
        setSpeedDialOpen(false);
        actionFunction();
    };

    const mobileAppBar = () => {
        // Do not render AppBar if it's the byteMobile page
        if (isByteMobilePage) return null;

        let referralLink = ""
        if (isClient) {
            const urlLink = window.location.href
            const regex = /https?:\/\/[^\/]+/;
            referralLink =
                //@ts-ignore
                urlLink.match(regex)[0] + "/referral/" + encodeURIComponent(username)
        }

        return (
            <>
                <AppBar
                    position="fixed"
                    leftopen={false}
                    elevation={5}
                    sx={{
                        height: "56px",
                        backgroundImage: `conic-gradient(from 0deg at 50% 50%, #FEDC5A20 0deg, #FFFCAB20 73.13deg, #29C18C20 155.62deg, #3D8EF720 249.37deg, #84E8A220 339.37deg, #FEDC5A20 360deg)`,
                        zIndex: 1000,
                        border: "none",
                        boxShadow: (theme.palette.mode === 'dark') ? "0px 3px 5px -1px #ffffff20, 0px 5px 8px 0px #ffffff14, 0px 1px 14px 0px #ffffff12" :
                            "0px 3px 5px -1px #00000020, 0px 5px 8px 0px #00000014, 0px 1px 14px 0px #00000012",
                    }}
                >
                    <Toolbar
                        sx={holidayStyle}
                    >
                        <Button href={"/home"} style={{color: theme.palette.text.primary, zIndex: "600000"}}>
                            <Box>
                                <Typography variant="h6" component="span" style={{color: gigoColor}}>
                                    GIGO
                                </Typography>
                                <Typography variant="caption" component="span" style={{
                                    fontSize: '8px',
                                    marginLeft: '5px',
                                    textTransform: 'lowercase',
                                    color: gigoColor
                                }}>
                                    [beta]
                                </Typography>
                            </Box>
                        </Button>
                        <TopSearchBar width={"35vw"} height={"auto"}/>
                        {loggedIn ? (
                            <>
                                <Button
                                    size={"small"}
                                    aria-label="account of current user"
                                    onClick={handleMenu}
                                    variant="text"
                                    style={{position: "absolute", right: 0}}
                                >
                                    {userIconMemoLarge}
                                </Button>
                                <Menu
                                    id="menu-appbar"
                                    anchorOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    <MenuItem onClick={handleProfile}>Profile</MenuItem>
                                    <MenuItem onClick={() => {
                                        restartTutorialClick()
                                        handleClose()
                                    }}>Restart Tutorial</MenuItem>
                                    {!isMobile ? (
                                        <MenuItem onClick={handleSettings}>Account Settings</MenuItem>
                                    ) : null}
                                    <MenuItem onClick={async () => {
                                        await handleLogout()
                                    }}>Logout</MenuItem>
                                    <MenuItem onClick={() => setShowReferPopup(true)}>Refer A Friend</MenuItem>
                                </Menu>
                                <Modal open={showReferPopup} onClose={() => setShowReferPopup(false)}>
                                    <Box
                                        sx={{
                                            width: "90vw",
                                            minHeight: "30vh",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "flex-start",
                                            position: "absolute",
                                            top: "30vh",
                                            left: "5vw",
                                            outline: "none",
                                            borderRadius: "8px",
                                            boxShadow: "0px 12px 6px -6px rgba(0,0,0,0.6), 0px 6px 6px 0px rgba(0,0,0,0.6), 0px 6px 18px 0px rgba(0,0,0,0.6)",
                                            backgroundColor: theme.palette.background.default,
                                            padding: "20px",
                                            paddingTop: "10px",
                                        }}
                                    >
                                        <Button onClick={() => setShowReferPopup(false)} sx={{
                                            position: "absolute",
                                            top: 8,
                                            right: 8,
                                            minWidth: "auto",
                                        }}>
                                            <CloseIcon/>
                                        </Button>
                                        <div style={{width: "100%", paddingTop: "30px"}}>
                                            <h3 style={{margin: "0 0 10px"}}>Refer a Friend.</h3>
                                            <h4 style={{margin: "0 0 20px"}}>Give a Month, Get a Month.</h4>
                                            <div style={{
                                                width: "100%",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                gap: "10px"
                                            }}>
                                                <h5 style={{
                                                    outline: "solid gray",
                                                    borderRadius: "5px",
                                                    padding: "8px",
                                                    maxWidth: "75%",
                                                    textAlign: "center",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                }}>
                                                    {referralLink}
                                                </h5>
                                                <Button onClick={copyToClipboard} sx={{minWidth: "auto"}}>
                                                    <ContentCopyIcon/>
                                                </Button>
                                            </div>
                                        </div>
                                    </Box>
                                </Modal>
                            </>
                        ) : (
                            <>
                                <IconButton
                                    aria-label="login-signup"
                                    onClick={handleMenu}
                                    sx={{position: "absolute", right: "15px", width: "48px", height: "48px"}}
                                >
                                    <LoginIcon/>
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}>
                                    <MenuItem onClick={handleCreateAccount}>Create Account</MenuItem>
                                    <MenuItem onClick={handleLogin}>Login</MenuItem>
                                </Menu>
                            </>
                        )}
                    </Toolbar>
                </AppBar>
                {!loggedIn ? (
                    <Snackbar
                        open={!mobileWelcomeBannerClosed && pathname !== "" && pathname !== "/" && pathname !== "/home"}
                        key={"mobile-welcom-notification"}
                        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                    >
                        <Box
                            sx={{
                                // @ts-ignore
                                backgroundColor: theme.palette.background.codeEditor,
                                color: theme.palette.text.primary,
                                textAlign: 'center',
                                cursor: 'pointer',
                                pointerEvents: 'auto',
                                padding: '10px',
                                borderRadius: '10px',
                                // add a glowing box shadow all around the box
                                boxShadow: (theme.palette.mode === 'dark') ?
                                    `0px 3px 15px -1px #ffffff40, 0px 5px 18px 0px #ffffff24, 0px 1px 24px 0px #ffffff22` :
                                    "0px 3px 5px -1px #00000020, 0px 5px 8px 0px #00000014, 0px 1px 14px 0px #00000012",
                                ...themeHelpers.frostedGlass,
                            }}
                        >
                            <IconButton
                                sx={{
                                    position: 'absolute',
                                    top: '5px',
                                    right: '5px',
                                }}
                                size="small"
                                onClick={handleCloseMobileWelcomeBanner}
                            >
                                <CloseIcon/>
                            </IconButton>
                            <Typography
                                variant="h6"
                                // color={theme.palette.text.primary}
                                color={'inherit'}
                            >
                                Welcome To GIGO!
                            </Typography>
                            <Typography
                                variant="body2"
                                // color={theme.palette.text.primary}
                                color={'inherit'}
                            >
                                GIGO is best on a computer or tablet. Programming on your phone is hard but we do our
                                best to support it!
                            </Typography>
                            <Typography
                                variant="caption"
                                // color={theme.palette.text.primary}
                                color={'inherit'}
                            >
                                <Link href="/about" color="inherit">
                                    Click here to learn more about GIGO!
                                </Link>
                            </Typography>
                        </Box>
                    </Snackbar>
                    // <Box
                    //     sx={{
                    //         // @ts-ignore
                    //         backgroundColor: theme.palette.background.codeEditor,
                    //         color: theme.palette.text.primary,
                    //         textAlign: 'center',
                    //         cursor: 'pointer',
                    //         pointerEvents: 'auto',
                    //         paddingBottom: '10px',
                    //         // add a glowing box shadow all around the box
                    //         boxShadow: (mode === 'dark') ?
                    //             `0px 3px 15px -1px #ffffff40, 0px 5px 18px 0px #ffffff24, 0px 1px 24px 0px #ffffff22` :
                    //             "0px 3px 5px -1px #00000020, 0px 5px 8px 0px #00000014, 0px 1px 14px 0px #00000012",
                    //         // lighten the background on hover
                    //         "&:hover": {
                    //             // @ts-ignore
                    //             backgroundColor: theme.palette.primary.contrastText,
                    //             color: theme.palette.primary.main,
                    //         },
                    //     }}
                    //     onClick={() => {
                    //         router.push("/about")
                    //     }}
                    // >
                    // <Typography 
                    //     variant="h5"
                    //     // color={theme.palette.text.primary}
                    //     color={'inherit'}
                    // >
                    //     Welcome To GIGO!
                    // </Typography>
                    //     <Typography 
                    //         variant="h6"
                    //         // color={theme.palette.text.primary}
                    //         color={'inherit'}
                    //     >
                    //         GIGO is an end-to-end platform for learning to code and developing your skills. Click here to learn more!
                    //     </Typography>
                    // </Box>
                ) : null}
                {/*Bottom Navigation Bar*/}
                {loggedIn ? (
                    <SpeedDial
                        ariaLabel="SpeedDial"
                        sx={{position: 'fixed', bottom: 16, right: 16}}
                        icon={<MenuIcon/>}
                        open={speedDialOpen}
                        onOpen={() => setSpeedDialOpen(true)}
                        onClose={() => setSpeedDialOpen(false)}
                    >
                        {actions.map((action) => (
                            <SpeedDialAction
                                key={action.name}
                                icon={action.icon}
                                tooltipTitle={action.name}
                                onClick={() => handleAction(action.action)}
                            />
                        ))}
                    </SpeedDial>
                ) : (
                    <SpeedDial
                        ariaLabel="SpeedDial Logged Out"
                        sx={{position: 'fixed', bottom: 16, right: 16}}
                        icon={<MenuIcon/>}
                        open={speedDialOpen}
                        onOpen={() => setSpeedDialOpen(true)}
                        onClose={() => setSpeedDialOpen(false)}
                    >
                        {actionsLoggedOut.map((action) => (
                            <SpeedDialAction
                                key={action.name}
                                icon={action.icon}
                                tooltipTitle={action.name}
                                onClick={() => handleAction(action.action)}
                            />
                        ))}
                    </SpeedDial>
                )}
            </>
        )
    }

    const renderSocials = () => {
        return (
            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <div style={{display: "flex", flexDirection: "row"}}>
                    <SocialIcon
                        network="github"
                        url="https://github.com/Gage-Technologies/gigo.dev"
                        bgColor={"transparent"}
                        fgColor={theme.palette.mode === 'dark' ? "white" : "black"}
                        style={{
                            height: "32px",
                            width: "32px",
                        }}
                    />
                    <SocialIcon
                        network="discord"
                        url="https://discord.gg/279hECYrfX"
                        bgColor={"transparent"}
                        fgColor={theme.palette.mode === 'dark' ? "white" : "black"}
                        style={{
                            height: "32px",
                            width: "32px",
                        }}
                    />
                    <SocialIcon
                        network="x"
                        url="https://twitter.com/gigo_dev"
                        bgColor={"transparent"}
                        fgColor={theme.palette.mode === 'dark' ? "white" : "black"}
                        style={{
                            height: "32px",
                            width: "32px",
                        }}
                    />
                    <SocialIcon
                        network="medium"
                        url="https://medium.com/@gigo_dev"
                        bgColor={"transparent"}
                        fgColor={theme.palette.mode === 'dark' ? "white" : "black"}
                        style={{
                            height: "32px",
                            width: "32px",
                        }}
                    />
                    <SocialIcon
                        network="reddit"
                        url="https://www.reddit.com/r/gigodev"
                        bgColor={"transparent"}
                        fgColor={theme.palette.mode === 'dark' ? "white" : "black"}
                        style={{
                            height: "32px",
                            width: "32px",
                        }}
                    />
                </div>
                <Button size={"small"} href={"/privacyPolicy"}>
                    Privacy Policy
                </Button>
            </div>
        )
    }


    const renderSidebar = () => {
        // @ts-ignore
        return (
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    zIndex: 998,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        border: "none",
                        opacity: 1,
                        color: theme.palette.text.primary,
                        backgroundColor: (isChrome) ? theme.palette.background.default : theme.palette.background.default,
                        backdropFilter: (isChrome) ? "blur(15px)" : undefined,
                        zIndex: 998,
                    },
                }}
                variant="persistent"
                anchor="left"
                open={leftOpen || homePageLockedDrawer}
            >
                <Box
                    display={"flex"}
                    flexDirection={"column"}
                    sx={{
                        flexGrow: 1
                    }}
                >
                    <DrawerHeader/>
                    <List
                        sx={{
                            flexGrow: 1
                        }}
                    >
                        <ListItem disablePadding>
                            <ListItemButton color={"primary"} sx={{
                                borderRadius: 2,
                            }} href={"/home"}>
                                <ListItemIcon>
                                    <HomeIcon style={{color: theme.palette.text.primary,}}/>
                                </ListItemIcon>
                                <Typography
                                    component={"div"}
                                    variant={"body1"}
                                    sx={{fontSize: "0.8em"}}
                                >
                                    Home
                                </Typography>
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton color={"primary"} sx={{
                                borderRadius: 2,
                            }} href={"/journey/main"}>
                                <ListItemIcon>
                                    <ExploreIcon style={{color: theme.palette.text.primary,}}/>
                                </ListItemIcon>
                                <Typography
                                    component={"div"}
                                    variant={"body1"}
                                    sx={{fontSize: "0.8em"}}
                                >
                                    Journey
                                </Typography>
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton color={"primary"} sx={{
                                borderRadius: 2,
                            }} href={"/active"}>
                                <ListItemIcon>
                                    <FolderIcon style={{color: theme.palette.text.primary,}}/>
                                </ListItemIcon>
                                <Typography
                                    component={"div"}
                                    variant={"body1"}
                                    sx={{fontSize: "0.8em"}}
                                >
                                    Active
                                </Typography>
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton color={"primary"} sx={{
                                borderRadius: 2,
                            }} href={"/following"}>
                                <ListItemIcon>
                                    <BookmarkIcon style={{color: theme.palette.text.primary,}}/>
                                </ListItemIcon>
                                <Typography
                                    component={"div"}
                                    variant={"body1"}
                                    sx={{fontSize: "0.8em"}}
                                >
                                    Following
                                </Typography>
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton color={"primary"} sx={{
                                borderRadius: 2,
                            }} href={"/profile"}>
                                <ListItemIcon>
                                    <AccountBoxIcon style={{color: theme.palette.text.primary,}}/>
                                </ListItemIcon>
                                <Typography
                                    component={"div"}
                                    variant={"body1"}
                                    sx={{fontSize: "0.8em"}}
                                >
                                    Profile
                                </Typography>
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton color={"primary"} sx={{
                                borderRadius: 2,
                            }} href={"/streak"}>
                                <ListItemIcon>
                                    <LocalFireDepartment style={{color: theme.palette.text.primary,}}/>
                                </ListItemIcon>
                                <Typography
                                    component={"div"}
                                    variant={"body1"}
                                    sx={{fontSize: "0.8em"}}
                                >
                                    Stats
                                </Typography>
                            </ListItemButton>
                        </ListItem>
                        {/*<ListItem disablePadding>*/}
                        {/*    <ListItemButton color={"primary"} sx={{*/}
                        {/*        borderRadius: 2,*/}
                        {/*    }} href={"/nemesis"}>*/}
                        {/*        <ListItemIcon>*/}
                        {/*            <IconifyIcon icon="mdi:sword-cross" color={theme.palette.text.primary} width="25"*/}
                        {/*                         height="25"/>*/}
                        {/*        </ListItemIcon>*/}
                        {/*        <Typography*/}
                        {/*            component={"div"}*/}
                        {/*            variant={"body1"}*/}
                        {/*            sx={{fontSize: "0.8em"}}*/}
                        {/*        >*/}
                        {/*            Nemesis*/}
                        {/*        </Typography>*/}
                        {/*    </ListItemButton>*/}
                        {/*</ListItem>*/}
                        <ListItem disablePadding>
                            <ListItemButton color={"primary"} sx={{
                                borderRadius: 2,
                            }} href={"/documentation"}>
                                <ListItemIcon>
                                    <FeedIcon style={{color: theme.palette.text.primary,}}/>
                                </ListItemIcon>
                                <Typography
                                    component={"div"}
                                    variant={"body1"}
                                    sx={{fontSize: "0.8em"}}
                                >
                                    Docs
                                </Typography>
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton color={"primary"} sx={{
                                borderRadius: 2,
                            }} href={"/about"}>
                                <ListItemIcon>
                                    <IconifyIcon icon="mdi:about" color={theme.palette.text.primary} width="25"
                                                 height="25"/>
                                </ListItemIcon>
                                <Typography
                                    component={"div"}
                                    variant={"body1"}
                                    sx={{fontSize: "0.8em"}}
                                >
                                    About
                                </Typography>
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton color={"primary"} sx={{
                                borderRadius: 2,
                            }} href={"/configs"}>
                                <ListItemIcon>
                                    <CalculateIcon style={{color: theme.palette.text.primary}}/>
                                </ListItemIcon>
                                <Typography
                                    component={"div"}
                                    variant={"body1"}
                                    sx={{fontSize: "0.8em"}}
                                >
                                    Configs
                                </Typography>
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton color={"primary"} sx={{
                                borderRadius: 2,
                            }} href={"/create-challenge"}>
                                <ListItemIcon>
                                    <AddIcon style={{color: theme.palette.text.primary}}/>
                                </ListItemIcon>
                                <Typography
                                    component={"div"}
                                    variant={"body1"}
                                    sx={{fontSize: "0.8em"}}
                                >
                                    Create
                                </Typography>
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton color={"primary"} sx={{
                                borderRadius: 2,
                            }} href={"/articles"}>
                                <ListItemIcon>
                                    <AutoStoriesIcon style={{color: theme.palette.text.primary}}/>
                                </ListItemIcon>
                                <Typography
                                    component={"div"}
                                    variant={"body1"}
                                    sx={{fontSize: "0.8em"}}
                                >
                                    Articles
                                </Typography>
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton color={"primary"} sx={{
                                borderRadius: 2,
                            }} href={"/homework"}>
                                <ListItemIcon>
                                    <Quiz style={{color: theme.palette.text.primary}}/>
                                </ListItemIcon>
                                <Typography
                                    component={"div"}
                                    variant={"body1"}
                                    sx={{fontSize: "0.8em"}}
                                >
                                    Homework
                                </Typography>
                            </ListItemButton>
                        </ListItem>
                    </List>
                    <DrawerFooter>
                        <div style={{display: "flex", flexDirection: "column"}}>
                            {authState.role.toString() === "0" ? (
                                <div style={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    marginBottom: "4vh",
                                    marginTop: "4vh"
                                }}>
                                    <AwesomeButton style={{
                                        width: "100%",
                                        '--button-primary-color': theme.palette.primary.main,
                                        '--button-primary-color-dark': theme.palette.primary.dark,
                                        '--button-primary-color-light': theme.palette.text.primary,
                                        '--button-primary-color-hover': theme.palette.primary.main,
                                        fontSize: "14px"
                                    }} type="primary" href={"/premium"}>
                                        <Image src={premiumImage} alt=""/>
                                    </AwesomeButton>
                                </div>
                            ) : null}
                            {renderTutorialButton()}
                            <Button onClick={() => setReportPopup(true)}>
                                Report Issue
                            </Button>
                            <Modal open={reportPopup} onClose={() => setReportPopup(false)}>
                                {reportIssueMemo}
                            </Modal>
                            {renderSocials()}
                        </div>
                    </DrawerFooter>
                </Box>
            </Drawer>
        )
    }

    const renderLoggedOutSidebar = () => {
        return (
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    zIndex: 998,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        border: "none",
                        opacity: 1,
                        color: theme.palette.text.primary,
                        backgroundColor: (isChrome) ? theme.palette.background.default : theme.palette.background.default,
                        backdropFilter: (isChrome) ? "blur(15px)" : undefined,
                        zIndex: 998,
                    },
                }}
                variant="persistent"
                anchor="left"
                open={leftOpen || homePageLockedDrawer}
            >
                <DrawerHeader/>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton color={"primary"} sx={{
                            borderRadius: 2,
                        }} href={"/home"}>
                            <ListItemIcon>
                                <HomeIcon style={{color: theme.palette.text.primary,}}/>
                            </ListItemIcon>
                            <Typography
                                component={"div"}
                                variant={"body1"}
                                sx={{fontSize: "0.8em"}}
                            >
                                Home
                            </Typography>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton color={"primary"} sx={{
                            borderRadius: 2,
                        }} href={"/journey/detours"}>
                            <ListItemIcon>
                                <ExploreIcon style={{color: theme.palette.text.primary,}}/>
                            </ListItemIcon>
                            <Typography
                                component={"div"}
                                variant={"body1"}
                                sx={{fontSize: "0.8em"}}
                            >
                                Journey
                            </Typography>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton color={"primary"} sx={{
                            borderRadius: 2,
                        }} href={"/about"}>
                            <ListItemIcon>
                                <IconifyIcon icon="mdi:about" color={theme.palette.text.primary} width="25"
                                             height="25"/>
                            </ListItemIcon>
                            <Typography
                                component={"div"}
                                variant={"body1"}
                                sx={{fontSize: "0.8em"}}
                            >
                                About
                            </Typography>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton color={"primary"} sx={{
                            borderRadius: 2,
                        }} href={"/documentation"}>
                            <ListItemIcon>
                                <FeedIcon style={{color: theme.palette.text.primary,}}/>
                            </ListItemIcon>
                            <Typography
                                component={"div"}
                                variant={"body1"}
                                sx={{fontSize: "0.8em"}}
                            >
                                Docs
                            </Typography>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton color={"primary"} sx={{
                            borderRadius: 2,
                        }} href={"/articles"}>
                            <ListItemIcon>
                                <AutoStoriesIcon style={{color: theme.palette.text.primary}}/>
                            </ListItemIcon>
                            <Typography
                                component={"div"}
                                variant={"body1"}
                                sx={{fontSize: "0.8em"}}
                            >
                                Articles
                            </Typography>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton color={"primary"} sx={{
                            borderRadius: 2,
                        }} href={"/homework"}>
                            <ListItemIcon>
                                <Quiz style={{color: theme.palette.text.primary}}/>
                            </ListItemIcon>
                            <Typography
                                component={"div"}
                                variant={"body1"}
                                sx={{fontSize: "0.8em"}}
                            >
                                Homework
                            </Typography>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton color={"primary"} sx={{
                            borderRadius: 2,
                        }} href={"/premium"}>
                            <ListItemIcon>
                                <Pro/>
                            </ListItemIcon>
                            <Typography
                                component={"div"}
                                variant={"body1"}
                                sx={{fontSize: "0.8em"}}
                            >
                                Pro
                            </Typography>
                        </ListItemButton>
                    </ListItem>
                </List>
                <DrawerFooter>
                    {renderSocials()}
                </DrawerFooter>
            </Drawer>
        )
    }

    const renderChatSideBar = () => {

        return (
            <>
                {!isMobile && authState.authenticated && (
                    <IconButton
                        onClick={() => handleChatButton()}
                        sx={{
                            position: 'fixed',
                            right: (rightOpen) ? 290 : 10,
                            top: '50vh',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            fontSize: '2rem',
                            transform: 'translateY(-50%)',
                        }}
                    >
                        <Tooltip
                            title={"Global Chat"}
                        >
                            {
                                (rightOpen) ?
                                    (
                                        <KeyboardDoubleArrowRightIcon
                                            style={{color: theme.palette.primary.main}}
                                            fontSize={"large"}
                                        />
                                    )
                                    :
                                    (
                                        <KeyboardDoubleArrowLeftIcon
                                            style={{color: theme.palette.primary.main}}
                                            fontSize={"large"}
                                        />
                                    )
                            }
                        </Tooltip>
                    </IconButton>
                )}
                <Drawer
                    sx={{
                        width: drawerWidth * 1.5,
                        flexShrink: 0,
                        zIndex: 998,
                        '& .MuiDrawer-paper': {
                            width: !isMobile ? drawerWidth * 1.5 : '100vw',
                            border: "none",
                            opacity: 1,
                            color: theme.palette.text.primary,
                            backgroundColor: (isChrome) ? theme.palette.background.default : theme.palette.background.default,
                            backdropFilter: (isChrome) ? "blur(15px)" : undefined,
                            zIndex: 998,
                        },
                    }}
                    variant="persistent"
                    anchor="right"
                    open={rightOpen}
                >
                    <DrawerHeader/>
                    <ChatContainer/>
                </Drawer>
            </>
        )
    }

    let appBarRenderer = renderAppBar

    if (pathname.startsWith("/launchpad/") && query.get("editor") === "true") {
        appBarRenderer = renderWorkspaceAppBar
    } else if (isMobile) {
        appBarRenderer = mobileAppBar
    }

    if (
        (query.has("embed") && query.get("embed") === "true") ||
        (
            pathname.startsWith('/login') ||
            pathname.startsWith('/forgotPassword') ||
            pathname.startsWith('/signup') ||
            pathname.startsWith('/resetPassword') ||
            pathname.startsWith('/referral')
        )
    ) {
        return (
            <div>
                {props.children}
            </div>
        )
    }

    const renderChristmasSnow = () => {
        if (pathname.includes("/launchpad")) {
            return null
        }

        if (holiday === Holiday.Christmas && (!onHomePage || loggedIn)) {
            return (<Snowfall/>)
        }
        return null
    }

    const renderNewYearConfetti = () => {
        if (pathname.includes("/launchpad")) {
            return null
        }

        if (holiday === Holiday.NewYears && (!onHomePage || loggedIn)) {
            return (<Confetti gravity={0.01} numberOfPieces={100} wind={0.001}
                              colors={['#ad7832', '#dcb468', '#716c6c', '#8e8888']} friction={1}/>)
        }
        return null
    }

    const renderDevelopmentMarker = () => {
        return (
            <Card
                sx={{
                    position: 'fixed',
                    bottom: '20px',
                    left: leftOpen ? '220px' : '20px',
                    zIndex: 200,
                    p: 2,
                    color: theme.palette.error.main,
                    backgroundColor: theme.palette.error.main,
                    borderRadius: "10px",
                    fontSize: "0.8em",
                    border: `1px solid ${theme.palette.error.dark}`,
                    marginRight: '20px'
                }}
            >
                <IconButton
                    onClick={() => setRenderDevelopment(false)}
                    sx={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        color: theme.palette.text.primary,
                        '&:hover': {
                            backgroundColor: theme.palette.text.primary + "25",
                        }
                    }}
                >
                    <CloseIcon/>
                </IconButton>
                <Typography variant="h6" color="text.primary">
                    Development Site
                </Typography>
                <Typography variant="body2" color="text.primary">
                    This is a development version of GIGO. It is not recommended for production use.
                </Typography>
                <Typography variant="body2" color="text.primary">
                    Check out the production version of GIGO at
                    <Link
                        href="https://www.gigo.dev"
                        color="secondary"
                        sx={{
                            fontWeight: "bold",
                            marginLeft: "5px",
                        }}
                    >
                        gigo.dev
                    </Link>.
                </Typography>
            </Card>
        )
    }

    return (
        <>
            {!isByteMobilePage ? appBarRenderer() : null}
            {loggedIn ? renderSidebar() : renderLoggedOutSidebar()}
            {renderChatSideBar()}
            {
                // we only render the children on mobile if the chat bar is not open
                !(isMobile && rightOpen) ?
                    memoizedChildren : null
            }
            {/*{renderDevelopment && renderDevelopmentMarker()}*/}
        </>
    );
}