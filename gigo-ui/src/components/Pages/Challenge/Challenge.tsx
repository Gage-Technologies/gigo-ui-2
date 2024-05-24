'use client'
import * as React from "react";
import { SyntheticEvent, useEffect } from "react";
import {
    Badge,
    Box,
    Button,
    ButtonBase,
    Chip,
    Card,
    CssBaseline,
    Grid,
    IconButton,
    Tab,
    Tabs,
    TextField,
    ThemeProvider,
    Tooltip,
    Typography,
    Modal,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Paper,
    InputBase,
    Autocomplete, Backdrop,
} from "@mui/material";
import { theme, themeHelpers } from "@/theme";
import SearchBar from "@/components/SearchBar";
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';
import { useAppSelector, useAppDispatch } from "@/reducers/hooks";
import {
    initialAuthStateUpdate, selectAuthState,
    selectAuthStateId, selectAuthStateTutorialState,
    selectAuthStateUserName,
    updateAuthState
} from "@/reducers/auth/auth";
import { useNavigate } from "react-router-dom";
import AttemptsCard from "@/components/Project/AttemptsCard";
import { Chart } from "react-google-charts";
import DiscussionCard from "@/components/Project/DiscussionCard";
import call from "@/services/api-call";
import config from "@/config";
import swal from "sweetalert";
import Post from "@/models/post"
import MarkdownRenderer from "@/components/Markdown/MarkdownRenderer";
import PostOverview from "@/components/Project/PostOverview";
import PostOverviewMobile from "@/components/Project/PostOverviewMobile"
import { Workspace } from "@/models/workspace";
import * as animationData from "@/img/85023-no-data.json";
import CodeDisplayEditor from "@/components/editor/workspace_config/code_display_editor";
import { LoadingButton } from "@mui/lab";
import { ThreeDots } from "react-loading-icons";
import Attempt from "@/models/attempt";

import WorkspaceConfigEditor from "@/components/editor/workspace_config/editor";
import { v4 } from "uuid";
import * as yaml from 'js-yaml';

import HorseIcon from "@/icons/ProjectCard/Horse"
import HoodieIcon from "@/icons/ProjectCard/Hoodie";
import { QuestionMark } from "@mui/icons-material";
import TrophyIcon from "@/icons/ProjectCard/Trophy";
import GraduationIcon from "@/icons/ProjectCard/Graduation";
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
import CardTutorial from "@/components/CardTutorial";
import UserIcon from "@/icons/User/UserIcon";
import { useSelector } from "react-redux";
import { selectCacheState } from "@/reducers/pageCache/pageCache";
import styled, { keyframes } from 'styled-components';
import PersonIcon from "@mui/icons-material/Person";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CaptchaPage from "@/components/Project/CaptchaPage";
import EditIcon from "@mui/icons-material/Edit";
import ProjectSelector from "@/components/Project/EditProjectSelector";
import ProjectRenown from "@/components/Project/EditProjectRenown";
import darkImageUploadIcon from "@/img/dark_image_upload2.svg";
import Tag from "@/models/tag";
import Fab from '@mui/material/Fab';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CircularProgress from '@mui/material/CircularProgress';
import DebugIcon from "@/icons/ProjectCard/Debug";
import Image, { StaticImageData } from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import fetchWithUpload from "@/services/chunkUpload";
import GoProDisplay from "@/components/GoProDisplay";

interface ChallengeProps {
    params: { id: string };
    project: Post;
    userAttempt: Attempt | null;
    projectDesc: string;
    projectEval: string;
}

function Challenge({ params, ...props }: ChallengeProps) {
    const combinedArrayTags: Tag[] = props.project.tag_strings.map((item: any, index: number) => ({
        value: item,
        _id: props.project.tags[index],
        official: false,
        usage_count: 0,
    }));

    const [editTitle, setEditTitle] = React.useState(false);
    const [editImage, setEditImage] = React.useState(false);

    const queryParams = useSearchParams()
    let isMobile = queryParams.get("viewport") === "mobile";

    const TutorialLaunchButton = styled(LoadingButton)`
        animation: auraEffect1 2s infinite alternate;

        @keyframes auraEffect1 {
            0% {
                box-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px ${theme.palette.secondary.main}, 0 0 20px ${theme.palette.secondary.main}, 0 0 25px ${theme.palette.secondary.main}, 0 0 30px ${theme.palette.secondary.main} 0 0 35px ${theme.palette.secondary.main};
            }
            100% {
                box-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 25px ${theme.palette.secondary.main}, 0 0 30px ${theme.palette.secondary.main}, 0 0 35px ${theme.palette.secondary.main}, 0 0 40px ${theme.palette.secondary.main}, 0 0 50px ${theme.palette.secondary.main};
            }
        }
    `;

    const TutorialDiscussionButton = styled(Button)`
        animation: auraEffect2 2s infinite alternate;

        @keyframes auraEffect2 {
            0% {
                box-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px ${theme.palette.primary.main}, 0 0 20px ${theme.palette.primary.main}, 0 0 25px ${theme.palette.primary.main}, 0 0 30px ${theme.palette.primary.main} 0 0 35px ${theme.palette.primary.main};
            }
            100% {
                box-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 25px ${theme.palette.primary.main}, 0 0 30px ${theme.palette.primary.main}, 0 0 35px ${theme.palette.primary.main}, 0 0 40px ${theme.palette.primary.main}, 0 0 50px ${theme.palette.primary.main};
            }
        }
    `;

    const styles = {
        themeButton: {
            justifyContent: "right"
        },
        mainTabButton: {
            height: "4vh",
            maxHeight: "50px",
            minHeight: "35px",
            fontSize: "0.8rem",
            '&:hover': {
                backgroundColor: theme.palette.primary.main + "25",
            }
        },
        tutorialHeader: {
            fontSize: "1rem",
        },
        tutorialText: {
            fontSize: "0.7rem",
        },
        textField: {
            color: `text.secondary`,
        }
    };

    // retrieve url params
    let id = params.id

    const dispatch = useAppDispatch();
    const cache = useSelector(selectCacheState);

    const embedded = queryParams.has('embed') && queryParams.get('embed') === 'true';

    const [mainTab, setMainTab] = React.useState(window.location.hash.replace('#', '') !== "" ? window.location.hash.replace('#', '') : "project")

    const [minorTab, setMinorTab] = React.useState("overview")

    const [thread, setThread] = React.useState(false)
    const [purchasePopup, setPurchasePopup] = React.useState(false)

    const [threadComment, setThreadComment] = React.useState("")

    const [loading, setLoading] = React.useState(true)

    const [attempt, setAttempt] = React.useState([])

    const [closedAttempts, setClosedAttempts] = React.useState([])

    const [projectAttempts, setProjectAttempts] = React.useState([])

    const [project, setProject] = React.useState<Post | null>(props.project)
    const [projectDesc, setProjectDesc] = React.useState<string>(props.projectDesc)
    const [projectEval, setProjectEval] = React.useState<string>(props.projectEval)
    const [projectImage, setProjectImage] = React.useState<string | null>(props.project.thumbnail)
    const [userAttempt, setUserAttempt] = React.useState<Attempt | null>(props.userAttempt)
    const [publishing, setPublishing] = React.useState(false)
    const [launchingWorkspace, setLaunchingWorkspace] = React.useState(false)
    const [imageGenLoad, setImageGenLoad] = React.useState<boolean>(false)

    const [threadArray, setThreadArray] = React.useState<any[]>([])


    const [wsConfig, setWsConfig] = React.useState("")

    const [loadingEdit, setLoadingEdit] = React.useState(false)
    const [deleteProject, setDeleteProject] = React.useState(false)
    const [editPopup, setEditPopup] = React.useState(false)

    const implicitSessionID = React.useRef<string | null>("")

    const [stepIndex, setStepIndex] = React.useState(0)

    const username = useAppSelector(selectAuthStateUserName)
    const callingId = useAppSelector(selectAuthStateId)

    const [editConfirm, setEditConfirm] = React.useState(false)

    const [sharePopupOpen, setSharePopupOpen] = React.useState(false)
    const [shareProject, setShareProject] = React.useState("")
    const [isEphemeral, setIsEphemeral] = React.useState(false)
    const [loadingEphemeral, setLoadingEphemeral] = React.useState(false)
    const [isCaptchaVerified, setIsCaptchaVerified] = React.useState(false)
    const [shouldRenderCaptcha, setShouldRenderCaptcha] = React.useState(false)
    const [genLimitReached, setGenLimitReached] = React.useState<boolean>(false);
    const [genOpened, setGenOpened] = React.useState<boolean>(false);
    const [promptError, setPromptError] = React.useState<string>("")
    const [prompt, setPrompt] = React.useState("");
    const [genImageId, setGenImageId] = React.useState<string>("");
    const [challengeType, setChallengeType] = React.useState<null | string>(props.project.post_type_string);
    const [projectRenown, setProjectRenown] = React.useState<number>(props.project.tier);
    const [projectTags, setProjectTags] = React.useState<Tag[]>(combinedArrayTags)
    const [removedTagsState, setRemovedTagsState] = React.useState<Tag[]>([]);
    const [addedTagsState, setAddedTagsState] = React.useState<Tag[]>([]);
    const [tagOptions, setTagOptions] = React.useState<Tag[]>([])
    const [usedThumbnail, setUsedThumbnail] = React.useState<File | null>(null);
    const [deleteProjectLoading, setDeleteProjectLoading] = React.useState<boolean>(false);
    const [goProPopup, setGoProPopup] = React.useState(false)
    const [mobileLaunchTooltipOpen, setMobileLaunchTooltipOpen] = React.useState(false)

    const authState = useAppSelector(selectAuthState);

    let loggedIn = false
    if (authState.authenticated !== false) {
        loggedIn = true
    }

    const tutorialState = useAppSelector(selectAuthStateTutorialState)
    // we init this to false because we don't trigger until the content loads
    const [runTutorial, setRunTutorial] = React.useState(false)

    // this enables us to push tutorial restarts from the app wrapper down into this page
    useEffect(() => {
        if (tutorialState.challenge === !runTutorial) {
            return
        }
        setRunTutorial(!tutorialState.challenge && loggedIn)
    }, [tutorialState])

    useEffect(() => {
        if (queryParams.has('share')) {
            checkEphemeral();
        }
    }, []);

    const getSessionID = () => {
        // return empty string if there's no project
        if (project === null) {
            return ""
        }

        // check for an existing session token
        let lastSession = window.sessionStorage.getItem(`project-exit-${project._id}`)

        // generate a new id if there is no session
        if (lastSession === null) {
            return v4()
        }

        // split the session token into its parts
        let parts = lastSession.split(":")

        // parse time from the millis unix timestamp in part[0] and return the
        // old session id if it has been less than 5 minutes
        if (new Date().getTime() - parseInt(parts[0]) < 300000 && parts[1].length > 0) {
            return parts[1]
        }

        return v4()
    }

    useEffect(() => {
        // bail if we don't have a project yet
        if (project === null) {
            return
        }

        // initialize an implicit session ID
        let sid = getSessionID()
        implicitSessionID.current = sid

        // record on click
        recordImplicitAction(true, sid)

        // record click off of tab or minimize
        window.addEventListener('blur', function () {
            // record the exit time in session storage
            window.sessionStorage.setItem(`project-exit-${project._id}`, `${new Date().getTime()}:${sid}`)
            recordImplicitAction(false)
        });

        // record on click back to tab
        window.onfocus = function () {
            let sid = getSessionID()
            if (sid !== implicitSessionID.current) {
                implicitSessionID.current = (sid)
            }
            recordImplicitAction(true, sid)
        }

        // create a listener for beforeunload
        let beforeUnload = function () {
            // record the exit time in session storage
            window.sessionStorage.setItem(`project-exit-${project._id}`, `${new Date().getTime()}:${implicitSessionID.current}`)

            // record changing pages
            recordImplicitAction(false)

            // clear hooks
            window.removeEventListener('blur', function () {
                // record the exit time in session storage
                window.sessionStorage.setItem(`project-exit-${project._id}`, `${new Date().getTime()}:${implicitSessionID.current}`)
                recordImplicitAction(false)
            });
            window.onfocus = null

            return true
        }

        // handle case of page change by clearing our watchers
        window.addEventListener('beforeunload', beforeUnload);

        // remove implicit action on unmount
        return () => {
            window.removeEventListener('beforeunload', beforeUnload)
        }
    }, [project])

    const recordImplicitAction = async (open: boolean, sessionId: string | null = null) => {
        if (loggedIn) {
            // bail if we don't have a project yet
            if (project === null || implicitSessionID.current === null) {
                return
            }

            // use the state session ID if no session ID is provided
            if (sessionId === null) {
                sessionId = implicitSessionID.current
            }

            // determine the appropriate action
            let action: number | null = null;
            if (open) {
                if (callingId === project.author_id) {
                    action = 7
                } else {
                    action = 5
                }
            } else {
                if (callingId === project.author_id) {
                    action = 8
                } else {
                    action = 6
                }
            }

            // Convert payload to a string
            const blob = new Blob([JSON.stringify({
                post_id: id,
                action: action,
                session_id: sessionId,
            })], { type: 'application/json' });

            // Use navigator.sendBeacon to send the data to the server
            navigator.sendBeacon(config.rootPath + '/api/implicit/recordAction', blob);
        }
    }

    const getProjectInformation = async () => {
        let attemptPromise = fetch(
            `${config.rootPath}/api/project/attempts`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ project_id: id, skip: 0, limit: 15 }),
                credentials: 'include'
            }
        ).then((res) => res.json())

        let closedAttemptPromise = fetch(
            `${config.rootPath}/api/project/closedAttempts`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ project_id: id, skip: 0, limit: 15 }),
                credentials: 'include'
            }
        ).then((res) => res.json())

        const [attemptResponse, closedAttemptResponse] = await Promise.all([
            attemptPromise,
            closedAttemptPromise,
        ])

        if (attemptResponse === undefined || closedAttemptResponse === undefined) {
            swal("There has been an issue loading data. Please try again later.")
        }

        setAttempt(attemptResponse["attempts"])
        setClosedAttempts(closedAttemptResponse["attempts"])
    }

    const publishProject = async () => {
        if (project === null || project.published) {
            return
        }

        let res = await fetch(
            `${config.rootPath}/api/project/publish`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ project_id: project._id }),
                credentials: 'include'
            }
        ).then((res) => res.json())

        if (res["message"] === "You must be logged in to access the GIGO system.") {
            let authState = Object.assign({}, initialAuthStateUpdate)
            // @ts-ignore
            dispatch(updateAuthState(authState))
            router.push("/login?forward=" + encodeURIComponent(window.location.pathname))
        }

        if (res === undefined || res["message"] === undefined) {
            if (sessionStorage.getItem("alive") === null)
                //@ts-ignore
                swal(
                    "Server Error",
                    "We are unable to connect with the GIGO servers at this time. We're sorry for the inconvenience!"
                );
            setPublishing(false);
            return;
        }

        if (res["message"] !== "Post published successfully.") {
            if (sessionStorage.getItem("alive") === null)
                //@ts-ignore
                swal(
                    "Server Error",
                    (res["message"] !== "internal server error occurred") ?
                        res["message"] :
                        "An unexpected error has occurred. We're sorry, we'll get right on that!"
                );
            setPublishing(false);
            return;
        }

        let stateUpdate = Object.assign({}, project) as Post
        stateUpdate.published = true
        setProject(stateUpdate)
        setPublishing(false)
        swal("Project Published", "Other users can now see and Attempt this project!")
    }

    const generateImage = async () => {


        // if (projectImage !== null || prompt === "")
        //     return false

        // execute api call to remote GIGO server to create image
        let res = await fetch(
            `${config.rootPath}/api/project/genImage`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt: prompt }),
                credentials: 'include'
            }
        ).then((res) => res.json())

        // handle generation count failure
        if (res !== undefined && res["message"] !== undefined && res["message"] === "User has already reached the generation limit") {
            setGenLimitReached(true)
            swal(
                "Generation Limit Reached",
                "Sorry, but you have reached the image generation limit for this project."
            );
            return false
        }

        // handle failed call
        if (res === undefined || res["image"] === undefined) {
            if (sessionStorage.getItem("alive") === null)
                //@ts-ignore
                swal(
                    "Server Error",
                    "We can't get in touch with the server... Sorry about that! We'll get working on that right away!"
                );
            return false
        }

        // handle expected failure
        if (res["image"] === "" || res["image"] === null) {
            if (sessionStorage.getItem("alive") === null)
                //@ts-ignore
                swal(
                    "Server Error",
                    res["message"]
                );
            return false
        }

        let id = res["image"]

        fetch(config.rootPath + "/api/project/tempGenImage/" + id, {
            credentials: 'include'  // Include cookies
        })
            .then(response => response.blob())
            .then(blob => {
                // create reader to format image into a base64 string
                const reader = new FileReader();
                // configure callback for reader once the file has been read
                reader.onloadend = (e) => {
                    // ensure that the target and result are not null
                    if (e.target === null || e.target.result === null) {
                        return
                    }

                    // exclude ArrayBuffer case for typescript (it won't ever be an ArrayBuffer though)
                    if (typeof e.target.result !== "string") {
                        return
                    }

                    // send data url to image src
                    setProjectImage(e.target.result);
                    setImageGenLoad(false)
                }
                reader.readAsDataURL(blob);
            })
            .catch(error => {
                // fallback on browser loading
                setProjectImage(config.rootPath + "/api/project/tempGenImage/" + id)
                // setImageGenLoad(false)
            });

        setGenImageId(id)

        return true
    }

    const handleGenSubmit = () => {
        let promptLength = prompt.length;
        if (promptLength === 0) {
            setPromptError("You must enter a prompt");
        } else if (promptLength < 3) {
            setPromptError("Your prompt must be at least 3 characters long");
        } else {
            setGenOpened(false);
            setPromptError("");
            setImageGenLoad(true)
            generateImage().then((ok) => {
                if (!ok)
                    setImageGenLoad(false)
            })
        }
    };

    useEffect(() => {
        setLoading(true)

        getProjectInformation()
        setLoading(false)
    }, [id])

    useEffect(() => {
        if (projectDesc !== "")
            setRunTutorial(!tutorialState.challenge && loggedIn)
    }, [projectDesc])

    const [projectName, setProjectName] = React.useState(project !== null ? project["title"] : "")

    const ownerName = project !== null ? project["author"] : ""
    const userId = useAppSelector(selectAuthStateId);
    // let navigate = useNavigate();
    let router = useRouter();

    function insertBeforeAll(substring: string, insert: string, originalString: string) {
        var index = originalString.indexOf(substring);
        while (index !== -1) {
            originalString = originalString.slice(0, index) + insert + originalString.slice(index);
            // Start the next search from the end of the inserted string and the substring
            index = originalString.indexOf(substring, index + insert.length + substring.length);
        }
        return originalString;
    }


    /**
     * Convert millis duration to a well formatted time string with a min precision of minutes (ex: 1h2m)
     */
    const millisToTime = (millisDuration: number) => {
        const seconds = Math.floor((millisDuration / 1000) % 60);
        const minutes = Math.floor((millisDuration / (1000 * 60)) % 60);

        let timeString = "";

        // we cap at 10 minutes since anything longer is likely a system error
        // skewing the time to be higher
        if (minutes >= 10) {
            return `>10m`
        }

        if (minutes > 0) {
            timeString += `${minutes}m `;
        }
        if (seconds > 0) {
            timeString += `${seconds}s `;
        }

        return timeString.trim();
    };

    let imgSrc;

    if (project !== null) {
        switch (project["tier"]) {
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
    }

    const overviewTab = () => {


        if (!isMobile) {
            if (project?.tutorial_preview && project?.post_type === 0) {
                return (
                    <MarkdownRenderer
                        markdown={
                            project?.tutorial_preview +
                            "<br/><br/>\n\n### Start the project to finish the tutorial!"
                        }
                        style={{
                            width: "70vw",
                            maxWidth: "1300px",
                            overflowWrap: "break-word",
                            borderRadius: "10px",
                            padding: "2em 3em"
                        }}
                    />
                )
            } else {
                return (
                    <div></div>
                )
            }
        } else {
            if (project?.tutorial_preview && project?.post_type === 0) {
                return (
                    <MarkdownRenderer
                        markdown={
                            project?.tutorial_preview +
                            "<br/><br/>\n\n### Start the project to finish the tutorial!"
                        }
                        style={{
                            width: "104vw",
                            maxWidth: "1300px",
                            overflowWrap: "break-word",
                            borderRadius: "10px",
                            padding: "2em 3em"
                        }}
                    />
                )
            } else {
                return (
                    <MarkdownRenderer markdown={projectDesc} style={{
                        width: "104vw",
                        maxWidth: "1300px",
                        overflowWrap: "break-word",
                        borderRadius: "10px",
                        padding: "2em 3em"
                    }} />
                )
            }
        }
    }

    const evaluationTab = () => {
        let regex = /(?:!\[[^\]]*\]\((?!http)(.*?)\))|(?:<img\s[^>]*?src\s*=\s*['\"](?!http)(.*?)['\"][^>]*?>)/g;
        let markdown = projectEval
        let match;
        let finalString;
        while ((match = regex.exec(markdown)) !== null) {
            let imagePath = match[1] ? match[1] : match[2];
            finalString = insertBeforeAll(imagePath, config.rootPath + "/static/git/p/" + id?.toString() + "/", projectEval)
            setProjectEval(finalString)
        }
        return (
            <MarkdownRenderer markdown={projectEval} style={{
                width: "70vw",
                maxWidth: "1300px",
                overflowWrap: "break-word",
                borderRadius: "10px",
                padding: "2em 3em"
            }} />
        )
    }

    const attemptTab = () => {
        return (
            <div style={{ overflowY: "auto", width: "50vw" }}>
                <Typography variant={"h5"} style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    paddingBottom: "10px",
                    paddingTop: "10px"
                }}>
                    check out the attempts made on this project!
                </Typography>
                {attempt.length > 0 ? (
                    attempt.map((attempts) => {
                        return (
                            <div key={attempts["_id"]} style={{ paddingBottom: "10px" }}>
                                <ButtonBase onClick={() => router.push("/attempt/" + attempts["_id"])}>
                                    <AttemptsCard attemptUser={attempts["author"]}
                                        userThumb={config.rootPath + "/static/user/pfp/" + attempts["author_id"]}
                                        userId={attempts["author_id"]} attemptTime={attempts["created_at"]}
                                        attemptLines={attempts["attemptLines"]}
                                        attemptPercentage={attempts["attemptPercentage"]}
                                        success={attempts["success"]}
                                        userTier={attempts["tier"]}
                                        backgroundName={attempts["name"]}
                                        backgroundPalette={attempts["color_palette"]}
                                        backgroundRender={attempts["render_in_front"]}
                                        width={"50vw"}
                                        height={"auto"}
                                        description={attempts["description"]}
                                    />
                                </ButtonBase>
                            </div>
                        );
                    })
                ) : (
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%"
                    }}>
                        {/* Let's add a pretty message telling the user there are no attempts and encouraging them to make one */}
                        <Typography variant={"h5"}
                            style={{ textAlign: "center", fontWeight: "bold", paddingBottom: "10px" }}>
                            No Attempts Yet!
                        </Typography>
                        <Typography variant={"h6"}
                            style={{ textAlign: "center", fontWeight: "bold", paddingBottom: "10px" }}>
                            Be the first to attempt this challenge!
                        </Typography>
                    </div>
                )}
            </div>
        )
    }

    const LoadingImageUploadButton = styled(LoadingButton)`
        animation: imageGenAuraEffect 2s infinite alternate;
        border: none;

        @keyframes imageGenAuraEffect {
            0% {
                box-shadow: 0 0 3px #84E8A2, 0 0 6px #84E8A2;
            }
            20% {
                box-shadow: 0 0 3px #29C18C, 0 0 6px #29C18C;
            }
            40% {
                box-shadow: 0 0 3px #1C8762, 0 0 6px #1C8762;
            }
            60% {
                box-shadow: 0 0 3px #2A63AC, 0 0 6px #2A63AC;
            }
            80% {
                box-shadow: 0 0 3px #3D8EF7, 0 0 6px #3D8EF7;
            }
            100% {
                box-shadow: 0 0 3px #63A4F8, 0 0 6px #63A4F8;
            }
        }
    `;

    const analyticsTab = () => {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                overflowY: "auto",
                maxHeight: "70vh",
                width: "50vw",
                overflowX: "hidden"
            }}>
                <Chart
                    width={"500px"}
                    height={"300px"}
                    chartType="PieChart"
                    loader={<div>Loading Chart</div>}
                    data={[
                        ["Task", "Hours per Day"],
                        ["Work", 11],
                        ["Eat", 2],
                        ["Commute", 2],
                        ["Watch TV", 2],
                        ["Sleep", 7]
                    ]}
                    options={{
                        title: "My Daily Activities"
                    }}
                    rootProps={{ "data-testid": "1" }}
                />
            </div>
        )
    }

    const shimmer = keyframes`
        0% {
            background-position: -1200px 0;
        }
        100% {
            background-position: 1200px 0;
        }
    `;

    const StyledDiv = styled.div`
        animation: ${shimmer} 2.2s infinite linear forwards;
        width: 100%;
        height: 220%;
        background: #E5F0FB;
        background: linear-gradient(to right, #c1dceb 4%, #a3cbe1 25%, #c1dceb 36%);
        background-size: 1200px 100%;
    `;

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setMinorTab(newValue);
    };

    const handleGenClose = () => {
        setGenOpened(false);
        // if (prompt !== createProjectForm.name) {
        //     setPrompt("");
        // }
    };

    let renderGenImagePopup = () => {
        return (
            <Dialog open={genOpened} onClose={handleGenClose}>
                <Box style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: theme.spacing(2), // Provide padding to ensure the modal is slightly larger than its contents.
                    outlineColor: "black",
                    borderRadius: 1,
                    boxShadow: "0px 12px 6px -6px rgba(0,0,0,0.6),0px 6px 6px 0px rgba(0,0,0,0.6),0px 6px 18px 0px rgba(0,0,0,0.6)",
                    backgroundColor: theme.palette.background.default,
                }}>
                    <DialogTitle>Enter Prompt</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Your prompt will be used to generate an image using Magic
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Prompt"
                            type="text"
                            fullWidth
                            defaultValue={prompt}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            inputProps={{ maxLength: 120, minLength: 3 }}
                            helperText={prompt.length > 119 ? 'Character limit reached' : promptError}
                            error={prompt.length > 119 || prompt === "" || prompt.length < 3}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleGenClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleGenSubmit}>
                            Submit
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        )
    }

    const handleRemoveImage = () => {
        setProjectImage(null);
        // if (prompt !== createProjectForm.name) {
        //     setPrompt("");
        // }
    };

    const handleGenClickOpen = () => {
        // setPrompt(createProjectForm.name)
        setGenOpened(true);
    };

    const loadFileToThumbnailImage = (file: File) => {
        // exit if file is null
        if (file === null) {
            return
        }

        // clone the file so we don't read the same one we're going to upload
        let clonedFile = new File([file], file.name, { type: file.type });

        // create file reader
        const reader = new FileReader();

        // configure callback for reader once the file has been read
        reader.onloadend = (e) => {
            // ensure that the target and result are not null
            if (e.target === null || e.target.result === null) {
                return
            }

            // exclude ArrayBuffer case for typescript (it won't ever be an ArrayBuffer though)
            if (typeof e.target.result !== "string") {
                return
            }


            // send data url to image src
            setProjectImage(e.target.result);
        }

        try {
            // execute file reader
            reader.readAsDataURL(clonedFile);
        } catch (e) {
            ;
        }
    }

    const minorTabDetermination = () => {
        if (minorTab === "description") {
            return descriptionTab()
        } else if (minorTab === "evaluation") {
            return evaluationTab()
        } else if (minorTab === "attempts") {
            return attemptTab()
        } else if (minorTab === "analytics") {
            return analyticsTab()
        } else if (minorTab === "overview") {
            return overviewTab()
        }
    }

    const getConfig = async () => {
        if (project !== null) {
            try {
                let res = await fetch(
                    `${config.rootPath}/api/project/config`,
                    {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ commit: "main", repo: project["repo_id"] }),
                        credentials: 'include'
                    }
                ).then((res) => res.json())

                setWsConfig(res["ws_config"]);
            } catch (error) {
                console.error("Error fetching config:", error);
            }
        }
    }

    const confirmEditConfig = async () => {
        if (project !== null) {
            try {
                let res = await fetch(
                    `${config.rootPath}/api/project/confirmEditConfig`,
                    {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ project: project["repo_id"] }),
                        credentials: 'include'
                    }
                ).then((res) => res.json())

                if (res["message"] === "failed to destroy workspace") {
                    setLoadingEdit(false)
                    swal("Error", "Sorry, GIGO ran into a internal server error, we will look at that right away", "error")
                } else if (res["message"] === "config edit confirmed successfully") {
                    setLoadingEdit(false)
                    setEditConfirm(false)
                    swal("Config Edited!", "Your changes have been saved.", "success");
                }
            } catch (error) {
                console.error("Error confirming edit config:", error);
            }
        }
    }


    const editConfig = async () => {
        setLoadingEdit(true)
        try {
            const doc = yaml.load(wsConfig);
        } catch (e: any) {
            swal("YAML Format Error", e["message"], "error");
            setLoadingEdit(false)
            return
        }

        let res = await fetch(
            `${config.rootPath}/api/project/editConfig`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ commit: "main", repo: project !== null ? project["repo_id"] : "0", content: wsConfig }),
                credentials: 'include'
            }
        ).then((res) => res.json())

        if (res["message"] === "repo config updated successfully.") {
            //@ts-ignore
            // swal("Config Edited!", "Your changes have been saved.", "success");
            setEditConfirm(true)
            setLoadingEdit(false)
        } else if (res["message"] === "config is not the right format") {
            //@ts-ignore
            swal("Cannot Edit Config", "Sorry, the config is not the right format. Please try again.", "error");
            setLoadingEdit(false)
        } else if (res["message"] === "version must be 0.1") {
            //@ts-ignore
            swal("Cannot Edit Config", "Version must be 0.1.", "error");
            setLoadingEdit(false)
        } else if (res["message"] === "must have a base container") {
            //@ts-ignore
            swal("Cannot Edit Config", "You must include a base container.", "error");
            setLoadingEdit(false)
        } else if (res["message"] === "must have a working directory") {
            //@ts-ignore
            swal("Cannot Edit Config", "You must include a working directory.", "error");
            setLoadingEdit(false)
        } else if (res["message"] === "must provide cpu cores") {
            //@ts-ignore
            swal("Cannot Edit Config", "You must configure up to 6 cpu cores.", "error");
            setLoadingEdit(false)
        } else if (res["message"] === "must provide memory") {
            //@ts-ignore
            swal("Cannot Edit Config", "You must configure up to 8 GB of memory.", "error");
            setLoadingEdit(false)
        } else if (res["message"] === "must provide disk") {
            //@ts-ignore
            swal("Cannot Edit Config", "You must configure up to 100 GB of disk space.", "error");
            setLoadingEdit(false)
        } else if (res["message"] === "cannot use more than 6 CPU cores") {
            //@ts-ignore
            swal("Cannot Edit Config", "Cannot use more than 6 CPU cores.", "error");
            setLoadingEdit(false)
        } else if (res["message"] === "cannot use more than 8 GB of RAM") {
            //@ts-ignore
            swal("Cannot Edit Config", "Cannot use more than 8 GB of RAM.", "error");
            setLoadingEdit(false)
        } else if (res["message"] === "cannot use more than 100 GB of disk space") {
            //@ts-ignore
            swal("Cannot Edit Config", "Cannot use more than 100 GB of disk space.", "error");
            setLoadingEdit(false)
        } else if (res["message"] === "failed to locate repo") {
            //@ts-ignore
            swal("Cannot Edit Config", "Sorry, there was an internal error. Let us look into that for you as soon as possible.", "error");
            setLoadingEdit(false)
        } else if (res["message"] === "failed to retrieve file from repo") {
            //@ts-ignore
            swal("Cannot Edit Config", "Sorry, there was an internal error. Let us look into that for you as soon as possible.", "error");
            setLoadingEdit(false)
        } else if (res["message"] === "failed to update the workspace config in repo") {
            //@ts-ignore
            swal("Cannot Edit Config", "Sorry, there was an internal error. Let us look into that for you as soon as possible.", "error");
            setLoadingEdit(false)
        } else if (res["message"] === "config is the same") {
            //@ts-ignore
            swal("No Changes Made", "", "info");
            setLoadingEdit(false)
        }
    }

    const handleTabChange = (newValue: string) => {
        setMainTab(newValue);
        window.location.hash = "#" + newValue

        if (newValue === "edit") {
            getConfig()
        }
    };

    const launchWorkspace = async (repoId: string, codeSourceId: string, codeSourceType: number) => {
        if (project == null) {
            setLaunchingWorkspace(false)
            if (sessionStorage.getItem("alive") === null)
                //@ts-ignore
                swal(
                    "Unexpected Error",
                    "We can't seem to find the Challenge data... Sorry about that! Try going to the Challenge page " +
                    "and launch a workspace from there."
                );
            return
        }

        // execute api call to remote GIGO server to create workspace
        let res = await fetch(
            `${config.rootPath}/api/workspace/create`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ commit: "main", repo: repoId, code_source_id: codeSourceId, code_source_type: codeSourceType }),
                credentials: 'include'
            }
        ).then((res) => res.json())

        // handle failed call
        if (res === undefined || res["message"] === undefined) {
            setLaunchingWorkspace(false)
            if (sessionStorage.getItem("alive") === null)
                //@ts-ignore
                swal(
                    "Server Error",
                    "We can't get in touch with the server... Sorry about that! We'll get working on that right away!"
                );
            return
        }

        if (res["message"] === "You must be logged in to access the GIGO system.") {
            let authState = Object.assign({}, initialAuthStateUpdate)
            // @ts-ignore
            dispatch(updateAuthState(authState))
            router.push("/login?forward=" + encodeURIComponent(window.location.pathname))
        }

        // handle expected failure
        if (res["message"] !== "Workspace Created Successfully") {
            setLaunchingWorkspace(false)
            if (sessionStorage.getItem("alive") === null)
                //@ts-ignore
                swal(
                    "Server Error",
                    res["message"]
                );
            return
        }

        let workspace: Workspace = res["workspace"]

        // route to workspace page
        router.push(`/launchpad/${workspace._id}`)
    }


    const createAttempt = async () => {
        // execute api call to remote GIGO server to create workspace
        let res = await fetch(
            `${config.rootPath}/api/attempt/start`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ project_id: project !== null ? project["_id"] : 0 }),
                credentials: 'include'
            }
        ).then((res) => res.json())

        if (res["message"] === "You must be logged in to access the GIGO system.") {
            let authState = Object.assign({}, initialAuthStateUpdate)
            // @ts-ignore
            dispatch(updateAuthState(authState))
            router.push("/login?forward=" + encodeURIComponent(window.location.pathname))
        }


        window.sessionStorage.setItem("attemptXP", JSON.stringify(res["xp"]))

        if (res !== undefined && res["message"] !== undefined && res["message"] === "Attempt created successfully.") {
            let attempt: Attempt = res["attempt"]
            setUserAttempt(attempt)
            await launchWorkspace(attempt.repo_id, attempt._id, 1)
        } else if (res["message"] === "You have already started an attempt. Keep working on that one!") {
            swal("You have already started an attempt. Keep working on that one!")
            setLaunchingWorkspace(false)
        } else {
            swal("There was an issue branching this attempt. Please try again later.")
            setLaunchingWorkspace(false)
        }
    }

    const tutorialCallback = async (step: number, reverse: boolean) => {
        setStepIndex(step)
    }

    const closeTutorialCallback = async () => {
        setRunTutorial(false)
        let authState = Object.assign({}, initialAuthStateUpdate)
        // copy the existing state
        let state = Object.assign({}, tutorialState)
        // update the state
        state.challenge = true
        authState.tutorialState = state
        // @ts-ignore
        dispatch(updateAuthState(authState))

        // send api call to backend to mark the challenge tutorial as completed
        await fetch(
            `${config.rootPath}/api/user/markTutorial`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tutorial_key: "challenge" }),
                credentials: 'include'
            }
        ).then((res) => res.json())
    }

    const deleteProjectFunction = async () => {

        if (project === null || project.deleted) {
            return

        }

        let res = await fetch(
            `${config.rootPath}/api/project/delete`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ project_id: project._id }),
                credentials: 'include'
            }
        ).then((res) => res.json())

        if (res === undefined || res["message"] === undefined) {
            if (sessionStorage.getItem("alive") === null)
                //@ts-ignore
                swal(
                    "Server Error",
                    "We are unable to connect with the GIGO servers at this time. We're sorry for the inconvenience!"
                );
            return;
        }

        if (res["message"] !== "Project has been deleted.") {
            if (sessionStorage.getItem("alive") === null)
                //@ts-ignore
                swal(
                    "Server Error",
                    (res["message"] !== "internal server error occurred") ?
                        res["message"] :
                        "An unexpected error has occurred. We're sorry, we'll get right on that!"
                );
            return;
        }

        let stateUpdate = Object.assign({}, project) as Post
        stateUpdate.deleted = true
        setProject(stateUpdate)
        setDeleteProject(false)
        swal("Project Deleted", "This project will no longer be searchable.")
    }

    const getProjectIcon = (projectType: string) => {
        switch (projectType) {
            case "Playground":
                return (
                    <HorseIcon sx={{ width: "24px", height: "24px", color: theme.palette.primary.main}} />
                )
            case "Casual":
                return (
                    <HoodieIcon sx={{ width: "20px", height: "20px", color: theme.palette.primary.main}} />
                )
            case "Competitive":
                return (
                    <TrophyIcon sx={{ width: "18px", height: "18px", color: theme.palette.primary.main}} />
                )
            case "Interactive":
                return (
                    <GraduationIcon sx={{ width: "20px", height: "20px", color: theme.palette.primary.main}}/>
                )
            case "Debug":
                return (
                    <DebugIcon sx={{ width: "20px", height: "20px", color: theme.palette.primary.main}} />
                )
            default:
                return (
                    <QuestionMark sx={{ width: "20px", height: "20px", color: theme.palette.primary.main}} />
                )
        }
    }

    const [isScrolled, setIsScrolled] = React.useState<boolean>(false);

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 80) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const renderDiscussionButton = () => {
        if (runTutorial && stepIndex === 2) {
            return (
                <TutorialDiscussionButton
                    variant="outlined"
                    sx={styles.mainTabButton}
                    disabled={mainTab === "discussions"}
                    onClick={() => handleTabChange("discussions")}
                    className="comment"
                >
                    Discussions
                </TutorialDiscussionButton>
            )
        }

        return (
            <Button
                variant="outlined"
                sx={styles.mainTabButton}
                disabled={mainTab === "discussions"}
                onClick={() => handleTabChange("discussions")}
                className="comment"
            >
                Discussions
            </Button>
        )
    }

    const checkEphemeral = async () => {
        let url = new URL(window.location.href);
        let challenge = url.pathname.split('/')
        let challengeId = challenge[challenge.indexOf('challenge') + 1]

        let res = await fetch(
            `${config.rootPath}/api/project/verifyLink`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ post_id: challengeId, share_link: queryParams.get('share') }),
                credentials: 'include'
            }
        ).then((res) => res.json())

        if (res["message"] === 'valid share link') {
            setIsEphemeral(true)
        } else if (res["message"] === 'invalid share link') {
            window.location.href = "/404"
        } else {
            // todo handle error
        }

    }

    const shareLink = async () => {
        if (project !== null) {
            try {
                let res = await fetch(
                    `${config.rootPath}/api/project/shareLink`,
                    {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ post_id: project["_id"] }),
                        credentials: 'include'
                    }
                ).then((res) => res.json())
                setShareProject(`https://gigo.dev/challenge/${project["_id"]}?share=${res['message']}`)
                setSharePopupOpen(true);

            } catch (error) {
                swal("Server Error", "Cannot create challenge share link. Please try again later.", "error");
                console.error("Error creating a share link:", error);
            }
        }
    }

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareProject);
        } catch (err) {
            ;
        }
    }

    const sharePopup = () => {
        return (
            <Modal open={sharePopupOpen} onClose={() => setSharePopupOpen(false)}>
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
                    <Button onClick={() => setSharePopupOpen(false)}>
                        <CloseIcon />
                    </Button>
                    <div style={{ width: "100%", display: "flex", alignItems: "center", flexDirection: "column" }}>
                        <h3>Share your Project</h3>
                        <div style={{ display: "flex", width: "100%", flexDirection: "row", justifyContent: "center" }}>
                            <h5 style={{ outline: "solid gray", borderRadius: "5px", padding: "8px" }} id={"url"}>{shareProject.length > 30 ? shareProject.slice(0, 30) + "..." : shareProject}</h5>
                            <Button onClick={() => copyToClipboard()}>
                                <ContentCopyIcon />
                            </Button>
                        </div>
                    </div>
                </Box>
            </Modal>
        )
    }

    const renderLaunchButton = () => {
        let clickCallback = () => {
            if (!loggedIn) {
                window.location.href = "/signup?forward=" + encodeURIComponent(window.location.pathname)
            }
            if (authState.role < 2) {
                setGoProPopup(true)
                return
            }
            if (project !== null && project["has_access"] !== null && project["has_access"] === false) {
                setPurchasePopup(true);
                return;
            }
            setLaunchingWorkspace(true);
            if (project !== null && userId === project["author_id"]) {
                launchWorkspace(project.repo_id, project._id, 0);
                return;
            } else if (userAttempt !== null) {
                launchWorkspace(userAttempt.repo_id, userAttempt._id, 1);
                return;
            }
            createAttempt();
        }

        let sx = {
            maxHeight: "50px",
            minHeight: "35px",
            fontSize: "0.8em",
        }

        let buttonText = project !== null && project["has_access"] !== null && project["has_access"] === false ? "Buy Content" : "Launch"
        let toolTipText: React.ReactNode | string = "Unknown Launch Time"
        if (project !== undefined && project !== null && project["start_time_millis"] !== undefined && project["start_time_millis"] !== null && project["start_time_millis"] !== 0) {
            toolTipText = `Estimated Launch Time: ${millisToTime(project["start_time_millis"])}`
        }
        if (authState.role < 2) {
            toolTipText = (
                <Box sx={{ position: "relative", width: "fit-content" }}>
                    You must be Pro Advanced or Max to launch this Challenge
                    <Button
                        variant="contained"
                        onClick={() => setGoProPopup(true)}
                        sx={{
                            fontSize: "0.8em",
                            p: 0.5,
                            minWidth: "0px",
                            height: "30px",
                            position: "absolute",
                            right: "5px",
                            bottom: "5px",
                            pointerEvents: "auto"
                        }}
                    >
                        Go Pro
                    </Button>
                </Box>
            )
        }

        if (runTutorial && stepIndex === 1) {
            return (
                <Tooltip title={toolTipText} placement={"top"} arrow disableInteractive enterDelay={200} leaveDelay={200}>
                    <TutorialLaunchButton
                        loading={launchingWorkspace}
                        variant="contained"
                        color="secondary"
                        sx={sx}
                        className="attempt"
                        onClick={clickCallback}
                    >
                        {buttonText}<RocketLaunchIcon sx={{ marginLeft: "10px" }} />
                    </TutorialLaunchButton>
                </Tooltip>
            )
        }

        return (
            <Tooltip title={toolTipText} placement={"top"} arrow disableInteractive enterDelay={200} leaveDelay={200}>
                <LoadingButton
                    loading={launchingWorkspace}
                    variant="contained"
                    color="secondary"
                    sx={sx}
                    className="attempt"
                    onClick={clickCallback}
                >
                    {buttonText}<RocketLaunchIcon sx={{ marginLeft: "10px" }} />
                </LoadingButton>
            </Tooltip>
        )
    }

    const renderLaunchButtonMobile = () => {
        let clickCallback = () => {
            if (!loggedIn) {
                router.push("/signup?forward=" + encodeURIComponent(window.location.pathname))
            }
            if (authState.role < 2) {
                setMobileLaunchTooltipOpen(true)
                return
            }
            if (project !== null && project["has_access"] !== null && project["has_access"] === false) {
                setPurchasePopup(true);
                return;
            }
            setLaunchingWorkspace(true);
            if (project !== null && userId === project["author_id"]) {
                launchWorkspace(project.repo_id, project._id, 0);
                return;
            } else if (userAttempt !== null) {
                launchWorkspace(userAttempt.repo_id, userAttempt._id, 1);
                return;
            }
            createAttempt();
        }

        return (
            <Tooltip
                open={mobileLaunchTooltipOpen}
                onClose={() => setMobileLaunchTooltipOpen(false)}
                title={authState.role < 2 ? (
                    <Box>
                        You must be Pro Advanced or Max to launch this Challenge <br />
                        <Box sx={{ width: "100%", position: "relative", height: "30px" }}>
                            <Button
                                variant="contained"
                                onClick={() => setGoProPopup(true)}
                                sx={{
                                    fontSize: "0.8rem",
                                    p: 0.5,
                                    minWidth: "0px",
                                    height: "30px",
                                    position: "absolute",
                                    right: "5px",
                                    pointerEvents: "auto"
                                }}
                            >
                                Go Pro
                            </Button>
                        </Box>
                    </Box>
                ) : "Launch"}
                leaveTouchDelay={3000}
            >
                <Fab
                    disabled={launchingWorkspace}
                    color="secondary"
                    aria-label="launch-mobile"
                    sx={{ position: "fixed", bottom: 16, left: 16, zIndex: 6000 }}
                    onClick={clickCallback}
                >
                    {launchingWorkspace ? (<CircularProgress color="inherit" size={24} />) : (<RocketLaunchIcon />)}
                </Fab>
            </Tooltip>
        )
    }

    const editProject = async (title: string | null, challengeType: string | null, tier: number | null, image: string | null, removeTags: Tag[] | null, addTags: Tag[] | null) => {
        if (project === null) {
            swal("Server Error", "We're sorry, but there has been an issue trying to edit the challenge. Try again later.", "error")
            return
        }

        let params: {
            id: string;
            title?: string;
            challenge_type?: number;
            tier?: number;
            remove_tags?: Tag[];
            add_tags?: Tag[];
            image?: string
        } = {
            id: project["_id"]
        };

        if (title != null) {
            params["title"] = title;
        }

        if (challengeType != null) {
            switch (challengeType) {
                case "Casual":
                    params["challenge_type"] = 2;
                    break;
                case "Competitive":
                    params["challenge_type"] = 3;
                    break;
                case "Interactive":
                    params["challenge_type"] = 0;
                    break;
                case "Playground":
                    params["challenge_type"] = 1;
                    break;
                case "Debug":
                    params["challenge_type"] = 4;
                    break;
            }
        }

        if (tier != null) {
            params["tier"] = tier - 1;
        }

        if (removeTags != null) {
            params["remove_tags"] = removeTags;
        }

        if (addTags != null) {
            params["add_tags"] = addTags;
        }

        // Add the image if not null
        if (image != null) {
            params["image"] = image;
        }

        let edit;

        if (image != null) {

            if (genImageId !== null && genImageId !== "") {
                //@ts-ignore
                params["gen_image_id"] = genImageId

                edit = fetch(
                    `${config.rootPath}/api/project/editProject`,
                    {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(params),
                        credentials: 'include'
                    }
                ).then((res) => res.json())

                const [res] = await Promise.all([
                    edit
                ])

                if (res === undefined) {
                    swal("There has been an issue loading data. Please try again later.")
                }

                if (res["message"] !== "success") {
                    swal("There has been an issue loading data. Please try again later.")
                } else {
                    swal("Success!", "Challenge Was Successfully Updated", "success")
                }
            } else {
                if (usedThumbnail === null) {
                    return
                }

                let res = await fetchWithUpload(
                    `${config.rootPath}/api/project/editProject`,
                    usedThumbnail,
                    {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(params),
                        credentials: 'include'
                    },
                    (res) => {
                        if (res === undefined) {
                            swal("Server Error", "There has been an error updating your Challenge. Please try again later.")
                        }
                    }
                )
            }
        } else {
            edit = fetch(
                `${config.rootPath}/api/project/editProject`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(params),
                    credentials: 'include'
                }
            ).then((res) => res.json())

            const [res] = await Promise.all([
                edit
            ])

            if (res === undefined) {
                swal("There has been an issue loading data. Please try again later.")
            }

            if (res["message"] !== "success") {
                swal("There has been an issue loading data. Please try again later.")
            } else {
                swal("Success!", "Challenge Was Successfully Updated", "success")
                if (title != null) {

                }
            }
        }
    }

    const handleProjectSelection = (selectedProject: React.SetStateAction<string | null>) => {
        setChallengeType(selectedProject)
    };

    const handleProjectSelectionRenown = (selectedProject: React.SetStateAction<number>) => {
        setProjectRenown(selectedProject)
    };

    const handleTagSearch = async (e: any) => {
        if (typeof e.target.value !== "string") {
            return
        }

        let res = await fetch(
            `${config.rootPath}/api/search/tags`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query: e.target.value, skip: 0, limit: 5 }),
                credentials: 'include'
            }
        ).then((res) => res.json())

        if (res === undefined) {
            swal("Server Error", "We can't get in touch with the GIGO servers right now. Sorry about that! " +
                "We'll get crackin' on that right away!")
            return
        }


        if (res["tags"] === undefined) {
            if (res["message"] === undefined) {
                swal("Server Error", "Man... We don't know what happened, but there's some weird stuff going on. " +
                    "We'll get working on this, come back in a few minutes")
                return
            }
            if (res["message"] === "incorrect type passed for field query") {
                return
            }
            swal("Server Error", res["message"])
            return
        }

        setTagOptions(res["tags"])
    }

    // todo

    const descriptionTab = () => {
        let regex = /(?:!\[[^\]]*\]\((?!http)(.*?)\))|(?:<img\s[^>]*?src\s*=\s*['\"](?!http)(.*?)['\"][^>]*?>)/g;
        let markdown = projectDesc
        let match;
        let finalString;
        while ((match = regex.exec(markdown)) !== null) {
            let imagePath = match[1] ? match[1] : match[2];
            finalString = insertBeforeAll(imagePath, config.rootPath + "/static/git/p/" + id?.toString() + "/", projectDesc)
            setProjectDesc(finalString)
        }
        return (
            <MarkdownRenderer markdown={projectDesc} style={{
                width: "100%",
                overflowWrap: "break-word",
                borderRadius: "10px",
                padding: "1em"
            }} />
        )
    }

    const tutorialTab = () => {
        return (
            <MarkdownRenderer
                markdown={
                    project?.tutorial_preview +
                    "<br/><br/>\n\n### Start the project to finish the tutorial!"
                }
                style={{
                    width: "100%",
                    overflowWrap: "break-word",
                    borderRadius: "10px",
                    padding: "1em"
                }}
            />
        )
    }

    const [activeTab, setActiveTab] = React.useState('description');
    const handleProjectTabChange = (event: any, newValue: React.SetStateAction<string>) => {
        setActiveTab(newValue);
    };

    let currentUser = false
    if (project !== null && userId === project["author_id"]) {
        currentUser = true
    }

    const mainTabProjectOverview = () => {
        return (
            <>
                <Box sx={{
                    width: "100%",
                    maxWidth: "100%",
                    borderRadius: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                }}>
                    <Typography variant="h5" component="div">
                        {projectName}
                    </Typography>
                    {project !== null &&
                      <Tooltip title={project["post_type_string"]}>
                        <Box sx={{
                            position: "absolute",
                            right: 0,
                            marginRight: 2,
                        }}>
                            {getProjectIcon(project["post_type_string"])}
                        </Box>
                      </Tooltip>
                    }
                </Box>
                {project !== null ? (
                    <>
                        <Box sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            overflow: "hidden"
                        }}>
                            {project["published"] ? (
                                <Image
                                    src={config.rootPath + project["thumbnail"]}
                                    height={1500}
                                    width={1500}
                                    alt={"project thumbnail"}
                                    style={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: "10px" }}  // making image responsive
                                />
                            ) : (
                                <img
                                    src={config.rootPath + project["thumbnail"]}
                                    alt={"project thumbnail"}
                                    style={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: "10px" }}  // making image responsive
                                />
                            )}
                        </Box>
                    </>
                ) : null}
                <div style={{ height: "20px" }} />
                {project !== null ? (
                    <PostOverview
                        userId={project["author_id"]}
                        userName={project["author"]}
                        width={"100%"}
                        height={"100%"}
                        userThumb={config.rootPath + "/static/user/pfp/" + project["author_id"]}
                        backgroundName={project["name"]}
                        backgroundPalette={project["color_palette"]}
                        backgroundRender={project["render_in_front"]}
                        userTier={project["tier"]}
                        description={""}
                        postDate={project["created_at"]}
                        userIsOP={currentUser}
                        id={project["_id"]}
                        renown={project["tier"]}
                        project={true}
                        estimatedTime={project["estimated_tutorial_time_millis"]}
                    />
                ) : null}
                <Box sx={{ mt: 1, mb: 1, width: "100%", border: "1px solid rgba(255,255,255,0.18)", borderRadius: "10px" }}>
                    {project?.tutorial_preview && project?.post_type === 0 ? (
                        <>
                            <Tabs value={activeTab} onChange={handleProjectTabChange} centered>
                                <Tab label="Description" value="description" />
                                <Tab label="Tutorial" value="tutorial" />
                            </Tabs>
                            {activeTab === 'description' ? descriptionTab() : tutorialTab()}
                        </>
                    ) : (
                        descriptionTab()
                    )}
                </Box>

            </>
        )
    }

    const mainTabSourceCode = () => {
        return (
            <div style={{ display: "flex", width: "100vw", position: "relative" }}>
                {project !== null ? (
                    <CodeDisplayEditor repoId={project["repo_id"]}
                        references={"main"}
                        filepath={""}
                        height={"60vh"}
                        style={{ width: "100vw", paddingLeft: "20px", paddingRight: "20px" }}
                        projectName={project["title"]}
                    />
                ) : (
                    <CircularProgress sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                    }} />
                )}
                {/*<Editor theme={theme}/>*/}
            </div>
        )
    }

    const mainTabEditConfig = () => {
        return (
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "50vw" }}>
                <WorkspaceConfigEditor
                    value={wsConfig}
                    setValue={(e) => setWsConfig(e)}
                    style={{
                        float: "left",
                    }}
                    width={"auto"}
                    height={"70vh"}
                />
                <LoadingButton variant={"contained"}
                    loading={loadingEdit}
                    sx={{
                        height: "4vh",
                        minHeight: "35px",
                        backgroundColor: theme.palette.primary.main,
                        width: "auto",
                        borderRadius: "10px",
                        fontSize: "1.2rem",
                        fontWeight: "bold",
                        textAlign: "center",
                        marginTop: "10px",
                        marginBottom: "10px"
                    }}
                    onClick={() => editConfig()}>
                    Confirm Edit
                </LoadingButton>
                <Dialog
                    open={editConfirm}
                    onClose={() => setEditConfirm(false)}
                >
                    <DialogTitle>{"Apply Changes Now?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To ensure the changes take effect, they will be automatically applied after 24 hours.
                            However, if you prefer, you can apply the changes immediately. Please note that applying a
                            configuration change will require the workspace to re-initialize, resulting in the deletion
                            of any data that has not been pushed to Git or specified within the configuration.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEditConfirm(false)} color="primary">Apply Later</Button>
                        <Button onClick={() => confirmEditConfig()} color={"error"}>
                            Apply Changes Now
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }

    const mainTabSwitch = () => {
        let renderFunc = mainTabProjectOverview
        if (mainTab === "source") {
            renderFunc = mainTabSourceCode
        } else if (mainTab === "edit") {
            renderFunc = mainTabEditConfig
        }

        return renderFunc()
    }

    const tabButtons = () => {
        let buttonStyle = {
            maxHeight: "50px",
            minHeight: "35px",
            fontSize: "0.8em",
        }
        return (
            <>
                {project && project["author_id"] === authState.id && (
                    <>
                        <Button
                            variant={"outlined"}
                            sx={buttonStyle}
                            onClick={() => setEditPopup(true)}
                        >
                            Edit Challenge
                        </Button>

                    </>
                )}
                <Button
                    variant={"outlined"}
                    sx={buttonStyle}
                    onClick={() => handleTabChange("project")}
                    disabled={mainTab === "project"}
                >
                    Project
                </Button>
                <Button
                    variant={"outlined"}
                    sx={buttonStyle}
                    onClick={() => handleTabChange("source")}
                    disabled={mainTab === "source"}
                >
                    Source Code
                </Button>
                {project && project["author_id"] === authState.id && (
                    <>
                        <Button
                            variant={"outlined"}
                            sx={buttonStyle}
                            onClick={() => handleTabChange("edit")}
                            disabled={mainTab === "edit"}
                        >
                            Edit Config
                        </Button>
                        <Button
                            variant={"outlined"}
                            sx={buttonStyle}
                            color={"error"}
                            onClick={() => setDeleteProject(true)}
                        >
                            Delete
                        </Button>
                    </>
                )}
            </>
        )
    }

    const editProjectDetails = () => {
        return (
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={editPopup}
                onClose={() => setEditPopup(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{ timeout: 500 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Box
                    sx={{
                        width: { xs: '90vw', md: '50vw' },
                        height: 'auto',
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}
                >
                    <Typography id="transition-modal-title" variant="h6">
                        Edit Project Details
                    </Typography>
                    <TextField
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        variant="outlined"
                        size="medium"
                        color={(projectName.length > 30) ? "error" : "primary"}
                        fullWidth
                        required
                        label="Project Name"
                        multiline
                    />
                    <Grid container spacing={2}>
                        {project && project["post_type_string"] !== null && (
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6">Renown</Typography>
                                <ProjectRenown originalLabel={project["tier"] + 1} onProjectSelect={handleProjectSelectionRenown} />
                            </Grid>
                        )}
                        {project && project["post_type_string"] !== null && (
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6">Challenge Type</Typography>
                                <ProjectSelector originalLabel={project["post_type_string"]} onProjectSelect={handleProjectSelection} theme={theme} />
                            </Grid>
                        )}
                        {project && (
                            <Grid item xs={12}>
                                <Autocomplete
                                    multiple
                                    limitTags={5}
                                    id="tagInputAutocomplete"
                                    freeSolo
                                    options={tagOptions}
                                    getOptionLabel={(option: any) => typeof option === 'string' ? option : option.value}
                                    isOptionEqualToValue={(option: any, value: any) => typeof option === 'string' ? option === value : option.value === value.value}
                                    renderInput={(params) => <TextField {...params} label="Challenge Tags" placeholder="Challenge Tags" />}
                                    onInputChange={(e) => handleTagSearch(e)}
                                    onChange={(event, value) => {
                                        const currentRemovedTags: any[] = [];
                                        const currentAddedTags: any[] = [];
                                        const newAddedTags = value.filter(tag => {
                                            const t = typeof tag === 'string'
                                                ? { _id: "-1", value: tag, official: false, usage_count: 0 }
                                                : tag;
                                            return !projectTags.some(existingTag => existingTag.value === t.value);
                                        });
                                        newAddedTags.forEach(tag => {
                                            if (removedTagsState.some(removedTag => removedTag.value === (typeof tag === 'string' ? tag : tag.value))) {
                                                const index = removedTagsState.findIndex(removedTag => removedTag.value === (typeof tag === 'string' ? tag : tag.value));
                                                if (index !== -1) removedTagsState.splice(index, 1);
                                            } else {
                                                currentAddedTags.push(typeof tag === 'object' ? tag : {
                                                    _id: "-1",
                                                    value: tag,
                                                    official: false,
                                                    usage_count: 0
                                                });
                                            }
                                        });
                                        const newRemovedTags = projectTags.filter(tag => !value.some(v => typeof v === 'string' ? v === tag.value : v.value === tag.value));
                                        newRemovedTags.forEach(tag => {
                                            if (addedTagsState.some(addedTag => addedTag.value === tag.value)) {
                                                const index = addedTagsState.findIndex(addedTag => addedTag.value === tag.value);
                                                if (index !== -1) addedTagsState.splice(index, 1);
                                            } else {
                                                currentRemovedTags.push(tag);
                                            }
                                        });
                                        const tagArray = value.map(tag => typeof tag === 'object' ? tag : {
                                            _id: "-1",
                                            value: tag,
                                            official: false,
                                            usage_count: 0
                                        });
                                        setProjectTags(tagArray);
                                        setRemovedTagsState(currentRemovedTags);
                                        setAddedTagsState(currentAddedTags);
                                    }}
                                    value={projectTags}
                                />
                            </Grid>
                        )}
                    </Grid>
                    <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Button variant="contained" color="primary" onClick={() => {
                            if (project) {
                                editProject(
                                    projectName,
                                    challengeType,
                                    projectRenown.toString() !== project["tier"].toString() ? projectRenown : null,
                                    null,
                                    removedTagsState.length > 0 ? removedTagsState : null,
                                    addedTagsState.length > 0 ? addedTagsState : null
                                );
                            } else {
                                console.error("Project is null");
                                swal("Server Error", "There was an error updating the project. Please try again later.", "error");
                            }
                        }}>
                            Submit
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={() => setEditPopup(false)}>
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Modal>
        )
    }

    const renderDesktopChallenge = () => {
        return (
            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                maxWidth: "50vw",
                width: "100%",
                flexDirection: "column",
                margin: "0 auto",
            }}>
                <Box sx={{
                    paddingTop: "30px",
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                    zIndex: 6,
                    width: "100%",
                }}>
                    <Box sx={{
                        height: "75px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                        flexWrap: "wrap",
                        mb: 2,
                        ...(isScrolled ? {
                            position: "fixed",
                            top: "100px",
                            zIndex: 99,
                            p: 2,
                            ...themeHelpers.frostedGlass,
                            borderColor: theme.palette.primary.main
                        } : {
                            width: "100%",
                            maxWidth: "100%",
                            border: `1px solid ${theme.palette.primary.main}`,
                        }
                        )
                    }}>
                        {!isScrolled && tabButtons()}
                        {renderLaunchButton()}
                    </Box>
                </Box>
                {mainTabSwitch()}
                {editProjectDetails()}
            </Box>
        )
    }

    const renderMobileChallenge = () => {
        return (
            <Box>
                <Box sx={{
                    width: "100%",
                    maxWidth: "100%",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                }}>
                    <Typography variant="h5" sx={{ width: "100%", textAlign: "center" }}>
                        {projectName}
                    </Typography>
                </Box>
                {project !== null ? (
                    <Box
                        display={"flex"}
                        flexDirection={"column"}
                        alignItems={"center"}
                    >
                        <Box sx={{
                            width: "calc(100% - 20px)",
                            display: "flex",
                            justifyContent: "center",
                            overflow: "hidden"
                        }}>
                            {project["published"] ? (
                                <Image
                                    src={config.rootPath + project["thumbnail"]}
                                    height={700}
                                    width={1200}
                                    alt={"project thumbnail"}
                                    style={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: "10px" }}  // making image responsive
                                />
                            ) : (
                                <img
                                    src={config.rootPath + project["thumbnail"]}
                                    alt={"project thumbnail"}
                                    style={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: "10px" }}  // making image responsive
                                />
                            )}
                        </Box>
                    </Box>
                ) : null}
                <div style={{ height: "20px" }} />
                {project !== null ? (
                    <Box display={"flex"} flexDirection={"column"} alignItems={"center"} sx={{ width: "100%" }}>
                        <Box sx={{ width: "calc(100% - 20px)" }}>
                            <PostOverview
                                userId={project["author_id"]}
                                userName={project["author"]}
                                width={"100%"}
                                height={"100%"}
                                userThumb={config.rootPath + "/static/user/pfp/" + project["author_id"]}
                                backgroundName={project["name"]}
                                backgroundPalette={project["color_palette"]}
                                backgroundRender={project["render_in_front"]}
                                userTier={project["tier"]}
                                description={""}
                                postDate={project["created_at"]}
                                userIsOP={currentUser}
                                id={project["_id"]}
                                renown={project["tier"]}
                                project={true}
                                estimatedTime={project["estimated_tutorial_time_millis"]}
                            />
                        </Box>
                    </Box>
                ) : null}
                <Box
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"center"}
                    sx={{
                        mt: 1,
                        mb: 1,
                        width: "100%",
                    }}
                >
                    <Box sx={{
                        width: "calc(100% - 20px)",
                        border: "1px solid rgba(255,255,255,0.18)",
                        borderRadius: "10px"
                    }}>
                        {project?.tutorial_preview && project?.post_type === 0 ? (
                            <>
                                <Tabs value={activeTab} onChange={handleProjectTabChange} centered>
                                    <Tab label="Description" value="description" />
                                    <Tab label="Tutorial" value="tutorial" />
                                </Tabs>
                                {activeTab === 'description' ? descriptionTab() : tutorialTab()}
                            </>
                        ) : (
                            descriptionTab()
                        )}
                    </Box>
                </Box>
            </Box>

        )
    }

    const renderDeleteDialog = () => {
        return (
            <Dialog
                open={deleteProject}
                onClose={() => setDeleteProject(false)}
            >
                <DialogTitle>{"Delete Project?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this project? <br />
                        Deleting projects will unlink you from the project and prevent future attempts but existing attempts will remain.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDeleteProject(false)}
                        color="primary"
                        variant={"outlined"}
                    >
                        Cancel
                    </Button>
                    <LoadingButton
                        onClick={() => {
                            setDeleteProjectLoading(true)
                            deleteProjectFunction().then(() => {
                                setDeleteProjectLoading(false)
                            })
                        }}
                        variant={"contained"}
                        color={"error"}
                        loading={deleteProjectLoading}
                    >
                        Delete
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        )
    }

    return (
        <>
            {isMobile ? renderMobileChallenge() : renderDesktopChallenge()}
            {/* On mobile add a hovering button to launch the project */}
            {isMobile && renderLaunchButtonMobile()}
            {renderDeleteDialog()}
            <GoProDisplay open={goProPopup} onClose={() => setGoProPopup(false)} />
        </>
    );
}

export default Challenge;