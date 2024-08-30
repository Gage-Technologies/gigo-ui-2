'use client'

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import {
    alpha,
    Box, Button, CircularProgress,
    createTheme,
    CssBaseline,
    Dialog, DialogActions, DialogContent,
    DialogTitle, Grid, IconButton,
    List,
    ListItem,
    ListItemText,
    PaletteMode,
    SpeedDial,
    SpeedDialAction, TextField,
    ThemeProvider,
    Tooltip,
    Typography,
} from "@mui/material";
import { theme } from "@/theme";
import { Add, KeyboardArrowUp, PlayArrow } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@/reducers/hooks";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import call from "@/services/api-call";
import config from "@/config";
import { useParams } from "react-router";
import { useGlobalWebSocket } from "@/services/websocket";
import {
    WsGenericErrorPayload,
    WsMessage,
    WsMessageType,
    WsResponseCode,
    WsValidationErrorPayload
} from "@/models/websocket";
import { Byte, ExecResponsePayload, OutputRow } from "@/models/bytes";
import { programmingLanguages } from "@/services/vars";
import { LoadingButton } from "@mui/lab";
import Editor from "@/components/IDE/Editor";
import chroma from 'chroma-js';
import SheenPlaceholder from "@/components/Loading/SheenPlaceholder";
import { sleep } from "@/services/utils";
import { Extension, ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { TutorialState, initialAuthStateUpdate, selectAuthState, selectAuthStateTutorialState, updateAuthState } from "@/reducers/auth/auth";
import { initialBytesStateUpdate, selectBytesState, updateBytesState } from "@/reducers/bytes/bytes";
import ByteTerminal from "@/components/Terminal";
import './byteMobile.css';
import ByteNextStepMobile from "@/components/CodeTeacher/ByteNextStepMobile";
import HomeIcon from "@mui/icons-material/Home";
import CTIcon from '@/img/codeTeacher/CT-icon-simple.svg';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import ByteChatMobile from "@/components/CodeTeacher/ByteChatMobile";
import NextByteDrawerMobile from "@/components/NextByteDrawerMobile";
import MenuIcon from '@mui/icons-material/Menu';
import PinIcon from '@mui/icons-material/Pin';
import { LaunchLspRequest } from "@/models/launch_lsp";
import {
    CtGenericErrorPayload,
    CtMessage,
    CtMessageOrigin,
    CtMessageType, CtParseFileRequest,
    CtParseFileResponse, CtValidationErrorPayload,
    Node as CtParseNode
} from "@/models/ct_websocket";
import { debounce } from "lodash";
import { useGlobalCtWebSocket } from "@/services/ct_websocket";
import { createCtPopupExtension, CtPopupExtensionEngine } from "@/components/IDE/Extensions/CtPopupExtension";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import LinkIcon from "@mui/icons-material/Link";
import HelpIcon from '@mui/icons-material/Help';
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/system";
import { BugReportOutlined } from "@mui/icons-material";
import { Circle } from "@mui/icons-material";
import ConstructionIcon from '@mui/icons-material/Construction';
import BlockIcon from '@mui/icons-material/Block';
import { setHelpPopupClosedByUser, selectHelpPopupClosedByUser } from '@/reducers/bytes/bytes';
import { CodeFile } from "@/models/code_file";
import { EditorTab, EditorTabs, MobileEditorTab } from "@/components/IDE/EditorTabs";
import JourneyUnit from "@/models/journey_unit";
import ByteNextOutputMessage from "@/components/CodeTeacher/ByteNextOutputMessage";
import ByteDevStepsPlugin from "@/components/ByteDevStepsPlugin";
import JourneyHandoutPlugin from "@/components/JourneyHandoutPlugin";
import BytePortPlugin from "@/components/BytePortPlugin";
import { Workspace } from "@/models/workspace";
import CodeSource from "@/models/codeSource";
import DifficultyAdjuster from "@/components/ByteDifficulty";
import ExploreIcon from "@mui/icons-material/Explore";
import OutOfHeartsMobile from "@/components/OutOfHeartsMobile";
import GoProDisplay from "@/components/GoProDisplay";
import { decrementHeartsState, selectOutOfHearts } from "@/reducers/hearts/hearts";
import HeartTracker from "@/components/HeartTracker";
import { useRouter, useSearchParams } from "next/navigation";
import ProgressionNotification from "../Progressions/ProgressionNotification";
import { decodeToken } from "react-jwt";
import CardTutorial from "../CardTutorial";


interface MergedOutputRow {
    error: boolean;
    content: string;
    timestamp: number;
}

interface OutputState {
    stdout: OutputRow[];
    stderr: OutputRow[];
    merged: string;
    mergedLines: MergedOutputRow[];
}

interface InitialStatusMessage {
    workspace: Workspace;
    code_source: CodeSource;
    workspace_url: string
}

interface LanguageOption {
    name: string;
    extensions: string[];
    languageId: number;
    execSupported: boolean;
    lspSupport: boolean;
}

const languages: LanguageOption[] = [
    { name: 'Go', extensions: ['go'], languageId: 6, execSupported: true, lspSupport: true },
    { name: 'Python', extensions: ['py', 'pytho', 'pyt'], languageId: 5, execSupported: true, lspSupport: true },
    {
        name: 'C++',
        extensions: ['cpp', 'cc', 'cxx', 'hpp', 'c++', 'h'],
        languageId: 8,
        execSupported: true,
        lspSupport: true
    },
    { name: 'HTML', extensions: ['html', 'htm'], languageId: 27, execSupported: false, lspSupport: false },
    { name: 'Java', extensions: ['java'], languageId: 2, execSupported: false, lspSupport: false },
    { name: 'JavaScript', extensions: ['js'], languageId: 3, execSupported: true, lspSupport: true },
    { name: 'JSON', extensions: ['json'], languageId: 1, execSupported: false, lspSupport: false },
    { name: 'Markdown', extensions: ['md'], languageId: 1, execSupported: false, lspSupport: false },
    { name: 'PHP', extensions: ['php'], languageId: 13, execSupported: false, lspSupport: false },
    { name: 'Rust', extensions: ['rs'], languageId: 14, execSupported: true, lspSupport: true },
    { name: 'SQL', extensions: ['sql'], languageId: 34, execSupported: false, lspSupport: false },
    { name: 'XML', extensions: ['xml'], languageId: 1, execSupported: false, lspSupport: false },
    { name: 'LESS', extensions: ['less'], languageId: 1, execSupported: false, lspSupport: false },
    { name: 'SASS', extensions: ['sass', 'scss'], languageId: 1, execSupported: false, lspSupport: false },
    { name: 'Clojure', extensions: ['clj'], languageId: 21, execSupported: false, lspSupport: false },
    { name: 'C#', extensions: ['cs'], languageId: 10, execSupported: true, lspSupport: false },
    { name: 'Shell', extensions: ['bash', 'sh'], languageId: 38, execSupported: true, lspSupport: false },
    { name: 'Toml', extensions: ['toml'], languageId: 14, execSupported: false, lspSupport: false }
];

const mapToLang = (l: string) => {
    l = l.trim()
    for (let i = 0; i < languages.length; i++) {
        if (l.toLowerCase() == languages[i].name.toLowerCase()) {
            return languages[i].name.toLowerCase()
        }

        for (let j = 0; j < languages[i].extensions.length; j++) {
            if (l.toLowerCase() === languages[i].extensions[j]) {
                return languages[i].name.toLowerCase()
            }
        }
    }
    return l
}

const mapToLangId = (l: string) => {
    l = l.trim()
    for (let i = 0; i < languages.length; i++) {
        if (l.toLowerCase() == languages[i].name.toLowerCase()) {
            return languages[i].languageId
        }

        for (let j = 0; j < languages[i].extensions.length; j++) {
            if (l.toLowerCase() === languages[i].extensions[j]) {
                return languages[i].languageId
            }
        }
    }
    return 5
}

const mapToLangMarkdown = (l: string) => {
    l = l.trim()
    for (let i = 0; i < languages.length; i++) {
        if (l.toLowerCase() == languages[i].name.toLowerCase()) {
            return languages[i].extensions[0]
        }

        for (let j = 0; j < languages[i].extensions.length; j++) {
            if (l.toLowerCase() === languages[i].extensions[j]) {
                return languages[i].extensions[0]
            }
        }
    }
    return ""
}

const mapFilePathToLang = (l: string) => {
    let parts = l.trim().split('.');
    l = parts[parts.length - 1];
    if (l === undefined) {
        return ""
    }
    for (let i = 0; i < languages.length; i++) {
        if (l.toLowerCase() == languages[i].name.toLowerCase()) {
            return languages[i].extensions[0]
        }

        for (let j = 0; j < languages[i].extensions.length; j++) {
            if (l.toLowerCase() === languages[i].extensions[j]) {
                return languages[i].extensions[0]
            }
        }
    }
    return l
}

const mapFilePathToLangOption = (l: string): LanguageOption | undefined => {
    let parts = l.trim().split('.');
    l = parts[parts.length - 1];
    if (l === undefined) {
        return undefined
    }
    for (let i = 0; i < languages.length; i++) {
        if (l.toLowerCase() == languages[i].name.toLowerCase()) {
            return languages[i]
        }

        for (let j = 0; j < languages[i].extensions.length; j++) {
            if (l.toLowerCase() === languages[i].extensions[j]) {
                return languages[i]
            }
        }
    }
    return undefined
}

const NextStepsTimeout = 15000; // 15 seconds

interface ByteProps {
    params: {
        id: string
    },
    byte: Byte
}

function ByteMobile({ params, ...props }: ByteProps) {
    const query = useSearchParams()
    const [xpPopup, setXpPopup] = React.useState(false)
    const [xpData, setXpData] = React.useState(null)

    const authState = useAppSelector(selectAuthState);
    const bytesState = useAppSelector(selectBytesState)
    const outOfHearts = useAppSelector(selectOutOfHearts);

    const [terminalVisible, setTerminalVisible] = useState(false);
    const [journeySetupDone, setJourneySetupDone] = useState(false);
    const dispatch = useAppDispatch();

    const tutorialState = useAppSelector(selectAuthStateTutorialState)
    const [runTutorial, setRunTutorial] = React.useState(!tutorialState.bytes && authState.authenticated)
    const [stepIndex, setStepIndex] = React.useState(0)

    let id = params.id;
    const isJourney = query.has('journey')
    const embedded = query.get('embed') === 'true'
    const appToken = query.get('appToken')

    const navigate = useRouter();

    const styles = {
        tutorialHeader: {
            fontSize: "1rem",
        },
        tutorialText: {
            fontSize: "0.7rem",
        }
    };

    // this enables us to push tutorial restarts from the app wrapper down into this page
    useEffect(() => {
        if (tutorialState.bytes === !runTutorial) {
            return
        }
        setRunTutorial(!tutorialState.bytes && authState.authenticated)
    }, [tutorialState])

    const tutorialCallback = async (step: number, reverse: boolean) => {
        setStepIndex(step)
    }

    const closeTutorialCallback = async () => {
        setRunTutorial(false)
        let authState = Object.assign({}, initialAuthStateUpdate)
        // copy the existing state
        let state = Object.assign({}, tutorialState)
        // update the state
        state.bytes = true
        authState.tutorialState = state
        // @ts-ignore
        dispatch(updateAuthState(authState))

        // send api call to backend to mark the challenge tutorial as completed
        await fetch(
            `${config.rootPath}/api/user/markTutorial`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({tutorial_key: "bytes"}),
                credentials: 'include'
            }
        )
    }

    const updateDifficulty = (difficulty: number, reload: boolean = true) => {
        // copy the existing state
        let state = Object.assign({}, initialBytesStateUpdate)
        // update the state
        state.initialized = true
        state.byteDifficulty = difficulty
        dispatch(updateBytesState(state))

        if (reload) {
            const params = new URLSearchParams(query)
            params.set("difficulty", difficultyToString(difficulty))
            navigate.replace(`/byte/${id}?${params.toString()}`)
            navigate.refresh()
        }
    }

    const determineDifficulty = React.useCallback(() => {
        const shouldSetToEasy = isJourney && !journeySetupDone && (!bytesState?.initialized || bytesState?.byteDifficulty !== 0) && !query.has("difficulty");

        if (shouldSetToEasy) {
            updateDifficulty(0, false)
            setJourneySetupDone(true); // Mark the journey setup as completed to prevent re-execution.
            return 0
        }

        if (query.has("difficulty")) {
            let diff = 0
            if (query.get("difficulty") === "medium") {
                diff = 1
            } else if (query.get("difficulty") === "hard") {
                diff = 2
            }

            if (!bytesState?.initialized || bytesState?.byteDifficulty !== diff || (isJourney && !journeySetupDone)) {
                updateDifficulty(diff, false)
            }
            if (isJourney && !journeySetupDone) {
                setJourneySetupDone(true); // Mark the journey setup as completed to prevent re-execution.
            }
            return diff
        }

        if (bytesState?.initialized) {
            return bytesState?.byteDifficulty
        }
        if (authState.tier < 3) {
            return 0
        }
        if (authState.tier < 6) {
            return 1
        }
        return 2
    }, [bytesState?.byteDifficulty, journeySetupDone, bytesState?.initialized])

    const difficultyToString = (difficulty: number): string => {
        if (difficulty === 0) {
            return "easy"
        }
        if (difficulty === 1) {
            return "medium"
        }
        return "hard"
    }

    const containerStyleDefault: React.CSSProperties = {
        width: '100%',
        margin: '0',
        maxWidth: 'none',
        overflowY: "hidden"
    };

    const topContainerStyle: React.CSSProperties = {
        display: 'flex',
        overflowY: "hidden",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        width: '100%',
        height: "18px",
        paddingTop: "4px",
        paddingBottom: "4px",
    };

    const titlePlaceholderContainerStyle: React.CSSProperties = {
        display: "flex",
        padding: theme.spacing(1),
        alignItems: 'center',
        width: "100%",
    };

    const titleStyle: React.CSSProperties = {
        textAlign: 'center',
        width: "100%",
        fontSize: '0.8rem',
        lineHeight: '0px',
    };

    const titlePlaceholderStyle: React.CSSProperties = {
        margin: "auto"
    }

    const fixedElementsHeight = 18;

    const editorAndTerminalStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        height: `calc(100vh - ${fixedElementsHeight}px)`,
        width: "100%",
        minWidth: `100%`,
        alignItems: 'center',
        overflowX: 'auto',
        position: 'relative',
        overflowY: 'hidden',
    };

    const editorStyle: React.CSSProperties = {
        height: '100%',
        width: '100%',
        overflowX: 'auto',
        maxWidth: '100%',
    };

    const helpPopupClosedByUser = useAppSelector(selectHelpPopupClosedByUser);

    const determinedDiff = determineDifficulty()
    let outlineContent = props.byte.files_easy
    if (determinedDiff === 1) {
        outlineContent = props.byte.files_medium
    } else if (determinedDiff === 2) {
        outlineContent = props.byte.files_hard
    }
    let afi = outlineContent.length >= 1 ? 0 : -1;

    // Define the state for your data and loading state
    const [byteData, setByteData] = useState<Byte | null>(props.byte);
    const [recommendedBytes, setRecommendedBytes] = useState(null);
    const [code, setCode] = useState<CodeFile[]>(outlineContent);

    const [output, setOutput] = useState<OutputState | null>(null);

    const [lspActive, setLspActive] = React.useState(false)
    const [containerStyle, setContainerSyle] = useState<React.CSSProperties>(containerStyleDefault)
    const [cursorPosition, setCursorPosition] = useState<{ row: number, column: number } | null>({ row: 0, column: 0 })
    const [codeBeforeCursor, setCodeBeforeCursor] = useState("");
    const [codeAfterCursor, setCodeAfterCursor] = useState(afi >= 0 ? outlineContent[afi].content : "");
    const [outputPopup, setOutputPopup] = useState(false);
    const [byteAttemptId, setByteAttemptId] = useState("");
    const [easyCode, setEasyCode] = useState<CodeFile[]>(props.byte.files_easy);
    const [mediumCode, setMediumCode] = useState<CodeFile[]>(props.byte.files_medium);
    const [hardCode, setHardCode] = useState<CodeFile[]>(props.byte.files_hard);
    const [activeFile, setActiveFile] = useState(afi >= 0 ? outlineContent[afi].file_name : "");
    const [activeFileIdx, setActiveFileIdx] = useState(afi);
    const typingTimerRef = useRef<null | NodeJS.Timeout>(null);
    const syncTimerRef = useRef<null | NodeJS.Timeout>(null);
    const [lastTimeTyped, setLastTimeTyped] = useState<number | null>(null);
    const [suggestionPopup, setSuggestionPopup] = useState(false);
    const [nextStepsPopup, setNextStepsPopup] = useState(false);
    const [commandId, setCommandId] = useState("");
    const [newFilePopup, setNewFilePopup] = React.useState(false);
    const [newFileName, setNewFileName] = React.useState("");
    const [deleteFileRequest, setDeleteFileRequest] = React.useState<string | null>(null);
    const [nodeBelow, setNodeBelow] = React.useState(null)


    const [isDifficultyPopupOpen, setIsDifficultyPopupOpen] = useState(false);
    const [executingCode, setExecutingCode] = useState<boolean>(false)
    const [userHasModified, setUserHasModified] = React.useState(false)
    const [parsedSymbols, setParsedSymbols] = useState<CtParseFileResponse | null>(null)
    const [editorExtensions, setEditorExtensions] = useState<Extension[]>([])
    const popupEngineRef = React.useRef<CtPopupExtensionEngine | null>(null);
    const popupExtRef = React.useRef<Extension | null>(null);
    const [codeActionPortals, setCodeActionPortals] = useState<{ id: string, portal: React.ReactPortal }[]>([])
    const [connectButtonLoading, setConnectButtonLoading] = useState<boolean>(false)



    const pingInterval = React.useRef<NodeJS.Timeout | null>(null)

    const editorContainerRef = React.useRef<HTMLDivElement>(null);
    const editorRef = React.useRef<ReactCodeMirrorRef>(null);
    const [activeView, setActiveView] = useState("editor");
    const [activeSidebarTab, setActiveSidebarTab] = React.useState<string | null>(null);
    const [nextByteDrawerOpen, setNextByteDrawerOpen] = useState(false);
    const [isSpeedDialVisible, setSpeedDialVisibility] = useState(true);
    const [speedDialOpen, setSpeedDialOpen] = useState(false);
    const [workspaceState, setWorkspaceState] = useState<null | number>(null);
    const [activePorts, setActivePorts] = useState<{
        name: string;
        port: string;
        url: string,
        disabled: boolean
    }[]>([]);
    const [workspaceId, setWorkspaceId] = useState<string>('')
    const [helpPopupOpen, setHelpPopupOpen] = useState(false);
    const [shouldShowHelp, setShouldShowHelp] = useState(false);

    const [journeyUnitData, setJourneyUnitData] = useState<JourneyUnit | null>(null);

    const [proPopupOpen, setProPopupOpen] = useState(false)

    const [editorStyles, setEditorStyles] = useState({
        fontSize: '14px',
    });

    let ctWs = useGlobalCtWebSocket();

    let globalWs = useGlobalWebSocket();

    const updateToken = async (appToken: string): Promise<boolean> => {
        let res = await fetch(
            `${config.rootPath}/api/auth/updateToken`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Gigo-Auth-Token": appToken
                },
                body: '{}',
                credentials: 'include'
            }
        ).then(async (res) => await res.json())

        if (res && res["token"]) {
            let auth: {
                [key: string]: any
            } | null = decodeToken(res["token"]);
            if (!auth) {
                return false;
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

            await sleep(500)

            if (typeof window !== "undefined") {
                window.location.reload()
            }

            return true
        }

        return false
    }

    useEffect(() => {
        if (!embedded || appToken === null || appToken === "" || (authState.authenticated && authState.expiration > Date.now() / 1000)) {
            return
        }

        updateToken(appToken)
    }, [embedded, appToken])

    const syncFs = React.useCallback(async (codeOverride?: CodeFile[], deleteFiles?: string[]) => {
        if (id === undefined || id === null || !byteData || !authState.authenticated) {
            return
        }

        let c = code;
        if (codeOverride !== undefined) {
            c = codeOverride;
        }

        const message = {
            sequence_id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            type: WsMessageType.AgentSyncFsRequest,
            payload: {
                code_source_id: byteAttemptId,
                payload: {
                    byte_id: id,
                    difficulty: difficultyToString(determineDifficulty()),
                    files: c.filter(x => x.content !== "This is a binary file").map(x => ({
                        file_name: x.file_name,
                        code: x.content,
                    })),
                    delete_files: deleteFiles ? deleteFiles : [],
                    byte_language: byteData ? byteData.lang : 0,
                }
            }
        };

        // create promise that will be resolved when response is received
        let resolver: (value: boolean) => void;
        const promise: Promise<boolean> = new Promise((resolve) => {
            resolver = resolve;
        });

        globalWs.sendWebsocketMessage(message, (msg: WsMessage<any | WsGenericErrorPayload | WsValidationErrorPayload | WsResponseCode>): boolean => {
            if (msg.type !== WsMessageType.AgentSyncFsResponse) {
                console.log("failed to sync fs: ", msg)
                resolver(false);
                return true
            }
            let newCode: { file_name: string, content: string }[] = [];
            newCode = msg.payload.files.map((x: any) => {
                return { file_name: x.file_name, content: x.code || 'Missing Code' }
            })

            // Find the index of the active file in the new code array
            let newActiveFileIndex = newCode.findIndex(file => file.file_name === activeFile);

            // If the active file exists in the new code array, update its content
            if (newActiveFileIndex !== -1) {
                newCode[newActiveFileIndex] = { file_name: activeFile, content: code[activeFileIdx].content };
            } else {
                // If the active file does not exist, insert it at its prior index or append it if the newCode array is too small
                if (activeFileIdx < newCode.length) {
                    newCode.splice(activeFileIdx, 0, { file_name: activeFile, content: code[activeFileIdx].content });
                    newActiveFileIndex = activeFileIdx;
                } else {
                    newCode.push({ file_name: activeFile, content: code[activeFileIdx].content });
                    newActiveFileIndex = newCode.length - 1;
                }
            }

            // If the active file index has changed, move the file to its original index
            if (newActiveFileIndex !== activeFileIdx && newActiveFileIndex !== -1) {
                const temp = newCode[activeFileIdx];
                newCode[activeFileIdx] = newCode[newActiveFileIndex];
                newCode[newActiveFileIndex] = temp;
            }

            // check if the newCode is different from the old code
            const normalizeCode = (codeArray: CodeFile[]) => {
                return codeArray
                    .map(file => ({ ...file, content: file.content.trim() }))
                    .sort((a, b) => a.file_name.localeCompare(b.file_name));
            };

            const hashContent = (codeArray: CodeFile[]) => {
                return codeArray.reduce((acc, file) => {
                    return acc + file.file_name + file.content;
                }, '');
            };

            const oldCodeNormalized = normalizeCode(code);
            const newCodeNormalized = normalizeCode(newCode);
            const oldCodeHash = hashContent(oldCodeNormalized);
            const newCodeHash = hashContent(newCodeNormalized);

            if (oldCodeHash !== newCodeHash) {
                setCode(newCode)
                debouncedUpdateCode(newCode)
            }
            
            resolver(true);
            return true
        })

        return await promise;
    }, [bytesState?.byteDifficulty, code, id, byteAttemptId, authState.authenticated])

    useEffect(() => {
        setActiveFileIdx(code.findIndex((x: CodeFile) => x.file_name === activeFile));
    }, [activeFile, JSON.stringify(code[activeFileIdx])]);

    const cancelCodeExec = (commandId: string) => {

        const message = {
            sequence_id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            type: WsMessageType.CancelExecRequest,
            payload: {
                code_source_id: byteAttemptId,
                payload: {
                    command_id: commandId,
                }
            }
        };

        globalWs.sendWebsocketMessage(message, null);

        // Set executingCode false to indicate that execution has been stopped
        setExecutingCode(false);
    };

    const stdInExecRequest = (commandId: string, input: string) => {

        const message = {
            sequence_id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            type: WsMessageType.StdinExecRequest,
            payload: {
                code_source_id: byteAttemptId,
                payload: {
                    command_id: commandId,
                    input: input + "\n"
                }
            }
        };

        globalWs.sendWebsocketMessage(message, null);

    };

    const byteWebSocketPing = () => {
        globalWs.sendWebsocketMessage({
            sequence_id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            type: WsMessageType.ByteLivePing,
            payload: {
                byte_attempt_id: byteAttemptId
            }
        }, null);
    };

    const startPing = React.useCallback(() => {
        if (byteAttemptId && pingInterval.current === null) {
            byteWebSocketPing(); // Send the first ping immediately
            pingInterval.current = setInterval(byteWebSocketPing, 60000); // Then start the interval
        }
    }, [byteAttemptId]);

    const stopPing = () => {
        if (pingInterval.current) {
            clearInterval(pingInterval.current);
            pingInterval.current = null;
        }
    };

    useEffect(() => {
        // Add event listeners for focus and blur
        window.addEventListener('focus', startPing);
        window.addEventListener('blur', stopPing);

        // Start ping if tab is already in focus when component mounts
        if (document.hasFocus()) {
            startPing();
        }

        return () => {
            stopPing();
            // Remove event listeners
            window.removeEventListener('focus', startPing);
            window.removeEventListener('blur', stopPing);
        };
    }, [byteAttemptId]);

    useEffect(() => {
        // Collapse the terminal when the difficulty changes
        setTerminalVisible(false);
    }, [bytesState?.byteDifficulty]);

    const [notificationQueue, setNotificationQueue] = useState<any[]>([]);
    const [currentNotification, setCurrentNotification] = useState<any | null>(null);
    const queueRef = useRef(notificationQueue);
    queueRef.current = notificationQueue;

    useEffect(() => {
        if (!currentNotification && notificationQueue.length > 0) {
            setCurrentNotification(notificationQueue[0]);
            setNotificationQueue(queueRef.current.slice(1));
        }
    }, [currentNotification, notificationQueue]);

    const handleNotificationClose = () => {
        setCurrentNotification(null);
    };

    const addNotificationToQueue = (notification: any) => {
        setNotificationQueue((prevQueue) => {
            if (notification.data) {
                return [...prevQueue, { ...notification, id: new Date().getTime() }];
            } else {
                return [{ ...notification, id: new Date().getTime() }, ...prevQueue];
            }
        });
    };


    const checkNumberMastered = async (success: boolean) => {
        if (!success) {
            return;
        }

        let params = {
            byte_id: byteAttemptId,
            difficulty: determineDifficulty(),
        }

        const masteredKey = `mastered_${params.byte_id}_${params.difficulty}`;
        if (localStorage.getItem(masteredKey)) {
            console.log("Byte already mastered, skipping API call");
            return;
        }

        let res = await call(
            "/api/stats/checkNumberMastered",
            "POST",
            null,
            null,
            null,
            // @ts-ignore
            params,
            null,
            config.rootPath
        );

        if (res === undefined || res["mastered"] === undefined) {
            return;
        }

        console.log("Response from mastered: ", res["mastered"]);
        console.log("Response from number mastered: ", res["numFromTable"]);

        if (res["mastered"]) {
            localStorage.setItem(masteredKey, "true");
        }
    }

    const completionFailureRate = async (success: boolean) => {
        if (!success) {
            return;
        }

        let res = await call(
            "/api/stats/completionFailureRate",
            "POST",
            null,
            null,
            null,
            // @ts-ignore
            {},
            null,
            config.rootPath
        );

        if (res === undefined || res["completion_failure_ratio"] === undefined) {
            return;
        }

        console.log("Response from CFR: ", res["completion_failure_ratio"]);
    }

    const checkTenacious = async (byteID: string) => {
        let res = await call(
            "/api/stats/checkTenacious",
            "POST",
            null,
            null,
            null,
            // @ts-ignore
            { byte_attempt_id: byteID },
            null,
            config.rootPath
        );

        if (res === undefined || res["tenacious_count"] === undefined) {
            return;
        }

        addNotificationToQueue({
            progression: 'tenacious',
            achievement: res["newHigh"],
            progress: res["tenacious_count"],
            data: null
        });

        console.log("Response from CFR: ", res["tenacious_count"]);
    }

    const checkHotStreak = async () => {
        let res = await call(
            "/api/stats/checkHotStreak",
            "POST",
            null,
            null,
            null,
            // @ts-ignore
            {},
            null,
            config.rootPath
        );

        if (res === undefined || res["hot_streak"] === undefined) {
            return;
        }

        if (res["streak_"] !== 0) {
            addNotificationToQueue({
                progression: 'hot_streak',
                achievement: res["hot_streak"],
                progress: res["streak_count"],
                data: null
            });
        }
    }

    const checkUnitMastery = async (byteID: string) => {
        let res = await call(
            "/api/stats/checkUnitMastery",
            "POST",
            null,
            null,
            null,
            // @ts-ignore
            { byte_attempt_id: byteID },
            null,
            config.rootPath
        );

        if (res === undefined || res["unit_mastery"] === undefined) {
            return;
        }

        console.log("unit_mastery: ", res);

        if (res["unit_mastery"] === true) {
            addNotificationToQueue({
                progression: 'unit_mastery',
                achievement: res["unit_mastery"],
                progress: "",
                data: null
            });
        }
    }

    const displayCheckedProgressions = async () => {
        checkHotStreak();
        checkTenacious(byteAttemptId);
        if (isJourney) {
            checkUnitMastery(props.byte._id);
        }
    }

    const sendExecRequest = async (retryCount: number = 0) => {
        const message = {
            sequence_id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            type: WsMessageType.AgentExecRequest,
            payload: {
                byte_attempt_id: byteAttemptId,
                payload: {
                    lang: byteData ? byteData.lang : 5,
                    byte_id: id,
                    difficulty: difficultyToString(determineDifficulty()),
                    file_name: activeFile,
                }
            }
        };

        setTerminalVisible(true)
        setOutput({
            stdout: [{ timestamp: Date.now() * 1000, content: "Running..." }],
            stderr: [],
            merged: "Running...",
            mergedLines: [{ timestamp: Date.now() * 1000, content: "Running...", error: false }],
        });
        setExecutingCode(true)
        setCommandId("");

        // sync the files before running the code
        for (let i = 0; i < 5; i++) {
            let ok = await syncFs()
            if (ok) {
                break
            }
            if (i === 4) {
                if (retryCount >= 30) {
                    setOutput({
                        stdout: [],
                        stderr: [{
                            timestamp: Date.now() * 1000,
                            content: "Failed to connect to DevSpace"
                        }],
                        merged: "Failed to connect to DevSpace",
                        mergedLines: [{
                            error: true,
                            timestamp: Date.now() * 1000,
                            content: "Failed to connect to DevSpace",
                        }],
                    })

                    setExecutingCode(false)
                    return true
                }

                // wait 1s and try again
                sleep(1000).then(() => {
                    sendExecRequest(retryCount + 1)
                })
                return
            }
            await sleep(300);
        }
        globalWs.sendWebsocketMessage(
            message,
            (msg: WsMessage<any>): boolean => {
                if (msg.type !== WsMessageType.AgentExecResponse) {
                    if (msg.type === WsMessageType.GenericError) {
                        const payload = msg.payload as WsGenericErrorPayload;

                        if (payload.error === "workspace is not active" || payload.error === "cannot find workspace or workspace agent") {
                            if (retryCount >= 60) {
                                setOutput({
                                    stdout: [],
                                    stderr: [{
                                        timestamp: Date.now() * 1000,
                                        content: "Failed to connect to DevSpace"
                                    }],
                                    merged: "Failed to connect to DevSpace",
                                    mergedLines: [{
                                        error: true,
                                        timestamp: Date.now() * 1000,
                                        content: "Failed to connect to DevSpace",
                                    }],
                                })

                                setExecutingCode(false)
                                setCommandId("")
                                return true
                            }
                            // wait 1s and try again
                            sleep(1000).then(() => {
                                sendExecRequest(retryCount + 1)
                            })
                            return true
                        }

                        if (payload.code === WsResponseCode.WorkspaceDestroyed) {
                            // setWorkspaceId("");
                            // setWorkspaceState(null);

                            // we don't do anything here cause the workspace state watcher is going to handle the
                            // hand-wave of re-running the command on the new workspace
                            return true
                        }

                        if (payload.code === WsResponseCode.ServerError) {

                            setOutput({
                                stdout: [],
                                stderr: [{
                                    timestamp: Date.now() * 1000,
                                    content: "Unexpected Error Occurred: " + payload.error
                                }],
                                merged: "Unexpected Error Occurred: " + payload.error,
                                mergedLines: [{
                                    error: true,
                                    timestamp: Date.now() * 1000,
                                    content: "Unexpected Error Occurred: " + payload.error,
                                }],
                            })

                            setConnectButtonLoading(false)
                            setExecutingCode(false)
                            setCommandId("")
                            return true
                        }
                    }
                    return true;
                }

                const payload = msg.payload as ExecResponsePayload;

                if (payload.command_id_string) {
                    setCommandId(payload.command_id_string);
                }
                const { stdout, stderr, done } = payload;

                // skip the processing if this is the first response
                if (stdout.length === 0 && stderr.length === 0 && !done) {
                    return false;
                }

                // merge all the lines together
                let mergedRows: MergedOutputRow[] = [];
                mergedRows = mergedRows.concat(stdout.map(row => ({
                    content: row.content,
                    error: false,
                    timestamp: row.timestamp
                }))).sort((a, b) => a.timestamp - b.timestamp);
                mergedRows = mergedRows.concat(stderr.map(row => ({
                    content: row.content,
                    error: true,
                    timestamp: row.timestamp
                }))).sort((a, b) => a.timestamp - b.timestamp);

                // sort the lines by timestamp
                mergedRows = mergedRows.sort((a, b) => a.timestamp - b.timestamp);

                // assemble the final output state and set it
                setOutput({
                    stdout: stdout,
                    stderr: stderr,
                    merged: mergedRows.map(row => row.content).join("\n"),
                    mergedLines: mergedRows,
                })

                setExecutingCode(!done)
                if (done && !outputPopup) {
                    setOutputPopup(true)
                    // close the sidebar tab since we need to render the output tab
                    setActiveSidebarTab(null)
                    // sync the fs so any new files are added to the editor
                    syncFs()
                }

                // we only return true here if we are done since true removes this callback
                return done
            }
        );
    };


    const getRecommendedBytes = async () => {
        let recommendedBytes = await call(
            "/api/bytes/getRecommendedBytes",
            "POST",
            null,
            null,
            null,
            // @ts-ignore
            {},
            null,
            config.rootPath
        );

        const [res] = await Promise.all([recommendedBytes]);

        if (res === undefined) {
            swal("Server Error", "Cannot fetch recommended bytes. Please try again later.");
            return;
        }

        if (res["rec_bytes"] === undefined) {
            swal("Server Error", "Cannot fetch recommended bytes. Please try again later.");
            return;
        }

        if (res["rec_bytes"]) {
            const enhancedBytes = res["rec_bytes"].map((byte: any) => ({
                ...byte,
                id: byte._id,
                completedEasy: byte["completed_easy"],
                completedMedium: byte["completed_medium"],
                completedHard: byte["completed_hard"],
                language: programmingLanguages[byte.lang]
            }));
            setRecommendedBytes(enhancedBytes);
        } else {
            swal("No Bytes Found", "No recommended bytes found.");
        }
    };

    const startByteAttempt = async (byteId: string) => {
        try {
            const response = await call(
                "/api/bytes/startByteAttempt",
                "POST",
                null,
                null,
                null,
                // @ts-ignore
                { byte_id: byteId },
                null,
                config.rootPath
            );

            const [res] = await Promise.all([response]);

            if (res === undefined) {
                swal("Server Error", "Cannot fetch byte data. Please try again later.");
                return;
            }

            if (res["byte_attempt"] !== undefined) {
                setEasyCode(res["byte_attempt"]["files_easy"])
                setMediumCode(res["byte_attempt"]["files_medium"])
                setHardCode(res["byte_attempt"]["files_hard"])
                setCode(res["byte_attempt"][`files_${difficultyToString(determineDifficulty())}`]);
                let afi = res["byte_attempt"][`files_${difficultyToString(determineDifficulty())}`].length >= 1 ? 0 : -1;
                setActiveFileIdx(afi)
                setActiveFile(afi >= 0 ? res["byte_attempt"][`files_${difficultyToString(determineDifficulty())}`][afi].file_name : "")
                setByteAttemptId(res["byte_attempt"]["_id"]);
            }
        } catch (error) {
            swal("Error", "An error occurred while fetching the byte attempt data.");
        }
    };

    const createWorkspace = async (byteId: string): Promise<boolean> => {
        try {
            const response = await call(
                "/api/bytes/createWorkspace",
                "POST",
                null,
                null,
                null,
                // @ts-ignore
                { byte_id: byteId },
                null,
                config.rootPath
            );

            const [res] = await Promise.all([response]);

            if (res === undefined) {
                swal("Server Error", "Cannot fetch byte data. Please try again later.");
                return false;
            }

            if (res["message"] === "Workspace Created Successfully") {
                let workspace = res["workspace"]
                if (workspace["_id"] !== workspaceId) {
                    setWorkspaceId(workspace["_id"])
                    setWorkspaceState(workspace["state"])
                    if (workspace["ports"]) {
                        setActivePorts(workspace["ports"])
                    }
                }
                return true
            }
        } catch (error) {
            swal("Error", "An error occurred while creating the byte workspace.");
        }
        return false
    };

    const markComplete = async () => {
        let params = {
            byte_id: byteAttemptId,
            difficulty: difficultyToString(determineDifficulty()),
        }
        const isJourneyVersion = query.has('journey');

        if (isJourneyVersion) {
            //@ts-ignore
            params["journey"] = true
        }
        let res = await call(
            "/api/bytes/setCompleted",
            "POST",
            null,
            null,
            null,
            // @ts-ignore
            params,
            null,
            config.rootPath
        );

        if (res === undefined) {
            swal("Server Error", "Cannot complete byte. Please try again later.");
            return;
        }

        if (res["success"] !== true) {
            swal("Server Error", "Cannot complete byte. Please try again later.");
            return;
        }

        if (res["xp"] !== undefined) {
            addNotificationToQueue({
                progression: '',
                achievement: '',
                progress: '',
                data: res["xp"]
            });
        }

        if (res["nodeBelow"] !== undefined && res["nodeBelow"] !== null) {
            setNodeBelow(res["nodeBelow"])
        }
    }

    const recordByteAttemptCheck = React.useCallback(
        debounce(async (success: boolean) => {
            let params = {
                byte_id: byteAttemptId,
                difficulty: determineDifficulty(),
                successful: success
            }

            let res = await fetch(
                `${config.rootPath}/api/bytes/addFailedByteAttemptCheck`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(params),
                    credentials: 'include'
                }
            ).then(res => res.json());

            if (res === undefined || res["decrement"] === undefined) {
                return;
            }

            if (authState.role === 0 && res["decrement"]) {
                dispatch(decrementHeartsState())
            }
        }, 300),
        [byteAttemptId, determineDifficulty, authState.role, dispatch]
    );

    // Function to fetch the journey unit metadata
    const getJourneyUnit = async (byteId: string): Promise<any | null> => {
        try {
            const response = await call("/api/journey/getUnitFromTask",
                "POST",
                null,
                null,
                null,
                // @ts-ignore
                { task_id: byteId },
                null,
                config.rootPath);
            const [res] = await Promise.all([response]);

            if (res && res["unit"]) {
                setJourneyUnitData(res["unit"])
                return res["unit"]
            } else {
                swal("Journey Unit Not Found", "Looks like we got lost on our Journey! Try returning to the main Journey page.");
            }
        } catch (error) {
            swal(
                "Oops! We hit a bump in the road!",
                "On every journey, there are some unexpected bumps. Looks like we hit one today. We'll start working on a fix, and you start working on your skills!"
            );
        }
        return null
    };

    const checkShouldHelp = async () => {
        if (authState.authenticated === false) {

            if (!helpPopupClosedByUser) {
                setHelpPopupOpen(true);
            }
        }

        let help = await call(
            "/api/bytes/checkHelpMobile",
            "POST",
            null,
            null,
            null,
            // @ts-ignore
            {},
            null,
            config.rootPath
        );

        const [res] = await Promise.all([help]);

        if (res === undefined) {
            return;
        }

        if (res["byte_help_mobile"] === undefined) {
            setShouldShowHelp(false);
            return;
        }

        if (res["byte_help_mobile"] === true) {
            setShouldShowHelp(true);
            setHelpPopupOpen(true);
        } else {
            setShouldShowHelp(false);
        }
    };

    const disableHelp = async () => {
        if (authState.authenticated === false) {
            return;
        }

        let help = await call(
            "/api/bytes/disableHelpMobile",
            "POST",
            null,
            null,
            null,
            // @ts-ignore
            {},
            null,
            config.rootPath
        );

        const [res] = await Promise.all([help]);

        if (res === undefined) {
            return;
        }

        if (res["message"] !== undefined) {
            setShouldShowHelp(false)
            return;
        }
    };

    useEffect(() => {
        if (authState.authenticated) {
            checkShouldHelp()
        }
    }, [authState.authenticated]);

    useEffect(() => {
        if (id === undefined || byteData === null) {
            return
        }

        setOutput(null);
        setExecutingCode(false);
        setTerminalVisible(false);
        setUserHasModified(false);
        setWorkspaceId("");
        setWorkspaceState(null);
        setActivePorts([]);
        setLspActive(false);
        getRecommendedBytes()
        if (authState.authenticated && id && byteData !== null) {
            startByteAttempt(id).then(async () => {
                // auto connect to the workspace if this is a journey task
                if (isJourney && !outOfHearts) {
                    for (let i = 0; i < 5; i++) {
                        let created = await createWorkspace(byteData._id);
                        if (created) {
                            break
                        }

                        if (i === 4) {
                            break
                        }
                    }
                }
            });
        }
        if (isJourney && authState.authenticated) {
            getJourneyUnit(id).then((u: JourneyUnit | null) => {
                // if (u !== null && !bytesState.handoutClosedByUser) {
                //     setActiveSidebarTab("journeyHandout")
                // }
            })
        }
    }, [id, authState.authenticated]);

    useEffect(() => {
        const handleResize = () => {
            setEditorStyles({
                fontSize: '12px',
            });
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        // Cleanup event listener on unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        return () => {
            if (typingTimerRef.current !== null) {
                clearTimeout(typingTimerRef.current);
            }
            if (syncTimerRef.current !== null) {
                clearInterval(syncTimerRef.current);
            }
        };
    }, []);

    const clearTypingTimers = () => {
        if (typingTimerRef.current) {
            clearTimeout(typingTimerRef.current);
        }
        if (syncTimerRef.current) {
            clearInterval(syncTimerRef.current);
        }
    }

    const startTypingTimer = React.useCallback(() => {
        setNextStepsPopup(false)
        setLastTimeTyped(Date.now());
        if (typingTimerRef.current) {
            clearTimeout(typingTimerRef.current);
        }
        if (syncTimerRef.current) {
            clearInterval(syncTimerRef.current);
        }
        typingTimerRef.current = setTimeout(() => {
            setSuggestionPopup(true);
            setNextStepsPopup(true);
        }, 15000);
        syncTimerRef.current = setTimeout(() => {
            syncFs()
        }, 1000);
    }, [syncFs])

    useEffect(() => {
        switch (bytesState?.byteDifficulty) {
            case 0:
                setCode(easyCode);
                setActiveFile(easyCode.length > 0 ? easyCode[0].file_name : "")
                setActiveFileIdx(easyCode.length > 0 ? 0 : -1)
                break
            case 1:
                setCode(mediumCode);
                setActiveFile(mediumCode.length > 0 ? mediumCode[0].file_name : "")
                setActiveFileIdx(mediumCode.length > 0 ? 0 : -1)
                break
            case 2:
                setCode(hardCode);
                setActiveFile(hardCode.length > 0 ? hardCode[0].file_name : "")
                setActiveFileIdx(hardCode.length > 0 ? 0 : -1)
                break
        }
        clearTypingTimers()
    }, [bytesState?.byteDifficulty])

    useEffect(() => {
        if (workspaceId === "") {
            return
        }

        globalWs.registerCallback(WsMessageType.WorkspaceStatusUpdate, `workspace:status:${workspaceId}`,
            async (msg: WsMessage<any>) => {
                if (msg.type !== WsMessageType.WorkspaceStatusUpdate) {
                    return
                }

                // attempt to parse json message
                let jsonMessage: Object | null = null
                try {
                    jsonMessage = msg.payload;
                } catch (e) {
                    return
                }

                if (jsonMessage === null) {
                    return
                }

                // handle initial state message
                let payload = jsonMessage as InitialStatusMessage;
                let workspace = payload.workspace as Workspace

                // handle a stopped, destroyed, or failed workspace
                if (workspace.state > 1) {

                    // if we're executing code re-trigger so the user doesn't notice their workspace died
                    if (executingCode && byteData) {
                        executeCode()
                    } else {
                        // disconnect the workspace
                        setWorkspaceId("")
                        setWorkspaceState(null)
                        setActivePorts([])
                    }
                }

                if (workspaceId !== workspace._id) {
                    setWorkspaceId(workspace._id)
                }
                setWorkspaceState(workspace.state)
                setActivePorts(workspace.ports ? workspace.ports : [])
            },
        );

        // generate a random alphanumeric id
        let seqId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        globalWs.sendWebsocketMessage({
            sequence_id: seqId,
            type: WsMessageType.SubscribeWorkspace,
            payload: {
                workspace_id: workspaceId,
            }
        }, null)

        return () => {
            globalWs.sendWebsocketMessage({
                sequence_id: seqId,
                type: WsMessageType.UnsubscribeWorkspace,
                payload: {
                    workspace_id: workspaceId,
                }
            }, null)
        }
    }, [workspaceId])

    useEffect(() => {
        if (popupEngineRef.current !== null) {
            return
        }
        let { ext, engine } = createCtPopupExtension();
        popupExtRef.current = ext;
        popupEngineRef.current = engine;
    }, [])

    const debouncedUpdateCode = React.useCallback(debounce((newCode: CodeFile[]) => {
        console.log("debouncedUpdateCode: ", newCode)
        globalWs.sendWebsocketMessage({
            sequence_id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            type: WsMessageType.ByteUpdateCode,
            payload: {
                byte_attempt_id: byteAttemptId,
                files: newCode.filter(x => x.content !== "This is a binary file"),
                content_difficulty: bytesState ? bytesState.byteDifficulty : 0
            }
        }, null);
    }, 1000, {
        trailing: true
    }), [globalWs, byteAttemptId, bytesState?.byteDifficulty]);

    const parseSymbols = React.useCallback((newCode: string) => {
        if (byteData === null) {
            return
        }
        console.log("parseSymbols called ")
        ctWs.sendWebsocketMessage(
            {
                sequence_id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
                type: CtMessageType.WebSocketMessageTypeParseFileRequest,
                origin: CtMessageOrigin.WebSocketMessageOriginClient,
                created_at: Date.now(),
                payload: {
                    relative_path: "main." + (byteData.lang === 5 ? "py" : "go"),
                    content: newCode,
                }
            } satisfies CtMessage<CtParseFileRequest>,
            (msg: CtMessage<CtGenericErrorPayload | CtValidationErrorPayload | CtParseFileResponse>): boolean => {
                if (msg.type !== CtMessageType.WebSocketMessageTypeParseFileResponse) {
                    console.log("failed to parse file: ", msg)
                    return true
                }
                setParsedSymbols(msg.payload as CtParseFileResponse)
                return true
            }
        )
    }, [byteData])

    const debouncedParseSymbols = React.useCallback(debounce(parseSymbols, 3000, {
        trailing: true
    }), [parseSymbols]);

    useEffect(() => {
        if (activeFileIdx < 0 || code[activeFileIdx] === undefined) {
            return
        }
        setParsedSymbols(null)
        debouncedParseSymbols(code[activeFileIdx].content)
    }, [JSON.stringify(code[activeFileIdx]), activeFileIdx]);

    // Handle changes in the editor and activate the button
    const handleEditorChange = async (newCode: string) => {
        const updateFunc = (prevState: CodeFile[]) => {
            let idx = prevState.findIndex((x) => x.file_name === activeFile);
            if (idx !== -1) {
                prevState[idx].content = newCode;
            }
            return prevState
        }

        debouncedUpdateCode(updateFunc(code));

        // Update the code state with the new content
        setCode(updateFunc);
        switch (bytesState?.byteDifficulty) {
            case 0:
                setEasyCode(updateFunc);
                break
            case 1:
                setMediumCode(updateFunc);
                break
            case 2:
                setHardCode(updateFunc)
                break
        }
        startTypingTimer();

        if (!userHasModified) {
            setUserHasModified(true)
            if (byteData) {
                for (let i = 0; i < 5; i++) {
                    let created = await createWorkspace(byteData._id);
                    if (created) {
                        break
                    }

                    if (i === 4) {
                        break
                    }
                }
            }
        }
    };

    // Add a function to handle closing the terminal
    const handleCloseTerminal = () => {
        setTerminalVisible(false);
    };

    const deleteTypingTimer = () => {
        if (typingTimerRef.current) {
            clearTimeout(typingTimerRef.current);
            typingTimerRef.current = null;
        }
    };

    const firstRenderRef = useRef(true);
    const buttonClickedRef = useRef(false);

    const executeCode = async () => {

        if (suggestionPopup) {
            setSuggestionPopup(false)
            if (activeSidebarTab === null || activeSidebarTab !== "nextSteps") {
                setNextStepsPopup(true)
            }
        }
        if (outputPopup) {
            return;
        }
        if (byteData) {
            for (let i = 0; i < 5; i++) {
                let created = await createWorkspace(byteData._id);
                if (created) {
                    break
                }
                if (i === 4) {
                    setOutput({
                        stdout: [],
                        stderr: [{
                            timestamp: Date.now() * 1000,
                            content: "Failed to create DevSpace"
                        }],
                        merged: "Failed to create DevSpace",
                        mergedLines: [{
                            error: true,
                            timestamp: Date.now() * 1000,
                            content: "Failed to create DevSpace",
                        }],
                    })
                }
            }
        }
        deleteTypingTimer();
        sendExecRequest();
    };

    useEffect(() => {
        if (firstRenderRef.current) {
            firstRenderRef.current = false; // Set it to false on the first render
            return; // Skip the rest of the useEffect on the first render
        }
        if (!outputPopup && buttonClickedRef.current) {
            buttonClickedRef.current = false;
            if (!authState.authenticated) {
                navigate.push("/signup?forward=" + encodeURIComponent(window.location.pathname))
                return
            }
            executeCode();
        }
        buttonClickedRef.current = false;
    }, [outputPopup]);

    useEffect(() => {
        if (activeFileIdx < 0 || code[activeFileIdx] === undefined) {
            return
        }

        const lines = code[activeFileIdx].content.split("\n");

        // detect if any lines extend beyond 80 chars
        if (cursorPosition === null) {
            return
        }
        if (lines[cursorPosition.row] === undefined) {
            return
        }
        let preffix = lines.filter((x, i) => i < cursorPosition.row).join("\n") + lines[cursorPosition.row].slice(0, cursorPosition.column)
        let suffix = lines[cursorPosition.row].slice(cursorPosition.column, lines[cursorPosition.row].length) + lines.filter((x, i) => i > cursorPosition.row).join("\n")
        setCodeBeforeCursor(preffix)
        setCodeAfterCursor(suffix)
    }, [JSON.stringify(code[activeFileIdx]), cursorPosition])

    useEffect(() => {
        if (byteData === null) {
            setContainerSyle(containerStyleDefault);
            return;
        }

        if (containerStyle.background !== undefined)
            return;

        let s: React.CSSProperties = JSON.parse(JSON.stringify(containerStyleDefault));
        let color1 = chroma(byteData.color).alpha(0.5).css(); // 60% opacity
        let color2 = chroma(byteData.color).alpha(0.3).css(); // 30% opacity
        let color3 = chroma(byteData.color).alpha(0.1).css(); // 10% opacity

        s.background = `linear-gradient(to bottom, ${color1} 0%, ${color2} 20%, ${color3} 40%, transparent 70%)`;
        setContainerSyle(s);
    }, [byteData]);

    const getNextByte = () => {
        if (recommendedBytes === null) {
            return undefined
        }
        // attempt to locate the current bytes position in the list of recommendations
        // @ts-ignore
        let idx = recommendedBytes.findIndex(x => x._id == byteData?._id)
        if (idx === undefined) {
            idx = -1
        }

        // find the first byte that is later than the index with the same language
        // @ts-ignore
        let byte = recommendedBytes.find((x, i) => i > idx && x.lang === byteData?.lang)
        if (byte) {
            return byte
        }

        // retrieve the first index from the list that is the same language
        // @ts-ignore
        byte = recommendedBytes.find((x, i) => x.lang === byteData?.lang)
        if (byte) {
            return byte
        }

        // fallback on the first byte
        return recommendedBytes[0]
    }

    const handleNextByte = () => {
        const nextByte = getNextByte();
        if (nextByte) {
            navigate.push(`/byte/${nextByte._id}?${query.toString()}`);
            setNextByteDrawerOpen(false);
        }
    };

    const currentDifficulty = determineDifficulty();

    interface DifficultyPopupProps {
        open: boolean;
        onClose: () => void;
        onSelectDifficulty: (difficulty: number) => void;
        currentDifficulty: number;
    }

    const DifficultyPopup: React.FC<DifficultyPopupProps> = ({
        open,
        onClose,
        onSelectDifficulty,
        currentDifficulty }) => {
        const difficulties = ['Easy', 'Medium', 'Hard'];

        return (
            <Dialog onClose={onClose} open={open}>
                <DialogTitle>Select Difficulty</DialogTitle>
                <List>
                    {difficulties.map((difficulty, index) => (
                        <ListItem
                            button
                            onClick={() => onSelectDifficulty(index)}
                            key={difficulty}
                            selected={index === currentDifficulty}
                            sx={{ backgroundColor: index === currentDifficulty ? 'action.selected' : null }}
                        >
                            <ListItemText
                                primary={
                                    <Typography variant="body1" style={{ textAlign: 'center' }}>
                                        {difficulty}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            </Dialog>
        );
    };

    const getFilteredActions = () => {
        const allActions = [
            {
                icon: <HomeIcon />,
                name: 'Home',
                action: () => window.location.assign('/home')
            },
            {
                icon: <ExploreIcon />,
                name: 'Start Your Journey',
                action: () => navigate.push('/journey')
            },
            {
                icon: <HelpIcon />,
                name: 'Help',
                action: () => setHelpPopupOpen(true),
            },
        ];

        if (!isJourney) {
            allActions.push({
                icon: <PinIcon />,
                name: 'Difficulty',
                action: () => setIsDifficultyPopupOpen(true),
            },)
        }

        // Filter actions based on the current view
        return allActions
    };

    useEffect(() => {
        if (workspaceState !== 1) {
            return
        }

        if (lspActive) {
            return
        }

        let lang = mapFilePathToLangOption(code[activeFileIdx].file_name)
        if (lang === undefined || !lang.lspSupport) {
            return
        }

        if (byteData) {
            launchLsp()
        }
    }, [workspaceState, activeFileIdx, lspActive])

    const launchLsp = async () => {
        if (!id || !byteData || activeFileIdx < 0 || code[activeFileIdx] === undefined) {
            return
        }

        globalWs.sendWebsocketMessage(
            {
                sequence_id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
                type: WsMessageType.LaunchLspRequest,
                payload: {
                    code_source_id: byteAttemptId,
                    payload: {
                        lang: byteData.lang,
                        content: code[activeFileIdx].content,
                        file_name: code[activeFileIdx].file_name,
                        byte_id: id,
                        difficulty: difficultyToString(determineDifficulty()),
                    } satisfies LaunchLspRequest
                }
            }, (msg: WsMessage<any>): boolean => {
                if (msg.type !== WsMessageType.LaunchLspResponse) {
                    console.log("failed to start lsp: ", msg)
                    setTimeout(() => {
                        launchLsp()
                    }, 1000);
                    return true
                }
                // wait 1s to link the lsp to ensure the startup completes
                setTimeout(() => {
                    setLspActive(true)
                }, 1000);
                return true
            }
        )
    }

    const renderStateIndicator = () => {
        let actionButton;

        const connectAction = async () => {
            if (byteData && !connectButtonLoading) {
                setConnectButtonLoading(true);
                let connectionEstablished = false;
                for (let i = 0; i < 5 && !connectionEstablished; i++) {
                    const created = await createWorkspace(byteData._id);
                    if (created) {
                        connectionEstablished = true;
                        setWorkspaceState(1); // Assuming 1 means connected
                        break;
                    }
                }
                if (!connectionEstablished) {
                    // Handle the case where connection could not be established after retries
                    setWorkspaceState(0); // Assuming 0 means disconnected
                }
                setConnectButtonLoading(false);
            }
        };

        // Use a function to dynamically generate the tooltip title based on the state
        const generateTooltipTitle = () => {
            if (workspaceState === 0 || workspaceState === null) {
                return "Disconnected From DevSpace. Click to connect.";
            } else if (workspaceState === 1) {
                return "Connected To DevSpace";
            } else {
                return "Connecting To DevSpace";
            }
        };

        if (workspaceState === null || workspaceState === 0) {
            actionButton = (
                <Tooltip title={<Typography variant='caption'>{generateTooltipTitle()}</Typography>}>
                    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={connectAction}>
                        <LinkOffIcon sx={{ color: theme.palette.error.main }} />
                        {connectButtonLoading && <CircularProgress size={24} sx={{ color: theme.palette.error.main, ml: 1 }} />}
                    </Box>
                </Tooltip>
            );
        } else if (workspaceState === 1) {
            actionButton = (
                <Tooltip title={generateTooltipTitle()}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LinkIcon sx={{ color: theme.palette.success.main }} />
                    </Box>
                </Tooltip>
            );
        } else {
            actionButton = (
                <Tooltip title={generateTooltipTitle()}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CircularProgress size={24} sx={{ color: alpha(theme.palette.text.primary, 0.6) }} />
                    </Box>
                </Tooltip>
            );
        }

        return actionButton;
    };

    const selectDiagnosticLevel = React.useCallback((): "hint" | "info" | "warning" | "error" => {
        switch (bytesState?.byteDifficulty) {
            case 0:
                return "error"
            case 1:
                return "warning"
            case 2:
                return "hint"
        }
        return "hint"
    }, [bytesState?.byteDifficulty])

    const renderNewFilePopup = () => {
        return (
            <Dialog open={newFilePopup} maxWidth={'sm'} onClose={() => setNewFilePopup(false)}>
                <DialogTitle>Create New File</DialogTitle>
                <DialogContent>
                    <TextField
                        placeholder={"File Name"}
                        value={newFileName}
                        onChange={(event) => {
                            setNewFileName(event.target.value)
                        }}
                        onKeyDown={(e) => {
                            if (e.code == "Enter") {
                                e.preventDefault()
                                e.stopPropagation()
                                setCode(prev => {
                                    let newCode = prev.concat({
                                        file_name: newFileName,
                                        content: "",
                                    })
                                    syncFs(newCode)
                                    debouncedUpdateCode(newCode)
                                    return newCode
                                })
                                setActiveFile(newFileName)
                                setNewFilePopup(false)
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        color={"error"}
                        variant={"outlined"}
                        onClick={() => {
                            setNewFilePopup(false)
                            setNewFileName("")
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        color={"success"}
                        variant={"outlined"}
                        disabled={newFileName === ""}
                        onClick={() => {
                            setCode(prev => {
                                let newCode = prev.concat({
                                    file_name: newFileName,
                                    content: "",
                                })
                                syncFs(newCode)
                                debouncedUpdateCode(newCode)
                                return newCode
                            })
                            setActiveFile(newFileName)
                            setNewFilePopup(false)
                        }}
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    const renderDeleteFilePopup = () => {
        return (
            <Dialog open={deleteFileRequest !== null} maxWidth={'sm'} onClose={() => setDeleteFileRequest(null)}>
                <DialogTitle>Delete File</DialogTitle>
                <DialogContent>
                    <Typography variant={"body2"}>
                        Are you sure you want to delete the file <b>{deleteFileRequest}</b>?
                        <br />
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        color={"inherit"}
                        variant={"outlined"}
                        onClick={() => {
                            setDeleteFileRequest(null)
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        color={"error"}
                        variant={"outlined"}
                        onClick={() => {
                            if (activeFile === deleteFileRequest) {
                                if (code.length === 1) {
                                    setActiveFile("")
                                    setActiveFileIdx(-1)
                                } else {
                                    setActiveFile(code.filter((f) => f.file_name !== deleteFileRequest)[0].file_name)
                                }
                            }
                            setCode(prev => {
                                let newCode = prev.filter((f) => f.file_name !== deleteFileRequest)
                                syncFs(newCode, deleteFileRequest !== null ? [deleteFileRequest] : undefined)
                                debouncedUpdateCode(newCode)
                                return newCode
                            })
                            setDeleteFileRequest(null)
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    const WaitingButton = styled(Button)`
        animation: nextStepsButtonAuraEffect 2s infinite alternate;
        padding: 8px;
        min-width: 0px;

        @keyframes nextStepsButtonAuraEffect {
            0% {
                box-shadow: 0 0 3px #84E8A2, 0 0 6px #84E8A2;
                color: #84E8A2;
                border: 1px solid #84E8A2;
            }
            20% {
                box-shadow: 0 0 3px #29C18C, 0 0 6px #29C18C;
                color: #29C18C;
                border: 1px solid #29C18C;
            }
            40% {
                box-shadow: 0 0 3px #1C8762, 0 0 6px #1C8762;
                color: #1C8762;
                border: 1px solid #1C8762;
            }
            60% {
                box-shadow: 0 0 3px #2A63AC, 0 0 6px #2A63AC;
                color: #2A63AC;
                border: 1px solid #2A63AC;
            }
            80% {
                box-shadow: 0 0 3px #3D8EF7, 0 0 6px #3D8EF7;
                color: #3D8EF7;
                border: 1px solid #3D8EF7;
            }
            100% {
                box-shadow: 0 0 3px #63A4F8, 0 0 6px #63A4F8;
                color: #63A4F8;
                border: 1px solid #63A4F8;
            }
        }
    `;

    const handleCloseHelpPopup = () => {
        if (authState.authenticated === true) {
            return;
        }
        dispatch(setHelpPopupClosedByUser(true));
        setHelpPopupOpen(false);
    };

    const helpPopup = () => {
        return (
            <Dialog
                fullScreen
                open={helpPopupOpen}
                onClose={() => setHelpPopupOpen(false)}
                aria-labelledby="help-popup-title"
            >
                <DialogTitle id="help-popup-title">
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={async () => {
                            await disableHelp();
                            setHelpPopupOpen(false);
                            handleCloseHelpPopup()
                        }}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    Whats going on?
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h5" gutterBottom>
                                GIGO Bytes
                            </Typography>
                            <Typography>
                                This experience can be a little confusing on mobile, but this short guide will have you improving your programming skills shortly.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Typography variant="h5" gutterBottom>
                                    Byte Chat
                                </Typography>
                                <img alt="CT" src={CTIcon} style={{ width: 42, height: 42, marginBottom: "3%" }} />
                            </Box>
                            <Typography>
                                Byte Chat is your guide through the coding challenge, providing the task to be completed. Upon dropping into a Byte, you should first check out the Byte Chat to understand the task. Ask Byte Chat any questions you have!
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Typography variant="h5" gutterBottom display="inline">
                                    Editor
                                </Typography>
                                <DeveloperModeIcon style={{ width: 42, height: 42, marginBottom: "3%" }} />
                            </Box>
                            <Typography>
                                You were initially dropped inside of our AI powered Code Editor. The editor will come with some basic code to get you started. You will see a number of important AI powered tools that will help you on your coding journey.
                            </Typography>
                        </Grid>
                        {/* Debug Section */}
                        <Grid item xs={12} md={6}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Typography variant="h5">
                                    Debug
                                </Typography>
                                <BugReportOutlined style={{ width: 42, height: 42, marginBottom: "1%" }} />
                            </Box>
                            <Typography>
                                Encounter an error? Use the debug feature to automatically identify and help you correct mistakes.
                                Debug will automatically pop up if Code Teacher detects any errors after your code runs. You can open the Debug menu after closing it by pressing the bug icon.
                            </Typography>
                        </Grid>
                        {/* Next Steps Section */}
                        <Grid item xs={12} md={6}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Typography variant="h5">
                                    Next Steps
                                </Typography>
                                <WaitingButton
                                    sx={{
                                        height: "30px",
                                        width: "30px",
                                        minWidth: "24px",
                                        marginRight: "25px"
                                    }}
                                    variant="outlined"
                                >
                                    <Circle style={{ fontSize: "12px" }} />
                                </WaitingButton>
                            </Box>
                            <Typography>
                                Not sure what to do next? Code Teacher will automatically detect when you have been idle for a certain amount of time and will provide you with AI-powered hints to tackle the next step.
                            </Typography>
                        </Grid>
                        {/* Code Improvement Section */}
                        <Grid item xs={12} md={6}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Typography variant="h5">
                                    Code Improvement
                                </Typography>
                                <ConstructionIcon style={{ width: 36, height: 36, marginBottom: "1%" }} />
                            </Box>
                            <Typography>
                                Once you are connected to the workspace, a Clean Up Code option will be available. Code teacher will analyze your code and suggest improvements
                            </Typography>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        )
    };

    const portPluginMemo = React.useMemo(() => (
        <BytePortPlugin
            ports={activePorts}
            onExpand={() => setActiveSidebarTab("activePorts")}
            onHide={() => setActiveSidebarTab(null)}
            maxWidth={"100%"}
            mobile={true}
        />
    ), [activePorts])

    const [triggered, setTriggered] = useState(false);

    const renderSidebar = () => {
        let stateTooltipTitle: string | React.ReactElement = (
            <Box>
                <Typography variant='caption'>Disconnected From DevSpace</Typography>
                <LoadingButton
                    loading={connectButtonLoading}
                    variant={"outlined"}
                    sx={{
                        fontSize: "10px",
                        height: "18px",
                        m: 0.5
                    }}
                    onClick={async () => {
                        if (byteData) {
                            setConnectButtonLoading(true)
                            for (let i = 0; i < 5; i++) {
                                let created = await createWorkspace(byteData._id);
                                if (created) {
                                    break
                                }

                                if (i === 4) {
                                    break
                                }
                            }
                            setConnectButtonLoading(false)
                        }
                    }}
                >
                    Connect
                </LoadingButton>
            </Box>
        )
        let stateIcon = (<LinkOffIcon sx={{ color: alpha(theme.palette.text.primary, 0.6), fontSize: "24px" }} />)
        if (workspaceState !== null) {
            if (workspaceState === 1) {
                stateTooltipTitle = "Connected To DevSpace"
                stateIcon = (<LinkIcon sx={{ color: theme.palette.success.main, fontSize: "24px" }} />)
            } else if (workspaceState === 0) {
                stateTooltipTitle = "Connecting To DevSpace"
                stateIcon = (<CircularProgress size={24} sx={{ color: alpha(theme.palette.text.primary, 0.6) }} />)
            }
        }

        return (
            <Box
                id="editor-sidebar"
                display={"flex"}
                flexDirection={"column"}
                sx={{
                    position: "relative",
                    width: activeSidebarTab === null ? "36px" : "100%",
                    padding: "0px",
                    gap: "10px",
                    height: "calc(100% - 16px)",
                    paddingLeft: activeSidebarTab === null ? "3px" : "0px",
                    paddingTop: "3px"
                }}
            >
                {(activeSidebarTab === null || activeSidebarTab === "nextSteps") && activeFileIdx >= 0 && code[activeFileIdx] && (
                    <ByteNextStepMobile
                        trigger={nextStepsPopup}
                        acceptedCallback={() => {
                            setNextStepsPopup(false)
                        }}
                        onExpand={() => setActiveSidebarTab("nextSteps")}
                        onHide={() => setActiveSidebarTab(null)}
                        currentCode={code[activeFileIdx].content}
                        maxWidth="100%"
                        bytesID={id || ""}
                        //@ts-ignore
                        bytesDescription={byteData ? byteData[`description_${difficultyToString(determineDifficulty())}`] : ""}
                        //@ts-ignore
                        bytesDevSteps={byteData ? byteData[`dev_steps_${difficultyToString(determineDifficulty())}`] : ""}
                        bytesLang={programmingLanguages[byteData ? byteData.lang : 5]}
                        codePrefix={codeBeforeCursor}
                        codeSuffix={codeAfterCursor}
                        lastTypedTime={lastTimeTyped}
                        timeout={NextStepsTimeout}
                    />
                )}
                {(activeSidebarTab === null || activeSidebarTab === "debugOutput") && activeFileIdx >= 0 && code[activeFileIdx] && (
                    <ByteNextOutputMessage
                        open={activeSidebarTab === "debugOutput"}
                        trigger={outputPopup}
                        acceptedCallback={() => {
                            setOutputPopup(false)
                        }}
                        onExpand={() => setActiveSidebarTab("debugOutput")}
                        onHide={() => setActiveSidebarTab(null)}
                        onSuccess={() => {
                            setSuggestionPopup(true)
                            markComplete()
                            recordByteAttemptCheck(true)
                            checkNumberMastered(true);
                            completionFailureRate(true);
                            if (!triggered) {
                                setTriggered(true);
                                displayCheckedProgressions();
                            }
                        }}
                        onFail={() => {
                            recordByteAttemptCheck(false)
                            completionFailureRate(false)
                        }}
                        code={code.map(x => ({
                            code: x.content,
                            file_name: x.file_name
                        }))}
                        byteId={id || ""}
                        // @ts-ignore
                        description={byteData ? byteData[`description_${difficultyToString(determineDifficulty())}`] : ""}
                        // @ts-ignore
                        questions={byteData ? byteData[`questions_${difficultyToString(determineDifficulty())}`] : []}
                        // @ts-ignore
                        dev_steps={byteData ? byteData[`dev_steps_${difficultyToString(determineDifficulty())}`] : ""}
                        maxWidth={"100%"}
                        codeOutput={output?.merged || ""}
                        nextByte={getNextByte()}
                        journey={isJourney}
                        currentDifficulty={determineDifficulty()}
                        onTryHarderVersionClick={() => setIsDifficultyPopupOpen(true)}
                        nodeBelowId={nodeBelow}
                        mobile={true}
                    />
                )}
                {(activeSidebarTab === null || activeSidebarTab === "activePorts") && journeyUnitData !== null && (
                    portPluginMemo
                )}
                {(activeSidebarTab === null || activeSidebarTab === "byteDevSteps") && byteData !== null && (
                    <ByteDevStepsPlugin
                        // @ts-ignore
                        devStepsContent={byteData ? byteData[`dev_steps_${difficultyToString(determineDifficulty())}`] : ""}
                        open={activeSidebarTab === "byteDevSteps"}
                        onExpand={() => setActiveSidebarTab("byteDevSteps")}
                        onHide={() => setActiveSidebarTab(null)}
                        maxWidth={"100%"}
                        mobile={true}
                    />
                )}
                {(activeSidebarTab === null || activeSidebarTab === "journeyHandout") && journeyUnitData !== null && (
                    <JourneyHandoutPlugin
                        handoutContent={journeyUnitData.handout}
                        onExpand={() => setActiveSidebarTab("journeyHandout")}
                        onHide={() => setActiveSidebarTab(null)}
                        maxWidth={"100%"}
                        mobile={true}
                    />
                )}
                {(activeSidebarTab === null || activeSidebarTab === "byteChat") && byteData && id !== undefined && (
                    <ByteChatMobile
                        expanded={activeSidebarTab === "byteChat"}
                        onExpand={() => setActiveSidebarTab("byteChat")}
                        onHide={() => setActiveSidebarTab(null)}
                        byteID={id}
                        // @ts-ignore
                        description={byteData ? byteData[`description_${difficultyToString(determineDifficulty())}`] : ""}
                        // @ts-ignore
                        devSteps={byteData ? byteData[`dev_steps_${difficultyToString(determineDifficulty())}`] : ""}
                        difficulty={difficultyToString(determineDifficulty())}
                        // @ts-ignore
                        questions={byteData ? byteData[`questions_${difficultyToString(determineDifficulty())}`] : []}
                        code={code.map(x => {
                            let content = x.content
                            if (activeFile === x.file_name) {
                                content = codeBeforeCursor + "<<CURSOR>>" + codeAfterCursor
                            }

                            return {
                                code: content,
                                file_name: x.file_name
                            }
                        })}
                        setSpeedDialVisibility={setSpeedDialVisibility}
                    />
                )}
                {activeSidebarTab === null && (
                    <Tooltip title={stateTooltipTitle}>
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: "0px",
                                height: "30px",
                                width: "30px",
                                padding: "3px"
                            }}
                        >
                            {stateIcon}
                        </Box>
                    </Tooltip>
                )}
            </Box>
        )
    }

    const MobileVideo = ({videoSrc, height, width}: { videoSrc: string, height?: string, width?: string }) => {
        const [loading, setLoading] = useState(true);

        const handleLoadedData = () => {
            setLoading(false);
        };

        return (
            <Box sx={{position: 'relative', height: height ? height : "auto", width: width ? width : "300px"}}>
                {loading && (
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 100
                    }}>
                        <CircularProgress color="inherit"/>
                    </Box>
                )}
                <video
                    src={videoSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    onLoadedData={handleLoadedData}
                    style={{
                        height: height ? height : "100%", // Defaulting to 100% to fill container if height is not specified
                        width: width ? width : "100%", // Defaulting to 100% to fill container if width is not specified
                        borderRadius: "10px",
                        border: "solid 2px #008664"
                    }}
                >
                    Your browser does not support the video tag.
                </video>
            </Box>
        );
    };

    const renderTutorial = () => {
        const ctVideo1 = config.rootPath + "/cloudstore/videos/ask_code_teacher_big.mp4"
        const ctVideo2 = config.rootPath + "/cloudstore/videos/ask_code_teacher_code_question.mp4"
        const ctVideo3 = config.rootPath + "/cloudstore/videos/ask_code_teacher_small.mp4"
        const ctVideo4 = config.rootPath + "/cloudstore/videos/byte_objective_final.mp4"
        const ctVideo5 = config.rootPath + "/cloudstore/videos/utilities_final.mp4"
        const ctVideo6 = config.rootPath + "/cloudstore/videos/run_example.mp4"

        return (
            <>
                <CardTutorial
                    sx={{
                        bottom: "15px"
                    }}
                    open={runTutorial}
                    closeCallback={closeTutorialCallback}
                    step={stepIndex}
                    changeCallback={tutorialCallback}
                    steps={[
                        {
                            content: (
                                <div>
                                    <h2 style={styles.tutorialHeader}>Welcome to your first Byte!</h2>
                                    <p style={styles.tutorialText}>
                                        Bytes are bite-sized coding challenges designed to help you learn to code.
                                        They are a great way to get started with coding and to learn new skills.
                                    </p>
                                </div>
                            ),
                            moreInfo: isJourney ? (
                                <div>
                                    <p style={styles.tutorialText}>
                                        Bytes are the building blocks of your Journey.
                                        Each Byte is a self-contained project that you can work on and learn from.
                                        Bytes are organized into Units, to teach you new skills and concepts.
                                    </p>
                                </div>
                            ) : undefined,
                            targetId: "",
                        },
                        {
                            content: (
                                <Box
                                    display={"inline-flex"}
                                    alignItems={"center"}
                                    justifyContent={"space-between"}
                                    sx={{
                                        height: "fit-content",
                                        width: "fit-content",
                                    }}
                                >
                                    <MobileVideo height={"250px"} width={"154px"} videoSrc={ctVideo1}/>
                                    <Box sx={{marginLeft: "20px"}}>
                                        <h2 style={styles.tutorialHeader}>Code Teacher</h2>
                                        <p style={styles.tutorialText}>
                                            Click the Code Teacher button on the left side of the screen to open the Code Teacher.
                                            Code Teacher is a personal tutor system integrated directly into Bytes.
                                            Code Teacher is designed to help you learn to code as fast as possible.
                                        </p>
                                    </Box>
                                </Box>
                            ),
                            targetId: "byte-chat-container",
                        },
                        {
                            content: (
                                <Box
                                    display={"flex"}
                                    flexDirection={"column"}
                                    alignItems={"center"}
                                    justifyContent={"space-between"}
                                    sx={{
                                        height: "fit-content",
                                        width: "fit-content",
                                    }}
                                >
                                    <MobileVideo height={"auto"} width={"100%"} videoSrc={ctVideo2}/>
                                    <Box>
                                        <h2 style={styles.tutorialHeader}>Code Teacher Can See Your Code</h2>
                                        <p style={styles.tutorialText}>
                                            Code Teacher is deeply integrated with your code editor and Byte.
                                            Code Teacher can see your code as you write it to help you better
                                            understand your objectives and solve problems.
                                        </p>
                                    </Box>
                                </Box>
                            ),
                            moreInfo: (
                                <Box>
                                    <p style={styles.tutorialText}>
                                        Code Teacher knows about your Byte objectives and can help explain what you
                                        are supposed to be doing. Think of CT as your personal tutor in the Byte
                                        and take advantage of the knowledge CT can provide.
                                    </p>
                                </Box>
                            ),
                            targetId: "byte-chat-container",
                        },
                        {
                            content: (
                                <Box
                                    display={"inline-flex"}
                                    alignItems={"center"}
                                    justifyContent={"space-between"}
                                    sx={{
                                        height: "fit-content",
                                        width: "fit-content",
                                    }}
                                >
                                    <MobileVideo height={"250px"} width={"154px"} videoSrc={ctVideo3}/>
                                    <Box sx={{marginLeft: "20px"}}>
                                        <h2 style={styles.tutorialHeader}>What can I ask Code Teacher</h2>
                                        <p style={styles.tutorialText}>
                                            Code Teacher is your personal tutor. It is here to help you at all times.
                                            You can ask Code Teacher simple questions like &quot;What&#39;s a boolean?&quot; or
                                            more complex questions like &quot;What is left to do to complete this Byte?&quot;
                                        </p>
                                    </Box>
                                </Box>
                            ),
                            targetId: "byte-chat-container",
                        },
                        {
                            content: (
                                <Box
                                    display={"inline-flex"}
                                    alignItems={"center"}
                                    justifyContent={"space-between"}
                                    sx={{
                                        height: "fit-content",
                                        width: "fit-content",
                                    }}
                                >
                                    <MobileVideo height={"192.5px"} width={"154px"} videoSrc={ctVideo4}/>
                                    <Box sx={{marginLeft: "20px"}}>
                                        <h2 style={styles.tutorialHeader}>Byte Objective</h2>
                                        <p style={styles.tutorialText}>
                                            You can find the objective of the Byte in the &quot;Byte Objective&quot; tab of the
                                            editor sidebar. This is a short description of what the Byte is about and
                                            what you should be doing. You can open and close the tab in the editor
                                            sidebar.
                                        </p>
                                    </Box>
                                </Box>
                            ),
                            targetId: "byte-dev-steps-button",
                        },
                        {
                            content: (
                                <Box
                                    display={"inline-flex"}
                                    alignItems={"center"}
                                    justifyContent={"space-between"}
                                    sx={{
                                        height: "fit-content",
                                        width: "fit-content",
                                    }}
                                >
                                    <MobileVideo height={"192.5px"} width={"154px"} videoSrc={ctVideo5}/>
                                    <Box sx={{marginLeft: "20px"}}>
                                        <h2 style={styles.tutorialHeader}>Editor Sidebar</h2>
                                        <p style={styles.tutorialText}>
                                            The left side of the editor is your Editor Sidebar and contains multiple
                                            tools to help you learn. Click &quot;More Info&quot; to see a full list of tools.
                                        </p>
                                    </Box>
                                </Box>
                            ),
                            moreInfo: (
                                <Box>
                                    <p style={styles.tutorialText}>
                                        Editor Sidebar Tools:
                                    </p>
                                    <ul>
                                        <li style={styles.tutorialText}>
                                            <strong style={styles.tutorialText}>
                                                Next Step
                                            </strong>
                                            <br/>
                                            <div style={styles.tutorialText}>
                                                The Next Step tool uses Code Teacher to help you with the next step in
                                                completing
                                                the Byte. You can use this to help you when you get stuck. It has 15s
                                                cooldown
                                                so use it wisely!
                                            </div>
                                        </li>
                                        <li style={styles.tutorialText}>
                                            <strong style={styles.tutorialText}>
                                                Debug
                                            </strong>
                                            <br/>
                                            <div style={styles.tutorialText}>
                                                The Debug tool is used everytime you run your code. It checks if the
                                                Byte is
                                                complete and if not, it uses Code Teacher to explain what is wrong with
                                                your
                                                code.
                                            </div>
                                        </li>
                                        <li style={styles.tutorialText}>
                                            <strong style={styles.tutorialText}>
                                                Code Cleanup
                                            </strong>
                                            <br/>
                                            <div style={styles.tutorialText}>
                                                The Code Cleanup tool is triggered by the &quot;Clean Up Code&quot; button above
                                                functions in the editor. It uses Code Teacher to clean up your code and
                                                make it more readable. When you run Code Cleanup, it will show you the
                                                changes it made to your code and ask you if you want to save them.
                                            </div>
                                        </li>
                                        <li style={styles.tutorialText}>
                                            <strong style={styles.tutorialText}>
                                                Open Ports
                                            </strong>
                                            <br/>
                                            <div style={styles.tutorialText}>
                                                The Open Ports tool allows you to preview and open the network ports
                                                that are open in your DevSpace. This is useful for when you are working
                                                on websites or HTTP APIs and want to see the site running in your
                                                browser.
                                            </div>
                                        </li>
                                        <li style={styles.tutorialText}>
                                            <strong style={styles.tutorialText}>
                                                Byte Objectives
                                            </strong>
                                            <br/>
                                            <div style={styles.tutorialText}>
                                                The Byte Objectives tool allows you to see all the objectives for your
                                                Byte. It is a great way to see what the Byte is looking for and to get
                                                ideas for your next step.
                                            </div>
                                        </li>
                                        <li style={styles.tutorialText}>
                                            <strong style={styles.tutorialText}>
                                                Unit Handout
                                            </strong>
                                            <br/>
                                            <div style={styles.tutorialText}>
                                                The Unit Handout tool allows you to see the handout for your current
                                                Journey unit if you are active in a Journey. It is a great way to get
                                                background information for your work.
                                            </div>
                                        </li>
                                    </ul>
                                </Box>
                            ),
                            targetId: "editor-sidebar",
                        },
                        {
                            content: (
                                <Box
                                    display={"flex"}
                                    flexDirection={"column"}
                                    alignItems={"center"}
                                    justifyContent={"space-between"}
                                    sx={{
                                        height: "fit-content",
                                        width: "fit-content",
                                    }}
                                >
                                    <MobileVideo height={"auto"} width={"100%"} videoSrc={ctVideo6}/>
                                    <Box>
                                        <h2 style={styles.tutorialHeader}>Writing & Running Code</h2>
                                        <p style={styles.tutorialText}>
                                            Use the main editor to write your code and the Run button in the top right
                                            to
                                            run your code. Once your code has exited, your code will automatically
                                            checked
                                            for completion of the Byte. If the code is not complete, Code Teacher will
                                            explain
                                            what is wrong with your code.
                                        </p>
                                    </Box>
                                </Box>
                            ),
                            moreInfo: (
                                <Box>
                                    <p style={styles.tutorialText}>
                                        When you Run your code output console will appear at the bottom of the editor
                                        and show you the output of your code. A text box will also appear in the console
                                        so you can pass in input to your code.
                                    </p>
                                </Box>
                            ),
                            targetId: "byte-run-button",
                            width: "520px",
                            height: "calc(50vh + 10px)",
                            left: true
                        },
                    ]}
                />
            </>
        )
    }


    let lang = mapFilePathToLangOption(activeFile)

    // @ts-ignore
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline>
                {authState.authenticated && authState.role === 0 && (
                    <Box sx={{ position: "absolute", top: 0, right: 0 }}>
                        <HeartTracker openGoProPopup={() => setProPopupOpen(true)} small={true} />
                    </Box>
                )}
                <Box sx={{ ...topContainerStyle, flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
                    {helpPopup()}
                    {byteData ? (
                        <Typography variant="h4" component="h1" style={titleStyle}>
                            {byteData.name}
                        </Typography>
                    ) : (
                        <Box sx={titlePlaceholderContainerStyle}>
                            <Box sx={titlePlaceholderStyle}>
                                <SheenPlaceholder width="400px" height={"45px"} />
                            </Box>
                        </Box>
                    )}
                </Box>
                <Box style={editorAndTerminalStyle} ref={editorContainerRef}>
                    {activeSidebarTab === null && (
                        <Box
                            display={"inline-flex"}
                            justifyContent={"space-between"}
                            sx={{
                                width: "100%",
                                marginBottom: "2px"
                            }}
                        >
                            <EditorTabs
                                value={activeFileIdx + 1}
                                onChange={(e, idx) => {
                                    if (idx === 0) {
                                        setNewFilePopup(true)
                                        return
                                    }
                                    setActiveFile(code[idx - 1].file_name)
                                }}
                                variant="scrollable"
                                scrollButtons="auto"
                                aria-label="file tabs"
                                TabIndicatorProps={{ sx: { display: "none" } }}
                            >
                                <MobileEditorTab
                                    icon={<Add style={{ fontSize: "18px" }} />}
                                    aria-label="New file"
                                    style={{
                                        marginLeft: "5px",
                                    }}
                                />
                                {code.map((file, index) => (
                                    <MobileEditorTab
                                        key={file.file_name}
                                        label={
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between'
                                            }}>
                                                {file.file_name}
                                                <IconButton
                                                    size="small"
                                                    onClick={() => setDeleteFileRequest(file.file_name)}
                                                    sx={{ marginLeft: 0.5, padding: '2px', fontSize: "12px" }}
                                                >
                                                    <CloseIcon fontSize="inherit" />
                                                </IconButton>
                                            </div>
                                        }
                                    />
                                ))}
                            </EditorTabs>
                            {activeFileIdx >= 0 && code[activeFileIdx] && code[activeFileIdx].content.length > 0 && lang?.execSupported && (
                                <Box
                                    display={"inline-flex"}
                                >
                                    <Tooltip title="Run Code">
                                        <LoadingButton
                                            id="byte-run-button"
                                            loading={executingCode}
                                            variant="outlined"
                                            color={"success"}
                                            sx={{
                                                zIndex: 3,
                                                m: 0,
                                                p: 0,
                                                mr: 1,
                                                fontSize: "0.6rem !important",
                                                lineHeight: "0px",
                                                minWidth: "48px",
                                                marginLeft: "4px"
                                            }}
                                            onClick={() => {
                                                setOutputPopup(false);
                                                buttonClickedRef.current = true;
                                                if (!authState.authenticated) {
                                                    navigate.push("/signup?forward=" + encodeURIComponent(window.location.pathname))
                                                    return
                                                }

                                                executeCode(); // Indicate button click

                                                addNotificationToQueue({
                                                    progression: 'data_hog',
                                                    achievement: false,
                                                    progress: "",
                                                    data: null
                                                })

                                                addNotificationToQueue({
                                                    progression: 'scribe',
                                                    achievement: false,
                                                    progress: "",
                                                    data: null
                                                })

                                            }}
                                        >
                                            Run <PlayArrow style={{ fontSize: "14px" }} />
                                        </LoadingButton>
                                    </Tooltip>
                                </Box>
                            )}
                        </Box>
                    )}
                    <Box display="inline-flex" sx={{ width: "100%", height: "100%" }}>
                        {renderSidebar()}
                        {activeSidebarTab === null && (
                            <Editor
                                ref={editorRef}
                                parentStyles={editorStyle}
                                language={programmingLanguages[byteData ? byteData.lang : 5]}
                                filePath={activeFileIdx >= 0 && code[activeFileIdx] ? code[activeFileIdx].file_name : ""}
                                code={activeFileIdx >= 0 && code[activeFileIdx] ? code[activeFileIdx].content : ""}
                                theme={theme.palette.mode}
                                readonly={!authState.authenticated}
                                onChange={(val, view) => handleEditorChange(val)}
                                onCursorChange={(bytePosition, line, column) => setCursorPosition({
                                    row: line,
                                    column: column
                                })}
                                lspUrl={byteData && lspActive ? `wss://${byteData._id}-lsp.${config.coderPath.replace("https://", "")}` : undefined}
                                byteId={id}
                                difficulty={difficultyToString(determineDifficulty())}
                                diagnosticLevel={selectDiagnosticLevel()}
                                editorStyles={editorStyles}
                                extensions={popupExtRef.current ? editorExtensions.concat(popupExtRef.current) : editorExtensions}
                                wrapperStyles={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: "10px",
                                }}
                            />
                        )}
                    </Box>
                    {terminalVisible && output && (
                        <ByteTerminal
                            output={output}
                            onClose={handleCloseTerminal}
                            onStop={() => cancelCodeExec(commandId)}
                            onInputSubmit={(input: string) => stdInExecRequest(commandId, input)}
                            isRunning={executingCode}
                        />
                    )}
                    {!isJourney && (
                        <Box
                            sx={{
                                width: '100%',
                                maxWidth: "100%",
                                height: '35px',
                                backgroundColor: '#232a2f',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onClick={() => setNextByteDrawerOpen(true)}
                        >
                            <KeyboardArrowUp />
                        </Box>
                    )}
                    {isSpeedDialVisible && !embedded && (
                        <SpeedDial
                            ariaLabel="SpeedDial"
                            sx={{ position: 'fixed', bottom: 24, right: 16 }}
                            icon={<MenuIcon />}
                            open={speedDialOpen}
                            onOpen={() => setSpeedDialOpen(true)}
                            onClose={() => setSpeedDialOpen(false)}
                        >
                            {getFilteredActions().map((action) => (
                                <SpeedDialAction
                                    key={action.name}
                                    icon={action.icon}
                                    tooltipTitle={action.name}
                                    onClick={() => {
                                        setSpeedDialOpen(false)
                                        action.action();
                                    }}
                                />
                            ))}
                        </SpeedDial>
                    )}
                </Box>
                {parsedSymbols !== null ? codeActionPortals.map(x => x.portal) : null}
                <NextByteDrawerMobile
                    open={nextByteDrawerOpen}
                    onClose={() => setNextByteDrawerOpen(false)}
                    onNextByte={handleNextByte}
                />
                {renderNewFilePopup()}
                {renderDeleteFilePopup()}
                {currentNotification && (
                    <ProgressionNotification
                        progression={currentNotification.progression}
                        achievement={currentNotification.achievement}
                        progress={currentNotification.progress}
                        onClose={handleNotificationClose}
                        xpData={currentNotification.data}
                    />
                )}
                {isDifficultyPopupOpen && (
                    <Dialog
                        open={isDifficultyPopupOpen}
                        onClose={() => setIsDifficultyPopupOpen(false)}
                        aria-labelledby="change-difficulty-dialog-title"
                    >
                        <DialogTitle id="change-difficulty-dialog-title">Change Difficulty</DialogTitle>
                        <DialogContent>
                            <DifficultyAdjuster
                                difficulty={determineDifficulty()}
                                onChange={(newDifficulty) => {
                                    updateDifficulty(newDifficulty);
                                    setIsDifficultyPopupOpen(false);
                                }}
                            />
                        </DialogContent>
                    </Dialog>
                )}
                <OutOfHeartsMobile open={outOfHearts} onClose={() => navigate.push("/journey")} onGoPro={() => setProPopupOpen(true)} />
                <GoProDisplay open={proPopupOpen} onClose={() => setProPopupOpen(false)} />
                {renderTutorial()}
            </CssBaseline>
        </ThemeProvider>
    );
};

export default ByteMobile;