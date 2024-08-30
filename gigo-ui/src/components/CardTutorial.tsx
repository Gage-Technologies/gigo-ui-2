'use client'

import React, {useEffect, useRef, useState} from "react";
import {Box, Button, createTheme, DialogActions, DialogContent, PaletteMode} from "@mui/material";
import {theme, themeHelpers} from "../theme";
import {styled} from "@mui/system";

type TutorialStep = {
    content: JSX.Element;
    moreInfo?: JSX.Element;
    targetId?: string;
    height?: string;
    width?: string;
    left?: boolean;
}

type TutorialProps = {
    open: boolean;
    closeCallback: () => void;
    step: number;
    changeCallback: (step: number, back: boolean) => void;
    steps: TutorialStep[];
    sx?: React.CSSProperties;
};

interface OverlayProps {
    targetId?: string; // The ID of the element you want to highlight
}

const FullScreenOverlay = styled(Box)({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 1000, // Ensure it is above most other content
});

const OverlayTutorial: React.FC<OverlayProps> = ({ targetId }) => {
    const [targetRect, setTargetRect] = useState<DOMRect>();
    const padding = 8; // Padding around the cutout
    const borderRadius = 8; // Border radius for rounded corners
    const targetRef = useRef<Element | null>(null);

    useEffect(() => {
        if (targetId === undefined) {
            return
        }

        const target = document.getElementById(targetId);
        targetRef.current = target; // Store the target element reference

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.target === target && targetRef.current) {
                    const rect = targetRef.current.getBoundingClientRect();
                    // const rect = entry.contentRect;
                    setTargetRect({
                        ...rect,
                        x: rect.left - padding,
                        y: rect.top - padding,
                        width: rect.width + padding * 2,
                        height: rect.height + padding * 2
                    });
                }
            }
        });

        if (target) {
            resizeObserver.observe(target);
        }

        return () => { // Cleanup function to unobserve when the component unmounts or target changes
            if (target) {
                resizeObserver.unobserve(target);
            }
        };
    }, [targetId, padding]);

    if (targetId === undefined) {
        return null
    }

    if (targetId === "") {
        return <FullScreenOverlay sx={{backgroundColor: "rgba(0, 0, 0, 0.7)"}}/>
    }

    if (!targetRect) {
        return null;
    }

    return (
        <FullScreenOverlay>
            <svg width="100%" height="100%" style={{ opacity: 0.7 }}>
                <defs>
                    <mask id="cutout-mask">
                        <rect x="0" y="0" width="100%" height="100%" fill="white"/>
                        <rect
                            x={targetRect.x}
                            y={targetRect.y}
                            width={targetRect.width}
                            height={targetRect.height}
                            fill="black"
                            rx={borderRadius}
                            ry={borderRadius}
                        />
                    </mask>
                </defs>
                <rect x="0" y="0" width="100%" height="100%" fill="black" mask="url(#cutout-mask)"/>
            </svg>
        </FullScreenOverlay>
    );
};

export default function CardTutorial(props: TutorialProps) {
    const [moreInfoRendered, setMoreInfoRendered] = useState<boolean>(false);

    if (!props.open) {
        return null;
    }

    // @ts-ignore
    return (
        <>
            <Box
                sx={window.innerWidth < 1000 ? {
                    position: "fixed",
                    bottom: 60,
                    right: "2.5vw",
                    borderRadius: "10px",
                    zIndex: 10000,
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2);",
                    ...themeHelpers.frostedGlass,
                    backgroundColor: "rgba(19,19,19,0.31)",
                    // backgroundColor: theme.palette.primary.main + "30",
                    width: "95vw",
                    ...(props.sx ? props.sx : {})
                } : {
                    position: "fixed",
                    bottom: 40,
                    right: props.steps[props.step].left ? undefined : 80,
                    left: props.steps[props.step].left ? 80 : undefined,
                    borderRadius: "10px",
                    zIndex: 10000,
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2);",
                    ...themeHelpers.frostedGlass,
                    backgroundColor: "rgba(19,19,19,0.31)",
                    // backgroundColor: theme.palette.primary.main + "30",
                    width: props.steps[props.step].width ? props.steps[props.step].width : 400,
                    ...(props.sx ? props.sx : {})
                }}
            >
                <DialogContent
                    sx={{
                        backgroundColor: "transparent",
                        maxHeight: props.steps[props.step].height ? props.steps[props.step].height : "50vh",
                    }}
                >
                    {props.steps[props.step].content}
                    {moreInfoRendered && props.steps[props.step].moreInfo}
                </DialogContent>
                <DialogActions
                    sx={{
                        // @ts-ignore
                        // backgroundColor: theme.palette.background.codeEditorSide,
                        backgroundColor: "transparent",
                    }}
                >
                    {/* Conditionally render More Info button on the left side if the moreInfo value is available on the step */}
                    {props.steps[props.step].moreInfo && (
                        <Button
                            onClick={() => setMoreInfoRendered(!moreInfoRendered)}
                            variant="text"
                            color="primary"
                            sx={{
                                borderRadius: "10px",
                                pointerEvents: 'auto',
                                // bound to the left side of the dialog
                                position: "absolute",
                                left: 0,
                                ml: 1,
                                fontSize: "0.8rem",
                            }}
                        >
                            {
                                moreInfoRendered ? "Less Info" : "More Info"
                            }
                        </Button>
                    )}
                    {props.step === 0 ? (
                        <Button
                            onClick={() => props.closeCallback()}
                            variant="outlined"
                            color="error"
                            sx={{
                                borderRadius: "10px",
                                pointerEvents: 'auto',
                                fontSize: "0.8rem",
                                '&:hover': {
                                    backgroundColor: theme.palette.error.main + "25",
                                }
                            }}
                        >
                            Skip
                        </Button>
                    ) : (
                        <Button
                            onClick={() => props.changeCallback(props.step - 1, true)}
                            variant="outlined"
                            color="primary"
                            sx={{
                                borderRadius: "10px",
                                pointerEvents: 'auto',
                                fontSize: "0.8rem",
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.main + "25",
                                }
                            }}
                            disabled={props.step === 0}
                        >
                            Back
                        </Button>
                    )}
                    {
                        props.step === props.steps.length - 1 ? (
                            <Button
                                onClick={() => props.closeCallback()}
                                variant="outlined"
                                color="success"
                                sx={{
                                    borderRadius: "10px",
                                    pointerEvents: 'auto',
                                    fontSize: "0.8rem",
                                    '&:hover': {
                                        backgroundColor: theme.palette.success.main + "25",
                                    }
                                }}
                                disabled={props.step !== props.steps.length - 1}
                            >
                                Finish
                            </Button>
                        ) : (
                            <Button
                                onClick={() => props.changeCallback(props.step + 1, false)}
                                variant="outlined"
                                color="primary"
                                sx={{
                                    borderRadius: "10px",
                                    pointerEvents: 'auto',
                                    fontSize: "0.8rem",
                                    '&:hover': {
                                        backgroundColor: theme.palette.primary.main + "25",
                                    }
                                }}
                                disabled={props.step === props.steps.length - 1}
                            >
                                Next
                            </Button>
                        )
                    }
                </DialogActions>
            </Box>
            <OverlayTutorial targetId={props.steps[props.step].targetId}/>
        </>
    );
}
