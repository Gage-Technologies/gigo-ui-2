'use client'
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

export default function JourneyBanner({
                                          startedJourney,
                                          completedJourneyTasks,
                                          completedJourneyUnits,
                                          detourCount,
                                          incompletedJourneyTasks
                                      }: IProps) {
    const mainContent =
        startedJourney ? (
            // TODO journey - change the color to the primary color in the theme provider
            <>
                <Grid item xs={8} sx={{height: "100%", overflow: 'auto'}}>
                    <Grid container sx={{height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                        <Grid item xs={5} sx={{
                            height: '25%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: "30px",
                            border: "solid #dfce53 3px",
                            m: 1,
                            backgroundColor: "#dfce53"
                        }}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexGrow: 1,
                            }}>
                                <Typography variant="h2" sx={{
                                    color: theme.palette.background.default,
                                    textTransform: 'none',
                                }}>
                                    {completedJourneyTasks}
                                </Typography>
                            </Box>
                            <Typography variant="h5" sx={{
                                color: theme.palette.background.default,
                                textTransform: 'none',
                                width: '100%',
                                textAlign: 'center',

                            }}>
                                Completed Stops
                            </Typography>
                        </Grid>
                        <Grid item xs={1}/>
                        <Grid item xs={5} sx={{
                            height: '25%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: "30px",
                            border: "solid #dfce53 3px",
                            m: 1,
                            backgroundColor: "#dfce53"
                        }}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexGrow: 1,
                            }}>
                                <Typography variant="h2" sx={{
                                    color: theme.palette.background.default,
                                    textTransform: 'none',
                                }}>
                                    {completedJourneyUnits}
                                </Typography>
                            </Box>
                            <Typography variant="h5" sx={{
                                color: theme.palette.background.default,
                                textTransform: 'none',
                                width: '100%',
                                textAlign: 'center',

                            }}>
                                Units Completed
                            </Typography>
                        </Grid>
                        <Grid item xs={5} sx={{
                            height: '25%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: "30px",
                            border: "solid #dfce53 3px",
                            m: 1,
                            backgroundColor: "#dfce53"
                        }}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexGrow: 1,
                            }}>
                                <Typography variant="h2" sx={{
                                    color: theme.palette.background.default,
                                    textTransform: 'none',
                                }}>
                                    {detourCount}
                                </Typography>
                            </Box>
                            <Typography variant="h5" sx={{
                                color: theme.palette.background.default,
                                textTransform: 'none',
                                width: '100%',
                                textAlign: 'center',

                            }}>
                                Detours Taken
                            </Typography>
                        </Grid>
                        <Grid item xs={1}/>
                        <Grid item xs={5} sx={{
                            height: '25%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: "30px",
                            border: "solid #dfce53 3px",
                            m: 1,
                            backgroundColor: "#dfce53"
                        }}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexGrow: 1,
                            }}>
                                <Typography variant="h2" sx={{
                                    color: theme.palette.background.default,
                                    textTransform: 'none',
                                }}>
                                    {incompletedJourneyTasks}
                                </Typography>
                            </Box>
                            <Typography variant="h5" sx={{
                                color: theme.palette.background.default,
                                textTransform: 'none',
                                width: '100%',
                                textAlign: 'center',
                            }}>
                                Stops Remaining
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={4} sx={{height: "100%", overflow: 'auto'}}>
                    <JourneyIcon style={{height: "375px", width: "375px"}}/>
                    <Box sx={{display: 'flex', justifyContent: 'center'}}>
                        <AwesomeButton style={{
                            width: "auto",
                            height: "50px",
                            '--button-primary-color': '#29c18c',
                            '--button-primary-color-dark': '#1c8762',
                            '--button-primary-color-light': "white",
                            '--button-primary-color-hover': '#29c18c',
                            '--button-default-border-radius': "12px",
                            fontSize: "28px",
                        }} type="primary" href={"/journey/main"}>
                            <span>Continue Your Journey</span>
                        </AwesomeButton>
                    </Box>
                </Grid>
            </>
        ) : (
            // TODO check if User has an active journey -- change for mobile --
            <>
                <Box sx={{width: "100%", height: "500px", zIndex: 3, m: 2, borderRadius: "12px"}}>
                    <div style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-evenly"
                    }}>
                        <div style={{position: "relative", top: "100px", width: '50%'}}>
                            <Typography variant={"h1"}
                                        sx={{
                                            color: theme.palette.background.default,
                                            textTransform: 'none'
                                        }}>
                                Embark on your Coding Journey
                            </Typography>
                        </div>
                        <div>
                            <JourneyIcon style={{height: "400px", width: "400px", paddingTop: "40px"}}/>
                        </div>
                    </div>
                    <Box sx={{display: 'flex', justifyContent: 'center'}}>
                        <AwesomeButton style={{
                            width: "auto",
                            height: "50px",
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
            </>
        )

    return (
        <Grid container spacing={2} sx={{
            width: "100%",
            height: "500px",
            backgroundColor: "#ffef62",
            zIndex: 3,
            m: 2,
            borderRadius: "12px",
            position: "relative"
        }}>
            {mainContent}
        </Grid>
    )
}