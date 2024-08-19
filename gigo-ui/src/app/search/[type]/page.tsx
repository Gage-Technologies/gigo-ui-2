'use client'
import * as React from "react";
import { Box, Button, ButtonBase, Grid, Tooltip, Typography } from "@mui/material";
import ProjectCard from "@/components/Project/ProjectCard";
import config from "@/config";
import UserIcon from "@/icons/User/UserIcon";
import renown1 from "@/img/renown/renown1.svg"
import renown2 from "@/img/renown/renown2.svg"
import renown3 from "@/img/renown/renown3.svg"
import renown4 from "@/img/renown/renown4.svg"
import renown5 from "@/img/renown/renown5.svg"
import renown6 from "@/img/renown/renown6.svg"
import renown7 from "@/img/renown/renown7.svg"
import renown8 from "@/img/renown/renown8.svg"
import renown9 from "@/img/renown/renown9.svg"
import renown10 from "@/img/renown/renown10.svg"
import ReactGA from "react-ga4";
import BytesCard from "@/components/Bytes/BytesCard";
import Post from "@/models/post";
import { Byte } from "@/models/bytes";
import User from "@/models/user";
import { Unit } from "@/models/journey";
import DetourCard from "@/components/Journey/DetourCard";
import { checkSessionStatus, getSessionCookies } from "@/services/utils";
import { cookies } from "next/headers";
import { programmingLanguages } from "@/services/vars";
import Image from "next/image";
import DetourMobileCard from "@/components/Journey/DetourMobileCard";
import { useSearchParams } from "next/navigation";
import useInfiniteScroll from "@/hooks/infiniteScroll";
import useIsMobile from "@/hooks/isMobile";


function SearchMain({
    params, 
}: { 
    params: { type: string }
}) {
    const type = params.type;
    const searchParams = useSearchParams();
    const isMobile = useIsMobile();

    const baseQueryParams: any = {
        query: searchParams.get("q") || "",
    }

    if (searchParams.get("author") !== null) {
        baseQueryParams["author"] = searchParams.get("author");
    }

    if (searchParams.get("languages") !== null) {
        baseQueryParams["languages"] = ((searchParams.get("languages") as string).split(",")).map(Number);
    }

    if (searchParams.get("attempts_min") !== null) {
        baseQueryParams["attempts_min"] = Number(searchParams.get("attempts_min"));
    }

    if (searchParams.get("attempts_max") !== null) {
        baseQueryParams["attempts_max"] = Number(searchParams.get("attempts_max"));
    }

    if (searchParams.get("completions_min") !== null) {
        baseQueryParams["completions_min"] = Number(searchParams.get("completions_min"));
    }

    if (searchParams.get("completions_max") !== null) {
        baseQueryParams["completions_max"] = Number(searchParams.get("completions_max"));
    }

    if (searchParams.get("coffee_min") !== null) {
        baseQueryParams["coffee_min"] = Number(searchParams.get("coffee_min"));
    }

    if (searchParams.get("coffee_max") !== null) {
        baseQueryParams["coffee_max"] = Number(searchParams.get("coffee_max"));
    }

    if (searchParams.get("views_min") !== null) {
        baseQueryParams["views_min"] = Number(searchParams.get("views_min"));
    }

    if (searchParams.get("views_max") !== null) {
        baseQueryParams["views_max"] = Number(searchParams.get("views_max"));
    }

    if (searchParams.get("tags") !== null) {
        baseQueryParams["tags"] = (searchParams.get("tags") as string).split(",");
    }

    if (searchParams.get("challenge_type") !== null) {
        baseQueryParams["challenge_type"] = Number(searchParams.get("challenge_type"));
    }

    if (searchParams.get("visibility") !== null) {
        baseQueryParams["visibility"] = Number(searchParams.get("visibility"));
    }

    if (searchParams.get("since") !== null) {
        baseQueryParams["since"] = Number(searchParams.get("since"));
    }

    if (searchParams.get("until") !== null) {
        baseQueryParams["until"] = Number(searchParams.get("until"));
    }

    if (searchParams.get("tier") !== null) {
        baseQueryParams["tier"] = Number(searchParams.get("tier"));
    }

    const [recDataPage, setRecDataPage] = React.useState(0)
    const [challengeData, setChallengeData] = React.useState<Post[]>([])
    const [byteData, setByteData] = React.useState<Byte[]>([])
    const [userData, setUserData] = React.useState<User[]>([])
    const stopScroll = React.useRef(false)

    const infiniteScrollHandler = async () => {
        console.log("infiniteScrollHandler")

        let params: any = JSON.parse(JSON.stringify(baseQueryParams))
        params["skip"] = recDataPage * 32
        params["limit"] = 32

        if (type === "challenge") {
            await fetch(
                `${config.rootPath}/api/search/posts`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(params),
                    credentials: 'include'
                }
            ).then(async (response) => {
                if (!response.ok) {
                    return []
                }
                const res: any = await response.json();
                let challenges = (res["challenges"] || []) as Post[]
                if (challenges.length === 0) {
                    stopScroll.current = true
                }
                let localCopy: Post[] = JSON.parse(JSON.stringify(challengeData))
                localCopy = localCopy.concat(challenges)
                setChallengeData(localCopy)
                setRecDataPage(recDataPage + 1)
            })

            return
        }

        if (type === "byte") {
            await fetch(
                `${config.rootPath}/api/search/bytes`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(params),
                    credentials: 'include'
                }
            ).then(async (response) => {
                if (!response.ok) {
                    return []
                }
                const res: any = await response.json();
                let bytes = (res["posts"] || []) as Byte[]
                if (bytes.length === 0) {
                    stopScroll.current = true
                }
                let localCopy: Byte[] = JSON.parse(JSON.stringify(byteData))
                localCopy = localCopy.concat(bytes)
                setByteData(localCopy)
                setRecDataPage(recDataPage + 1)
            })

            return
        }

        if (type === "user") {
            await fetch(
                `${config.rootPath}/api/search/users`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(params),
                    credentials: 'include'
                }
            ).then(async (response) => {
                if (!response.ok) {
                    return []
                }
                const res: any = await response.json();
                let users = (res["users"] || []) as User[]
                if (users.length === 0) {
                    stopScroll.current = true
                }
                let localCopy: User[] = JSON.parse(JSON.stringify(userData))
                localCopy = localCopy.concat(users)
                setUserData(localCopy)
                setRecDataPage(recDataPage + 1)
            })

            return
        }
    }

    const [isFetching, setIsFetching] = useInfiniteScroll(infiniteScrollHandler, true, 1440, stopScroll)

    ReactGA.initialize("G-38KBFJZ6M6");

    const handleRenownCheck = (renown: number) => {
        let imgSrc;
        switch (renown) {
            case 0:
                imgSrc = renown1;
                break;
            case 1:
                imgSrc = renown2;
                break;
            case 2:
                imgSrc = renown3;
                break;
            case 3:
                imgSrc = renown4;
                break;
            case 4:
                imgSrc = renown5;
                break;
            case 5:
                imgSrc = renown6;
                break;
            case 6:
                imgSrc = renown7;
                break;
            case 7:
                imgSrc = renown8;
                break;
            case 8:
                imgSrc = renown9;
                break;
            case 9:
                imgSrc = renown10;
                break;
            default:
                imgSrc = renown10;
                break;
        }
        return imgSrc;
    }

    // let container: HTMLElement | null = document.getElementById('container');
    //
    // if (container) {
    //     let fontSize: number = 24; // Start with a high value
    //     container.style.fontSize = fontSize + 'px';
    //
    //     // Reduce the font size until the text fits the width, or the font size is 12px
    //     while (container.scrollWidth > container.offsetWidth && fontSize > 12) {
    //         fontSize--;
    //         container.style.fontSize = fontSize + 'px';
    //     }
    // }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 5
            }}
        >
            <Typography variant="h3" component="div">
                Search Results
            </Typography>

            {challengeData.length > 0 && (
                <Box
                    sx={{
                        width: "100%",
                        paddingBottom: "40px"
                    }}
                >
                    <Box
                        display="inline-flex"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Typography variant="h4" component="div" gutterBottom>
                            Challenges
                        </Typography>
                    </Box>
                    <Grid container spacing={2}>
                        {challengeData.map((post, index) => (
                            <Grid item xs={12} md={6} lg={3} key={`challenge:${index}: ${post._id}`}    >
                                <ButtonBase href={"/challenge/" + post._id} sx={{ borderRadius: "10px", width: "100%" }}>
                                    <ProjectCard
                                        height={"20vh"}
                                        imageHeight={"20vh"}
                                        width={isMobile ? '100%' : undefined}
                                        projectId={post._id}
                                        projectTitle={post.title}
                                        projectDesc={post.description}
                                        projectThumb={config.rootPath + post.thumbnail}
                                        projectDate={post.updated_at}
                                        projectType={post.post_type_string}
                                        renown={post.tier}
                                        //@ts-ignore
                                        userTier={post.user_tier}
                                        userThumb={config.rootPath + "/static/user/pfp/" + post.author_id}
                                        userId={post.author_id}
                                        username={post.author}
                                        //@ts-ignore
                                        backgroundName={post.background_name}
                                        //@ts-ignore
                                        backgroundPalette={post.background_palette}
                                        //@ts-ignore
                                        backgroundRender={post.background_render}
                                        //todo come back and add this
                                        exclusive={null}
                                        hover={false}
                                        //@ts-ignore
                                        role={post.user_status}
                                    />
                                </ButtonBase>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {byteData.length > 0 && (
                <Box
                    sx={{
                        width: "100%",
                        paddingBottom: "40px"
                    }}
                >
                    <Box
                        display="inline-flex"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Typography variant="h4" component="div" gutterBottom>
                            Bytes
                        </Typography>
                    </Box>
                    <Grid container spacing={2}>
                        {byteData.map((byte, index) => (
                            <Grid item xs={12} md={6} lg={3} key={`byte:${index}: ${byte._id}`}>
                                <BytesCard
                                    height={"475px"}
                                    imageHeight={400}
                                    // TODO mobile => make width 'fit-content'
                                    width={'100%'}
                                    imageWidth={225}
                                    bytesId={byte._id}
                                    bytesTitle={byte.name}
                                    bytesDesc={byte.description_medium}
                                    bytesThumb={config.rootPath + "/static/bytes/t/" + byte._id}
                                    language={programmingLanguages[byte.lang]}
                                    animate={false}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {userData.length > 0 && (
                <Box
                    sx={{
                        width: "100%",
                        paddingBottom: "40px"
                    }}
                >
                    <Box
                        display="inline-flex"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Typography variant="h4" component="div" gutterBottom>
                            Users
                        </Typography>
                    </Box>
                    <Grid container spacing={2}>
                        {userData.map((user, index) => (
                            <Grid item xs={12} md={6} lg={4} key={`user:${index}: ${user._id}`}>
                                <Button
                                    sx={{ width: "100%", borderRadius: "10px" }}
                                    href={"/user/" + user._id}
                                    variant="outlined"
                                >
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        width: "100%",
                                        height: "100%",
                                        justifyContent: "left",
                                        alignItems: "center",
                                        marginRight: "10px"
                                    }}
                                    >
                                        <Box sx={{
                                            display: "flex",
                                            width: "80",
                                            justifyContent: "left"
                                        }}
                                        >
                                            <UserIcon
                                                userId={user._id}
                                                userTier={user.user_rank}
                                                userThumb={config.rootPath + user.pfp_path}
                                                backgroundName={
                                                    //@ts-ignore
                                                    user.background_name}
                                                backgroundPalette={
                                                    //@ts-ignore
                                                    user.background_palette}
                                                backgroundRender={
                                                    //@ts-ignore
                                                    user.background_render}
                                                size={65}
                                                imageTop={2}
                                            />
                                        </Box>
                                        <Box
                                            display="flex"
                                            flexDirection="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            sx={{
                                                width: "100%"
                                            }}
                                        >
                                            <Typography
                                                variant="h6"
                                                component="div"
                                                id={"container"}
                                            >
                                                {user.user_name}
                                            </Typography>
                                            <Tooltip
                                                title={`Renown ${parseInt(user.tier) + 1}`}
                                            >
                                                <Image
                                                    height={70}
                                                    width={70}
                                                    style={{
                                                        opacity: "0.85",
                                                    }}
                                                    src={handleRenownCheck(parseInt(user.tier))}
                                                    alt=""
                                                />
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

        </Box>
    )
}

export default SearchMain;