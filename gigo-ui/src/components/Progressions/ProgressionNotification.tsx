import React from 'react';
import { Snackbar, Box, Typography, LinearProgress, Slide } from '@mui/material';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import BugReportIcon from '@mui/icons-material/BugReport';
import ChatIcon from '@mui/icons-material/Chat';
import CommentIcon from '@mui/icons-material/Comment';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import StarIcon from '@mui/icons-material/Star';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import LanguageIcon from '@mui/icons-material/Language';
import XpPopup from '../XpPopup';

interface AchievementProgressProps {
    open: boolean;
    onClose: () => void;
    title: string;
    description: string;
    progress: number;
    progressMax: number;
    icon: React.ReactNode;
}

interface AchievementProps {
    open: boolean;
    onClose: () => void;
    title: string;
    description: string;
    icon: React.ReactNode;
}

const AchievementProgress: React.FC<AchievementProgressProps> = ({ open, onClose, title, description, progress, progressMax, icon }) => {
    const value = (progress / progressMax) * 100;
    const [progressValue, setProgressValue] = React.useState(0);

    React.useEffect(() => {
        if (open) {
            setProgressValue(0);
            const timer = setTimeout(() => {
                setProgressValue(value);
            }, 100); // Delay to ensure the animation starts
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
                        <Typography sx={{ marginLeft: '8px', color: '#fff' }}>{`${progress}/${progressMax}`}</Typography>
                    </Box>
                </Box>
            </Box>
        </Snackbar>
    );
};

interface AchivementProgressRuntimeProps {
    open: boolean;
    onClose: () => void;
    title: string;
    description: string;
    progress: number;
    progressMax: number;
    icon: React.ReactNode;
}

// this is for progressions that are displayed on run / on successful run
const AchivementProgressRuntime: React.FC<AchivementProgressRuntimeProps> = ({ open, onClose, title, description, progress, progressMax, icon }) => {
    const value = (progress / progressMax) * 100;
    const [progressValue, setProgressValue] = React.useState(0);

    React.useEffect(() => {
        if (open) {
            setProgressValue(0);
            const timer = setTimeout(() => {
                setProgressValue(value);
            }, 100);
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
    progress: string;
    onClose: () => void;
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
    const [achieveOpen, setAchieveOpen] = React.useState(false);
    const [achieveProgOpen, setAchieveProgOpen] = React.useState(false);

    React.useEffect(() => {
        if (achievement) {
            setAchieveOpen(true);
        } else {
            setAchieveProgOpen(true);
        }
    }, [achievement, progression]);

    const getProgressValue = (progress: string) => {
        const [current, max] = progress.split('/').map(Number);
        return { current, max };
    };

    const { current, max } = getProgressValue(progress);

    if (xpData) {
        const { xp_update, level_up_reward } = xpData;
        // @ts-ignore
        console.log("here: ", level_up_reward, level_up_reward.reward.name)
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
                        description="Amount of executable code written (6/10GB)"
                        progress={6}
                        progressMax={10}
                        icon={<CodeIcon fontSize="small" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }} />}
                    />
                );
            case "hungry_learner":
                return (
                    <AchievementProgress
                        open={achieveProgOpen}
                        onClose={() => { setAchieveProgOpen(false); onClose(); }}
                        title="Hungry Learner"
                        description="Number of concepts learned (6/30)"
                        progress={6}
                        progressMax={30}
                        icon={<SchoolIcon fontSize="small" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }} />}
                    />
                );
            case "syntax_errors":
                return (
                    <AchievementProgress
                        open={achieveProgOpen}
                        onClose={() => { setAchieveProgOpen(false); onClose(); }}
                        title="Measure Once, Cut Twice"
                        description="Number of Syntax Errors written (6/30)"
                        progress={6}
                        progressMax={30}
                        icon={<BugReportIcon fontSize="small" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }} />}
                    />
                );
            case "code_teacher":
                return (
                    <AchievementProgress
                        open={achieveProgOpen}
                        onClose={() => { setAchieveProgOpen(false); onClose(); }}
                        title="Man on the Inside"
                        description="Number of chats sent to Code Teacher (6/30)"
                        progress={6}
                        progressMax={30}
                        icon={<ChatIcon fontSize="small" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }} />}
                    />
                );
            case "scribe":
                return (
                    <AchievementProgress
                        open={achieveProgOpen}
                        onClose={() => { setAchieveProgOpen(false); onClose(); }}
                        title="The Scribe"
                        description="Number of comments written (6/30)"
                        progress={6}
                        progressMax={30}
                        icon={<CommentIcon fontSize="small" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }} />}
                    />
                );
            case "tenacious":
                return (
                    <AchievementProgress
                        open={achieveProgOpen}
                        onClose={() => { setAchieveProgOpen(false); onClose(); }}
                        title="Tenacious"
                        description="Number of Times Failed a byte then succeeded (6/30)"
                        progress={6}
                        progressMax={30}
                        icon={<FitnessCenterIcon fontSize="small" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }} />}
                    />
                );
            case "god_like":
                return (
                    <AchivementProgressRuntime
                        open={achieveProgOpen}
                        onClose={() => { setAchieveProgOpen(false); onClose(); }}
                        title="God Like"
                        description="Bytes completed without failing (2/5)"
                        progress={current % 5}
                        progressMax={5}
                        icon={<StarIcon fontSize="small" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', margin: '0 16px' }} />}
                    />
                );
            case "hot_streak":
                return (
                    <AchivementProgressRuntime
                        open={achieveProgOpen}
                        onClose={() => { setAchieveProgOpen(false); onClose(); }}
                        title="Hot Streak"
                        description={`Bytes completed without failing (${current}/${max})`}
                        progress={current % 3}
                        progressMax={3}
                        icon={<WhatshotIcon fontSize="small" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', margin: '0 16px' }} />}
                    />
                );
            case "unit_mastery":
                return (
                    <AchievementProgress
                        open={achieveProgOpen}
                        onClose={() => { setAchieveProgOpen(false); onClose(); }}
                        title="Unit Mastery"
                        description="Complete full unit without failing a byte (6/7)"
                        progress={6}
                        progressMax={7}
                        icon={<SchoolIcon fontSize="small" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }} />}
                    />
                );
            case "bilingual":
                return (
                    <AchievementProgress
                        open={achieveProgOpen}
                        onClose={() => { setAchieveProgOpen(false); onClose(); }}
                        title="Bilingual"
                        description="Started learning 2 different programming languages (1/2)"
                        progress={1}
                        progressMax={2}
                        icon={<LanguageIcon fontSize="small" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }} />}
                    />
                );
            case "linguist":
                return (
                    <AchievementProgress
                        open={achieveProgOpen}
                        onClose={() => { setAchieveProgOpen(false); onClose(); }}
                        title="Linguist"
                        description="Started learning 3 different programming languages (1/3)"
                        progress={1}
                        progressMax={3}
                        icon={<LanguageIcon fontSize="small" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }} />}
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
                        description="10 GB of executable code written"
                        icon={<CodeIcon fontSize="small" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }} />}
                    />
                );
            case "hungry_learner":
                return (
                    <Achievement
                        open={achieveOpen}
                        onClose={() => { setAchieveOpen(false); onClose(); }}
                        title="Hungry Learner"
                        description="30 concepts learned"
                        icon={<SchoolIcon fontSize="small" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }} />}
                    />
                );
            case "syntax_errors":
                return (
                    <Achievement
                        open={achieveOpen}
                        onClose={() => { setAchieveOpen(false); onClose(); }}
                        title="Measure Once, Cut Twice"
                        description="15 Syntax Errors written"
                        icon={<BugReportIcon fontSize="small" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }} />}
                    />
                );
            case "code_teacher":
                return (
                    <Achievement
                        open={achieveOpen}
                        onClose={() => { setAchieveOpen(false); onClose(); }}
                        title="Man on the Inside"
                        description="30 chats sent to Code Teacher"
                        icon={<ChatIcon fontSize="small" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }} />}
                    />
                );
            case "scribe":
                return (
                    <Achievement
                        open={achieveOpen}
                        onClose={() => { setAchieveOpen(false); onClose(); }}
                        title="The Scribe"
                        description="30 comments written"
                        icon={<CommentIcon fontSize="small" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }} />}
                    />
                );
            case "tenacious":
                return (
                    <Achievement
                        open={achieveOpen}
                        onClose={() => { setAchieveOpen(false); onClose(); }}
                        title="Tenacious"
                        description="Times Failed a byte then succeeded (30)"
                        icon={<FitnessCenterIcon fontSize="small" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }} />}
                    />
                );
            case "god_like":
                return (
                    <Achievement
                        open={achieveOpen}
                        onClose={() => { setAchieveOpen(false); onClose(); }}
                        title="God Like"
                        description="5 Bytes completed without failing"
                        icon={<StarIcon fontSize="small" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }} />}
                    />
                );
            case "hot_streak":
                return (
                    <Achievement
                        open={true}
                        onClose={() => { setAchieveOpen(false); onClose(); }}
                        title="Hot Streak"
                        description="3 Bytes completed without failing"
                        icon={<WhatshotIcon fontSize="small" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }} />}
                    />
                );
            case "unit_mastery":
                return (
                    <Achievement
                        open={achieveOpen}
                        onClose={() => { setAchieveOpen(false); onClose(); }}
                        title="Unit Mastery"
                        description="7 units completed without failing a byte"
                        icon={<SchoolIcon fontSize="small" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }} />}
                    />
                );
            case "bilingual":
                return (
                    <Achievement
                        open={achieveOpen}
                        onClose={() => { setAchieveOpen(false); onClose(); }}
                        title="Bilingual"
                        description="Started learning 2 different programming languages"
                        icon={<LanguageIcon fontSize="small" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }} />}
                    />
                );
            case "linguist":
                return (
                    <Achievement
                        open={achieveOpen}
                        onClose={() => { setAchieveOpen(false); onClose(); }}
                        title="Linguist"
                        description="Started learning 3 different programming languages"
                        icon={<LanguageIcon fontSize="small" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }} />}
                    />
                );
            default:
                return null;
        }
    };

    if (achievement) {
        return getAchievementNotification(progression);
    } else {
        return getProgressNotification(progression);
    }
};

export default ProgressionNotification;

function hexToRGBA(hex: string, alpha: string | number) {
    let r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}
