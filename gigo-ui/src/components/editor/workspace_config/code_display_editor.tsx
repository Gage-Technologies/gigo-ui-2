'use client'
import * as React from "react";
import { Box, Button, CircularProgress, createTheme, PaletteMode } from "@mui/material";
import Editor from "@/components/IDE/Editor";
import { useEffect, useState } from "react";
import { DefaultWorkspaceConfig } from "../../../models/workspace";
import darkEditorTheme from "../themes/GitHub Dark.json"
import lightEditorTheme from "../themes/GitHub.json"
import "../css/editor.css"
import call from "../../../services/api-call";
import config from "../../../config";
import Sidebar from "../../EditorComponents/Sidebar";
import { useNavigate } from "react-router-dom";
import MarkdownRenderer from "../../Markdown/MarkdownRenderer";
import { theme } from "@/theme";
import Scrollbars from "react-custom-scrollbars";
import { ThreeDots } from "react-loading-icons";
import { PropaneTankSharp } from "@mui/icons-material";
import FileSystemSidebar, { FileSystemItem } from "@/components/IDE/FileSystemSidebar";

interface LanguageOption {
    name: string;
    extensions: string[];
    languageId: number;
}

const languages: LanguageOption[] = [
    { name: 'Go', extensions: ['go'], languageId: 6 },
    { name: 'Python', extensions: ['py', 'pytho', 'pyt'], languageId: 5 },
    {
        name: 'C++',
        extensions: ['cpp', 'cc', 'cxx', 'hpp', 'c++', 'h'],
        languageId: 8,
    },
    { name: 'HTML', extensions: ['html', 'htm'], languageId: 27 },
    { name: 'Java', extensions: ['java'], languageId: 2 },
    { name: 'JavaScript', extensions: ['js'], languageId: 3 },
    { name: 'JSON', extensions: ['json'], languageId: 1 },
    { name: 'Markdown', extensions: ['md'], languageId: 1 },
    { name: 'PHP', extensions: ['php'], languageId: 13 },
    { name: 'Rust', extensions: ['rs'], languageId: 14 },
    { name: 'SQL', extensions: ['sql'], languageId: 34 },
    { name: 'XML', extensions: ['xml'], languageId: 1 },
    { name: 'LESS', extensions: ['less'], languageId: 1 },
    { name: 'SASS', extensions: ['sass', 'scss'], languageId: 1 },
    { name: 'Clojure', extensions: ['clj'], languageId: 21 },
    { name: 'C#', extensions: ['cs'], languageId: 10 },
    { name: 'Shell', extensions: ['bash', 'sh'], languageId: 38 },
    { name: 'Toml', extensions: ['toml'], languageId: 14 },
    { name: 'Yaml', extensions: ['yaml', 'yml'], languageId: 99 }
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

export interface Code_display_editor {
    style?: object;
    height?: number | string | undefined;
    width?: number | string | undefined;
    repoId: string;
    references: string;
    filepath: string;
    projectName: string
}

function CodeDisplayEditor(props: Code_display_editor) {
    const [allFiles, setAllFiles] = React.useState<FileSystemItem[]>([])
    const [fileName, setFileName] = useState("")
    const [chosenFile, setChosenFile] = useState<FileSystemItem>({ name: "", content: undefined, path: "", type: "file" })
    const [loading, setLoading] = useState(false)

    const selectFile = async (file: FileSystemItem) => {
        if (!props.repoId || props.repoId === "" || !props.references || props.references === "")
            return

        console.log("FILE Pre", file)

        if (file.content === undefined || file.content === null || file.content === "") {
            let res = await call(
                "/api/project/getProjectFiles",
                "post",
                null,
                null,
                null,
                // @ts-ignore
                { repo_id: props.repoId, ref: props.references, filepath: file.path },
                null,
                config.rootPath
            )
            file.content = res["message"]["content"];
        }

        console.log("FILE", file)

        setChosenFile(file)
    }

    const getDirectoryData = async (filepath: string) => {
        let res = await call(
            "/api/project/getProjectDirectories",
            "post",
            null,
            null,
            null,
            //@ts-ignore
            { repo_id: props.repoId, ref: "main", filepath: filepath },
            null,
            config.rootPath
        )
        if (res !== undefined && res["message"] !== undefined) {
            setAllFiles((f) => [...f, ...res["message"]])
        }
    }

    const apiLoad = async () => {

        if (!props.repoId || props.repoId === "" || !props.references || props.references === "")
            return

        setLoading(true)
        let res = await call(
            "/api/project/getProjectCode",
            "post",
            null,
            null,
            null,
            // @ts-ignore
            { repo_id: props.repoId, ref: props.references, filepath: props.filepath },
            null,
            config.rootPath
        )

        if (res !== undefined && res["message"] !== undefined) {
            setAllFiles(res["message"]);
            setFileName(res["message"][0]["name"])
            let index = res["message"].findIndex((item: { name: string; }) => item.name === "README.md");

            if (index !== -1) {
                await selectFile(res["message"][index]);
            } else {
                // determine the first file that is not hidden and is not in a hidden directory
                index = res["message"].findIndex((item: { name: string; }) => !item.name.startsWith('.'));
                await selectFile(res["message"][index]);
            }

        }
        setLoading(false)
    }

    const findLangauge = (name: string) => {
        let textArray = name.split(".")
        let determinate = textArray[1]
        switch (determinate) {
            // Languages with rich IntelliSense and validation
            case 'ts':
                return 'typescript';
            case 'js':
                return 'javascript';
            case 'css':
                return 'css';
            case 'less':
                return 'less';
            case 'scss':
                return 'scss';
            case 'json':
                return 'json';
            case 'html':
                return 'html';

            // Languages with only basic syntax colorization
            case 'xml':
                return 'xml';
            case 'php':
                return 'php';
            case 'cs':
                return 'csharp';
            case 'cpp':
            case 'cxx':
            case 'cc':
                return 'cpp';
            case 'cshtml':
                return 'razor';
            case 'md':
            case 'markdown':
                return 'markdown';
            case 'diff':
                return 'diff';
            case 'java':
                return 'java';
            case 'vb':
                return 'vb';
            case 'coffee':
                return 'coffeescript';
            case 'hbs':
                return 'handlebars';
            case 'bat':
                return 'batch';
            case 'pug':
                return 'pug';
            case 'fs':
            case 'fsharp':
                return 'fsharp';
            case 'lua':
                return 'lua';
            case 'ps1':
                return 'powershell';
            case 'py':
                return 'python';
            case 'rb':
                return 'ruby';
            case 'sass':
                return 'sass';
            case 'r':
                return 'r';
            case 'm':
                return 'objective-c';
            case 'go':
                return 'go';
            case 'sql':
                return 'sql';
            case 'swift':
                return 'swift';
            case 'sh':
                return 'shell';
            case 'yml':
            case 'yaml':
                return 'yaml';
            case 'rs':
                return 'rust';
            case 'clj':
                return 'clojure';
            case 'kt':
                return 'kotlin';
            case 'pl':
                return 'perl';
            case 'hs':
                return 'haskell';
            case 'erl':
                return 'erlang';
            case 'elixir':
                return 'elixir';
            case 'elm':
                return 'elm';
            case 'dart':
                return 'dart';
            default:
                return 'plaintext';
        }
    }

    useEffect(() => {
        apiLoad()
    }, [props.references, props.repoId]);

    const handleCurrentFileSideBar = (file: FileSystemItem) => {
        setLoading(true)
        selectFile(file).then(() => {
            setLoading(false)
        })
    }

    //@ts-ignore
    const isMarkdown = chosenFile["name"]
        //@ts-ignore
        ? findLangauge(chosenFile["name"]).toLowerCase() === "markdown"
        : false;

    if (!props.repoId || props.repoId === "" || !props.references || props.references === "")
        return null

    const lang = mapFilePathToLangOption(chosenFile.name)

    return (
        <Box display={"flex"} flexDirection={"row"} style={props.style}>
            <Box style={{ width: "300px", display: "flex" }}>
                <FileSystemSidebar
                    files={allFiles}
                    height={"73vh"}
                    onFolderExpand={async (item: FileSystemItem) => {
                        const parentPathExists = allFiles.some(file => file.path !== item.path && file.path.startsWith(item.path));
                        if (!parentPathExists) {
                            await getDirectoryData(item.path);
                        }
                    }}
                    onFileClick={(file: FileSystemItem) => handleCurrentFileSideBar(file)}
                />
            </Box>
            {
                isMarkdown ? (
                    <Scrollbars
                        style={{
                            minHeight: props.height,
                            width: "121vw",
                            border: `1px solid ${theme.palette.primary.contrastText}`,
                            borderRadius: 5,
                        }}
                        renderThumbVertical={({ style, ...props }) =>
                            <div {...props}
                                style={{
                                    ...style,
                                    backgroundColor: theme.palette.primary.contrastText,
                                    borderRadius: 10
                                }}
                            />
                        }
                    >
                        {/*@ts-ignore*/}
                        <MarkdownRenderer markdown={chosenFile["content"]} style={{
                            minHeight: props.height,
                            width: "60vw",
                            overflowWrap: "break-word",
                            padding: "2em 3em",
                        }} />
                    </Scrollbars>
                )
                    : (
                        loading ? (
                            <Box
                                sx={{
                                    border: `1px solid ${theme.palette.primary.contrastText}`,
                                    boxSizing: 'border-box',
                                    width: "121vw",
                                    minHeight: props.height,
                                    borderRadius: "5px",
                                    position: "relative"
                                }}
                            >
                                <CircularProgress
                                    color="inherit"
                                    sx={{
                                        // center the spinner in the middle of the Box
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)'
                                    }}
                                />
                            </Box>
                        ) : (
                            <Editor
                                parentStyles={{
                                    width: "121vw",
                                    minHeight: props.height,
                                    borderRadius: "5px",
                                    overflowX: "auto"
                                }}
                                language={lang !== undefined ? lang.extensions[0] : "txt"}
                                filePath={chosenFile.name}
                                code={chosenFile.content || ""}
                                theme={theme.palette.mode}
                                readonly={true}
                                onChange={(val, view) => { }}
                                onCursorChange={(bytePosition, line, column) => { }}
                                lspUrl={undefined}
                                byteId={""}
                                difficulty={"easy"}
                                diagnosticLevel={"error"}
                                extensions={[]}
                                wrapperStyles={{
                                    width: '100%',
                                    maxWidth: "80vw",
                                    height: '100%',
                                    borderRadius: "5px",
                                    border: `1px solid ${theme.palette.primary.contrastText}`,
                                }}
                            />
                        )
                    )
            }
        </Box>
    )
}

export default CodeDisplayEditor;