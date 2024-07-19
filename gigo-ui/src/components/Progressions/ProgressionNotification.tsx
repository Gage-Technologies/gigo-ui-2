import React, { useState, useEffect } from 'react';
import { Snackbar, Box, Typography, LinearProgress, Slide } from '@mui/material';
import { Code, School, Chat, Comment, FitnessCenter, Whatshot } from '@mui/icons-material';
import XpPopup from '../XpPopup';
import DetermineProgressionLevel from '@/utils/progression';
import config from "@/config";

interface AchievementProgressProps {
    open: boolean;
    onClose: () => void;
    title: string;
    description: string;
    progress: number;
    progressMax: number;
    icon: React.ReactNode;
    isDataHog?: boolean;
}

interface AchievementProps {
    open: boolean;
    onClose: () => void;
    title: string;
    description: string;
    icon: React.ReactNode;
}

const AchievementProgress: React.FC<AchievementProgressProps> = ({ open, onClose, title, description, progress, progressMax, icon, isDataHog }) => {
    const [progressValue, setProgressValue] = useState(0);
    const value = (progress / progressMax) * 100;

    useEffect(() => {
        if (open) {
            setProgressValue(0);
            const timer = setTimeout(() => setProgressValue(value), 100);
            return () => clearTimeout(timer);
        }
    }, [open, value]);

    return (
        <Snackbar
            open={open}
            onClose={onClose}
            TransitionComponent={Slide}
            key={"slide"}
            autoHideDuration={3000}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
            <Box
                sx={{
                    width: "350px",
                    height: "175px",
                    borderRadius: "8px",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    padding: '16px',
                    position: 'relative',
                    backdropFilter: "blur(15px)",
                    WebkitBackdropFilter: "blur(15px)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    backgroundColor: hexToRGBA("#0090f2", 0.31),
                }}
            >
                {icon}
                <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                    <Typography sx={{ color: '#fff' }}>
                        {title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#fff' }}>
                        {description}
                    </Typography>
                    <Box sx={{ width: '100%', marginTop: '8px', display: 'flex', alignItems: 'center' }}>
                        <LinearProgress variant="determinate" value={progressValue} sx={{ height: '10px', borderRadius: '5px', backgroundColor: '#fff', flexGrow: 1, transition: 'width 1.5s ease-in-out' }} />
                        <Typography sx={{ marginLeft: '8px', color: '#fff' }}>
                                {isDataHog 
                                    ? `${progress.toFixed(2)}/${progressMax.toFixed(2)} KB`
                                    : `${Math.round(progress)}/${Math.round(progressMax)}`
                                }
                            </Typography>
                    </Box>
                </Box>
            </Box>
        </Snackbar>
    );
};

interface AchievementProgressRuntimeProps {
    open: boolean;
    onClose: () => void;
    title: string;
    description: string;
    progress: number;
    progressMax: number;
    icon: React.ReactNode;
}

const AchievementProgressRuntime: React.FC<AchievementProgressRuntimeProps> = ({ open, onClose, title, description, progress, progressMax, icon }) => {
    const [progressValue, setProgressValue] = useState(0);
    const value = (progress / progressMax) * 100;

    useEffect(() => {
        if (open) {
            setProgressValue(0);
            const timer = setTimeout(() => setProgressValue(value), 100);
            return () => clearTimeout(timer);
        }
    }, [open, value]);

    return (
        <Snackbar
            open={open}
            onClose={onClose}
            TransitionComponent={Slide}
            key={"slide"}
            autoHideDuration={3000}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            sx={{ marginBottom: "-25px" }}
        >
            <Box
                sx={{
                    width: "100vw",
                    height: "175px",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px',
                    position: 'relative',
                    backdropFilter: "blur(15px)",
                    WebkitBackdropFilter: "blur(15px)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    backgroundColor: hexToRGBA("#0090f2", 0.31),
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                    }}
                >
                    <Typography variant="h4" sx={{ color: '#fff', marginRight: '16px' }}>
                        {title}
                    </Typography>
                    {icon}
                    <Box sx={{ display: "flex", flexDirection: "column", width: "40%" }}>
                        <Typography variant="body1" sx={{ color: '#fff', marginBottom: '8px' }}>
                            {description}
                        </Typography>
                        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                            <LinearProgress 
                                variant="determinate" 
                                value={progressValue} 
                                sx={{ 
                                    height: '10px', 
                                    borderRadius: '5px', 
                                    backgroundColor: 'rgba(255,255,255,0.3)', 
                                    flexGrow: 1, 
                                    transition: 'width 1.5s ease-in-out',
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: '#fff',
                                    }
                                }} 
                            />
                            <Typography sx={{ marginLeft: '8px', color: '#fff' }}>{`${progress}/${progressMax}`}</Typography>
                        </Box>
                    </Box>
                </Box>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '0%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        borderRadius: '2px',
                        padding: '8px 16px',
                        zIndex: 1,
                    }}
                >
                    <Typography variant="h6" sx={{ color: '#fff' }}>
                        Progression Update
                    </Typography>
                </Box>
            </Box>
        </Snackbar>
    );
};

const Achievement: React.FC<AchievementProps> = ({ open, onClose, title, description, icon }) => {
    return (
        <Snackbar
            open={open}
            onClose={onClose}
            TransitionComponent={Slide}
            key={"slide"}
            autoHideDuration={3000}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            sx={{
                marginBottom: "-25px"
            }}
        >
            <Box
                sx={{
                    width: "100vw",
                    height: "175px",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px',
                    position: 'relative',
                    backdropFilter: "blur(15px)",
                    WebkitBackdropFilter: "blur(15px)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    backgroundColor: hexToRGBA("#0090f2", 0.31),
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                    }}
                >
                    <Typography variant="h4" sx={{ color: '#fff' }}>
                        {title}
                    </Typography>
                    {icon}
                    <Typography variant="body1" sx={{ color: '#fff' }}>
                        {description}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '0%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        borderRadius: '2px',
                        padding: '8px 16px',
                        zIndex: 1,
                    }}
                >
                    <Typography variant="h6" sx={{ color: '#fff' }}>
                        Progression Tier Reached
                    </Typography>
                </Box>
            </Box>
        </Snackbar>
    );
};

interface ProgressionNotificationProps {
    progression: string;
    achievement: boolean;
    progress: number | null;
    onClose: () => void | null;
    xpData?: {
        xp_update: {
            old_xp: number;
            new_xp: number;
            old_renown: number | null;
            new_renown: number;
            current_renown: number;
            old_level: number;
            new_level: number;
            next_level: number;
            max_xp_for_lvl: number;
        };
        level_up_reward: {
            reward: {
                id: string;
                user_id: string;
                name: string;
                color_palette: string;
                render_in_front: boolean;
            };
            reward_type: string;
        } | null;
    } | null;
}

const ProgressionNotification: React.FC<ProgressionNotificationProps> = ({ progression, achievement, progress, onClose, xpData }) => {
    const [achieveOpen, setAchieveOpen] = useState(false);
    const [achieveProgOpen, setAchieveProgOpen] = useState(false);
    type Progression = {
        id: string;
        user_id: string;
        data_hog: string;
        hungry_learner: string;
        measure_once: string;
        man_of_the_inside: string;
        scribe: string;
        tenacious: string;
        hot_streak: string;
        unit_mastery: string;
     }
    const [progressionData, setProgressionData] = useState<Progression | null>(null);
    const [progressionLevel, setProgressionLevel] = useState('');
    const [progressionLevelMax, setProgressionLevelMax] = useState('');

    const getProgressions = async () => {
        try {
            const response = await fetch(
                `${config.rootPath}/api/stats/getProgression`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: '{}',
                    credentials: 'include'
                }
            );

            const data = await response.json();
            if (data.progression) {
                setProgressionData(data.progression);
                const result = DetermineProgressionLevel(progression, data.progression[progression] || '0');
                setProgressionLevel(result?.[0] ?? '');
                setProgressionLevelMax(result?.[1] ?? '');
            }
        } catch (e) {
            console.log("failed to get progression: ", e);
        }
    };

    useEffect(() => {
        getProgressions();
    }, [progression]);

    useEffect(() => {
        if (progressionData) {
            const currentValue = parseFloat(progressionData[progression as keyof Progression] || '0');
            const result = DetermineProgressionLevel(progression, currentValue.toString());
            const maxValue = parseInt(result?.[1] ?? '');
            const thresholdValue = parseInt(result?.[2] ?? '0');

            if (["man_of_the_inside", "data_hog", "scribe", "tenacious", "hungry_learner", "unit_mastery"].includes(progression)) {
                setAchieveOpen(currentValue >= maxValue || currentValue === thresholdValue);
                setAchieveProgOpen(currentValue < maxValue && currentValue !== thresholdValue);
            } else {
                setAchieveOpen(achievement);
                setAchieveProgOpen(!achievement);
            }

            setProgressionLevel(result?.[0] ?? '');
            setProgressionLevelMax(result?.[1] ?? '');
        }
    }, [progression, progressionData, achievement]);

    if (xpData) {
        const { xp_update, level_up_reward } = xpData;
        // @ts-ignore
        return (
            <XpPopup
                oldXP={(xp_update.old_xp * 100) / xp_update.max_xp_for_lvl}
                newXP={(xp_update.new_xp * 100) / xp_update.max_xp_for_lvl}
                nextLevel={xp_update.old_level !== null ? xp_update.new_level : xp_update.next_level}
                maxXP={100}
                levelUp={level_up_reward !== null}
                gainedXP={xp_update.new_xp - xp_update.old_xp}
                //@ts-ignore
                reward={level_up_reward}
                renown={xp_update.current_renown}
                popupClose={onClose}
                homePage={false}
            />
        );
    }

    const getProgressNotification = (progression: string) => {
        switch (progression) {
            case "data_hog":
                return (
                    <AchievementProgress
                        open={achieveProgOpen}
                        onClose={() => { setAchieveProgOpen(false); onClose(); }}
                        title="Data Hog"
                        description="Amount of executable code written"
                        progress={parseFloat(progressionData?.data_hog || '0') / 1000}
                        progressMax={parseInt(progressionLevelMax) / 1000}
                        icon={<Code fontSize="small" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', margin: '0 16px' }} />}
                        isDataHog={true}
                    />
                );
            case "hungry_learner":
                return (
                    <AchievementProgress
                        open={achieveProgOpen}
                        onClose={() => { setAchieveProgOpen(false); onClose(); }}
                        title="Hungry Learner"
                        description="Number of concepts learned"
                        progress={parseFloat(progressionData?.hungry_learner || '0')}
                        progressMax={parseInt(progressionLevelMax)}
                        icon={<School fontSize="small" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }} />}
                    />
                );
            case "man_of_the_inside":
                return (
                    <AchievementProgress
                        open={achieveProgOpen}
                        onClose={() => { setAchieveProgOpen(false); onClose(); }}
                        title="Man on the Inside"
                        description="Number of chats sent to Code Teacher"
                        progress={parseFloat(progressionData?.man_of_the_inside ?? '0')}
                        progressMax={parseInt(progressionLevelMax)}
                        icon={<Chat fontSize="small" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }} />}
                    />
                );
            case "scribe":
                return (
                    <AchievementProgress
                        open={achieveProgOpen}
                        onClose={() => { setAchieveProgOpen(false); onClose(); }}
                        title="The Scribe"
                        description="Number of comments written"
                        progress={parseFloat(progressionData?.scribe || '0')}
                        progressMax={parseInt(progressionLevelMax)}
                        icon={<Comment fontSize="small" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', margin: '0 16px' }} />}
                    />
                );
            case "tenacious":
                return (
                    <AchievementProgress
                        open={achieveProgOpen}
                        onClose={() => { setAchieveProgOpen(false); onClose(); }}
                        title="Tenacious"
                        description="Number of Times Failed a byte then succeeded"
                        progress={parseFloat(progressionData?.tenacious || '0')}
                        progressMax={parseInt(progressionLevelMax)}
                        icon={<FitnessCenter fontSize="small" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }} />}
                    />
                );
            case "hot_streak":
                return (
                    <AchievementProgressRuntime
                        open={achieveProgOpen}
                        onClose={() => { setAchieveProgOpen(false); onClose(); }}
                        title="Hot Streak"
                        description="Bytes completed without failing"
                        progress={progress ?? 0}
                        progressMax={3}
                        icon={<Whatshot fontSize="small" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', margin: '0 16px' }} />}
                    />
                );
            case "unit_mastery":
                return (
                    <AchievementProgress
                        open={achieveProgOpen}
                        onClose={() => { setAchieveProgOpen(false); onClose(); }}
                        title="Unit Mastery"
                        description="Complete full unit without failing a byte"
                        progress={parseFloat(progressionData?.unit_mastery || '0')}
                        progressMax={parseInt(progressionLevelMax)}
                        icon={<School fontSize="small" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }} />}
                    />
                );
            default:
                return null;
        }
    };

    const getAchievementNotification = (progression: string) => {
        switch (progression) {
            case "data_hog":
                return (
                    <Achievement
                        open={achieveOpen}
                        onClose={() => { setAchieveOpen(false); onClose(); }}
                        title="Data Hog"
                        description={`${parseFloat(progressionData?.data_hog ?? '0') / 1000} KB of executable code written`}
                        icon={<Code fontSize="small" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }} />}
                    />
                );
            case "hungry_learner":
                return (
                    <Achievement
                        open={achieveOpen}
                        onClose={() => { setAchieveOpen(false); onClose(); }}
                        title="Hungry Learner"
                        description={`${parseFloat(progressionData?.hungry_learner ?? '0')} concepts learned`}
                        icon={<School fontSize="small" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }} />}
                    />
                );
            case "man_of_the_inside":
                return (
                    <Achievement
                        open={achieveOpen}
                        onClose={() => { setAchieveOpen(false); onClose(); }}
                        title="Man on the Inside"
                        description={`${parseFloat(progressionData?.man_of_the_inside ?? '0')} chats sent to Code Teacher`}
                        icon={<Chat fontSize="small" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }} />}
                    />
                );
            case "scribe":
                return (
                    <Achievement
                        open={achieveOpen}
                        onClose={() => { setAchieveOpen(false); onClose(); }}
                        title="The Scribe"
                        description={`${parseFloat(progressionData?.scribe ?? '0')} comments written`}
                        icon={<Comment fontSize="small" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }} />}
                    />
                );
            case "tenacious":
                return (
                    <Achievement
                        open={achieveOpen}
                        onClose={() => { setAchieveOpen(false); onClose(); }}
                        title="Tenacious"
                        description={`Times Failed a byte then succeeded (${parseFloat(progressionData?.tenacious ?? '0')})`}
                        icon={<FitnessCenter fontSize="small" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }} />}
                    />
                );
            case "hot_streak":
                return (
                    <Achievement
                        open={true}
                        onClose={() => { setAchieveOpen(false); onClose(); }}
                        title="Hot Streak"
                        description={`${progress} Bytes completed without failing`}
                        icon={<Whatshot fontSize="small" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }} />}
                    />
                );
            case "unit_mastery":
                return (
                    <Achievement
                        open={achieveOpen}
                        onClose={() => { setAchieveOpen(false); onClose(); }}
                        title="Unit Mastery"
                        description={`${parseFloat(progressionData?.unit_mastery ?? '0')} units completed without failing a byte`}
                        icon={<School fontSize="small" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }} />}
                    />
                );
            default:
                return null;
        }
    };

    if (["man_of_the_inside", "data_hog", "scribe", "tenacious", "hungry_learner", "unit_mastery"].includes(progression)) {
        return (
            <>
                {achieveOpen && getAchievementNotification(progression)}
                {achieveProgOpen && getProgressNotification(progression)}
            </>
        );
    } else {
        return achievement ? getAchievementNotification(progression) : getProgressNotification(progression);
    }
};

export default ProgressionNotification;

function hexToRGBA(hex: string, alpha: string | number) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return alpha ? `rgba(${r}, ${g}, ${b}, ${alpha})` : `rgb(${r}, ${g}, ${b})`;
}
