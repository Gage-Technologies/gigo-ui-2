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


async function SearchMain({ searchParams: rawSearchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
    const searchParams = rawSearchParams || {};
    const isMobile = searchParams.viewport === "mobile";

    ///////// Server Side Data Loading //////////
    let searchRecordId: string | null = null;

    let params: any = {
        query: searchParams["q"] || "",
        skip: 0,
        limit: 16,
    }

    if (searchParams["author"] !== undefined) {
        params["author"] = searchParams["author"];
    }

    if (searchParams["languages"] !== undefined) {
        params["languages"] = ((searchParams["languages"] as string).split(",")).map(Number);
    }

    if (searchParams["attempts_min"] !== undefined) {
        params["attempts_min"] = Number(searchParams["attempts_min"]);
    }

    if (searchParams["attempts_max"] !== undefined) {
        params["attempts_max"] = Number(searchParams["attempts_max"]);
    }

    if (searchParams["completions_min"] !== undefined) {
        params["completions_min"] = Number(searchParams["completions_min"]);
    }

    if (searchParams["completions_max"] !== undefined) {
        params["completions_max"] = Number(searchParams["completions_max"]);
    }

    if (searchParams["coffee_min"] !== undefined) {
        params["coffee_min"] = Number(searchParams["coffee_min"]);
    }

    if (searchParams["coffee_max"] !== undefined) {
        params["coffee_max"] = Number(searchParams["coffee_max"]);
    }

    if (searchParams["views_min"] !== undefined) {
        params["views_min"] = Number(searchParams["views_min"]);
    }

    if (searchParams["views_max"] !== undefined) {
        params["views_max"] = Number(searchParams["views_max"]);
    }

    if (searchParams["tags"] !== undefined) {
        params["tags"] = (searchParams["tags"] as string).split(",");
    }

    if (searchParams["challenge_type"] !== undefined) {
        params["challenge_type"] = Number(searchParams["challenge_type"]);
    }

    if (searchParams["visibility"] !== undefined) {
        params["visibility"] = Number(searchParams["visibility"]);
    }

    if (searchParams["since"] !== undefined) {
        params["since"] = Number(searchParams["since"]);
    }

    if (searchParams["until"] !== undefined) {
        params["until"] = Number(searchParams["until"]);
    }

    if (searchParams["tier"] !== undefined) {
        params["tier"] = Number(searchParams["tier"]);
    }

    if (searchRecordId) {
        params["search_rec_id"] = searchRecordId;
    }

    let postRes = fetch(
        `${config.rootPath}/api/search/posts`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': getSessionCookies(cookies())
            },
            body: JSON.stringify(params),
            credentials: 'include'
        }
    ).then(async response => {
        if (!response.ok) {
            return []
        }
        const res: any = await response.json();
        if (res["search_rec_id"] !== undefined) {
            searchRecordId = res["search_rec_id"]
        }
        return (res["challenges"] || []) as Post[]
    });

    // Fetch bytes
    let bytesRes = fetch(
        `${config.rootPath}/api/search/bytes`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': getSessionCookies(cookies())
            },
            body: JSON.stringify(params),
            credentials: 'include'
        }
    ).then(async response => {
        if (!response.ok) {
            return []
        }
        const res: any = await response.json();
        return (res["posts"] || []) as Byte[]
    });

    // Fetch users
    let usersRes = fetch(
        `${config.rootPath}/api/search/users`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': getSessionCookies(cookies())
            },
            body: JSON.stringify(params),
            credentials: 'include'
        }
    ).then(async response => {
        if (!response.ok) {
            return []
        }
        const res: any = await response.json();
        return (res["users"] || []) as User[]
    });

    let unitsRes = fetch(
        `${config.rootPath}/api/search/journeyUnits`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': getSessionCookies(cookies())
            },
            body: JSON.stringify({
                query: searchParams["q"] || "",
                skip: 0,
                limit: 16
            }),
            credentials: 'include'
        }
    ).then(async (response) => {
        if (!response.ok) {
            return []
        }
        const res: any = await response.json();
        return (res["units"] || []) as Unit[]
    })

    // await all the promises
    const [posts, bytes, users, units] = await Promise.all([postRes, bytesRes, usersRes, unitsRes]);

    ////////////////////////////////////////////

    let loggedIn = false;
    if (checkSessionStatus(cookies().get('gigoAuthToken'))) {
        loggedIn = true;
    }

    ReactGA.initialize("G-38KBFJZ6M6");

    const constructSearchParams = (): string => {
        let params = ""
        for (let key in searchParams) {
            params += `&${key}=${searchParams[key]}`
        }
        return params
    }

    const handleSearchCompleted = async (postID: string) => {
        if (loggedIn && searchRecordId) {
            let params = {
                post_id: postID,
                query: searchParams["q"] || "",
                search_rec_id: searchRecordId,
            }

            let res = await fetch(
                `${config.rootPath}/api/search/complete`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cookie': getSessionCookies(cookies())
                    },
                    body: JSON.stringify(params),
                    credentials: 'include'
                }
            )

            if (res === undefined) {
                return
            }
        } else {

        }
    }

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
            {units.length > 0 && (
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
                            Journey Units
                        </Typography>
                        <Button
                            variant="text"
                            href="/journey/detour"
                            sx={{
                                ml: 2,
                                fontSize: "0.8rem",
                                fontWeight: 400,
                                p: 0.8,
                                minWidth: "0px",
                                lineHeight: "0",
                                height: "20px"
                            }}
                        >
                            Show All
                        </Button>
                    </Box>
                    <Grid container spacing={2}>
                        {units.map((unit) => (
                            <Grid item xs={12} md={6} lg={3} key={unit._id}>
                                {isMobile ? (
                                    <DetourMobileCard data={unit} />
                                ) : (
                                    <DetourCard data={unit} />
                                )}
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {posts.length > 0 && (
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
                        <Button
                            variant="text"
                            href={`/search/challenge?${constructSearchParams()}`}
                            sx={{
                                ml: 2,
                                fontSize: "0.8rem",
                                fontWeight: 400,
                                p: 0.8,
                                minWidth: "0px",
                                lineHeight: "0",
                                height: "20px"
                            }}
                        >
                            Show All
                        </Button>
                    </Box>
                    <Grid container spacing={2}>
                        {posts.map((post) => (
                            <Grid item xs={12} md={6} lg={3} key={post._id}>
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

            {bytes.length > 0 && (
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
                        <Button
                            variant="text"
                            href={`/search/byte?${constructSearchParams()}`}
                            sx={{
                                ml: 2,
                                fontSize: "0.8rem",
                                fontWeight: 400,
                                p: 0.8,
                                minWidth: "0px",
                                lineHeight: "0",
                                height: "20px"
                            }}
                        >
                            Show All
                        </Button>
                    </Box>
                    <Grid container spacing={2}>
                        {bytes.map((byte) => (
                            <Grid item xs={12} md={6} lg={3} key={byte._id}>
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

            {users.length > 0 && (
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
                        <Button
                            variant="text"
                            href={`/search/user?${constructSearchParams()}`}
                            sx={{
                                ml: 2,
                                fontSize: "0.8rem",
                                fontWeight: 400,
                                p: 0.8,
                                minWidth: "0px",
                                lineHeight: "0",
                                height: "20px"
                            }}
                        >
                            Show All
                        </Button>
                    </Box>
                    <Grid container spacing={2}>
                        {users.map((user) => (
                            <Grid item xs={12} md={6} lg={4} key={user._id}>
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