'use client'
import * as React from "react";
import { useEffect, useRef } from "react";
import {
    Box,
    Button,
    ButtonBase, Card, CardMedia, Chip,
    createTheme,
    CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Modal,
    PaletteMode,
    Tab,
    Tabs,
    TextField,
    ThemeProvider, Tooltip,
    Typography
} from "@mui/material";
import { theme, themeHelpers } from "@/theme";
import UserIcon from "@/icons/User/UserIcon";
import config from "@/config";
import Post from "@/models/post"
import MarkdownRenderer from "@/components/Markdown/MarkdownRenderer";
import PostOverview from "@/components/Project/PostOverview";
import swal from "sweetalert";
import { Workspace } from "@/models/workspace";
import CodeDisplayEditor from "@/components/editor/workspace_config/code_display_editor";
import { ThreeDots } from "react-loading-icons";
import { LoadingButton } from "@mui/lab";
import Attempt from "@/models/attempt";

import HorseIcon from "@/icons/ProjectCard/Horse";
import HoodieIcon from "@/icons/ProjectCard/Hoodie";
import { QuestionMark } from "@mui/icons-material";
import TrophyIcon from "@/icons/ProjectCard/Trophy";
import GraduationIcon from "@/icons/ProjectCard/Graduation";

import { v4 } from "uuid";
import alternativeImage from "@/img/Black.png";
import ReactGA from "react-ga4";
import PostOverviewMobile from "@/components/Project/PostOverviewMobile"
import Person3Icon from "@mui/icons-material/Person3";
import styled, { keyframes } from 'styled-components';
import WorkspaceConfigEditor from "@/components/editor/workspace_config/editor";
import { Helmet, HelmetProvider } from "react-helmet-async"

import * as yaml from 'js-yaml';
import { Backdrop } from "@mui/material";
import darkImageUploadIcon from "@/img/dark_image_upload2.svg";
import EditIcon from "@mui/icons-material/Edit";
import Fab from '@mui/material/Fab';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CircularProgress from '@mui/material/CircularProgress';
import DebugIcon from "@/icons/ProjectCard/Debug";
import GoProDisplay from "@/components/GoProDisplay";
import { useAppDispatch, useAppSelector } from "@/reducers/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { initialAuthStateUpdate, selectAuthState, selectAuthStateId } from "@/reducers/auth/auth";
import fetchWithUpload from "@/services/chunkUpload";
import Image from "next/image";


interface AttemptProps {
    params: { id: string };
    attempt: Attempt;
    description: string;
    evaluation: string;
}


function AttemptPage({ params, ...props }: AttemptProps) {
    const id = params.id;

    const queryParams = useSearchParams()
    let isMobile = queryParams.get("viewport") === "mobile";
    const embedded = queryParams.has('embed') && queryParams.get('embed') === 'true';

    const [mainTab, setMainTab] = React.useState(window.location.hash.replace('#', '') !== "" ? window.location.hash.replace('#', '') : "project")
    const [minorTab, setMinorTab] = React.useState("overview")
    const [loading, setLoading] = React.useState(true)
    const userId = useAppSelector(selectAuthStateId);
    const [attempt, setAttempt] = React.useState<Attempt>(props.attempt)
    const [attemptDesc, setAttemptDesc] = React.useState<string>(props.evaluation)
    const [projectDesc, setProjectDesc] = React.useState<string>(props.description)
    const [closedState, setClosedState] = React.useState(props.attempt.closed)
    const [projectName, setProjectName] = React.useState<string>(props.attempt.title || props.attempt.post_title)
    const [confirm, setConfirm] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [exclusive, setExclusive] = React.useState(false)
    const [wsConfig, setWsConfig] = React.useState("")
    const [loadingEdit, setLoadingEdit] = React.useState(false)
    const [editConfirm, setEditConfirm] = React.useState(false)
    const [editTitle, setEditTitle] = React.useState(false)
    const [editImage, setEditImage] = React.useState(false)
    const [projectImage, setProjectImage] = React.useState<string | null>(null)
    const [projectTitle, setProjectTitle] = React.useState<string>(props.attempt.title || props.attempt.post_title)
    const [imageGenLoad, setImageGenLoad] = React.useState<boolean>(false)
    const [genLimitReached, setGenLimitReached] = React.useState<boolean>(false);
    const [genOpened, setGenOpened] = React.useState<boolean>(false);
    const [promptError, setPromptError] = React.useState<string>("")
    const [prompt, setPrompt] = React.useState("");
    const [genImageId, setGenImageId] = React.useState<string>("");
    const [usedThumbnail, setUsedThumbnail] = React.useState<File | null>(null);
    const [attemptTitle, setAttemptTitle] = React.useState<string>("")
    const [goProPopup, setGoProPopup] = React.useState(false)
    const [mobileLaunchTooltipOpen, setMobileLaunchTooltipOpen] = React.useState(false)

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


    let handleCloseAttempt = () => {
        if (attemptTitle === "") {
            swal("Please add a unique title for your attempt!")
        } else {
            setConfirm(false)
            closeAttempt()
        }
    }
    const styles = {
        themeButton: {
            display: "flex",
            justifyContent: "right"
        },
        projectName: {
            marginLeft: "2%",
            marginTop: "10px",
        },
        mainTabButton: {
            height: "4vh",
            maxHeight: "50px",
            minHeight: "35px",
            fontSize: "0.8rem",
            '&:hover': {
                backgroundColor: theme.palette.primary.main + "25",
            }
        }
    };

    ReactGA.initialize("G-38KBFJZ6M6");

    const closeAttempt = async () => {
        setClosedState(true)
        let attempt = await fetch(
            `${config.rootPath}/api/attempt/closeAttempt`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ attempt_id: id, title: attemptTitle }),
                credentials: "include",
            }
        ).then((res) => res.json())

        const [res] = await Promise.all([
            attempt,
        ])

        if (res === undefined) {
            swal("Server Error", "We can't get in touch with the GIGO servers right now. Sorry about that! " +
                "We'll get crackin' on that right away!")
            return
        }
    }

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

    const generateImage = async () => {


        // if (projectImage !== null || prompt === "")
        //     return false

        // execute api call to remote GIGO server to create image
        let res = await fetch(
            `${config.rootPath}/api/project/genImage`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt: prompt }),
                credentials: "include",
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

    const handleGenClose = () => {
        setGenOpened(false);
        // if (prompt !== createProjectForm.name) {
        //     setPrompt("");
        // }
    };

    const handleGenClickOpen = () => {
        // setPrompt(createProjectForm.name)
        setGenOpened(true);
    };

    const editProject = async (title: null, image: null) => {
        if (attempt === null) {
            return
        }

        let params: any = {
            id: attempt["_id"],
        }

        if (title != null) {
            params["title"] = title;
        }

        let edit;

        if (image != null) {

            if (genImageId !== null && genImageId !== "") {
                //@ts-ignore
                params["gen_image_id"] = genImageId

                edit = fetch(
                    `${config.rootPath}/api/project/editAttempt`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(params),
                        credentials: "include",
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
                    swal("Success!", res["message"], "success")
                }
            } else {
                if (usedThumbnail === null) {
                    return
                }

                let res = await fetchWithUpload(
                    `${config.rootPath}/api/project/editAttempt`,
                    usedThumbnail,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(params),
                        credentials: "include",
                    },
                    (res) => {
                        if (res === undefined) {
                            swal("Server Error", "There has been an issue updating your Attempt. Please try again later.")
                        }
                    }
                );
            }
        } else {
            edit = fetch(
                `${config.rootPath}/api/project/editAttempt`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(params),
                    credentials: "include",
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
                swal("Success!", res["message"], "success")
            }
        }

        // window.location.reload();
    }

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
    const getProjectInformation = async () => {
        let res2 = await fetch(
            `${config.rootPath}/api/attempt/getProject`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ attempt_id: id }),
                credentials: "include",
            }
        ).then((res) => res.json())

        if (res2 === undefined) {
            swal("Server Error", "We can't get in touch with the GIGO servers right now. Sorry about that! " +
                "We'll get crackin' on that right away!")
            return
        }

        if (res2["description"] === undefined) {
            if (res2["message"] === undefined) {
                swal("Server Error", "Man... We don't know what happened, but there's some weird stuff going on. " +
                    "We'll get working on this, come back in a few minutes")
                return
            }
            swal("Server Error", res2["message"])
            return
        }

        if (res2["exclusive"] !== undefined && res2["exclusive"] !== null) {
            setExclusive(true)
        } else {
            setExclusive(false)
        }
    }

    const authState = useAppSelector(selectAuthState);

    useEffect(() => {
        setLoading(true)
        getProjectInformation()
        setLoading(false)
    }, [])

    const implicitSessionID = React.useRef<string | null>("")
    const getSessionID = () => {
        // return empty string if there's no project
        if (attempt === null) {
            return ""
        }

        // check for an existing session token
        let lastSession = window.sessionStorage.getItem(`project-exit-${attempt._id}`)

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

    const implicitRecord = async () => {
        // bail if we don't have a project yet
        if (attempt === null) {
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
            window.sessionStorage.setItem(`project-exit-${attempt._id}`, `${new Date().getTime()}:${sid}`)
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
            window.sessionStorage.setItem(`project-exit-${attempt._id}`, `${new Date().getTime()}:${implicitSessionID.current}`)

            // record changing pages
            recordImplicitAction(false)

            // clear hooks
            window.removeEventListener('blur', function () {
                // record the exit time in session storage
                window.sessionStorage.setItem(`project-exit-${attempt._id}`, `${new Date().getTime()}:${implicitSessionID.current}`)
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
    }

    let loggedIn = false
    if (authState.authenticated !== false) {
        loggedIn = true
    }

    const recordImplicitAction = async (open: boolean, sessionId: string | null = null) => {

        if (loggedIn) {
            // bail if we don't have a project yet
            if (attempt === null || implicitSessionID.current === null) {
                return
            }

            // use the state session ID if no session ID is provided
            if (sessionId === null) {
                sessionId = implicitSessionID.current
            }

            // Convert payload to a string
            const blob = new Blob([JSON.stringify({
                post_id: id,
                action: 0,
                session_id: sessionId,
            })], { type: 'application/json' });

            // Use navigator.sendBeacon to send the data to the server
            navigator.sendBeacon(config.rootPath + '/api/implicit/recordAction', blob);
        }
    }

    const dispatch = useAppDispatch();

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


    const launchWorkspace = async (parentAttempt: Attempt | null = null) => {
        setIsLoading(true)
        if (attempt == null) {
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
                body: JSON.stringify({
                    commit: "main", // for now always 'main' - future will handle branches and commits
                    repo: (parentAttempt == null) ? attempt.repo_id : parentAttempt.repo_id,  // available in attempt or project
                    code_source_id: (parentAttempt == null) ? attempt._id : parentAttempt._id,  // pass id of attempt or project
                    code_source_type: 1, // 0 for project - 1 for attempt
                }),
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
        ).then((res) => res.json())

        // handle failed call
        if (res === undefined || res["message"] === undefined) {
            if (sessionStorage.getItem("alive") === null)
                //@ts-ignore
                swal(
                    "Server Error",
                    "We can't get in touch with the server... Sorry about that! We'll get working on that right away!"
                );
            setIsLoading(false)
            return
        }

        // handle expected failure
        if (res["message"] !== "Workspace Created Successfully") {
            if (sessionStorage.getItem("alive") === null)
                //@ts-ignore
                swal(
                    "Server Error",
                    res["message"]
                );
            setIsLoading(false)
            return
        }

        let workspace: Workspace = res["workspace"]

        // route to workspace page
        router.push(`/launchpad/${workspace._id}`)

        implicitRecord()
    }


    const createAttempt = async () => {
        setIsLoading(true)
        // execute api call to remote GIGO server to create workspace
        let res = await fetch(
            `${config.rootPath}/api/attempt/start`,
            {
                method: "POST",
                body: JSON.stringify({
                    project_id: attempt?.post_id,
                    parent_attempt: attempt?._id
                }),
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
        ).then((res) => res.json())


        window.sessionStorage.setItem("attemptXP", JSON.stringify(res["xp"]))

        if (res !== undefined && res["message"] !== undefined && res["message"] === "Attempt created successfully.") {
            await launchWorkspace(res["attempt"])
        } else if (res["message"] === "You have already started an attempt. Keep working on that one!") {
            swal("You have already started an attempt. Keep working on that one!")
            setIsLoading(false)
        } else {
            swal("There was an issue branching this attempt. Please try again later.")
            setIsLoading(false)
        }

        implicitRecord()
    }

    const handleError = (e: any) => {
        e.target.src = alternativeImage; // replace with your alternative image URL

    };

    const attemptDescriptionTab = () => {
        return (
            <MarkdownRenderer markdown={attemptDesc} style={{
                width: "70vw",
                maxWidth: "1300px",
                overflowWrap: "break-word",
                borderRadius: "10px",
                padding: "2em 3em"
            }} />
        )
    }

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setMinorTab(newValue);
    };

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

    const getConfig = async () => {
        if (attempt === null) {
            return
        }

        let res = await fetch(
            `${config.rootPath}/api/project/config`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "commit": "main", // for now always 'main' - future will handle branches and commits
                    "repo": attempt["repo_id"],  // available in attempt or project
                })
            }
        ).then((res) => res.json())

        setWsConfig(res["ws_config"])
    }

    const confirmEditConfig = async () => {
        if (attempt === null) {
            return
        }

        let res = await fetch(
            `${config.rootPath}/api/project/confirmEditConfig`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "project": attempt["_id"], // available in attempt or project
                })
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
    }


    const editConfig = async () => {
        if (attempt === null) {
            return
        }

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
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "commit": "main", // for now always 'main' - future will handle branches and commits
                    "repo": attempt["repo_id"],  // available in attempt or project
                    "content": wsConfig
                })
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

    let currentUser = false
    if (attempt !== null && userId === attempt.author_id) {
        currentUser = true
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

    const mainTabProjectOverview = () => {
        return (
            <>
                <Box sx={{
                    width: "100%",
                    maxWidth: "100%",
                    borderRadius: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <Typography variant="h5" component="div">
                        {projectName}
                    </Typography>
                </Box>
                {attempt !== null ? (
                    <>
                        <Box sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            overflow: "hidden"
                        }}>
                            <Image
                                src={config.rootPath + attempt["thumbnail"]}
                                height={1500}
                                width={1500}
                                alt={"project thumbnail"}
                                style={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: "10px" }}  // making image responsive
                            />
                        </Box>
                    </>
                ) : null}
                <div style={{ height: "20px" }} />
                {attempt !== null ? (
                    <PostOverview
                        userId={attempt["author_id"]}
                        userName={attempt["author"]}
                        width={"100%"}
                        height={"100%"}
                        userThumb={config.rootPath + "/static/user/pfp/" + attempt["author_id"]}
                        backgroundName={attempt["name"]}
                        backgroundPalette={attempt["color_palette"]}
                        backgroundRender={attempt["render_in_front"]}
                        userTier={attempt["tier"]}
                        description={""}
                        postDate={attempt["created_at"]}
                        userIsOP={currentUser}
                        id={attempt["_id"]}
                        renown={attempt["tier"]}
                        project={true}
                        estimatedTime={attempt["estimated_tutorial_time_millis"]}
                    />
                ) : null}
                <Box sx={{ mt: 1, mb: 1, width: "100%", border: "1px solid rgba(255,255,255,0.18)", borderRadius: "10px" }}>
                    {descriptionTab()}
                </Box>

            </>
        )
    }

    const mainTabSourceCode = () => {
        return (
            <div style={{ display: "flex", width: "100vw", position: "relative" }}>
                {attempt !== null ? (
                    <CodeDisplayEditor repoId={attempt["repo_id"]}
                        references={"main"}
                        filepath={""}
                        height={"60vh"}
                        style={{ width: "100vw", paddingLeft: "20px", paddingRight: "20px" }}
                        projectName={attempt["post_title"]}
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
                {attempt && attempt["author_id"] === authState.id && (
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
                            color={"error"}
                            disabled={closedState}
                            onClick={() => setConfirm(true)}
                        >
                            {closedState ? "Published" : "Publish"}
                        </Button>
                    </>
                )}
            </>
        )
    }

    const renderLaunchButton = () => {
        let clickCallback = () => {
            if (!loggedIn) {
                router.push("/signup?forward=" + encodeURIComponent(window.location.pathname))
            }

            if (authState.role < 2) {
                setGoProPopup(true)
                return
            }

            userId === attempt?.author_id ? launchWorkspace() : createAttempt();
        }

        let sx = {
            maxHeight: "50px",
            minHeight: "35px",
            fontSize: "0.8em",
        }

        let buttonText = "Launch"
        let toolTipText = "Unknown Launch Time"
        if (attempt !== null && attempt["start_time_millis"] !== undefined && attempt["start_time_millis"] !== null && attempt["start_time_millis"] !== 0) {
            toolTipText = `Estimated Launch Time: ${millisToTime(attempt["start_time_millis"])}`
        }

        return (
            <Tooltip title={toolTipText} placement={"top"} arrow disableInteractive enterDelay={200} leaveDelay={200}>
                <LoadingButton
                    loading={isLoading}
                    variant="contained"
                    color="secondary"
                    sx={sx}
                    className="attempt"
                    onClick={clickCallback}
                >
                    Launch <RocketLaunchIcon sx={{ marginLeft: "10px" }} />
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
                setGoProPopup(true)
                return
            }

            userId === attempt?.author_id ? launchWorkspace() : createAttempt();
        }

        return (
            <Tooltip title={"Launch"}>
                <Fab
                    disabled={isLoading}
                    color="secondary"
                    aria-label="launch-mobile"
                    sx={{ position: "fixed", bottom: 16, left: 16, zIndex: 6000 }}
                    onClick={clickCallback}
                >
                    {isLoading ? (<CircularProgress color="inherit" size={24} />) : (<RocketLaunchIcon />)}
                </Fab>
            </Tooltip>
        )
    }


    const renderDesktopAttempt = () => {
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
            </Box>
        )
    }

    const renderMobileAttempt = () => {
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
                {attempt !== null ? (
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
                            <Image
                                src={config.rootPath + attempt["thumbnail"]}
                                height={700}
                                width={1200}
                                alt={"project thumbnail"}
                                style={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: "10px" }}  // making image responsive
                            />
                        </Box>
                    </Box>
                ) : null}
                <div style={{ height: "20px" }} />
                {attempt !== null ? (
                    <Box display={"flex"} flexDirection={"column"} alignItems={"center"} sx={{ width: "100%" }}>
                        <Box sx={{ width: "calc(100% - 20px)" }}>
                            <PostOverview
                                userId={attempt.author_id}
                                userName={attempt.author}
                                width={"100%"}
                                height={"100%"}
                                userThumb={config.rootPath + "/static/user/pfp/" + attempt.author_id}
                                backgroundName={attempt.post_title}
                                backgroundPalette={attempt.color_palette}
                                backgroundRender={attempt.render_in_front}
                                userTier={attempt.tier}
                                description={""}
                                postDate={attempt.created_at}
                                userIsOP={currentUser}
                                id={attempt._id}
                                renown={attempt.tier}
                                project={true}
                                estimatedTime={attempt.estimated_tutorial_time_millis}
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
                        {descriptionTab()}
                    </Box>
                </Box>
            </Box>

        )
    }

    const renderCloseConfirmation = () => {
        return (
            <Dialog
                open={confirm}
                onClose={() => setConfirm(false)}
            >
                <div>
                    <DialogTitle>{"Publish This Attempt? Add A Title"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            If you publish this attempt, you will still be able to view your project, but you will no longer be able to make any changes.
                            <hr />
                            If you have already changed the title from the post title and would like to keep that name, please retype it below to confirm.
                        </DialogContentText>
                        <TextField
                            id={"title"}
                            variant={`outlined`}
                            color={"primary"}
                            label={"Title"}
                            required={true}
                            margin={`normal`}
                            type={`text`}
                            sx={{
                                width: "100%"
                            }}
                            value={attemptTitle}
                            onChange={(e) => setAttemptTitle(e.target.value)}
                        />
                    </DialogContent>
                </div>
                <DialogActions>
                    <Button
                        onClick={handleCloseAttempt}
                        color="primary"
                        variant={"outlined"}
                        sx={{
                            '&:hover': {
                                backgroundColor: theme.palette.primary.main + "25",
                            }
                        }}
                    >
                        Confirm
                    </Button>
                    <Button
                        onClick={() => setConfirm(false)}
                        color={"error"}
                        variant={"outlined"}
                        sx={{
                            '&:hover': {
                                backgroundColor: theme.palette.error.main + "25",
                            }
                        }}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    return (
        <>
            {isMobile ? renderMobileAttempt() : renderDesktopAttempt()}
            {/* On mobile add a hovering button to launch the project */}
            {isMobile && renderLaunchButtonMobile()}
            {renderCloseConfirmation()}
        </>
    );
}

export default AttemptPage;