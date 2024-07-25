'use client'

import React, {Suspense, useEffect, useState} from 'react';
import {Container, Grid, Paper, Typography, Box, Tooltip, IconButton, Button} from '@mui/material';
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
import BytesCard from '@/components/BytesCard';
import { programmingLanguages } from '@/services/vars';
import MarkdownRenderer from "@/components/Markdown/MarkdownRenderer";
import { string } from 'prop-types';
import DetermineProgressionLevel from '@/utils/progression';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useSearchParams } from 'next/navigation';
import StatsPageMobile from './statsMobile';
import Image from 'next/image';
import SheenPlaceholder from '@/components/Loading/SheenPlaceholder';
import Lottie from 'react-lottie';

export default function StatsPage() {
    let query = useSearchParams();
    let isMobile = query.get("viewport") === "mobile";
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

    useEffect(() => {
        if (progression) {
            console.log("progression 2: ", progression);
            console.log("progression moti: ", Math.min(parseFloat(progression?.man_of_the_inside || '0')/500, 1));
        }
    }, [progression]);

    const [gearBox, setGearBox] = React.useState(null);
    
    

    useEffect(() => {
        fetch(`${config.rootPath}/static/ui/lottie/general/fot-loading.json`, {credentials: 'include'})
            .then(data => {
                data.json().then(json => {
                    setGearBox(json)
                })
            })
            .catch(error => console.error(error));
    }, [])

    const gearBoxOptions = {
        loop: true,
        autoplay: true,
        animationData: gearBox,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        },
    };
    

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
        // @ts-ignore

        return (
            <Grid container spacing={4}>

                <Grid item xs={8}>
                    <Grid container spacing={4}>
                        {/* Mastered Concepts */}
                        <Grid item xs={6}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    padding: 2,
                                    textAlign: 'center',
                                    height: '38vh',
                                    overflow: 'hidden',
                                    border: '1px solid',
                                    borderColor: theme.palette.primary.light,
                                    backgroundImage: 'linear-gradient(to top, #208562 -5%, transparent 20%)',
                                    borderRadius: '20px'
                                }}
                            >
                                <Tooltip title="This is the number of unique units you have finished in Journeys. Each completion of a unit counts towards a mastered concept.">
                                    <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                                        <HelpOutlineIcon sx={{ fontSize: 15 }}/>
                                    </Box>
                                </Tooltip>
                                <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
                                    <Box display="flex" justifyContent="center">
                                        <SchoolIcon sx={{ fontSize: 60 }} />
                                    </Box>
                                    <Typography variant="h1">{stats?.numbered_mastered_concepts}</Typography>
                                    <Typography variant="h6">Mastered Concepts</Typography>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Completion v Failure */}
                        <Grid item xs={6}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    padding: 2,
                                    textAlign: 'center',
                                    height: '38vh',
                                    overflow: 'hidden',
                                    border: '1px solid',
                                    borderColor: theme.palette.primary.light,
                                    backgroundImage: 'linear-gradient(to top, #208562 -5%, transparent 20%)',
                                    borderRadius: '20px'
                                }}
                            >
                                <Tooltip title="Ratio of completions to failures.">
                                    <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                                        <HelpOutlineIcon sx={{ fontSize: 15 }}/>
                                    </Box>
                                </Tooltip>
                                <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
                                    <Box display="flex" justifyContent="center">
                                        <TrackChangesIcon sx={{ fontSize: 60 }} />
                                    </Box>
                                    <Typography variant="h1">
                                        {
                                            // @ts-ignore
                                            parseFloat(stats?.completion_failure_rate)?.toFixed(2)
                                        }
                                    </Typography>
                                    <Typography variant="h6">Completion v Failure</Typography>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Problems by Code Teacher */}
                        <Grid item xs={6}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    padding: 2,
                                    textAlign: 'center',
                                    height: '38vh',
                                    overflow: 'hidden',
                                    border: '1px solid',
                                    borderColor: theme.palette.primary.light,
                                    backgroundImage: 'linear-gradient(to top, #208562 -5%, transparent 20%)',
                                    borderRadius: '20px'
                                }}
                            >
                                <Tooltip title="Number of bytes solved by code teacher.">
                                    <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                                        <HelpOutlineIcon sx={{ fontSize: 15 }}/>
                                    </Box>
                                </Tooltip>
                                <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
                                    <Box display="flex" justifyContent="center">
                                        <ComputerIcon sx={{ fontSize: 60 }} />
                                    </Box>
                                    <Typography variant="h1">{stats?.number_problems_solved_ct}</Typography>
                                    <Typography variant="h6">Problems Solved by Code Teacher</Typography>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Avg Byte Completion Time */}
                        <Grid item xs={6}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    padding: 2,
                                    textAlign: 'center',
                                    height: '38vh',
                                    overflow: 'hidden',
                                    border: '1px solid',
                                    borderColor: theme.palette.primary.light,
                                    backgroundImage: 'linear-gradient(to top, #208562 -5%, transparent 20%)',
                                    borderRadius: '20px'
                                }}
                            >
                                <Tooltip title="Average time to complete a byte.">
                                    <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                                        <HelpOutlineIcon sx={{ fontSize: 15 }}/>
                                    </Box>
                                </Tooltip>
                                <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
                                    <Box display="flex" justifyContent="center">
                                        <TimerIcon sx={{ fontSize: 60 }} />
                                    </Box>
                                    <Typography variant="h1">{stats?.avg_time_complete_byte}</Typography>
                                    <Typography variant="h6">Average Byte Completion Time</Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Focus on This */}
                {fot ? (
                <Grid item xs={4}>
                    <Box
                        sx={{
                            position: 'relative',
                            padding: 2,
                            textAlign: 'center',
                            height: '80vh', // double the height to cover two rows
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
                                <SearchIcon sx={{ fontSize: 60 }} />
                                
                            </Box>
                            <Typography variant="h6">{String(fot?.concept)}</Typography>
                            {fot?.byte_id && (
                                <Suspense fallback={<SheenPlaceholder height={105} width={250} />}>
                                    <BytesCard
                                        height={"355px"}
                                        imageHeight={355}
                                        width={'100%'}
                                        imageWidth={'90%'}
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
                            <Typography variant="h6">Focus on This</Typography>
                        </Box>
                    </Box>
                </Grid>
                ) : (
                <Grid item xs={4}>
                    <Box
                        sx={{
                            position: 'relative',
                            padding: 2,
                            textAlign: 'center',
                            height: '80vh', // double the height to cover two rows
                            overflow: 'hidden',
                            border: '1px solid',
                            borderColor: theme.palette.primary.light,
                            backgroundImage: 'linear-gradient(to top, #208562 -5%, transparent 10%)',
                            borderRadius: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>Keep improving!</Typography>
                        <Typography variant="body1">We are optimizing a recommended focus for you. Check back here for it next week!</Typography>
                        
                        <Lottie options={gearBoxOptions} isClickToPauseDisabled={true}
                                width={250}
                                height={250} isPaused={false}
                                style={{
                                    filter: `drop-shadow(0 0 10px ${theme.palette.primary.dark})`,
                                }}
                        />

                        
                        <Box sx={{ height: '48px' }} /> 
                    </Box>
                </Grid>
                )}

            </Grid>

        )
    }

    const progressionBoxes = () => {
        return (
            <Grid container spacing={2} sx={{ height: 'calc(100% - 48px)' }}>

                {/* User streak */}
                <Grid item xs={12} sx={{ height: '20%' }}>
                    <Box sx={{ 
                        padding: 2, 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        height: '100%', 
                        position: 'relative', 
                        border: '1px solid', 
                        borderRadius: "10px",  
                        borderColor: isHotStreak ? '#EFE3AD' : theme.palette.primary.light, 
                        backgroundImage: isHotStreak ? 'linear-gradient(180deg, rgba(240,134,41,0.7) 0%, rgba(28,28,26,0.7) 40%, rgba(28,28,26,0.7) 88%, rgba(28,28,26,0.7) 98%)' : 'linear-gradient(to bottom, #208562 -65%, transparent 40%)',
                    }}>
                        {isHotStreak ? (
                            <>
                                <Grid container direction="column" sx={{ alignItems: 'flex-start' }}>
                                    <Grid item>
                                        <Typography variant="h5" color="#EFE3AD">Hot Streak!</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="subtitle2">Highest Hot Streak: {highestStreak}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid container sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                    <Grid item sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <LocalFireDepartmentIcon sx={{ fontSize: 70, color: '#EFE3AD' }} />
                                        <Typography variant="h4" color="#EFE3AD">{currentStreak}</Typography>
                                    </Grid>
                                </Grid>
                            </>
                        ) : (
                            <>
                                <Grid container direction="column" sx={{ alignItems: 'flex-start' }}>
                                    <Grid item>
                                        <Typography variant="h5">Highest Hot Streak</Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h4">{highestStreak}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid container sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                    <Grid item sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Typography variant="subtitle2">Current Progress</Typography>
                                        <Typography variant="h5">{currentStreak}/3</Typography>
                                    </Grid>
                                </Grid>
                            </>
                        )}
                        <Tooltip title="Keep track of your hot streaks! When you complete 3 bytes in a row without failing once, you go on a hot streak. See how far you can get!" placement="top">
                            <HelpOutlineIcon sx={{ position: 'absolute', bottom: 8, right: 8, fontSize: 15 }} />
                        </Tooltip>
                    </Box>
                </Grid>

                {/* Data Hog */}
                <Grid item xs={6} sx={{ height: '20%' }}>
                <Box
                    sx={{
                        padding: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        height: '100%',
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
                        <Tooltip title="Amount of executable code written (in KB)" placement="top">
                            <HelpOutlineIcon sx={{ position: 'absolute', bottom: 8, right: 8, fontSize: 15 }} />
                        </Tooltip>
                    </Box>
                </Grid>

                {/* Hungry Learner */}
                <Grid item xs={6} sx={{ height: '20%' }}>
                <Box
                    sx={{
                        padding: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        height: '100%',
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
                        <Tooltip title="Number of concepts learned - earned by completing a Journey Unit, regardless of failed attempts." placement="top">
                            <HelpOutlineIcon sx={{ position: 'absolute', bottom: 8, right: 8, fontSize: 15 }} />
                        </Tooltip>
                    </Box>
                </Grid>

                {/* Man on the Inside */}
                <Grid item xs={6} sx={{ height: '20%' }}>
                <Box
                    sx={{
                        padding: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        height: '100%',
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
                        <Tooltip title="Number of chats sent to Code Teacher." placement="top">
                            <HelpOutlineIcon sx={{ position: 'absolute', bottom: 8, right: 8, fontSize: 15 }} />
                        </Tooltip>
                    </Box>
                </Grid>

                {/* The Scribe */}
                <Grid item xs={6} sx={{ height: '20%' }}>
                <Box
                    sx={{
                        padding: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        height: '100%',
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
                        <Tooltip title="Number of comments written." placement="top">
                            <HelpOutlineIcon sx={{ position: 'absolute', bottom: 8, right: 8, fontSize: 15 }} />
                        </Tooltip>
                    </Box>
                </Grid>

                {/* Tenacious */}
                <Grid item xs={6} sx={{ height: '20%' }}>
                <Box
                    sx={{
                        padding: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        height: '100%',
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
                        <Tooltip title="Number of times you failed a byte, but then succeeded. A higher number shows how dedicated and persistent you are." placement="top">
                            <HelpOutlineIcon sx={{ position: 'absolute', bottom: 8, right: 8, fontSize: 15 }} />
                        </Tooltip>
                    </Box>
                </Grid>

                {/* Unit Mastery */}
                <Grid item xs={6} sx={{ height: '20%' }}>
                <Box
                    sx={{
                        padding: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        height: '100%',
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
                        <Tooltip title="The amount of times you have completed an entire unit without failing a byte attempt." placement="top">
                            <HelpOutlineIcon sx={{ position: 'absolute', bottom: 8, right: 8, fontSize: 15 }} />
                        </Tooltip>
                    </Box>
                </Grid>

                {/* Languages */}
                <Grid item xs={12} sx={{ height: '20%' }}>
                    <Box sx={{
                        padding: 2,
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        position: 'relative',
                        border: '1px solid',
                        borderColor: theme.palette.primary.main,
                        borderRadius: "10px",
                        backgroundImage: 'linear-gradient(to bottom, #208562 -65%, transparent 40%)'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <MenuBookIcon sx={{ fontSize: 40, marginRight: 2 }} />
                            <Box>
                                <Typography variant="h5">{linguistType}</Typography>
                                <Typography variant="body2">Learning {languagesLearned} Languages</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip title="Keep track of the amount of languages you are learning!" placement="top">
                                <HelpOutlineIcon sx={{ fontSize: 15, marginRight: 1 }} />
                            </Tooltip>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        )
    }

        if (isMobile) {
            return <StatsPageMobile />
        } else {
            return (
                <Box sx={{ padding: 3 }}>
            <Grid container spacing={2}>
                <Grid item xs={7}>
                    <Typography variant="h4" gutterBottom>
                        Stats
                    </Typography>
                    {statBoxes()}
                </Grid>
                <Grid item xs={5}>
                    <Typography variant="h4" gutterBottom>
                        Progressions
                    </Typography>
                    {progressionBoxes()}
                </Grid>
            </Grid>
        </Box>
            )
        }

}

