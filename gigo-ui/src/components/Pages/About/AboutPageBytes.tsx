'use client'
import * as React from "react";
import {
    Box, CircularProgress,
    createTheme,
    CssBaseline,
    Grid,
    PaletteMode,
    ThemeProvider,
    Typography
} from "@mui/material";
import {theme, isHoliday} from "@/theme";
import { AwesomeButton } from "react-awesome-button";
import 'react-awesome-button/dist/styles.css';
import Image from 'next/image';
import BytesIcon from "@/icons/Bytes/BytesIcon";
import CTIcon from "@/img/bytes/ct-logo.svg";
import NSIcon from "@/img/bytes/ns-icon.svg";
import DebugIcon from "@/icons/ProjectCard/Debug";
import ByteEasySelectionIcon from "@/icons/Bytes/ByteEasySelection";
import ByteMediumSelectionIcon from "@/icons/Bytes/ByteMediumSelection";
import ByteHardSelectionIcon from "@/icons/Bytes/ByteHardSelection";
import config from "@/config";
import {useState} from "react";

function AboutBytes() {
    //@ts-ignore
    const DesktopVideo = ({ videoSrc }) => {
        const [loading, setLoading] = useState(true);

        const handleLoadedData = () => {
            setLoading(false);
        };

        return (
            <Box sx={{position: 'relative', height: "auto", width: "40vw"}}>
                {loading && (
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 100
                    }}>
                        <CircularProgress color="inherit" />
                    </Box>
                )}
                <video
                    src={videoSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    onLoadedData={handleLoadedData}
                    style={{width: '100%', height: 'auto', borderRadius: "10px", border: "solid 2px #008664"}}
                >
                    Your browser does not support the video tag.
                </video>
            </Box>
        );
    };

    //@ts-ignore
    const MobileVideo = ({ videoSrc }) => {
        const [loading, setLoading] = useState(true);

        const handleLoadedData = () => {
            setLoading(false);
        };

        return (
            <Box sx={{position: 'relative', height: "auto", width: "100vw", p: 2}}>
                {loading && (
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 100
                    }}>
                        <CircularProgress color="inherit" />
                    </Box>
                )}
                <video
                    src={videoSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    onLoadedData={handleLoadedData}
                    style={{width: '100%', height: 'auto', borderRadius: "10px", border: "solid 2px #008664"}}
                >
                    Your browser does not support the video tag.
                </video>
            </Box>
        );
    };

    const renderDesktop = () => {
        return (
            <>
                <Box style={{width: "100%", height: "500px", backgroundColor: theme.palette.primary.dark}}>
                    <div style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-evenly"}}>
                        <div style={{position: "relative", top: "100px", width: '50%'}}>
                            <Typography variant={"h1"} sx={{color: "white"}}>
                                GIGO Bytes
                            </Typography>
                            <Typography variant={"subtitle1"} sx={{color: "white", textTransform: 'none', mt: 3}}>
                                A transformative way for learners to sharpen their coding skills. Mini coding challenges, designed to fit into your busy schedule.
                            </Typography>
                        </div>
                        <div>
                            <BytesIcon style={{height: "400px", width: "400px", paddingTop: "40px"}}/>
                        </div>
                    </div>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <AwesomeButton style={{
                            width: "auto",
                            height: "50px",
                            '--button-primary-color': theme.palette.secondary.main,
                            '--button-primary-color-dark': theme.palette.secondary.dark,
                            '--button-primary-color-light': theme.palette.text.primary,
                            '--button-primary-color-hover': theme.palette.secondary.main,
                            fontSize: "28px"
                        }} type="primary" href={"/byte/1750943457427324928"} >
                            <span>Take a Byte</span>
                        </AwesomeButton>
                    </Box>
                </Box>
                <div>
                    <br/><br/><br/><br/><br/><br/>

                    <Grid container spacing={0}>
                        <Grid item xs={1} />
                        <Grid item xs={4}>
                            <h2 style={{ textAlign: 'left' }}>Code Teacher</h2>
                            <p>GIGO Bytes are integrated with Code Teacher to offer a unique and personalized learning experience. Code Teacher acts as your own personal AI tutor, providing tailored guidance and support throughout your coding journey. </p>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Image alt="Code Teacher" src={CTIcon} style={{ width: "16vw", height: "16vw"}} />
                            </div>
                        </Grid>
                        <Grid item xs={1} />
                        <Grid item xs={"auto"} style={{ paddingTop: "5vh" }}>
                            <DesktopVideo videoSrc={config.rootPath + "/cloudstore/videos/demo-chat.mp4"} />
                        </Grid>
                        <Grid item xs={1} />
                    </Grid>

                    <br/><br/><br/><br/><br/><br/>

                    <Grid container spacing={0}>
                        <Grid item xs={1}/>
                        <Grid item xs={"auto"}>
                            <DesktopVideo videoSrc={config.rootPath + "/cloudstore/videos/demo-debug.mp4"}/>
                        </Grid>
                        <Grid item xs={1}/>
                        <Grid item xs={4}>
                            <h2 style={{textAlign: 'left'}}>Need to Debug?</h2>
                            <p>When you run into errors, Code Teacher is there to automatically correct them, turning
                                every mistake into a learning opportunity.</p>
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                <DebugIcon style={{height: '16vw', width: '16vw'}}/>
                            </div>
                        </Grid>
                        <Grid item xs={1}/>
                    </Grid>

                    <br/><br/><br/><br/><br/><br/>


                    <Grid container spacing={0}>
                        <Grid item xs={1}/>
                        <Grid item xs={4}>
                            <h2 style={{textAlign: 'left'}}>Feeling stuck?</h2>
                            <p>Code Teacher will offer intelligent suggestions on 'What To Do Next?', ensuring a smooth
                                learning curve.</p>
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                <Box sx={{
                                    border: 'solid 4px',
                                    borderColor: '#84E8A2',
                                    borderRadius: "32px",
                                    width: "14vw",
                                    height: "14vw",
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    mt: 1
                                }}>
                                    <Image alt="Code Teacher" src={NSIcon} style={{width: "7vw", height: "7vw"}}/>
                                </Box>
                            </div>
                        </Grid>
                        <Grid item xs={1}/>
                        <Grid item xs={"auto"}>
                            <DesktopVideo videoSrc={config.rootPath + "/cloudstore/videos/demo-nextsteps.mp4"}/>
                        </Grid>
                        <Grid item xs={1}/>
                    </Grid>

                    <br/><br/><br/><br/><br/><br/>

                    <Grid container spacing={0}>
                        <Grid item xs={1}/>
                        <Grid item xs={"auto"}>
                            <DesktopVideo videoSrc={config.rootPath + "/cloudstore/videos/demo-difficulty.mp4"}/>
                        </Grid>
                        <Grid item xs={1}/>
                        <Grid item xs={4}>
                            <h2 style={{textAlign: 'left'}}>Customizable Difficulty Levels</h2>
                            <p>Adjust the difficulty level of each challenge, making it suitable for
                                various experience levels. Each difficulty has it's own goal unique to that level of programming.
                            </p>
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    mt: 1,
                                    gap: "20px"
                                }}>
                                    <ByteEasySelectionIcon style={{height: "12vw"}}/>
                                    <ByteMediumSelectionIcon style={{height: "12vw"}}/>
                                    <ByteHardSelectionIcon style={{height: "12vw"}}/>
                                </Box>
                            </div>

                        </Grid>
                        <Grid item xs={1}/>
                    </Grid>


                    <br/><br/><br/><br/><br/><br/>
                </div>
            </>
        )
    }

    const renderMobile = () => {
        const textStyle = {
            textAlign: 'center',
            margin: '10px 20px'
        };

        return(
            <>
                <Box style={{width: "100%", height: "500px", backgroundColor: theme.palette.secondary.dark}}>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <BytesIcon
                            style={{height: "250px", width: "250px", paddingTop: "40px", paddingBottom: "20px"}}/>
                    </div>
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            <h1 style={textStyle as React.CSSProperties}>GIGO Bytes</h1>
                            <p style={textStyle as React.CSSProperties}>A transformative way for learners to sharpen
                                their coding skills. Mini coding challenges, designed to fit into your busy
                                schedule.</p>
                        </Grid>
                    </Grid>
                </Box>
                <br/><br/>
                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <Image alt="Code Teacher" src={CTIcon} style={{width: "50vw", height: "50vw"}}/>
                        </div>
                        <h2 style={textStyle as React.CSSProperties}>Code Teacher</h2>
                        <p style={textStyle as React.CSSProperties}>GIGO Bytes are integrated with Code Teacher to offer
                            a unique and personalized learning experience. Code Teacher acts as your own personal AI
                            tutor, providing tailored guidance and support throughout your coding journey.</p>
                        <Grid item xs={4} style={{paddingTop: "5vh"}}>
                            <MobileVideo videoSrc={config.rootPath + "/cloudstore/videos/demo-chat.mp4"}/>
                        </Grid>
                    </Grid>
                </Grid>
                <br/><br/>
                <hr style={{width: '80%', border: `1px solid ${theme.palette.secondary.contrastText}`, margin: '0 auto'}}/>
                <br/><br/>
                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <DebugIcon style={{height: '50vw', width: '50vw'}}/>
                        </div>
                        <h2 style={textStyle as React.CSSProperties}>Need to Debug?</h2>
                        <p style={textStyle as React.CSSProperties}>When you run into errors, Code Teacher is there to
                            automatically correct them, turning
                            every mistake into a learning opportunity.</p>
                        <Grid item xs={4} style={{paddingTop: "5vh"}}>
                            <MobileVideo videoSrc={config.rootPath + "/cloudstore/videos/demo-debug.mp4"}/>
                        </Grid>
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
                                border: 'solid 4px',
                                borderColor: '#84E8A2',
                                borderRadius: "32px",
                                width: "50vw",
                                height: "50vw",
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                mt: 1
                            }}>
                                <Image alt="Code Teacher" src={NSIcon} style={{width: "30vw", height: "30vw"}}/>
                            </Box>
                        </div>
                        <h2 style={textStyle as React.CSSProperties}>Feeling Stuck?</h2>
                        <p style={textStyle as React.CSSProperties}>Code Teacher will offer intelligent suggestions on
                            'What To Do Next?', ensuring a smooth
                            learning curve.</p>
                        <Grid item xs={4} style={{paddingTop: "5vh"}}>
                            <MobileVideo videoSrc={config.rootPath + "/cloudstore/videos/demo-nextsteps.mp4"}/>
                        </Grid>
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
                                <ByteEasySelectionIcon style={{height: "30vw"}}/>
                                <ByteMediumSelectionIcon style={{height: "30vw"}}/>
                                <ByteHardSelectionIcon style={{height: "30vw"}}/>
                            </Box>
                        </div>
                        <h2 style={textStyle as React.CSSProperties}>Customizable Difficulty</h2>
                        <p style={textStyle as React.CSSProperties}>Adjust the difficulty level of each challenge,
                            making it suitable for
                            various experience levels. Each difficulty has it's own goal unique to that level of
                            programming.</p>
                        <Grid item xs={4} style={{paddingTop: "5vh"}}>
                            <MobileVideo videoSrc={config.rootPath + "/cloudstore/videos/demo-difficulty.mp4"}/>
                        </Grid>
                    </Grid>
                </Grid>
                <br/><br/>
            </>
        )
    }

    return (
        <CssBaseline>
            <div>
                {window.innerWidth > 1000 ? renderDesktop() : renderMobile()}
            </div>
        </CssBaseline>
    );
}

export default AboutBytes;