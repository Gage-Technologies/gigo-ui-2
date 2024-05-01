'use client'
import {createTheme, Grid, PaletteMode, Typography} from "@mui/material";
import LazyLoad from "react-lazyload";
import ProjectCard from "@/components/Project/ProjectCard";
import config from "@/config";
import MoonLoader from "react-spinners/MoonLoader";
import * as React from "react";
import {useAppSelector} from "@/reducers/hooks";
import {selectAppWrapperChatOpen, selectAppWrapperSidebarOpen} from "@/reducers/appWrapper/appWrapper";
import {getAllTokens} from "@/theme";
import call from "@/services/api-call";
import swal from "sweetalert";
import useInfiniteScroll from "@/hooks/infiniteScroll";

export default function RecommendedProjectsScroll() {
    // let userPref = localStorage.getItem('theme')
    let userPref = 'dark'
    const [mode, _] = React.useState<PaletteMode>('dark');
    const theme = React.useMemo(() => createTheme(getAllTokens(mode)), [mode]);

    const chatOpen = useAppSelector(selectAppWrapperChatOpen);
    const sidebarOpen = useAppSelector(selectAppWrapperSidebarOpen);

    const [recData, setRecData] = React.useState<any[]>([])
    const [recDataPage, setRecDataPage] = React.useState(0)
    const stopScroll = React.useRef(false)

    const infiniteScrollHandler = async () => {
        // we make up to 3 attempts to retrieve the next block of data
        for (let i = 0; i < 3; i++) {
            let rec = await call(
                "/api/project/recommended",
                "post",
                null,
                null,
                null,
                //@ts-ignore
                {
                    skip: recDataPage * 32,
                },
                null,
                config.rootPath
            )

            if (rec === undefined || rec["projects"] === undefined) {
                if (i === 2) {
                    //@ts-ignore
                    swal("Server Error", "The server is not being cool right now. We're gonna have a talk with it. Try again later!")
                }
                stopScroll.current = true
                continue
            }

            let newProjects = rec["projects"] as Array<never>

            if (newProjects.length === 0) {
                stopScroll.current = true
            }

            let localCopy = JSON.parse(JSON.stringify(recData))
            // @ts-ignore
            localCopy = localCopy.concat(newProjects)
            setRecData(localCopy)

            setRecDataPage(recDataPage + 1)

            break
        }
    }

    const [isFetching, setIsFetching] = useInfiniteScroll(infiniteScrollHandler, true, 1440, stopScroll)

    let randomTag = () => {
        // generate a 6 digit random alpha-numeric string
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            paddingLeft: "auto",
            paddingRight: "auto",
            justifyContent: "center",
            width: "103%",
            paddingBottom: "10px",
            marginLeft: "1%",
        }}>
            <div style={{display: "inline-flex"}}>
                <Typography variant="h6" gutterBottom sx={{
                    paddingLeft: "10px",
                    paddingTop: "6px",
                    fontSize: "1.2em",
                }}>
                    Recommended Challenges
                </Typography>
            </div>
            <Grid container spacing={4}
                  sx={{
                      paddingRight: "10px",
                      paddingLeft: "10px"
                  }}
            >
                {
                    recData.map((project, index) => {
                        return (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={"rec-" + project["_id"]}>
                                <LazyLoad once scroll unmountIfInvisible>
                                    <ProjectCard
                                        height={"20vh"}
                                        imageHeight={"20vh"}
                                        // TODO mobile => make width 'fit-content'
                                        width={(chatOpen || sidebarOpen) ? "16vw" : (document.documentElement.clientWidth < 1000 ? 'fit-content' : '20vw')}
                                        imageWidth={(chatOpen || sidebarOpen) ? "16vw" : "23vw"}
                                        projectId={project["_id"]}
                                        projectTitle={project["title"]}
                                        projectDesc={project["description"]}
                                        projectThumb={config.rootPath + project["thumbnail"]}
                                        projectDate={project["updated_at"]}
                                        projectType={project["post_type"]}
                                        renown={project["tier"]}
                                        onClick={() => console.log("navigate")}
                                        userTier={project["user_tier"]}
                                        userThumb={config.rootPath + "/static/user/pfp/" + project["author_id"]}
                                        userId={project["author_id"]}
                                        username={project["author"]}
                                        backgroundName={project["background_name"]}
                                        backgroundPalette={project["background_palette"]}
                                        backgroundRender={project["background_render"]}
                                        exclusive={project["challenge_cost"] === null ? false : true}
                                        hover={false}
                                        role={project["user_status"]}
                                        estimatedTime={project["estimated_tutorial_time_millis"]}
                                    />
                                </LazyLoad>
                            </Grid>
                        )
                    })
                }
            </Grid>
            {
                isFetching ? (
                    <Grid container spacing={2} justifyContent="center" alignItems="center"
                          style={{marginTop: "10px"}}
                    >
                        <Grid item xs={12}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "100%"
                                }}
                            >
                                <MoonLoader color={theme.palette.primary.main} loading={true} size={35}/>
                            </div>
                        </Grid>
                    </Grid>
                ) : (<></>)
            }
        </div>
    )
}