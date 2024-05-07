import {alpha, Box, Button, createTheme, PaletteMode, styled, Tooltip} from "@mui/material";
import React, {useState} from "react";
import {Close, Explore, Flag} from "@material-ui/icons";
import {getAllTokens} from "@/theme";
import MarkdownRenderer from "./Markdown/MarkdownRenderer";
import AboutBytesIcon from "@/icons/Bytes/AboutPage";

interface ByteDevStepsPluginProps {
    devStepsContent: string;
    open: boolean;
    onExpand: () => void;
    onHide: () => void;
    maxWidth: string;
    mobile?: boolean;
}

function ByteDevStepsPlugin(props: ByteDevStepsPluginProps) {
    let userPref = localStorage.getItem("theme");
    const [mode, _] = useState<PaletteMode>(userPref === "light" ? "light" : "dark");
    const theme = React.useMemo(() => createTheme(getAllTokens(mode)), [mode]);

    const HiddenButton = styled(Button)`
        background-color: transparent;
        padding: 8px;
        min-width: 0px;
        color: ${alpha(theme.palette.text.primary, 0.6)};
        &:hover {
            background-color: ${alpha(theme.palette.text.primary, 0.4)};
            color: ${theme.palette.text.primary};
        }
    `;

    const hide = () => {
        props.onHide()
    }

    const expand = () => {
        props.onExpand()
    }

    const renderHidden = React.useMemo(() => (
        <Tooltip title={"Byte Objectives"}>
            <HiddenButton
                sx={{
                    height: "30px",
                    width: "30px",
                    minWidth: "24px",
                    marginLeft: props.mobile ? "0px" : "10px"
                }}
                onClick={() => expand()}
            >
                <Flag style={{fontSize: "20px"}}/>
            </HiddenButton>
        </Tooltip>
    ), [])

    if (!props.open) {
        return renderHidden
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'start',
                p: 1,
                zIndex: 5,
                boxShadow: "none",
                backgroundColor: "transparent",
                width: props.maxWidth,
                height: "100%"
            }}
        >
            <Box
                sx={{
                    overflow: "auto",
                    pl: 1,
                    height: "100%",
                    backgroundColor: "transparent",
                    border: "none",
                    boxShadow: "none",
                    width: "100%"
                }}
            >
                <Box
                    display={"inline-flex"}
                    justifyContent={"space-between"}
                    sx={{
                        border: `1px solid ${theme.palette.text.primary}`,
                        borderRadius: "6px",
                        mb: 2,
                        p: 1,
                        width: "100%"
                    }}
                >
                    <AboutBytesIcon
                        style={{
                            height: "20px",
                            width: "20px",
                            paddingTop: "2px",
                        }}
                        miniIcon={userPref === 'light'}
                    />
                    <Box
                        sx={{
                            ml: 2
                        }}
                    >
                        Byte Objective
                    </Box>
                    <Button
                        variant="text"
                        color="error"
                        sx={{
                            borderRadius: "50%",
                            padding: 0.5,
                            minWidth: "0px",
                            height: "24px",
                            width: "24px"
                        }}
                        onClick={hide}
                    >
                        <Close/>
                    </Button>
                </Box>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <MarkdownRenderer
                        markdown={props.devStepsContent}
                        style={{
                            overflowWrap: 'break-word',
                            borderRadius: '10px',
                            padding: '0px',
                        }}
                    />
                </div>
            </Box>
        </Box>
    )
}

export default ByteDevStepsPlugin;
