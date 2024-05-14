import {
    alpha,
    Box,
    Button,
    createTheme,
    Grid,
    IconButton, InputBase, Menu, MenuItem,
    PaletteMode,
    styled,
    Tooltip,
    Typography
} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import {ArrowDropDown, Close, OpenInBrowser, OpenInNew, Refresh} from "@mui/icons-material";
import {getAllTokens} from "../theme";
import {Preview} from "@mui/icons-material";

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    fontSize: theme.typography.body2.fontSize,
    '& .MuiInputBase-input': {
        padding: theme.spacing(0.5, 1),
        transition: theme.transitions.create('width'),
        width: '100%',
        border: `1px solid ${theme.palette.text.primary}`,
        borderRadius: '16px',
    },
}));

interface BytePortPluginProps {
    ports: { name: string, port: string, url: string, disabled: boolean }[];
    onExpand: () => void;
    onHide: () => void;
    maxWidth: string;
    mobile?: boolean;
}

function BytePortPlugin(props: BytePortPluginProps) {
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

    const [selectedPort, setSelectedPort] = useState<null | { name: string; port: string; url: string; disabled: boolean }>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const [path, setPath] = useState("");
    const iframeRef = useRef<HTMLIFrameElement | null>(null);

    useEffect(() => {
        if (selectedPort === null && props.ports.length > 0) {
            setSelectedPort(props.ports[0]);
        }
    }, [props.ports]);

    const handlePathChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPath(event.target.value);
    };

    const handleRefresh = () => {
        if (selectedPort !== null && iframeRef.current) {
            iframeRef.current.src = `${selectedPort.url.replace("http://", "https://")}${path}`;
        }
    };

    const handlePortChange = (port: { name: string; port: string; url: string; disabled: boolean }) => {
        setSelectedPort(port);
        setAnchorEl(null);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const hide = () => {
        setHidden(true)
        props.onHide()
    }

    const expand = () => {
        setHidden(false)
        props.onExpand()
    }

    const renderHidden = React.useMemo(() => (
        <Tooltip title={props.ports.length > 0 ? `${props.ports.length} Open Ports` : "No Open Ports"}>
            <span>
                <HiddenButton
                    disabled={props.ports.length === 0}
                    sx={{
                        height: "30px",
                        width: "30px",
                        minWidth: "24px",
                        marginLeft: props.mobile ? "0px" : "10px"
                    }}
                    onClick={() => expand()}
                >
                    <Preview style={{fontSize: "20px"}}/>
                </HiddenButton>
            </span>
        </Tooltip>
    ), [props.ports])

    if (hidden) {
        return renderHidden
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                p: 1,
                zIndex: 5,
                boxShadow: "none",
                backgroundColor: "transparent",
                width: props.maxWidth,
                height: "100%",
            }}
        >
            <Box
                display={"inline-flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                sx={{
                    border: `1px solid ${theme.palette.text.primary}`,
                    borderRadius: "6px",
                    mb: 2,
                    p: 1,
                    width: "100%",
                    backgroundColor: alpha(theme.palette.background.paper, 0.7),
                }}
            >
                <Box display="flex" alignItems="center">
                    <Preview style={{ fontSize: "24px", marginRight: "8px" }} />
                    {selectedPort !== null && (
                        <>
                            <Typography variant="body2" sx={{ mr: 1 }}>
                                {selectedPort.name}
                            </Typography>
                            {props.ports.length > 1 && (
                                <IconButton
                                    color="inherit"
                                    sx={{ padding: 0.5 }}
                                    onClick={handleMenuOpen}
                                >
                                    <ArrowDropDown />
                                </IconButton>
                            )}
                            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                                {props.ports.map((port, index) => (
                                    <MenuItem key={index} onClick={() => handlePortChange(port)}>
                                        {port.name}: {port.port}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </>
                    )}
                </Box>
                <Box sx={{ flexGrow: 1, mx: 1 }}>
                    <StyledInputBase
                        placeholder="Enter path"
                        value={path}
                        onChange={handlePathChange}
                        fullWidth
                    />
                </Box>
                <Box display="flex" alignItems="center">
                    {selectedPort !== null && (
                        <>
                            <Tooltip title="Refresh">
                                <IconButton
                                    color="inherit"
                                    sx={{ padding: 0.5 }}
                                    onClick={handleRefresh}
                                >
                                    <Refresh style={{ fontSize: "16px" }}/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Open in New Tab">
                                <IconButton
                                    color="inherit"
                                    sx={{ padding: 0.5, ml: 1 }}
                                    onClick={() => window.open(`${selectedPort.url.replace("http://", "https://")}${path}`, "_blank")}
                                >
                                    <OpenInNew style={{ fontSize: "16px" }} />
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                    <Button
                        variant="text"
                        color="error"
                        sx={{
                            borderRadius: "50%",
                            padding: 0.5,
                            minWidth: "0px",
                            height: "24px",
                            width: "24px",
                            ml: 1,
                        }}
                        onClick={hide}
                    >
                        <Close />
                    </Button>
                </Box>
            </Box>
            <Box
                sx={{
                    width: "100%",
                    height: "calc(100% - 64px)",
                    border: "none",
                }}
            >
                {selectedPort !== null && (
                    <iframe
                        ref={iframeRef}
                        src={`${selectedPort.url.replace("http://", "https://")}${path}`}
                        style={{
                            width: "100%",
                            height: "100%",
                            border: "none",
                        }}
                    />
                )}
            </Box>
        </Box>
    );
}

export default BytePortPlugin;
