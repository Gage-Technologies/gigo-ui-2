import * as React from "react";
import {Box, Button, CssBaseline, Grid, Typography} from "@mui/material";
import {defaultTheme} from "@/theme";
import config from "@/config";
import Carousel from "../../components/Carousesl";
import ReactGA from "react-ga4";
import GIGOLandingPage from "@/components/LandingPage/Landing";
import GIGOLandingPageMobile from "@/components/LandingPage/LandingMobile";
import BytesCard from "@/components/Bytes/BytesCard";
import {programmingLanguages} from "@/services/vars";
import BytesIcon from "@/icons/Bytes/BytesIcon";
import {AwesomeButton} from "react-awesome-button";
import "react-awesome-button/dist/styles.css"
import JourneyIcon from "@/icons/Journey/JourneyIcon";
import BytesCardMobile from "@/components/Bytes/BytesCardMobile";
import SheenPlaceholder from "@/components/Loading/SheenPlaceholder";
import Layout from "@/app/layout";
import {cookies, headers} from "next/headers";
import Tutorial from "@/components/Pages/Home/Tutorial";
import {checkSessionStatus} from "@/services/utils";
import RecommendedProjectsScroll from "@/components/Pages/Home/RecommendedProjectsScroll";
import ActiveChallenges from "@/components/Pages/Home/ActiveChallenges";


async function Home() {
    ///////////// Server Side Data Loading /////////////
    const byteContent = await fetch(
        `${config.rootPath}/api/bytes/getRecommendedBytes`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: '{}'
        }
    ).then(async (response) => {
        let data: { rec_bytes?: any[], message?: string } = await response.json();
        if (data.rec_bytes !== undefined) {
            return data.rec_bytes
        }
        return []
    })
    let completedJourneyTasks = 0;
    let incompletedJourneyTasks = 0;
    let detourCount = 0;
    let completedJourneyUnits = 0;
    let startedJourney = false;
    let activeData: any[] = [];
    let loggedIn = false;
    if (checkSessionStatus(cookies().get('gigoAuthToken'))) {
        loggedIn = true;
        let unitsReq = await fetch(
            `${config.rootPath}/api/journey/completesUnitsStats`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: '{}'
            }
        ).then(async (response) => {
            let data: { finished_journey_count?: number, message?: string } = await response.json();
            if (data.finished_journey_count !== undefined) {
                completedJourneyUnits = data.finished_journey_count
            }
        })

        let tasksReq = fetch(
            `${config.rootPath}/api/journey/tasksStats`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: '{}'
            }
        ).then(async (response) => {
            let data: {
                completed_tasks?: number,
                incompleted_tasks?: number,
                message?: string
            } = await response.json();
            if (data.completed_tasks !== undefined) {
                completedJourneyTasks = data.completed_tasks
            }
            if (data.incompleted_tasks !== undefined) {
                incompletedJourneyTasks = data.incompleted_tasks
            }
        })

        let detourReq = fetch(
            `${config.rootPath}/api/journey/detourStats`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: '{}'
            }
        ).then(async (response) => {
            let data: { detour_count?: number, message?: string } = await response.json();
            if (data.detour_count !== undefined) {
                detourCount = data.detour_count
            }
        })

        let startedJourneyReq = fetch(
            `${config.rootPath}/api/journey/determineStart`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: '{}'
            }
        ).then(async (response) => {
            let data: { started_journey?: boolean, message?: string } = await response.json();
            if (data.started_journey !== undefined) {
                startedJourney = data.started_journey
            }
        })

        let activeReq = fetch(
            `${config.rootPath}/api/project/active`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: '{}'
            }
        ).then(async (response) => {
            let data: { projects?: any[], message?: string } = await response.json();
            if (data.projects !== undefined) {
                activeData = data.projects
            }
        })

        await Promise.all([
            unitsReq,
            tasksReq,
            detourReq,
            startedJourneyReq,
            activeReq,
        ])
    }
    ////////////////////////////////////////////////////

    const headersList = headers();
    const userAgent = headersList.get('user-agent');

    // Let's check if the device is a mobile device
    let isMobile = userAgent!.match(
        /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
    );

    // let theme = createTheme(getAllTokens('dark'))

    ReactGA.initialize("G-38KBFJZ6M6");

    const JourneyHeader = () => {

        if (startedJourney) {
            return (
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
                                        color: defaultTheme.palette.background.default,
                                        textTransform: 'none',
                                    }}>
                                        {completedJourneyTasks}
                                    </Typography>
                                </Box>
                                <Typography variant="h5" sx={{
                                    color: defaultTheme.palette.background.default,
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
                                        color: defaultTheme.palette.background.default,
                                        textTransform: 'none',
                                    }}>
                                        {completedJourneyUnits}
                                    </Typography>
                                </Box>
                                <Typography variant="h5" sx={{
                                    color: defaultTheme.palette.background.default,
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
                                        color: defaultTheme.palette.background.default,
                                        textTransform: 'none',
                                    }}>
                                        {detourCount}
                                    </Typography>
                                </Box>
                                <Typography variant="h5" sx={{
                                    color: defaultTheme.palette.background.default,
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
                                        color: defaultTheme.palette.background.default,
                                        textTransform: 'none',
                                    }}>
                                        {incompletedJourneyTasks}
                                    </Typography>
                                </Box>
                                <Typography variant="h5" sx={{
                                    color: defaultTheme.palette.background.default,
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
            )
        } else {
            return (
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
                                                color: defaultTheme.palette.background.default,
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
                                '--button-primary-color': defaultTheme.palette.primary.main,
                                '--button-primary-color-dark': defaultTheme.palette.primary.dark,
                                '--button-primary-color-light': "white",
                                '--button-primary-color-hover': defaultTheme.palette.primary.main,
                                '--button-default-border-radius': "12px",
                                fontSize: "28px"
                            }} type="primary" href={"/journey/main"}>
                                <span>Start Your Journey</span>
                            </AwesomeButton>
                        </Box>
                    </Box>
                </>
            )
        }
    }

    const JourneyHeaderMobile = () => {
        if (startedJourney) {
            return (
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
                                        color: defaultTheme.palette.background.default,
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
                                        color: defaultTheme.palette.background.default,
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
                                        color: defaultTheme.palette.background.default,
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
                                        color: defaultTheme.palette.background.default,
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
                                        color: defaultTheme.palette.background.default,
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
                                        color: defaultTheme.palette.background.default,
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
                                        color: defaultTheme.palette.background.default,
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
                                        color: defaultTheme.palette.background.default,
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
                            '--button-primary-color': defaultTheme.palette.primary.main,
                            '--button-primary-color-dark': defaultTheme.palette.primary.dark,
                            '--button-primary-color-light': "white",
                            '--button-primary-color-hover': defaultTheme.palette.primary.light,
                            '--button-default-border-radius': "12px",
                            fontSize: "28px",
                            height: "80px",
                        }} type="primary" href={"/journey/main"}>
                            <span>Continue Your Journey</span>
                        </AwesomeButton>
                    </Box>
                </Box>
            );
        } else {
            return (
                <Box sx={{p: 2}}>
                    <Typography
                        variant="h4"
                        sx={{
                            color: defaultTheme.palette.background.default,
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
                            '--button-primary-color': defaultTheme.palette.primary.main,
                            '--button-primary-color-dark': defaultTheme.palette.primary.dark,
                            '--button-primary-color-light': "white",
                            '--button-primary-color-hover': defaultTheme.palette.primary.main,
                            '--button-default-border-radius': "12px",
                            fontSize: "28px"
                        }} type="primary" href={"/journey/main"}>
                            <span>Start Your Journey</span>
                        </AwesomeButton>
                    </Box>
                </Box>
            );
        }
    };

    const BytesMobile = () => {

        // @ts-ignore
        return (
            <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: "100%",
                paddingBottom: "10px",
            }}>
                <div style={{display: "inline-flex", alignItems: 'center', padding: "10px 0"}}>
                    <Typography variant="h6" gutterBottom
                                sx={{display: 'flex', alignItems: 'center', flexGrow: 1, marginLeft: "10%"}}>
                        <BytesIcon style={{height: "20px", width: "20px", marginRight: "5px"}}
                                   miniIcon={false}/>
                        Bytes Swipe
                    </Typography>
                    <Button variant="text" href="/bytesMobile" sx={{
                        fontSize: "0.8em",
                        fontWeight: "light",
                        textTransform: "lowercase",
                        marginRight: "5%"
                    }}>
                        (show all)
                    </Button>
                </div>
                <div style={{
                    display: "flex",
                    justifyContent: "start",
                    overflowX: "auto",
                    paddingLeft: "5%"
                }}>
                    <Carousel itemsShown={1} infiniteLoop={true} itemsToSlide={1}>
                        {
                            byteContent && byteContent.length > 0 ?
                                byteContent.map((project, index) => (
                                    <div key={index} style={{width: "100%", padding: "0 5%"}}>
                                        <BytesCardMobile
                                            height="auto"
                                            imageHeight="40vh"
                                            width="100%"
                                            imageWidth="100%"
                                            bytesId={project["_id"]}
                                            bytesTitle={project["name"]}
                                            bytesDesc={project["description_medium"]}
                                            bytesThumb={config.rootPath + "/static/bytes/t/" + project["_id"]}
                                            completedEasy={project["completed_easy"]}
                                            completedMedium={project["completed_medium"]}
                                            completedHard={project["completed_hard"]}
                                            language={programmingLanguages[project["lang"]]}
                                            isHome={false}
                                        />
                                    </div>
                                )) : (
                                    <SheenPlaceholder height={"40vh"} width={"100%"}/>
                                )
                        }
                    </Carousel>
                </div>
            </div>
        )
    }

    const Bytes = () => {
        if (isMobile) {
            return BytesMobile()
        }

        return (
            <div style={{
                display: "flex",
                flexDirection: "column",
                paddingLeft: "auto",
                paddingRight: "auto",
                justifyContent: "center",
                width: "100%",
                paddingBottom: "10px",
                height: "100%"
            }}>
                <div style={{display: "inline-flex"}}>
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                            paddingLeft: "10px",
                            paddingTop: "6px",
                            fontSize: "1.2em",
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                        <BytesIcon
                            style={{
                                height: "20px",
                                width: "20px",
                                marginRight: "5px"
                            }}
                            miniIcon={false}
                        />
                        Bytes
                    </Typography>
                    <Button variant="text"
                            href={"/bytes"}
                            sx={{
                                fontSize: "0.8em",
                                fontWeight: "light",
                                textTransform: "lowercase",
                            }}
                    >
                        (show all)
                    </Button>
                </div>
                <div style={{
                    display: "flex",
                    justifyContent: "start",
                    flexDirection: `row`,
                    alignContent: `center`,
                    overflowX: "auto",
                    marginLeft: "1%",
                }}>
                    {/*TODO mobile => make carousel 1 for mobile*/}
                    <Carousel itemsShown={(isMobile ? 1 : 5)} infiniteLoop={true}
                              itemsToSlide={isMobile ? 1 : 5}>
                        {
                            byteContent && byteContent.length > 0 ?
                                byteContent.map((project, index) => {
                                    return (
                                        <div style={{paddingBottom: "10px", width: "16vw"}}>
                                            <BytesCard
                                                height={"52vh"}
                                                imageHeight={"43vh"}
                                                // TODO mobile => make width 'fit-content'
                                                width={'auto'}
                                                imageWidth={"auto"}
                                                bytesId={project["_id"]}
                                                bytesTitle={project["name"]}
                                                bytesDesc={project["description_medium"]}
                                                bytesThumb={config.rootPath + "/static/bytes/t/" + project["_id"]}
                                                completedEasy={project["completed_easy"]}
                                                completedMedium={project["completed_medium"]}
                                                completedHard={project["completed_hard"]}
                                                language={programmingLanguages[project["lang"]]}
                                            />
                                        </div>
                                    )
                                }) :
                                Array.from({length: 15}, (_, index) => (
                                    <SheenPlaceholder height={"43vh"} width={"calc(43vh * 0.5625)"}/>
                                ))
                        }
                    </Carousel>
                </div>
            </div>
        )
    }

    const headerMobile = () => {
        let project: any = undefined;
        if (byteContent.length > 0) {
            const randomIndex = Math.floor(Math.random() * byteContent.length);
            project = byteContent[randomIndex];
        }

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
                {JourneyHeaderMobile()}
            </Box>
        );

    }

    const renderLanding = () => {
        if (loggedIn) {
            return null
        }

        if (isMobile) {
            return (<GIGOLandingPageMobile/>)
        }

        return (<GIGOLandingPage/>)
    }

    return (
        <Layout>
            <CssBaseline>
                <div>
                    <Tutorial/>
                    {renderLanding()}
                    <Typography component={"div"}>
                    </Typography>
                    <Grid container sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "1",
                        // paddingLeft: "50px"
                    }}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: "wrap",
                                width: "100%",
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: 'background.default',
                                color: 'text.primary',
                            }}
                        >
                            {(isMobile) && (
                                <Grid container spacing={2} sx={{
                                    width: "100%",
                                    height: "500px",
                                    backgroundColor: "#ffef62",
                                    zIndex: 3,
                                    m: 2,
                                    borderRadius: "12px",
                                    position: "relative"
                                }}>
                                    {JourneyHeader()}
                                </Grid>
                            )}
                            {(isMobile) && headerMobile()}
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: "wrap",
                                width: "100%",
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: 'background.default',
                                color: 'text.primary',
                            }}
                        >
                            {Bytes()}
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: "wrap",
                                width: "100%",
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: 'background.default',
                                color: 'text.primary',
                            }}
                        >
                            {(isMobile && loggedIn) ? <ActiveChallenges activeData={activeData}/> : null}
                        </Box>

                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: "wrap",
                                width: "100%",
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: 'background.default',
                                color: 'text.primary',
                            }}
                        >
                            <RecommendedProjectsScroll/>
                        </Box>
                    </Grid>
                </div>
            </CssBaseline>
        </Layout>
    );
}

export default Home;
