import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import Box from "@mui/material/Box";
import SavingsIcon from "@mui/icons-material/Savings";
import Typography from "@mui/material/Typography";
import * as React from "react";
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import TerminalIcon from '@mui/icons-material/Terminal';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import LinearProgress from "@mui/material/LinearProgress";
import {SvgIconComponent} from "@mui/icons-material";

interface AchievementProgressProps {
    open: boolean;
    onClose: () => void;
    title: string;
    description: string;
    icon: SvgIconComponent;
    progress: number;
    progressMax: number;
}

interface AchievementProps {
    open: boolean;
    onClose: () => void;
    title: string;
    description: string;
    icon: SvgIconComponent;
}

function ProgressionNotification() {
    const [achieveOpen, setAchieveOpen] = React.useState(false)

    const AchievementProgress: React.FC<AchievementProgressProps> = ({ open, onClose, title, description, progress, progressMax }) => {
        const value = (progress / progressMax) * 100;

        return (
            <Snackbar
                open={open}
                onClose={onClose}
                TransitionComponent={Slide}
                key={"slide"}
                autoHideDuration={5000}
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
                    <QuestionAnswerIcon
                        fontSize="small"
                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }}
                    />
                    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                        <Typography sx={{ color: '#fff' }}>
                            {title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#fff' }}>
                            {description}
                        </Typography>
                        <Box sx={{ width: '100%', marginTop: '8px', display: 'flex', alignItems: 'center' }}>
                            <LinearProgress variant="determinate" value={value} sx={{ height: '10px', borderRadius: '5px', backgroundColor: '#fff', flexGrow: 1 }} />
                            <Typography sx={{ marginLeft: '8px', color: '#fff' }}>{`${progress}/${progressMax}`}</Typography>
                        </Box>
                    </Box>
                </Box>
            </Snackbar>
        );
    };

    const Achievement: React.FC<AchievementProps> = ({ open, onClose, title, description }) => {
        return (
            <Snackbar
                open={achieveOpen}
                onClose={() => setAchieveOpen(false)}
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
                        <QuestionAnswerIcon
                            fontSize="small"
                            style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', margin: '0 16px' }}
                        />
                        <Typography variant="body1" sx={{ color: '#fff' }}>
                            {description}
                        </Typography>
                    </Box>
                    {/* Overlay Box */}
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

    const dataHogProg = () => (
        <AchievementProgress
            open={achieveOpen}
            onClose={() => setAchieveOpen(false)}
            title="Data Hog"
            description="Amount of executable code written (6/10GB)"
            icon={QuestionAnswerIcon}
            progress={6}
            progressMax={10}
        />
    );

    const dataHog = () => (
        <Achievement
            open={achieveOpen}
            onClose={() => setAchieveOpen(false)}
            title="Data Hog"
            description="10 GB of executable code written"
            icon={QuestionAnswerIcon}
        />
    );

    const hungryLearnerProg = () => (
        <AchievementProgress
            open={achieveOpen}
            onClose={() => setAchieveOpen(false)}
            title="Hungry Learner"
            description="Number of concepts learned (6/30)"
            icon={QuestionAnswerIcon}
            progress={6}
            progressMax={30}
        />
    );

    const hungryLearner = () => (
        <Achievement
            open={achieveOpen}
            onClose={() => setAchieveOpen(false)}
            title="Hungry Learner"
            description="30 concepts learned)"
            icon={QuestionAnswerIcon}
        />
    );

    const syntaxErrorsProg = () => (
        <AchievementProgress
            open={achieveOpen}
            onClose={() => setAchieveOpen(false)}
            title="Measure Once, Cut Twice"
            description="Number of Syntax Errors written (6/30)"
            icon={QuestionAnswerIcon}
            progress={6}
            progressMax={30}
        />
    );

    const syntaxErrors = () => (
        <Achievement
            open={achieveOpen}
            onClose={() => setAchieveOpen(false)}
            title="Measure Once, Cut Twice"
            description="15 Syntax Errors written"
            icon={QuestionAnswerIcon}
        />
    );

    const codeTeacherProg = () => (
        <AchievementProgress
            open={achieveOpen}
            onClose={() => setAchieveOpen(false)}
            title="Man on the Inside"
            description="Number of chats sent to Code Teacher (6/30)"
            icon={QuestionAnswerIcon}
            progress={6}
            progressMax={30}
        />
    );

    const codeTeacher = () => (
        <Achievement
            open={achieveOpen}
            onClose={() => setAchieveOpen(false)}
            title="Man on the Inside"
            description="30 chats sent to Code Teacher"
            icon={QuestionAnswerIcon}
        />
    );

    const scribeProg = () => (
        <AchievementProgress
            open={achieveOpen}
            onClose={() => setAchieveOpen(false)}
            title="The Scribe"
            description="Number of comments written (6/30)"
            icon={QuestionAnswerIcon}
            progress={6}
            progressMax={30}
        />
    );

    const scribe = () => (
        <Achievement
            open={achieveOpen}
            onClose={() => setAchieveOpen(false)}
            title="The Scribe"
            description="30 comments written"
            icon={QuestionAnswerIcon}
        />
    );

    const tenaciousProg = () => (
        <AchievementProgress
            open={achieveOpen}
            onClose={() => setAchieveOpen(false)}
            title="Tenacious"
            description="Number of Times Failed a byte then succeeded (6/30)"
            icon={QuestionAnswerIcon}
            progress={6}
            progressMax={30}
        />
    );

    const tenacious = () => (
        <Achievement
            open={achieveOpen}
            onClose={() => setAchieveOpen(false)}
            title="Tenacious"
            description="Times Failed a byte then succeeded (30)"
            icon={QuestionAnswerIcon}
        />
    );

    const godLikeProg = () => (
        <AchievementProgress
            open={achieveOpen}
            onClose={() => setAchieveOpen(false)}
            title="God Like"
            description="Bytes completed without failing (2/5)"
            icon={QuestionAnswerIcon}
            progress={2}
            progressMax={5}
        />
    );

    const godLike = () => (
        <Achievement
            open={achieveOpen}
            onClose={() => setAchieveOpen(false)}
            title="God Like"
            description=" 5 Bytes completed without failing"
            icon={QuestionAnswerIcon}
        />
    );

    const hotStreakProg = () => (
        <AchievementProgress
            open={achieveOpen}
            onClose={() => setAchieveOpen(false)}
            title="Hot Streak"
            description="Bytes completed without failing (2/3)"
            icon={QuestionAnswerIcon}
            progress={2}
            progressMax={3}
        />
    );

    const hotStreak = () => (
        <Achievement
            open={achieveOpen}
            onClose={() => setAchieveOpen(false)}
            title="Hot Streak"
            description="3 Bytes completed without failing"
            icon={QuestionAnswerIcon}
        />
    );

    const unitMasteryProg = () => (
        <AchievementProgress
            open={achieveOpen}
            onClose={() => setAchieveOpen(false)}
            title="Unit Mastery"
            description="Complete full unit without failing a byte (6/7)"
            icon={QuestionAnswerIcon}
            progress={6}
            progressMax={7}
        />
    );

    const unitMastery = () => (
        <Achievement
            open={achieveOpen}
            onClose={() => setAchieveOpen(false)}
            title="Unit Mastery"
            description="7 units completed without failing a byte"
            icon={QuestionAnswerIcon}
        />
    );

    const bilingualProg = () => (
        <AchievementProgress
            open={achieveOpen}
            onClose={() => setAchieveOpen(false)}
            title="Bilingual"
            description="Started learning 2 different programming languages (1/2)"
            icon={QuestionAnswerIcon}
            progress={1}
            progressMax={2}
        />
    );

    const bilingual = () => (
        <Achievement
            open={achieveOpen}
            onClose={() => setAchieveOpen(false)}
            title="Bilingual"
            description="Started learning 2 different programming languages"
            icon={QuestionAnswerIcon}
        />
    );

    const linguistProg = () => (
        <AchievementProgress
            open={achieveOpen}
            onClose={() => setAchieveOpen(false)}
            title="Linguist"
            description="Started learning 3 different programming languages (1/3)"
            icon={QuestionAnswerIcon}
            progress={1}
            progressMax={3}
        />
    );

    const linguist = () => (
        <Achievement
            open={achieveOpen}
            onClose={() => setAchieveOpen(false)}
            title="Linguist"
            description="Started learning 3 different programming languages"
            icon={QuestionAnswerIcon}
        />
    );
}

//  // const progressionPop = () => {
//     //     return (
//     //         <Snackbar
//     //             open={achieveOpen}
//     //             onClose={() => setAchieveOpen(false)}
//     //             TransitionComponent={Slide}
//     //             key={"slide"}
//     //             autoHideDuration={3000}
//     //             anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//     //             sx={{
//     //                 marginBottom: "-25px"
//     //             }}
//     //         >
//     //             <Box
//     //                 sx={{
//     //                     width: "100vw",
//     //                     height: "175px",
//     //                     display: 'flex',
//     //                     alignItems: 'center',
//     //                     justifyContent: 'center',
//     //                     padding: '16px',
//     //                     position: 'relative',
//     //                     backdropFilter: "blur(15px)",
//     //                     WebkitBackdropFilter: "blur(15px)",
//     //                     border: "1px solid rgba(255,255,255,0.18)",
//     //                     backgroundColor: hexToRGBA("#0090f2", 0.31),
//     //                 }}
//     //             >
//     //                 <Box
//     //                     sx={{
//     //                         display: "flex",
//     //                         alignItems: 'center',
//     //                         justifyContent: 'center',
//     //                         width: '100%',
//     //                     }}
//     //                 >
//     //                     <Typography variant="h4" sx={{ color: '#fff' }}>
//     //                         Man on the Inside
//     //                     </Typography>
//     //                     <QuestionAnswerIcon
//     //                         fontSize="small"
//     //                         style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', margin: '0 16px' }}
//     //                     />
//     //                     <Typography variant="body1" sx={{ color: '#fff' }}>
//     //                         30 Messages Sent to Code Teacher
//     //                     </Typography>
//     //                 </Box>
//     //
//     //                 {/* Overlay Box */}
//     //                 <Box
//     //                     sx={{
//     //                         position: 'absolute',
//     //                         top: '0%',
//     //                         left: '50%',
//     //                         transform: 'translate(-50%, -50%)',
//     //                         backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     //                         borderRadius: '2px',
//     //                         padding: '8px 16px',
//     //                         zIndex: 1,
//     //                     }}
//     //                 >
//     //                     <Typography variant="h6" sx={{ color: '#fff' }}>
//     //                         Progression Tier Reached
//     //                     </Typography>
//     //                 </Box>
//     //             </Box>
//     //         </Snackbar>
//     //
//     //     )
//     // }
//
//     const progressionPop = () => {
//         return (
//             <Snackbar
//                 open={achieveOpen}
//                 onClose={() => setAchieveOpen(false)}
//                 TransitionComponent={Slide}
//                 key={"slide"}
//                 autoHideDuration={5000}
//                 anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//             >
//                 <Box
//                     sx={{
//                         width: "400px",
//                         height: "175px",
//                         borderRadius: "8px",
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'flex-start',
//                         padding: '16px',
//                         position: 'relative',
//                         backdropFilter: "blur(15px)",
//                         WebkitBackdropFilter: "blur(15px)",
//                         border: "1px solid rgba(255,255,255,0.18)",
//                         backgroundColor: hexToRGBA("#0090f2", 0.41),
//                     }}
//                 >
//                     <QuestionAnswerIcon
//                         fontSize="small"
//                         style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }}
//                     />
//                     <Box sx={{
//                         display: "flex",
//                         flexDirection: "column",
//                         width: "100%"
//                     }}>
//                         <Typography sx={{ color: '#fff' }}>
//                             Man on the Inside
//                         </Typography>
//                         <Typography variant="body2" sx={{ color: '#fff' }}>
//                             Number of messages sent to Code Teacher
//                         </Typography>
//                         <Box sx={{ width: '100%', marginTop: '8px', display: 'flex', alignItems: 'center' }}>
//                             <LinearProgress variant="determinate" value={(6 / 30) * 100} sx={{ height: '10px', borderRadius: '5px', backgroundColor: '#fff', flexGrow: 1 }} />
//                             <Typography sx={{ marginLeft: '8px', color: '#fff' }}>{`6/30`}</Typography>
//                         </Box>
//                     </Box>
//                 </Box>
//             </Snackbar>
//         )
//     }

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


export default ProgressionNotification;

