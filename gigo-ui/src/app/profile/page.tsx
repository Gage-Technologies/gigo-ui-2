'use client'
import * as React from "react";
import {SyntheticEvent, useEffect, useState} from "react";
import {
    Autocomplete,
    Box,
    Button,
    createTheme,
    CssBaseline,
    Grid,
    MenuItem,
    PaletteMode,
    Select,
    Tab,
    Tabs,
    TextField,
    ThemeProvider,
    Typography,
    Modal,
    DialogTitle,
    DialogContent,
    Dialog,
    Tooltip,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText, DialogActions, IconButton
} from "@mui/material";
import Image from "next/image";
import {theme} from "@/theme";
import ProjectCard from "@/components/Project/ProjectCard";
import {useAppDispatch, useAppSelector} from "@/reducers/hooks";
import {
    initialAuthStateUpdate,
    selectAuthState, selectAuthStateId,
    selectAuthStateTier,
    selectAuthStateUserName,
    updateAuthState
} from "@/reducers/auth/auth";
import ProfilePicture from "@/icons/User/ProfilePicture";
import {Chart} from "react-google-charts";
import call from "@/services/api-call";
import config from "@/config";
import swal from "sweetalert";
import Lottie from "react-lottie"
import * as animationData from '@/img/71619-coding.json'
import {ThreeDots} from "react-loading-icons";
import Post from "@/models/post";
import ReactGA from "react-ga4";
import {programmingLanguages} from "@/services/vars";
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockIcon from '@mui/icons-material/Lock';
import UserIcon from "@/icons/User/UserIcon";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import MoonLoader from "react-spinners/MoonLoader";
import useInfiniteScroll from "@/hooks/infiniteScroll";
import ProgressBar from "@ramonak/react-progress-bar";
import "@/components/Profile/styles/progress.css";
import coffeePot from "@/img/renown/coffee_maker.svg";
import r1Lvl from "@/img/renown/r1Lvl.svg";
import r2Lvl from "@/img/renown/r2Lvl.svg";
import r3Lvl from "@/img/renown/r3Lvl.svg";
import r4Lvl from "@/img/renown/r4Lvl.svg";
import r5Lvl from "@/img/renown/r5Lvl.svg";
import r6Lvl from "@/img/renown/r6Lvl.svg";
import r7Lvl from "@/img/renown/r7Lvl.svg";
import r8Lvl from "@/img/renown/r8Lvl.svg";
import r9Lvl from "@/img/renown/r9Lvl.svg";
import r10Lvl from "@/img/renown/r10Lvl.svg";
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
import alternativeImage from "@/img/Black.png"
import useDebounce from "@/hooks/debounce";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {Helmet, HelmetProvider} from "react-helmet-async";
import {useRouter, useSearchParams} from "next/navigation";

type BackgroundArray = {
    modules: string;
    id?: string;
    name: string;
    data: null | any;
};

interface Reward {
    id: string; // Or number, depending on your data
    render_in_front: boolean; // Adjust this type if different
    full_name: string;
}


function Profile() {
    const username = useAppSelector(selectAuthStateUserName);
    const tier = useAppSelector(selectAuthStateTier);
    let queryParams = useSearchParams();
    let isMobile = queryParams.get("viewport") === "mobile";
    const chatOpened = queryParams.get("chat") === "true";
    const sidebarOpen = queryParams.get("menu") === "true";

    const styles = {
        themeButton: {
            display: "flex",
            justifyContent: "right"
        },
        projectName: {
            display: "flex",
            marginLeft: "auto",
            paddingLeft: "10%"
        },
        mainTabButton: {
            height: "4vh", bgcolor: 'text.secondary'
        },
        barCompleted: {
            backgroundColor: 'lightblue',
            width: '80%',
            clipPath: 'polygon(0 0, 100% 0%, 95% 100%, 0 100%)',
        },
    };

    let profileBackgroundArrayFull: BackgroundArray[] = [{"modules": "red_paint", "name": "red_paint", "data": null}, {"modules": "white_paint", "name": "white_paint", "data": null}, {"modules": "pink_paint", "name": "pink_paint", "data": null},{"modules": "blue_geometric_lines", "name": "blue_geometric_lines", "data": null}, {"modules": "green_geometric_lines", "name": "green_geometric_lines", "data": null}, {"modules": "red_geometric_lines", "name": "red_geometric_lines", "data": null}, {"modules": "blue_helix_circle", "name": "blue_helix_circle", "data": null}, {"modules": "green_helix_circle", "name": "green_helix_circle", "data": null}, {"modules": "red_helix_circle", "name": "red_helix_circle", "data": null}, {"modules": "pink_70s_funk", "name": "pink_70s_funk", "data": null}, {"modules": "orange_70s_funk", "name": "orange_70s_funk", "data": null}, {"modules": "green_70s_funk", "name": "green_70s_funk", "data": null},{"modules": "green_coffee_stain", "name": "green_coffee_stain", "data": null}, {"modules": "orange_coffee_stain", "name": "orange_coffee_stain", "data": null}, {"modules": "purple_coffee_stain", "name": "purple_coffee_stain", "data": null}, {"modules": "green_wave", "name": "green_wave", "data": null}, {"modules": "orange_wave", "name": "orange_wave", "data": null}, {"modules":"purple_wave", "name": "purple_wave", "data": null}, {"modules": "green_pulse", "name": "green_pulse", "data": null}, {"modules": "pink_pulse", "name": "pink_pulse", "data": null}, {"modules": "purple_pulse", "name": "purple_pulse", "data": null}, {"modules": "blue_dotted_circle", "name": "blue_dotted_circle", "data": null}, {"modules": "green_dotted_circle", "name": "green_dotted_circle", "data": null}, {"modules": "orange_dotted_circle", "name": "orange_dotted_circle", "data": null}, {"modules": "blue_fast_circle", "name": "blue_fast_circle", "data": null}, {"modules": "grey_fast_circle", "name": "grey_fast_circle", "data": null}, {"modules": "red_fast_circle", "name": "red_fast_circle", "data": null}, {"modules": "blue_dotted_vortex", "name": "blue_dotted_vortex", "data": null}, {"modules": "green_dotted_vortex", "name": "green_dotted_vortex", "data": null}, {"modules": "red_dotted_vortex", "name": "red_dotted_vortex", "data": null}]

    const [searchText, setSearchText] = React.useState("")

    const [chosenBackground, setChosenBackground] = React.useState<BackgroundArray[]>([]);
    const [backgroundTab, setBackgroundTab] = React.useState(0);
    const [backgroundArray, setBackgroundArray] = useState<BackgroundArray[]>([]);
    const [profileBackgroundArray, setProfileBackgroundArray] = React.useState<BackgroundArray[]>([]);
    const [popupOpen, setPopupOpen] = React.useState(false);
    const [requestPopupOpen, setRequestPopupOpen] = React.useState(false);
    const [addFriendsPopupOpen, setAddFriendsPopupOpen] = React.useState(false);
    const [mutual, setMutual] = React.useState(false)

    const dispatch = useAppDispatch();

    const authState = useAppSelector(selectAuthState);


    const [userActivity, setUserActivity] = React.useState([])

    const [userData, setUserData] = React.useState(null)

    const [loading, setLoading] = React.useState(true)

    const [searchOptions, setSearchOptions] = React.useState<Post[]>([])

    const [unPubSearch, setUnPubSearch] = React.useState<Post[]>([])

    const [searchActive, setSearchActive] = React.useState(false)

    const [query, setQuery] = React.useState("")
    const debounceQuery = useDebounce(query, 500);

    const [published, setPublished] = React.useState(true)

    const [languages, setLanguages] = React.useState<number[]>([])

    const [challengeType, setChallengeType] = React.useState(-1)

    const [tierFilter, setTierFilter] = React.useState(-1)

    const [showPopup, setShowPopup] = React.useState(false)

    const [inventory, setInventory] = React.useState<Reward[]>([])
    const [userBackground, setUserBackground] = useState("")
    const [friendsList, setFriendsList] = React.useState([])
    const [requestList, setRequestList] = React.useState([])
    const [projectPage, setProjectPage] = React.useState(0)
    const [publishedBool, setPublishedBool] = React.useState(true)

    const [skip, setSkip] = React.useState(0)

    const router = useRouter();

    ReactGA.initialize("G-38KBFJZ6M6");

    const ShowButton = () => (
        <Button
            variant="contained"
            color="primary"
            onClick={() => freshSearch()}
            style={{width: "5px", height: "42px"}}
        >
            {<SearchIcon/>}
        </Button>
    )

    const userId = useAppSelector(selectAuthStateId);

    function daysInThisMonth() {
        let now = new Date();
        return new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
    }

    const getFriendsList = async () => {
        let friends = await fetch(
            `${config.rootPath}/api/friends/list`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: '{}',
                credentials: 'include'
            }
        ).then(async (response) => response.json())

        const [res] = await Promise.all([friends])
        setFriendsList(res["friends"])
    }

    const [currentXp, setCurrentXp] = React.useState(0)
    const [maxXp, setMaxXp] = React.useState(0)
    const [minXp, setMinXp] = React.useState(0)

    const getXP = async () => {
        let xp = await fetch(
            `${config.rootPath}/api/xp/getXP`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: '{}',
                credentials: 'include'
            }
        ).then(async (response) => response.json())

        const [res] = await Promise.all([xp])
        if (res !== undefined){
            setCurrentXp(res["current_xp"])
            setMaxXp(res["max_xp"])
            setMinXp(res["min_xp"])
        }
    }

    const freshSearch = async (paramOverrides: Object = {}) => {
        setSkip(0)
        stopScroll.current = false
        await getQueryProjects(true, paramOverrides)
        setSkip(32)
    }

    const scrollSearch = async () => {
        await getQueryProjects()
        setSkip(skip + 32)
    }

    const getRequestList = async () => {
        let friends = await fetch(
            `${config.rootPath}/api/friends/requestList`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: '{}',
                credentials: 'include'
            }
        ).then(async (response) => response.json())

        const [res] = await Promise.all([friends])
        setRequestList(res["requests"])

        res["requests"].map((row: { [x: string]: string; }) => (
            row["friend_name"].toLowerCase() === username.toLowerCase()
                ? setRequestPopupOpen(true) : setRequestPopupOpen(false)))
    }

    const acceptFriend = async (requesterId: any) => {
        let res = await fetch(
            `${config.rootPath}/api/friends/accept`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    requester_id: requesterId
                }),
                credentials: 'include'
            }
        ).then(async (response) => response.json())

        if (res["message"] !== "friend request accepted") {
            //@ts-ignore
            swal("An unexpected error has occurred", "We're sorry, we'll get right on that!", "error")
        } else if (res["message"] === "friend request accepted") {
            //@ts-ignore
            swal("Friend request accepted!", "", "success")
        }
    }

    const declineFriend = async (requesterId: any) => {
        let res = await fetch(
            `${config.rootPath}/api/friends/decline`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    requester_id: requesterId
                }),
                credentials: 'include'
            }
        ).then(async (response) => response.json())

        if (res["message"] !== "friend request declined") {
            //@ts-ignore
            swal("An unexpected error has occurred", "We're sorry, we'll get right on that!", "error")
        }
    }

    const getUserProjects = async () => {
        //todo check if maybe it should be formatted safer
        if (userData === null) {
            let user = await fetch(
                `${config.rootPath}/api/user/profilePage`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        author_id: userId
                    }),
                    credentials: 'include'
                }
            ).then(async (response) => response.json())

            const [res] = await Promise.all([
                user
            ])

            if (res === undefined) {
                swal("There has been an issue loading data. Please try again later.")
            }

            setUserData(res["user"])
            if (res["user"]["color_palette"] !== null && res["user"]["color_palette"]!== "null" && res["user"]["color_palette"]!== "" && res["user"]["color_palette"] !== "undefined" && res["user"]["color_palette"] !== undefined){
                fetch(`${config.rootPath}/static/ui/lottie/user_backgrounds/${res["user"]["color_palette"]}_${res["user"]["name"]}.json`, {credentials: 'include'})
                    .then(data => {
                        data.json().then(json => {
                            setUserBackground(json)
                        })
                    })
                    .catch(error => console.error(error));
            }
            // setUserBackground(res["user"]["color_palette"] + "_" + res["user"]["name"])
            setUserActivity(res["activity"])

        }
    }

    const fetchBackgroundData = async () => {
        let promises: Promise<any>[] = [];
        for (let i = 0; i < profileBackgroundArrayFull.length; i++){
            promises.push(
                fetch(`${config.rootPath}/static/ui/lottie/user_backgrounds/${profileBackgroundArrayFull[i]["name"]}.json`, {credentials: 'include'})
                .then(data => {
                    data.json().then(json => {
                        profileBackgroundArrayFull[i]["data"] = json
                    })
                })
                .catch(error => console.error(error))
            );
        }
        await Promise.all(promises)
        setProfileBackgroundArray(profileBackgroundArrayFull)
        setBackgroundArray(profileBackgroundArray.slice(0,3))
    }

    useEffect(() => {
        setLoading(true)
        getXP()
        getUserProjects().then()
        // infiniteScrollHandler().then()
        getFriendsList().then()
        getRequestList().then()
        fetchBackgroundData()
        setLoading(false)
    }, [])

    const [typeTab, setTypeTab] = React.useState("Published")

    const handleChange = async(event: React.SyntheticEvent, newValue: string) => {
        setTypeTab(newValue);
        newValue === "Published" ? setPublishedBool(true) : setPublishedBool(false)
        // setSearchOptions([])
        freshSearch({published: newValue === "Published"})
    };

    // let {id} = useParams();

    const getQueryProjects = async (fresh: boolean = false, paramOverrides: Object = {}) => {
        let params = {
            query: query,
            author: authState.id,
            published: publishedBool,
            skip: fresh ? 0 : skip,
            limit: 32,
        }

        if (languages !== undefined) {
            // @ts-ignore
            params["languages"] = languages
        }

        if (challengeType !== undefined && challengeType !== null && challengeType > -1) {
            // @ts-ignore
            params["challenge_type"] = challengeType
        }

        if (tierFilter !== undefined && tierFilter !== null && tierFilter > -1) {
            // @ts-ignore
            params["tier"] = tierFilter
        }

        // override params
        params = Object.assign(params, paramOverrides)

        let projects = await fetch(
            `${config.rootPath}/api/search/posts`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params),
                credentials: 'include'
            }
        ).then(async (response) => response.json())

        const [res] = await Promise.all([
            projects
        ])

        if (res === undefined || res["challenges"] === undefined) {
            swal("There has been an issue loading data. Please try again later.")
            return
        }

        if (res["challenges"].length < 32) {
            stopScroll.current = true
        }

        setSearchOptions(res["challenges"])
    }

    const stopScroll = React.useRef(false)

    // const [isFetching, setIsFetching] = useInfiniteScroll(infiniteScrollHandler, false, 1440, disableInfiniteScroll)
    const [isFetching, setIsFetching] = useInfiniteScroll(scrollSearch, true, 1440, stopScroll)
    useEffect(() => {
        if (debounceQuery) {
            freshSearch()
        }
    }, [debounceQuery]);


    const SearchBox = () => {
        let elements = searchOptions.sort((a: Post, b: Post) => {
            const dateA: Date = new Date(a["updated_at"]);
            const dateB: Date = new Date(b["updated_at"]);
            // @ts-ignore
            return dateB - dateA;
        }).map((project) => {
            return (
                <Grid item key={project._id}>
                    <div style={!isMobile ? {
                        display: "flex",
                        transform: `scale(${scaleFactor})`,
                        marginLeft: sidebarOpen ? "-19%" : 0,
                        marginRight: chatOpened ? "0%" : 0,
                        padding: (sidebarOpen || chatOpened) ? '0px' : '20px',
                    } : {
                        display: "flex",
                        transform: `scale(${scaleFactor})`,
                        marginLeft: sidebarOpen ? "-19%" : 0,
                        marginRight: chatOpened ? "0%" : 0,
                        padding: (sidebarOpen || chatOpened) ? '0px' : '20px',
                        width: "90vw"
                    }}>
                        <ProjectCard
                            projectId={project["_id"]}
                            width={window.innerWidth < 1000 ? 'fit-content' : "20vw"}
                            projectTitle={project["title"]}
                            projectDesc={project["description"]}
                            projectThumb={config.rootPath + project["thumbnail"]}
                            projectDate={project["updated_at"]}
                            projectType={project["post_type_string"]}
                            renown={project["tier"]}
                            onClick={() => router.push("/challenge/" + project["_id"])}
                            userTier={authState.tier}
                            userThumb={config.rootPath + "/static/user/pfp/" + authState.id}
                            userId={authState.id}
                            username={authState.userName}
                            backgroundName={authState.backgroundName}
                            backgroundPalette={authState.backgroundColor}
                            backgroundRender={authState.backgroundRenderInFront}
                            exclusive={project["challenge_cost"] !== null}
                            hover={false}
                            role={authState.role}
                        />
                    </div>
                </Grid>
            )
        })

        if (isFetching) {
            elements.push((
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
            ))
        }

        return (
            <>
                {elements.map((element, index) => (
                    <React.Fragment key={element.props.projectId}>
                        {element}
                    </React.Fragment>
                ))}
            </>
        )
    }



    let minorValues = ["Published", "Unpublished"]


    const handleChanges = (event: React.SyntheticEvent, newValue: number) => {
        switch(newValue){
            case 0 : {
                setBackgroundArray([])
                setBackgroundTab(0)
                setChosenBackground([])
                break
            }
            case 1 : {
                setBackgroundArray(profileBackgroundArray.slice(3,6))
                setBackgroundTab(1)
                break
            }
            case 2 : {
                setBackgroundArray(profileBackgroundArray.slice(6,9))
                setBackgroundTab(2)
                break
            }
            case 3 : {
                setBackgroundArray(profileBackgroundArray.slice(9,12))
                setBackgroundTab(3)
                break
            }
            case 4 : {
                setBackgroundArray(profileBackgroundArray.slice(12,15))
                setBackgroundTab(4)
                break
            }
            case 5 : {
                setBackgroundArray(profileBackgroundArray.slice(15,18))
                setBackgroundTab(5)
                break
            }
            case 6 : {
                setBackgroundArray(profileBackgroundArray.slice(18,21))
                setBackgroundTab(6)
                break
            }
            case 7 : {
                setBackgroundArray(profileBackgroundArray.slice(21,24))
                setBackgroundTab(7)
                break
            }
            case 8 : {
                setBackgroundArray(profileBackgroundArray.slice(24,27))
                setBackgroundTab(8)
                break
            }
            case 9 : {
                setBackgroundArray(profileBackgroundArray.slice(27,30))
                setBackgroundTab(9)
                break
            }
            case 10 : {
                setBackgroundArray(profileBackgroundArray.slice(0,3))
                setBackgroundTab(10)
                break
            }
        }
    };


    const submitBackgroundChange = async (background: BackgroundArray[] | null) => {
        if (background === null) {
            setUserBackground("");
            setShowPopup(false);
            let authState = { ...initialAuthStateUpdate };
            authState.backgroundColor = "null";
            authState.backgroundName = "null";
            dispatch(updateAuthState(authState));
        } else {
            const currentBackground = background[0];
            setUserBackground(currentBackground.data);
            setShowPopup(false);
            let authState = { ...initialAuthStateUpdate };

            const nameParts = currentBackground.name.split("_");
            authState.backgroundColor = nameParts[0];

            if (nameParts.length > 2) {
                authState.backgroundName = nameParts[1] + "_" + nameParts[2];
            } else {
                authState.backgroundName = nameParts[1];
            }

            dispatch(updateAuthState(authState));
        }
    };

    const getUserBackgroundInventory = async () => {
        if (inventory.length === 0) {
            let inventoryData = await fetch(
                `${config.rootPath}/api/reward/getUserRewardInventory`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: '{}',
                    credentials: 'include'
                }
            ).then(async (response) => response.json())

            const [res] = await Promise.all([
                inventoryData
            ])

            if (res === undefined) {
                swal("There has been an issue loading data. Please try again later.")
            }

            let finalRewards = []

            if (res["rewards"]!== undefined){
                for (let i = 0; i < res["rewards"].length; i++){
                    finalRewards.push({
                        "id": res["rewards"][i]["id"],
                        "render_in_front": res["rewards"][i]["render_in_front"],
                        "full_name" : res["rewards"][i]["color_palette"] + "_" + res["rewards"][i]["name"],
                    })
                }
            }

            setInventory(finalRewards)

        }
        setShowPopup(true)
    }

    const sendFriendRequest = async (friendId: any) => {
        let friend = await fetch(
            `${config.rootPath}/api/friends/request`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    friend_id: friendId
                }),
                credentials: 'include'
            }
        ).then(async (response) => response.json())

        const [res] = await Promise.all([
            friend
        ]);

        // Handle different cases based on the response
        if (res["message"] === "mutual request") {
            setMutual(true);
        } else if (res["message"] === "already friends") {
            //@ts-ignore
            swal("You are already friends!");
        } else if (res["message"] === "pending request") {
            //@ts-ignore
            swal("Friend request already sent", "", "info");
        } else if (res["message"] === "friend request sent") {
            //@ts-ignore
            swal("Your friend request has been sent!", "", "success");
        }
    }



    const handleAddFriends = () => {
        setAddFriendsPopupOpen(true);
    }

    const friendList = () => {
        return (
            <>
                <DialogTitle style={{width: "100%", display: "flex", flexDirection: "row"}}>
                    <Tooltip title="Go Back" placement="top">
                        <Button
                            onClick={() => {
                                setPopupOpen(false);
                            }}
                            sx={!isMobile ?{
                                marginRight: "16px",
                                width: "16px",
                                height: "28px"
                            } : {
                                marginRight: "4px",
                                width: "8px",
                                height: "28px"
                            }}
                        >
                            <ArrowBackIcon style={{ fontSize: 36 }} />
                        </Button>
                    </Tooltip>
                    <div style={!isMobile ? {} : {width: "100%"}}>
                        Friends List
                    </div>
                    <Tooltip title="Add Friends" placement="top">
                        <Button
                            onClick={() => {
                                handleAddFriends();
                            }}
                            sx={!isMobile ? {
                                marginLeft: "16px",
                                width: "16px",
                                height: "28px"
                            } : {
                                marginLeft: "4px",
                                width: "8px",
                                height: "28px"
                            }}
                        >
                            <AddIcon style={{ fontSize: 36 }} />
                        </Button>
                    </Tooltip>
                </DialogTitle>
                <DialogContent>
                    <List>
                        {friendsList.length > 0 ? (
                            friendsList.map((row) => (
                                <ListItem button onClick={() => router.push("/user/" + row["friend"])} key={row["friend"]}>
                                    <Tooltip title={"Since " + new Date(row["date"]).toLocaleString("en-us", {day: '2-digit', month: 'short', year: 'numeric'})}>
                                        <ListItemAvatar>
                                            <UserIcon
                                                userTier={"n/a"}
                                                userThumb={config.rootPath + "/static/user/pfp/" + row["friend"]}
                                                userId={row["friend"]}
                                                backgroundName={null}
                                                backgroundPalette={null}
                                                backgroundRender={null}
                                                size={50}
                                            />
                                        </ListItemAvatar>
                                    </Tooltip>
                                    <ListItemText primary={row["friend_name"]} />
                                </ListItem>
                            ))
                        ) : (
                            <Typography align="center">You have no friends yet.</Typography>
                        )}
                    </List>
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center' }}>
                    <Button onClick={() => {
                        setRequestPopupOpen(true);
                        setPopupOpen(false);
                    }} color="primary">
                        Friend Requests
                    </Button>
                </DialogActions>
            </>
        );
    };

    const AddFriendsPopup = () => {
        const [searchQuery, setSearchQuery] = useState("");
        const [searchResults, setSearchResults] = useState([]);

        const handleClose = () => {
            setAddFriendsPopupOpen(false); // Close the Add Friends popup
        };

        // Assume sendFriendRequest takes a friend_id parameter
        const handleAddFriend = async (friendId: any) => {
            await sendFriendRequest(friendId);
        };

        const handleSearch = async (e: { target: { value: React.SetStateAction<string>; }; }) => {
            if (typeof e.target.value !== "string") {
                return;
            }

            setSearchQuery(e.target.value);

            let res = await fetch(
                `${config.rootPath}/api/search/users`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        query: e.target.value,
                        skip: 0,
                        limit: 5,
                    }),
                    credentials: 'include'
                }
            ).then(async (response) => response.json())

            // Handle server responses similar to handleAuthorSearch
            if (res === undefined) {
                // Handle undefined result
                return;
            }

            if (res["users"] !== undefined) {
                setSearchResults(res["users"]);
            }
        };

        return (
            <>
                <DialogTitle style={{ textAlign: 'center', position: 'relative' }}>
                    Add Friends
                    <Tooltip title="Close" placement="top" style={{ position: 'absolute', right: '8px', top: '8px', zIndex: 1 }}>
                        <Button onClick={handleClose}>
                            <CloseIcon />
                        </Button>
                    </Tooltip>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="Search for User"
                        fullWidth
                        variant="outlined"
                        value={searchQuery}
                        onChange={handleSearch}
                        style={!isMobile ? { marginBottom: "16px", marginTop: "1%" } : { marginBottom: "16px", marginTop: "2%" }}
                    />
                    <List>
                        {searchResults.length > 0 ? (
                            searchResults.map((row: any) => (
                                <ListItem key={row["_id"]} button style={!isMobile ? { display: 'flex', justifyContent: 'center', alignItems: 'center' } : { display: 'flex', justifyContent: 'start', alignItems: 'center', width: "75vw" }}>
                                    <ListItemAvatar>
                                        <UserIcon
                                            userTier={row["user_status_string"]}
                                            userThumb={config.rootPath + row["pfp_path"]}
                                            userId={row["_id"]}
                                            backgroundName={null}
                                            backgroundPalette={null}
                                            backgroundRender={null}
                                            size={50}
                                        />
                                    </ListItemAvatar>
                                    {!isMobile ? (
                                        <ListItemText primary={row["user_name"]} />
                                    ) : (
                                        <ListItemText primary={row["user_name"].length > 8 ? row["user_name"].slice(0,5) + "..." : row["user_name"]} />
                                    )}
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <Tooltip title="Send Friend Request" placement="top">
                                            <Button
                                                onClick={() => handleAddFriend(row["_id"])}
                                                color="primary"
                                                style={{ minWidth: '50px', minHeight: '50px' }}
                                            >
                                                <AddIcon fontSize="large" />
                                            </Button>
                                        </Tooltip>
                                    </div>
                                </ListItem>
                            ))
                        ) : (
                            <Typography align="center">No results found.</Typography>
                        )}
                    </List>
                </DialogContent>
            </>
        );
    };

    const friendRequests = () => {
        const handleDeleteRow = (id: number) => {
            setRequestList((prevRows) => prevRows.filter((row) => row["_id"] !== id));
        };
        return (
            <Box style={{ justifyContent: "center", display: "flex", flexDirection: "column", alignItems: "center", padding: "40px", position: "relative", overflow: "visible", height: "100%", width: "100%" }}>
                <TableContainer component={Paper} style={{opacity: 1}} className={'check'}>
                    <Table sx={{ minWidth: 650 }} aria-label="caption table">
                        <TableHead style={{ backgroundColor: "#2b8761" }}>
                            <TableRow>
                                <TableCell>Friend Requests</TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {requestList.map((row: any) => (
                                <TableRow key={row["_id"]}>
                                    <TableCell component="th" scope="row">
                                        {row["user_name"].toLowerCase() === username.toLowerCase()
                                            ? row["friend_name"]
                                            : row["user_name"]}
                                    </TableCell>
                                    <TableCell align="right">
                                        {row["user_name"].toLowerCase() === username.toLowerCase()
                                            ?
                                            <>
                                                <Button variant="contained" disabled={true}>
                                                    Sent
                                                </Button>
                                            </>
                                            :
                                            <>
                                                <Button variant="contained" color={"primary"}
                                                        onClick={() => {
                                                            acceptFriend(row["user_id"])
                                                            handleDeleteRow(row["_id"])
                                                        }}>
                                                    Accept
                                                </Button>
                                                <Button variant="contained" color={"error"}
                                                        onClick={() => {
                                                            declineFriend(row["user_id"])
                                                            handleDeleteRow(row["_id"])
                                                        }}>
                                                    Decline
                                                </Button>
                                            </>
                                        }
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        )
    }

    const closeBackgroundPopup = () => {
        setBackgroundArray(profileBackgroundArray.slice(0,3))
        setBackgroundTab(0)
        setShowPopup(false)
    }

    let renownImg;
    let levelImg;
    let barColor;
     
    let userLvl = 0

    if (userData !== undefined && userData !== null) {
        userLvl = userData["tier"]
    }

    switch(userLvl){
        case 0:
            renownImg = renown1;
            levelImg = r1Lvl;
            barColor ="linear-gradient(90deg, rgba(4,100,62,1) 25%, rgba(60,193,140,1) 100%)"
            break;
        case 1:
            renownImg = renown2;
            levelImg = r2Lvl;
            barColor ="linear-gradient(90deg, rgba(19,131,134,1) 25%, rgba(60,190,193,1) 100%)"
            break;
        case 2:
            renownImg = renown3;
            levelImg = r3Lvl;
            barColor ="linear-gradient(90deg, rgba(9,77,133,1) 25%, rgba(60,133,193,1) 100%)"
            break;
        case 3:
            renownImg = renown4;
            levelImg = r4Lvl;
            barColor ="linear-gradient(90deg, rgba(41,31,155,1) 25%, rgba(70,60,193,1) 100%)"
            break;
        case 4:
            renownImg = renown5;
            levelImg = r5Lvl;
            barColor ="linear-gradient(90deg, rgba(92,29,143,1) 25%, rgba(134,60,193,1) 100%)"
            break;
        case 5:
            renownImg = renown6;
            levelImg = r6Lvl;
            barColor ="linear-gradient(90deg, rgba(121,16,110,1) 25%, rgba(193,60,178,1) 100%)"
            break;
        case 6:
            renownImg = renown7;
            levelImg = r7Lvl;
            barColor ="linear-gradient(90deg, rgba(138,34,37,1) 25%, rgba(193,60,64,1) 100%)"
            break;
        case 7:
            renownImg = renown8;
            levelImg = r8Lvl;
            barColor ="linear-gradient(90deg, rgba(147,69,31,1) 25%, rgba(193,103,60,1) 100%)"
            break;
        case 8:
            renownImg = renown9;
            levelImg = r9Lvl;
            barColor ="linear-gradient(90deg, rgba(132,101,18,1) 25%, rgba(193,157,60,1) 100%)"
            break;
        case 9:
            renownImg = renown10;
            levelImg = r10Lvl;
            barColor ="linear-gradient(90deg, rgba(51,51,51,1) 25%, rgba(129,99,18,1) 100%)"
            break;
        default:
            renownImg = renown10;
            levelImg = r10Lvl;
            barColor ="linear-gradient(90deg, rgba(51,51,51,1) 25%, rgba(129,99,18,1) 100%)"
            break;

    }

    const [marginTop, setMarginTop] = useState(0);
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    const scaleFactor = sidebarOpen ? 0.85 : (chatOpened ? 0.80 : 1.0);

    // Calculate and update margin when sidebar or content changes
    useEffect(() => {
        if (containerRef.current) {
            const height = containerRef.current.offsetHeight;
            const offset = (1 - scaleFactor) * height / 2;
            setMarginTop(-offset);
        }
    }, [sidebarOpen, chatOpened, scaleFactor, searchOptions]);

    useEffect(() => {
        const updateMargin = () => {
            if (containerRef.current) {
                const height = containerRef.current.offsetHeight;
                const offset = (1 - scaleFactor) * height / 2;
                setMarginTop(-offset);
            }
        };

        // Schedule the update to happen on the next animation frame
        const frameId = requestAnimationFrame(updateMargin);

        // Clean up
        return () => cancelAnimationFrame(frameId);
    }, [sidebarOpen, chatOpened, scaleFactor, searchOptions]);

    const editBackgroundModal = () => {
        return(
            <Modal
                open={showPopup}
                onClose={() => closeBackgroundPopup()}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div style={{display: "flex", width: "60vw", height: "60vh", alignItems: "center", justifyContent: "center"}}>
                    <Box
                        sx={{
                            boxShadow: "0px 6px 3px -3px rgba(0,0,0,0.3),0px 3px 3px 0px rgba(0,0,0,0.3),0px 3px 9px 0px rgba(0,0,0,0.3)",
                            color: 'text.primary',
                            borderRadius: 1,
                            width: "60vw",
                            minHeight: "550px",
                            height: "60vh",
                            backgroundColor: theme.palette.background.default,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "start",
                            alignItems: "center",
                            transform: "translate(30%, 30%)"
                        }}
                    >
                        <IconButton
                            aria-label="close"
                            onClick={() => closeBackgroundPopup()}
                            color="primary"
                            style={{position: 'absolute', top: "1%", right: "1%", zIndex: 10}}
                        >
                            <CloseIcon/>
                        </IconButton>
                        <div style={{height: "90%", overflowY: "hidden", paddingRight: "20px"}}>
                            <Tabs
                                orientation="vertical"
                                variant="scrollable"
                                value={backgroundTab}
                                onChange={handleChanges}
                                aria-label="Vertical tabs example"
                                sx={{
                                    borderRight: 1,
                                    borderColor: 'divider',
                                    height: "100%",
                                    overflowY: "auto"
                                }}
                            >
                                <Tab label="None"/>
                                <Tab label="Geometric"/>
                                <Tab label="Helix"/>
                                <Tab label="70s Funk"/>
                                <Tab label="Coffee Stain"/>
                                <Tab label="Wave"/>
                                <Tab label="Pulse"/>
                                <Tab label="Dotted Circle"/>
                                <Tab label="Fast Circle"/>
                                <Tab label="Dotted Vortex"/>
                                <Tab label="Paint"/>
                            </Tabs>
                        </div>
                        <div style={{
                            height: "90%",
                            width: "30%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                            padding: "10px"
                        }}>
                            {backgroundArray.map((background, index) => {
                                let personalInventory = inventory.filter(e => e.full_name === background["name"])
                                return (
                                    <div key={index} style={{padding: "10px"}}>
                                        {personalInventory.length === 0 ? (
                                            <div style={{width: "100px", height: "100px", position: "relative", zIndex: 9}}>
                                                <div style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.3}}>
                                                    <Button disabled={true}>
                                                        <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                                            <Lottie options={
                                                                {loop: true,
                                                                    autoplay: true,
                                                                    animationData: background["data"],
                                                                    rendererSettings: {
                                                                        preserveAspectRatio: 'xMidYMid slice'
                                                                    }
                                                                }} width={100}
                                                                    height={100} isClickToPauseDisabled={true}/>
                                                        </div>
                                                    </Button>
                                                </div>
                                                <div style={{zIndex: 10, width: "100px", height: "100px", position: "absolute", top: 40, left: 45}}>
                                                    <LockIcon/>
                                                </div>
                                            </div>
                                        ) : (
                                            <Button onClick={() => setChosenBackground([
                                                {
                                                    modules: background["modules"],
                                                    id: personalInventory[0]["id"],
                                                    name: background["name"],
                                                    data: background["data"],
                                                }
                                            ])} disabled={false}>
                                                <div style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }}>
                                                    <Lottie options={
                                                        {
                                                            loop: true,
                                                            autoplay: true,
                                                            animationData: background["data"],
                                                            rendererSettings: {
                                                                preserveAspectRatio: 'xMidYMid slice'
                                                            }
                                                        }} width={100}
                                                            height={100}
                                                            isClickToPauseDisabled={true}
                                                    />
                                                </div>
                                            </Button>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                position: 'relative',
                            }}
                        >
                            <div
                                style={{
                                    position: 'relative',
                                    zIndex: 1,
                                }}
                            >
                                <UserIcon
                                    userId={authState.id}
                                    userTier={authState.tier}
                                    userThumb={userData === null ? "" : config.rootPath + userData["pfp_path"]}
                                    size={300}
                                    backgroundName={null}
                                    backgroundPalette={null}
                                    backgroundRender={null}
                                    profileButton={false}
                                    pro={authState.role > 0}
                                    mouseMove={false}
                                />
                            </div>
                            {chosenBackground.length !== 0 && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        width: 575,
                                        height: 575,
                                        zIndex: 2,
                                    }}
                                >
                                    <Lottie
                                        options={{
                                            loop: true,
                                            autoplay: true,
                                            animationData: chosenBackground[0]["data"],
                                            rendererSettings: {
                                                preserveAspectRatio: 'xMidYMid slice',
                                            },
                                        }}
                                        isClickToPauseDisabled={true}
                                    />
                                </div>
                            )}
                        </div>
                        <div style={{position: 'absolute', bottom: "1%", right: "1%", zIndex: 10}}>
                            <Button onClick={() => submitBackgroundChange(chosenBackground)}>Submit</Button>
                        </div>
                    </Box>
                </div>
            </Modal>
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline>
                {userData !== null ? (
                    <HelmetProvider>
                        <Helmet>
                            <title>{userData["user_name"]}</title>
                            <meta property="og:title" content={userData["user_name"]} data-rh="true"/>
                            <meta property="og:image" content={config.rootPath + userData["pfp_path"]} data-rh="true"/>
                        </Helmet>
                    </HelmetProvider>
                ) : (
                    <HelmetProvider>
                        <Helmet>
                            <title>User</title>
                            <meta property="og:image" content={"image not found"} data-rh="true"/>
                        </Helmet>
                    </HelmetProvider>
                )}
                {/*<AppWrapper/>*/}
                {loading ? (
                    <div>
                        <ThreeDots/>
                    </div>
                ) : (
                    <div>
                        <Typography sx={{
                            display: "flex",
                            flexDirection: "row",
                            position: "relative",
                            transform: `scale(${scaleFactor})`,
                            marginLeft: sidebarOpen ? "-9%" : 0,
                            marginRight: chatOpened ? "65%" : 0
                        }}>
                            <Typography sx={{display: "flex", flexDirection: "column", width: "20vw", position:"sticky" }}>
                                {!isMobile ? (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'left',
                                            justifyContent: 'left',
                                            paddingTop: `1%`,
                                            paddingLeft: `25px`,
                                            height: "400px"
                                        }}
                                    >
                                        <UserIcon
                                            userId={authState.id}
                                            userTier={authState.tier}
                                            userThumb={userData === null ? "" : config.rootPath + userData["pfp_path"]}
                                            size={300}
                                            backgroundName={authState.backgroundName}
                                            backgroundPalette={authState.backgroundColor}
                                            backgroundRender={authState.backgroundRenderInFront}
                                            profileButton={false}
                                            pro={authState.role > 0}
                                            mouseMove={false}
                                        />
                                    </Box>
                                ) : (
                                    <Box style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        height: "auto",
                                        width: "100vw",
                                        flexDirection: "column",
                                        marginBottom: "25px",
                                        marginTop: "10%"
                                    }}>
                                        <UserIcon
                                            userId={authState.id}
                                            userTier={authState.tier}
                                            userThumb={userData === null ? "" : config.rootPath + userData["pfp_path"]}
                                            size={185}
                                            backgroundName={authState.backgroundName}
                                            backgroundPalette={authState.backgroundColor}
                                            backgroundRender={authState.backgroundRenderInFront}
                                            profileButton={false}
                                            pro={authState.role > 0}
                                            mouseMove={false}
                                        />
                                        <Typography variant={"h4"} style={{
                                            marginTop: "10px",
                                        }}>
                                            {username.charAt(0).toUpperCase() + username.slice(1).toLowerCase()}
                                        </Typography>
                                    </Box>
                                )}
                                {window.innerWidth <= 1000 ? (
                                    <div style={{
                                        width: "100%",
                                        height: "15%",
                                        display: "flex",
                                        justifyContent: "center",
                                        position: "relative",
                                        marginTop: "-10%",
                                        marginBottom: "45%",
                                        marginLeft: "200%",
                                    }}>
                                        <Button
                                            onClick={() => setPopupOpen(true)}
                                            variant="contained"
                                            sx={{
                                                color: theme.palette.text.primary,
                                                borderRadius: 1,
                                                p: 1,
                                                backgroundColor: "secondary",
                                            }}
                                        >
                                            Friends
                                        </Button>
                                    </div>
                                ) : null}
                                {window.innerWidth <= 1000 ? (
                                    <div style={{marginBottom: "20px"}}>
                                        <Grid item style={{display: "flex", flexDirection: "row", paddingLeft: "100%", width: "100vw"}}>
                                            <Image
                                                alt="renown"
                                                style={!isMobile ? {
                                                    height: "20vh",
                                                    width: "auto",
                                                    overflow: "hidden",
                                                } : {
                                                    height: "60px",
                                                    overflow: "hidden",
                                                }}
                                                src={renownImg}
                                            />
                                            <Box display="flex" flexDirection="column" alignItems="left" marginLeft={"25px"}>
                                                <Typography variant="h4" sx={{transform: "translate(-1.5vw, 0)", fontSize: "24px"}}>
                                                    {`Renown ${userData === null ? "N/A" : userData["tier"] + 1}`}
                                                </Typography>
                                                <Typography sx={{paddingRight: "10px", fontSize: "10px"}} variant="h6">{`${currentXp} / ${maxXp} XP`}</Typography>
                                            </Box>
                                        </Grid>
                                        <div style={{display: "flex", width: "100vw", paddingTop: "-50px", position: "relative", paddingLeft: "30%"}}>
                                            <Box sx={{ flexGrow: 1, alignItems: 'flex-end', display: 'flex', zIndex: 2, justifyContent: "start", marginLeft: "20%"}}>
                                                <ProgressBar
                                                    padding={"10px"}
                                                    completed={(currentXp - minXp) / (maxXp - minXp) * 100}
                                                    customLabel={" "}
                                                    width={"90vw"}
                                                    height={"1vw"}
                                                    borderRadius={"0px"}
                                                    animateOnRender={true}
                                                    barContainerClassName={"container"}
                                                    bgColor={barColor}
                                                />
                                                <Grid item sx={{transform: "translate(-5vw, 3vh)", zIndex: 1}}>
                                                    <Box position="relative">
                                                        <Image
                                                            alt="level"
                                                            style={{
                                                                height: "45px",
                                                                width: "auto",
                                                                overflow: "hidden",
                                                            }}
                                                            src={levelImg}
                                                        />
                                                        <Typography
                                                            variant="h6"
                                                            component="span"
                                                            style={{
                                                                color: "white",
                                                                position: "absolute",
                                                                top: "45%",
                                                                left: "50%",
                                                                transform: "translate(-50%, -50%)",
                                                            }}
                                                        >
                                                            {userData === null ? "N/A" : userData["level"] + 1}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            </Box>
                                        </div>
                                    </div>
                                ) : null}
                                {editBackgroundModal()}
                                <div style={{height: "10px"}}/>
                                {!isMobile ? (
                                    <Box
                                        sx={{
                                            boxShadow: "0px 6px 3px -3px rgba(0,0,0,0.3),0px 3px 3px 0px rgba(0,0,0,0.3),0px 3px 9px 0px rgba(0,0,0,0.3)",
                                            color: 'text.primary',
                                            borderRadius: 1,
                                            p: 3,
                                            marginLeft: "120px"
                                        }}
                                    >
                                        <div style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}>
                                            <Typography sx={{
                                                display: 'flex',
                                                width: "100%",
                                                justifyContent: 'left',
                                                textSizeAdjust: "150%"
                                            }}>
                                                {username.charAt(0).toUpperCase() + username.slice(1).toLowerCase()}
                                            </Typography>
                                            <Typography sx={{
                                                display: 'flex',
                                                width: "100%", justifyContent: "left"
                                            }}>
                                                {userData !== null ? userData["follower_count"] + " Subscribers" : "n/A"}
                                            </Typography>
                                        </div>
                                        <hr style={{color: "white"}}/>
                                        {userData !== null ? userData["bio"] : "N/A"}
                                    </Box>
                                ) : (
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        width: "100vw",
                                        marginTop: "50px",
                                        paddingLeft: "5%",
                                        paddingRight: "5%"
                                    }}>
                                        <Box
                                            sx={{
                                                color: 'text.primary',
                                                borderRadius: 1,
                                                p: 3,
                                                width: "fit-content",
                                                justifyContent: "left",
                                                paddingLeft: "5%"
                                            }}
                                        >
                                            <Typography sx={window.innerWidth <= 1000 && window.innerWidth > 300 ? {
                                                display: 'flex',
                                                width: "130px",
                                                justifyContent: "left",
                                                fontSize: "16px",
                                                marginLeft: "10px"
                                            } : {
                                                display: 'flex',
                                                width: "130px", justifyContent: "left", fontSize: "12px"
                                            }}>
                                                {userData !== null ? userData["follower_count"] + " Subscribers" : "n/A"}
                                            </Typography>
                                        </Box>
                                        <div style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "right",
                                            width: "100%",
                                            marginRight: "5px"
                                        }}>
                                            <div style={{position: 'relative'}}>
                                                <Image
                                                    alt="coffee-pot"
                                                    style={!isMobile ? {
                                                        height: "15vh",
                                                        width: "auto",
                                                        overflow: "hidden",
                                                        zIndex: 2
                                                    } : {
                                                        height: "50px",
                                                        width: "auto",
                                                        overflow: "hidden",
                                                        zIndex: 2,
                                                        transform: "translate(0, -30%)",
                                                        marginRight: "5px"
                                                    }}
                                                    src={coffeePot}
                                                />
                                                <div
                                                    style={{
                                                        color: "white",
                                                        position: "absolute",
                                                        top: "50%",
                                                        left: "50%",
                                                        transform: "translate(-35%, -90%)",
                                                        zIndex: 2,
                                                    }}
                                                >
                                                    {userData === null ? "N/A" : userData["coffee"]}
                                                </div>
                                            </div>
                                            <div
                                                style={window.innerWidth <= 1000 && window.innerWidth > 300 ? {
                                                    color: "white",
                                                    fontSize: "16px", marginRight: "10px"
                                                } : {
                                                    color: "white",
                                                    fontSize: "12px"
                                                }}
                                            >
                                                Coffee
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {!isMobile ? (
                                    <div style={{width: "100%", alignItems: "center", display: "flex", flexDirection: "row", paddingTop: "10px", marginLeft: "40px"}}>
                                        <Button
                                            onClick={() => setPopupOpen(true)}
                                            variant="contained"
                                            sx={{
                                                color: theme.palette.text.primary,
                                                borderRadius: 1,
                                                p: 1,
                                                marginLeft: "30px",
                                                backgroundColor: "secondary",
                                                width: "100%",
                                                height: "80%",
                                                minWidth: "120px"
                                            }}
                                        >
                                            Friends
                                        </Button>
                                        <Button
                                            onClick={() => getUserBackgroundInventory()}
                                            variant={"contained"}
                                            sx={{
                                                color: theme.palette.text.primary,
                                                borderRadius: 1,
                                                p: 1,
                                                marginLeft: "30px",
                                                backgroundColor: "secondary",
                                                width: "100%",
                                                height: "80%",
                                                minWidth: "120px"
                                            }}
                                        >
                                            Edit Background
                                        </Button>
                                    </div>
                                ) : null}
                            </Typography>
                            {!isMobile ? (
                                <Box
                                    sx={{
                                        display: `flex`,
                                        alignItems: `center`,
                                        justifyContent: "right",
                                        width: "80%",
                                        flexDirection: "column",
                                        float: "right",
                                        marginLeft: "11%",
                                        transform: chatOpened ? `scale(1.05)` : 0,
                                    }}>
                                    <Grid container spacing={2} width={"105.6%"} sx={{
                                        paddingTop: "3.6%",
                                        marginLeft: chatOpened ? "25%" : "0%",
                                    }}>
                                        <Grid item>
                                            <Image
                                                alt="renown"
                                                style={{
                                                    height: "26vh",  // 20vh * 1.2
                                                    width: "auto",
                                                    overflow: "hidden",
                                                }}
                                                src={renownImg}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                                <Box display="flex" flexDirection="column" alignItems="left">
                                                    { chatOpened ? (
                                                        <Typography
                                                            variant="h4"
                                                            sx={{
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                alignItems: 'center',
                                                                transform: "scale(0.85) translate(-1.5vw, 0)"
                                                            }}
                                                        >
                                                            <span>Renown</span>
                                                            <span>{userData === null ? "N/A" : (userData["tier"] + 1)}</span>
                                                        </Typography>
                                                    ) : (
                                                        <Typography variant="h4" sx={{transform: "translate(-1.5vw, 0)"}}>
                                                            {`Renown ${userData === null ? "N/A" : userData["tier"] + 1}`}
                                                        </Typography>
                                                    )}
                                                    <div style={{ display: 'flex', alignItems: 'left' }}>
                                                        <Typography sx={{paddingRight: "10px"}} variant="h5">Level</Typography>
                                                        <Grid item sx={{zIndex: 1}}>
                                                            <Box position="relative" sx={{transform: "translate(0px, -0.8vh)"}}>
                                                                <Image
                                                                    alt="level"
                                                                    style={{
                                                                        height: "6vh",
                                                                        width: "auto",
                                                                        overflow: "hidden",
                                                                    }}
                                                                    src={levelImg}
                                                                />
                                                                <Typography
                                                                    variant="h6"
                                                                    component="span"
                                                                    style={{
                                                                        color: "white",
                                                                        position: "absolute",
                                                                        top: "45%",
                                                                        left: "50%",
                                                                        transform: "translate(-50%, -50%)",
                                                                    }}
                                                                >
                                                                    {userData === null ? "N/A" : userData["level"] + 1}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                    </div>
                                                    <Typography sx={{paddingRight: "10px"}} variant="h6">{`${currentXp} / ${maxXp} XP`}</Typography>
                                                </Box>
                                                <Box sx={{ flexGrow: 1, alignItems: 'flex-end', display: 'flex', zIndex: 2}}>
                                                    <ProgressBar
                                                        padding={"10px"}
                                                        completed={(currentXp - minXp) / (maxXp - minXp) * 100}
                                                        customLabel={" "}
                                                        width={"50%"}
                                                        height={"1vw"}
                                                        borderRadius={"0px"}
                                                        animateOnRender={true}
                                                        barContainerClassName={"container"}
                                                        bgColor={barColor}
                                                    />
                                                    <Grid item sx={{transform: "translate(-5vw, 3vh)", zIndex: 1}}>
                                                        <Box position="relative">
                                                            <Image
                                                                alt=""
                                                                style={{
                                                                    height: "7vh",
                                                                    width: "auto",
                                                                    overflow: "hidden",
                                                                }}
                                                                src={levelImg}
                                                            />
                                                            <Typography
                                                                variant="h6"
                                                                component="span"
                                                                style={{
                                                                    color: "white",
                                                                    position: "absolute",
                                                                    top: "45%",
                                                                    left: "50%",
                                                                    transform: "translate(-50%, -50%)",
                                                                }}
                                                            >
                                                                {userData === null ? "N/A" : userData["level"] + 1}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item sx={{transform: "translate(-13vw, -21vh)", zIndex: 1}}>

                                                        <Box position="absolute">
                                                            <Image
                                                                alt="coffee-pot"
                                                                style={{
                                                                    height: "15vh",
                                                                    width: "auto",
                                                                    overflow: "hidden",
                                                                    zIndex: 2
                                                                }}
                                                                src={coffeePot}
                                                            />
                                                            <Typography
                                                                variant="h5"
                                                                component="span"
                                                                style={{
                                                                    color: "white",
                                                                    position: "absolute",
                                                                    top: "75%",
                                                                    left: "-50%",
                                                                    transform: "translate(-50%, -50%)",
                                                                    zIndex: 2,
                                                                    width: "200%",
                                                                }}
                                                            >
                                                                Coffee Collected
                                                            </Typography>
                                                            <Typography
                                                                variant="h5"
                                                                component="span"
                                                                style={{
                                                                    color: "white",
                                                                    position: "absolute",
                                                                    top: "55%",
                                                                    left: "53%",
                                                                    transform: "translate(-50%, -50%)",
                                                                    zIndex: 2,
                                                                }}
                                                            >
                                                                {userData === null ? "N/A" : userData["coffee"]}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    {/*<Typography component={"div"} sx={{*/}
                                    {/*    display: "flex",*/}
                                    {/*    justifyContent: "center",*/}
                                    {/*    width: "90%",*/}
                                    {/*    paddingTop: "3%",*/}
                                    {/*    height: "100%",*/}
                                    {/*    // marginLeft: "120px"*/}
                                    {/*}}>*/}
                                    {/*    {graphStuff()}*/}
                                    {/*</Typography>*/}
                                </Box>
                            ) : null}
                        </Typography>
                        <Grid container sx={!isMobile ? {
                            width: "calc(100vw - 60px)",
                            padding: "30px",
                            marginTop: "30px"
                        } : {
                            width: "calc(100vw - 60px)",
                            padding: "30px",
                        }}>
                            {!isMobile ? (
                                <Grid item md={12}>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "left",
                                        width: "107%",
                                        transform: `scale(${scaleFactor})`,
                                        marginLeft: chatOpened ? "-7.5%" : (sidebarOpen ? "-9%" : "0%"),
                                        paddingRight: chatOpened ? "10%" : 0,
                                        marginTop: sidebarOpen || chatOpened ? "-3%" : 0,
                                    }}>
                                        <TextField
                                            label={"Search My Projects"}
                                            variant={`outlined`}
                                            size={`small`}
                                            type={`username`}
                                            color={`primary`}
                                            helperText={" "}
                                            onKeyDown={
                                                e => {
                                                    if (e.key === "Enter") {
                                                        freshSearch()
                                                    }
                                                }}
                                            onChange={e => {
                                                if (typeof e.target.value !== "string") {
                                                    setQuery("")
                                                    return
                                                }
                                                setQuery(e.target.value)
                                            }}
                                            sx={{
                                                minWidth: "350px",
                                                height: "42px",
                                            }}
                                        >
                                        </TextField>
                                        <Autocomplete
                                            multiple
                                            id="languagesInputSelect"
                                            size={"small"}
                                            options={programmingLanguages.map((_, i) => {
                                                return i
                                            })}
                                            getOptionLabel={(option) => programmingLanguages[option]}
                                            onChange={(e: SyntheticEvent, value: number[]) => {
                                                setLanguages(value)
                                                freshSearch({languages: value.length > 0 ? value : undefined})
                                            }}
                                            value={languages === null ? [] : languages}
                                            renderInput={(params) => (
                                                <TextField {...params} placeholder="Language" />
                                            )}
                                            sx={{
                                                marginLeft: "10px",
                                                minWidth: "160px",
                                                height: "42px",
                                            }}
                                        />
                                        <Select
                                            labelId={"challengeType"}
                                            id={"challengeTypeInput"}
                                            required={true}
                                            value={challengeType >= -1 ? challengeType : -1}
                                            size={"small"}
                                            sx={{
                                                marginLeft: "10px",
                                                minWidth: "210px",
                                                height: "42px",
                                            }}
                                            onChange={(e) => {
                                                // ensure type is number
                                                if (typeof e.target.value === "string") {
                                                    return
                                                }
                                                setChallengeType(e.target.value);
                                                freshSearch({
                                                    challenge_type: e.target.value !== -1 && typeof e.target.value === "number" ? e.target.value : undefined
                                                })
                                            }}
                                        >
                                            <MenuItem value={-1}>
                                                <em>Challenge Type</em>
                                            </MenuItem>
                                            <MenuItem value={0}>
                                                <em>Interactive</em>
                                            </MenuItem>
                                            <MenuItem value={1}>
                                                <em>Playground</em>
                                            </MenuItem>
                                            <MenuItem value={2}>
                                                <em>Casual</em>
                                            </MenuItem>
                                            <MenuItem value={3}>
                                                <em>Competitive</em>
                                            </MenuItem>
                                            <MenuItem value={4}>
                                                <em>Debug</em>
                                            </MenuItem>
                                        </Select>
                                        <Select
                                            labelId={"tierInputLabel"}
                                            id={"challengeTierInput"}
                                            required={true}
                                            value={tierFilter >= -1 ? tierFilter : -1}
                                            label={"Challenge Renown"}
                                            size={"small"}
                                            sx={{
                                                marginLeft: "10px",
                                                marginRight: "10px",
                                                minWidth: "150px",
                                                height: "42px",
                                            }}
                                            onChange={(e) => {
                                                // ensure type is number
                                                if (typeof e.target.value === "string") {
                                                    return
                                                }
                                                setTierFilter(e.target.value);
                                                freshSearch({
                                                    tier: e.target.value !== -1 && typeof e.target.value === "number" ? e.target.value : undefined
                                                })
                                            }}
                                        >
                                            <MenuItem value={-1}>
                                                <em>Renown</em>
                                            </MenuItem>
                                            <MenuItem value={0}>
                                                <em>Renown 1</em>
                                            </MenuItem>
                                            <MenuItem value={1}>
                                                <em>Renown 2</em>
                                            </MenuItem>
                                            <MenuItem value={2}>
                                                <em>Renown 3</em>
                                            </MenuItem>
                                            <MenuItem value={3}>
                                                <em>Renown 4</em>
                                            </MenuItem>
                                            <MenuItem value={4}>
                                                <em>Renown 5</em>
                                            </MenuItem>
                                            <MenuItem value={5}>
                                                <em>Renown 6</em>
                                            </MenuItem>
                                            <MenuItem value={6}>
                                                <em>Renown 7</em>
                                            </MenuItem>
                                            <MenuItem value={7}>
                                                <em>Renown 8</em>
                                            </MenuItem>
                                            <MenuItem value={8}>
                                                <em>Renown 9</em>
                                            </MenuItem>
                                            <MenuItem value={9}>
                                                <em>Renown 10</em>
                                            </MenuItem>
                                        </Select>
                                        <ShowButton/>
                                        <Tabs
                                            orientation="horizontal"
                                            value={typeTab}
                                            onChange={handleChange}
                                            aria-label="Vertical tabs"
                                            style={{
                                                // marginLeft: "auto",
                                                // marginRight: "20px",
                                                marginLeft: "20px",
                                                width: "fit-content",
                                                height: "42px",
                                                overflowY: "auto",
                                                maxHeight: "42px"
                                            }}
                                        >
                                            {minorValues.map((minorValue) => {
                                                return <Tab key={minorValue} label={minorValue} value={minorValue} sx={{color: "text.primary"}}/>;
                                            })}
                                        </Tabs>
                                    </div>
                                </Grid>
                            ) : null}
                            {SearchBox()}
                        </Grid>

                    </div>
                )}
                <Dialog
                    PaperProps={{ style: !isMobile ? { minHeight: "50vh", minWidth: "20vw", maxHeight: "50vh", width: "40vw" } : { minHeight: "50vh", maxHeight: "50vh", width: "90vw" }}}
                    open={popupOpen}
                    onClose={() => {
                        setPopupOpen(false);
                    }}
                >
                    {friendList()}
                </Dialog>
                <Dialog
                    PaperProps={{ style: !isMobile ? { minHeight: "50vh", minWidth: "20vw", maxHeight: "50vh", width: "40vw" } : { minHeight: "50vh", maxHeight: "50vh", width: "90vw" }}}
                    open={addFriendsPopupOpen}
                    onClose={() => {
                        setAddFriendsPopupOpen(false);
                    }}
                >
                    {AddFriendsPopup()}
                </Dialog>
                <Dialog
                    PaperProps={{ style: { minHeight: "50vh", minWidth: "50vw" } }}
                    open={requestPopupOpen}
                    onClose={() => {
                        setRequestPopupOpen(false);
                    }}
                >
                    {friendRequests()}
                    {requestList.length === 0
                        ?
                        <Typography component={"div"}
                                    sx={{display: "flex",
                                        justifyContent: "center",
                                        paddingTop: "2%",
                                        paddingBottom: "2%",
                                        flexDirection: "row",
                                        opacity: "0.3"
                                    }}>
                            No pending requests
                        </Typography>
                        :
                        <></>
                    }
                </Dialog>
            </CssBaseline>
        </ThemeProvider>
    );
}

export default Profile;
