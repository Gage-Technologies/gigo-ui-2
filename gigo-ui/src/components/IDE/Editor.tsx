import React, { useEffect, useState, Suspense } from "react";
import CodeMirror, { Extension, ReactCodeMirrorRef, ViewUpdate } from '@uiw/react-codemirror';
import { indentUnit, StreamLanguage } from '@codemirror/language';
import { copilot } from '@uiw/codemirror-theme-copilot';
import { quietlight } from '@uiw/codemirror-theme-quietlight';
import useDynamicStyles from "../../hooks/dynamicStyles";
import { Box } from "@mui/material";
import { ctTextHighlightExtension, ctTextHighlightTheme } from "./Extensions/CtHighlightExtension";
import { languageServer } from './Extensions/Lsp/Lsp';
import "./editor.css"
import { useGlobalCtWebSocket } from "../../services/ct_websocket";
import {
    CtGenericErrorPayload,
    CtMessage,
    CtMessageOrigin,
    CtMessageType,
    CtSemanticRankRequest,
    CtSemanticRankResponse,
    CtValidationErrorPayload
} from "../../models/ct_websocket";

const baseFileDir = "/home/gigo/.gigo/byte-files"

export type EditorProps = {
    language: string;
    parentStyles?: React.CSSProperties;
    wrapperStyles?: React.CSSProperties;
    editorStyles?: React.CSSProperties;
    gutterStyles?: React.CSSProperties;
    scrollerStyles?: React.CSSProperties;
    code: string;
    filePath?: string;
    theme?: string;
    readonly: boolean;
    lspUrl?: string;
    byteId?: string;
    difficulty?: string;
    diagnosticLevel?: "hint" | "info" | "warning" | "error",
    onChange?: (val: string, viewUpdate: ViewUpdate) => void;
    onUpdate?: (viewUpdate: ViewUpdate) => void;
    onCursorChange?: (bytePosition: number, lineNumber: number, columnNumber: number) => void;
    extensions?: Extension[]
    beginnerMode?: boolean;
};

const Editor = React.forwardRef<ReactCodeMirrorRef, EditorProps>((props: EditorProps, ref) => {
    const defaultProps: {
        parentStyles: React.CSSProperties;
        wrapperStyles: React.CSSProperties;
        editorStyles: React.CSSProperties;
        gutterStyles: React.CSSProperties;
        scrollerStyles: React.CSSProperties;
        theme: string;
        beginnerMode: boolean;
    } = {
        parentStyles: {},
        wrapperStyles: {
            width: '100%',
            height: '100%',
            borderRadius: "10px",
        },
        editorStyles: {
            borderRadius: '10px',
            outline: "none !important"
        },
        gutterStyles: {
            borderRadius: '10px',
        },
        scrollerStyles: {
            borderRadius: '10px'
        },
        theme: "dark",
        beginnerMode: false
    };

    useDynamicStyles('custom-cm-editor-style', ".cm-editor", props.editorStyles ? props.editorStyles : defaultProps.editorStyles);
    useDynamicStyles('custom-cm-gutters-style', ".cm-gutters", props.gutterStyles ? props.gutterStyles : defaultProps.gutterStyles);
    useDynamicStyles('custom-cm-gutters-style', ".cm-scroller", props.scrollerStyles ? props.scrollerStyles : defaultProps.scrollerStyles);

    let ctWs = useGlobalCtWebSocket();

    const [wsLanguageServer, setWsLanguageServer] = useState<Extension[] | null>(null);

    const [PopupPortal, setPopupPortal] = useState<React.ReactPortal | null>(null);

    const [extensions, setExtensions] = useState<Extension[]>([])

    const [languageExtension, setLanguageExtension] = useState<Extension | null>(null);

    const selectLang = async () => {
        switch (props.language.toLowerCase()) {
            case "golang":
            case "go":
                let go = await import('@codemirror/legacy-modes/mode/go').then(mod => (StreamLanguage.define(mod.go)));
                return [go]
            case "py":
            case "python":
                let python = await import('@codemirror/lang-python').then(mod => (mod.python()));
                return [python]
            case "cpp":
            case "cc":
            case "cxx":
            case "c++":
            case "hpp":
                let cpp = await import('@codemirror/lang-cpp').then(mod => (mod.cpp()));
                return [cpp]
            case "html":
            case "htm":
                let html = await import('@codemirror/lang-html').then(mod => (mod.html()));
                return [html]
            case "java":
                let java = await import('@codemirror/lang-java').then(mod => (mod.java()));
                return [java]
            case "ts":
            case "typescript":
            case "tsx":
            case "js":
            case "jsx":
            case "javascript":
                let js1 = import('@codemirror/lang-javascript').then(mod => (mod.javascript({ jsx: true, typescript: true })));
                let js2 = import('@codemirror/legacy-modes/mode/javascript').then(mod => (StreamLanguage.define(mod.javascript)));
                return Promise.all([js1, js2]).then(([js1, js2]) => {
                    return [js1, js2]
                })
            case "json":
                let json = await import('@codemirror/lang-json').then(mod => (mod.json()));
                return [json]
            case "md":
            case "markdown":
                let markdown = await import('@codemirror/lang-markdown').then(mod => (mod.markdown()));
                return [markdown]
            case "php":
                let php = await import('@codemirror/lang-php').then(mod => (mod.php()));
                return [php]
            case "rs":
            case "rust":
                let rust = await import('@codemirror/lang-rust').then(mod => (mod.rust()));
                return [rust]
            case "sql":
                let sql = await import('@codemirror/lang-sql').then(mod => (mod.sql()));
                return [sql]
            case "xml":
                let xml = await import('@codemirror/lang-xml').then(mod => (mod.xml()));
                return [xml]
            case "less":
                let less = await import('@codemirror/lang-less').then(mod => (mod.less()));
                return [less]
            case "sass":
            case "scss":
                let sass = await import('@codemirror/lang-sass').then(mod => (mod.sass()));
                return [sass]
            case "clj":
            case "clojure":
                let clojure = await import('@nextjournal/lang-clojure').then(mod => (mod.clojure()));
                return [clojure]
            case "cs":
            case "c#":
            case "csharp":
                let csharp = await import('@replit/codemirror-lang-csharp').then(mod => (mod.csharp()));
                return [csharp]
            case "sh":
            case "shell":
            case "bash":
                let shell = await import('@codemirror/legacy-modes/mode/shell').then(mod => (StreamLanguage.define(mod.shell)));
                return [shell]
            case "toml":
                let toml = await import('@codemirror/legacy-modes/mode/toml').then(mod => (StreamLanguage.define(mod.toml)));
                return [toml]
            default:
                return null;
        }
    }

    useEffect(() => {
        selectLang().then((lang) => {
            setLanguageExtension(lang)
        });
    }, [props.language]);

    let getLspData = (): { fp: string, root: string, code: string } | undefined => {
        if (props.filePath === undefined || props.byteId === undefined || props.difficulty === undefined) {
            return undefined
        }

        let lang = "python"
        switch (props.language.toLowerCase()) {
            case "go":
                lang = "go"
                break
            case "python":
            case "py":
                lang = "python"
                break
            case "cpp":
            case "cc":
            case "cxx":
            case "hpp":
                lang = "cpp"
                break
            case "html":
            case "htm":
                lang = "html"
                break
            case "java":
                lang = "java"
                break
            case "javascript":
            case "js":
                lang = "javascriptreact"
                break
            case "json":
                lang = "json"
                break
            case "md":
            case "markdown":
                lang = "markdown"
                break
            case "php":
                lang = "php"
                break
            case "rs":
            case "rust":
                lang = "rust"
                break
            case "sql":
                lang = "sql"
                break
            case "xml":
                lang = "xml"
                break
            case "less":
                lang = "less"
                break
            case "sass":
            case "scss":
                lang = "sass"
                break
            case "clj":
            case "clojure":
                lang = "clojure"
                break
            case "cs":
            case "csharp":
                lang = "csharp"
                break
            case "sh":
            case "shell":
            case "bash":
                lang = "shell"
                break
            case "toml":
                lang = "toml"
                break
            case "typescript":
            case "ts":
                lang = "typescriptreact"
                break
            case "yaml":
            case "yml":
                lang = "yaml"
                break
            // Additional cases for other languages and their extensions
            default:
                lang = "python"
                break
        }

        return {
            root: `${baseFileDir}/${props.byteId}/${props.difficulty}`,
            fp: `${baseFileDir}/${props.byteId}/${props.difficulty}/${props.filePath}`,
            code: lang
        }
    }

    const rankCompletions = React.useCallback(async (preText: string, completions: string[]): Promise<CtSemanticRankResponse | undefined> => {
        // create a promise that will be resolved when the response is received
        let resolver: (value: CtSemanticRankResponse | undefined) => void;
        const promise: Promise<CtSemanticRankResponse | undefined> = new Promise((resolve) => {
            resolver = resolve;
        });

        // Define a timeout duration in milliseconds
        const timeoutDuration = 1000;

        // Create a timeout promise
        const timeoutPromise = new Promise<CtSemanticRankResponse | undefined>((resolve) => {
            setTimeout(() => {
                resolve(undefined);
            }, timeoutDuration);
        });

        ctWs.sendWebsocketMessage(
            {
                sequence_id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
                type: CtMessageType.WebSocketMessageTypeSemanticRankRequest,
                origin: CtMessageOrigin.WebSocketMessageOriginClient,
                created_at: Date.now(),
                payload: {
                    query: preText,
                    content: completions,
                }
            } satisfies CtMessage<CtSemanticRankRequest>,
            (msg: CtMessage<CtGenericErrorPayload | CtValidationErrorPayload | CtSemanticRankResponse>): boolean => {
                if (msg.type !== CtMessageType.WebSocketMessageTypeSemanticRankResponse) {
                    console.log("failed to semantically rank completions: ", msg)
                    resolver(undefined)
                    return true
                }
                resolver(msg.payload as CtSemanticRankResponse)
                return true
            }
        )

        // Use Promise.race to handle the timeout
        return Promise.race([promise, timeoutPromise]);
    }, [ctWs]);

    useEffect(() => {
        if (!props.lspUrl) {
            return
        }

        // import the layout stylesheet dynamically
        if (window.innerWidth > 1000) {
            require('./Extensions/styles/lsp-computer.css');
        } else {
            require('./Extensions/styles/lsp-mobile.css');
        }

        // get fp for the language
        let lspData = getLspData()
        if (lspData === undefined) {
            return
        }

        const lsp = languageServer({
            // WebSocket server uri and other client options.
            // @ts-ignore
            serverUri: props.lspUrl,
            rootUri: `file://${lspData.root}`,

            documentUri: `file://${lspData.fp}`,
            languageId: lspData.code, // As defined at https://microsoft.github.io/language-server-protocol/specification#textDocumentItem.

            allowHTMLContent: true,
            level: props.diagnosticLevel !== undefined ? props.diagnosticLevel : "error",
            portalCallback: setPopupPortal,
            rankCompletions: rankCompletions
        });

        // update the lsp
        setWsLanguageServer(lsp)
    }, [props.language, props.lspUrl])

    const getExtensions = () => {
        let exts = [
            // this indents with 4 spaces
            indentUnit.of("    "),
            // autocompleteExtension,
            ctTextHighlightExtension,
            ctTextHighlightTheme,
        ];
        if (languageExtension) {
            exts.push(languageExtension);
        }
        if (wsLanguageServer) {
            exts = exts.concat(wsLanguageServer);
        }
        if (props.extensions) {
            exts = exts.concat(props.extensions);
        }
        // if ((props.beginnerMode !== undefined && props.beginnerMode) || (props.beginnerMode === undefined && defaultProps.beginnerMode)) {
        //     exts = exts.concat(
        //         closeBrackets({brackets: []})
        //     )
        // }

        return exts
    }

    useEffect(() => {
        setExtensions(getExtensions())
    }, [props.extensions, languageExtension, wsLanguageServer]);

    const onChange = React.useCallback((val: string, viewUpdate: ViewUpdate) => {
        if (props.onChange) {
            props.onChange(val, viewUpdate)
        }
    }, [props.onChange, props.code])

    const onUpdate = React.useCallback((viewUpdate: ViewUpdate) => {
        if (props.onUpdate) {
            props.onUpdate(viewUpdate)
        }

        // Check if the update is due to cursor movement
        if (props.onCursorChange && (viewUpdate.docChanged || viewUpdate.selectionSet)) {
            // retrieve the cursor position
            const cursorPosition = viewUpdate.state.selection.main.head;
            // get the line and column position
            const lineInfo = viewUpdate.state.doc.lineAt(cursorPosition);
            props.onCursorChange(cursorPosition, lineInfo.number - 1, cursorPosition - lineInfo.from)
        }
    }, [props.onUpdate, props.onCursorChange]);

    return (
        <Box
            style={props.parentStyles ? props.parentStyles : defaultProps.parentStyles}
            className={"notranslate"}
        >
            <Suspense fallback={<div>Loading...</div>}>
                <CodeMirror
                    ref={ref}
                    value={props.code}
                    height="100%"
                    theme={(props.theme ? props.theme : defaultProps.theme).toLowerCase() === 'light' ? quietlight : copilot}
                    style={props.wrapperStyles ? props.wrapperStyles : defaultProps.wrapperStyles}
                    extensions={extensions}
                    onChange={onChange}
                    onUpdate={onUpdate}
                    readOnly={props.readonly}
                />
            </Suspense>
            {PopupPortal}
        </Box>
    )
});

// Assign a display name to the component
Editor.displayName = 'Editor';

export default Editor;
