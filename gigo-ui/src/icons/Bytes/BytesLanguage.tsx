import React from "react";
import PythonOriginal from 'devicons-react/lib/icons/PythonOriginal';
import GoOriginal from 'devicons-react/lib/icons/GoOriginal';
import RustOriginal from "devicons-react/lib/icons/RustOriginal";
import CplusplusOriginal from 'devicons-react/lib/icons/CplusplusOriginal';
import JavascriptOriginal from 'devicons-react/lib/icons/JavascriptOriginal';
import CsharpOriginal from 'devicons-react/lib/icons/CsharpOriginal';
import { themeHelpers } from "@/theme";

export type ByteBadgeProps = {
    language: string
};
function BytesLanguage(props: ByteBadgeProps) {

    const handleLanguage = () => {
        let lang = props.language;
        if (lang === undefined) {
            lang = "Python"
        }
        switch (lang.toLowerCase()) {
            case "python":
            case "py":
                return <PythonOriginal size={"25px"}/>
            case "golang":
            case "go":
                return <GoOriginal size={"25px"}/>
            case "rust":
            case "rs":
                return <RustOriginal size={"25px"}/>
            case "cpp":
            case "c++":
            case "cc":
            case "cxx":
                return <CplusplusOriginal size={"25px"}/>
            case "javascript":
            case "js":
                return <JavascriptOriginal size={"25px"}/>
            case "c#":
            case "csharp":
            case "cs":
                return <CsharpOriginal size={"25px"}/>
            default:
                return null
        }
    }

    const lang = handleLanguage()
    if (lang === null) {
        return null
    }
    return (
        <div style={{
            textAlign: "right",
            borderRadius: "50%", 
            width: "40px", 
            height: "40px",
            padding: "5px",
            alignItems: "center",
            justifyContent: "center",
            alignContent: "center",
            display: "flex",
            ...themeHelpers.frostedGlass
        }}>
            {lang}
        </div>
    )
}

export default BytesLanguage;