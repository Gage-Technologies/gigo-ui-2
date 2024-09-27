import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { styled } from '@mui/material/styles';

import ByteEasySelectionIcon from "@/icons/Bytes/ByteEasySelection";
import ByteEmptySelectionIcon from "@/icons/Bytes/ByteEmptyDifficulty";
import ByteMediumSelectionIcon from "@/icons/Bytes/ByteMediumSelection";
import ByteMediumNoSelectionIcon from '@/icons/Bytes/ByteMediumNoSelection';
import ByteHardNoSelectionIcon from "@/icons/Bytes/ByteHardNoSelection";
import ByteHardSelectionIcon from "@/icons/Bytes/ByteHardSelection";

import easySvg from "@/img/bytes/byte-easy-difficulty-selection.svg";
import emptySvg from "@/img/bytes/byte-empty-difficulty-no-selection.svg";
import mediumSvg from "@/img/bytes/byte-medium-difficulty-selection.svg";
import mediumNoSvg from '@/img/bytes/byte-medium-difficulty-no-selection.svg';
import hardSvg from "@/img/bytes/byte-hard-difficulty-selection.svg";
import hardNoSvg from "@/img/bytes/byte-hard-difficulty-no-selection.svg";

import {useImagePreloader} from "@/hooks/imagePreloader";

const MAX_LEVELS = 2;

export interface DifficultyAdjusterProps {
    difficulty: number;
    onChange: (difficulty: number) => void;
}

const iconStyles: React.CSSProperties = {
    width: '40px', // Set an explicit width
    height: '40px', // Set an explicit height
};

const DifficultyContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px', // Add some space between items
});


export default function DifficultyAdjuster(props: DifficultyAdjusterProps) {
    useImagePreloader([easySvg, emptySvg, mediumSvg, mediumNoSvg, hardSvg, hardNoSvg])

    const [difficultyLevel, setDifficultyLevel] = React.useState(props.difficulty); // Start at level 1 (one bar on)

    const incrementDifficulty = () => {
        setDifficultyLevel((prev) => (prev < MAX_LEVELS ? prev + 1 : prev));
        props.onChange(difficultyLevel < MAX_LEVELS ? difficultyLevel + 1 : difficultyLevel);
    };

    const decrementDifficulty = () => {
        setDifficultyLevel((prev) => (prev > 0 ? prev - 1 : prev)); // Decrease only if above 1
        props.onChange(difficultyLevel > 0 ? difficultyLevel - 1 : difficultyLevel)
    };

    const easyDifficulty = React.useMemo(() => (
        <>
            <ByteEasySelectionIcon key={0} style={iconStyles}/>
            <ByteEmptySelectionIcon key={1} style={iconStyles}/>
            <ByteEmptySelectionIcon key={2} style={iconStyles}/>
        </>
    ), [])

    const medDifficulty = React.useMemo(() => (
        <>
            <ByteMediumNoSelectionIcon key={0} style={iconStyles}/>
            <ByteMediumSelectionIcon key={1} style={iconStyles}/>
            <ByteEmptySelectionIcon key={2} style={iconStyles}/>
        </>
    ), [])

    const hardDifficulty = React.useMemo(() => (
        <>
            <ByteHardNoSelectionIcon key={0} style={iconStyles}/>
            <ByteHardNoSelectionIcon key={1} style={iconStyles}/>
            <ByteHardSelectionIcon key={2} style={iconStyles}/>
        </>
    ), [])

    const getColorForDifficulty = (difficulty: number) => {
        if (difficulty == 0) return easyDifficulty; // green for easy
        if (difficulty == 1) return medDifficulty; // orange for medium
        if (difficulty  == 2) return hardDifficulty;
    };

    return (
        <Box width="fit-content" m="auto">
            <Typography gutterBottom variant="caption" display="block" textAlign="center">
                Difficulty
            </Typography>
            <DifficultyContainer>
                <IconButton
                    size="large"
                    onClick={decrementDifficulty}
                    disabled={difficultyLevel === 0} // Disable if at level 1
                    aria-label="decrease difficulty"
                >
                    <ArrowBackIosNewIcon fontSize="large" />
                </IconButton>
                {getColorForDifficulty(difficultyLevel)}
                <IconButton
                    size="large"
                    onClick={incrementDifficulty}
                    disabled={difficultyLevel === MAX_LEVELS} // Disable if at max level
                    aria-label="increase difficulty"
                >
                    <ArrowForwardIosIcon fontSize="large" />
                </IconButton>
            </DifficultyContainer>
        </Box>
    );
}
