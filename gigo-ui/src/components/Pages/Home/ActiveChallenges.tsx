'use client'
import {Button, Typography} from "@mui/material";
import Carousel from "@/components/Carousesl";
import ProjectCard from "@/components/Project/ProjectCard";
import config from "@/config";
import SheenPlaceholder from "@/components/Loading/SheenPlaceholder";
import * as React from "react";
import {useAppSelector} from "@/reducers/hooks";
import {selectAuthState} from "@/reducers/auth/auth";
import {selectAppWrapperChatOpen, selectAppWrapperSidebarOpen} from "@/reducers/appWrapper/appWrapper";
import {useSearchParams} from "next/navigation";
import SuspenseFallback from "@/components/SuspenseFallback";
import {Suspense} from "react";

export interface IProps {
    activeData: any[];
}

function ActiveChallenges({activeData}: IProps) {
    let query = useSearchParams();
    let isMobile = query.get("viewport") === "mobile";

    const authState = useAppSelector(selectAuthState);
    const sidebarOpen = useAppSelector(selectAppWrapperSidebarOpen);
    const chatOpen = useAppSelector(selectAppWrapperChatOpen);

    return (
        <Suspense fallback={<SuspenseFallback/>}>
            <div style={{
                display: "flex",
                flexDirection: "column",
                paddingLeft: "auto",
                paddingRight: "auto",
                justifyContent: "center",
                width: "100%",
                paddingBottom: "10px"
            }}>
                <div style={{display: "inline-flex"}}>
                    <Typography variant="h6" gutterBottom sx={{
                        paddingLeft: "10px",
                        paddingTop: "6px",
                        fontSize: "1.2em"
                    }}>
                        Active Challenges
                    </Typography>
                    <Button variant="text"
                            href={"/active"}
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
                    <Carousel itemsShown={(isMobile ? 1 : 4)} infiniteLoop={true}
                              itemsToSlide={(isMobile ? 1 : 4)}>
                        {
                            activeData && activeData.length > 0 ?
                                activeData.map((project, index) => {
                                    return (
                                        <div style={{paddingBottom: "10px"}}
                                             key={`challenge-${project["_id"]}-${index}`}>
                                            <ProjectCard
                                                height={"23vh"}
                                                imageHeight={"23vh"}
                                                // TODO mobile => make width 'fit-content'
                                                width={(chatOpen || sidebarOpen) ? "16vw" : (isMobile ? 'fit-content' : '20vw')}
                                                imageWidth={(chatOpen || sidebarOpen) ? "16vw" : "23vw"}
                                                projectId={project["_id"]}
                                                projectTitle={project["title"] !== null ? project["title"] : project["post_title"]}
                                                projectDesc={project["description"]}
                                                projectThumb={config.rootPath + project["thumbnail"]}
                                                projectDate={project["updated_at"]}
                                                projectType={project["post_type_string"]}
                                                renown={project["tier"]}
                                                onClick={() => console.log("navigate")}
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
                                }) :
                                Array.from({length: 4}, (_, index) => (
                                    <SheenPlaceholder height={"23vh"}
                                                      width={(chatOpen || sidebarOpen) ? "16vw" : "23vw"}
                                                      key={`placeholder-${index}`}/>
                                ))
                        }
                    </Carousel>
                </div>
            </div>
        </Suspense>
    )
}

export default ActiveChallenges;