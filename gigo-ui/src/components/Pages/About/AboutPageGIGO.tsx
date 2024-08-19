'use client'
import * as React from "react";
import {theme} from "@/theme";
import {
    Box, CircularProgress,
    CssBaseline,
    Grid,
    ThemeProvider,
    Typography
} from "@mui/material";
import config from "@/config";
import BytesIcon from "@/icons/Bytes/BytesIcon";
import premiumGorilla from "@/img/pro/premiumGorilla.png";
import JourneyIcon from "@/icons/Journey/JourneyIcon";
import DetourSignIcon from "@/icons/Journey/DetourSign";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import Image from 'next/image';
import {useState} from "react";
import useIsMobile from "@/hooks/isMobile";

function AboutGIGO() {
    const isMobile = useIsMobile();
    
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
                <Box style={{width: "100%", height: "500px", background: "linear-gradient(90deg, rgba(28,135,98,1) 0%, rgba(99,164,248,1) 100%)"}}>
                    <div style={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-evenly"}}>
                        <div style={{position: "relative", width: '50%'}}>
                            <Typography variant={"h1"} sx={{color: "white"}}>
                                About GIGO
                            </Typography>
                            <Typography variant={"subtitle1"} sx={{color: "white", textTransform: 'none', mt: 3}}>GIGO is created by developers who
                                learned to code on their own and wanted to make the learning process easier for others.
                            </Typography>
                            <Typography variant={"subtitle1"} sx={{color: "white", textTransform: 'none', mt: 3}}>
                                The platform is tailored for a variety of skill levels, starting with fundamental
                                lessons for beginners and moving on to more project-based learning for intermediate
                                learners.
                            </Typography>
                            <Typography variant={"subtitle1"} sx={{color: "white", textTransform: 'none', mt: 3}}>
                                Central to GIGO is our AI tutor, Code
                                Teacher, which provides personalized
                                guidance. We aim to streamline the learning process for coding, making it easier and
                                more approachable than what many of us have encountered.
                            </Typography>
                        </div>
                        <div>
                            <Image src={premiumGorilla} width={200} alt={""}/>
                        </div>
                    </div>
                </Box>
                <div>
                    <br/><br/><br/><br/><br/><br/>

                    <Grid container spacing={0}>
                        <Grid item xs={1}/>
                        <Grid item xs={4}>
                            <h2 style={{textAlign: 'left'}}>Start Your Journey</h2>
                            <p>Journeys provide a tailored learning experience in coding, with quick, manageable
                                projects to suit your schedule. The adaptive framework caters to your interests, for
                                stress-free learning. GIGO&#39;s AI tutor, Code Teacher, offers on-the-fly personalized
                                help, guiding you from beginner to skilled developer.</p>
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                <JourneyIcon style={{height: '13vw', width: '13vw'}}/>
                            </div>
                        </Grid>
                        <Grid item xs={1} />
                        <Grid item xs={"auto"} style={{ paddingTop: "5vh" }}>
                            <DesktopVideo videoSrc={config.rootPath + "/cloudstore/videos/journeys.mp4"} />
                        </Grid>
                        <Grid item xs={1} />
                    </Grid>

                    <br/><br/><br/><br/><br/><br/>

                    <Grid container spacing={0}>
                        <Grid item xs={1}/>
                        <Grid item xs={"auto"}>
                            <DesktopVideo videoSrc={config.rootPath + "/cloudstore/videos/detours.mp4"}/>
                        </Grid>
                        <Grid item xs={1}/>
                        <Grid item xs={4}>
                            <h2 style={{textAlign: 'left'}}>Need a new Journey path?</h2>
                            <p>Detours let you change up your learning path to focus on what you need or want to learn next. They&#39;re choices that pop up as you go, giving you the chance to dive deeper into topics or brush up on skills. With Detours, you control where your coding skills grow, making sure your learning fits just right for you.</p>
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                <DetourSignIcon style={{height: '13vw', width: '13vw'}}/>
                            </div>
                        </Grid>
                        <Grid item xs={1}/>
                    </Grid>

                    <br/><br/><br/><br/><br/><br/>

                    <Grid container spacing={0}>
                        <Grid item xs={1}/>
                        <Grid item xs={4}>
                            <h2 style={{textAlign: 'left'}}>Take a Byte</h2>
                            <p>GIGO Bytes are interactive, mini coding exercises designed to reinforce and expand programming skills. Each Byte focuses on a specific concept or skill, allowing users to practice coding without any setup. This quick, accessible format is ideal for integrating into a busy schedule, enabling developers to enhance their skills whenever it fits into their day.</p>
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                <BytesIcon style={{height: '9vw', width: '9vw'}}/>
                            </div>
                        </Grid>
                        <Grid item xs={1}/>
                        <Grid item xs={"auto"}>
                            <DesktopVideo videoSrc={config.rootPath + "/cloudstore/videos/bytes.mp4"}/>
                        </Grid>
                        <Grid item xs={1}/>
                    </Grid>

                    <br/><br/><br/><br/><br/><br/>

                    <Grid container spacing={0}>
                        <Grid item xs={1}/>
                        <Grid item xs={"auto"}>
                            <DesktopVideo videoSrc={config.rootPath + "/cloudstore/videos/challenges.mp4"}/>
                        </Grid>
                        <Grid item xs={1}/>
                        <Grid item xs={4}>
                            <h2 style={{textAlign: 'left'}}>Create and Attempt Challenges</h2>
                            <p>Challenges offer developers the opportunity to solve real-world problems in a cloud-based environment. The platform runs all code on our servers, allowing users to program from any device using only their web browsers. This approach eliminates setup complexities and accelerates the advancement from basic to more sophisticated programming skills.</p>
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                <RocketLaunchIcon style={{height: '11vw', width: '11vw'}}/>
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
            margin: '10px 20px',
        };

        return(
            <>
                <Box style={{width: "100%", height: "100%", backgroundColor: theme.palette.secondary.dark}}>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <Image src={premiumGorilla} style={{height: "300px", width:"200px", paddingTop: "40px", paddingBottom: "20px"}} alt={""}/>
                    </div>
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            <h1 style={{textAlign: 'left', margin: '10px 20px'}}>About GIGO</h1>
                            <p style={{textAlign: 'left', margin: '10px 20px'}}>GIGO is created by developers who
                                learned to code on their own and wanted to make the learning process easier for others.
                            </p>
                            <p style={{textAlign: 'left', margin: '10px 20px'}}>
                                The platform is tailored for a variety of skill levels, starting with fundamental
                                lessons for beginners and moving on to more project-based learning for intermediate
                                learners.
                            </p>
                            <p style={{textAlign: 'left', margin: '10px 20px'}}>Central to GIGO is our AI tutor, Code Teacher, which provides personalized
                                guidance. We aim to streamline the learning process for coding, making it easier and
                                more approachable than what many of us have encountered.
                            </p>
                        </Grid>
                    </Grid>
                </Box>
                <br/><br/>
                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <JourneyIcon style={{width: "50vw", height: "50vw"}}/>
                        </div>
                        <h2 style={textStyle as React.CSSProperties}>Start Your Journey</h2>
                        <p style={textStyle as React.CSSProperties}>Journeys provide a tailored learning experience in
                            coding, with quick, manageable projects to suit your schedule. The adaptive framework caters to your interests, for stress-free learning. GIGO&#39;s AI tutor, Code Teacher, offers on-the-fly personalized help, guiding you from beginner to skilled developer.</p>
                        <Grid item xs={4} style={{paddingTop: "5vh"}}>
                            <MobileVideo videoSrc={config.rootPath + "/cloudstore/videos/journeys.mp4"}/>
                        </Grid>
                    </Grid>
                </Grid>
                <br/><br/>
                <hr style={{width: '80%', border: `1px solid ${theme.palette.secondary.contrastText}`, margin: '0 auto'}}/>
                <br/><br/>
                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <DetourSignIcon style={{height: '30vw', width:'30vw'}}/>
                        </div>
                        <h2 style={textStyle as React.CSSProperties}>Need a new Journey path?</h2>
                        <p style={textStyle as React.CSSProperties}>Detours let you change up your learning path to focus on what you need or want to learn next. They&#39;re choices that pop up as you go, giving you the chance to dive deeper into topics or brush up on skills. With Detours, you control where your coding skills grow, making sure your learning fits just right for you.</p>
                        <Grid item xs={4} style={{paddingTop: "5vh"}}>
                            <MobileVideo videoSrc={config.rootPath + "/cloudstore/videos/detours.mp4"}/>
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
                            <BytesIcon style={{width: "30vw", height: "30vw"}}/>
                        </div>
                        <h2 style={textStyle as React.CSSProperties}>Take a Byte</h2>
                        <p style={textStyle as React.CSSProperties}>GIGO Bytes are interactive, mini coding exercises designed to reinforce and expand programming skills. Each Byte focuses on a specific concept or skill, allowing users to practice coding without any setup. This quick, accessible format is ideal for integrating into a busy schedule, enabling developers to enhance their skills whenever it fits into their day.</p>
                        <Grid item xs={4} style={{paddingTop: "5vh"}}>
                            <MobileVideo videoSrc={config.rootPath + "/cloudstore/videos/bytes.mp4"}/>
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
                            <RocketLaunchIcon style={{width: "30vw", height: "30vw"}}/>
                        </div>
                        <h2 style={textStyle as React.CSSProperties}>Create and Attempt Challenges</h2>
                        <p style={textStyle as React.CSSProperties}>Challenges offer developers the opportunity to solve real-world problems in a cloud-based environment. The platform runs all code on our servers, allowing users to program from any device using only their web browsers. This approach eliminates setup complexities and accelerates the advancement from basic to more sophisticated programming skills.</p>
                        <Grid item xs={4} style={{paddingTop: "5vh"}}>
                            <MobileVideo videoSrc={config.rootPath + "/cloudstore/videos/challenges.mp4"}/>
                        </Grid>
                    </Grid>
                </Grid>
                <br/><br/>
            </>
        )
    }



    return (
        <ThemeProvider theme={theme}>
            <CssBaseline>
                <div>
                    {isMobile ? renderMobile() : renderDesktop()}
                </div>
            </CssBaseline>
        </ThemeProvider>
    );
}
export default AboutGIGO;