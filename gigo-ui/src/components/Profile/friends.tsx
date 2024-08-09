import * as React from "react";
import { useState, useEffect } from "react";
import {
    Button,
    Box,
    IconButton,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    DialogTitle,
    DialogContent,
    TextField,
    Dialog,
} from "@mui/material";
import { useAppSelector } from "@/reducers/hooks";
import { selectAuthStateId, selectAuthStateUserName } from "@/reducers/auth/auth";
import config from "@/config";
import swal from "sweetalert";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from "@mui/icons-material/Add";
import UserIcon from "@/icons/User/UserIcon";
import { useRouter } from "next/navigation";
import { theme } from "@/theme";

const Friends: React.FC = () => {
    const username = useAppSelector(selectAuthStateUserName);
    const [showPopup, setShowPopup] = useState(false);
    const [friendsList, setFriendsList] = useState<any[]>([]);
    const [requestList, setRequestList] = useState<any[]>([]);
    const [addFriendsPopupOpen, setAddFriendsPopupOpen] = useState(false);
    const [friendsPopupOpen, setFriendsPopupOpen] = useState(false);
    const [requestPopupOpen, setRequestPopupOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isMobile, setIsMobile] = useState(false);

    const [mutual, setMutual] = React.useState(false)

    const userId = useAppSelector(selectAuthStateId);
    const router = useRouter();

    const [currentView, setCurrentView] = useState<'list' | 'requests' | 'add'>('list');

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

    const [dataLoaded, setDataLoaded] = React.useState(false);

    useEffect(() => {
        if (!dataLoaded) {
            const fetchData = async () => {
                await Promise.all([
                    getFriendsList(),
                    getRequestList(),
                ]);
                setDataLoaded(true);
            };

            fetchData();
        }
    }, [dataLoaded]);

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

    const ViewSelector = () => (
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
            <Button
                variant={currentView === 'list' ? 'contained' : 'text'}
                onClick={() => setCurrentView('list')}
            >
                Friends List
            </Button>
            <Button
                variant={currentView === 'requests' ? 'contained' : 'text'}
                onClick={() => setCurrentView('requests')}
            >
                Requests
            </Button>
            <Button
                variant={currentView === 'add' ? 'contained' : 'text'}
                onClick={() => setCurrentView('add')}
            >
                Add Friends
            </Button>
        </Box>
    );

    const FriendsList = () => (
        <>
            <DialogTitle>
                <IconButton edge="start" onClick={() => setCurrentView('list')}>
                    <ArrowBackIcon />
                </IconButton>
                Friends List
            </DialogTitle>
            <DialogContent>
                <List>
                    {friendsList.length > 0 ? (
                        friendsList.map((row) => (
                            <ListItem button onClick={() => router.push("/user/" + row["friend"])} key={row["friend"]}>
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
                                <ListItemText 
                                    primary={row["friend_name"]} 
                                    secondary={`Since ${new Date(row["date"]).toLocaleString("en-us", {day: '2-digit', month: 'short', year: 'numeric'})}`}
                                />
                            </ListItem>
                        ))
                    ) : (
                        <Typography align="center">You have no friends yet.</Typography>
                    )}
                </List>
            </DialogContent>
        </>
    );

    const FriendRequests = () => (
        <>
            <DialogTitle>
                <IconButton edge="start" onClick={() => setCurrentView('list')}>
                    <ArrowBackIcon />
                </IconButton>
                Friend Requests
            </DialogTitle>
            <DialogContent>
                <List>
                    {requestList.length > 0 ? (
                        requestList.map((row: any) => (
                            <ListItem key={row["_id"]}>
                                <ListItemAvatar>
                                    <UserIcon
                                        userTier={"n/a"}
                                        userThumb={config.rootPath + "/static/user/pfp/" + row["friend"]}
                                        userId={row["user_name"].toLowerCase() === username.toLowerCase() ? row["friend_id"] : row["user_id"]}
                                        backgroundName={null}
                                        backgroundPalette={null}
                                        backgroundRender={null}
                                        size={50}
                                    />
                                </ListItemAvatar>
                                <ListItemText 
                                    primary={row["user_name"].toLowerCase() === username.toLowerCase()
                                        ? row["friend_name"]
                                        : row["user_name"]}
                                />
                                {row["user_name"].toLowerCase() === username.toLowerCase() ? (
                                    <Button variant="outlined" disabled>Sent</Button>
                                ) : (
                                    <>
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            onClick={() => acceptFriend(row["user_id"])}
                                            sx={{ mr: 1 }}
                                        >
                                            Accept
                                        </Button>
                                        <Button 
                                            variant="outlined" 
                                            color="error" 
                                            onClick={() => declineFriend(row["user_id"])}
                                        >
                                            Decline
                                        </Button>
                                    </>
                                )}
                            </ListItem>
                        ))
                    ) : (
                        <Typography align="center">No pending requests</Typography>
                    )}
                </List>
            </DialogContent>
        </>
    );

    const AddFriends = () => {
        const [searchQuery, setSearchQuery] = useState("");
        const [searchResults, setSearchResults] = useState([]);

        const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
                <DialogTitle>
                    <IconButton edge="start" onClick={() => setCurrentView('list')}>
                        <ArrowBackIcon />
                    </IconButton>
                    Add Friends
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="Search for User"
                        fullWidth
                        variant="outlined"
                        value={searchQuery}
                        onChange={handleSearch}
                        sx={{ mb: 2 }}
                    />
                    <List>
                        {searchResults.length > 0 ? (
                            searchResults.map((row: any) => (
                                <ListItem key={row["_id"]}>
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
                                    <ListItemText primary={row["user_name"]} />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => sendFriendRequest(row["_id"])}
                                        startIcon={<AddIcon />}
                                    >
                                        Add
                                    </Button>
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

    return (
        <>
            <Button
                onClick={() => {
                    setCurrentView('list');
                    setFriendsPopupOpen(true);
                    getFriendsList();
                    getRequestList();
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
            <Dialog
                PaperProps={{ 
                    style: { 
                        minHeight: "50vh", 
                        width: isMobile ? "90vw" : "40vw",
                        maxWidth: "none"
                    } 
                }}
                open={friendsPopupOpen}
                onClose={() => setFriendsPopupOpen(false)}
            >
                <DialogTitle>
                    Friends
                    <IconButton
                        aria-label="close"
                        onClick={() => setFriendsPopupOpen(false)}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <ViewSelector />
                    {currentView === 'list' && <FriendsList />}
                    {currentView === 'requests' && <FriendRequests />}
                    {currentView === 'add' && <AddFriends />}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Friends;