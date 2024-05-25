'use client'


import * as React from "react";
import { useEffect } from "react";
import { Box, Button, Container, createTheme, CssBaseline, Grid, PaletteMode, ThemeProvider, Typography } from "@mui/material";
import { theme } from "@/theme";
import ProjectCard from "@/components/Project/ProjectCard";
import config from "@/config";
import Carousel from "@/components/Carousel2";
import { useAppDispatch, useAppSelector } from "@/reducers/hooks";
import { selectAuthState } from "@/reducers/auth/auth";
import { useRouter, useSearchParams } from "next/navigation";
import SheenPlaceholder from "@/components/Loading/SheenPlaceholder";

function Active() {
    let query = useSearchParams();
    let isMobile = query.get("viewport") === "mobile";

    const chatOpen = query.get("chat") === "true";
    const sidebarOpen = query.get("menu") === "true";

    const dispatch = useAppDispatch();

    const authState = useAppSelector(selectAuthState);

    const [pastWeek, setPastWeek] = React.useState([]);

    const [mostChallenging, setMostChallenging] = React.useState([]);

    const [incomplete, setIncomplete] = React.useState([]);

    const [loading, setLoading] = React.useState(false)

    const [firstLoad, setFirstLoad] = React.useState(true)

    let router = useRouter();


    const getActiveProjects = async () => {
        let activeData = [];
        let challengingData = [];
        let incompleteData = [];

        if (firstLoad) {
            let active = fetch(
                `${config.rootPath}/api/active/pastWeek`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ skip: 0, limit: 15 }),
                    credentials: "include"
                }
            ).then(r => r.json())

            let rec = fetch(
                `${config.rootPath}/api/active/challenging`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ skip: 0, limit: 15 }),
                    credentials: "include"
                }
            ).then(r => r.json())

            let follow = fetch(
                `${config.rootPath}/api/active/dontGiveUp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ skip: 0, limit: 15 }),
                    credentials: "include"
                }
            ).then(r => r.json())

            const [res, res2, res3] = await Promise.all([
                active,
                rec,
                follow
            ])

            if (res === undefined && res2 === undefined && res3 === undefined) {
                return
            }

            if (res2["projects"] !== undefined && res2["projects"].length > 0) {
                //@ts-ignore
                setMostChallenging(res2["projects"])
            } else {
                //@ts-ignore
                setMostChallenging([])
            }

            if (res["projects"] !== undefined && res["projects"].length > 0) {
                //@ts-ignore
                setPastWeek(res["projects"])
            } else {
                //@ts-ignore
                setPastWeek([])
            }

            if (res3["projects"] !== undefined && res3["projects"].length > 0) {
                //@ts-ignore
                setIncomplete(res3["projects"])
            } else {
                //@ts-ignore
                setIncomplete([])
            }

            setFirstLoad(false)
        }

    }

    useEffect(() => {
        setLoading(true)
        getActiveProjects().then(r => console.log("here: ", r))
        setLoading(false)
    }, [])

    const PastProjects = () => {
        return (
            <Box component={"div"} sx={{
                display: "flex",
                flexDirection: "column",
                paddingLeft: "auto",
                paddingRight: "auto",
                justifyContent: "center",
                width: "100%",
                paddingBottom: "10px"
            }}>
                <Box component={"div"} sx={{ display: "flex", marginTop: "25px" }}>
                    <Typography variant="h5" gutterBottom>
                        Past Week
                    </Typography>
                </Box>
                <Box sx={{
                    display: "flex",
                    justifyContent: "start",
                    flexDirection: `row`,
                    alignContent: `center`,
                    overflowX: "auto",
                    width: `calc(100%${chatOpen ? "- 300px" : ""}${sidebarOpen ? "- 250px" : ""})`
                }}>
                    <div style={{ width: "100%" }}>
                        <Carousel itemsShown={(isMobile ? 1 : 5)} infiniteLoop={true} itemsToSlide={(isMobile ? 1 : 5)}>
                            {
                                loading || pastWeek.length === 0 ? (
                                    [...Array(5)].map((_, i) => (
                                        <SheenPlaceholder
                                            key={i}
                                            width={(chatOpen || sidebarOpen) ? "16vw" : (isMobile ? '100%' : 'calc(20vw - 32px)')}
                                            height={(chatOpen || sidebarOpen) ? "calc(16vw * 0.5625)" : (isMobile ? 'calc(100vw * 0.5625)' : 'calc((20vw - 32px) * 0.5625)')}
                                        />
                                    ))
                                ) : (
                                    //@ts-ignore
                                    pastWeek.map((project, index) => {
                                        return (
                                            <div key={index}>
                                                {project["_id"] !== "-1" ? (
                                                    <ProjectCard
                                                        width={(chatOpen || sidebarOpen) ? "16vw" : (isMobile ? '100%' : 'calc(20vw - 32px)')}
                                                        imageWidth={(chatOpen || sidebarOpen) ? "16vw" : (isMobile ? '100%' : "calc(20vw - 32px)")}
                                                        projectId={project["_id"]}
                                                        projectTitle={project["attempt_title"] !== null ? project["attempt_title"] : project["post_title"]}
                                                        projectDesc={project["description"]}
                                                        projectThumb={config.rootPath + project["thumbnail"]}
                                                        projectDate={project["updated_at"]}
                                                        projectType={project["post_type_string"]}
                                                        renown={project["tier"]}
                                                        onClick={() => router.push("/attempt/" + project["_id"])}
                                                        // onClick={() => navigate("/challenge/" + project["post_id"])}
                                                        userTier={authState.tier}
                                                        userThumb={config.rootPath + "/static/user/pfp/" + authState.id}
                                                        userId={authState.id}
                                                        username={authState.userName}
                                                        backgroundName={authState.backgroundName}
                                                        backgroundPalette={authState.backgroundColor}
                                                        backgroundRender={authState.backgroundRenderInFront}
                                                        hover={false}
                                                        exclusive={false}
                                                        attempt={true}
                                                        role={authState.role}
                                                    />
                                                ) : (
                                                    <ProjectCard
                                                        width={(chatOpen || sidebarOpen) ? "16vw" : (isMobile ? '100%' : 'calc(20vw - 32px)')}
                                                        imageWidth={(chatOpen || sidebarOpen) ? "16vw" : (isMobile ? '100%' : "calc(20vw - 32px)")}
                                                        projectId={project["post_id"]}
                                                        projectTitle={project["post_title"]}
                                                        projectDesc={project["description"]}
                                                        projectThumb={config.rootPath + project["thumbnail"]}
                                                        projectDate={project["updated_at"]}
                                                        projectType={project["post_type_string"]}
                                                        renown={project["tier"]}
                                                        onClick={() => router.push("/challenge/" + project["post_id"])}
                                                        // onClick={() => navigate("/attempt/" + project["_id"])}
                                                        userTier={authState.tier}
                                                        userThumb={config.rootPath + "/static/user/pfp/" + authState.id}
                                                        userId={authState.id}
                                                        username={authState.userName}
                                                        backgroundName={authState.backgroundName}
                                                        backgroundPalette={authState.backgroundColor}
                                                        backgroundRender={authState.backgroundRenderInFront}
                                                        exclusive={false}
                                                        hover={false}
                                                        role={authState.role}
                                                    // attempt={true}
                                                    />
                                                )}
                                            </div>
                                        )
                                    })
                                )}
                        </Carousel>
                    </div>
                </Box>
            </Box>
        )
    }

    const Challenges = () => {
        return (
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                paddingLeft: "auto",
                paddingRight: "auto",
                justifyContent: "center",
                width: "100%",
                paddingBottom: "10px"
            }}>
                <Box sx={{ display: "flex" }}>
                    <Typography variant="h5" gutterBottom>
                        Most Challenging
                    </Typography>
                </Box>
                <Box sx={{
                    display: "flex",
                    justifyContent: "start",
                    flexDirection: `row`,
                    alignContent: `center`,
                    overflowX: "auto",
                    width: `calc(100%${chatOpen ? "- 300px" : ""}${sidebarOpen ? "- 250px" : ""})`
                }}>
                    <div style={{ width: "100%" }}>
                        <Carousel itemsShown={(isMobile ? 1 : 5)} infiniteLoop={true} itemsToSlide={(isMobile ? 1 : 5)}>
                            {
                                loading || mostChallenging.length === 0 ? (
                                    [...Array(5)].map((_, i) => (
                                        <SheenPlaceholder
                                            key={i}
                                            width={(chatOpen || sidebarOpen) ? "16vw" : (isMobile ? '100%' : 'calc(20vw - 32px)')}
                                            height={(chatOpen || sidebarOpen) ? "calc(16vw * 0.5625)" : (isMobile ? 'calc(100vw * 0.5625)' : 'calc((20vw - 32px) * 0.5625)')}
                                        />
                                    ))
                                ) : (
                                    //@ts-ignore
                                    mostChallenging.map((project, index) => {
                                        return (
                                            <div key={index}>
                                                <ProjectCard
                                                    width={(chatOpen || sidebarOpen) ? "16vw" : (isMobile ? '100%' : 'calc(20vw - 32px)')}
                                                    imageWidth={(chatOpen || sidebarOpen) ? "16vw" : (isMobile ? '100%' : "calc(20vw - 32px)")}
                                                    projectId={project["_id"]}
                                                    projectTitle={project["title"] !== null ? project["title"] : project["post_title"]}
                                                    projectDesc={project["description"]}
                                                    projectThumb={config.rootPath + project["thumbnail"]}
                                                    projectDate={project["updated_at"]}
                                                    projectType={project["post_type_string"]}
                                                    renown={project["tier"]}
                                                    onClick={() => router.push("/attempt/" + project["_id"])}
                                                    userTier={authState.tier}
                                                    userThumb={config.rootPath + "/static/user/pfp/" + authState.id}
                                                    userId={authState.id}
                                                    username={authState.userName}
                                                    backgroundName={authState.backgroundName}
                                                    backgroundPalette={authState.backgroundColor}
                                                    backgroundRender={authState.backgroundRenderInFront}
                                                    exclusive={false}
                                                    hover={false}
                                                    attempt={true}
                                                    role={authState.role}
                                                />
                                            </div>
                                        )
                                    })
                                )}
                        </Carousel>
                    </div>
                </Box>
            </Box>
        )
    }

    const Started = () => {

        return (
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                paddingLeft: "auto",
                paddingRight: "auto",
                justifyContent: "center",
                width: "100%",
                paddingBottom: "10px"
            }}>
                <Box sx={{ display: "flex" }}>
                    <Typography variant="h5" gutterBottom>
                        Don&apos;t Give Up Yet!
                    </Typography>
                </Box>
                <Box sx={{
                    display: "flex",
                    justifyContent: "start",
                    flexDirection: `row`,
                    alignContent: `center`,
                    overflowX: "auto",
                    width: `calc(100%${chatOpen ? "- 300px" : ""}${sidebarOpen ? "- 250px" : ""})`
                }}>
                    <div style={{ width: "100%" }}>
                        <Carousel itemsShown={(isMobile ? 1 : 5)} infiniteLoop={true} itemsToSlide={(isMobile ? 1 : 5)}>
                            {loading || incomplete.length === 0 ? (
                                [...Array(5)].map((_, i) => (
                                    <SheenPlaceholder
                                        key={i}
                                        width={(chatOpen || sidebarOpen) ? "16vw" : (isMobile ? '100%' : 'calc(20vw - 32px)')}
                                        height={(chatOpen || sidebarOpen) ? "calc(16vw * 0.5625)" : (isMobile ? 'calc(100vw * 0.5625)' : 'calc((20vw - 32px) * 0.5625)')}
                                    />
                                ))
                            ) : (
                                //@ts-ignore
                                incomplete.map((project, index) => {
                                    return (
                                        <div key={index}>
                                            {project["_id"] !== "-1" ? (
                                                <ProjectCard
                                                    width={(chatOpen || sidebarOpen) ? "16vw" : (isMobile ? '100%' : 'calc(20vw - 32px)')}
                                                    imageWidth={(chatOpen || sidebarOpen) ? "16vw" : (isMobile ? '100%' : "calc(20vw - 32px)")}
                                                    projectId={project["_id"]}
                                                    projectTitle={project["attempt_title"] !== null ? project["attempt_title"] : project["post_title"]}
                                                    projectDesc={project["description"]}
                                                    projectThumb={config.rootPath + project["thumbnail"]}
                                                    projectDate={project["updated_at"]}
                                                    projectType={project["post_type_string"]}
                                                    renown={project["tier"]}
                                                    onClick={() => router.push("/attempt/" + project["_id"])}
                                                    userTier={authState.tier}
                                                    userThumb={config.rootPath + "/static/user/pfp/" + authState.id}
                                                    userId={authState.id}
                                                    username={authState.userName}
                                                    backgroundName={authState.backgroundName}
                                                    backgroundPalette={authState.backgroundColor}
                                                    backgroundRender={authState.backgroundRenderInFront}
                                                    exclusive={false}
                                                    hover={false}
                                                    attempt={true}
                                                    role={authState.role}
                                                />
                                            ) : (
                                                // <div>challenge</div>
                                                <ProjectCard
                                                    width={(chatOpen || sidebarOpen) ? "16vw" : (isMobile ? 'fit-content' : 'calc(20vw - 32px)')}
                                                    imageWidth={(chatOpen || sidebarOpen) ? "16vw" : "calc(20vw - 32px)"}
                                                    projectId={project["post_id"]}
                                                    projectTitle={project["post_title"]}
                                                    projectDesc={project["description"]}
                                                    projectThumb={config.rootPath + project["thumbnail"]}
                                                    projectDate={project["updated_at"]}
                                                    projectType={project["post_type_string"]}
                                                    renown={project["tier"]}
                                                    onClick={() => router.push("/challenge/" + project["post_id"])}
                                                    userTier={authState.tier}
                                                    userThumb={config.rootPath + "/static/user/pfp/" + authState.id}
                                                    userId={authState.id}
                                                    username={authState.userName}
                                                    backgroundName={authState.backgroundName}
                                                    backgroundPalette={authState.backgroundColor}
                                                    backgroundRender={authState.backgroundRenderInFront}
                                                    exclusive={false}
                                                    hover={false}
                                                    role={authState.role}
                                                // attempt={true}
                                                />
                                            )}
                                        </div>
                                    )
                                })
                            )}
                        </Carousel>
                    </div>
                </Box>
            </Box>
        )
    }


    return (
        <Box
            sx={{
                p: 2
            }}
        >
            {loading || pastWeek.length > 0 && (
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: "wrap",
                        width: "100%",
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'background.default',
                        color: 'text.primary',
                        borderRadius: 1,
                    }}
                >
                    {PastProjects()}
                </Box>
            )}
            {loading || mostChallenging.length > 0 && (
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: "wrap",
                        width: "100%",
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'background.default',
                        color: 'text.primary',
                        borderRadius: 1,
                    }}
                >
                    {Challenges()}
                </Box>
            )}
            {loading || incomplete.length > 0 && (
                <Box
                    sx={!isMobile ? {
                        display: 'flex',
                        flexWrap: "wrap",
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'background.default',
                        color: 'text.primary',
                        borderRadius: 1,
                    } : {
                        display: 'flex',
                        flexWrap: "wrap",
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'background.default',
                        color: 'text.primary',
                        borderRadius: 1,
                        marginBottom: "50px"
                    }}
                >
                    {Started()}
                </Box>
            )}
            {!loading && pastWeek.length === 0 && mostChallenging.length === 0 && incomplete.length === 0 && (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        bgcolor: 'background.default',
                        color: 'text.primary',
                        borderRadius: 1,
                        padding: '20px',
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        No Attempts
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        You have no active attempts at the moment. Pick a Challenge and click Launch to start an Attempt!
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        href="/home"
                        sx={{ marginTop: '20px' }}
                    >
                        Pick a Challenge
                    </Button>
                </Box>
            )}
        </Box>
    );
}

export default Active;
