import * as React from "react";
import {PaletteMode} from "@mui/material";
import Editor, { useMonaco } from "@monaco-editor/react";
import {useEffect} from "react";
import {DefaultWorkspaceConfig} from "@/models/workspace";
import darkEditorTheme from "../themes/GitHub Dark.json"
import lightEditorTheme from "../themes/GitHub.json"
import "../css/editor.css"
import { theme } from "@/theme";

export interface WorkspaceConfigEditorProps {
    value: string | undefined;
    setValue: (v: string) => void;
    style?: object;
    height?: number | string | undefined;
    width?: number | string | undefined;
}

function WorkspaceConfigEditor(props: WorkspaceConfigEditorProps) {
    const monaco = useMonaco();

    useEffect(() => {
        if (monaco) {
            monaco.editor.defineTheme("gigo-default-light", lightEditorTheme)
            monaco.editor.defineTheme("gigo-default-dark", darkEditorTheme)
            monaco.editor.setTheme(theme.palette.mode === "light" ? "gigo-default-light" : "gigo-default-dark")
        }
    }, [monaco, theme.palette.mode]);

    return (
        <div style={props.style}>
            <Editor
                value={props.value}
                onChange={(v) => {
                    if (v === undefined) {
                        return
                    }
                    props.setValue(v);
                }}
                height={props.height}
                width={props.width}
                defaultValue={DefaultWorkspaceConfig}
                defaultLanguage="yaml"
                theme={theme.palette.mode === "light" ? "gigo-default-light" : "gigo-default-dark"}
                className={"yaml-editor"}
            />
        </div>
    )
}

export default WorkspaceConfigEditor;