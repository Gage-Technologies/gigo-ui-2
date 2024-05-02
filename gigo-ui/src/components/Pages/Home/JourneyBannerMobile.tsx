'use client';
import {Box, Grid, Typography} from "@mui/material";
import {theme} from "@/theme";
import JourneyIcon from "@/icons/Journey/JourneyIcon";
import {AwesomeButton} from "react-awesome-button";
import * as React from "react";

interface IProps {
    startedJourney: boolean;
    completedJourneyTasks: number;
    completedJourneyUnits: number;
    detourCount: number;
    incompletedJourneyTasks: number;
}

export default function JourneyBannerMobile({
                                                startedJourney,
                                                completedJourneyTasks,
                                                completedJourneyUnits,
                                                detourCount,
                                                incompletedJourneyTasks
                                            }: IProps) {
    const mainContent =
        startedJourney ? (
            <Box sx={{p: 2}}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: '30px',
                                border: 'solid #dfce53 3px',
                                p: 2,
                                backgroundColor: '#dfce53',
                            }}
                        >
                            <Typography
                                variant="h4"
                                sx={{
                                    color: theme.palette.background.default,
                                    textTransform: 'none',
                                    textAlign: 'center',
                                    mb: 1,
                                }}
                            >
                                {completedJourneyTasks}
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    color: theme.palette.background.default,
                                    textTransform: 'none',
                                    textAlign: 'center',
                                }}
                            >
                                Completed Stops
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: '30px',
                                border: 'solid #dfce53 3px',
                                p: 2,
                                backgroundColor: '#dfce53',
                            }}
                        >
                            <Typography
                                variant="h4"
                                sx={{
                                    color: theme.palette.background.default,
                                    textTransform: 'none',
                                    textAlign: 'center',
                                    mb: 1,
                                }}
                            >
                                {completedJourneyUnits}
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    color: theme.palette.background.default,
                                    textTransform: 'none',
                                    textAlign: 'center',
                                }}
                            >
                                Units Completed
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: '30px',
                                border: 'solid #dfce53 3px',
                                p: 2,
                                backgroundColor: '#dfce53',
                            }}
                        >
                            <Typography
                                variant="h4"
                                sx={{
                                    color: theme.palette.background.default,
                                    textTransform: 'none',
                                    textAlign: 'center',
                                    mb: 1,
                                }}
                            >
                                {detourCount}
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    color: theme.palette.background.default,
                                    textTransform: 'none',
                                    textAlign: 'center',
                                }}
                            >
                                Detours Taken
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: '30px',
                                border: 'solid #dfce53 3px',
                                p: 2,
                                backgroundColor: '#dfce53',
                            }}
                        >
                            <Typography
                                variant="h4"
                                sx={{
                                    color: theme.palette.background.default,
                                    textTransform: 'none',
                                    textAlign: 'center',
                                    mb: 1,
                                }}
                            >
                                {incompletedJourneyTasks}
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    color: theme.palette.background.default,
                                    textTransform: 'none',
                                    textAlign: 'center',
                                }}
                            >
                                Stops Remaining
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
                <Box sx={{mt: 4, display: 'flex', justifyContent: 'center'}}>
                    <JourneyIcon style={{height: '200px', width: '200px'}}/>
                </Box>
                <Box sx={{mt: 2, display: 'flex', justifyContent: 'center'}}>
                    <AwesomeButton style={{
                        width: "auto",
                        '--button-primary-color': theme.palette.primary.main,
                        '--button-primary-color-dark': theme.palette.primary.dark,
                        '--button-primary-color-light': "white",
                        '--button-primary-color-hover': theme.palette.primary.light,
                        '--button-default-border-radius': "12px",
                        fontSize: "28px",
                        height: "80px",
                    }} type="primary" href={"/journey/main"}>
                        <span>Continue Your Journey</span>
                    </AwesomeButton>
                </Box>
            </Box>
        ) : (
            <Box sx={{p: 2}}>
                <Typography
                    variant="h4"
                    sx={{
                        color: theme.palette.background.default,
                        textTransform: 'none',
                        textAlign: 'center',
                        mb: 2,
                    }}
                >
                    Embark on your Coding Journey
                </Typography>
                <Box sx={{display: 'flex', justifyContent: 'center', mb: 2}}>
                    <JourneyIcon style={{height: '200px', width: '200px'}}/>
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                    <AwesomeButton style={{
                        width: "auto",
                        height: "80px",
                        '--button-primary-color': theme.palette.primary.main,
                        '--button-primary-color-dark': theme.palette.primary.dark,
                        '--button-primary-color-light': "white",
                        '--button-primary-color-hover': theme.palette.primary.main,
                        '--button-default-border-radius': "12px",
                        fontSize: "28px"
                    }} type="primary" href={"/journey/main"}>
                        <span>Start Your Journey</span>
                    </AwesomeButton>
                </Box>
            </Box>
        )

    return (
        <Box sx={{
            width: "100%",
            height: "auto",
            backgroundColor: "#ffef62",
            zIndex: 3,
            m: 1,
            borderRadius: "12px",
            position: "relative",
            padding: "20px",
            marginTop: "2%"
        }}>
            {mainContent}
        </Box>
    )
};