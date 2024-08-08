'use client'
import * as React from "react";
import {SyntheticEvent, useEffect} from "react";
import {
    Autocomplete,
    Avatar,
    Box, Button,
    CircularProgress,
    Container,
    CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Grid, MenuItem,
    Select,
    TextField,
    ThemeProvider,
    Tooltip,
    Typography
} from "@mui/material";
import Image from "next/image";
import {theme} from "@/theme";
import ProjectCard from "@/components/Project/ProjectCard";
import {useAppDispatch, useAppSelector} from "@/reducers/hooks";
import {
    initialAuthStateUpdate,
    selectAuthStateId,
    updateAuthState
} from "@/reducers/auth/auth";
import config from "@/config";
import swal from "sweetalert";
import {ThreeDots} from "react-loading-icons";
import Post from "@/models/post";
import {programmingLanguages} from "@/services/vars";
import SearchIcon from '@mui/icons-material/Search';
import useInfiniteScroll from "@/hooks/infiniteScroll";
import MoonLoader from "react-spinners/MoonLoader";
import useDebounce from "@/hooks/debounce";
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
import UserIcon from "@/icons/User/UserIcon";
import {Helmet, HelmetProvider} from "react-helmet-async";
import {useRouter, useSearchParams} from "next/navigation";
import Chart from "react-google-charts";
import BytesCard from "@/components/BytesCard";
import DetourCard from "@/components/Journey/DetourCard";
import SchoolIcon from '@mui/icons-material/School';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { format } from "date-fns";

function UserPage({params}: { params: {id: string}}) {
    let queryParams = useSearchParams();
    let isMobile = queryParams.get("viewport") === "mobile";
    const chatOpened = queryParams.get("chat") === "true";
    const sidebarOpen = queryParams.get("menu") === "true";

    const dispatch = useAppDispatch();

    const [userActivity, setUserActivity] = React.useState([])

    const [userData, setUserData] = React.useState<any>(null)

    const [loading, setLoading] = React.useState(true)

    const [searchOptions, setSearchOptions] = React.useState<Post[]>([])

    const [query, setQuery] = React.useState("")
    const debounceQuery = useDebounce(query, 500);

    const [languages, setLanguages] = React.useState<number[]>([])

    const [following, setFollowing] = React.useState(false)

    const [challengeType, setChallengeType] = React.useState(-1)

    const [tierFilter, setTierFilter] = React.useState(-1)

    const [userBackground, setUserBackground] = React.useState(null)

    const [mutual, setMutual] = React.useState(false)

    const [skip, setSkip] = React.useState(0)

    let router = useRouter();



    const ShowButton = () => (
        <Button
            onClick={() => freshSearch()}
            style={{width: "5px"}}
        >
            {<SearchIcon/>}
        </Button>
    )

    // retrieve url params
    // let {id: urlId} = useParams();

    const [id, setId] = React.useState<string>(params.id);

    const userId = useAppSelector(selectAuthStateId);

    const [friendBool, setFriendBool] = React.useState(false)

    const [requestBool, setRequestBool] = React.useState(false)

    const checkFriend = async () => {
        if (id === "") {
            return;
        }

        let friend = await fetch(
            `${config.rootPath}/api/friends/check`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({profile_id: id}),
                credentials: 'include'
            }
        ).then(async (response) => response.json())

        const [res] = await Promise.all([
            friend
        ])

        setFriendBool(res["friend"])

    }

    const requestCheck = async () => {
        if (id === "") {
            return;
        }

        let request = await fetch(
            `${config.rootPath}/api/friends/requestCheck`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: id
                }),
                credentials: 'include'
            }
        ).then(async (response) => response.json())

        const [res] = await Promise.all([
            request
        ])

        setRequestBool(res["request"])

    }

    const sendFriendRequest = async () => {
        if (id === "") {
            return;
        }

        let friend = await fetch(
            `${config.rootPath}/api/friends/request`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    friend_id: id
                }),
                credentials: 'include'
            }
        ).then(async (response) => response.json())

        const [res] = await Promise.all([
            friend
        ])

        if (res["message"] === "mutual request")
        {
            setMutual(true)
        } else if (res["message"] === "already friends") {
            //@ts-ignore
            swal("You are already friends!")
        } else if (res["message"] === "pending request") {
            //@ts-ignore
            swal("Friend request already sent", "", "info")
            setRequestBool(true)
        } else if (res["message"] === "friend request sent") {
            //@ts-ignore
            swal("Your friend request has been sent!", "", "success")
            setRequestBool(true)
        }

    }

    const acceptFriend = async () => {
        if (id === "") {
            return;
        }

        let res = await fetch(
            `${config.rootPath}/api/friends/accept`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    requester_id: id
                }),
                credentials: 'include'
            }
        ).then(async (response) => response.json())

        if (res["message"] !== "friend request accepted") {
            //@ts-ignore
            swal("An unexpected error has occurred", "We're sorry, we'll get right on that!", "error")
        } else if (res["message"] === "friend request accepted") {
            //@ts-ignore
            swal("friend request accepted", "", "success")
        }
    }

    const declineFriend = async () => {
        if (id === "") {
            return;
        }
        let res = await fetch(
            `${config.rootPath}/api/friends/decline`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    requester_id: id
                }),
                credentials: 'include'
            }
        ).then(async (response) => response.json())

        if (res["message"] !== "friend request declined") {
            //@ts-ignore
            swal("An unexpected error has occurred", "We're sorry, we'll get right on that!", "error")
        }
    }

    const getUserData = async () => {
        if (id === "") {
            return;
        }

        if (userData === null) {
            let user = await fetch(
                `${config.rootPath}/api/user/profilePage`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        author_id: id
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
            setUserActivity(res["activity"])
            setFollowing(res["following"])

            if (res["user"]["color_palette"] !== null && res["user"]["color_palette"]!== "null" && res["user"]["color_palette"]!== "" && res["user"]["color_palette"] !== "undefined" && res["user"]["color_palette"] !== undefined){
                fetch(`${config.rootPath}/static/ui/lottie/user_backgrounds/${res["user"]["color_palette"]}_${res["user"]["name"]}.json`, {credentials: 'include'})
                    .then(data => {
                        data.json().then(json => {
                            setUserBackground(json)
                        })
                    })
                    .catch(error => console.error(error));
            }
        }
    }

    useEffect(() => {
        if (id === "") {
            return;
        }

        setLoading(true)
        getUserData().then(() => {
            checkFriend().then(() => {
                requestCheck().then(() => {
                    setLoading(false)
                })
            })
        })
    }, [id])

    const stopScroll = React.useRef(false)

    const getQueryProjects = async (fresh: boolean = false, paramOverrides: Object = {}) => {
        if (id === "") {
            return;
        }

        let params = {
            query: query,
            author: id,
            published: true,
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

        if (fresh) {
            setSearchOptions(res["challenges"])
            return
        }

        let opts = JSON.parse(JSON.stringify(searchOptions))
        setSearchOptions(opts.concat(res["challenges"]))
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


    useEffect(() => {
        if (id === "") {
            return;
        }

        if (debounceQuery) {
            freshSearch()
        }
    }, [debounceQuery]);

    useEffect(() => {
        if (id === "") {
            return;
        }
        freshSearch()
    }, [id]);


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

    const RecentActivity = () => {
        const [loading, setLoading] = React.useState(true)
        const [bytesData, setBytesData] = React.useState([])
        const [journeysData, setJourneysData] = React.useState([])
        const [projectsData, setProjectsData] = React.useState([])
      
        React.useEffect(() => {
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
                      body: JSON.stringify({ user_id: userData["_id"] }),
                      credentials: 'include'
                  }),
                  fetch(`${config.rootPath}/api/profile/getAttemptedJourneys`,
                      {
                          method: 'POST',
                          headers: {
                              'Content-Type': 'application/json',
                              'Cookie': ''
                          },
                          body: JSON.stringify({ user_id: userData["_id"] }),
                          credentials: 'include'
                      }),
                  fetch(`${config.rootPath}/api/profile/getAttemptedProjects`,
                      {
                          method: 'POST',
                          headers: {
                              'Content-Type': 'application/json',
                              'Cookie': ''
                          },
                          body: JSON.stringify({ user_id: userData["_id"] }),
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
                    userId={userData["_id"]}
                    userTier={userData["tier"]}
                    userThumb={userData === null ? "" : config.rootPath + userData["pfp_path"]}
                    size={300}
                    backgroundName={userData["name"]}
                    backgroundPalette={userData["color_palette"]}
                    backgroundRender={userData["render_in_front"]}
                    profileButton={false}
                    pro={userData["user_status"] > 0}
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
                flexDirection: 'column',
                alignItems: 'center',
                width: "100%",
                maxWidth: { xs: "100%", sm: "600px" } // Responsive max-width
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
                        background: userData["user_status"] > 0 
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
                            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" }, // Responsive font size
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                            wordBreak: 'break-word', // Ensure long usernames wrap
                            lineHeight: 1 // Add more spacing between lines
                        }}>
                            {userData !== null ?  userData["user_name"].charAt(0).toUpperCase() + userData["user_name"].slice(1).toLowerCase() : "N/A"}
                        </Typography>
                    </div>
                    {userData["user_status"] > 0  && (
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
                {/* Friend Request Button */}
                {userId !== id && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={sendFriendRequest}
                        disabled={friendBool || requestBool}
                        sx={{ 
                            mt: 2, 
                            width: "100%", 
                            maxWidth: { xs: "100%", sm: "600px" }, // Responsive max-width
                            height: "50px",
                            fontSize: { xs: "1rem", sm: "1.2rem" }, // Responsive font size
                            fontWeight: "bold"
                        }}
                    >
                        {friendBool ? 'Friends' : requestBool ? 'Request Sent' : 'Add Friend'}
                    </Button>
                )}
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
                            body: JSON.stringify({ user_id: userData["_id"] }),
                            credentials: 'include'
                        }),
                        fetch(`${config.rootPath}/api/stats/checkHotStreakAnon`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ user_id: userData["_id"] }),
                            credentials: 'include'
                        }),
                        fetch(`${config.rootPath}/api/profile/getUserRecentActivity`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ user_id: userData["_id"] }),
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
        const maxEvents = Math.max(...stats.activityData.map((item: { events: any; }) => item.events));
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
            <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                    <Box
                        sx={{
                            position: 'relative',
                            border: '1px solid',
                            borderColor: theme.palette.primary.light,
                            borderRadius: '10px',
                            padding: 2,
                            height: { xs: '300px', md: '100%' }, // Responsive height
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
                <Grid item xs={12} md={4}>
                    <Grid container direction="column" spacing={2}>
                        {/* Mastered Concepts */}
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    padding: 3,
                                    height: { xs: 'auto', md: '9vh' }, // Responsive height
                                    minHeight: '100px', // Minimum height for smaller screens
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
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    padding: 3,
                                    height: { xs: 'auto', md: '9vh' }, // Responsive height
                                    minHeight: '100px', // Minimum height for smaller screens
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
                    height: { xs: 'auto', md: '400px' }, // Responsive height
                    minHeight: '300px', // Minimum height for smaller screens
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
                    
                    <Grid container spacing={2} sx={{ height: '100%' }}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-start', alignItems: { xs: 'center', md: 'flex-start' }, paddingLeft: { xs: '0', md: '30px' } }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography variant="h2" sx={{
                                    fontWeight: 'bold',
                                    background: barColor,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontSize: { xs: '2rem', sm: '3rem', md: '4rem' } // Responsive font size
                                }}>
                                    {`Renown ${userData === null ? 'N/A' : userData['tier'] + 1}`}
                                </Typography>
                                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="h4" sx={{ marginRight: '10px', color: theme.palette.text.secondary, fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
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
                                                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } // Responsive font size
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
                                    height: 'auto',
                                    maxHeight: '30vh',
                                    width: 'auto',
                                    maxWidth: '100%',
                                    overflow: 'hidden',
                                }}
                                src={renownImg}
                            />
                        </Grid>
                    </Grid>
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
                    <Box sx={{ padding: { xs: 2, sm: 4 } }}> {/* Responsive padding */}
                        <Grid container spacing={{ xs: 2, sm: 4 }}> {/* Responsive spacing */}
                            <Grid item xs={12} md={4}>
                                {userInfoDisplay()}
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Grid container direction="column" spacing={{ xs: 2, sm: 4 }}> {/* Responsive spacing */}
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
                <Dialog
                    open={mutual}
                    onClose={() => setMutual(false)}
                >
                    <DialogTitle>{"Mutual Friend Request"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            It seems this user has already sent you a friend request! You can go ahead and accept or decline their request here.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setMutual(false)
                            acceptFriend()
                        }} color="primary">Accept Friend</Button>
                        <Button onClick={() => {
                            setMutual(false)
                            declineFriend()
                        }} color={"error"}>
                            Decline Friend
                        </Button>
                    </DialogActions>
                </Dialog>
            </CssBaseline>
        </ThemeProvider>
    );
}

export default UserPage;