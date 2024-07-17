'use client'

import React, {Suspense, useEffect, useState} from 'react';
import {Container, Grid, Paper, Typography, Box, Tooltip, IconButton} from '@mui/material';
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

export default function StatsPage() {

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

    const [stats, setStats] = useState<ProgrammingStats | null>(null);
    const [fot, setFot] = useState<FOT | null>(null);

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
                    // console.log("progression 2: ", progression)
                    // console.log("progression data hog: ", Math.min(parseFloat(progression?.data_hog || '0') / (10 * 1024), 1));
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
        fetchFOT()
        fetchProgression()
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
                                <Tooltip title="This is the number of unique units you have finished in journeys. Each completion of a unit counts towards a mastered concept">
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
                                <Tooltip title="Number of problems solved by the code teacher.">
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
                <Grid item xs={4}>
                    <Box
                        sx={{
                            position: 'relative',
                            padding: 2,
                            textAlign: 'center',
                            height: '80vh', // Double the height to cover two rows
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
                                        height={"550px"}
                                        imageHeight={355}
                                        width={'100%'}
                                        imageWidth={'90%'}
                                        bytesId={fot?.byte_id}
                                        bytesDesc={"Concept Explanation"}
                                        bytesThumb={config.rootPath + "/static/bytes/t/" + fot?.byte_id}
                                        language={programmingLanguages["python"]}
                                        animate={false} onClick={function (): void {
                                            throw new Error('Function not implemented.');
                                        }} 
                                    />
                                </Suspense>
                            )}
                            {/* <Box sx={{ borderRadius: "10px", backgroundColor: theme.palette.background.paper}}>
                                <MarkdownRenderer
                                    markdown={fot?.mistake_description || ''}
                                        style={{
                                            fontSize: "0.7rem",
                                            width: "auto",
                                            textAlign: "left"
                                    }}
                                    />
                            </Box> */}
                            <Typography variant="h6">Focus on This</Typography>
                        </Box>
                    </Box>
                </Grid>

            </Grid>

        )
    }

    const progressionBoxes = () => {
        return (
            <Grid container spacing={2} sx={{ height: 'calc(100% - 48px)' }}>

                {/* User streak */}
                <Grid item xs={12} sx={{ height: '20%' }}>
                    <Box sx={{ padding: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%', position: 'relative', border: '1px solid', borderRadius: "10px",  borderColor: theme.palette.primary.light, backgroundImage: 'linear-gradient(to bottom, #208562 -65%, transparent 40%)',}}>
                        <Grid container direction="column" sx={{ alignItems: 'flex-start' }}>
                            <Grid item>
                                <Typography variant="h5">God Like</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="subtitle2">Current Streak: 6</Typography>
                            </Grid>
                        </Grid>
                        <Grid container sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Grid item sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 2 }}>
                                <LocalFireDepartmentIcon sx={{ fontSize: 70 }} />
                                <Typography variant="body2">12</Typography>
                            </Grid>
                            <Grid item sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <PsychologyIcon sx={{ fontSize: 70 }} />
                                <Typography variant="body2">4</Typography>
                            </Grid>
                        </Grid>
                        <Tooltip title="Keep track of your streaks! When you complete 3 bytes in a row without failing once, you go on a hot streak. More than 5 puts you on a god-like streak. See how far you can get!" placement="top">
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
                            value={Math.min(parseFloat(progression?.data_hog || '0') / (10 * 1024) * 100, 100)}
                            sx={{ 
                                ...styles.progressBar,
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: theme.palette.primary.light,
                                    borderRadius: 8,
                                },
                            }}
                        />
                        <Typography variant="body2">({(parseFloat(progression?.data_hog || '0') / (10 * 1024)).toFixed(2)}B/1KB)</Typography>
                    </Box>
                        <Typography variant="body2" sx={{ position: 'absolute', top: 8, right: 8 }}>Level 1</Typography>
                        <Tooltip title="Amount of executable code written (in GB)" placement="top">
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
                            <LinearProgress variant="determinate" value={Math.min(parseFloat(progression?.hungry_learner || '0') * 100, 100)}
                                            sx={{ ...styles.progressBar,
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: theme.palette.secondary.light,
                                                    borderRadius: 8,
                                                },
                                            }}
                            />
                            <Typography variant="body2">({parseFloat(progression?.hungry_learner || '0')}/{10})</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ position: 'absolute', top: 8, right: 8 }}>Level 2</Typography>
                        <Tooltip title="Number of concepts learned" placement="top">
                            <HelpOutlineIcon sx={{ position: 'absolute', bottom: 8, right: 8, fontSize: 15 }} />
                        </Tooltip>
                    </Box>
                </Grid>

                {/* Measure Once, Cut Twice */}
                {/* <Grid item xs={6} sx={{ height: '20%' }}>
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
                    <Typography variant="subtitle2" sx={{ position: 'absolute', top: 8, left: 8 }}>Measure Once, Cut Twice</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', }}>
                            <LinearProgress variant="determinate" value={Math.min(parseFloat(progression?.measure_once || '0') * 100, 100)}
                                            sx={{ ...styles.progressBar,
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: theme.palette.primary.main,
                                                    borderRadius: 8,
                                                },
                                            }}
                            />
                            <Typography variant="body2">{Math.min(parseFloat(progression?.measure_once || '0'))}/{10}</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ position: 'absolute', top: 8, right: 8 }}>Level 3</Typography>
                        <Tooltip title="Number of syntax errors you have written" placement="top">
                            <HelpOutlineIcon sx={{ position: 'absolute', bottom: 8, right: 8, fontSize: 15 }} />
                        </Tooltip>
                    </Box>
                </Grid> */}

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
                            <LinearProgress variant="determinate" value={Math.min(parseFloat(progression?.man_of_the_inside || '0')/500 * 100, 100)}
                                            sx={{ ...styles.progressBar,
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: theme.palette.secondary.main,
                                                    borderRadius: 8,
                                                },
                                            }}
                            />
                            <Typography variant="body2">({Math.min(parseFloat(progression?.man_of_the_inside || '0'))}/{500})</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ position: 'absolute', top: 8, right: 8 }}>Level 9</Typography>
                        <Tooltip title="Number of chats sent to Code Teacher" placement="top">
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
                        <Box sx={{ display: 'flex', alignItems: 'center'}}>
                            <LinearProgress variant="determinate" value={Math.min(parseFloat(progression?.scribe || '0')/50 * 100, 100)}
                                            sx={{ ...styles.progressBar,
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: theme.palette.primary.dark,
                                                    borderRadius: 8,
                                                },
                                            }}
                            />
                            <Typography variant="body2">({Math.min(parseFloat(progression?.scribe || '0'))}/{50})</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ position: 'absolute', top: 8, right: 8 }}>Level 4</Typography>
                        <Tooltip title="Number of comments written" placement="top">
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
                            <LinearProgress variant="determinate" value={Math.min(parseFloat(progression?.tenacious || '0'), 100)}
                                            sx={{ ...styles.progressBar,
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: theme.palette.secondary.dark,
                                                    borderRadius: 8,
                                                },
                                            }}
                            />
                            <Typography variant="body2">({Math.min(parseFloat(progression?.tenacious || '0'))}/{10})</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ position: 'absolute', top: 8, right: 8 }}>Level 5</Typography>
                        <Tooltip title="Number of times you failed a byte, but then succeeded. A higher number shows how dedicated and persistent you are" placement="top">
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
                            <LinearProgress variant="determinate" value={Math.min(parseFloat(progression?.unit_mastery || '0'), 100)}
                                            sx={{ ...styles.progressBar,
                                                '& .MuiLinearProgress-bar': {
                                                    // @ts-ignore
                                                    backgroundColor: theme.palette.tertiary.dark,
                                                    borderRadius: 8,
                                                },
                                            }}
                            />
                            <Typography variant="body2">({Math.min(parseFloat(progression?.unit_mastery || '0'))}/{10})</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ position: 'absolute', top: 8, right: 8 }}>Level 8</Typography>
                        <Tooltip title="The amount of times you have completed an entire unit without failing a byte" placement="top">
                            <HelpOutlineIcon sx={{ position: 'absolute', bottom: 8, right: 8, fontSize: 15 }} />
                        </Tooltip>
                    </Box>
                </Grid>

                {/* Languages */}
                <Grid item xs={6} sx={{ height: '20%' }}>
                    <Box sx={{ padding: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', border: '1px solid', borderColor: theme.palette.primary.main, borderRadius: "10px",  backgroundImage: 'linear-gradient(to bottom, #208562 -65%, transparent 40%)'}}>
                        <Typography variant="h5">Linguist</Typography>
                        <Typography variant="body2">Learning 4 Languages</Typography>
                        <CheckCircleIcon sx={{ color: 'white', position: 'absolute', top: 8, right: 8 }} />
                    </Box>
                </Grid>
            </Grid>
        )
    }

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
    );

}

function determineProgressionLevel(progression_type: string, progression_value: string){
   switch(progression_type) {
    case "data_hog":
        const data_hog_level = parseFloat(progression_value || '0');
        if (data_hog_level < 10000) {
            return ["Level 1", "10KB"];
        } else if (data_hog_level < 50000) {
            return ["Level 2", "50KB"]; 
        } else if (data_hog_level < 100000) {
            return ["Level 3", "100KB"];
        }else{
            return ["Level 3", "100KB"];
        }
        
    case "hungry_learner":
       const hungry_learner_level = parseFloat(progression_value || '0');
       if (hungry_learner_level < 5) {
            return ["Level 1", "5"];
       }else if (hungry_learner_level < 10) {
            return ["Level 2", "10"];
       }else if (hungry_learner_level < 20) {
            return ["Level 3", "20"];
       }else{
            return ["Level 3", "20"];
       }
    case "man_of_the_inside":
       const manOnTheInside_level = parseFloat(progression_value || '0');
       if (manOnTheInside_level < 10) {
            return ["Level 1", "10"];
       }else if (manOnTheInside_level < 50) {
            return ["Level 2", "50"];
       }else if (manOnTheInside_level < 100) {
            return ["Level 3", "100"];
       }else{
            return ["Level 3", "100"];
       }

    case "scribe":
        const scribe_level = parseFloat(progression_value || '0');
        if (scribe_level < 50) {
            return ["Level 1", "50"];
        }else if (scribe_level < 100) {
            return ["Level 2", "100"];
        }else if (scribe_level < 250 ) {
            return ["Level 3", "250"];
        }else{
            return ["Level 3", "250"];
        }
    case "tenacious":
        const tenacious_level = parseFloat(progression_value || '0');
        if (tenacious_level < 5) {
            return ["Level 1", "5"];
        }else if (tenacious_level < 10) {
            return ["Level 2", "10"];
        }else if (tenacious_level < 15) {
            return ["Level 3", "15"];
        }else{
            return ["Level 3", "15"];
        }
    case "unit_mastery":
        const unit_mastery_level = parseFloat(progression_value || '0');
        if (unit_mastery_level < 1) {
            return ["Level 1", "1"];
        }else if (unit_mastery_level < 3) {
            return ["Level 2", "3"];
        }else if (unit_mastery_level < 5) {
            return ["Level 3", "5"];
        }else{
            return ["Level 3", "5"];
        }
   }
}