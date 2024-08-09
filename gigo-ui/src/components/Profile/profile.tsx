'use client'
import * as React from "react";
import {useEffect, useState} from "react";
import {
    Box,
    Button,
    CssBaseline,
    Grid,
    ThemeProvider,
    Typography,
    Tooltip,
    LinearProgress,
    CircularProgress,
    Container
} from "@mui/material";
import Image from "next/image";
import {theme} from "@/theme";
import ProjectCard from "@/components/Project/ProjectCard";
import {useAppDispatch, useAppSelector} from "@/reducers/hooks";
import {
    selectAuthState, selectAuthStateId,
    selectAuthStateTier,
    selectAuthStateUserName,
} from "@/reducers/auth/auth";
import {Chart} from "react-google-charts";
import config from "@/config";
import swal from "sweetalert";
import Post from "@/models/post";
import ReactGA from "react-ga4";
import SearchIcon from '@mui/icons-material/Search';
import UserIcon from "@/icons/User/UserIcon";
import useInfiniteScroll from "@/hooks/infiniteScroll";
import "@/components/Profile/styles/progress.css";
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
import useDebounce from "@/hooks/debounce";
import {Helmet, HelmetProvider} from "react-helmet-async";
import {useRouter, useSearchParams} from "next/navigation";
import SchoolIcon from '@mui/icons-material/School';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { format } from 'date-fns';
import DetourCard from "@/components/Journey/DetourCard";
import BytesCard from "@/components/BytesCard";
import EditBackground from "./editBackground";
import Friends from "./friends";

function Profile() {
    const username = useAppSelector(selectAuthStateUserName);
    let queryParams = useSearchParams();
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

    const authState = useAppSelector(selectAuthState);


    const [userData, setUserData] = React.useState(null)

    const [loading, setLoading] = React.useState(true)

    const [searchOptions, setSearchOptions] = React.useState<Post[]>([])

    const [query, setQuery] = React.useState("")
    const debounceQuery = useDebounce(query, 500);

    const [languages, setLanguages] = React.useState<number[]>([])

    const [challengeType, setChallengeType] = React.useState(-1)

    const [tierFilter, setTierFilter] = React.useState(-1)

    const [userBackground, setUserBackground] = useState("")
    const [publishedBool, setPublishedBool] = React.useState(true)

    const [skip, setSkip] = React.useState(0)

    const router = useRouter();

    ReactGA.initialize("G-38KBFJZ6M6");

    const userId = useAppSelector(selectAuthStateId);

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

    const getProfileData = async () => {
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
            setUserBackground(res["user"]["color_palette"] + "_" + res["user"]["name"])
        }
    }

    const [dataLoaded, setDataLoaded] = React.useState(false);

    useEffect(() => {
        if (!dataLoaded) {
            const fetchData = async () => {
                setLoading(true);
                await Promise.all([
                    getXP(),
                    getProfileData(),
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

    useEffect(() => {
        if (debounceQuery) {
            freshSearch()
        }
    }, [debounceQuery]);


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
                        alignItems: "center",
                        width: "100%",
                        mt: 4,
                        gap: 3
                    }}>
                        <EditBackground 
                            userBackground={userBackground} 
                            userData={userData}
                        />
                        <Friends />
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
            
            </CssBaseline>
        </ThemeProvider>
    );
}

export default Profile;
