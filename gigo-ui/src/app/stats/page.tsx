'use client'

import React from 'react';
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

    const statBoxes = () => {
        return (
            <Grid container spacing={4}>

                {/* Mastered Concepts */}
                <Grid item xs={4}>
                    <Box sx={{ position: 'relative', padding: 2, textAlign: 'center', height: "38vh", overflow: 'hidden', border: '1px solid', borderColor: theme.palette.primary.light, backgroundColor: 'transparent', borderRadius: "20px" }}>
                        <Tooltip title="This is the number of unique units you have finished in journeys. Each completion of a unit counts towards a mastered concept">
                            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                                <HelpOutlineIcon sx={{ fontSize: 15 }}/>
                            </Box>
                        </Tooltip>
                        <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
                            <Box display="flex" justifyContent="center">
                                <SchoolIcon sx={{ fontSize: 60 }} />
                            </Box>
                            <Typography variant="h1">42</Typography>
                            <Typography variant="h6">Mastered Concepts</Typography>
                        </Box>
                    </Box>
                </Grid>

                {/* Completion v Failure*/}
                <Grid item xs={4}>
                    <Box sx={{ position: 'relative', padding: 2, textAlign: 'center', height: "38vh", overflow: 'hidden', border: '1px solid', borderColor: theme.palette.primary.light, backgroundColor: 'transparent', borderRadius: "20px" }}>
                        <Tooltip title="Ratio of completions to failures.">
                            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                                <HelpOutlineIcon sx={{ fontSize: 15 }}/>
                            </Box>
                        </Tooltip>
                        <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
                            <Box display="flex" justifyContent="center">
                                <TrackChangesIcon sx={{ fontSize: 60 }} />
                            </Box>
                            <Typography variant="h1">1.12</Typography>
                            <Typography variant="h6">Completion v Failure</Typography>
                        </Box>
                    </Box>
                </Grid>

                {/* Focus on This */}
                <Grid item xs={4}>
                    <Box sx={{ position: 'relative', padding: 2, textAlign: 'center', height: "38vh", overflow: 'hidden', border: '1px solid', borderColor: theme.palette.primary.light, backgroundColor: 'transparent', borderRadius: "20px" }}>
                        <Tooltip title="Based on your byte interest and attempts, this is the area you should focus on improving.">
                            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                                <HelpOutlineIcon sx={{ fontSize: 15 }}/>
                            </Box>
                        </Tooltip>
                        <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
                            <Box display="flex" justifyContent="center">
                                <SearchIcon sx={{ fontSize: 60 }} />
                            </Box>
                            <Typography variant="h1">Topic</Typography>
                            <Typography variant="h6">Focus on This</Typography>
                        </Box>
                    </Box>
                </Grid>

                {/* Most Struggled With */}
                <Grid item xs={4}>
                    <Box sx={{ position: 'relative', padding: 2, textAlign: 'center', height: "38vh", overflow: 'hidden', border: '1px solid', borderColor: theme.palette.primary.light, backgroundColor: 'transparent', borderRadius: "20px" }}>
                        <Tooltip title="This is where you struggle the most when learning something new">
                            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                                <HelpOutlineIcon sx={{ fontSize: 15 }}/>
                            </Box>
                        </Tooltip>
                        <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
                            <Box display="flex" justifyContent="center">
                                <WaterDropIcon sx={{ fontSize: 60 }} />
                            </Box>
                            <Typography variant="h1">Topic 2</Typography>
                            <Typography variant="h6">Most Struggled With</Typography>
                        </Box>
                    </Box>
                </Grid>

                {/* Problems by Code Teacher */}
                <Grid item xs={4}>
                    <Box sx={{ position: 'relative', padding: 2, textAlign: 'center', height: "38vh", overflow: 'hidden', border: '1px solid', borderColor: theme.palette.primary.light, backgroundColor: 'transparent', borderRadius: "20px" }}>
                        <Tooltip title="Number of problems solved by the code teacher.">
                            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                                <HelpOutlineIcon sx={{ fontSize: 15 }}/>
                            </Box>
                        </Tooltip>
                        <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
                            <Box display="flex" justifyContent="center">
                                <ComputerIcon sx={{ fontSize: 60 }} />
                            </Box>
                            <Typography variant="h1">75</Typography>
                            <Typography variant="h6">Problems Solved by Code Teacher</Typography>
                        </Box>
                    </Box>
                </Grid>

                {/* Avg Byte Completion Time */}
                <Grid item xs={4}>
                    <Box sx={{ position: 'relative', padding: 2, textAlign: 'center', height: "38vh", overflow: 'hidden', border: '1px solid', borderColor: theme.palette.primary.light, backgroundColor: 'transparent', borderRadius: "20px" }}>
                        <Tooltip title="Average time to complete a byte.">
                            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                                <HelpOutlineIcon sx={{ fontSize: 15 }}/>
                            </Box>
                        </Tooltip>
                        <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
                            <Box display="flex" justifyContent="center">
                                <TimerIcon sx={{ fontSize: 60 }} />
                            </Box>
                            <Typography variant="h1">15m</Typography>
                            <Typography variant="h6">Average Byte Completion Time</Typography>
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
                    <Box sx={{ padding: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%', position: 'relative', border: '1px solid', borderColor: theme.palette.primary.light, borderRadius: "10px" }}>
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
                    <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', position: 'relative', border: '1px solid', borderColor: theme.palette.primary.light, borderRadius: "10px"  }}>
                        <Typography variant="subtitle1">Data Hog</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', }}>
                            <LinearProgress variant="determinate" value={Math.random() * 100}
                                            sx={{ ...styles.progressBar,
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: theme.palette.primary.light,
                                                    borderRadius: 8,
                                                },
                                            }}
                            />
                            <Typography variant="body2">({Math.floor(Math.random() * 10)}/{10})</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ position: 'absolute', top: 8, right: 8 }}>Level 1</Typography>
                        <Tooltip title="Amount of executable code written (in GB)" placement="top">
                            <HelpOutlineIcon sx={{ position: 'absolute', bottom: 8, right: 8, fontSize: 15 }} />
                        </Tooltip>
                    </Box>
                </Grid>

                {/* Hungry Learner */}
                <Grid item xs={6} sx={{ height: '20%' }}>
                    <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', position: 'relative', border: '1px solid', borderColor: theme.palette.primary.light, borderRadius: "10px" }}>
                        <Typography variant="subtitle1">Hungry Learner</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', }}>
                            <LinearProgress variant="determinate" value={Math.random() * 100}
                                            sx={{ ...styles.progressBar,
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: theme.palette.secondary.light,
                                                    borderRadius: 8,
                                                },
                                            }}
                            />
                            <Typography variant="body2">({Math.floor(Math.random() * 10)}/{10})</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ position: 'absolute', top: 8, right: 8 }}>Level 2</Typography>
                        <Tooltip title="Number of concepts learned" placement="top">
                            <HelpOutlineIcon sx={{ position: 'absolute', bottom: 8, right: 8, fontSize: 15 }} />
                        </Tooltip>
                    </Box>
                </Grid>

                {/* Measure Once, Cut Twice */}
                <Grid item xs={6} sx={{ height: '20%' }}>
                    <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', position: 'relative', border: '1px solid', borderColor: theme.palette.primary.light, borderRadius: "10px" }}>
                        <Typography variant="subtitle1">Measure Once, Cut Twice</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', }}>
                            <LinearProgress variant="determinate" value={Math.random() * 100}
                                            sx={{ ...styles.progressBar,
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: theme.palette.primary.main,
                                                    borderRadius: 8,
                                                },
                                            }}
                            />
                            <Typography variant="body2">({Math.floor(Math.random() * 10)}/{10})</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ position: 'absolute', top: 8, right: 8 }}>Level 3</Typography>
                        <Tooltip title="Number of syntax errors you have written" placement="top">
                            <HelpOutlineIcon sx={{ position: 'absolute', bottom: 8, right: 8, fontSize: 15 }} />
                        </Tooltip>
                    </Box>
                </Grid>

                {/* Man on the Inside */}
                <Grid item xs={6} sx={{ height: '20%' }}>
                    <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', position: 'relative', border: '1px solid', borderColor: theme.palette.primary.light, borderRadius: "10px" }}>
                        <Typography variant="subtitle1">Man on the Inside</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', }}>
                            <LinearProgress variant="determinate" value={Math.random() * 100}
                                            sx={{ ...styles.progressBar,
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: theme.palette.secondary.main,
                                                    borderRadius: 8,
                                                },
                                            }}
                            />
                            <Typography variant="body2">({Math.floor(Math.random() * 10)}/{10})</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ position: 'absolute', top: 8, right: 8 }}>Level 9</Typography>
                        <Tooltip title="Number of chats sent to Code Teacher" placement="top">
                            <HelpOutlineIcon sx={{ position: 'absolute', bottom: 8, right: 8, fontSize: 15 }} />
                        </Tooltip>
                    </Box>
                </Grid>

                {/* The Scribe */}
                <Grid item xs={6} sx={{ height: '20%' }}>
                    <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', position: 'relative', border: '1px solid', borderColor: theme.palette.primary.light, borderRadius: "10px" }}>
                        <Typography variant="subtitle1">The Scribe</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center'}}>
                            <LinearProgress variant="determinate" value={Math.random() * 100}
                                            sx={{ ...styles.progressBar,
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: theme.palette.primary.dark,
                                                    borderRadius: 8,
                                                },
                                            }}
                            />
                            <Typography variant="body2">({Math.floor(Math.random() * 10)}/{10})</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ position: 'absolute', top: 8, right: 8 }}>Level 4</Typography>
                        <Tooltip title="Number of comments written" placement="top">
                            <HelpOutlineIcon sx={{ position: 'absolute', bottom: 8, right: 8, fontSize: 15 }} />
                        </Tooltip>
                    </Box>
                </Grid>

                {/* Tenacious */}
                <Grid item xs={6} sx={{ height: '20%' }}>
                    <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', position: 'relative', border: '1px solid', borderColor: theme.palette.primary.light, borderRadius: "10px" }}>
                        <Typography variant="subtitle1">Tenacious</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', }}>
                            <LinearProgress variant="determinate" value={Math.random() * 100}
                                            sx={{ ...styles.progressBar,
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: theme.palette.secondary.dark,
                                                    borderRadius: 8,
                                                },
                                            }}
                            />
                            <Typography variant="body2">({Math.floor(Math.random() * 10)}/{10})</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ position: 'absolute', top: 8, right: 8 }}>Level 5</Typography>
                        <Tooltip title="Number of times you failed a byte, but then succeeded. A higher number shows how dedicated and persistent you are" placement="top">
                            <HelpOutlineIcon sx={{ position: 'absolute', bottom: 8, right: 8, fontSize: 15 }} />
                        </Tooltip>
                    </Box>
                </Grid>

                {/* Unit Mastery */}
                <Grid item xs={6} sx={{ height: '20%' }}>
                    <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', position: 'relative', border: '1px solid', borderColor: theme.palette.primary.light, borderRadius: "10px" }}>
                        <Typography variant="subtitle1">Unit Mastery</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', }}>
                            <LinearProgress variant="determinate" value={Math.random() * 100}
                                            sx={{ ...styles.progressBar,
                                                '& .MuiLinearProgress-bar': {
                                                    // @ts-ignore
                                                    backgroundColor: theme.palette.tertiary.dark,
                                                    borderRadius: 8,
                                                },
                                            }}
                            />
                            <Typography variant="body2">({Math.floor(Math.random() * 10)}/{10})</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ position: 'absolute', top: 8, right: 8 }}>Level 8</Typography>
                        <Tooltip title="The amount of times you have completed an entire unit without failing a byte" placement="top">
                            <HelpOutlineIcon sx={{ position: 'absolute', bottom: 8, right: 8, fontSize: 15 }} />
                        </Tooltip>
                    </Box>
                </Grid>

                {/* Languages */}
                <Grid item xs={6} sx={{ height: '20%' }}>
                    <Box sx={{ padding: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', border: '1px solid', borderColor: theme.palette.primary.main, borderRadius: "10px"}}>
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