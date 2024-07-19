'use client'

import React, {Suspense, useEffect, useState} from 'react';
import {Container, Grid, Paper, Typography, Box, Tooltip, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogContentText} from '@mui/material';
import {theme} from "@/theme";
import LinearProgress from "@mui/material/LinearProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SchoolIcon from '@mui/icons-material/School';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import SearchIcon from '@mui/icons-material/Search';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ComputerIcon from '@mui/icons-material/Computer';
import TimerIcon from '@mui/icons-material/Timer';
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import call from "@/services/api-call";
import swal from "sweetalert";
import {Extension} from "@uiw/react-codemirror";
import config from "@/config";
import SheenPlaceholder from '@/components/Loading/SheenPlaceholder';
import BytesCard from '@/components/BytesCard';
import { programmingLanguages } from '@/services/vars';
import MarkdownRenderer from "@/components/Markdown/MarkdownRenderer";
import { string } from 'prop-types';
import DetermineProgressionLevel from '@/utils/progression';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CloseIcon from '@mui/icons-material/Close';

export default function StatsPageMobile() {

    const styles = {
        progressBar: {
            flexGrow: 1,
            marginRight: theme.spacing(2),
            height: 16,
            borderRadius: 8,
            background: 'linear-gradient(90deg, rgba(170,170,170,0.2) 0%, rgba(0,0,0,0.2) 100%)',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            border: '1px solid rgba(255,255,255,0.18)',
        }
    }

    type ProgrammingStats = {
        id: number;
        user_id: number;
        numbered_mastered_concepts: number;
        completion_failure_rate: number;
        focus_on_this: string;
        fot_detour_unit: number | null;
        most_struggled_concept: string;
        number_problems_solved_ct: number;
        avg_time_complete_byte: string; // Assuming you convert time.Duration to string
    };

    type FOT = {
        id: string;
        owner_id: string;
        concept: string;
        mistake_description: string;
        concept_explanation: string;
        created_at: Date;
        valid_until: Date;
        byte_id: string | null;
        search_query: string;
        in_operation: boolean;
        hash: string | null;
    };

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
    const [progression, setProgression] = useState<Progression | null>(null);
    const [data_hog_level, setDataHogLevel] = useState<string>("Level 1");
    const [data_hog_level_max, setDataHogLevelMax] = useState<string>("10KB");
    const [hungry_learner_level, setHungryLearnerLevel] = useState<string>("Level 1");
    const [hungry_learner_level_max, setHungryLearnerLevelMax] = useState<string>("5");
    const [man_of_the_inside_level, setManOfTheInsideLevel] = useState<string>("Level 1");
    const [man_of_the_inside_level_max, setManOfTheInsideLevelMax] = useState<string>("10");
    const [tenacious_level, setTenaciousLevel] = useState<string>("Level 1");
    const [tenacious_level_max, setTenaciousLevelMax] = useState<string>("5");
    const [scribe_level, setScribeLevel] = useState<string>("Level 1");
    const [scribe_level_max, setScribeLevelMax] = useState<string>("50");
    const [unit_mastery_level, setUnitMasteryLevel] = useState<string>("Level 1");
    const [unit_mastery_level_max, setUnitMasteryLevelMax] = useState<string>("1");

    const [stats, setStats] = useState<ProgrammingStats | null>(null);
    const [fot, setFot] = useState<FOT | null>(null);
    const [isHotStreak, setIsHotStreak] = useState(false);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [highestStreak, setHighestStreak] = useState(0); 
    const [languagesLearned, setLanguagesLearned] = useState(0);
    const [linguistType, setLinguistType] = useState("Novice");

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogContent, setDialogContent] = useState('');

    const handleOpenDialog = (title: string, content: string) => {
        setDialogTitle(title);
        setDialogContent(content);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    useEffect(() => {
        if (progression) {
            console.log("progression 2: ", progression);
            console.log("progression moti: ", Math.min(parseFloat(progression?.man_of_the_inside || '0')/500, 1));
        }
    }, [progression]);
    

    useEffect(() => {

        const populateCheckNumberMastered = async () => {
            try {
                const response = await fetch(
                    `${config.rootPath}/api/stats/checkNumberMastered`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: '{}',
                        credentials: 'include'
                    }
                );
            } catch (e) {
                console.log("failed to get number mastered: ", e);
            }
        };

        const populateAvgTime = async () => {
            try {
                const response = await fetch(
                    `${config.rootPath}/api/stats/avgTimeCompleteByte`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: '{}',
                        credentials: 'include'
                    }
                );
            } catch (e) {
                console.log("failed to get avg time: ", e);
            }
        };

        const populateCFR = async () => {
            try {
                const response = await fetch(
                    `${config.rootPath}/api/stats/completionFailureRate`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: '{}',
                        credentials: 'include'
                    }
                );
            } catch (e) {
                console.log("failed to get cfr: ", e);
            }
        };


        const fetchStats = async () => {
            try {
                const response = await fetch(
                    `${config.rootPath}/api/stats/getUserProgrammingStats`,
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
                if (data.stats) {
                    setStats(data.stats);
                }
            } catch (e) {
                console.log("failed to get stats: ", e);
            }
        };

        const checkHotStreak = async () => {
            let res = await fetch(
                `${config.rootPath}/api/stats/checkHotStreak`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: '{}',
                    credentials: 'include'
                }
            ).then(res => res.json());
    
            if (res === undefined || res["hot_streak"] === undefined) {
                return;
            }
    
            setIsHotStreak(res["hot_streak"]);
            setCurrentStreak(res["streak_count"]);
            setHighestStreak(res["highest_streak"]);
        }

        const checkLinguist = async () => {
            let res = await fetch(
                `${config.rootPath}/api/stats/checkLinguist`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: '{}',
                    credentials: 'include'
                }
            ).then(res => res.json());
    
            if (res === undefined || res["language_count"] === undefined) {
                return;
            }
    
            const languagesLearned = res["language_count"];
            let linguistType = "Novice";
            if (res["bilingual"] && !res["linguist"]) {
                linguistType = "Bilingual";
            } else if (res["linguist"]) {
                linguistType = "Linguist";
            }

            setLanguagesLearned(languagesLearned);
            setLinguistType(linguistType);
        }

        const fetchProgression = async () => {
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
                   
                    console.log("progression: ", data.progression);
                    setProgression(data.progression);
                    // Data Hog
                    const dataHogResult = DetermineProgressionLevel("data_hog", data.progression?.data_hog ?? '0');
                    const dataHogLevel = dataHogResult?.[0] ?? '';
                    const dataHogLevelMax = dataHogResult?.[1] ?? '';
                    setDataHogLevel(dataHogLevel);
                    setDataHogLevelMax(dataHogLevelMax);

                    console.log("data hog level: ", dataHogLevel);
                    console.log("data hog level max: ", dataHogLevelMax);

                    // Hungry Learner
                    const hungryLearnerResult = DetermineProgressionLevel("hungry_learner", data.progression?.hungry_learner ?? '0');
                    const hungryLearnerLevel = hungryLearnerResult?.[0] ?? '';
                    const hungryLearnerLevelMax = hungryLearnerResult?.[1] ?? '';
                    setHungryLearnerLevel(hungryLearnerLevel);
                    setHungryLearnerLevelMax(hungryLearnerLevelMax);

                    // Man on the Inside
                    const manOnTheInsideResult = DetermineProgressionLevel("man_of_the_inside", data.progression?.man_of_the_inside ?? '0');
                    const manOnTheInsideLevel = manOnTheInsideResult?.[0] ?? '';
                    const manOnTheInsideLevelMax = manOnTheInsideResult?.[1] ?? '';
                    setManOfTheInsideLevel(manOnTheInsideLevel);
                    setManOfTheInsideLevelMax(manOnTheInsideLevelMax);

                    // The Scribe
                    const scribeResult = DetermineProgressionLevel("scribe", data.progression?.scribe ?? '0');
                    const scribeLevel = scribeResult?.[0] ?? '';
                    const scribeLevelMax = scribeResult?.[1] ?? '';
                    setScribeLevel(scribeLevel);
                    setScribeLevelMax(scribeLevelMax);

                    // Tenacious
                    const tenaciousResult = DetermineProgressionLevel("tenacious", data.progression?.tenacious ?? '0');
                    const tenaciousLevel = tenaciousResult?.[0] ?? '';
                    const tenaciousLevelMax = tenaciousResult?.[1] ?? '';
                    setTenaciousLevel(tenaciousLevel);
                    setTenaciousLevelMax(tenaciousLevelMax);

                    // Unit Mastery
                    const unitMasteryResult = DetermineProgressionLevel("unit_mastery", data.progression?.unit_mastery ?? '0');
                    const unitMasteryLevel = unitMasteryResult?.[0] ?? '';
                    const unitMasteryLevelMax = unitMasteryResult?.[1] ?? '';
                    setUnitMasteryLevel(unitMasteryLevel);
                    setUnitMasteryLevelMax(unitMasteryLevelMax);
                    // console.log("progression 2: ", data.progression)
                    // console.log("progression data hog: ", Math.min(parseFloat(data.progression?.data_hog ?? '0') / (10 * 1024), 1));
                }
            } catch (e) {
                console.log("failed to get progression: ", e);
            }
        };


        const fetchFOT = async () => {
            try {
                const response = await fetch(
                    `${config.rootPath}/api/stats/getFOT`,
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
                if (data.fot) {
                    setFot(data.fot);
                    console.log("fot: ", data.fot);
                }
                console.log("fot data: ", data);
            } catch (e) {
                console.log("failed to get fot: ", e);
            }
        };

        populateCheckNumberMastered();
        populateAvgTime();
        populateCFR();
        fetchStats();
        fetchFOT();
        fetchProgression();
        checkHotStreak();
        checkLinguist();
    }, []);

    const statBoxes = () => {
        return (
            <Grid container spacing={2}>
                {/* Mastered Concepts */}
                <Grid item xs={6}>
                    <Box
                        onClick={() => handleOpenDialog('Mastered Concepts', 'This is the number of unique units you have finished in journeys. Each completion of a unit counts towards a mastered concept')}
                        sx={{
                            position: 'relative',
                            padding: 2,
                            textAlign: 'center',
                            height: '15vh',
                            overflow: 'hidden',
                            border: '1px solid',
                            borderColor: theme.palette.primary.light,
                            backgroundImage: 'linear-gradient(to top, #208562 -5%, transparent 20%)',
                            borderRadius: '20px'
                        }}
                    >
                        <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
                            <Box display="flex" justifyContent="center">
                                <SchoolIcon sx={{ fontSize: 40 }} />
                            </Box>
                            <Typography variant="h3">{stats?.numbered_mastered_concepts}</Typography>
                            <Typography variant="subtitle1">Mastered Concepts</Typography>
                        </Box>
                    </Box>
                </Grid>

                {/* Completion v Failure */}
                <Grid item xs={6}>
                    <Box
                        onClick={() => handleOpenDialog('Completion v Failure', 'Ratio of completions to failures.')}
                        sx={{
                            position: 'relative',
                            padding: 2,
                            textAlign: 'center',
                            height: '15vh',
                            overflow: 'hidden',
                            border: '1px solid',
                            borderColor: theme.palette.primary.light,
                            backgroundImage: 'linear-gradient(to top, #208562 -5%, transparent 20%)',
                            borderRadius: '20px'
                        }}
                    >
                        <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
                            <Box display="flex" justifyContent="center">
                                <TrackChangesIcon sx={{ fontSize: 40 }} />
                            </Box>
                            <Typography variant="h3">
                                {
                                    // @ts-ignore
                                    parseFloat(stats?.completion_failure_rate)?.toFixed(2)
                                }
                            </Typography>
                            <Typography variant="subtitle1">Completion v Failure</Typography>
                        </Box>
                    </Box>
                </Grid>

                {/* Problems by Code Teacher */}
                <Grid item xs={6}>
                    <Box
                        onClick={() => handleOpenDialog('Problems Solved by Code Teacher', 'Number of problems solved by the code teacher.')}
                        sx={{
                            position: 'relative',
                            padding: 2,
                            textAlign: 'center',
                            height: '15vh',
                            overflow: 'hidden',
                            border: '1px solid',
                            borderColor: theme.palette.primary.light,
                            backgroundImage: 'linear-gradient(to top, #208562 -5%, transparent 20%)',
                            borderRadius: '20px'
                        }}
                    >
                        <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
                            <Box display="flex" justifyContent="center">
                                <ComputerIcon sx={{ fontSize: 40 }} />
                            </Box>
                            <Typography variant="h3">{stats?.number_problems_solved_ct}</Typography>
                            <Typography variant="subtitle1">Problems Solved by Code Teacher</Typography>
                        </Box>
                    </Box>
                </Grid>

                {/* Avg Byte Completion Time */}
                <Grid item xs={6}>
                    <Box
                        onClick={() => handleOpenDialog('Average Byte Completion Time', 'Average time to complete a byte.')}
                        sx={{
                            position: 'relative',
                            padding: 2,
                            textAlign: 'center',
                            height: '15vh',
                            overflow: 'hidden',
                            border: '1px solid',
                            borderColor: theme.palette.primary.light,
                            backgroundImage: 'linear-gradient(to top, #208562 -5%, transparent 20%)',
                            borderRadius: '20px'
                        }}
                    >
                        <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
                            <Box display="flex" justifyContent="center">
                                <TimerIcon sx={{ fontSize: 40 }} />
                            </Box>
                            <Typography variant="h3">{stats?.avg_time_complete_byte}</Typography>
                            <Typography variant="subtitle1">Average Byte Completion Time</Typography>
                        </Box>
                    </Box>
                </Grid>

                {/* Focus on This */}
                <Grid item xs={12}>
                    <Box
                        sx={{
                            position: 'relative',
                            padding: 2,
                            textAlign: 'center',
                            height: '45vh', // Reduced height
                            overflow: 'hidden',
                            border: '1px solid',
                            borderColor: theme.palette.primary.light,
                            backgroundImage: 'linear-gradient(to top, #208562 -5%, transparent 10%)',
                            borderRadius: '20px'
                        }}
                    >
                        <Tooltip title="Based on your byte interest and attempts, this is the area you should focus on improving.">
                            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                                <HelpOutlineIcon sx={{ fontSize: 15 }}/>    
                            </Box>
                        </Tooltip>
                        <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <SearchIcon sx={{ fontSize: 40 }} />
                                <Typography variant="subtitle1">{String(fot?.concept)}</Typography>
                            </Box>
                            {fot?.byte_id && (
                                <Suspense fallback={<SheenPlaceholder height={80} width={200} />}>
                                    <BytesCard
                                        height={"150px"} // Reduced height
                                        imageHeight={150} // Reduced image height
                                        width={'70%'} // Reduced width
                                        imageWidth={'70%'} // Reduced image width
                                        bytesId={fot?.byte_id}
                                        bytesDesc={"Concept Explanation"}
                                        bytesThumb={config.rootPath + "/static/bytes/t/" + fot?.byte_id}
                                        language={programmingLanguages[0]}
                                        animate={false} onClick={function (): void {
                                            throw new Error('Function not implemented.');
                                        }} 
                                    />
                                </Suspense>
                            )}
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <Button
                                    variant="outlined"
                                    href="/focus"
                                    sx={{ width: 'fit-content' }}
                                >
                                    More Details
                                </Button>
                            </Box>
                            <Typography variant="subtitle1">Focus on This</Typography>
                        </Box>
                    </Box>
                </Grid>

                {/* User streak */}
                <Grid item xs={12}>
                    <Box
                        onClick={() => handleOpenDialog('Hot Streak', 'Keep track of your hot streaks! When you complete 3 bytes in a row without failing once, you go on a hot streak. See how far you can get!')}
                        sx={{ 
                            padding: 2, 
                            display: 'flex', 
                            flexDirection: 'column',
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            height: '20vh', 
                            position: 'relative', 
                            border: '1px solid', 
                            borderRadius: "10px",  
                            borderColor: isHotStreak ? '#EFE3AD' : theme.palette.primary.light, 
                            backgroundImage: isHotStreak ? 'linear-gradient(180deg, rgba(240,134,41,0.7) 0%, rgba(28,28,26,0.7) 40%, rgba(28,28,26,0.7) 88%, rgba(28,28,26,0.7) 98%)' : 'linear-gradient(to bottom, #208562 -65%, transparent 40%)',
                        }}>
                        {isHotStreak ? (
                            <>
                                <Typography variant="h5" color="#EFE3AD">Hot Streak!</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <LocalFireDepartmentIcon sx={{ fontSize: 50, color: '#EFE3AD', marginRight: 1 }} />
                                    <Typography variant="h3" color="#EFE3AD">{currentStreak}</Typography>
                                </Box>
                                <Typography variant="subtitle2" color="#EFE3AD">Highest: {highestStreak}</Typography>
                            </>
                        ) : (
                            <>
                                <Typography variant="h5">Hot Streak Progress</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography variant="h3">{currentStreak}</Typography>
                                    <Typography variant="h5" sx={{ marginLeft: 1, marginRight: 1 }}>/</Typography>
                                    <Typography variant="h3">3</Typography>
                                </Box>
                                <Typography variant="subtitle2">Highest: {highestStreak}</Typography>
                            </>
                        )}
                    </Box>
                </Grid>
            </Grid>
        )
    }

    const progressionBoxes = () => {
        return (
            <Grid container spacing={2}>
                {/* Data Hog */}
                <Grid item xs={12}>
                    <Box
                        onClick={() => handleOpenDialog('Data Hog', 'Amount of executable code written (in GB)')}
                        sx={{
                            padding: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            height: '12vh',
                            position: 'relative',
                            border: '1px solid',
                            borderColor: theme.palette.primary.light,
                            backgroundImage: 'linear-gradient(to bottom, #208562 -65%, transparent 40%)',
                            borderRadius: '10px',
                        }}
                    >
                        <Typography variant="subtitle2" sx={{ position: 'absolute', top: 8, left: 8 }}>Data Hog</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LinearProgress 
                                variant="determinate" 
                                value={Math.min(parseFloat(progression?.data_hog || '0') / parseInt(data_hog_level_max) * 100, 100)}
                                sx={{ 
                                    ...styles.progressBar,
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: theme.palette.primary.light,
                                        borderRadius: 8,
                                    },
                                }}
                            />
                            <Typography variant="body2">({(parseFloat(progression?.data_hog || '0') / 1000).toFixed(2)}/{parseInt(data_hog_level_max)/1000}KB)</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ position: 'absolute', top: 8, right: 8 }}>{data_hog_level}</Typography>
                    </Box>
                </Grid>

                {/* Hungry Learner */}
                <Grid item xs={12}>
                    <Box
                        onClick={() => handleOpenDialog('Hungry Learner', 'Number of concepts learned')}
                        sx={{
                            padding: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            height: '12vh',
                            position: 'relative',
                            border: '1px solid',
                            borderColor: theme.palette.primary.light,
                            backgroundImage: 'linear-gradient(to bottom, #208562 -65%, transparent 40%)',
                            borderRadius: '10px',
                        }}
                    > 
                        <Typography variant="subtitle2" sx={{ position: 'absolute', top: 8, left: 8 }}>Hungry Learner</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', }}>
                            <LinearProgress variant="determinate" value={Math.min(parseFloat(progression?.hungry_learner || '0')/parseInt(hungry_learner_level_max) * 100, 100)}
                                            sx={{ ...styles.progressBar,
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: theme.palette.secondary.light,
                                                    borderRadius: 8,
                                                },
                                            }}
                            />
                            <Typography variant="body2">({parseFloat(progression?.hungry_learner || '0')}/{parseInt(hungry_learner_level_max)})</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ position: 'absolute', top: 8, right: 8 }}>{hungry_learner_level}</Typography>
                    </Box>
                </Grid>

                {/* Man on the Inside */}
                <Grid item xs={12}>
                    <Box
                        onClick={() => handleOpenDialog('Man on the Inside', 'Number of chats sent to Code Teacher')}
                        sx={{
                            padding: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            height: '12vh',
                            position: 'relative',
                            border: '1px solid',
                            borderColor: theme.palette.primary.light,
                            backgroundImage: 'linear-gradient(to bottom, #208562 -65%, transparent 40%)',
                            borderRadius: '10px',
                        }}
                    >                        
                        <Typography variant="subtitle2" sx={{ position: 'absolute', top: 8, left: 8 }}>Man on the Inside</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', }}>
                            <LinearProgress variant="determinate" value={Math.min(parseFloat(progression?.man_of_the_inside || '0')/parseInt(man_of_the_inside_level_max) * 100, 100)}
                                            sx={{ ...styles.progressBar,
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: theme.palette.secondary.main,
                                                    borderRadius: 8,
                                                },
                                            }}
                            />
                            <Typography variant="body2">({Math.min(parseFloat(progression?.man_of_the_inside || '0'))}/{parseInt(man_of_the_inside_level_max)})</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ position: 'absolute', top: 8, right: 8 }}>{man_of_the_inside_level}</Typography>
                    </Box>
                </Grid>

                {/* The Scribe */}
                <Grid item xs={12}>
                    <Box
                        onClick={() => handleOpenDialog('The Scribe', 'Number of comments written')}
                        sx={{
                            padding: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            height: '12vh',
                            position: 'relative',
                            border: '1px solid',
                            borderColor: theme.palette.primary.light,
                            backgroundImage: 'linear-gradient(to bottom, #208562 -65%, transparent 40%)',
                            borderRadius: '10px',
                        }}
                    >                        
                        <Typography variant="subtitle2" sx={{ position: 'absolute', top: 8, left: 8 }}>The Scribe</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', }}>
                            <LinearProgress variant="determinate" value={Math.min(parseFloat(progression?.scribe || '0')/parseInt(scribe_level_max) * 100, 100)}
                                            sx={{ ...styles.progressBar,
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: theme.palette.primary.dark,
                                                    borderRadius: 8,
                                                },
                                            }}
                            />
                            <Typography variant="body2">({Math.min(parseFloat(progression?.scribe || '0'))}/{parseInt(scribe_level_max)})</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ position: 'absolute', top: 8, right: 8 }}>{scribe_level}</Typography>
                    </Box>
                </Grid>

                {/* Tenacious */}
                <Grid item xs={12}>
                    <Box
                        onClick={() => handleOpenDialog('Tenacious', 'Number of times you failed a byte, but then succeeded. A higher number shows how dedicated and persistent you are')}
                        sx={{
                            padding: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            height: '12vh',
                            position: 'relative',
                            border: '1px solid',
                            borderColor: theme.palette.primary.light,
                            backgroundImage: 'linear-gradient(to bottom, #208562 -65%, transparent 40%)',
                            borderRadius: '10px',
                        }}
                    >                        
                        <Typography variant="subtitle2" sx={{ position: 'absolute', top: 8, left: 8 }}>Tenacious</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', }}>
                            <LinearProgress variant="determinate" value={Math.min(parseFloat(progression?.tenacious || '0')/parseInt(tenacious_level_max) * 100, 100)}
                                            sx={{ ...styles.progressBar,
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: theme.palette.secondary.dark,
                                                    borderRadius: 8,
                                                },
                                            }}
                            />
                            <Typography variant="body2">({Math.min(parseFloat(progression?.tenacious || '0'))}/{parseInt(tenacious_level_max)})</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ position: 'absolute', top: 8, right: 8 }}>{tenacious_level}</Typography>
                    </Box>
                </Grid>

                {/* Unit Mastery */}
                <Grid item xs={12}>
                    <Box
                        onClick={() => handleOpenDialog('Unit Mastery', 'The amount of times you have completed an entire unit without failing a byte')}
                        sx={{
                            padding: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            height: '12vh',
                            position: 'relative',
                            border: '1px solid',
                            borderColor: theme.palette.primary.light,
                            backgroundImage: 'linear-gradient(to bottom, #208562 -65%, transparent 40%)',
                            borderRadius: '10px',
                        }}
                    >                        
                        <Typography variant="subtitle2" sx={{ position: 'absolute', top: 8, left: 8 }}>Unit Mastery</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', }}>
                            <LinearProgress variant="determinate" value={Math.min(parseFloat(progression?.unit_mastery || '0')/parseInt(unit_mastery_level_max) * 100, 100)}
                                            sx={{ ...styles.progressBar,
                                                '& .MuiLinearProgress-bar': {
                                                    // @ts-ignore
                                                    backgroundColor: theme.palette.tertiary.dark,
                                                    borderRadius: 8,
                                                },
                                            }}
                            />
                            <Typography variant="body2">({Math.min(parseFloat(progression?.unit_mastery || '0'))}/{parseInt(unit_mastery_level_max)})</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ position: 'absolute', top: 8, right: 8 }}>{unit_mastery_level}</Typography>
                    </Box>
                </Grid>

                {/* Languages */}
                <Grid item xs={12}>
                    <Box
                        onClick={() => handleOpenDialog('Languages', 'Languages learned: Python, JavaScript, TypeScript, Java')}
                        sx={{
                            padding: 2,
                            height: '12vh',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            position: 'relative',
                            border: '1px solid',
                            borderColor: theme.palette.primary.main,
                            borderRadius: "10px",
                            backgroundImage: 'linear-gradient(to bottom, #208562 -65%, transparent 40%)'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <MenuBookIcon sx={{ fontSize: 40, marginRight: 2 }} />
                            <Box>
                                <Typography variant="h5">{linguistType}</Typography>
                                <Typography variant="body2">Learning {languagesLearned} Languages</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        )
    }

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h5" gutterBottom>
                Stats
            </Typography>
            {statBoxes()}
            <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
                Progressions
            </Typography>
            {progressionBoxes()}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {dialogTitle}
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseDialog}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {dialogContent}
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </Box>
    );
}

