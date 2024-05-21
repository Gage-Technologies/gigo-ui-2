'use client';
import {
    Box,
    Button,
    Container,
    createTheme,
    CssBaseline,
    Dialog, DialogActions,
    DialogContent, DialogTitle,
    Grid, IconButton,
    List,
    ListItemButton,
    PaletteMode,
    Paper,
    SpeedDial,
    TextField,
    Theme,
    ThemeProvider,
    Tooltip,
    Typography
} from "@mui/material";
import * as React from "react";
import { useEffect, useState } from "react";
import {getAllTokens, theme} from "@/theme";
import { styled } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import CodeIcon from '@mui/icons-material/Code';
import { useGlobalCtWebSocket } from "@/services/ct_websocket";
import {
    CtChatMessageType,
    CtCodeFile,
    CtGenericErrorPayload,
    CtGetHHChatsRequest,
    CtGetHHChatsResponse,
    CtGetHHChatsResponseChat,
    CtMessage,
    CtMessageOrigin,
    CtMessageType,
    CtNewHhChatRequest,
    CtNewHhChatResponse,
    CtValidationErrorPayload
} from "@/models/ct_websocket";
import { useAppSelector } from "@/reducers/hooks";
import { selectAuthState } from "@/reducers/auth/auth";
import GoProDisplay from "@/components/GoProDisplay";
import proGorillaCrown from "@/img/pro-pop-up-icon-plain.svg";
import {useRouter, useSearchParams} from "next/navigation";
import Image from "next/image"
import {format, formatDistanceToNow, parseISO} from "date-fns";
import MenuIcon from "@mui/icons-material/Menu";
import {LoadingButton, SpeedDialAction} from "@mui/lab";
import {Add, LibraryBooks} from "@mui/icons-material";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import Slide from "@mui/material/Slide";
import {EditorTab, EditorTabs} from "@/components/IDE/EditorTabs";
import CloseIcon from "@mui/icons-material/Close";
import config from "@/config";
import Editor from "@/components/IDE/Editor";

interface LanguageOption {
    name: string;
    extensions: string[];
    languageId: number;
    execSupported: boolean;
}

const languages: LanguageOption[] = [
    { name: 'Go', extensions: ['go'], languageId: 6, execSupported: true },
    { name: 'Python', extensions: ['py', 'pytho', 'pyt'], languageId: 5, execSupported: true },
    { name: 'C++', extensions: ['cpp', 'cc', 'cxx', 'hpp', 'c++', 'h'], languageId: 8, execSupported: false },
    { name: 'HTML', extensions: ['html', 'htm'], languageId: 27, execSupported: false },
    { name: 'Java', extensions: ['java'], languageId: 2, execSupported: false },
    { name: 'JavaScript', extensions: ['js'], languageId: 3, execSupported: true },
    { name: 'JSON', extensions: ['json'], languageId: 1, execSupported: false },
    { name: 'Markdown', extensions: ['md'], languageId: 1, execSupported: false },
    { name: 'PHP', extensions: ['php'], languageId: 13, execSupported: false },
    { name: 'Rust', extensions: ['rs'], languageId: 14, execSupported: true },
    { name: 'SQL', extensions: ['sql'], languageId: 34, execSupported: false },
    { name: 'XML', extensions: ['xml'], languageId: 1, execSupported: false },
    { name: 'LESS', extensions: ['less'], languageId: 1, execSupported: false },
    { name: 'SASS', extensions: ['sass', 'scss'], languageId: 1, execSupported: false },
    { name: 'Clojure', extensions: ['clj'], languageId: 21, execSupported: false },
    { name: 'C#', extensions: ['cs'], languageId: 10, execSupported: true },
    { name: 'Shell', extensions: ['bash', 'sh'], languageId: 38, execSupported: true },
    { name: 'Toml', extensions: ['toml'], languageId: 14, execSupported: true }
];

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

const InitStyledContainer = styled(Container)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: 'calc(100vh - 72px)',
    transition: theme.transitions.create(['height', 'max-width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
}));

const SearchContainer = styled(Paper)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: "none",
    background: "transparent"
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    padding: theme.spacing(0.5),
    backgroundColor: theme.palette.background.default,
}));

interface InitProps {
    theme: Theme;
    toggleEditor: () => void;
    submit: (content: string) => void;
}

const HomeworkHelperInit = ({ theme, toggleEditor, submit }: InitProps) => {
    const [active, setActive] = React.useState(false);
    const [text, setText] = React.useState("");
    const [goProPopup, setGoProPopup] = useState(false);

    let router = useRouter();
    let query = useSearchParams();

    const authState = useAppSelector(selectAuthState);

    const [leftOpen, setLeftOpen] = React.useState(query.get("menu") === "true");
    const [rightOpen, setRightOpen] = React.useState(query.get("chat") === "true" && authState.authenticated);

    useEffect(() => {
        let unAuthReq = localStorage.getItem('gigo:unauth:hh');
        if (unAuthReq !== null) {
            setText(unAuthReq)
            return
        }
    }, []);

    let plugPosition = 260;
    if (leftOpen) {
        plugPosition += 100
    }
    if (rightOpen) {
        plugPosition += 150
    }

    const renderGoProPlug = () => {
        if (text.split("\n").length > 3) {
            return (
                <Box sx={{
                    position: "relative",
                    width: "520px",
                    backgroundColor: theme.palette.background.default,
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2), 0 6px 20px rgba(0,0,0,0.19)",
                    padding: "10px",
                    display: "flex",
                    flexDirection: "row", // Stack items horizontally
                    alignItems: "flex-start", // Align items to the left
                    justifyContent: "space-between", // Even spacing
                    height: "auto",
                    border: `1px solid ${theme.palette.primary.main}`,
                    bottom: "80px",
                    left: `calc(50vw - ${plugPosition}px)`
                }} id={"pro-banner"}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start", // Left align the title and subtitle
                        paddingTop: "12px"
                    }}>
                        <h2 style={{ margin: "0 0 4px 0", textAlign: "left", fontSize: "18px" }}>Want better help on your
                            homework?</h2>
                    </Box>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "right", // Center the button
                        marginTop: "6px", // Add space above the button
                        marginBottom: "6px",
                        float: "right"
                    }}>
                        <Button style={{
                            padding: "8px 16px",
                            fontSize: "14px",
                        }} variant={"outlined"} onClick={() => setGoProPopup(true)}>Go Pro</Button>
                    </Box>
                </Box>
            )
        }

        return (
            <Box sx={{
                position: "relative",
                width: "520px",
                backgroundColor: theme.palette.background.default,
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2), 0 6px 20px rgba(0,0,0,0.19)",
                padding: "10px",
                display: "flex",
                flexDirection: "column", // Stack items vertically
                alignItems: "flex-start", // Align items to the left
                justifyContent: "space-between", // Even spacing
                height: "auto",
                border: `1px solid ${theme.palette.primary.main}`,
                bottom: "165px",
                left: `calc(50vw - ${plugPosition}px)`
            }} id={"pro-banner"}>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start", // Left align the title and subtitle
                    width: "calc(100% - 120px)", // Adjust width to prevent overlap with image, assuming image width + some padding
                }}>
                    <h2 style={{ margin: "0 0 4px 0", textAlign: "left", fontSize: "18px" }}>Want better help on your
                        homework?</h2>
                    <p style={{
                        textAlign: "left",
                        margin: "0",
                        fontSize: "12px",
                        maxWidth: "100%", // Prevents subtitle from overlapping with the image
                    }}>
                        Go Pro to get smarter answers to your homework, evade AI detection tools, and access
                        advanced
                        features.
                    </p>
                </Box>
                <Box sx={{
                    width: "100%", // Full width for centering the button
                    display: "flex",
                    justifyContent: "center", // Center the button
                    marginTop: "8px", // Add space above the button
                }}>
                    <Button style={{
                        padding: "8px 16px",
                        fontSize: "14px",
                    }} variant={"outlined"} onClick={() => setGoProPopup(true)}>Go Pro</Button>
                </Box>
                <Box sx={{
                    position: "absolute",
                    top: "20px", // Adjust as needed
                    right: "20px", // Ensure it's aligned to the right
                    height: "80px", // Image size
                    width: "80px", // Image size
                }}>
                    <Image src={proGorillaCrown} alt={"GIGO Pro"} style={{ width: "100%", height: "auto" }} />
                </Box>
            </Box>
        )
    }

    return (
        <>
            <InitStyledContainer maxWidth={active || text.length > 0 ? "md" : "sm"}>
                <Box display={"inline-flex"} sx={{
                    textAlign: 'center',
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center"
                }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        GIGO Homework Helper
                    </Typography>
                    <Typography variant="caption" component="span" style={{ fontSize: '12px', marginLeft: '5px', textTransform: 'lowercase' }}>
                        [beta]
                    </Typography>
                </Box>
                <SearchContainer elevation={6}>
                    <StyledTextField
                        fullWidth
                        multiline
                        maxRows={16}
                        placeholder="Enter your homework question..."
                        onFocus={() => setActive(true)}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey && text.trim().length > 0) {
                                e.preventDefault();
                                submit(text)
                                setText("")
                            }
                            if (e.key === 'Tab') {
                                e.preventDefault();
                                setText(text + '    ');
                            }
                        }}
                        value={text}
                        InputProps={{
                            sx: {
                                padding: theme.spacing(3),
                                fontSize: text.length > 0 ? "medium" : undefined,
                                borderRadius: "20px"
                            },
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip title={"Add Code"}>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            sx={{ borderRadius: "50%", minWidth: "0px", p: 1 }}
                                            onClick={(e) => {
                                                toggleEditor()
                                            }}
                                        >
                                            <CodeIcon />
                                        </Button>
                                    </Tooltip>
                                </InputAdornment>
                            ),
                            'aria-label': 'ask',
                        }}
                    />
                </SearchContainer>
            </InitStyledContainer>
            {authState.authenticated && authState.role < 1 && renderGoProPlug()}
            <GoProDisplay open={goProPopup} onClose={() => setGoProPopup(false)} />
        </>
    );
};

function HomeworkHelper() {
    const authState = useAppSelector(selectAuthState);

    const [connectButtonLoading, setConnectButtonLoading] = useState<boolean>(false)
    const [speedDialOpen, setSpeedDialOpen] = React.useState(false);
    const [selectedChat, setSelectedChat] = React.useState<string | null>(null);
    const [chatSelectionOpen, setChatSelectionOpen] = React.useState(false);
    const [editorOpen, setEditorOpen] = React.useState(false);
    const [newFilePopup, setNewFilePopup] = React.useState(false);
    const [newFileName, setNewFileName] = React.useState("");
    const [deleteFileRequest, setDeleteFileRequest] = React.useState<string | null>(null);
    const [chats, setChats] = React.useState<CtGetHHChatsResponseChat[]>([]);
    const [workspaceId, setWorkspaceId] = useState<string>('');

    const [code, setCode] = React.useState<CtCodeFile[]>([]);
    const [activeFile, setActiveFile] = React.useState("");
    const [langSelectActive, setLangSelectActive] = React.useState(false)

    const navigate = useRouter();

    let ctWs = useGlobalCtWebSocket();

    useEffect(() => {
        if (!authState.authenticated) {
            setChats([])
            return
        }

        ctWs.sendWebsocketMessage({
                sequence_id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
                type: CtMessageType.WebSocketMessageTypeGetHHChatsRequest,
                origin: CtMessageOrigin.WebSocketMessageOriginClient,
                created_at: Date.now(),
                payload: {
                    partition: "default",
                    offset: 0,
                    limit: 100
                }
            } satisfies CtMessage<CtGetHHChatsRequest>,
            (msg: CtMessage<CtGenericErrorPayload | CtValidationErrorPayload | CtGetHHChatsResponse>): boolean => {
                if (msg.type !== CtMessageType.WebSocketMessageTypeGetHHChatsResponse) {
                    console.log("failed getting chats", msg)
                    return true;
                }

                let res = msg.payload as CtGetHHChatsResponse
                setChats(res.chats)
                return true;
            })
    }, [authState.authenticated]);

    const startNewChat = async (userMessage: string) => {
        // create a new promise that will return the chat id or null to us
        let resolver: (value: string | null) => void;
        const newChatPromise: Promise<string | null> = new Promise((resolve) => {
            resolver = resolve;
        });

        ctWs.sendWebsocketMessage({
                sequence_id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
                type: CtMessageType.WebSocketMessageTypeNewHHChatRequest,
                origin: CtMessageOrigin.WebSocketMessageOriginClient,
                created_at: Date.now(),
                payload: {
                    partition: "default"
                }
            } satisfies CtMessage<CtNewHhChatRequest>,
            (msg: CtMessage<CtGenericErrorPayload | CtValidationErrorPayload | CtNewHhChatResponse>): boolean => {
                if (msg.type !== CtMessageType.WebSocketMessageTypeNewHHChatResponse) {
                    console.log("failed to create new chat", msg)
                    resolver(null);
                    return true;
                }

                let res = msg.payload as CtNewHhChatResponse
                resolver(res.chat_id)
                return true;
            })

        // wait for the websocket to return the chat ID
        const chatId = await newChatPromise;
        if (chatId === null) {
            return
        }

        localStorage.setItem("user_message", JSON.stringify([{
            _id: "",
            chat_id: "",
            assistant_id: "",
            assistant_name: "",
            user_id: "",
            message_type: CtChatMessageType.User,
            content: userMessage,
            files: code,
            created_at: new Date(),
            message_number: 0,
            command: { command: "", lang: "" },
            premium_llm: false,
            free_credit_use: false
        }]))
        // console.log("initial message from init: ", JSON.parse(localStorage.getItem("user_message")!))
        localStorage.setItem("code", JSON.stringify(code))
        localStorage.setItem("hh_new", 'true')
        localStorage.setItem("workspace_id", workspaceId)
        // sendUserMessage(chatId, userMessage, false)
        navigate.push(`/homework/${chatId}`)
    }

    const clearChatState = () => {
        setCode([])
        setActiveFile("")
        setEditorOpen(false)
        setSelectedChat(null)
        navigate.push("/homework")
    }

    const createWorkspace = async (chatId: string): Promise<boolean> => {
        try {
            const response = await fetch(
                `${config.rootPath}/api/homework/createWorkspace`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        hh_id: chatId
                    }),
                    credentials: 'include'
                }
            ).then(res => res.json())

            const [res] = await Promise.all([response]);

            if (res === undefined) {
                return false;
            }

            if (res["message"] === "Workspace Created Successfully") {
                let workspace = res["workspace"]
                if (workspace["_id"] !== workspaceId) {
                    setWorkspaceId(workspace["_id"])
                }
                return true
            }
        } catch (error) {
           console.error("An error occurred while creating the byte workspace:", error);
        }
        return false
    };

    const createWorkspaceWithRetry = async (chatId: string | null) => {
        let created = false;
        if (chatId) {
            setConnectButtonLoading(true)
            for (let i = 0; i < 5; i++) {
                let created = await createWorkspace(chatId);
                if (created) {
                    break
                }

                if (i === 4) {
                    break
                }
            }
            setConnectButtonLoading(false)
        }
        return created
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
                                setCode(prev =>
                                    prev.concat({
                                        file_name: newFileName,
                                        code: "",
                                    })
                                )
                                setActiveFile(newFileName)
                                setNewFilePopup(false)
                                setEditorOpen(true)
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
                            setCode(prev =>
                                prev.concat({
                                    file_name: newFileName,
                                    code: "",
                                })
                            )
                            setActiveFile(newFileName)
                            setNewFilePopup(false)
                            setEditorOpen(true)
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
                            if (code.length === 1 && code[0].file_name === deleteFileRequest) {
                                setEditorOpen(false)
                            }
                            setCode(prev => prev.filter((f) => f.file_name !== deleteFileRequest))
                            setDeleteFileRequest(null)
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    const renderEditor = () => {
        if (!editorOpen) {
            return null
        }

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
                    onClick={() => createWorkspaceWithRetry(selectedChat)}
                >
                    Connect
                </LoadingButton>
            </Box>
        )

        let fileIndex = 0;
        let fileName = "New File"
        let fileContents = ""
        if (activeFile !== "") {
            let fidx = code.findIndex((f) => f.file_name === activeFile)
            if (fidx >= 0) {
                fileIndex = fidx
                fileName = code[fidx].file_name
                fileContents = code[fidx].code
            }
        }
        let lang = mapFilePathToLangOption(fileName)

        return (
            <Slide direction="left" in={editorOpen} mountOnEnter unmountOnExit>
                <Box
                    sx={{
                        paddingLeft: "20px",
                        paddingRight: "20px",
                    }}
                >
                    <Box
                        display={"inline-flex"}
                        justifyContent={"space-between"}
                        sx={{
                            width: "100%",
                            marginBottom: "8px"
                        }}
                    >
                        <EditorTabs
                            value={fileIndex + 1}
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
                            <EditorTab icon={<Add />} aria-label="New file" />
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
                                                sx={{ marginLeft: 0.5, padding: '2px', fontSize: "12px" }}
                                            >
                                                <CloseIcon fontSize="inherit" />
                                            </IconButton>
                                        </div>
                                    }
                                />
                            ))}
                        </EditorTabs>
                    </Box>
                    <Box
                        sx={{ position: "relative" }}
                    >
                        <Editor
                            // ref={editorRef}
                            editorStyles={{
                                fontSize: "0.7rem",
                                borderRadius: "10px",
                                outline: "none !important"
                            }}
                            parentStyles={{
                                height: "100%",
                                borderRadius: "10px",
                            }}
                            language={mapFilePathToLang(activeFile)}
                            code={fileContents}
                            theme={theme.palette.mode}
                            readonly={false}
                            onChange={(val, view) => {
                                if (val === undefined)
                                    return

                                setCode(prev => {
                                    let fidx = prev.findIndex((f) => f.file_name === activeFile)
                                    if (fidx >= 0) {
                                        prev[fidx].code = val
                                    } else {
                                        prev.push({
                                            file_name: activeFile,
                                            code: val,
                                        })
                                    }
                                    return prev
                                })
                            }}
                            wrapperStyles={{
                                width: '100%',
                                height: 'calc(100vh - 138px)',
                                borderRadius: "10px",
                                border: `1px solid ${theme.palette.primary.light}`
                            }}
                        />
                    </Box>
                </Box>
            </Slide>
        )
    }

    const renderActions = () => {
        return (
            <>
                <SpeedDial
                    ariaLabel="SpeedDial"
                    sx={{ position: 'fixed', bottom: 24, right: 16 }}
                    icon={<MenuIcon />}
                    open={speedDialOpen}
                    onOpen={() => setSpeedDialOpen(true)}
                    onClose={() => setSpeedDialOpen(false)}
                    onClick={() => setSpeedDialOpen(true)}
                >
                    <SpeedDialAction
                        key={"new"}
                        title={"New Homework"}
                        icon={<Add />}
                        onClick={clearChatState}
                    />
                    {chats.length > 0 && (
                        <SpeedDialAction
                            key={"history"}
                            icon={<LibraryBooks />}
                            title={"Homework History"}
                            onClick={() => setChatSelectionOpen(prev => !prev)}
                        />
                    )}
                </SpeedDial>
                <Dialog
                    open={chatSelectionOpen}
                    onClose={() => setChatSelectionOpen(false)}
                    maxWidth={"lg"}
                >
                    <DialogTitle>
                        Homework History
                    </DialogTitle>
                    <DialogContent
                        sx={{
                            maxHeight: "70vh",
                            minWidth: "400px"
                        }}
                    >
                        <List>
                            {chats.map((item, index) => (
                                <ListItemButton
                                    key={item._id}
                                    sx={{
                                        borderRadius: "10px"
                                    }}
                                    onClick={() => {
                                        navigate.push(`/homework/${item._id}`)
                                        setChatSelectionOpen(false)
                                    }}
                                >
                                    <Box
                                        display={"flex"}
                                        flexDirection={"column"}
                                    >
                                        {item.name}
                                        <Typography variant="caption" color="textPrimary" noWrap>
                                            {
                                                Date.now() - parseISO(item.last_message_at).getTime() > 86400000 ?
                                                    format(parseISO(item.last_message_at), 'MMMM d, yyyy') :
                                                    formatDistanceToNow(parseISO(item.last_message_at), { addSuffix: true })
                                            }
                                        </Typography>
                                    </Box>
                                </ListItemButton>
                            ))}
                        </List>
                    </DialogContent>
                </Dialog>
            </>
        )
    }

    let bodySize = 12;
    if (editorOpen) {
        bodySize -= 6
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline>
                <Box
                    sx={{ maxHeight: "calc(100vh - 72px)", overflow: "hidden", width: "100% !important" }}
                >
                    <Grid container sx={{ width: "100% !important" }}>
                        <Grid item xs={bodySize}>
                            <HomeworkHelperInit
                                theme={theme}
                                toggleEditor={() => {
                                    if (code.length === 0 && !editorOpen) {
                                        setNewFilePopup(true)
                                        return
                                    }
                                    setEditorOpen(!editorOpen)
                                }}
                                submit={(content: string) => {
                                    console.log("inside submit")
                                    if (!authState.authenticated) {
                                        localStorage.setItem("gigo:unauth:hh", content)
                                        navigate.push("/signup?forward=" + encodeURIComponent(window.location.pathname))
                                        return
                                    }
                                    if (localStorage.getItem("gigo:unauth:hh") !== null) {
                                        localStorage.removeItem("gigo:unauth:hh")
                                    }
                                    startNewChat(content)
                                }}
                            />
                        </Grid>
                        <Grid item xs={editorOpen ? 6 : 0} sx={{ height: "calc(100vh - 72px)", mt: 2, mb: 2 }}>
                            {renderEditor()}
                        </Grid>
                    </Grid>
                </Box>
                {renderActions()}
                {renderNewFilePopup()}
                {renderDeleteFilePopup()}
            </CssBaseline>
        </ThemeProvider>
    )
}

export default HomeworkHelper;
