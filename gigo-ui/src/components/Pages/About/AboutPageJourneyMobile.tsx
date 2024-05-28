'use client'
import {Box, CssBaseline, Grid} from "@mui/material";
import * as React from "react";
import CTIcon from "@/img/bytes/ct-logo.svg";
import {theme} from "@/theme";
import JourneyIcon from "@/icons/Journey/JourneyIcon";
import JourneyUnit from "@/img/journey/journey_unit.png"
import DetourSign from "@/icons/Journey/DetourSign";
import JourneyHandout from "@/img/journey/journey_handout.png"
import {AwesomeButton} from "react-awesome-button";
import Image from 'next/image';

const AboutPageJourneyMobile = () => {
const titleStyle = {
        textAlign: 'center',
        margin: '10px 20px',
        color: theme.palette.background.default
    };

    const textStyle = {
        textAlign: 'center',
        margin: '10px 20px',
    };

    return(
            <CssBaseline>
                {/*@ts-ignore*/}
                <Box style={{width: "100%", height: "500px", backgroundColor: theme.palette.tertiary.dark}}>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <JourneyIcon
                            style={{height: "250px", width: "250px", paddingTop: "40px", paddingBottom: "20px"}}/>
                    </div>
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            <h1 style={titleStyle as React.CSSProperties}>GIGO Journeys</h1>
                            <p style={titleStyle as React.CSSProperties}>
                                Structured programming courses that are designed to fit your day to day life.
                            </p>

                        </Grid>
                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', paddingTop: "30px" }}>
                            <AwesomeButton
                                style={{
                                    width: "50vw",
                                    height: "150%",
                                    '--button-primary-color': theme.palette.primary.main,
                                    '--button-primary-color-dark': theme.palette.primary.dark,
                                    '--button-primary-color-light': theme.palette.text.primary,
                                    '--button-primary-color-hover': theme.palette.primary.main,
                                    '--button-default-height': '5vh',
                                    '--button-default-font-size': '2vh',
                                    '--button-default-border-radius': '12px',
                                    '--button-horizontal-padding': '27px',
                                    '--button-raise-level': '6px',
                                    '--button-hover-pressure': '1',
                                    '--transform-speed': '0.185s',
                                    borderRadius: "15px",
                                    fontSize: "80%",
                                    whiteSpace: 'nowrap',  // Prevent text wrapping
                                    // overflow: 'hidden',   // Hide overflow text
                                    // textOverflow: 'ellipsis'  // Optionally add an ellipsis
                                }}
                                type="primary"
                                href={"/journey"}
                            >
                                Start Your Journey
                            </AwesomeButton>
                        </Grid>
                    </Grid>
                </Box>
                <br/><br/>


                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <Image alt={""} src={JourneyUnit} style={{borderRadius: "25px", width: "80%", padding: "10px", height: "100%"}}/>
                        </div>
                        <h2 style={textStyle as React.CSSProperties}>Mapped Learning</h2>
                        <p style={textStyle as React.CSSProperties}>
                            Track your progress through curated units of information. Complete stops on you journey
                            and advance your understanding of programming.
                        </p>
                        {/*<Grid item xs={4} style={{paddingTop: "5vh"}}>*/}
                        {/*    <MobileVideo videoSrc={config.rootPath + "/cloudstore/videos/demo-debug.mp4"}/>*/}
                        {/*</Grid>*/}
                    </Grid>
                </Grid>
                <br/><br/>
                <hr style={{
                    width: '80%',
                    border: `1px solid ${theme.palette.secondary.contrastText}`,
                    margin: '0 auto'
                }}/>
                <br/><br/>
                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                mt: 1,
                                gap: "20px"
                            }}>
                               <DetourSign width={"100vw"} />
                            </Box>
                        </div>
                        <h2 style={textStyle as React.CSSProperties}>Let&#39;s Get Sidetracked</h2>
                        <p style={textStyle as React.CSSProperties}>
                            Journey Detours allow for a variable learning experience. Users can explore niche avenues
                            of programming to have a wider breadth of skills based on interest.
                        </p>
                        {/*<Grid item xs={4} style={{paddingTop: "5vh"}}>*/}
                        {/*    <MobileVideo videoSrc={config.rootPath + "/cloudstore/videos/demo-difficulty.mp4"}/>*/}
                        {/*</Grid>*/}
                    </Grid>
                </Grid>
                <br/><br/>
                <hr style={{
                    width: '80%',
                    border: `1px solid ${theme.palette.secondary.contrastText}`,
                    margin: '0 auto'
                }}/>
                <br/><br/>

                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <Image alt="Code Teacher" src={CTIcon} width={600} height={600}/>
                        </div>
                        <h2 style={textStyle as React.CSSProperties}>Code Teacher</h2>
                        <p style={textStyle as React.CSSProperties}>Journeys are integrated with Code Teacher to offer
                            a unique and personalized learning experience. Code Teacher acts as your own personal AI
                            tutor, providing tailored guidance and support throughout your coding journey.</p>
                        {/*<Grid item xs={4} style={{paddingTop: "5vh"}}>*/}
                        {/*    <MobileVideo videoSrc={config.rootPath + "/cloudstore/videos/demo-chat.mp4"}/>*/}
                        {/*</Grid>*/}
                    </Grid>
                </Grid>
                <br/><br/>
                <hr style={{
                    width: '80%',
                    border: `1px solid ${theme.palette.secondary.contrastText}`,
                    margin: '0 auto'
                }}/>
                <br/><br/>

                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <Image alt={""} src={JourneyHandout} style={{borderRadius: "25px", width: "100%", padding: "10px"}}/>
                        </div>
                        <h2 style={textStyle as React.CSSProperties}>Educational Resources</h2>
                        <p style={textStyle as React.CSSProperties}>
                            Every Journey unit is provided with a handout that contains in-depth background information on the various topics that will be taught in the unit.
                        </p>
                        {/*<Grid item xs={4} style={{paddingTop: "5vh"}}>*/}
                        {/*    <MobileVideo videoSrc={config.rootPath + "/cloudstore/videos/demo-debug.mp4"}/>*/}
                        {/*</Grid>*/}
                    </Grid>
                </Grid>


                <br/><br/>
            </CssBaseline>
    )
}

export default AboutPageJourneyMobile;
