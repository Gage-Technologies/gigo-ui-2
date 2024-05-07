import {alpha, Box, Button, createTheme, PaletteMode, styled, Tooltip} from "@mui/material";
import React, {useState} from "react";
import {Close, Description, Explore} from "@material-ui/icons";
import {getAllTokens} from "@/theme";
import MarkdownRenderer from "./Markdown/MarkdownRenderer";

interface JourneyHandoutPluginProps {
    handoutContent: string;
    onExpand: () => void;
    onHide: () => void;
    maxWidth: string;
    mobile?: boolean;
}

function JourneyHandoutPlugin(props: JourneyHandoutPluginProps) {
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

    const [hidden, setHidden] = useState(true);

    const hide = () => {
        setHidden(true)
        props.onHide()
    }

    const expand = () => {
        setHidden(false)
        props.onExpand()
    }

    const renderHidden = React.useMemo(() => (
        <Tooltip title={"Unit Handout"}>
            <HiddenButton
                sx={{
                    height: "30px",
                    width: "30px",
                    minWidth: "24px",
                    marginLeft: props.mobile ? "0px" : "10px"
                }}
                onClick={() => expand()}
            >
                <Description style={{fontSize: "20px"}}/>
            </HiddenButton>
        </Tooltip>
    ), [])

    if (hidden) {
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
                    {/*<JourneyIcon style={{height: "24px", width: "24px"}}/>*/}
                    <Explore style={{fontSize: "24px"}}/>
                    <Box
                        sx={{
                            ml: 2
                        }}
                    >
                        Handout
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
                        markdown={props.handoutContent}
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

export default JourneyHandoutPlugin;
