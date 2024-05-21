'use client';
import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {LoadingButton, LoadingButtonProps} from "@mui/lab";
import { Box } from '@mui/material';

interface MuiAwesomeButtonProps extends Omit<LoadingButtonProps, 'color' | 'variant'> {
    backgroundColor: string;
    hoverColor: string;
    secondaryColor: string;
    textColor: string;
}

const MuiAwesomeButtonStyled = styled(LoadingButton)<{
    bgcolor: string;
    textcolor: string;
    hoverColor: string;
    secondarycolor: string;
    isClicked: boolean;
}>(({ theme, bgcolor, textcolor, hoverColor, secondarycolor, isClicked }) => ({
    position: 'relative',
    borderRadius: 20,
    textTransform: 'none',
    fontSize: '1rem',
    fontWeight: theme.typography.fontWeightMedium,
    padding: theme.spacing(1, 4),
    color: textcolor,
    backgroundColor: isClicked ? 'transparent' : bgcolor,
    overflow: 'visible',
    boxShadow: "none",
    transition: theme.transitions.create(['background-color', 'opacity'], {
        duration: theme.transitions.duration.shortest,
    }),
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 6,
        right: 0,
        bottom: -6,
        left: 0,
        zIndex: -1,
        backgroundColor: secondarycolor,
        borderRadius: 20,
        transition: theme.transitions.create(['opacity', 'background-color', 'top', 'bottom'], {
            duration: theme.transitions.duration.short,
        }),
    },
    '&:hover': {
        backgroundColor: isClicked ? 'transparent' : hoverColor, // Updated to reflect hoverColor change
        boxShadow: "none",
    },
    '&.MuiLoadingButton-loading': {
        backgroundColor: isClicked ? 'transparent' : bgcolor,
    }
}));

const MuiAwesomeButton: React.FC<MuiAwesomeButtonProps> = ({
                                                       backgroundColor,
                                                       secondaryColor,
                                                       hoverColor,
                                                       textColor,
                                                       children,
                                                       ...props
                                                   }) => {
    const [isClicked, setIsClicked] = useState(false);

    const handleMouseDown = () => {
        setIsClicked(true);
    };

    const handleMouseUp = () => {
        setIsClicked(false);
    };

    return (
        <Box sx={{zIndex: 2, width: 'fit-content', height: 'fit-content', position: 'relative'}}>
            <MuiAwesomeButtonStyled
                bgcolor={backgroundColor}
                secondarycolor={secondaryColor}
                textcolor={textColor}
                hoverColor={hoverColor}
                variant="contained"
                isClicked={isClicked}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp} // In case the cursor leaves the button while holding the click
                onTouchStart={handleMouseDown} // For touch devices
                onTouchEnd={handleMouseUp} // For touch devices
                disableRipple={true}
                {...props}
            >
                {children}
            </MuiAwesomeButtonStyled>
        </Box>
    );
};

export default MuiAwesomeButton;
