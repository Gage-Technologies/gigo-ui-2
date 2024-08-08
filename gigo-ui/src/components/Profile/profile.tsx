'use client'
import * as React from "react";
import {SyntheticEvent, useEffect, useMemo, useState} from "react";
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
    ListItemText, DialogActions, IconButton,
    LinearProgress,
    CircularProgress,
    Container
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
import SchoolIcon from '@mui/icons-material/School';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { format, subDays } from 'date-fns';
import DetourCard from "@/components/Journey/DetourCard";
import BytesCard from "@/components/BytesCard";


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
    const [friendsPopupOpen, setFriendsPopupOpen] = React.useState(false);
    const [requestPopupOpen, setRequestPopupOpen] = React.useState(false);
    const [addFriendsPopupOpen, setAddFriendsPopupOpen] = React.useState(false);
    const [mutual, setMutual] = React.useState(false)

    const dispatch = useAppDispatch();

    const authState = useAppSelector(selectAuthState);


    const [userActivity, setUserActivity] = React.useState<Array<{ date: string; events: number }>>([]);

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
    const [isXpLoading, setIsXpLoading] = React.useState(true);

    const getXP = async () => {
        setIsXpLoading(true);
        try {
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
        } catch (error) {
            console.error("Failed to fetch XP data:", error);
        } finally {
            setIsXpLoading(false);
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

    const [dataLoaded, setDataLoaded] = React.useState(false);

    useEffect(() => {
        if (!dataLoaded) {
            const fetchData = async () => {
                setLoading(true);
                await Promise.all([
                    getXP(),
                    getUserProjects(),
                    getFriendsList(),
                    getRequestList(),
                    fetchBackgroundData()
                ]);
                setDataLoaded(true);
                setLoading(false);
            };

            fetchData();
        }
    }, [dataLoaded]);

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
                                setFriendsPopupOpen(false);
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
                        setFriendsPopupOpen(false);
                    }} color="primary">
                        Friend Requests
                    </Button>
                </DialogActions>
            </>
        );
    };

    const AddFriendsPopup = () => {
        const [searchQuery, setSearchQuery] = React.useState("");
        const [searchResults, setSearchResults] = React.useState([]);

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

    const [marginTop, setMarginTop] = React.useState(0);
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

    const RecentActivity = () => {
        const [loading, setLoading] = React.useState(true)
        const [bytesData, setBytesData] = React.useState([])
        const [journeysData, setJourneysData] = React.useState([])
        const [projectsData, setProjectsData] = React.useState([])
      
        useEffect(() => {
          const fetchData = async () => {
            try {
              const [bytesResponse, journeysResponse, projectsResponse] = await Promise.all([
                  fetch(`${config.rootPath}/api/profile/getAttemptedBytes`,
                  {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                          'Cookie': ''
                      },
                      body: JSON.stringify({ user_id: userId }),
                      credentials: 'include'
                  }),
                  fetch(`${config.rootPath}/api/profile/getAttemptedJourneys`,
                      {
                          method: 'POST',
                          headers: {
                              'Content-Type': 'application/json',
                              'Cookie': ''
                          },
                          body: JSON.stringify({ user_id: userId }),
                          credentials: 'include'
                      }),
                  fetch(`${config.rootPath}/api/profile/getAttemptedProjects`,
                      {
                          method: 'POST',
                          headers: {
                              'Content-Type': 'application/json',
                              'Cookie': ''
                          },
                          body: JSON.stringify({ user_id: userId }),
                          credentials: 'include'
                      }),
              ])
      
              const bytes = await bytesResponse.json()
              const journeys = await journeysResponse.json()
              const projects = await projectsResponse.json()
      
              setBytesData(bytes.bytes)
              setJourneysData(journeys.units)
              setProjectsData(projects.projects)
              setLoading(false)
            } catch (error) {
              console.error('error fetching data:', error)
              setLoading(false)
            }
          }
      
          fetchData()
        }, [])
      
        if (loading) {
          return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <CircularProgress />
            </Box>
          )
        }
      
        return (
          <Container maxWidth="lg">
            {(journeysData?.length > 0 || bytesData?.length > 0 || projectsData?.length > 0) && (
              <Box sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                  recent activity
                </Typography>
                
                {/* journeys row */}
                {journeysData?.length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                      journeys
                    </Typography>
                    <Grid container spacing={2}>
                      {journeysData.slice(0, 3).map((journey: any) => (
                        <Grid item xs={12} sm={6} md={4} key={journey._id}>
                          <DetourCard data={journey} width={"100%"} />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
        
                {/* bytes row */}
                {bytesData?.length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                      bytes
                    </Typography>
                    <Grid container spacing={4}>
                      {bytesData.slice(0, 5).map((byte: any) => (
                        <Grid item xs={12} sm={6} md={2.4} key={byte._id}>
                         <BytesCard
                              height={"355px"}
                              imageHeight={355}
                              width={'100%'}
                              imageWidth={'100%'}
                              bytesId={byte._id}
                              bytesDesc={byte.description}
                              bytesTitle={byte.name}
                              bytesThumb={config.rootPath + "/static/bytes/t/" + byte._id}
                              language={byte.langauge}
                              animate={false} 
                              onClick={() => router.push("/byte/" + byte._id)}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
        
                {/* projects row */}
                {projectsData?.length > 0 && (
                  <Box sx={{ mt: 8 }}> {/* increased top margin for larger gap */}
                    <Typography variant="h5" component="h2" gutterBottom>
                      projects
                    </Typography>
                    <Grid container spacing={2}>
                      {projectsData.slice(0, 3).map((project: any) => (
                        <Grid item xs={12} sm={6} md={4} key={project._id}>
                           <ProjectCard
                              width={"100%"}
                              imageWidth={"100%"}
                              projectId={project._id}
                              projectTitle={project.title}
                              projectDesc={project.description}
                              projectThumb={config.rootPath + project.thumbnail}
                              projectDate={project.updated_at}
                              projectType={project.post_type_string}
                              renown={project.tier}
                              onClick={() => router.push("/challenge/" + project._id)}
                              userThumb={config.rootPath + "/static/user/pfp/" + project.author_id}
                              userId={project.author_id}
                              username={project.author}
                              backgroundName={project.background_name}
                              backgroundPalette={project.background_color}
                              exclusive={project["challenge_cost"] !== null}
                              hover={false}
        
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Box>
            )}
          </Container>
        )
      }

    const userProfileIcon = () => {
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    paddingTop: '1%',
                    paddingLeft: '25px',
                    height: '400px'
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
        )
    }

    const userInfoDisplay = () => {
        return (
            <Box sx={{
                padding: '16px',
                marginBottom: '16px',
                display: 'flex',
                justifyContent: 'center'
            }}>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    maxWidth: "600px"  // Adjust this value as needed
                }}>
                    {userProfileIcon()}
                    <div style={{height: "140px"}}/> {/* increased space here */}
                    <Box
                        sx={{
                            boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
                            color: 'text.primary',
                            borderRadius: 2,
                            p: 4,
                            width: "100%",
                            background: authState.role > 0
                                ? `linear-gradient(135deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 100%)`
                                : '#282826',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            position: 'relative',
                            zIndex: 2
                        }}>
                            <Typography sx={{
                                width: "100%",
                                textAlign: 'center',
                                fontSize: "2.5rem",
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                            }}>
                                {username.charAt(0).toUpperCase() + username.slice(1).toLowerCase()}
                            </Typography>
                        </div>
                        {authState.role > 0 && (
                            <div style={{
                                position: 'absolute',
                                top: '-50%',
                                left: '-50%',
                                right: '-50%',
                                bottom: '-50%',
                                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                                transform: 'rotate(30deg)',
                                zIndex: 1
                            }}></div>
                        )}
                    </Box>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                        mt: 2
                    }}>
                        <Button
                            onClick={(e) => {
                                e.preventDefault(); // prevent default button behavior
                                setFriendsPopupOpen(true);
                                // update friends list without full page refresh
                                getFriendsList().then(() => {
                                    // update friends list state directly
                                    setFriendsList(prevList => [...prevList]);
                                });
                            }}
                            variant="outlined"
                            sx={{
                                color: theme.palette.text.primary,
                                borderRadius: 1,
                                p: 1,
                                mr: 1,
                                backgroundColor: "secondary",
                                minWidth: "120px"
                            }}
                        >
                            Friends
                        </Button>
                        <Button
                            onClick={(e) => {
                                e.preventDefault(); // prevent default button behavior
                                getUserBackgroundInventory().then(() => {
                                    // update inventory state directly
                                    setInventory(prevInventory => [...prevInventory]);
                                });
                            }}
                            variant={"outlined"}
                            sx={{
                                color: theme.palette.text.primary,
                                borderRadius: 1,
                                p: 1,
                                ml: 1,
                                backgroundColor: "secondary",
                                minWidth: "120px"
                            }}
                        >
                            Edit Background
                        </Button>
                    </Box>
                </Box>
            </Box>
        )
    }

    const TopStatsBoxes = () => {
        const [isStatsLoading, setIsStatsLoading] = React.useState(true);
        const [stats, setStats] = React.useState<{
            masteredConcepts: number;
            highestStreak: number;
            activityData: { date: string; events: number }[];
        }>({
            masteredConcepts: 0,
            highestStreak: 0,
            activityData: []
        });

        useEffect(() => {
            const fetchStats = async () => {
                try {
                    const [statsResponse, streakResponse, activityResponse] = await Promise.all([
                        fetch(`${config.rootPath}/api/stats/checkNumberMasteredAnon`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ user_id: userId }),
                            credentials: 'include'
                        }),
                        fetch(`${config.rootPath}/api/stats/checkHotStreakAnon`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ user_id: userId }),
                            credentials: 'include'
                        }),
                        fetch(`${config.rootPath}/api/profile/getUserRecentActivity`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ user_id: userId }),
                            credentials: 'include'
                        })
                    ]);

                    const statsData = await statsResponse.json();
                    const streakData = await streakResponse.json();
                    const activityData = await activityResponse.json();

                    console.log("activityData", activityData)

                    // Fake activity data
                    const fakeActivityData = [
                        { date: '2023-06-01', events: 5 },
                        { date: '2023-06-02', events: 8 },
                        { date: '2023-06-03', events: 3 },
                        { date: '2023-06-04', events: 10 },
                        { date: '2023-06-05', events: 7 },
                        { date: '2023-06-06', events: 22 },
                        { date: '2023-06-07', events: 6 }
                    ];

                    setStats({
                        masteredConcepts: statsData.totalMasteredConcepts || 0,
                        highestStreak: streakData.hot_streak || 0,
                        activityData: activityData.activity || []
                        //activityData: fakeActivityData
                    });
                    setIsStatsLoading(false);
                } catch (e) {
                    console.log("Failed to get stats: ", e);
                    setIsStatsLoading(false);
                }
            };

            fetchStats();
        }, []);

        const formatChartData = (data: any[]) => {
            const chartData = [["Date", "Events"]];
            
            // Sort the data array by date in ascending order
            const sortedData = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            
            sortedData.forEach(item => {
                chartData.push([format(new Date(item.date), 'MMM d'), item.events]);
            });
            
            return chartData;
        };

        const chartData = formatChartData(stats.activityData);

        // Calculate dynamic vAxis options
        const maxEvents = Math.max(...stats.activityData.map(item => item.events));
        const vAxisMax = Math.ceil(maxEvents * 1.1); // Add 10% padding
        const vAxisTicks = 5; // Number of ticks to display
        const vAxisInterval = Math.ceil(vAxisMax / vAxisTicks);

        const chartOptions = {
            title: "Activity",
            curveType: "none",
            legend: { position: "none" },
            hAxis: { 
                title: "Date",
                textStyle: { color: '#FFF' },
                titleTextStyle: { color: '#FFF' }
            },
            vAxis: { 
                title: "Completed Lessons", 
                viewWindow: { min: 0, max: vAxisMax },
                ticks: Array.from({length: vAxisTicks + 1}, (_, i) => i * vAxisInterval),
                textStyle: { color: '#FFF' },
                titleTextStyle: { color: '#FFF' }
            },
            colors: [theme.palette.primary.main],
            backgroundColor: 'transparent',
            chartArea: { backgroundColor: 'transparent' },
            titleTextStyle: { color: '#FFF' },
            pointSize: 5,
            lineWidth: 2,
        };

        const LoadingBox = () => (
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(128, 128, 128, 0.7)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 2,
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        animation: 'sheen 1.5s infinite',
                    },
                    '@keyframes sheen': {
                        '0%': { left: '-100%' },
                        '100%': { left: '100%' }
                    },
                }}
            />
        );

        return (
            <Grid container spacing={4}>
                <Grid item xs={8}>
                    <Box
                        sx={{
                            position: 'relative',
                            border: '1px solid',
                            borderColor: theme.palette.primary.light,
                            borderRadius: '10px',
                            padding: 2,
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            overflow: 'hidden'
                        }}
                    >
                        {isStatsLoading && <LoadingBox />}
                        {!isStatsLoading && (
                            <Chart
                                chartType="LineChart"
                                width="100%"
                                height="100%"
                                data={chartData}
                                options={chartOptions}
                            />
                        )}
                    </Box>
                </Grid>
                <Grid item xs={4}>
                    <Grid container direction="column" spacing={2}>
                        {/* Mastered Concepts */}
                        <Grid item>
                            <Box
                                sx={{
                                    position: 'relative',
                                    padding: 3,
                                    height: '9vh',
                                    overflow: 'hidden',
                                    border: '1px solid',
                                    borderColor: theme.palette.primary.light,
                                    borderRadius: '10px',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                {isStatsLoading && <LoadingBox />}
                                {!isStatsLoading && (
                                    <>
                                        <Tooltip title="This is the number of unique units you have finished in Journeys. Each completion of a unit counts towards a mastered concept.">
                                            <Box sx={{ position: 'absolute', top: 2, right: 2 }}>
                                                <HelpOutlineIcon sx={{ fontSize: 10 }}/>
                                            </Box>
                                        </Tooltip>
                                        <Box display="flex" flexDirection="row" alignItems="center">
                                            <SchoolIcon sx={{ fontSize: 30, marginRight: 1 }} />
                                            <Typography variant="body2">Mastered Concepts</Typography>
                                        </Box>
                                        <Typography variant="h5">{stats.masteredConcepts}</Typography>
                                    </>
                                )}
                            </Box>
                        </Grid>

                        {/* Highest Hot Streak */}
                        <Grid item>
                            <Box
                                sx={{
                                    position: 'relative',
                                    padding: 3,
                                    height: '9vh',
                                    overflow: 'hidden',
                                    border: '1px solid',
                                    borderColor: theme.palette.primary.light,
                                    borderRadius: '10px',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                {isStatsLoading && <LoadingBox />}
                                {!isStatsLoading && (
                                    <>
                                        <Tooltip title="Keep track of your hot streaks! When you complete 3 bytes in a row without failing once, you go on a hot streak. See how far you can get!">
                                            <Box sx={{ position: 'absolute', top: 2, right: 2 }}>
                                                <HelpOutlineIcon sx={{ fontSize: 10 }}/>
                                            </Box>
                                        </Tooltip>
                                        <Box display="flex" flexDirection="row" alignItems="center">
                                            <LocalFireDepartmentIcon sx={{ fontSize: 30, marginRight: 1 }} />
                                            <Typography variant="body2">Highest Hot Streak</Typography>
                                        </Box>
                                        <Typography variant="h5">{stats.highestStreak}</Typography>
                                    </>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    };

    const userXpDisplay = () => {
        const LoadingBox = () => (
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 2,
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                        animation: 'sheen 1.5s infinite',
                    },
                    '@keyframes sheen': {
                        '0%': { left: '-100%' },
                        '100%': { left: '100%' }
                    },
                }}
            >
                <CircularProgress color="secondary" />
            </Box>
        );

        return (
            <Grid item xs={12}>
                <Box sx={{ 
                    position: 'relative',
                    borderRadius: '30px',
                    height: '42vh', // approximately 400px on a 1080p monitor
                    minHeight: '400px',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '20px',
                    background: `linear-gradient(135deg, ${theme.palette.background.default}, ${theme.palette.background.paper})`,
                    boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
                    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        zIndex: -1,
                        margin: '-2px',
                        borderRadius: 'inherit',
                        background: barColor,
                    },
                }}>
                    {isXpLoading && <LoadingBox />}
                    <Grid container spacing={2} sx={{ height: '100%' }}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-start', alignItems: { xs: 'center', md: 'flex-start' }, paddingLeft: { xs: '0', md: '30px' } }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography variant="h1" sx={{
                                    fontWeight: 'bold',
                                    background: barColor,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}>
                                    {`Renown ${userData === null ? 'N/A' : userData['tier'] + 1}`}
                                </Typography>
                                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="h2" sx={{ marginRight: '10px', color: theme.palette.text.secondary }}>
                                        Level
                                    </Typography>
                                    <Box sx={{ position: 'relative', width: 'fit-content' }}>
                                        <Image
                                            alt="level"
                                            width={80}
                                            height={80}
                                            src={levelImg}
                                        />
                                        <Typography 
                                            variant="h5"
                                            sx={{ 
                                                position: 'absolute', 
                                                top: '50%', 
                                                left: '50%', 
                                                transform: 'translate(-50%, -50%)',
                                                color: 'white',
                                                textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {userData === null ? 'N/A' : userData['level'] + 1}
                                        </Typography>
                                    </Box>
                                </Box>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-end' }, paddingRight: { xs: '0', md: '40px' } }}>
                            <Image
                                alt="renown"
                                style={{
                                    height: '30vh',
                                    width: 'auto',
                                    overflow: 'hidden',
                                }}
                                src={renownImg}
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ alignItems: 'center', mt: 2, width: '100%', position: 'absolute', bottom: '20px', left: '0', padding: '0 20px' }}>
                        <Typography variant="h6" align="center" sx={{ mb: 1, color: theme.palette.text.secondary }}>
                            {`${currentXp} / ${maxXp} XP`}
                        </Typography>
                        <Box sx={{ position: 'relative', width: '100%', height: '24px' }}>
                            <LinearProgress
                                variant="determinate"
                                value={Math.min(100, (currentXp / maxXp) * 100)}
                                sx={{
                                    height: '100%',
                                    borderRadius: '30px',
                                    '& .MuiLinearProgress-bar': {
                                        background: barColor,
                                        transition: 'transform 0.4s cubic-bezier(0.65, 0, 0.35, 1)',
                                    },
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                }}
                            />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
                                    {`${Math.round((currentXp / maxXp) * 100)}%`}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Grid>
        );
    };

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
                {loading ? (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh', // full viewport height
                        width: '100vw' // full viewport width
                    }}>
                        <CircularProgress size={60} />
                    </Box>
                ) : (
                    <Box>
                        <Grid container spacing={4} sx={{ padding: 4 }}>
                            <Grid item xs={12} md={4}>
                                {userInfoDisplay()}
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Grid container direction="column" spacing={4}>
                                    <Grid item>
                                        <TopStatsBoxes />
                                    </Grid>
                                    {userXpDisplay()}
                                </Grid>
                            </Grid>
                        </Grid>
                        <RecentActivity/>
                    </Box>
                )}
                {editBackgroundModal()}
                <Dialog
                    PaperProps={{ style: !isMobile ? { minHeight: "50vh", minWidth: "20vw", maxHeight: "50vh", width: "40vw" } : { minHeight: "50vh", maxHeight: "50vh", width: "90vw" }}}
                    open={friendsPopupOpen}
                    onClose={() => {
                        setFriendsPopupOpen(false);
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
