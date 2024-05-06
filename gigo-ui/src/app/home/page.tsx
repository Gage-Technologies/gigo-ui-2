import * as React from "react";
import {Suspense} from "react";
import {Box, Button, Grid, Typography} from "@mui/material";
import config from "@/config";
import Carousel from "../../components/Carousesl";
import ReactGA from "react-ga4";
import GIGOLandingPage from "@/components/LandingPage/Landing2";
import GIGOLandingPageMobile from "@/components/LandingPage/LandingMobile";
import BytesCard from "@/components/Bytes/BytesCard";
import {programmingLanguages} from "@/services/vars";
import BytesIcon from "@/icons/Bytes/BytesIcon";
import "react-awesome-button/dist/styles.css"
import BytesCardMobile from "@/components/Bytes/BytesCardMobile";
import SheenPlaceholder from "@/components/Loading/SheenPlaceholder";
import {cookies} from "next/headers";
import Tutorial from "@/components/Pages/Home/Tutorial";
import {checkSessionStatus, getSessionCookies} from "@/services/utils";
import RecommendedProjectsScroll from "@/components/Pages/Home/RecommendedProjectsScroll";
import ActiveChallenges from "@/components/Pages/Home/ActiveChallenges";
import JourneyBanner from "@/components/Pages/Home/JourneyBanner";
import JourneyBannerMobile from "@/components/Pages/Home/JourneyBannerMobile";
import SuspenseFallback from "@/components/SuspenseFallback";


async function Home({
                        searchParams,
                    }: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    ///////////// Server Side Data Loading /////////////
    const byteContent = await fetch(
        `${config.rootPath}/api/bytes/getRecommendedBytes`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: '{}',
            credentials: 'include'
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
        let cookieHeader = getSessionCookies(cookies());

        loggedIn = true;
        let unitsReq = fetch(
            `${config.rootPath}/api/journey/completesUnitsStats`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookieHeader
                },
                body: '{}',
                credentials: 'include'
            }
        ).then(async (response) => {
            try {
                let data: { finished_journey_count?: number, message?: string } = await response.json();
                if (data.finished_journey_count !== undefined) {
                    console.log("finished_journey_count: ", data.finished_journey_count)
                    completedJourneyUnits = data.finished_journey_count
                }
            } catch (e) {
                console.log("failed to get units: ", e)
            }
        })

        let tasksReq = fetch(
            `${config.rootPath}/api/journey/tasksStats`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookieHeader
                },
                body: '{}',
                credentials: 'include'
            }
        ).then(async (response) => {
            try {
                let data: {
                    completed_tasks?: number,
                    incompleted_tasks?: number,
                    message?: string
                } = await response.json();
                if (data.completed_tasks !== undefined) {
                    console.log("completed tasks: ", data.completed_tasks)
                    completedJourneyTasks = data.completed_tasks
                }
                if (data.incompleted_tasks !== undefined) {
                    console.log("incompleted tasks: ", data.incompleted_tasks)
                    incompletedJourneyTasks = data.incompleted_tasks
                }
            } catch (e) {
                console.log("failed to get tasks: ", e)
            }
        })

        let detourReq = fetch(
            `${config.rootPath}/api/journey/detourStats`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookieHeader
                },
                body: '{}',
                credentials: 'include'
            }
        ).then(async (response) => {
            try {
                let data: { detour_count?: number, message?: string } = await response.json();
                if (data.detour_count !== undefined) {
                    console.log("detour_count: ", data.detour_count)
                    detourCount = data.detour_count
                }
            } catch (e) {
                console.log("failed to get detour count: ", e)
            }
        })

        let startedJourneyReq = fetch(
            `${config.rootPath}/api/journey/determineStart`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookieHeader
                },
                body: '{}',
                credentials: 'include'
            }
        ).then(async (response) => {
            try {
                let data: { started_journey?: boolean, message?: string } = await response.json();
                if (data.started_journey !== undefined) {
                    console.log("started_journey: ", data.started_journey)
                    startedJourney = data.started_journey
                }
            } catch (e) {
                console.log("failed to get started journey: ", e)
            }
        })

        let activeReq = fetch(
            `${config.rootPath}/api/home/active`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookieHeader
                },
                body: '{}',
                credentials: 'include'
            }
        ).then(async (response) => {
            try {
                let data: { projects?: any[], message?: string } = await response.json();
                if (data.projects !== undefined) {
                    activeData = data.projects
                }
            } catch (e) {
                console.log("failed to get active data: ", e)
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

    let isMobile = searchParams?.viewport === "mobile";

    // let theme = createTheme(getAllTokens('dark'))

    ReactGA.initialize("G-38KBFJZ6M6");

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
                    <Suspense fallback={<SheenPlaceholder height={500} width={"100%"}/>}>
                        <Carousel itemsShown={1} infiniteLoop={true} itemsToSlide={1}>
                            {
                                byteContent && byteContent.length > 0 ?
                                    byteContent.map((project, index) => (
                                        <Box display={"flex"} justifyContent={"center"} key={index}
                                             style={{width: "100%", padding: "0 5%"}}>
                                            <Suspense fallback={<SheenPlaceholder height={500} width={281}/>}>
                                                <BytesCardMobile
                                                    height={"550px"}
                                                    imageHeight={500}
                                                    width="100%"
                                                    imageWidth={281}
                                                    bytesId={project["_id"]}
                                                    bytesTitle={project["name"]}
                                                    bytesDesc={project["description_medium"]}
                                                    bytesThumb={config.rootPath + "/static/bytes/t/" + project["_id"]}
                                                    completedEasy={project["completed_easy"]}
                                                    completedMedium={project["completed_medium"]}
                                                    completedHard={project["completed_hard"]}
                                                    language={programmingLanguages[project["lang"]]}
                                                    isHome={false}
                                                    onMouseEnter={undefined}
                                                    onMouseLeave={undefined}
                                                    animate={false}
                                                />
                                            </Suspense>
                                        </Box>
                                    )) : (
                                        <SheenPlaceholder height={"40vh"} width={"100%"}/>
                                    )
                            }
                        </Carousel>
                    </Suspense>
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
                    <Suspense fallback={<SheenPlaceholder height={400} width={"100%"}/>}>
                        <Carousel itemsShown={(isMobile ? 1 : 5)} infiniteLoop={true}
                                  itemsToSlide={isMobile ? 1 : 5}>
                            {
                                byteContent && byteContent.length > 0 ?
                                    byteContent.map((project, index) => {
                                        return (
                                            <Box display={"flex"} justifyContent={"center"}
                                                 style={{paddingBottom: "10px", width: "16vw"}} key={project["_id"]}>
                                                <Suspense fallback={<SheenPlaceholder height={400} width={225}/>}>
                                                    <BytesCard
                                                        height={"475px"}
                                                        imageHeight={400}
                                                        // TODO mobile => make width 'fit-content'
                                                        width={'100%'}
                                                        imageWidth={225}
                                                        bytesId={project["_id"]}
                                                        bytesTitle={project["name"]}
                                                        bytesDesc={project["description_medium"]}
                                                        bytesThumb={config.rootPath + "/static/bytes/t/" + project["_id"]}
                                                        completedEasy={project["completed_easy"]}
                                                        completedMedium={project["completed_medium"]}
                                                        completedHard={project["completed_hard"]}
                                                        language={programmingLanguages[project["lang"]]}
                                                        animate={false}
                                                    />
                                                </Suspense>
                                            </Box>
                                        )
                                    }) :
                                    Array.from({length: 15}, (_, index) => (
                                        <SheenPlaceholder height={"43vh"} width={"calc(43vh * 0.5625)"}
                                                          key={`placeholder-${index}`}/>
                                    ))
                            }
                        </Carousel>
                    </Suspense>
                </div>
            </div>
        )
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
        <div style={{overflow: "hidden"}}>
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
                    <Suspense fallback={<SuspenseFallback/>}>
                        {(isMobile) ? (
                            <JourneyBannerMobile
                                startedJourney={startedJourney}
                                completedJourneyTasks={completedJourneyTasks}
                                completedJourneyUnits={completedJourneyUnits}
                                detourCount={detourCount}
                                incompletedJourneyTasks={incompletedJourneyTasks}
                            />
                        ) : (
                            <JourneyBanner
                                startedJourney={startedJourney}
                                completedJourneyTasks={completedJourneyTasks}
                                completedJourneyUnits={completedJourneyUnits}
                                detourCount={detourCount}
                                incompletedJourneyTasks={incompletedJourneyTasks}
                            />
                        )}
                    </Suspense>
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
                    {(!isMobile && loggedIn) ? (
                        <Suspense fallback={<SuspenseFallback/>}>
                            <ActiveChallenges activeData={activeData}/>
                        </Suspense>
                    ) : null}
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
                    <Suspense fallback={<SuspenseFallback/>}>
                        <RecommendedProjectsScroll/>
                    </Suspense>
                </Box>
            </Grid>
        </div>
    );
}

export default Home;
