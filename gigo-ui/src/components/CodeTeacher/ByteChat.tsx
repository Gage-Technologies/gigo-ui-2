import {
    alpha,
    Box,
    Button, ButtonBase,
    Card,
    CircularProgress, createTheme, Divider, Grid, IconButton, InputAdornment, PaletteMode, Popper,
    PopperPlacementType, Stack,
    styled,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import MarkdownRenderer from "../Markdown/MarkdownRenderer";
import {useGlobalCtWebSocket} from "@/services/ct_websocket";
import {
    CtByteAssistantMessage,
    CtByteChatMessage,
    CtByteChatMessagesRequest,
    CtByteChatMessagesResponse,
    CtByteMessageMessageType,
    CtByteNewOrGetChatRequest,
    CtByteNewOrGetChatResponse,
    CtByteUserMessage, CtCloseByteChatThreadRequest, CtCloseByteChatThreadResponse, CtCodeFile,
    CtGenericErrorPayload,
    CtMessage,
    CtMessageOrigin,
    CtMessageType,
    CtValidationErrorPayload
} from "@/models/ct_websocket";
import {initialAuthState, selectAuthState, selectAuthStateThumbnail} from "@/reducers/auth/auth";
import config from "../../config";
import UserIcon from "../UserIcon";
import {useAppDispatch, useAppSelector} from "@/reducers/hooks";
import ctIcon from "../../img/codeTeacher/CT-icon.svg"
import CodeTeacherChatIcon from "./CodeTeacherChatIcon";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import {getAllTokens} from "@/theme";
import ForumIcon from '@mui/icons-material/Forum';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {grey} from "@mui/material/colors";
import { initialBytesStateUpdate, selectBytesState, updateBytesState } from "@/reducers/bytes/bytes";
import {AddComment, Close} from "@material-ui/icons";
import GoProDisplay from "../GoProDisplay";
import createGoToRemark from "../Markdown/Extensions/GoToRemark";
import {simpleHash} from "@/services/utils";
import {useSearchParams} from "next/navigation";

const InitialSuggestionButton = styled(Button)`
    animation: initSuggestionButtonAuraEffect 2s infinite alternate;

    @keyframes initSuggestionButtonAuraEffect {
        0% {
            color: #84E8A2;
            border: 1px solid #84E8A2;
        }
        20% {
            color: #29C18C;
            border: 1px solid #29C18C;
        }
        40% {
            color: #1C8762;
            border: 1px solid #1C8762;
        }
        60% {
            color: #2A63AC;
            border: 1px solid #2A63AC;
        }
        80% {
            color: #3D8EF7;
            border: 1px solid #3D8EF7;
        }
        100% {
            color: #63A4F8;
            border: 1px solid #63A4F8;
        }
    }
`;


export type ByteChatProps = {
    byteID: string;
    description: string;
    devSteps: string;
    difficulty: string;
    code: CtCodeFile[];
    questions: [];
    containerRef: React.MutableRefObject<null>;
    goToCallback?: (filePath: string, startLine: number, endLine: number) => void;
};

export default function ByteChat(props: ByteChatProps) {

    let query = useSearchParams();
    let isMobile = query.get("viewport") === "mobile";
    const chatOpen = query.get("chat") === "true";
    const sidebarOpen = query.get("menu") === "true";

    let userPref = localStorage.getItem('theme');
    const [mode, _] = useState<PaletteMode>(userPref === 'light' ? 'light' : 'dark');
    const theme = React.useMemo(() => createTheme(getAllTokens(mode)), [mode]);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    let ctWs = useGlobalCtWebSocket();
    let authState = useAppSelector(selectAuthState);
    const bytesState = useAppSelector(selectBytesState)
    const thumbnail = useAppSelector(selectAuthStateThumbnail);

    const dispatch = useAppDispatch();

    enum State {
        WAITING = 'waiting',
        LOADING = 'loading',
        COMPLETED = 'completed'
    }

    const [disableChat, setDisableChat] = useState(false);
    const [chatId, setChatId] = useState("");
    const [response, setResponse] = useState("")
    const [state, setState] = useState<State>(State.WAITING)
    const [userMessage, setUserMessage] = useState('');
    const [goProPopup, setGoProPopup] = useState(false)
    const [messages, setMessages] = useState<CtByteChatMessage[]>([
        {
            _id: "init2",
            byte_id: props.byteID,
            byte_chat_id: props.byteID,
            assistant_id: "init",
            user_id: authState.id,
            thread_number: 0,
            message_type: CtByteMessageMessageType.Assistant,
            content: `Hey! I'm Code Teacher!`, // place the description and dev steps here
            created_at: new Date(0),
            message_number: -1,
            premium_llm: false,
            free_credit_use: false,
        },
        {
            _id: "init",
            byte_id: props.byteID,
            byte_chat_id: props.byteID,
            assistant_id: "init",
            user_id: authState.id,
            thread_number: 0,
            message_type: CtByteMessageMessageType.Assistant,
            content: `${props.description}`, // place the description and dev steps here
            created_at: new Date(0),
            message_number: -1,
            premium_llm: false,
            free_credit_use: false,
        },
        {
            _id: "init3",
            byte_id: props.byteID,
            byte_chat_id: props.byteID,
            assistant_id: "init",
            user_id: authState.id,
            thread_number: 0,
            message_type: CtByteMessageMessageType.Assistant,
            content: `Have Questions? Ask Me!`, // place the description and dev steps here
            created_at: new Date(0),
            message_number: -1,
            premium_llm: false,
            free_credit_use: false,
        },
    ]);
    const [threadVisibility, setThreadVisibility] = useState<{ [key: number]: boolean }>({});
    const [showButtons, setShowButtons] = useState(false);
    const [newChat, setNewChat] = useState(false)
    const textFieldRef = useRef<HTMLInputElement>(null)

    const checkScrollToBottom = () => {
        if (messagesContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
            const isAtBottom = scrollHeight - Math.ceil(scrollTop + clientHeight) <= 1;
            setIsAtBottom(isAtBottom);
            if (isAtBottom) {
                scrollToBottom();
            }
        }
    };

    const scrollToTop = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = 0;
        }
    };

    useEffect(() => {
        setChatId("");
        setResponse("")
        setState(State.WAITING)
        setUserMessage("")
        setThreadVisibility({});
        setShowButtons(false);
        setNewChat(false);

        if (props.byteID === undefined) {
            return
        }

        setMessages([
            {
                _id: "init2",
                byte_id: props.byteID,
                byte_chat_id: props.byteID,
                assistant_id: "init",
                user_id: authState.id,
                thread_number: 0,
                message_type: CtByteMessageMessageType.Assistant,
                content: `Hey! I'm Code Teacher!`, // place the description and dev steps here
                created_at: new Date(0),
                message_number: -1,
                premium_llm: false,
                free_credit_use: false,
            },
            {
                _id: "init",
                byte_id: props.byteID,
                byte_chat_id: props.byteID,
                assistant_id: "init",
                user_id: authState.id,
                thread_number: 0,
                message_type: CtByteMessageMessageType.Assistant,
                content: `${props.description}`, // place the description and dev steps here
                created_at: new Date(0),
                message_number: -1,
                premium_llm: false,
                free_credit_use: false,
            },
            {
                _id: "init3",
                byte_id: props.byteID,
                byte_chat_id: props.byteID,
                assistant_id: "init",
                user_id: authState.id,
                thread_number: 0,
                message_type: CtByteMessageMessageType.Assistant,
                content: `Have Questions? Ask Me!`, // place the description and dev steps here
                created_at: new Date(0),
                message_number: -1,
                premium_llm: false,
                free_credit_use: false,
            },
        ])

        if (authState.authenticated) {
            launchCTChat()
        }
    }, [props.byteID])

    useEffect(() => {
        if (!authState.authenticated) {
            return
        }
        scrollToTop()
        setNewChat(true)
        setThreadVisibility({ [currentThreadCount]: false })
    }, [props.description])

    const toggleThreadVisibility = (threadNumber: number) => {
        setThreadVisibility(prev => {
            const newVisibility = { ...prev, [threadNumber]: !prev[threadNumber] };
            // Trigger scroll check after state update to ensure DOM has updated
            setTimeout(() => {
                checkScrollToBottom();
            }, 0);
            return newVisibility;
        });
    };

    const [currentThreadCount, setCurrentThreadCount] = useState(0)

    const launchCTChat = () => {
        ctWs.sendWebsocketMessage({
            sequence_id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            type: CtMessageType.WebSocketMessageTypeNewByteChatOrGetRequest,
            origin: CtMessageOrigin.WebSocketMessageOriginClient,
            created_at: Date.now(),
            payload: {
                assistant_id: "",
                byte_id: props.byteID, // prop byte id
                owner_id: authState.id // get from page like usual
            }
        } satisfies CtMessage<CtByteNewOrGetChatRequest>, (msg: CtMessage<CtGenericErrorPayload | CtValidationErrorPayload | CtByteNewOrGetChatResponse>) => {
            if (msg.type !== CtMessageType.WebSocketMessageTypeNewByteChatOrGetResponse) {
                console.log("failed launching chat", msg)
                return true
            }
            const p: CtByteNewOrGetChatResponse = msg.payload as CtByteNewOrGetChatResponse;
            setChatId(p._id)
            setCurrentThreadCount(p.thread_count)
            return true
        })
    }

    useEffect(() => {
        setThreadVisibility({ [currentThreadCount]: true })
    }, [currentThreadCount]);


    // useEffect(() => {
    //     let m: CtByteChatMessage[] = JSON.parse(JSON.stringify(messages))
    //     let idx = m.findIndex(x => x._id === "init")
    //     if (idx !== undefined) {
    //         m[idx].content = `${props.description}`
    //         setMessages(m)
    //     }
    // }, [props.description]);

    useEffect(() => {
        if (chatId === "" || !authState.authenticated)
            return
        ctWs.sendWebsocketMessage({
            sequence_id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            type: CtMessageType.WebSocketMessageTypeGetByteChatMessageRequest,
            origin: CtMessageOrigin.WebSocketMessageOriginClient,
            created_at: Date.now(),
            payload: {
                byte_id: props.byteID, // prop byte id
                offset: 0,
                limit: 100
            }
        } satisfies CtMessage<CtByteChatMessagesRequest>, (msg: CtMessage<CtGenericErrorPayload | CtValidationErrorPayload | CtByteChatMessagesResponse>) => {
            if (msg.type !== CtMessageType.WebSocketMessageTypeGetByteChatMessageResponse) {
                console.log("failed getting chat messages", msg)
                return true
            }
            const p: CtByteChatMessagesResponse = msg.payload as CtByteChatMessagesResponse;

            // concat the messages
            let m: CtByteChatMessage[] = JSON.parse(JSON.stringify(messages))
            m = m.concat(p.messages)

            // sort the messages by message number
            m.sort((a: any, b: any) => a.message_number - b.message_number)

            // filter duplicate messages using the _id field
            let uniqueIds = new Set();
            let uniqueMessages: CtByteChatMessage[] = []
            for (let i = 0; i < m.length; i++) {
                if (!uniqueIds.has(m[i]._id)) {
                    uniqueIds.add(m[i]._id!)
                    uniqueMessages.push(m[i]);
                }
            }

            setMessages(uniqueMessages)
            setShowButtons(uniqueMessages[uniqueMessages.length-1].thread_number !== currentThreadCount)
            return true
        })
    }, [chatId])

    const sendUserCTChat = (overrideMessage?: string) => {
        if (!authState.authenticated) {
            return
        }

        setThreadVisibility({ [currentThreadCount]: true })
        setShowButtons(false)
        setDisableChat(true)
        setState(State.LOADING)
        const messageContent = overrideMessage !== undefined ? overrideMessage : userMessage
        let m: CtByteChatMessage[] = JSON.parse(JSON.stringify(messages));
        m.push({
            _id: "new-um",
            byte_id: "",
            byte_chat_id: "",
            assistant_id: "",
            user_id: "",
            thread_number: currentThreadCount,
            message_type: CtByteMessageMessageType.User,
            content: messageContent,
            created_at: new Date(),
            message_number: m[m.length-1] ? m[m.length-1].message_number + 1 : 0,
            premium_llm: false,
            free_credit_use: false,
        })
        setMessages(m)
        setUserMessage('')
        ctWs.sendWebsocketMessage({
            sequence_id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            type: CtMessageType.WebSocketMessageTypeByteUserMessage,
            origin: CtMessageOrigin.WebSocketMessageOriginClient,
            created_at: Date.now(),
            payload: {
                byte_id: props.byteID,
                user_message: messageContent,
                code: props.code,
                byte_description: props.description,
                difficulty: props.difficulty,
                byte_development_steps: props.devSteps,
            }
        } satisfies CtMessage<CtByteUserMessage>, (msg: CtMessage<CtGenericErrorPayload | CtValidationErrorPayload | CtByteAssistantMessage>) => {
            if (msg.type !== CtMessageType.WebSocketMessageTypeByteAssistantMessage) {
                console.log("failed sending user chat", msg)
                return true
            }
            const p: CtByteAssistantMessage = msg.payload as CtByteAssistantMessage;
            setResponse(p.complete_message)

            // check the messages for a "new-um" message and replace if we find it
            let index = messages.findIndex((x, i) => x._id === "new-um")
            if (index !== -1) {
                m = JSON.parse(JSON.stringify(m));
                m[index]._id = p.user_message_id;
                setMessages(m);
            }

            if (p.done) {
                setDisableChat(false)
                setState(State.COMPLETED)

                // add the new message
                m = JSON.parse(JSON.stringify(m));
                m.push({
                    _id: p.assistant_message_id,
                    byte_id: "",
                    byte_chat_id: "",
                    assistant_id: "",
                    user_id: "",
                    thread_number: m[m.length-1] && m[m.length-1].thread_number >= 0 ? m[m.length-1].thread_number : 0,
                    message_type: CtByteMessageMessageType.Assistant,
                    content: p.complete_message,
                    created_at: new Date(),
                    message_number: m[m.length-1] ? m[m.length-1].message_number + 1 : 0,
                    premium_llm: p.premium_llm,
                    free_credit_use: p.free_credit_use,
                })
                setMessages(m)

                return true
            }
            return false
        })
    }

    const closeThread = () => {
        if (chatId === "" || !authState.authenticated)
            return
        ctWs.sendWebsocketMessage({
            sequence_id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            type: CtMessageType.WebSocketMessageTypeCloseByteChatThreadRequest,
            origin: CtMessageOrigin.WebSocketMessageOriginClient,
            created_at: Date.now(),
            payload: {
                _id: chatId
            }
        } satisfies CtMessage<CtCloseByteChatThreadRequest>, (msg: CtMessage<CtGenericErrorPayload | CtValidationErrorPayload | CtCloseByteChatThreadResponse>) => {
            if (msg.type !== CtMessageType.WebSocketMessageTypeCloseByteChatThreadResponse) {
                console.log("failed launching chat", msg)
                return true
            }
            const p: CtCloseByteChatThreadResponse = msg.payload as CtCloseByteChatThreadResponse;
            //handle if successful
            if (p.success) {
                setCurrentThreadCount(prevCount => prevCount + 1);
                setShowButtons(true)
            }
            return true
        })
    }

    useEffect(() => {
        // This effect runs when `currentThreadCount` changes.
        // Update `threadVisibility` here to ensure it uses the latest `currentThreadCount`.
        setThreadVisibility(prevVisibility => ({
            ...prevVisibility,
            [currentThreadCount]: true,
        }));

    }, [currentThreadCount]);


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

    const animMemo = React.useMemo(() => (
        <Box sx={{ width: "100%", height: "fit-content" }}>
            <AnimCircularProgress
                key="fixed-animation"
                size={16}
                sx={{
                    float: 'right',
                    m: 1,
                }}
            />
            {/*<Button size={'small'} color={"error"}>*/}
            {/*    Stop Generating*/}
            {/*</Button>*/}
        </Box>
    ), [])

    const renderLoading = (
        content: string,
    ) => {
        return (
            <Box
                display={"block"}
                className="notranslate"
            >
                <MarkdownRenderer
                    markdown={content}
                    style={{
                        overflowWrap: 'break-word',
                        borderRadius: '10px',
                        padding: '0px',
                    }}
                    remarkPlugins={props.goToCallback ? [createGoToRemark(simpleHash("loading:"+content), props.goToCallback)] : undefined}
                    goToCallback={props.goToCallback}
                />
                {animMemo}
            </Box>
        )
    }

    let premium = authState.role.toString()
    // //remove after testing
    // premium = "0"

    const renderCompleted = (
        content: string,
        _id: string | null = null,
    ) => {
        return (
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <MarkdownRenderer
                    markdown={content}
                    style={{
                        overflowWrap: 'break-word',
                        borderRadius: '10px',
                        padding: '0px',
                    }}
                    remarkPlugins={props.goToCallback ? [createGoToRemark(simpleHash(`${_id}:${content}`), props.goToCallback)] : undefined}
                    goToCallback={props.goToCallback}
                />
                <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '10px'}}>
                    {(_id == null || !_id.includes("init")) && premium === "0" && (
                        <Tooltip title={"Get Access to more coding help and resources by going pro"}>
                            <Button onClick={(event) => {
                                setGoProPopup(true)
                                setAnchorEl(event.currentTarget)
                            }} variant={"outlined"}>
                                Go Pro
                            </Button>
                        </Tooltip>
                    )}
                </div>
            </div>
        )
    }

    const renderContent = (
        content: string,
        loading: boolean,
        _id: string | null = null,
    ) => {
        if (loading) {
            return renderLoading(content);
        }
        return renderCompleted(content, _id);
    }

    const renderUserMessage = (content: string, _id: string | null = null) => {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "flex-start",
                    paddingBottom: '10px'
                }}
            >
                <Card
                    style={{
                        fontSize: ".75rem",
                        marginLeft: "auto",
                        marginRight: "2.5px",
                        marginBottom: "0px",
                        padding: "10px",
                        backgroundColor: "#0842a040",
                        border: "1px solid #0842a0",
                        color: "#fcfcfc",
                        borderRadius: "10px",
                        width: "auto",
                        height: "auto",
                        display: "block",
                        maxWidth: "82%"
                    }}
                >
                    <MarkdownRenderer
                        markdown={content}
                        style={{
                            overflowWrap: 'break-word',
                            borderRadius: '10px',
                            padding: '0px',
                        }}
                        remarkPlugins={props.goToCallback ? [createGoToRemark(simpleHash(`${_id}:${content}`), props.goToCallback)] : undefined}
                        goToCallback={props.goToCallback}
                    />
                </Card>
                <UserIcon
                    userId={authState.id}
                    userTier={authState.tier}
                    userThumb={config.rootPath + thumbnail}
                    size={35}
                    backgroundName={authState.backgroundName}
                    backgroundPalette={authState.backgroundColor}
                    backgroundRender={authState.backgroundRenderInFront}
                    profileButton={false}
                    pro={authState.role.toString() === "1"}
                    mouseMove={false}
                />
            </div>
        );
    };

    const handleBotColor = (msgId: string) => {
        if (msgId == 'init' || msgId === 'init2' || msgId === 'init3') {
            switch(props.difficulty){
                case 'easy':
                    return 'rgb(13,107,93,0.5)'
                case 'medium':
                    return 'rgb(40,59,111,0.5)'
                case 'hard':
                    return 'rgb(130,47,69,0.5)'
            }
        } else {
            return "#31343a40"
        }
    }


    const renderBotMessage = (
        content: string,
        loading: boolean,
        _id: string | null = null,
        premiumLlm: boolean = false,
        freeCreditUse: boolean = false,
        msgId: string
    ) => {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "flex-start",
                    paddingBottom: '10px'
                }}
            >

                {(msgId !== 'init' && msgId !== 'init3')
                ?
                    <CodeTeacherChatIcon
                        style={{
                            marginRight: '10px',
                            width: '35px',
                            height: '35px',
                        }}
                    />
                :
                    <Box
                        sx={{
                            marginRight: '10px',
                            width: '35px',
                            height: '35px',
                        }}
                    />
                }

                <Card
                    style={{
                        fontSize: ".75rem",
                        marginLeft: "2.5px",
                        marginRight: "auto",
                        marginBottom: "0px",
                        padding: "10px",
                        backgroundColor: handleBotColor(msgId),
                        border: `1px solid ${premiumLlm ? "#84E8A2" : "#31343a"}`,
                        color: "white",
                        borderRadius: "10px",
                        width: "auto",
                        height: "auto",
                        display: "block",
                        maxWidth: "82%"
                    }}
                >
                    {renderContent(content, loading, _id)}
                </Card>
            </div>
        );
    };


    const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            // check for shift key to prevent ctrl+enter from submitting form
            if (event.shiftKey) {
                return;
            }

            setThreadVisibility(prevVisibility => ({
                ...prevVisibility,
                [currentThreadCount]: true,
            }));

            setResponse('')
            sendUserCTChat();
        }
    }

    const [isAtBottom, setIsAtBottom] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const checkScrollPosition = () => {
        if (!messagesContainerRef.current) return;
        const isAtBottom = messagesContainerRef.current.scrollHeight - messagesContainerRef.current.scrollTop === messagesContainerRef.current.clientHeight;
        setIsAtBottom(isAtBottom);
    };

    useEffect(() => {
        const messagesContainer = messagesContainerRef.current;
        if (messagesContainer) {
            messagesContainer.addEventListener('scroll', checkScrollPosition);

            // Cleanup
            return () => messagesContainer.removeEventListener('scroll', checkScrollPosition);
        }
    }, []);

    const textInputMemo = React.useMemo(() => (
        <TextField
            inputRef={textFieldRef}
            disabled={disableChat || !authState.authenticated}
            fullWidth
            label={authState.authenticated ? "Ask Code Teacher!" : "Signup To Chat With Code Teacher"}
            variant="outlined"
            value={userMessage}
            multiline={true}
            maxRows={5}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <Tooltip title={"Start New Conversation Thread"}>
                            <IconButton onClick={() => closeThread()} disabled={disableChat || !authState.authenticated}>
                                <AddComment/>
                            </IconButton>
                        </Tooltip>
                    </InputAdornment>
                ),
            }}
        />
    ), [userMessage, disableChat, chatId])

    // Group messages by thread number
    const groupedMessages = messages.reduce((acc, message) => {
        const threadNumber = message.thread_number;
        if (!acc[threadNumber]) acc[threadNumber] = [];
        acc[threadNumber].push(message);
        return acc;
    }, {} as { [key: number]: CtByteChatMessage[] });

    // Sort thread numbers to ensure they are processed in order
    const renderGroupedMessages = () => {
        // Ensure `sortedThreadNumbers` includes all threads up to the current count, including new ones
        const allThreads = Array.from({ length: currentThreadCount + 1 }, (_, i) => i);
        const sortedAllThreads = allThreads.sort((a, b) => a - b); // Ensure threads are sorted

        return sortedAllThreads.map(threadNumber => {
            const isThreadZero = threadNumber === 0;
            const isVisible = threadVisibility[threadNumber] ?? isThreadZero;

            return (
                <React.Fragment key={threadNumber}>
                    {isThreadZero || (threadNumber === currentThreadCount) ? (
                        // For thread 0, render without the ability to toggle visibility
                        <ThreadDivider
                            threadNumber={threadNumber}
                            onClick={() => {}}
                            isVisible={true} // Always true for thread 0
                            isCollapsible={false} // Thread 0 is not collapsible
                        />
                    ) : (
                        // For other threads, maintain the toggle functionality
                        <ThreadDivider
                            threadNumber={threadNumber}
                            onClick={() => toggleThreadVisibility(threadNumber)}
                            isVisible={isVisible}
                            isCollapsible={true}
                        />
                    )}
                    {isVisible && groupedMessages[threadNumber]?.map(message =>
                        message.message_type === CtByteMessageMessageType.Assistant
                            ? renderBotMessage(message.content, false, message.assistant_id, message.premium_llm, message.free_credit_use, message._id)
                            : renderUserMessage(message.content, message._id)
                    )}
                </React.Fragment>
            );
        });
    };

    const handleActiveThread = () => {
        if (newChat) {
            return (
                <Button sx={{height: "3vh"}} onClick={() => {
                    setNewChat(false)
                    setThreadVisibility({ [currentThreadCount]: true })
                }}>
                    <Typography variant="subtitle1" noWrap sx={{ color: theme.palette.text.primary, fontWeight: 200, fontSize: "0.7rem", marginX: 2, display: 'flex', alignItems: 'center', }}>
                        Active Thread <ExpandMoreIcon fontSize={"small"}/>
                    </Typography>
                </Button>
            )
        } else {
            return (
                <Typography variant="subtitle1" noWrap sx={{ color: theme.palette.text.primary, fontWeight: 200, fontSize: "0.7rem", marginX: 2, display: 'flex', alignItems: 'center', }}>
                    Active Thread
                </Typography>
            )
        }

    }

    const ThreadDivider = ({ threadNumber, onClick, isVisible, isCollapsible }: { threadNumber: number; onClick: () => void; isVisible: boolean, isCollapsible: boolean }) => {
        return (
            threadNumber !== 0
            ?
                <Box display="flex" alignItems="center" justifyContent="center" width="100%">
                    <Box flexGrow={1} borderBottom={`1px solid ${theme.palette.text.primary}`}  sx={{ marginLeft: "20px" }} />
                    {isCollapsible
                        ?
                        <Button sx={{height: "3vh"}} onClick={onClick}>
                            <Typography variant="subtitle1" noWrap sx={{ color: theme.palette.text.primary, fontWeight: 200, fontSize: "0.7rem", marginX: 2, display: 'flex', alignItems: 'center', }}>
                                {`Thread ${threadNumber} `}{isVisible ? <ExpandLessIcon fontSize={"small"} /> : <ExpandMoreIcon fontSize={"small"}/>}
                            </Typography>
                        </Button>
                        :
                        <>
                            {handleActiveThread()}
                        </>
                    }
                    <Box flexGrow={1} borderBottom={`1px solid ${theme.palette.text.primary}`} sx={{ marginRight: "20px" }} />
                </Box>
            :
                <></>
        );
    };

    const messagesMemo = React.useMemo(() => (
        <>
            {renderGroupedMessages()}
        </>
    ), [(state === State.LOADING) ? null : messages, threadVisibility, currentThreadCount])

    const handleInitialQuestions = (question: string, index: number) => {
        if (index === 0 && !bytesState?.acceptedExplanationSuggestion) {
            // copy the existing state
            let state = Object.assign({}, initialBytesStateUpdate)
            // update the state
            state.acceptedExplanationSuggestion = true
            dispatch(updateBytesState(state))
        }
        // sendUserCTChat(question);
        setUserMessage(question)
        textFieldRef.current?.focus()
    }

    const renderSuggestions = () => {
        if (!showButtons)
            return null

        return (
            <Grid container sx={{
                marginBottom: '10px'
            }} spacing={1}>
                {props.questions.map((q, index) => {
                    return (
                        <Grid item xs={6}>
                            <Button
                                key={index}
                                variant="outlined"
                                sx={{
                                    height: "100%",
                                    width:"100%",
                                    fontSize: '0.65rem',
                                    textTransform: 'none',
                                    p: 1,
                                    textAlign: "left",
                                    color: mode === "light" ? alpha("#1d1d1d", 0.6) : alpha(grey[300], 0.6),
                                    border: mode === "light" ? `1px solid ${alpha("#1d1d1d", 0.2)}` : `1px solid ${alpha(grey[300], 0.2)}`,
                                    '&:hover': {
                                        color: mode === "light" ? "#1d1d1d" : grey[300],
                                        backgroundColor: alpha(grey[500], 0.2),
                                        border: mode === "light" ? `1px solid ${alpha("#1d1d1d", 0.6)}` : `1px solid ${alpha(grey[500], 0.6)}`
                                    }
                                }}
                                onClick={() => handleInitialQuestions(q, index)}
                            >
                                {q}
                            </Button>
                        </Grid>
                    )
                })}
            </Grid>
        )
    }

    const toggleProPopup = () => setGoProPopup(!goProPopup)

    return (
        <>
            <Box
                ref={messagesContainerRef}
                display={"flex"}
                flexDirection={"column"}
                sx={{
                    scrollBehavior: 'smooth',
                    height: "calc(100% - 72px)",
                    overflowY: "auto",
                    overflowX: "hidden",
                    pt: 2,
                    pb: 2,
                    marginBottom: 1,
                    position: "relative"
                }}
            >
                {messagesMemo}
                {state === State.LOADING && renderBotMessage(response, true, "", false, false, "")}
                <div ref={messagesEndRef}/>
                {!isAtBottom && (
                    <Tooltip title={"Scroll To Bottom"}>
                        <IconButton
                            onClick={scrollToBottom}
                            size="small"
                            sx={{
                                position: "fixed",
                                bottom: `17vh`,
                                left: window.innerWidth * .2 < 450 ? `calc(440px + ${sidebarOpen ? 220 : 0}px)` : `calc(20vw + ${sidebarOpen ? 220 : 0}px - 10px)`,
                                border: `1px solid ${theme.palette.primary.dark}`,
                                backdropFilter: "blur(10px)",
                                zIndex: 10000,
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                                }
                            }}
                        >
                            <ArrowDownwardIcon/>
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
            {renderSuggestions()}
            <GoProDisplay open={goProPopup} onClose={toggleProPopup}/>
            {textInputMemo}
        </>
    );
}

