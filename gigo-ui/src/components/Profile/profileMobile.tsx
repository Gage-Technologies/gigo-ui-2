import React, { useState, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/reducers/hooks';
import {
    selectAuthState, selectAuthStateId,
    selectAuthStateTier,
    selectAuthStateUserName,
    updateAuthState,
    initialAuthStateUpdate
} from "@/reducers/auth/auth";
import { ThemeProvider, CssBaseline, Box, Grid, Typography, CircularProgress, LinearProgress, Button, Tabs, Tab, List, ListItem, ListItemAvatar, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Tooltip, TableContainer, TableBody, Table, TableRow, TableCell, TableHead } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import config from '../../config';
import UserIcon from "@/icons/User/UserIcon";
import { useRouter, useSearchParams } from 'next/navigation';
import ReactGA from 'react-ga4';
import ProjectCard from "@/components/Project/ProjectCard";
import swal from "sweetalert";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useInfiniteScroll from "@/hooks/infiniteScroll";
import useDebounce from "@/hooks/debounce";
import DetourCard from "@/components/Journey/DetourCard";
import BytesCard from "@/components/BytesCard";
import Image from 'next/image';
import SchoolIcon from '@mui/icons-material/School';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {Chart} from "react-google-charts";

import {Byte} from '@/models/bytes';
import JourneyUnit from '@/models/journey_unit';
import Post from '@/models/post';

// import renown and level images
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
import BytesCardMobile from '../Bytes/BytesCardMobile';
import DetourMobileCard from '../Journey/DetourMobileCard';
import { format } from 'date-fns';

const ProfileMobile = () => {

    interface Reward {
        id: string; // Or number, depending on your data
        render_in_front: boolean; // Adjust this type if different
        full_name: string;
    }
    
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const authState = useAppSelector(selectAuthState);
    const userId = useAppSelector(selectAuthStateId);
    const username = useAppSelector(selectAuthStateUserName);
    const tier = useAppSelector(selectAuthStateTier);
    const router = useRouter();
    const queryParams = useSearchParams();

    // state variables
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentXp, setCurrentXp] = useState(0);
    const [maxXp, setMaxXp] = useState(0);
    const [minXp, setMinXp] = useState(0);
    const [isXpLoading, setIsXpLoading] = useState(true);
  
    const [userActivity, setUserActivity] = React.useState<Array<{ date: string; events: number }>>([]);

 
    const [tabValue, setTabValue] = useState(0);
    const [searchOptions, setSearchOptions] = useState([]);
    const [query, setQuery] = useState("");
    const [skip, setSkip] = useState(0);
    const [friendsList, setFriendsList] = useState([]);
    const [requestList, setRequestList] = useState([]);
    const [friendsPopupOpen, setFriendsPopupOpen] = useState(false);
    const [requestPopupOpen, setRequestPopupOpen] = useState(false);
    const [addFriendsPopupOpen, setAddFriendsPopupOpen] = useState(false);
    const [mutual, setMutual] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [inventory, setInventory] = useState<Reward[]>([]);
    const [userBackground, setUserBackground] = useState("");
    const [chosenBackground, setChosenBackground] = useState([]);
    const [backgroundTab, setBackgroundTab] = useState(0);
    const [backgroundArray, setBackgroundArray] = useState([]);
    const [profileBackgroundArray, setProfileBackgroundArray] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);

    const debounceQuery = useDebounce(query, 500);
    const stopScroll = useRef(false);

    // effects
    useEffect(() => {
        ReactGA.initialize("G-38KBFJZ6M6");
        getUserData();
        getXP();
        getUserProjects();
        getFriendsList();
        getRequestList();
        fetchBackgroundData();
        getRecentActivity();
    }, []);

    useEffect(() => {
        if (debounceQuery) {
            freshSearch();
        }
    }, [debounceQuery]);

    // api calls
    const getUserData = async () => {
        try {
            const response = await fetch(`${config.rootPath}/api/user/profilePage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ author_id: userId }),
                credentials: 'include'
            });
            const data = await response.json();
            setUserData(data.user);
            setLoading(false);
        } catch (error) {
            console.error("failed to fetch user data:", error);
            setLoading(false);
        }
    };

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

    const getUserProjects = async () => {
        try {
            const response = await fetch(`${config.rootPath}/api/search/posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: "",
                    author: authState.id,
                    published: true,
                    skip: 0,
                    limit: 32,
                }),
                credentials: 'include'
            });
            const data = await response.json();
            setSearchOptions(data.challenges);
        } catch (error) {
            console.error("failed to fetch user projects:", error);
        }
    };

    const getFriendsList = async () => {
        try {
            const response = await fetch(`${config.rootPath}/api/friends/list`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            const data = await response.json();
            setFriendsList(data.friends);
        } catch (error) {
            console.error("failed to fetch friends list:", error);
        }
    };

    const getRequestList = async () => {
        try {
            const response = await fetch(`${config.rootPath}/api/friends/requestList`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            const data = await response.json();
            setRequestList(data.requests);
        } catch (error) {
            console.error("failed to fetch friend requests:", error);
        }
    };

    const fetchBackgroundData = async () => {
        try {
            const response = await fetch(`${config.rootPath}/api/reward/getBackgrounds`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            const data = await response.json();
            setProfileBackgroundArray(data.backgrounds);
            setBackgroundArray(data.backgrounds.slice(0, 3));
        } catch (error) {
            console.error("failed to fetch background data:", error);
        }
    };

    const getRecentActivity = async () => {
        try {
            const [bytesResponse, journeysResponse, projectsResponse] = await Promise.all([
                fetch(`${config.rootPath}/api/profile/getAttemptedBytes`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: userId }),
                    credentials: 'include'
                }),
                fetch(`${config.rootPath}/api/profile/getAttemptedJourneys`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: userId }),
                    credentials: 'include'
                }),
                fetch(`${config.rootPath}/api/profile/getAttemptedProjects`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: userId }),
                    credentials: 'include'
                }),
            ]);

            const bytes = await bytesResponse.json();
            const journeys = await journeysResponse.json();
            const projects = await projectsResponse.json();
            // update the recent activity state with fetched data
            setRecentActivity((prevActivity) => ({
                ...prevActivity,
                bytes: bytes.bytes || [],
                journeys: journeys.units || [],
                projects: projects.projects || []
            }));
        } catch (error) {
            console.error("failed to fetch recent activity:", error);
        }
    };

    // helper functions
    const handleTabChange = (event: any, newValue: React.SetStateAction<number>) => {
        setTabValue(newValue);
    };

    const freshSearch = async () => {
        setSkip(0);
        stopScroll.current = false;
        await getQueryProjects(true);
    };

    const getQueryProjects = async (fresh = false, paramOverrides = {}) => {
        let params = {
            query: query,
            author: authState.id,
            published: true,
            skip: fresh ? 0 : skip,
            limit: 32,
        };

        params = Object.assign(params, paramOverrides);

        try {
            const response = await fetch(`${config.rootPath}/api/search/posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params),
                credentials: 'include'
            });
            const data = await response.json();

            if (data.challenges.length < 32) {
                stopScroll.current = true;
            }

            setSearchOptions(fresh ? data.challenges : [...searchOptions, ...data.challenges]);
            setSkip(prev => prev + data.challenges.length);
        } catch (error) {
            console.error("failed to fetch projects:", error);
            swal("there has been an issue loading data. please try again later.");
        }
    };

    const scrollSearch = async () => {
        if (!stopScroll.current) {
            await getQueryProjects();
        }
    };

    const [isFetching, setIsFetching] = useInfiniteScroll(scrollSearch, true, 1440, stopScroll);

    const sendFriendRequest = async (friendId: any) => {
        try {
            const response = await fetch(`${config.rootPath}/api/friends/request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ friend_id: friendId }),
                credentials: 'include'
            });
            const data = await response.json();

            if (data.message === "mutual request") {
                setMutual(true);
            } else if (data.message === "already friends") {
                swal("you are already friends!");
            } else if (data.message === "pending request") {
                swal("friend request already sent", "", "info");
            } else if (data.message === "friend request sent") {
                swal("your friend request has been sent!", "", "success");
            }
        } catch (error) {
            console.error("failed to send friend request:", error);
            swal("failed to send friend request. please try again.");
        }
    };

    const friendList = () => {
        return (
            <>
                <DialogTitle style={{width: "100%", display: "flex", flexDirection: "row"}}>
                    <Tooltip title="Go Back" placement="top">
                        <Button
                            onClick={() => {
                                setFriendsPopupOpen(false);
                            }}
                            sx={{
                                marginRight: "16px",
                                width: "16px",
                                height: "28px"
                            }}
                        >
                            <ArrowBackIcon style={{ fontSize: 36 }} />
                        </Button>
                    </Tooltip>
                    <div style={{}}>
                        Friends List
                    </div>
                    <Tooltip title="Add Friends" placement="top">
                        <Button
                            onClick={() => {
                                handleAddFriends();
                            }}
                            sx={{
                                marginLeft: "16px",
                                width: "16px",
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



    const acceptFriend = async (friendId: any) => {
        try {
            await fetch(`${config.rootPath}/api/friends/accept`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ friend_id: friendId }),
                credentials: 'include'
            });
            await getFriendsList();
            await getRequestList();
        } catch (error) {
            console.error("failed to accept friend request:", error);
            swal("failed to accept friend request. please try again.");
        }
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
                        style={{ marginBottom: "16px", marginTop: "1%" }}
                    />
                    <List>
                        {searchResults.length > 0 ? (
                            searchResults.map((row: any) => (
                                <ListItem key={row["_id"]} button style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                                    { (
                                        <ListItemText primary={row["user_name"]} />
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


    // define the backgroundarray type if it's not already defined elsewhere
    type BackgroundArray = {
        data: string;
        name: string;
    };

    // function to submit background change
    // takes an array of backgroundarray or null as input
    const submitBackgroundChange = async (background: BackgroundArray[] | null) => {
        if (background === null) {
            // reset user background if null is passed
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

            // update the inventory state with the fetched rewards
            setInventory(finalRewards);
        }

        // show the popup after inventory is set or if it's already loaded
        setShowPopup(true);
    }

 

    const handleAddFriends = () => {
        setAddFriendsPopupOpen(true);
    }


    useEffect(() => {
        if (debounceQuery) {
            freshSearch();
        }
    }, [debounceQuery]);


    

    // function to display the user profile icon
    const userProfileIcon = () => {
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    paddingTop: '1%',
                    height: '400px'
                }}
            >
                <UserIcon
                    userId={userData?._id} // using optional chaining for safety
                    userTier={userData?.tier} // using optional chaining for safety
                    userThumb={userData ? `${config.rootPath}${userData.pfp_path}` : ""} // constructing user thumbnail URL
                    size={300}
                    backgroundName={userData?.name} // using optional chaining for safety
                    backgroundPalette={userData?.color_palette} // using optional chaining for safety
                    backgroundRender={userData?.render_in_front} // using optional chaining for safety
                    profileButton={false}
                    pro={userData?.user_status > 0} // using optional chaining for safety
                    mouseMove={false}
                />
            </Box>
        )
    }

    // function to display user information
    const userInfoDisplay = () => {
        return (
            <Box sx={{
                padding: '16px',
                marginBottom: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: "100%",
                maxWidth: { xs: "100%", sm: "600px" } // responsive max-width
            }}>
                {userProfileIcon()}
                <div style={{height: "40px"}}/>
                <Box
                    sx={{
                        boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
                        color: 'text.primary',
                        borderRadius: 2,
                        p: 4,
                        width: "100%",
                        background: userData?.user_status > 0 
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
                            {userData ? userData.user_name.charAt(0).toUpperCase() + userData.user_name.slice(1).toLowerCase() : "N/A"}
                        </Typography>
                    </div>
                    {userData?.user_status > 0 && ( // using optional chaining for safety
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
            <Grid container spacing={2} sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
                <Grid item xs={12} md={8}>
                    <Box
                        sx={{
                            position: 'relative',
                            border: '1px solid',
                            borderColor: theme.palette.primary.light,
                            borderRadius: '10px',
                            padding: 2,
                            height: 'auto', // changed to auto for better mobile compliance
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            overflow: 'hidden'
                        }}
                    >
                        {isStatsLoading && <LoadingBox />}
                        {!isStatsLoading && (
                            <Chart
                                chartType="LineChart"
                                width="100%"
                                height="100px" // reduced height for better mobile display
                                data={chartData}
                                options={chartOptions}
                            />
                        )}
                    </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}> {/* changed to xs={6} to stack left/right */}
                            <Box
                                sx={{
                                    position: 'relative',
                                    padding: 1, // reduced padding for smaller content
                                    height: 'auto', // changed to auto for better mobile compliance
                                    minHeight: '80px', // set minimum height to maintain consistent styling
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
                                            <Box sx={{ position: 'absolute', top: 1, right: 1 }}> {/* adjusted position for smaller content */}
                                                <HelpOutlineIcon sx={{ fontSize: 8 }}/> {/* smaller icon size */}
                                            </Box>
                                        </Tooltip>
                                        <Box display="flex" flexDirection="row" alignItems="center">
                                            <SchoolIcon sx={{ fontSize: 24, marginRight: 0.5 }} /> {/* smaller icon size */}
                                            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>Mastered Concepts</Typography> {/* smaller title */}
                                        </Box>
                                        <Typography variant="h6" sx={{ fontSize: '1rem' }}>{stats.masteredConcepts}</Typography> {/* smaller value */}
                                    </>
                                )}
                            </Box>
                        </Grid>

                        <Grid item xs={6}> {/* changed to xs={6} to stack left/right */}
                            <Box
                                sx={{
                                    position: 'relative',
                                    padding: 1, // reduced padding for smaller content
                                    height: 'auto', // changed to auto for better mobile compliance
                                    minHeight: '80px', // set minimum height to maintain consistent styling
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
                                            <Box sx={{ position: 'absolute', top: 1, right: 1 }}> {/* adjusted position for smaller content */}
                                                <HelpOutlineIcon sx={{ fontSize: 8 }}/> {/* smaller icon size */}
                                            </Box>
                                        </Tooltip>
                                        <Box display="flex" flexDirection="row" alignItems="center">
                                            <LocalFireDepartmentIcon sx={{ fontSize: 24, marginRight: 0.5 }} /> {/* smaller icon size */}
                                            <Typography variant="body2" sx={{ fontSize: '0.8rem'}}>
                                                Highest Hot Streak
                                            </Typography> {/* smaller title with line height and forced line breaks */}
                                        </Box>
                                        <Typography variant="h6" sx={{ fontSize: '1rem', whiteSpace: 'pre-line' }}>{stats.highestStreak}</Typography> {/* smaller value with forced line breaks */}
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
            <Box sx={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex',
                justifyContent: 'center', alignItems: 'center', zIndex: 2,
                '&::after': {
                    content: '""', position: 'absolute', top: 0, left: '-100%',
                    width: '100%', height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    animation: 'sheen 1.5s infinite',
                },
                '@keyframes sheen': {
                    '0%': { left: '-100%' },
                    '100%': { left: '100%' }
                },
            }}>
                <CircularProgress color="secondary" />
            </Box>
        );

        return (
            <Grid item xs={12}>
                <Box sx={{ 
                    position: 'relative', borderRadius: '15px', minHeight: '150px',
                    width: '100%', display: 'flex', flexDirection: 'column', // changed to column for proper layout
                    padding: '8px', background: `linear-gradient(135deg, ${theme.palette.background.default}, ${theme.palette.background.paper})`,
                    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
                    '&::before': {
                        content: '""', position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
                        zIndex: -1, margin: '-2px', borderRadius: 'inherit', background: barColor,
                    },
                }}>
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                            <Typography variant="h5" sx={{
                                fontWeight: 'bold', background: barColor,
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                fontSize: '1.2rem'
                            }}>
                                {`Renown ${userData === null ? 'N/A' : userData['tier'] + 1}`}
                            </Typography>
                            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                                <Typography variant="h6" sx={{ marginRight: '8px', color: theme.palette.text.secondary }}>
                                    Level
                                </Typography>
                                <Box sx={{ position: 'relative', width: 'fit-content' }}>
                                    <Image alt="level" width={50} height={50} src={levelImg} />
                                    <Typography variant="body1" sx={{ 
                                        position: 'absolute', top: '50%', left: '50%',
                                        transform: 'translate(-50%, -50%)', color: 'white',
                                        textShadow: '1px 1px 2px rgba(0,0,0,0.6)',
                                        fontWeight: 'bold', fontSize: '0.9rem'
                                    }}>
                                        {userData === null ? 'N/A' : userData['level'] + 1}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Image alt="renown" style={{
                                height: 'auto', maxHeight: '15vh',
                                width: 'auto', maxWidth: '100%',
                            }} src={renownImg} />
                        </Box>
                    </Box>
                    <Box sx={{ position: 'relative', width: '100%', height: '24px', marginTop: 'auto' }}> {/* moved LinearProgress inside this box */}
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
            </Grid>
        );
    };

    const RecentActivity = () => {
        const [loading, setLoading] = React.useState(true)
        // import the necessary types


        // use the imported types in the state declarations
        const [bytesData, setBytesData] = React.useState<Byte[]>([]);
        const [journeysData, setJourneysData] = React.useState<JourneyUnit[]>([]);
        const [projectsData, setProjectsData] = React.useState<Post[]>([]);
      
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
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          )
        }
        return (
          <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}> {/* center the content horizontally */}
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Grid container spacing={2} justifyContent="center"> {/* center the grid items */}
              <Grid item xs={12} md={4}> {/* adjust grid item size for better layout */}
                <Typography variant="subtitle1" gutterBottom>
                  Journeys
                </Typography>
                {journeysData.slice(0, 5).map((journey: any) => (
                  <Box key={journey._id} sx={{ mb: 2 }}>
                    <DetourMobileCard
                      data={journey}
                      width="100%"
                    />
                  </Box>
                ))}
              </Grid>
              <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}> {/* center the content horizontally */}
                <Typography variant="subtitle1" gutterBottom>
                  Bytes
                </Typography>
                {bytesData.slice(0, 5).map((byte: any) => (
                  <Box key={byte._id} sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}> {/* center the byte card */}
                    <BytesCardMobile
                      bytesId={byte._id}
                      width={"100%"}
                      height={"auto"}
                      imageWidth={"70%"}
                      bytesTitle={byte.name} // ensuring the title is not abbreviated
                      // @ts-ignore
                      bytesThumb={config.rootPath + "/static/bytes/t/" + byte._id}
                      // @ts-ignore
                      bytesDesc={byte.description}
                      // @ts-ignore
                      language={byte.language}
                      // @ts-ignore
                      completedEasy={byte.completedEasy}
                      // @ts-ignore
                      completedMedium={byte.completedMedium}
                      // @ts-ignore
                      completedHard={byte.completedHard}
                    />
                  </Box>
                ))}
              </Grid>
              <Grid item xs={12} md={4}> {/* adjust grid item size for better layout */}
                <Typography variant="subtitle1" gutterBottom>
                  Projects
                </Typography>
                {projectsData.slice(0, 3).map((project: any) => (
                  <Box key={project._id} sx={{ mb: 2 }}>
                    <ProjectCard
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
                      width="100%"
                      height="auto"
                      imageWidth="100%"
                      imageHeight="20vh"
                    />
                  </Box>
                ))}
              </Grid>
            </Grid>
          </Box>
        )
    }
    
      

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline>
                <HelmetProvider>
                    <Helmet>
                        <title>{userData ? userData["user_name"] : 'User'}</title>
                        <meta property="og:title" content={userData ? userData["user_name"] : 'User'} data-rh="true"/>
                        <meta property="og:image" content={userData ? config.rootPath + userData["pfp_path"] : "image not found"} data-rh="true"/>
                    </Helmet>
                </HelmetProvider>
                {loading ? (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                        width: '100vw'
                    }}>
                        <CircularProgress size={60} />
                    </Box>
                ) : (
                    <Box sx={{ p: 2 }}>
                        {userInfoDisplay()}
                        {userXpDisplay()}
                        <Box sx={{ mt: 2 }}>
                            <TopStatsBoxes />
                        </Box>
                        
                        <RecentActivity />
                    </Box>
                )}
            </CssBaseline>
        </ThemeProvider>
    );
} // closing bracket for the ProfileMobile component
 // closing bracket for the ProfileMobile component

export default ProfileMobile;
