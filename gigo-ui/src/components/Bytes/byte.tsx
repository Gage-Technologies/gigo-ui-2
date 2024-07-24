'use client';
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {
    alpha,
    Box,
    Button,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import XpPopup from "@/components/XpPopup";
import {theme} from "@/theme";
import Add from "@mui/icons-material/Add";
import PlayArrow from "@mui/icons-material/PlayArrow";
import {useAppDispatch, useAppSelector} from "@/reducers/hooks";
import swal from "sweetalert";
import 'ace-builds';
import 'ace-builds/webpack-resolver';
import ByteSelectionMenu from "@/components/ByteSelectionMenu";
import config from "@/config";
import {useGlobalWebSocket} from "@/services/websocket";
import {
    WsGenericErrorPayload,
    WsMessage,
    WsMessageType,
    WsResponseCode,
    WsValidationErrorPayload
} from "@/models/websocket";
import {Byte, ExecResponsePayload, OutputRow} from "@/models/bytes";
import {programmingLanguages} from "@/services/vars";
import {useGlobalCtWebSocket} from "@/services/ct_websocket";
import ByteNextStep from "@/components/CodeTeacher/ByteNextStep";
import ByteChat from "@/components/CodeTeacher/ByteChat";
import {LoadingButton} from "@mui/lab";
import ByteNextOutputMessage from "@/components/CodeTeacher/ByteNextOutputMessage";
import Editor from "@/components/IDE/Editor";
import chroma from 'chroma-js';
import SheenPlaceholder from "@/components/Loading/SheenPlaceholder";
import {sleep} from "@/services/utils";
import {Extension, ReactCodeMirrorRef} from "@uiw/react-codemirror";
import DifficultyAdjuster from "@/components/ByteDifficulty";
import {
    initialAuthStateUpdate,
    selectAuthState,
    selectAuthStateTutorialState,
    updateAuthState
} from "@/reducers/auth/auth";
import {initialBytesStateUpdate, selectBytesState, updateBytesState} from "@/reducers/bytes/bytes";
import ByteTerminal from "@/components/Terminal";
import {debounce} from "lodash";
import {LaunchLspRequest} from "@/models/launch_lsp";
import {Workspace} from "@/models/workspace";
import CodeSource from "@/models/codeSource";
import {
    CtByteNextOutputRequest, CtByteNextOutputResponse,
    CtGenericErrorPayload,
    CtMessage,
    CtMessageOrigin,
    CtMessageType,
    CtParseFileRequest,
    CtParseFileResponse, CtProblemsSolvedRequest,
    CtValidationErrorPayload,
    Node as CtParseNode,
    CtProblemsSolved
} from "@/models/ct_websocket";
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import {createCtPopupExtension, CtPopupExtensionEngine} from "@/components/IDE/Extensions/CtPopupExtension";
import {ctCreateCodeActions} from "@/components/IDE/Extensions/CtCodeActionExtension";
import ByteSuggestions2 from "@/components/CodeTeacher/ByteSuggestions2";
import BytesLanguage from "@/icons/Bytes/BytesLanguage";
import {CodeFile} from "@/models/code_file";
import CloseIcon from "@mui/icons-material/Close";
import {EditorTab, EditorTabs} from "@/components/IDE/EditorTabs";
import JourneyUnit from "@/models/journey_unit";
import JourneyHandoutPlugin from "@/components/JourneyHandoutPlugin";
import BytePortPlugin from "@/components/BytePortPlugin";
import {AdminUpdateByteCodeRequest, AdminUpdateByteCodeResponse} from "@/models/admin";
import ByteDevStepsPlugin from "@/components/ByteDevStepsPlugin";
import CardTutorial from "@/components/CardTutorial";
import {
    ctHighlightCodeRangeFullLines,
    removeCtHighlightCodeRange
} from "@/components/IDE/Extensions/CtHighlightExtension";
import {useRouter, useSearchParams} from "next/navigation";
import { decrementHeartsState, selectOutOfHearts } from "@/reducers/hearts/hearts";
import GoProDisplay from "@/components/GoProDisplay";
import OutOfHearts from "@/components/OutOfHearts";
import WelcomeMobilePage from "@/components/Welcome/welcomeMobile";
import ByteMobile from "@/components/Bytes/byteMobile";
import ProgressionNotification from "@/components/Progressions/ProgressionNotification";
import { updateDataHogLevel, updateDataHogLevelMax, updateDataHogValue } from "@/reducers/progression/dataHog";
import DetermineProgressionLevel from "@/utils/progression";
import { updateScribeLevel, updateScribeLevelMax, updateScribeValue } from "@/reducers/progression/scribe";


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

interface ByteAttempt {
    _id: string;
    byte_id: string;
    author_id: string;
    files_easy: CodeFile[];
    files_medium: CodeFile[];
    files_hard: CodeFile[];
    modified: boolean;
}

interface LanguageOption {
    name: string;
    extensions: string[];
    languageId: number;
    execSupported: boolean;
    lspSupport: boolean;
}

const languages: LanguageOption[] = [
    {name: 'Go', extensions: ['go'], languageId: 6, execSupported: true, lspSupport: true},
    {name: 'Python', extensions: ['py', 'pytho', 'pyt'], languageId: 5, execSupported: true, lspSupport: true},
    {
        name: 'C++',
        extensions: ['cpp', 'cc', 'cxx', 'hpp', 'c++', 'h'],
        languageId: 8,
        execSupported: true,
        lspSupport: true
    },
    {name: 'HTML', extensions: ['html', 'htm'], languageId: 27, execSupported: false, lspSupport: false},
    {name: 'Java', extensions: ['java'], languageId: 2, execSupported: false, lspSupport: false},
    {name: 'JavaScript', extensions: ['js'], languageId: 3, execSupported: true, lspSupport: true},
    {name: 'JSON', extensions: ['json'], languageId: 1, execSupported: false, lspSupport: false},
    {name: 'Markdown', extensions: ['md'], languageId: 1, execSupported: false, lspSupport: false},
    {name: 'PHP', extensions: ['php'], languageId: 13, execSupported: false, lspSupport: false},
    {name: 'Rust', extensions: ['rs'], languageId: 14, execSupported: true, lspSupport: true},
    {name: 'SQL', extensions: ['sql'], languageId: 34, execSupported: false, lspSupport: false},
    {name: 'XML', extensions: ['xml'], languageId: 1, execSupported: false, lspSupport: false},
    {name: 'LESS', extensions: ['less'], languageId: 1, execSupported: false, lspSupport: false},
    {name: 'SASS', extensions: ['sass', 'scss'], languageId: 1, execSupported: false, lspSupport: false},
    {name: 'Clojure', extensions: ['clj'], languageId: 21, execSupported: false, lspSupport: false},
    {name: 'C#', extensions: ['cs'], languageId: 10, execSupported: true, lspSupport: false},
    {name: 'Shell', extensions: ['bash', 'sh'], languageId: 38, execSupported: true, lspSupport: false},
    {name: 'Toml', extensions: ['toml'], languageId: 14, execSupported: false, lspSupport: false}
];

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


function BytePage({params, ...props}: ByteProps) {
    const query = useSearchParams()
    const isJourney = query.get("journey") !== null

    let id = params.id;

    const [xpPopup, setXpPopup] = React.useState(false)
    const [xpData, setXpData] = React.useState(null)
    const [nodeBelow, setNodeBelow] = React.useState(null)

    const authState = useAppSelector(selectAuthState);
    const bytesState = useAppSelector(selectBytesState)
    const outOfHearts = useAppSelector(selectOutOfHearts);

    const [terminalVisible, setTerminalVisible] = useState(false);
    const [journeySetupDone, setJourneySetupDone] = useState(false);
    const dispatch = useAppDispatch();

    const navigate = useRouter();

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

    const combinedSectionStyle: React.CSSProperties = {
        display: 'flex',
        height: '80vh',
        width: 'calc(100vw - 360px)',
        marginLeft: '30px',
        marginRight: 'auto',
        borderRadius: theme.shape.borderRadius,
        overflow: 'hidden',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
        border: `1px solid ${theme.palette.grey[300]}`,
        padding: "10px",
        backgroundColor: theme.palette.background.default
    };

    const mainLayoutStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: '30px',
        marginTop: '1rem',
        maxHeight: "80vh",
        overflow: "hidden"
    };

    // Byte selection menu style
    const byteSelectionMenuStyle: React.CSSProperties = {
        width: '300px',
        maxHeight: '80vh',
        overflow: 'hidden'
    };

    const containerStyleDefault: React.CSSProperties = {
        width: '100%',
        padding: theme.spacing(0),
        margin: '0',
        maxWidth: 'none',
        overflowY: "hidden"
    };

    const markdownSectionStyle: React.CSSProperties = {
        flex: 1,
        minWidth: "450px",
        maxWidth: "20vw",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
        borderRadius: theme.shape.borderRadius,
        overflow: 'hidden',
    };

    const editorAndTerminalStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        height: '100%',
        paddingLeft: "20px",
        // width: "60vw",
        width: 0,
        position: "relative"
    };

    const editorStyle: React.CSSProperties = {
        height: terminalVisible ? "calc(100% - 236px)" : "calc(100% - 36px)",
    };

    const terminalOutputStyle: React.CSSProperties = {
        backgroundColor: "#333",
        color: "lime",
        fontFamily: "monospace",
        fontSize: "0.9rem",
        padding: "10px",
        marginTop: "20px",
        borderRadius: "5px",
        whiteSpace: "pre-wrap",
        // maxHeight: '300px',
        // minHeight: "100px",
        height: "200px",
        overflowY: 'auto',
        wordWrap: 'break-word',
        position: "relative",
    };

    const difficultyAdjusterStyle: React.CSSProperties = {
        width: "fit-content",
        marginLeft: "30px"
    };

    const titleStyle: React.CSSProperties = {
        textAlign: 'center',
        marginTop: "14px",
        marginBottom: "2px",
        width: "calc(100vw - 500px)",
    };

    const topContainerStyle: React.CSSProperties = {
        position: "relative",
        display: 'flex',
        alignItems: 'center', // Align items vertically in the center
        justifyContent: 'flex-start', // Align the DifficultyAdjuster to the left
        gap: '0rem', // Add some space between the adjuster and the title
    };

    const titlePlaceholderContainerStyle: React.CSSProperties = {
        display: "flex",
        padding: theme.spacing(1),
        marginTop: "14px",
        marginBottom: "2px",
        alignItems: 'center',
        width: "calc(80vw - 164px)",
    };

    const titlePlaceholderStyle: React.CSSProperties = {
        margin: "auto"
    }

    const styles = {
        tutorialHeader: {
            fontSize: "1rem",
        },
        tutorialText: {
            fontSize: "0.7rem",
        }
    };

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

    const [containerStyle, setContainerSyle] = useState<React.CSSProperties>(containerStyleDefault)
    const [cursorPosition, setCursorPosition] = useState<{ row: number, column: number } | null>({row: 0, column: 0})
    const [codeBeforeCursor, setCodeBeforeCursor] = useState("");
    const [codeAfterCursor, setCodeAfterCursor] = useState(afi >= 0 ? outlineContent[afi].content : "");
    const [outputPopup, setOutputPopup] = useState(false);
    const [byteAttemptId, setByteAttemptId] = useState("");
    const [easyCode, setEasyCode] = useState<CodeFile[]>(props.byte.files_easy);
    const [mediumCode, setMediumCode] = useState<CodeFile[]>(props.byte.files_medium);
    const [hardCode, setHardCode] = useState<CodeFile[]>(props.byte.files_hard);
    const [activeFile, setActiveFile] = useState(afi >= 0 ? outlineContent[afi].file_name : "");
    const [activeFileIdx, setActiveFileIdx] = useState(afi);
    const typingTimerRef = useRef(null);
    const syncTimerRef = useRef(null);
    const [lastTimeTyped, setLastTimeTyped] = useState<number | null>(null);
    const [suggestionPopup, setSuggestionPopup] = useState(false);
    const [nextStepsPopup, setNextStepsPopup] = useState(false);
    const [commandId, setCommandId] = useState("");
    const [newFilePopup, setNewFilePopup] = React.useState(false);
    const [newFileName, setNewFileName] = React.useState("");
    const [deleteFileRequest, setDeleteFileRequest] = React.useState<string | null>(null);

    const [executingOutputMessage, setExecutingOutputMessage] = useState<boolean>(false)
    const [executingCode, setExecutingCode] = useState<boolean>(false)

    const pingInterval = React.useRef<NodeJS.Timeout | null>(null)

    const editorContainerRef = React.useRef<HTMLDivElement>(null);
    const editorRef = React.useRef<ReactCodeMirrorRef>(null);
    const popupEngineRef = React.useRef<CtPopupExtensionEngine | null>(null);
    const popupExtRef = React.useRef<Extension | null>(null);

    const [adminPopup, setAdminPopup] = React.useState(false);
    const [adminPopupCommitLoading, setAdminPopupCommitLoading] = React.useState(false);
    const [adminPopupCommitFailed, setAdminPopupCommitFailed] = React.useState<string | null>(null);

    const [activeSidebarTab, setActiveSidebarTab] = React.useState<string | null>("byteDevSteps");

    const [userHasModified, setUserHasModified] = React.useState(false)
    const [lspActive, setLspActive] = React.useState(false)
    const [workspaceState, setWorkspaceState] = useState<null | number>(null);
    const [activePorts, setActivePorts] = useState<{
        name: string;
        port: string;
        url: string,
        disabled: boolean
    }[]>([]);
    const [workspaceId, setWorkspaceId] = useState<string>('')

    const [connectButtonLoading, setConnectButtonLoading] = useState<boolean>(false)

    const [editorExtensions, setEditorExtensions] = useState<Extension[]>([])

    const [parsedSymbols, setParsedSymbols] = useState<CtParseFileResponse | null>(null)
    const [codeActionPortals, setCodeActionPortals] = useState<{ id: string, portal: React.ReactPortal }[]>([])

    const [loadingCodeCleanup, setLoadingCodeCleanup] = React.useState<string | null>(null);

    const [suggestionRange, setSuggestionRange] = useState<{ start_line: number, end_line: number } | null>(null);
    const [isHarderVersionPopupVisible, setIsHarderVersionPopupVisible] = useState(false);

    const [journeyUnitData, setJourneyUnitData] = useState<JourneyUnit | null>(null);

    const tutorialState = useAppSelector(selectAuthStateTutorialState)
    const [runTutorial, setRunTutorial] = React.useState(!tutorialState.bytes && authState.authenticated)
    const [stepIndex, setStepIndex] = React.useState(0)
    const [proPopupOpen, setProPopupOpen] = useState(false)

    let ctWs = useGlobalCtWebSocket();

    let globalWs = useGlobalWebSocket();
    const dataHogState = useAppSelector(state => state.dataHog);
    const scribeState = useAppSelector(state => state.scribe);


    const handleScribeDataHog = async () => {
        try {
            const response = await fetch(
                `${config.rootPath}/api/stats/getProgression`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: '{}',
                    credentials: 'include'
                }
            );

            const data = await response.json();
            if (data.progression) {
                console.log("progression: ", data.progression);
                // data hog progression
                const dataHogValue = parseFloat(data.progression?.data_hog ?? '0');
               
                if (dataHogState && dataHogValue !== dataHogState.value) {
                    dispatch(updateDataHogValue(dataHogValue));
                    // determine progression level for data_hog
                    const [dataHogLevel, dataHogLevelMax] = DetermineProgressionLevel("data_hog", dataHogValue.toString()) ?? ['', ''];

                    let achievement = false;
                    if (dataHogState.level !== dataHogLevel || dataHogState.levelMax !== dataHogLevelMax) {
                        // update data hog level in state
                        dispatch(updateDataHogLevel(dataHogLevel));
                        // update data hog max level in state
                        dispatch(updateDataHogLevelMax(dataHogLevelMax));
                        achievement = true;
                    }
                    // add notification to queue for data hog progression
                    addNotificationToQueue({
                        progression: 'data_hog',
                        achievement: achievement,
                        progress: dataHogValue,
                        data: null
                    });
                }

                // scribe progression
                const scribeValue = parseFloat(data.progression?.scribe ?? '0');
                if (scribeState && scribeValue !== scribeState.value) {
                    dispatch(updateScribeValue(scribeValue));
                    // determine progression level for scribe
                    const [scribeLevel, scribeLevelMax] = DetermineProgressionLevel("scribe", scribeValue.toString()) ?? ['', ''];

                    let achievement = false;
                    if (scribeState.level !== scribeLevel || scribeState.levelMax !== scribeLevelMax) {
                        // update scribe level in state
                        dispatch(updateScribeLevel(scribeLevel));
                        // update scribe max level in state
                        dispatch(updateScribeLevelMax(scribeLevelMax));
                        achievement = true;
                    }
                    // add notification to queue for scribe progression
                    addNotificationToQueue({
                        progression: 'scribe',
                        achievement: achievement,
                        progress: scribeValue,
                        data: null
                    });
                }

                // console.log("data hog level: ", dataHogState.level);
                // console.log("data hog level max: ", dataHogState.levelMax);
                // console.log("scribe level: ", scribeState.level);
                // console.log("scribe level max: ", scribeState.levelMax);
            }
        } catch (e) {
            console.log("failed to get progression: ", e);
        }
    };

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

    // if (isMobile){
    //     return <ByteMobile params={params}/>
    // }

    useEffect(() => {
        if (popupEngineRef.current !== null) {
            return
        }
        let {ext, engine} = createCtPopupExtension();
        popupExtRef.current = ext;
        popupEngineRef.current = engine;
    }, [])

    useEffect(() => {
        setActiveFileIdx(code.findIndex((x: CodeFile) => x.file_name === activeFile));
    }, [activeFile, JSON.stringify(code[activeFileIdx])]);

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

    const debouncedUpdateCode = React.useCallback(debounce((newCode: CodeFile[]) => {
        console.log("updating code: ", newCode)
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

    const debouncedParseSymbols = React.useCallback(debounce((file: CodeFile) => {
        ctWs.sendWebsocketMessage(
            {
                sequence_id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
                type: CtMessageType.WebSocketMessageTypeParseFileRequest,
                origin: CtMessageOrigin.WebSocketMessageOriginClient,
                created_at: Date.now(),
                payload: {
                    relative_path: file.file_name,
                    content: file.content,
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
    }, 10000, {
        trailing: true
    }), [ctWs]);

    const problemsSolved = React.useCallback(() => {
        ctWs.sendWebsocketMessage(
            {
                sequence_id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
                type: CtMessageType.WebSocketMessageTypeProblemsSolved,
                origin: CtMessageOrigin.WebSocketMessageOriginClient,
                created_at: Date.now(),
                payload: {
                    assistant_id: "0",
                    byte_id: byteAttemptId,
                }
            } satisfies CtMessage<CtProblemsSolved>,
            (msg: CtMessage<CtGenericErrorPayload | CtValidationErrorPayload | boolean>): boolean => {
                if (typeof msg.payload !== 'boolean') {
                    console.log("failed to update problems solved: ", msg)
                    return false
                }
                return msg.payload
            }
        )
    }, [ctWs, byteAttemptId]);

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
        setCommandId("")
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

    const sendExecRequest = async (retryCount: number = 0) => {
        let lang = mapFilePathToLangOption(activeFile)
        if (lang === undefined || !lang?.execSupported) {
            return
        }

        let files = code.filter((f) => f.file_name.trim().length > 0)

        let payloadContent: any = {
            lang: lang.languageId,
            byte_id: id,
            difficulty: difficultyToString(determineDifficulty()),
            file_name: activeFile,
        };

        // if the active file is a bash file then we use the single file exec
        if (lang.languageId === 38) {
            let file = code.find((f) => f.file_name == activeFile)
            payloadContent = {
                lang: lang.languageId,
                code: file ? file.content : "",
            }
        }

        const message = {
            sequence_id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            type: WsMessageType.AgentExecRequest,
            payload: {
                code_source_id: byteAttemptId,
                payload: payloadContent
            }
        };

        setTerminalVisible(true)
        setOutput({
            stdout: [{timestamp: Date.now() * 1000, content: "Running..."}],
            stderr: [],
            merged: "Running...",
            mergedLines: [{timestamp: Date.now() * 1000, content: "Running...", error: false}],
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
                const {stdout, stderr, done} = payload;

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
                }

                // we only return true here if we are done since true removes this callback
                return done
            }
        );
    };


    const getRecommendedBytes = async () => {
        let recommendedBytes = await fetch(
            `${config.rootPath}/api/bytes/getRecommendedBytes`,
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({}),
                credentials: 'include'
            }
        ).then(response => response.json());

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
            // Map through each byte and add a random image from byteImages
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
            console.log("byte id in start: ", byteId)
            const res = await fetch(
                `${config.rootPath}/api/bytes/startByteAttempt`,
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/'},
                    body: JSON.stringify({
                        byte_id: byteId
                    }),
                    credentials: 'include'
                }
            ).then(res => res.json())


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
            const res = await fetch(
                `${config.rootPath}/api/bytes/createWorkspace`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({byte_id: byteId}),
                    credentials: 'include',
                }
            ).then(res => res.json())


            if (res === undefined) {
                swal("Server Error", "Cannot fetch byte data. Please try again later.");
                return false;
            }

            if (res["message"] === "Workspace Created Successfully") {
                // TODO implement what needs to be done if successful
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
        let funcParams = {
            byte_id: byteAttemptId,
            difficulty: difficultyToString(determineDifficulty()),
        }

        if (isJourney) {
            //@ts-ignore
            funcParams["journey"] = true
        }
        let res = await fetch(
            `${config.rootPath}/api/bytes/setCompleted`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(funcParams),
                credentials: 'include'
            }
        ).then(res => res.json())

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

        console.log("res here: ", res)

        if (res["hungry_learner"] !== undefined) {
            addNotificationToQueue({
                progression: 'hungry_learner',
                achievement: false,
                progress: res["hungry_learner"],
                data: null
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
                console.log("dispatch: exiting")
                return;
            }

            if (authState.role === 0 && res["decrement"]) {
                console.log("decrement: true")
                dispatch(decrementHeartsState())
            }

            console.log("dispatch: complete")
        }, 300),
        [byteAttemptId, determineDifficulty, authState.role, dispatch]
    );

    const checkNumberMastered = async (success: boolean) => {
        if (!success) {
            return;
        }

        let params = {
            byte_id: byteAttemptId,
            difficulty: determineDifficulty(),
        }

        // Check if the byte has already been mastered
        const masteredKey = `mastered_${params.byte_id}_${params.difficulty}`;
        if (localStorage.getItem(masteredKey)) {
            console.log("Byte already mastered, skipping API call");
            return;
        }

        let res = await fetch(
            `${config.rootPath}/api/stats/checkNumberMastered`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(params),
                credentials: 'include'
            }
        ).then(res => res.json());

        if (res === undefined || res["mastered"] === undefined) {
            return;
        }

        console.log("Response from mastered: ", res["mastered"]);
        console.log("Response from number mastered: ", res["numFromTable"]);

        // If the byte was mastered, mark it as such in local storage
        if (res["mastered"]) {
            localStorage.setItem(masteredKey, "true");
        }
    }


    const completionFailureRate = async (success: boolean) => {
        if (!success) {
            return;
        }



        let res = await fetch(
            `${config.rootPath}/api/stats/completionFailureRate`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: '{}',
                credentials: 'include'
            }
        ).then(res => res.json());

        if (res === undefined || res["completion_failure_ratio"] === undefined) {
            return;
        }

        console.log("Response from CFR: ", res["completion_failure_ratio"]);

    }

    const checkTenacious = async (byteID: string) => {
        let res = await fetch(
            `${config.rootPath}/api/stats/checkTenacious`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ byte_attempt_id: byteID }),
                credentials: 'include'
            }
        ).then(res => res.json());

        if (res === undefined || res["tenacious_count"] === undefined) {
            return;
        }

        if (res["new_high"]) {
            addNotificationToQueue({
                progression: 'tenacious',
                achievement: res["new_tier"],
                progress: res["tenacious_count"],
                data: null
            });
        }
    }

    const checkHotStreak = async () => {
        let res = await fetch(
            `${config.rootPath}/api/stats/checkHotStreak`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: '{}',
                credentials: 'include'
            }
        ).then(res => res.json());

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

        let res = await fetch(
            `${config.rootPath}/api/stats/checkUnitMastery`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ byte_attempt_id: byteID }),
                credentials: 'include'
            }
        ).then(res => res.json());

        if (res == undefined){
            return;
        }

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
        checkTenacious(byteAttemptId);
        if (isJourney) {

            checkUnitMastery(props.byte._id);
        }

        addNotificationToQueue({
            progression: 'hungry_learner',
            achievement: false,
            progress: "",
            data: null
        })

        checkHotStreak();

    }

    // Function to fetch the journey unit metadata
    const getJourneyUnit = async (byteId: string): Promise<any | null> => {
        try {
            // TODO maybe need to fix this
            const res = await fetch(`${config.rootPath}/api/journey/getUnitFromTask`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify({task_id: byteId}),
                    credentials: 'include',
                }
            ).then(res => res.json())

            // const [res] = await Promise.all([response]);

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

    useEffect(() => {
        console.log("byte id: ", id)
        if (id === undefined || byteData === null) {
            return;
        }

        setOutput(null);
        setExecutingCode(false);
        setTerminalVisible(false);
        setUserHasModified(false);
        setWorkspaceId("");
        setWorkspaceState(null);
        setActivePorts([]);
        setLspActive(false);
        setSuggestionRange(null);
        getRecommendedBytes();
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
        if (isJourney) {
            getJourneyUnit(id).then((u: JourneyUnit | null) => {
                // if (u !== null && !bytesState.handoutClosedByUser) {
                //     setActiveSidebarTab("journeyHandout")
                // }
            })
        }
    }, [id]);

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
        //@ts-ignore
        typingTimerRef.current = setTimeout(() => {
            setNextStepsPopup(true);
        }, NextStepsTimeout);
        //@ts-ignore
        syncTimerRef.current = setInterval(() => {
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
            (msg: WsMessage<any>) => {
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
                    if (executingCode) {
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

        let lang = mapFilePathToLangOption(code[activeFileIdx].file_name)
        if (lang === undefined || !lang.lspSupport) {
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

    const triggerCodeCleanup = React.useCallback((node: CtParseNode) => {
        if (!editorRef.current?.view) {
            return
        }
        setLoadingCodeCleanup(node.id)


        // set range here
        setSuggestionRange({start_line: node.position.start_line, end_line: node.position.end_line})
    }, [editorRef.current])

    useEffect(() => {
        if (parsedSymbols !== null && parsedSymbols.nodes.length > 0 && workspaceState === 1) {
            setEditorExtensions([ctCreateCodeActions(
                alpha(theme.palette.text.primary, 0.6),
                parsedSymbols,
                loadingCodeCleanup,
                (id: string, portal: React.ReactPortal) => {
                    setCodeActionPortals((prevState) => {
                        // update the portal if it has a prior state or add it if new
                        return prevState.some((x) => x.id === id) ?
                            prevState.map((item) => item.id === id ? {...item, portal} : item) :
                            [...prevState, {id, portal}];
                    })
                },
                (node: CtParseNode) => triggerCodeCleanup(node)
            )])
        }

        // filter any code symbols from the portals that no longer exist
        if (parsedSymbols !== null) {
            setCodeActionPortals((prevState) => {
                return prevState.filter(({id}) =>
                    parsedSymbols.nodes.some((node) => node.id === id));
            });
        }
    }, [parsedSymbols, loadingCodeCleanup, workspaceState]);

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

    const handleSelectByte = (byteId: string) => {
        navigate.push(`/byte/${byteId}`);
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
        if (activeSidebarTab === null || activeSidebarTab !== "nextSteps") {
            setNextStepsPopup(true)
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
        console.log("triggering useEffect for code parsing: ", activeFileIdx, code[activeFileIdx])
        if (activeFileIdx < 0 || code[activeFileIdx] === undefined) {
            return
        }
        setParsedSymbols(null)
        debouncedParseSymbols(code[activeFileIdx])
    }, [JSON.stringify(code[activeFileIdx])]);

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

    const handleTryHarderVersionClick = () => {
        setIsHarderVersionPopupVisible(true);
        console.log("popup clicked")
    };


    const acceptCodeSuggestionCallback = React.useCallback((c: string) => {
        setCode((prevState: CodeFile[]) => {
            let idx = prevState.findIndex((x) => x.file_name === activeFile);
            if (idx !== -1) {
                prevState[idx].content = c;
            }
            return prevState
        })
        setSuggestionRange(null)
        setLoadingCodeCleanup(null)
        startTypingTimer()
    }, [activeFile, startTypingTimer])


    const portPluginMemo = React.useMemo(() => (
        <BytePortPlugin
            ports={activePorts}
            onExpand={() => setActiveSidebarTab("activePorts")}
            onHide={() => setActiveSidebarTab(null)}
            maxWidth={"20vw"}
        />
    ), [activePorts])

    const callProblemsSolved = () => {
        ctWs.sendWebsocketMessage({
            sequence_id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            type: CtMessageType.WebSocketMessageTypeProblemsSolved,
            origin: CtMessageOrigin.WebSocketMessageOriginClient,
            created_at: Date.now(),
            payload: {
                assistant_id: "",
                byte_id: byteAttemptId,
                user_id: id,
            }
        } satisfies CtMessage<CtProblemsSolvedRequest>, (msg: CtMessage<CtGenericErrorPayload | CtValidationErrorPayload>) => {
            return true
        })
    };

    const [triggered, setTriggered] = useState(false);

    const renderEditorSideBar = () => {
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
        let stateIcon = (<LinkOffIcon sx={{color: alpha(theme.palette.text.primary, 0.6)}}/>)
        if (workspaceState !== null) {
            if (workspaceState === 1) {
                stateTooltipTitle = "Connected To DevSpace"
                stateIcon = (<LinkIcon sx={{color: theme.palette.success.main}}/>)
            } else if (workspaceState === 0) {
                stateTooltipTitle = "Connecting To DevSpace"
                stateIcon = (<CircularProgress size={24} sx={{color: alpha(theme.palette.text.primary, 0.6)}}/>)
            }
        }


        return (
            <Box
                id="editor-sidebar"
                display={"flex"}
                flexDirection={"column"}
                sx={{
                    position: "relative",
                    width: "fit-content",
                    padding: "0px",
                    gap: "10px",
                    height: "100%"
                }}
            >
                {(activeSidebarTab === null || activeSidebarTab === "nextSteps") && activeFileIdx >= 0 && code[activeFileIdx] && (
                    <ByteNextStep
                        trigger={nextStepsPopup}
                        acceptedCallback={() => {
                            setNextStepsPopup(false)
                        }}
                        onExpand={() => setActiveSidebarTab("nextSteps")}
                        onHide={() => setActiveSidebarTab(null)}
                        currentCode={code[activeFileIdx].content}
                        maxWidth="20vw"
                        bytesID={id || ""}
                        // @ts-ignore
                        bytesDescription={byteData ? byteData[`description_${difficultyToString(determineDifficulty())}`] : ""}
                        // @ts-ignore
                        bytesDevSteps={byteData ? byteData[`dev_steps_${difficultyToString(determineDifficulty())}`] : ""}
                        bytesLang={programmingLanguages[byteData ? byteData.lang : 5]}
                        codePrefix={codeBeforeCursor}
                        codeSuffix={codeAfterCursor}
                        containerRef={containerRef}
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
                            handleScribeDataHog();
                            markComplete();
                            setSuggestionPopup(true);
                            recordByteAttemptCheck(true);
                            checkNumberMastered(true);
                            completionFailureRate(true);
                            if (!triggered) {
                                setTriggered(true);
                                displayCheckedProgressions();
                            }
                        }}
                        onFail={() => {
                            handleScribeDataHog();
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
                        maxWidth={"20vw"}
                        codeOutput={output?.merged || ""}
                        nextByte={getNextByte()}
                        containerRef={containerRef}
                        journey={isJourney}
                        current_difficulty={difficultyToString(determineDifficulty())}
                        onTryHarderVersionClick={handleTryHarderVersionClick}
                        nodeBelowId={nodeBelow}
                    />
                )}
                {(activeSidebarTab === null || activeSidebarTab === "codeSuggestion") && activeFileIdx >= 0 && code[activeFileIdx] && (
                    <ByteSuggestions2
                        range={suggestionRange}
                        editorRef={editorRef}
                        onExpand={() => setActiveSidebarTab("codeSuggestion")}
                        onHide={() => setActiveSidebarTab(null)}
                        lang={programmingLanguages[byteData ? byteData.lang : 5]}
                        code={code[activeFileIdx].content}
                        byteId={id || ""}
                        // @ts-ignore
                        description={byteData ? byteData[`description_${difficultyToString(determineDifficulty())}`] : ""}
                        // @ts-ignore
                        dev_steps={byteData ? byteData[`dev_steps_${difficultyToString(determineDifficulty())}`] : ""}
                        maxWidth={"20vw"}
                        acceptedCallback={acceptCodeSuggestionCallback}
                        rejectedCallback={() => {
                            setSuggestionRange(null)
                            setLoadingCodeCleanup(null)
                        }}
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
                        maxWidth={"20vw"}
                    />
                )}
                {(activeSidebarTab === null || activeSidebarTab === "journeyHandout") && journeyUnitData !== null && (
                    <JourneyHandoutPlugin
                        handoutContent={journeyUnitData.handout}
                        onExpand={() => setActiveSidebarTab("journeyHandout")}
                        onHide={() => setActiveSidebarTab(null)}
                        maxWidth={"20vw"}
                    />
                )}
                {isHarderVersionPopupVisible && (
                    <Dialog
                        open={isHarderVersionPopupVisible}
                        onClose={() => setIsHarderVersionPopupVisible(false)}
                        aria-labelledby="change-difficulty-dialog-title"
                    >
                        <DialogTitle id="change-difficulty-dialog-title">Change Difficulty</DialogTitle>
                        <DialogContent>
                            <DifficultyAdjuster
                                difficulty={determineDifficulty()}
                                onChange={(newDifficulty) => {
                                    updateDifficulty(newDifficulty);
                                    setIsHarderVersionPopupVisible(false);
                                }}
                            />
                        </DialogContent>
                    </Dialog>
                )}
                {activeSidebarTab === null && (
                    <Tooltip title={stateTooltipTitle}>
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: "10px",
                                height: "30px",
                                width: "30px",
                                marginLeft: "10px",
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

    if (window.innerWidth < 1000) {
        navigate.push("/")
    }

    const goToCodeCallback = async (filePath: string, startLine: number, endLine: number) => {
        // Check if the active file needs to be switched
        if (activeFile !== filePath) {
            // Assuming setActiveFile is asynchronous and returns a Promise
            // If not, you may need to implement a way to wait for the file switch to complete
            setActiveFile(filePath);
            // Ensuring the editor state has updated before highlighting
            await new Promise(resolve => setTimeout(resolve, 300)); // Wait for the UI to update
        }

        // Check if the editor is correctly set up
        if (editorRef.current && editorRef.current.view) {
            // Highlight the range of lines
            ctHighlightCodeRangeFullLines(editorRef.current.view, startLine, endLine);

            // Set a timeout to remove the highlight
            setTimeout(() => {
                if (editorRef.current && editorRef.current.view) {
                    removeCtHighlightCodeRange(editorRef.current.view, startLine, endLine);
                }
            }, 3000);
        }
    }

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
                        <br/>
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

    const renderAdminPopup = () => {
        let difficulty = determineDifficulty()
        return (
            <Dialog
                open={adminPopup}
                maxWidth={'sm'}
                onClose={() => {
                    setAdminPopup(false)
                    setAdminPopupCommitLoading(false)
                    setAdminPopupCommitFailed(null)
                }}
            >
                <DialogTitle>Admin Update Byte</DialogTitle>
                <DialogContent>
                    <Typography variant={"body2"}>
                        Are you sure you want to submit the current code as an admin edit? This action cannot be undone.<br/><br/>
                        You code will be applied to the difficulty: <b>{difficultyToString(difficulty)}</b>
                    </Typography>
                    {adminPopupCommitFailed !== null && (
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            mt: 2,
                            border: `1px solid ${theme.palette.error.main}`,
                            borderRadius: '10px',
                            padding: '10px',
                        }}>
                            <Typography variant={"body2"} sx={{fontSize: "0.8em", color: theme.palette.error.main}}>
                                {adminPopupCommitFailed}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        color={"error"}
                        variant={"outlined"}
                        onClick={() => {
                            setAdminPopup(false)
                        }}
                    >
                        Cancel
                    </Button>
                    <LoadingButton
                        loading={adminPopupCommitLoading}
                        color={"success"}
                        variant={"outlined"}
                        onClick={() => {
                            if (id === undefined || id === null || byteData === undefined || byteData === null) {
                                return
                            }

                            setAdminPopupCommitLoading(true)
                            globalWs.sendWebsocketMessage({
                                sequence_id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
                                type: WsMessageType.AdminUpdateByteCodeRequest,
                                payload: {
                                    byte_id: id,
                                    content_difficulty: difficulty,
                                    files: code.map(x => ({
                                        content: x.content,
                                        file_name: x.file_name
                                    }))
                                }
                            } satisfies WsMessage<AdminUpdateByteCodeRequest>, (msg: WsMessage<AdminUpdateByteCodeResponse | WsGenericErrorPayload | WsValidationErrorPayload>): boolean => {
                                if (msg.type !== WsMessageType.AdminUpdateByteCodeResponse) {
                                    console.log("failed to update byte: ", msg)
                                    setAdminPopupCommitFailed("Byte update failed:\n" + JSON.stringify(msg))
                                    return true
                                }

                                setAdminPopup(false)
                                setAdminPopupCommitLoading(false)
                                setAdminPopupCommitFailed(null)
                                return true
                            })
                        }}
                    >
                        Confirm
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        )
    }

    const containerRef = useRef(null)

    const bytesPage = () => {
        let lang = mapFilePathToLangOption(activeFile)

        return (
            <>
                <Container maxWidth="xl" style={containerStyle}>
                    <Box sx={topContainerStyle} ref={containerRef}>
                        <Box sx={difficultyAdjusterStyle}>
                            <DifficultyAdjuster
                                difficulty={determineDifficulty()}
                                onChange={updateDifficulty}
                            />
                        </Box>

                        {byteData ? (
                            <Typography variant="h4" component="h1" style={titleStyle}>
                                {byteData.name}
                            </Typography>
                        ) : (
                            <Box sx={titlePlaceholderContainerStyle}>
                                <Box sx={titlePlaceholderStyle}>
                                    <SheenPlaceholder width="400px" height={"45px"}/>
                                </Box>
                            </Box>
                        )}
                        {byteData && authState.role === 1 && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 25,
                                    right: 35,
                                }}
                            >
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => setAdminPopup(true)}
                                >
                                    Submit Admin Edit
                                </Button>
                            </Box>
                        )}
                    </Box>
                    <div style={mainLayoutStyle}>
                        <div style={combinedSectionStyle}>
                            <div style={markdownSectionStyle} id="byte-chat-container">
                                {byteData && id !== undefined && (
                                    <ByteChat
                                        byteID={id}
                                        // @ts-ignore
                                        description={byteData ? byteData[`description_${difficultyToString(determineDifficulty())}`] : ""}
                                        // @ts-ignore
                                        devSteps={byteData ? byteData[`dev_steps_${difficultyToString(determineDifficulty())}`] : ""}
                                        // @ts-ignore
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
                                        containerRef={containerRef}
                                        goToCallback={goToCodeCallback}
                                    />
                                )}
                            </div>
                            <Box
                                id={"editor-section"}
                                style={editorAndTerminalStyle}
                                ref={editorContainerRef}
                            >
                                {byteData && (
                                    <Tooltip title={programmingLanguages[byteData.lang]}>
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                right: '16px',
                                                bottom: terminalVisible ? '228px' : '18px',
                                                zIndex: 3,
                                                minWidth: 0,
                                            }}
                                        >
                                            <BytesLanguage language={lang ? lang.extensions[0] : "py"}/>
                                        </Box>
                                    </Tooltip>
                                )}
                                <Box
                                    display={"inline-flex"}
                                    justifyContent={"space-between"}
                                    sx={{
                                        width: "100%",
                                        marginBottom: "8px"
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
                                        TabIndicatorProps={{sx: {display: "none"}}}
                                    >
                                        <EditorTab icon={<Add/>} aria-label="New file"/>
                                        {code.map((file, index) => (
                                            <EditorTab
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
                                                            sx={{marginLeft: 0.5, padding: '2px', fontSize: "12px"}}
                                                        >
                                                            <CloseIcon fontSize="inherit"/>
                                                        </IconButton>
                                                    </div>
                                                }
                                            />
                                        ))}
                                    </EditorTabs>
                                    <Box
                                        display={"inline-flex"}
                                    >
                                        {activeFileIdx >= 0 && code[activeFileIdx] && code[activeFileIdx].content.length > 0 && lang?.execSupported && (
                                            <Tooltip title="Run Code">
                                                <LoadingButton
                                                    loading={executingCode}
                                                    variant="outlined"
                                                    color={"success"}
                                                    sx={{
                                                        zIndex: 3,
                                                        m: 0,
                                                        p: 0,
                                                        fontSize: "0.7rem !important",
                                                    }}
                                                    onClick={() => {
                                                        setOutputPopup(false);
                                                        buttonClickedRef.current = true;
                                                        if (!authState.authenticated) {
                                                            navigate.push("/signup?forward=" + encodeURIComponent(window.location.pathname))
                                                            return
                                                        }

                                                        executeCode(); // Indicate button click

                                                        // addNotificationToQueue({
                                                        //     progression: 'data_hog',
                                                        //     achievement: false,
                                                        //     progress: "",
                                                        //     data: null
                                                        // })

                                                        // addNotificationToQueue({
                                                        //     progression: 'scribe',
                                                        //     achievement: false,
                                                        //     progress: "",
                                                        //     data: null
                                                        // })
                                                    }}
                                                >
                                                    Run <PlayArrow fontSize={"small"}/>
                                                </LoadingButton>
                                            </Tooltip>
                                        )}
                                    </Box>
                                </Box>
                                <Editor
                                    ref={editorRef}
                                    parentStyles={editorStyle}
                                    language={lang ? lang.extensions[0] : "py"}
                                    filePath={activeFileIdx >= 0 && code[activeFileIdx] ? code[activeFileIdx].file_name : ""}
                                    code={activeFileIdx >= 0 && code[activeFileIdx] ? code[activeFileIdx].content : ""}
                                    theme={theme.palette.mode}
                                    readonly={!authState.authenticated}
                                    onChange={(val, view) => handleEditorChange(val)}
                                    onCursorChange={(bytePosition, line, column) => setCursorPosition({
                                        row: line,
                                        column: column
                                    })}
                                    lspUrl={byteData && lang && lang.lspSupport && lspActive ? `wss://${byteData._id}-lsp.${config.coderPath.replace("https://", "")}` : undefined}
                                    byteId={id}
                                    difficulty={difficultyToString(determineDifficulty())}
                                    diagnosticLevel={selectDiagnosticLevel()}
                                    extensions={popupExtRef.current ? editorExtensions.concat(popupExtRef.current) : editorExtensions}
                                    wrapperStyles={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: "10px",
                                        ...(
                                            // default
                                            workspaceState === null ? {} :
                                                // starting or active
                                                workspaceState === 1 ?
                                                    {border: `1px solid ${theme.palette.primary.main}`} :
                                                    {border: `1px solid grey`}
                                        )
                                    }}
                                />
                                {terminalVisible && output && (
                                    <ByteTerminal
                                        output={output}
                                        onClose={handleCloseTerminal}
                                        onStop={() => cancelCodeExec(commandId)}
                                        onInputSubmit={(input: string) => stdInExecRequest(commandId, input)}
                                        isRunning={executingCode}
                                    />
                                )}
                            </Box>
                            {renderEditorSideBar()}
                        </div>
                        <div style={byteSelectionMenuStyle}>
                            {recommendedBytes &&
                                <ByteSelectionMenu bytes={recommendedBytes} onSelectByte={handleSelectByte}/>}
                        </div>
                    </div>
                </Container>
                {parsedSymbols !== null ? codeActionPortals.map(x => x.portal) : null}
            </>
        )
    }

    const testNotificationPopups = () => {
        // Test Data Hog notification
        addNotificationToQueue({
            progression: 'data_hog',
            achievement: false,
            progress: 500,
            data: null
        });

        // Test Hungry Learner notification
        addNotificationToQueue({
            progression: 'hungry_learner',
            achievement: false,
            progress: 5,
            data: null
        });

        // Test Man on the Inside notification
        addNotificationToQueue({
            progression: 'man_of_the_inside',
            achievement: false,
            progress: 10,
            data: null
        });

        // Test The Scribe notification
        addNotificationToQueue({
            progression: 'scribe',
            achievement: false,
            progress: 20,
            data: null
        });

        // Test Tenacious notification
        addNotificationToQueue({
            progression: 'tenacious',
            achievement: false,
            progress: 3,
            data: null
        });

        // Test Hot Streak notification
        addNotificationToQueue({
            progression: 'hot_streak',
            achievement: true,
            progress: 3,
            data: null
        });

        // Test Unit Mastery notification
        addNotificationToQueue({
            progression: 'unit_mastery',
            achievement: false,
            progress: 1,
            data: null
        });

        // Test XP Popup notification
        addNotificationToQueue({
            progression: '',
            achievement: '',
            progress: '',
            data: {
                xp_update: {
                    old_xp: 500,
                    new_xp: 750,
                    old_renown: null,
                    new_renown: 100,
                    current_renown: 100,
                    old_level: 5,
                    new_level: 6,
                    next_level: 7,
                    max_xp_for_lvl: 1000
                },
                level_up_reward: null
            }
        });
    }

    const journeyBytesPage = () => {
        let lang = mapFilePathToLangOption(activeFile)

        console.log("journeyBytesPage lsp: ", byteData && lang && lang.lspSupport && lspActive ? `wss://${byteData._id}-lsp.${config.coderPath.replace("https://", "")}` : undefined)

        return (
            <>
                <Container maxWidth="xl" style={containerStyle}>
                    <Box sx={{
                        position: "relative",
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0rem',
                    }} ref={containerRef}>
                        {byteData ? (
                            <Typography variant="h4" component="h1" style={titleStyle}>
                                {byteData.name}
                            </Typography>
                        ) : (
                            <Box sx={titlePlaceholderContainerStyle}>
                                <Box sx={titlePlaceholderStyle}>
                                    <SheenPlaceholder width="400px" height={"45px"}/>
                                </Box>
                            </Box>
                        )}
                        {byteData && authState.role === 1 && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 25,
                                    right: 35,
                                }}
                            >
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => setAdminPopup(true)}
                                >
                                    Submit Admin Edit
                                </Button>
                            </Box>
                        )}
                    </Box>
                    <div style={mainLayoutStyle}>
                        <div style={{
                            display: 'flex',
                            height: '80vh',
                            width: '95vw',
                            marginLeft: '30px',
                            marginRight: 'auto',
                            borderRadius: theme.shape.borderRadius,
                            overflow: 'hidden',
                            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
                            border: `1px solid ${theme.palette.grey[300]}`,
                            padding: "10px",
                            backgroundColor: theme.palette.background.default
                        }}>
                            <div style={markdownSectionStyle} id="byte-chat-container">
                                {byteData && id !== undefined && (
                                    <ByteChat
                                        byteID={id}
                                        // @ts-ignore
                                        description={byteData ? byteData[`description_${difficultyToString(determineDifficulty())}`] : ""}
                                        // @ts-ignore
                                        devSteps={byteData ? byteData[`dev_steps_${difficultyToString(determineDifficulty())}`] : ""}
                                        // @ts-ignore
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
                                        containerRef={containerRef}
                                        goToCallback={goToCodeCallback}
                                    />
                                )}
                            </div>
                            <Box
                                id={"editor-section"}
                                style={editorAndTerminalStyle}
                                ref={editorContainerRef}
                            >
                                {byteData && (
                                    <Tooltip title={programmingLanguages[byteData.lang]}>
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                right: '16px',
                                                bottom: terminalVisible ? '228px' : '18px',
                                                zIndex: 3,
                                                minWidth: 0,
                                            }}
                                        >
                                            <BytesLanguage language={lang ? lang.extensions[0] : "py"}/>
                                        </Box>
                                    </Tooltip>
                                )}
                                <Box
                                    display={"inline-flex"}
                                    justifyContent={"space-between"}
                                    sx={{
                                        width: "100%",
                                        marginBottom: "8px"
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
                                        TabIndicatorProps={{sx: {display: "none"}}}
                                    >
                                        <EditorTab icon={<Add/>} aria-label="New file"/>
                                        {code.map((file, index) => (
                                            <EditorTab
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
                                                            sx={{marginLeft: 0.5, padding: '2px', fontSize: "12px"}}
                                                        >
                                                            <CloseIcon fontSize="inherit"/>
                                                        </IconButton>
                                                    </div>
                                                }
                                            />
                                        ))}
                                    </EditorTabs>
                                    <Box
                                        display={"inline-flex"}
                                    >
                                         {/* <Button onClick={() => {testNotificationPopups()}}> TEST</Button> */}
                                        {activeFileIdx >= 0 && code[activeFileIdx] && code[activeFileIdx].content.length > 0 && lang?.execSupported && (
                                            <Tooltip title="Run Code">
                                                <LoadingButton
                                                    loading={executingCode}
                                                    variant="outlined"
                                                    color={"success"}
                                                    sx={{
                                                        zIndex: 3,
                                                        m: 0,
                                                        p: 0,
                                                        fontSize: "0.7rem !important",
                                                    }}
                                                    onClick={() => {
                                                        setOutputPopup(false);
                                                        buttonClickedRef.current = true;
                                                        if (!authState.authenticated) {
                                                            navigate.push("/signup?forward=" + encodeURIComponent(window.location.pathname))
                                                            return
                                                        }

                                                        executeCode(); // Indicate button click
                                                    }}
                                                >
                                                    Run <PlayArrow fontSize={"small"}/>
                                                </LoadingButton>
                                            </Tooltip>
                                        )}
                                    </Box>
                                </Box>
                                <Editor
                                    ref={editorRef}
                                    parentStyles={editorStyle}
                                    language={lang ? lang.extensions[0] : "py"}
                                    filePath={activeFileIdx >= 0 && code[activeFileIdx] ? code[activeFileIdx].file_name : ""}
                                    code={activeFileIdx >= 0 && code[activeFileIdx] ? code[activeFileIdx].content : ""}
                                    theme={theme.palette.mode}
                                    readonly={!authState.authenticated}
                                    onChange={(val, view) => handleEditorChange(val)}
                                    onCursorChange={(bytePosition, line, column) => setCursorPosition({
                                        row: line,
                                        column: column
                                    })}
                                    lspUrl={byteData && lang && lang.lspSupport && lspActive ? `wss://${byteData._id}-lsp.${config.coderPath.replace("https://", "")}` : undefined}
                                    byteId={id}
                                    difficulty={difficultyToString(determineDifficulty())}
                                    diagnosticLevel={selectDiagnosticLevel()}
                                    extensions={popupExtRef.current ? editorExtensions.concat(popupExtRef.current) : editorExtensions}
                                    wrapperStyles={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: "10px",
                                        ...(
                                            // default
                                            workspaceState === null ? {} :
                                                // starting or active
                                                workspaceState === 1 && lspActive ?
                                                    {border: `1px solid ${theme.palette.primary.main}`} :
                                                    {border: `1px solid grey`}
                                        )
                                    }}
                                />
                                {terminalVisible && output && (
                                    <ByteTerminal
                                        output={output}
                                        onClose={handleCloseTerminal}
                                        onStop={() => cancelCodeExec(commandId)}
                                        onInputSubmit={(input: string) => stdInExecRequest(commandId, input)}
                                        isRunning={executingCode}
                                    />
                                )}
                            </Box>
                            {renderEditorSideBar()}
                        </div>
                    </div>
                </Container>
                {parsedSymbols !== null ? codeActionPortals.map(x => x.portal) : null}
            </>
        )
    }

    const DesktopVideo = ({videoSrc, height, width}: { videoSrc: string, height?: string, width?: string }) => {
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
                                    <DesktopVideo height={"250px"} width={"154px"} videoSrc={ctVideo1}/>
                                    <Box sx={{marginLeft: "20px", width: "400px"}}>
                                        <h2 style={styles.tutorialHeader}>Code Teacher</h2>
                                        <p style={styles.tutorialText}>
                                            Code Teacher is a personal tutor system integrated directly into Bytes.
                                            Code Teacher is designed to help you learn to code as fast as possible.
                                        </p>
                                    </Box>
                                </Box>
                            ),
                            targetId: "byte-chat-container",
                            width: "625px",
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
                                    <DesktopVideo height={"320px"} width={"460px"} videoSrc={ctVideo2}/>
                                    <Box sx={{width: "450px"}}>
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
                                <Box sx={{width: "450px"}}>
                                    <p style={styles.tutorialText}>
                                        Code Teacher knows about your Byte objectives and can help explain what you
                                        are supposed to be doing. Think of CT as your personal tutor in the Byte
                                        and take advantage of the knowledge CT can provide.
                                    </p>
                                </Box>
                            ),
                            targetId: "byte-chat-container",
                            width: "520px",
                            height: "calc(50vh + 10px)"
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
                                    <DesktopVideo height={"250px"} width={"154px"} videoSrc={ctVideo3}/>
                                    <Box sx={{marginLeft: "20px", width: "400px"}}>
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
                            width: "625px",
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
                                    <DesktopVideo height={"250px"} width={"200px"} videoSrc={ctVideo4}/>
                                    <Box sx={{marginLeft: "20px", width: "400px"}}>
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
                            targetId: "editor-sidebar",
                            width: "660px",
                            left: true
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
                                    <DesktopVideo height={"250px"} width={"200px"} videoSrc={ctVideo5}/>
                                    <Box sx={{marginLeft: "20px", width: "400px"}}>
                                        <h2 style={styles.tutorialHeader}>Editor Sidebar</h2>
                                        <p style={styles.tutorialText}>
                                            The right side of the editor is your Editor Sidebar and contains multiple
                                            tools to help you learn. Click &quot;More Info&quot; to see a full list of tools.
                                        </p>
                                    </Box>
                                </Box>
                            ),
                            moreInfo: (
                                <Box sx={{width: "450px"}}>
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
                            width: "680px",
                            left: true
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
                                    <DesktopVideo height={"260px"} width={"460px"} videoSrc={ctVideo6}/>
                                    <Box sx={{width: "450px"}}>
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
                                <Box sx={{width: "450px"}}>
                                    <p style={styles.tutorialText}>
                                        When you Run your code output console will appear at the bottom of the editor
                                        and show you the output of your code. A text box will also appear in the console
                                        so you can pass in input to your code.
                                    </p>
                                </Box>
                            ),
                            targetId: "editor-section",
                            width: "520px",
                            height: "calc(50vh + 10px)",
                            left: true
                        },
                    ]}
                />
            </>
        )
    }

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
                // If the notification has xpData, add it to the front of the queue
                return [...prevQueue, { ...notification, id: new Date().getTime() }];
            } else {
                // Otherwise, add it to the end of the queue
                return [{ ...notification, id: new Date().getTime() }, ...prevQueue];
            }
        });
    };
    return (
        <>
            {(isJourney) ? journeyBytesPage() : bytesPage()}
            {renderNewFilePopup()}
            {renderDeleteFilePopup()}
            {renderTutorial()}
            <OutOfHearts open={outOfHearts} onClose={() => navigate.push("/journey")} onGoPro={() => setProPopupOpen(true)}/>
            <GoProDisplay open={proPopupOpen} onClose={() => setProPopupOpen(false)}/>
            {currentNotification && (
                <ProgressionNotification
                    progression={currentNotification.progression}
                    achievement={currentNotification.achievement}
                    progress={currentNotification.progress}
                    onClose={handleNotificationClose}
                    xpData={currentNotification.data}
                />
            )}
        </>
    );
}

export default BytePage;
