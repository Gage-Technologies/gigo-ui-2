'use client'
import React, {createRef, useEffect, useRef, useState} from 'react';
import {theme, themeHelpers} from "@/theme";
import {
    Box,
    Button,
    Card, Chip,
    CircularProgress,
    Grid,
    Popover,
    SpeedDial,
    Typography
} from "@mui/material";
import {useAppDispatch, useAppSelector} from "@/reducers/hooks";
import 'react-awesome-button/dist/styles.css';
import '@/components/Journey/button.css'
import '@/components/Journey/background.css'
import {SpeedDialAction} from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from '@mui/icons-material/Check';
import ArticleIcon from '@mui/icons-material/Article';
import {AwesomeButton} from 'react-awesome-button';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import journeyMap from "@/img/journey/journey-map.svg";
import config from "@/config";
import {selectAuthStateId} from "@/reducers/auth/auth";
import JourneyPortals from "@/components/Journey/JourneyPortals";
import {initialJourneyDetourStateUpdate, updateJourneyDetourState} from "@/reducers/journeyDetour/journeyDetour";
import MarkdownRenderer from "@/components/Markdown/MarkdownRenderer";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MuiAwesomeButton from "@/components/MuiAwesomeButton";
import CplusplusOriginal from 'devicons-react/lib/icons/CplusplusOriginal';
import CplusplusPlain from 'devicons-react/lib/icons/CplusplusPlain';
import CsharpOriginal from 'devicons-react/lib/icons/CsharpOriginal';
import CsharpPlain from 'devicons-react/lib/icons/CsharpPlain';
import GoOriginal from 'devicons-react/lib/icons/GoOriginal';
import GoPlain from 'devicons-react/lib/icons/GoPlain';
import JavascriptOriginal from 'devicons-react/lib/icons/JavascriptOriginal';
import JavascriptPlain from 'devicons-react/lib/icons/JavascriptPlain';
import PythonOriginal from 'devicons-react/lib/icons/PythonOriginal';
import RustOriginal from 'devicons-react/lib/icons/RustOriginal';
import {Task, Unit} from "@/models/journey";
import DetourSelection from "@/components/Journey/DetourSelection";
import StarIcon from "@mui/icons-material/Star";
import {useSearchParams} from "next/navigation";
import JourneyMainMobile from '@/components/Journey/JourneyMainMobile';
import Image from 'next/image'
import { Lock } from '@mui/icons-material';
import GoProDisplay from '@/components/GoProDisplay';
import { selectOutOfHearts } from '@/reducers/hearts/hearts';

function JourneyMain() {
    const outOfHearts = useAppSelector(selectOutOfHearts);
    let query = useSearchParams();
    let isMobile = query.get("viewport") === "mobile";

    const [loadingMapData, setLoadingMapData] = useState(false);
    const [contentLoaded, setContentLoaded] = useState(true)

    const userId = useAppSelector(selectAuthStateId) as string

    const [unitData, setUnitData] = useState<Unit[]>([])
    const [nextUnit, setNextUnit] = useState<Unit>()
    const [taskData, setTaskData] = useState<Task[]>([])
    const unitRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);
    const [currentUnit, setCurrentUnit] = useState<string | null>(null);
    const [proPopupOpen, setProPopupOpen] = useState(false)
    const initCallMade = useRef(false)


    function extractIdFromUrl(urlString: string): string | null {
        const url = new URL(urlString);
        const pathSegments = url.pathname.split('/');
        // Assuming the ID is directly after 'main?' in the URL, which means it's part of the path, not a query parameter
        const lastSegment = pathSegments[pathSegments.length - 1];
        if (lastSegment === 'main') {
            // Extract ID from the search part of the URL, assuming there's no specific key for the ID
            const searchParams = new URLSearchParams(url.search);
            // This assumes there's only one parameter and takes its value directly
            let id = searchParams.toString();
            if (id.endsWith('=')) {
                id = id.slice(0, -1); // Removes the last character if it's an "="
            }
            if (id) {
                return id;
            }
        }
        return null;
    }

    const [activeJourney, setActiveJourney] = useState(false)
    const [loading, setLoading] = useState(true)
    const [loadingMainPage, setLoadingMainPage] = useState(true)


    let skip = 0


    useEffect(() => {
        const handleScroll = () => {
            // Check if the user has scrolled to the top of the page
            if (window.pageYOffset === 0) {
                setLoading(true)
                // Call your API function here
                getTasks()
            }
        };

        // Add scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Clean up
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);




    const getTasks = async () => {
        if (skip === 0) {
            let map = await fetch(
                `${config.rootPath}/api/journey/determineStart`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: '{}',
                    credentials: 'include'
                }
            ).then(async (response) => response.json())

            if (map['started_journey'] === false) {
                setActiveJourney(false)
                setLoadingMainPage(false)
                return
            }
        }

        let res = await fetch(
            `${config.rootPath}/api/journey/getUserMap`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: userId,
                    skip: skip,
                    limit: 5
                }),
                credentials: 'include'
            }
        ).then(async (response) => response.json())

        if (res["success"] !== true) {
            // setUnitData(allUnits.slice(0, -1));
            setActiveJourney(true)
            setLoading(false)
            if (contentLoaded === false) {
                setContentLoaded(true)
            }
            return
        }

        const units = (res['user_map']['units'])

        //@ts-ignore
        const sortedUnitData = units.sort((a, b) => {
            if (a.node_above === null) return -1;
            if (b.node_above === null) return 1;
            // @ts-ignore
            return a.node_above - b.node_above;
        });

        // @ts-ignore
        const fetchedTasks = sortedUnitData.map(async (unit: any) => {

            let res = await fetch(
                `${config.rootPath}/api/journey/getTasksInUnit`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        unit_id: unit._id
                    }),
                    credentials: 'include'
                }
            ).then(async (response) => response.json())

            const tasks = res.data.tasks

            const currentUrl = window.location.href;
            let usedUrl = extractIdFromUrl(currentUrl)

            //@ts-ignore
            const sortedTaskData = tasks.sort((a, b) => {
                if (a.node_above === null) return -1;
                if (b.node_above === null) return 1;
                if (usedUrl !== null && a.code_source_id === usedUrl) {
                    setCurrentUnit(unit._id)
                }
                if (usedUrl !== null && b.code_source_id === usedUrl) {
                    setCurrentUnit(unit._id)
                }
                // @ts-ignore
                return a.node_above - b.node_above;
            });
            return {...unit, tasks: sortedTaskData};
        });

        const allUnits = await Promise.all(fetchedTasks);

        if (skip === 0) {
            const slicedUnits = allUnits.slice(0, -1);
            setNextUnit(allUnits[allUnits.length - 1]);
            setUnitData(slicedUnits);
            // Update this line to not slice slicedUnits again
            unitRefs.current = slicedUnits.map((_: any, i: any) => unitRefs.current[i] ?? createRef<HTMLDivElement>());
            setLoadingMainPage(false);
        } else {
            setUnitData(prevUnitData => [...allUnits, ...prevUnitData]);
            unitRefs.current = [...allUnits.map(() => createRef<HTMLDivElement>()), ...unitRefs.current];

            const element = unitRefs.current[5]?.current;
            if (element) {
                console.log("Scrolling to:", element);
                console.log(unitRefs.current.length)
                console.log("unitRefs: ", unitRefs.current)
                window.location.hash = element.id
                window.requestAnimationFrame(() => {
                    const scrolledY = window.scrollY;
                    if (scrolledY) {
                        window.scroll(0, scrolledY - 200); // Scroll up by 'offset' pixels
                    }
                });
                // element.scrollIntoView({
                //     behavior: 'auto',
                //     block: 'start',
                // });
            }


        }


        skip += 5

        // setUnitData(allUnits.slice(0, -1));
        setActiveJourney(true)
        setLoading(false)
        if (contentLoaded === false) {
            setContentLoaded(true)
        }

        // unitRefs.current = allUnits.map((_, i) => unitRefs.current[i] ?? createRef<HTMLDivElement>());
    }

    useEffect(() => {
        if (!initCallMade.current) {
            initCallMade.current = true
            getTasks()
        }
    }, []);

    const handleAddUnitToMap = async () => {
        if (!nextUnit) {
            return
        }

        setLoadingMapData(true)

        let res = await fetch(
            `${config.rootPath}/api/journey/addUnitToMap`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    unit_id: nextUnit._id
                }),
                credentials: 'include'
            }
        ).then(async (response) => response.json())

        if (res && res.success) {
            getTasks().then(() => {
                setLoadingMapData(false)
            });
        } else {
            console.error("Failed to add unit to map");
            return
        }
    };

    const [hasScrolled, setHasScrolled] = useState(false);

    // // todo: works properly, but scrolls super fast. Keeping in case the smooth scroll causes too many issues.
    useEffect(() => {
        // if we have already scrolled or no data exists return
        if (unitData.length === 0 || hasScrolled) {
            return
        }

        // calculate the last unit that has a completed task
        const lastUnitWithCompletedTaskIndex = unitData.reduce((acc, unit, index) =>
            unit.tasks.some((task: { completed: any; }) => task.completed) ? index : acc, -1
        );

        console.log("Last unit with completed task index:", lastUnitWithCompletedTaskIndex);

        // Get the current URL
        const url = window.location.href;

        // Create a URL object (this provides utilities for URL parsing)
        const urlObject = new URL(url);

        // Use the URLSearchParams interface to work with the query string
        const queryParams = urlObject.searchParams;

        // Get the value of 'last_unit_id'
        const lastUnitId = queryParams.get('last_task_id');

        console.log("Last unit with: " + lastUnitId)


        let indexOfUnitWithTask = -1; // Default to -1 to indicate "not found"
        // Check if 'last_unit_id' exists and log the value
        if (lastUnitId !== null) {
            // if the user has been working on a previous unit attempt to find it
            for (let i = 0; i < unitData.length; i++) {
                const unit = unitData[i];
                // @ts-ignore
                const taskFound = unit.tasks.some((task: { code_source_id: string; }) => task.code_source_id === lastUnitId);
                if (taskFound) {
                    // once the unit is found set the index to it
                    indexOfUnitWithTask = i;
                    break; // Stop looping once we've found the task
                }
            }

            // if we found a previous task then scroll to it
            if (indexOfUnitWithTask !== -1) {
                setTimeout(() => {
                    const element = unitRefs.current[indexOfUnitWithTask]?.current;
                    if (element) {
                        // scrolling to the unit with the element hash
                        window.location.hash = element.id
                        // element.scrollIntoView({
                        //     behavior: 'auto',
                        //     block: 'start',
                        // });
                    } else {
                        console.log("Element not found for index:", lastUnitWithCompletedTaskIndex);
                        setHasScrolled(true);
                    }
                }, 500); // Adjust the delay as needed
                setHasScrolled(true);
                return
            } else {
                console.log("No unit contains a task with the specified last_unit_id.");
                setHasScrolled(true);
            }
            // if the user hasnt been working on a previous unit then proceed normally
        } else {
            // ensure we have an index for a unit that they have at least one task completed in
            if (lastUnitWithCompletedTaskIndex !== -1) {
                // use delay to ensure scrolling
                setTimeout(() => {
                    // retrieve the current unit
                    const element = unitRefs.current[lastUnitWithCompletedTaskIndex]?.current;
                    if (element) {
                        // scroll to unit using element hash
                        window.location.hash = element.id
                        // element.scrollIntoView({
                        //     behavior: 'auto',
                        //     block: 'start',
                        // });
                    } else {
                        console.log("Element not found for index:", lastUnitWithCompletedTaskIndex);
                        setHasScrolled(true);
                    }
                }, 500); // Adjust the delay as needed
                setHasScrolled(true);
            }
        }
    }, [unitData, hasScrolled]);

    // reset hash state on refresh
    useEffect(() => {
        const currentUrl = window.location.href;
        const urlWithoutHash = currentUrl.split('#')[0]; // Split the URL on '#' and take the first part.

        // Replace the current history entry.
        // The first parameter is the state object which we don't need to modify,
        // the second parameter is the title (most browsers don't use this but it's required),
        // and the third parameter is the new URL.
        window.history.replaceState(null, '', urlWithoutHash);
    }, []);



    const items = [1, 2];

    const [openSpeedDial, setOpenSpeedDial] = useState(null);
    const [anchorElDetour, setAnchorElDetour] = useState(null);
    const [anchorElDesc, setAnchorElDesc] = useState(null);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const [popupLoading, setPopupLoading] = useState(false)
    const [detours, setDetours] = useState<Unit[]>([])

    const [taskId, setTaskId] = useState("")

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    //@ts-ignore
    const handleMouseEnter = (id) => () => setOpenSpeedDial(id);
    const handleMouseLeave = () => setOpenSpeedDial(null);

    const dispatch = useAppDispatch();

    const [taskDescription, setTaskDescription] = useState("")
    const [taskTitle, setTaskTitle] = useState("")
    const [currentTask, setCurrentTask] = useState(false)
    //@ts-ignore
    const handleClickDesc = (description, title, taskID, current) => (event) => {
        setTaskTitle(title)
        setTaskDescription(description)
        setTaskId(taskID)
        setCurrentTask(current)
        setAnchorElDesc(event.currentTarget);
    };
    const handleDetourClose = () => {
        setDetours([])
        setAnchorElDetour(null);
    };

    const handleDescClose = () => {
        setAnchorElDesc(null);
    };

    const handleLanguage = (lang: string) => {
        switch (lang.toLowerCase()) {
            case "python":
            case "py":
                return <PythonOriginal size={"80px"}/>
            case "golang":
            case "go":
                return <GoPlain size={"80px"}/>
            case "rust":
            case "rs":
                return <RustOriginal size={"80px"}/>
            case "cpp":
            case "c++":
            case "cc":
            case "cxx":
                return <CplusplusPlain size={"80px"}/>
            case "javascript":
            case "js":
                return <JavascriptPlain size={"80px"}/>
            case "c#":
            case "csharp":
            case "cs":
                return <CsharpPlain size={"80px"}/>
            default:
                return null
        }
    }

    const handleIcon = (item: any, index: any, firstIncomplete: any) => {
        if (item.completed) {
            return (
                <AwesomeButton style={{
                    width: "10em",
                    height: "10em",
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    '--button-default-height': '70px',
                    '--button-primary-color': "#ffef62",
                    '--button-primary-color-dark': "#afa33d",
                    '--button-primary-color-light': "#dfce53",
                    '--button-primary-color-active': "#ffef62",
                    '--button-primary-color-hover': "#FFFCAB",
                    '--button-default-font-size': '14px',
                    '--button-default-border-radius': '80%',
                    '--button-horizontal-padding': '3px',
                    '--button-raise-level': '12px',
                    '--button-hover-pressure': '3',
                    '--transform-speed': '0.275s',
                }} type="primary" href={`/byte/${item.code_source_id}?journey`}>
                    <CheckIcon fontSize="large" sx={{width: '2em', height: '2em'}}/>
                </AwesomeButton>

            );
        } else if (index === firstIncomplete) {
            return (
                <AwesomeButton style={{
                    width: "10em",
                    height: "10em",
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    '--button-default-height': '70px',
                    '--button-primary-color': "#29C18C",
                    '--button-primary-color-dark': "#1c8762",
                    '--button-primary-color-light': "#1c8762",
                    '--button-primary-color-active': "#1c8762",
                    '--button-primary-color-hover': "#29C18C",
                    '--button-default-font-size': '14px',
                    '--button-default-border-radius': '80%',
                    '--button-horizontal-padding': '3px',
                    '--button-raise-level': '12px',
                    '--button-hover-pressure': '3',
                    '--transform-speed': '0.275s',
                }} type="primary"
                               href={`/byte/${item.code_source_id}?journey`}
                >
                    {outOfHearts ? <Lock fontSize="large" sx={{width: '2em', height: '2em'}}/> :handleLanguage(item.lang)}
                </AwesomeButton>
            );
        } else {
            return (
                <AwesomeButton style={{
                    width: "10em",
                    height: "10em",
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    '--button-default-height': '70px',
                    '--button-primary-color': "#b0b0b0",
                    '--button-primary-color-dark': "#808080",
                    '--button-primary-color-light': "#808080",
                    '--button-primary-color-active': "#808080",
                    '--button-primary-color-hover': "#b0b0b0",
                    '--button-default-font-size': '14px',
                    '--button-default-border-radius': '80%',
                    '--button-horizontal-padding': '3px',
                    '--button-raise-level': '12px',
                    '--button-hover-pressure': '3',
                    '--transform-speed': '0.275s',
                }} type="primary">
                    <QuestionMarkIcon fontSize="large" sx={{width: '2em', height: '2em'}}/>
                </AwesomeButton>
            );
        }
    }


    const openDetour = Boolean(anchorElDetour);
    const openDesc = Boolean(anchorElDesc);

    //@ts-ignore
    const CurvedPath = ({ points }) => {
        const curveDepth = 70;
        let minX = Math.min(...points.map((p: { x: any; }) => p.x));
        let maxX = Math.max(...points.map((p: { x: any; }) => p.x));
        let minY = Math.min(...points.map((p: { y: any; }) => p.y));
        let maxY = Math.max(...points.map((p: { y: any; }) => p.y));

        // Adjust the min and max to include the curve depth and ensure the path does not clip
        minX -= curveDepth;
        maxX += curveDepth;
        minY -= curveDepth;
        maxY += curveDepth;

        const d = points.map((point: { x: any; y: any; }, i: number, arr: any[]) => {
            if (i === 0) {
                return `M${point.x},${point.y}`;
            } else {
                const prev = arr[i - 1];
                const midX = (prev.x + point.x) / 2;
                const controlPointX1 = midX + (i % 2 === 0 ? -curveDepth : curveDepth);
                const controlPointX2 = midX + (i % 2 === 0 ? -curveDepth : curveDepth);
                return `C${prev.x},${prev.y} ${controlPointX1},${prev.y} ${point.x},${point.y}`;
            }
        }).join(' ');

        // Calculate viewBox dimensions
        const width = maxX - minX;
        const height = maxY - minY;

        return (
            <svg viewBox={`${minX} ${minY} ${width} ${height}`} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                <path d={d} stroke="#008866" strokeWidth="12" fill="none" strokeDasharray="30,10" />
            </svg>
        );
    };




    const TaskDescription = () => {
        return (
            <>
                <Box sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <Typography sx={{textTransform: "none"}} variant={"h5"}>
                        {taskTitle}
                    </Typography>
                </Box>
                <Box sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    flexDirection: "column",
                    pt: 4,
                    height: "20vh"
                }}>
                    <Typography
                        sx={{textTransform: "none", textAlign: 'justify', marginLeft: '28px', marginRight: '28px'}}
                        variant={"h6"}>
                        {taskDescription}
                    </Typography>

                </Box>
                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                    {(currentTask)
                        ?
                        <AwesomeButton style={{
                            width: "auto",
                            //@ts-ignore
                            '--button-primary-color': theme.palette.primary.main,
                            '--button-primary-color-dark': theme.palette.primary.dark,
                            '--button-primary-color-light': theme.palette.primary.dark,
                            //@ts-ignore
                            '--button-primary-color-active': theme.palette.primary.dark,
                            //@ts-ignore
                            '--button-primary-color-hover': theme.palette.primary.main,
                            '--button-default-border-radius': "24px",
                            '--button-hover-pressure': "4",
                            height: "10vh",
                            '--button-raise-level': "10px"
                        }} type="primary" href={`/byte/${taskId}?journey`}>
                            <h1 style={{fontSize: "2vw", paddingRight: "1vw", paddingLeft: "1vw"}}>
                                Start
                            </h1>
                        </AwesomeButton>
                        :
                        <AwesomeButton style={{
                            width: "auto",
                            //@ts-ignore
                            '--button-primary-color': theme.palette.secondary.main,
                            '--button-primary-color-dark': theme.palette.secondary.dark,
                            '--button-primary-color-light': theme.palette.secondary.dark,
                            //@ts-ignore
                            '--button-primary-color-active': theme.palette.secondary.dark,
                            //@ts-ignore
                            '--button-primary-color-hover': theme.palette.secondary.main,
                            '--button-default-border-radius': "24px",
                            '--button-hover-pressure': "4",
                            height: "10vh",
                            '--button-raise-level': "10px"
                        }} type="primary" href={`/byte/${taskId}?journey`}>
                            <h1 style={{fontSize: "2vw", paddingRight: "1vw", paddingLeft: "1vw"}}>
                                Review
                            </h1>
                        </AwesomeButton>}
                </Box>
            </>

        )
    }

    const taskPopups = () => {
        return (
            <>
                <Popover
                    id={openDesc ? 'simple-popover' : undefined}
                    open={openDesc}
                    anchorEl={anchorElDesc}
                    onClose={handleDescClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'center',
                        horizontal: 'left',
                    }}
                    PaperProps={{
                        style: {
                            boxShadow: 'none',
                            borderRadius: "30px",
                        }
                    }}
                >
                    <Box sx={{maxWidth: "30vw", maxHeight: '40vh', m: 3}}>
                        <Box sx={{display: "flex", justifyContent: "right", alignItems: "right"}}>
                            <Button onClick={handleDescClose}>
                                <CloseIcon/>
                            </Button>
                        </Box>
                        {TaskDescription()}
                    </Box>
                </Popover>
            </>
        )
    }

    const Tasks = (item: any, index: any, firstIncomplete: any) => {
        return (
            <>

                <SpeedDial
                    sx={{
                        '& .MuiSpeedDial-fab': {
                            width: "130px",
                            height: "130px",
                            backgroundColor: 'transparent',
                            boxShadow: "none",
                            '&:hover': {
                                backgroundColor: 'transparent',
                            },
                        },
                    }}
                    ariaLabel={`SpeedDial ${item.name}`}
                    icon={handleIcon(item, index, firstIncomplete)}
                    direction="right"
                    open={openSpeedDial === item._id}
                >
                    {/*//@ts-ignore*/}
                    <SpeedDialAction
                        icon={<ArticleIcon/>}
                        //@ts-ignore
                        tooltipTitle="Info"
                        onClick={handleClickDesc(item.description, item.name, item.code_source_id, (index === firstIncomplete))}
                        sx={{
                            backgroundColor: "#52ad94",
                            color: "white"
                        }}
                    />
                </SpeedDial>

                {taskPopups()}
            </>
        )
    }

    // @ts-ignore
    const journeyStops = (metadata: Task[]) => {
        const gap = 10;
        const speedDialHeight = 130; // Height of each SpeedDial plus gap
        const points = metadata.map((item: any, index: number) => ({
            x: index % 2 === 0 ? 100 : 300,
            y: speedDialHeight * index + speedDialHeight / 2
        }));

        const firstIncompleteIndex = metadata.findIndex((item: { completed: any; }) => !item.completed);

        return (
            <Box sx={{ position: 'relative', width: '100%', height: `${points.length * speedDialHeight}px` }}>
                <CurvedPath points={points} />
                {metadata.map((item: { _id: React.Key | null | undefined; }, index: number) => (
                    <div
                        key={item._id}
                        style={{
                            position: 'absolute',
                            top: `${points[index].y - speedDialHeight / 2}px`,
                            left: `${index % 2 === 0 ? '150px' : '350px'}`,
                            //transform: 'translateY(-50%)',
                        }}
                        onMouseEnter={handleMouseEnter(item._id)}
                        onMouseLeave={handleMouseLeave}
                    >
                        {Tasks(item, index, firstIncompleteIndex)}
                    </div>
                ))}
            </Box>
        );
    };



    const GetStarted = () => {
        const [selectedJourney, setSelectedJourney] = useState('');
        const [firstProject, setFirstProject] = useState('');

        const handleStartJourney = async () => {
            setLoadingMapData(true)

            let res = await fetch(
                `${config.rootPath}/api/journey/addUnitToMap`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        unit_id: firstProject
                    }),
                    credentials: 'include'
                }
            ).then(async (response) => response.json())

            if (res && res.success) {
                console.log("Unit added successfully!");
                getTasks().then(() => {
                    setLoadingMapData(false)
                });
            } else {
                console.error("Failed to add unit to map");
                return
            }
        };

        // TODO choose the ID's for the starting units
        const journeys = {
            python: {
                title: 'Python',
                description: 'Python is versatile and easy to learn, making it great for beginners and useful in areas like web development, data analysis, and automation.',
                img: <PythonOriginal size={"100px"}/>,
                id: "1769720326918242304",
                favorite: true
            },
            golang: {
                title: 'Golang',
                description: 'Designed by Google, Go is fast and efficient, perfect for building reliable and scalable software systems like servers and databases.',
                img: <GoOriginal size={"100px"}/>,
                id: "1767257082752401408",
                favorite: false
            },
            js: {
                title: 'JavaScript',
                description: 'JavaScript is essential for creating interactive websites and is widely used because it runs in any web browser, making it indispensable for web development.',
                img: <JavascriptOriginal size={"100px"}/>,
                id: "1775630331836104704",
                favorite: false
            },
            rust: {
                title: 'Rust',
                description: 'Rust is known for its safety and speed, ideal for programming where performance and reliability are critical, such as in operating systems and game engines.',
                img: <RustOriginal size={"100px"}/>,
                id: "1775923721366667264",
                favorite: false
            },
            csharp: {
                title: 'C#',
                description: 'C# is powerful for building a variety of applications, especially for Windows platforms, making it a go-to for desktop software, games, and mobile apps.',
                img: <CsharpOriginal size={"100px"}/>,
                id: "",
                favorite: false
            },
            cpp: {
                title: 'C++',
                description: 'C++ is highly efficient and versatile, favored for applications where speed and resource control are critical, such as video games or real-time systems.',
                img: <CplusplusOriginal size={"100px"}/>,
                id: "",
                favorite: false
            }
        };

        const selectJourney = (journey: React.SetStateAction<string>, id: string) => {
            setSelectedJourney(journey);
            setFirstProject(id)
        };

        return (
            <Box
                sx={{
                    flexGrow: 1,
                    height: '93vh',
                    position: 'relative', // Make the container relative to host the absolute-positioned Image
                    overflow: 'hidden' // Ensures that children are contained within the Box
                }}
            >
                <Image
                    src={journeyMap} // The source of the background image
                    alt="Journey Map Background"
                    layout="fill" // Makes the image cover the entire container
                    objectFit="cover" // Ensures the image covers the entire container while maintaining aspect ratio
                    objectPosition="center" // Centers the image
                    priority // Optional: loads the image eagerly
                    style={{
                        zIndex: -1 // Places the image behind the Box contents
                    }}
                />
                <Box
                    sx={{
                        flexGrow: 1,
                        height: '93vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        position: 'relative' // Positions child elements relative to this Box
                    }}
                >
                    <Box
                        sx={{
                            height: '20vh',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            mb: 2,
                            color: 'white'
                        }}
                    >
                        <Typography variant="h4">Choose Your Lane</Typography>
                        <Typography
                            variant="body1"
                            textTransform="none"
                            sx={{
                                width: '45vw',
                                textAlign: 'center',
                                mt: 3
                            }}
                        >
                            Journey&#39;s are a structured way to learn programming. Select the starting path you would like to take in your Journey. You can always take a detour at any time to switch it up.
                        </Typography>
                    </Box>
                    <Grid container spacing={2} sx={{ height: '60vh' }}>
                        <Grid item xs={2} container justifyContent="center" alignItems="center" />
                        <Grid
                            item
                            xs={8}
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            sx={{ gap: 12 }}
                        >
                            {Object.entries(journeys)
                                .filter(([key, value]) => value.id !== undefined && value.id !== null && value.id !== '')
                                .map(([key, value]) => (
                                    <Box key={key} textAlign="center" sx={{ position: 'relative', width: '10vw' }}>
                                        <Typography
                                            variant="subtitle1"
                                            component="div"
                                            sx={{ color: selectedJourney === key ? '#29C18C' : 'white' }}
                                        >
                                            {value.title}
                                        </Typography>
                                        <Button
                                            variant={'outlined'}
                                            onClick={() => selectJourney(key, value.id)}
                                            sx={{
                                                borderRadius: '20px',
                                                width: '100%',
                                                height: '10vw',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                borderColor: selectedJourney === key ? '#29C18C' : 'white',
                                                backgroundColor: selectedJourney === key ? '#282826' : '',
                                                '&:hover': {
                                                    backgroundColor: selectedJourney === key ? '#282826' : '',
                                                    borderColor: selectedJourney === key ? '#29C18C' : '#29C18C'
                                                }
                                            }}
                                        >
                                            {value.img}
                                        </Button>
                                        {value.favorite && (
                                            <Chip
                                                icon={<StarIcon sx={{ color: '#ffd700 !important' }} />}
                                                label="Most Popular"
                                                size="small"
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: -28,
                                                    right: 'calc(5vw - 57.7px)',
                                                    color: '#ffd700',
                                                    border: '1px solid #ffd700'
                                                }}
                                            />
                                        )}
                                    </Box>
                                ))}
                        </Grid>
                        <Grid item xs={2} container justifyContent="center" alignItems="center">
                        </Grid>
                        <Grid item xs={12} sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            alignItems: 'center',
                            mt: 2
                        }}>
                            <Typography variant="body1"
                                        sx={{textAlign: 'center', marginBottom: '20px', width: '45vw', color: "white"}}>
                                {/*@ts-ignore*/}
                                {selectedJourney && journeys[selectedJourney].description}
                            </Typography>
                            {selectedJourney && (
                                <MuiAwesomeButton
                                    backgroundColor={theme.palette.primary.main}
                                    hoverColor={theme.palette.primary.light}
                                    secondaryColor={theme.palette.primary.dark}
                                    textColor={theme.palette.primary.dark}
                                    loading={loadingMapData}
                                    onClick={handleStartJourney}
                                >
                                    <h1 style={{ fontSize: '2vw', paddingRight: '1vw', paddingLeft: '1vw' }}>
                                        Start Journey
                                    </h1>
                                </MuiAwesomeButton>
                            )}
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        );
    }

    const nextUnitPreview = () => {
        return (
            <Box sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                zIndex: 1,
            }}>
                {nextUnit && (
                    <Grid container>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            borderRadius: '30px', position: 'relative',
                        }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                backgroundColor: nextUnit.color,
                                borderRadius: '30px',
                                position: 'relative',
                                zIndex: 1,
                                mt: 1,
                                mb: 2,
                                width: "625px",
                                paddingBottom: '30px'
                            }}>
                                <Box sx={{p: 2, }}>
                                    <Typography variant="h5" sx={{color: getTextColor(nextUnit.color)}}>{nextUnit.name}</Typography>
                                </Box>
                                {journeyStops(nextUnit.tasks)}
                            </Box>
                        </Grid>
                        <Box sx={{
                            position: 'absolute', // This is the 'wall' overlay.
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: 2,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backdropFilter: "blur(2.8px)",
                            "-webkit-backdrop-filter": "blur(2.8px)",
                        }}>
                        </Box>
                        <Box sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: 2,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <MuiAwesomeButton
                                backgroundColor={theme.palette.primary.main}
                                hoverColor={theme.palette.primary.light}
                                secondaryColor={theme.palette.primary.dark}
                                textColor={theme.palette.primary.dark}
                                loading={loadingMapData}
                                onClick={handleAddUnitToMap}
                            >
                                <h1 style={{fontSize: "2vw", paddingRight: "1vw", paddingLeft: "1vw", width: "20vw",
                                    height: "50px", justifyContent: "center", alignItems: "center", display: "flex"}}>
                                    Add Unit to Map
                                </h1>
                            </MuiAwesomeButton>
                        </Box>
                    </Grid>
                )}
            </Box>
        )
    }

    const [expandedCard, setExpandedCard] = useState(null);

    const handleToggleClick = (index: any) => {
        if (expandedCard === index) {
            setExpandedCard(null);
        } else {
            setExpandedCard(index);
        }
    };

    const [isHovered, setIsHovered] = useState(false);

    const unitHandout = (unit: any, index: any) => {
        const cardStyles = (index: number, unitColor: string) => ({
            borderRadius: '30px',
            ...themeHelpers.frostedGlass,
            backgroundColor: hexToRGBA(unitColor, 1),
            borderColor: 'none',
            overflow: 'hidden',
            position: 'absolute',
            zIndex: expandedCard === index ? 99 : 11,
            boxShadow: expandedCard === index ? '' : `inset 0px -50px 75px -25px ${hexToRGBA(unitColor, 0.5)}`,
        });

        return (
            <Card sx={cardStyles(index, unit.color)}>
                <Box sx={{maxHeight: expandedCard === index ? 'none' : '45vh', overflow: 'hidden'}}>
                    <Box sx={{backgroundColor: 'rgba(255,255,255,0.8)', textAlign: 'center'}}>
                        <Typography variant="h4" sx={{color: 'black'}}>Handout</Typography>
                    </Box>
                    <MarkdownRenderer
                        markdown={unit.handout}
                        style={{
                            color: getTextColor(unit.color),
                            margin: "20px",
                            fontSize: "0.8rem",
                            width: "fit-content",
                            maxWidth: "475px",
                        }}
                    />
                </Box>
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: 43,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backdropFilter: expandedCard === index ? 'none' : 'blur(1px)',
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={() => handleToggleClick(index)}
                        sx={{
                            zIndex: 2,
                            opacity: 0.7,
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            borderRadius: '50%',
                            color: 'black',
                            minWidth: 30,
                            height: 30,
                            padding: '5px',
                        }}
                    >
                        {expandedCard === index ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </Button>
                </Box>
            </Card>
        )
    }

    const handleDetourSelection = (unit: any) => {
        //@ts-ignore
        let firstIncompleteTask = unit.tasks.find(task => !task.completed);
        if (firstIncompleteTask === undefined) {
            firstIncompleteTask = unit.tasks[unit.tasks.length - 1]
        }

        let updateState = Object.assign({}, initialJourneyDetourStateUpdate);
        // update file in state update
        updateState.id = firstIncompleteTask._id;
        // execute state update
        updateJourneyDetourState(updateState)
        dispatch(updateJourneyDetourState(updateState))

        return (
            <DetourSelection detours={detours} color={unit.color} textColor={getTextColor(unit.color)}/>
        )
    }

    const handleMap = (unit: any, index: any) => {
        const lastIndex = index === unitData.length - 1
        const allCompleted = (tasks: Task[]) => tasks.every(task => task.completed);
        const atLeastOneCompleted = (tasks: Task[]) => tasks.some(task => task.completed);

        const isEven = index % 2 === 0
        const leftStyle = isEven ? "center" : "start"
        const rightStyle = isEven ? "start" : "center"

        const conditionalHandout = (tasks: Task[]) => {
            if (allCompleted(tasks)) return <></>;
            if (atLeastOneCompleted(tasks)) return <>{unitHandout(unit, index)}</>;
            return unitHandout(unit, index);
        };

        return (
            <>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={4} sx={{
                    display: 'flex',
                    justifyContent: (lastIndex && isEven) ? 'start' : leftStyle,
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    {isEven
                        ?
                        lastIndex ? handleDetourSelection(unit) : <JourneyPortals currentIndex={index}/>
                        :
                        conditionalHandout(unit.tasks)
                    }
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={6} xl={4} sx={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    borderRadius: '30px', position: 'relative',
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: unit.color,
                        borderRadius: '30px',
                        position: 'relative',
                        zIndex: 10,
                        width: "625px",
                        paddingBottom: '30px'
                    }}>
                        {(allCompleted(unit.tasks))
                            ?
                            <Box sx={{
                                position: 'absolute',
                                bottom: 8,
                                right: 8,
                                borderRadius: '50%',
                                backgroundColor: "#41c18c",
                                width: 55,
                                height: 55,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <CheckIcon style={{color: 'white'}}/>
                            </Box>
                            :
                            null
                        }
                        <Box sx={{p: 2, }}>
                            <Typography variant="h5" sx={{color: getTextColor(unit.color)}}>{unit.name}</Typography>
                        </Box>
                        {journeyStops(unit.tasks)}
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={4} sx={{
                    display: 'flex',
                    justifyContent: lastIndex ? 'start' : rightStyle,
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    {isEven
                        ?
                        conditionalHandout(unit.tasks)
                        :
                        lastIndex ? handleDetourSelection(unit) : <JourneyPortals currentIndex={index}/>
                    }
                </Grid>
            </>
        )
    }

    const userJourney = () => {
        return (
            <Box sx={{overflow: 'hidden'}}>
                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', m: 2}}>
                    <Typography variant="h2" sx={{color: 'text.primary', m: 1}}>Your Journey</Typography>
                </Box>
                {loading && (
                    <div style={{width: "100%", display: "flex", justifyContent: "center", paddingBottom: "40px"}}>
                        <CircularProgress size={48}/>
                    </div>
                )}
                {unitData.map((unit, index) => (
                    <section key={unit._id} id={unit._id} ref={unitRefs.current[index]}>
                        <Grid container spacing={2}>
                            {handleMap(unit, index)}
                        </Grid>
                        <Box sx={{paddingBottom: '100px'}}/>
                    </section>
                ))}
                {nextUnitPreview()}
            </Box>
        );
    };

    const pageContent = () => {
        if (isMobile) {
            return <JourneyMainMobile/>;
        } else {
            if (loadingMainPage) {
                return null
            }
            if (activeJourney) {
                return userJourney();
            }
            return <GetStarted/>;
        }
    };

    return <>
        {pageContent()}
        <GoProDisplay open={proPopupOpen} onClose={() => setProPopupOpen(false)}/>
    </>


}

function getTextColor(backgroundColor: string): string {
    // This function assumes the background color is in hex format (e.g., #ffffff)

    // Convert hex to RGB
    const rgb = parseInt(backgroundColor.substring(1), 16); // Convert hex to decimal
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    // Calculate the luminance
    const luminance = 0.2126 * (r / 255) ** 2.2 + 0.7152 * (g / 255) ** 2.2 + 0.0722 * (b / 255) ** 2.2;

    // Return white for dark backgrounds and black for light backgrounds
    return luminance < 0.5 ? 'white' : 'black';
}
function hexToRGBA(hex: any, alpha = 1) {
    let r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default JourneyMain;