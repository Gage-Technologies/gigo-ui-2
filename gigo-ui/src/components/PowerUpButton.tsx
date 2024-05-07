import React, {useEffect, useRef, useState} from 'react';
import {ButtonProps, Icon, IconButton, styled, SvgIconProps} from '@mui/material';

const RotateSquare = styled('svg')(({theme}) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    animation: 'strokeColorShift 3s linear infinite',

    '@keyframes strokeColorShift': {
        '0%': {stroke: '#84E8A2'},
        '25%': {stroke: '#29C18C'},
        '50%': {stroke: '#1C8762'},
        '75%': {stroke: '#2A63AC'},
        '100%': {stroke: '#3D8EF7'},
    },
}));

const ColorChangingIcon = styled(Icon)(({theme}) => ({
    animation: 'colorShift 3s linear infinite',
    fontSize: '12px',  // Adjust size as needed

    '@keyframes colorShift': {
        '0%': {color: '#84E8A2'},
        '25%': {color: '#29C18C'},
        '50%': {color: '#1C8762'},
        '75%': {color: '#2A63AC'},
        '100%': {color: '#3D8EF7'},
    },
}));

const StyledButton = styled(IconButton)({
    position: 'relative',
    padding: '10px',
    border: 'none',
    backgroundColor: 'transparent',
    overflow: 'hidden',
    minWidth: 0,
    maxWidth: "30px",
    maxHeight: "30px",
    borderRadius: "10px",

    '@keyframes borderColorShift': {
        '0%': {boxShadow: '0 0 3px #84E8A2, 0 0 6px #84E8A2'},
        '25%': {boxShadow: '0 0 3px #29C18C, 0 0 6px #29C18C'},
        '50%': {boxShadow: '0 0 3px #1C8762, 0 0 6px #1C8762'},
        '75%': {boxShadow: '0 0 3px #2A63AC, 0 0 6px #2A63AC'},
        '100%': {boxShadow: '0 0 3px #3D8EF7, 0 0 6px #3D8EF7'},
    },
});

const PowerUpButton = ({icon, lastTypedTime, timeout, buttonProps}: {
    icon: React.ElementType<SvgIconProps>,
    lastTypedTime: number | null,
    timeout: number,
    buttonProps?: ButtonProps
}) => {
    const [key, setKey] = useState(Math.random());
    const [lineActive, setLineActive] = useState(false);
    const [active, setActive] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const lineTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setKey(Math.random());  // Force re-render of SVG to restart animation
        setLineActive(false);
        setActive(false);  // Reset active state to false

        if (lastTypedTime !== null) {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            if (lineTimerRef.current) {
                clearTimeout(lineTimerRef.current);
            }

            timerRef.current = setTimeout(() => {
                setActive(true);  // Set button to active after the animation duration
            }, timeout - 1500);
            lineTimerRef.current = setTimeout(() => {
                setLineActive(true);  // Set line to active after the animation duration
            }, 1500);
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [lastTypedTime]); // Listen for changes in lastTypedTime

    if (buttonProps === undefined) {
        buttonProps = {};
    }
    buttonProps.style = {
        animation: active ? "borderColorShift 3s linear infinite" : undefined,
    };

    let BaseIcon = icon;
    let currentIcon = <BaseIcon style={{fontSize: "12px"}}/>;
    if (active) {
        currentIcon = (<ColorChangingIcon as={icon}/>);
    }
    return (
        <StyledButton {...buttonProps} disabled={!active}>
            {!active && (
                <RotateSquare key={key} viewBox="0 0 100 100">
                    <rect
                        x="5"
                        y="5"
                        width="90"
                        height="90"
                        fill="none"
                        rx="30"
                        ry="30"
                        strokeWidth="4"
                        strokeDasharray="315"
                        strokeDashoffset={lineActive ? "0" : "315"}  // Starts at full offset and transitions to 0
                        style={{
                            transition: `stroke-dashoffset ${(timeout - 3000) / 1000}s linear`, // Ensures the transition lasts exactly the timeout duration
                        }}
                    />
                </RotateSquare>
            )}
            {currentIcon}
        </StyledButton>
    );
};

export default PowerUpButton;
