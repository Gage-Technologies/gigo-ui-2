'use client'
import React, {createRef, useEffect, useRef, useState} from 'react';
import {theme} from "@/theme";
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Grid, IconButton, Modal,
    Paper,
    Popover,
    Slide,
    SpeedDial,
    Tooltip,
    Typography
} from "@mui/material";
import {useAppDispatch, useAppSelector} from "@/reducers/hooks";
import 'react-awesome-button/dist/styles.css';
import '@/components/Journey/button.css'
import '@/components/Journey/background.css'
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from '@mui/icons-material/Check';
import DescriptionIcon from '@mui/icons-material/Description';
import {AwesomeButton} from 'react-awesome-button';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import config from "@/config";
import {selectAuthStateId} from "@/reducers/auth/auth";
import {initialJourneyDetourStateUpdate, updateJourneyDetourState} from "@/reducers/journeyDetour/journeyDetour";
import MarkdownRenderer from "@/components/Markdown/MarkdownRenderer";
import MuiAwesomeButton from "@/components/MuiAwesomeButton";
import {
    CplusplusOriginal,
    CplusplusPlain,
    CsharpOriginal,
    CsharpPlain,
    GoOriginal,
    GoPlain,
    JavascriptOriginal,
    JavascriptPlain,
    PythonOriginal,
    RustOriginal
} from "devicons-react";
import {Task, Unit} from "@/models/journey";
import DetourSelection from "@/components/Journey/DetourSelection";
import StarIcon from "@mui/icons-material/Star";
import FollowTheSignsIcon from '@mui/icons-material/FollowTheSigns';
import Fab from "@mui/material/Fab";
import GoProDisplay from '@/components/GoProDisplay';
import {Article, Lock} from '@mui/icons-material';
import { selectOutOfHearts } from '@/reducers/hearts/hearts';

function JourneyMainMobile() {
    const [loadingMapData, setLoadingMapData] = useState(false);
    const [contentLoaded, setContentLoaded] = useState(true)

    const userId = useAppSelector(selectAuthStateId) as string

    const outOfHearts = useAppSelector(selectOutOfHearts);

    const [unitData, setUnitData] = useState<Unit[]>([])
    const [nextUnit, setNextUnit] = useState<Unit>()
    const [taskData, setTaskData] = useState<Task[]>([])
    const unitRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);
    const [currentUnit, setCurrentUnit] = useState<string | null>(null);
    const [proPopupOpen, setProPopupOpen] = useState(false)
    const [selectedHandout, setSelectedHandout] = useState<string | null>(null)


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
            unitRefs.current = slicedUnits.map((_, i) => unitRefs.current[i] ?? createRef<HTMLDivElement>());
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

    }

    useEffect(() => {
        getTasks()
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
            unit.tasks.some(task => task.completed) ? index : acc, -1
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
                const taskFound = unit.tasks.some(task => task.code_source_id === lastUnitId);
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

    const handleLanguage = (lang: string, buttonSize: number) => {
        switch (lang.toLowerCase()) {
            case "python":
            case "py":
                return <PythonOriginal size={`${buttonSize * 0.8}px`}/>
            case "golang":
            case "go":
                return <GoPlain size={`${buttonSize * 0.8}px`}/>
            case "rust":
            case "rs":
                return <RustOriginal size={`${buttonSize * 0.8}px`}/>
            case "cpp":
            case "c++":
            case "cc":
            case "cxx":
                return <CplusplusPlain size={`${buttonSize * 0.8}px`}/>
            case "javascript":
            case "js":
                return <JavascriptPlain size={`${buttonSize * 0.8}px`}/>
            case "c#":
            case "csharp":
            case "cs":
                return <CsharpPlain size={`${buttonSize * 0.8}px`}/>
            default:
                return null
        }
    }

    const handleIcon = (item: any, index: any, firstIncomplete: any, buttonSize: any) => {
        if (item.completed) {
            return (
                <AwesomeButton style={{
                    width: `${buttonSize}px`,
                    height: `${buttonSize}px`,
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
                    '--button-raise-level': `${buttonSize * 0.12}px`,
                    '--button-hover-pressure': '3',
                    '--transform-speed': '0.275s',
                }} type="primary" href={item.code_source_type === 4 ? `/quiz/${item.code_source_id}?journey` : `/byte/${item.code_source_id}?journey`}>
                    <CheckIcon fontSize="large" sx={{width: `${buttonSize * 0.8}px`, height: `${buttonSize * 0.8}px`}}/>
                </AwesomeButton>

            );
        } else if (index === firstIncomplete) {
            return (
                <AwesomeButton style={{
                    width: `${buttonSize}px`,
                    height: `${buttonSize}px`,
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
                    '--button-raise-level': `${buttonSize * 0.12}px`,
                    '--button-hover-pressure': '3',
                    '--transform-speed': '0.275s',
                }} type="primary"
                href={item.code_source_type === 4 ? `/quiz/${item.code_source_id}?journey` : `/byte/${item.code_source_id}?journey`}
                >
                    {outOfHearts ? <Lock fontSize="large" sx={{width: `${buttonSize * 0.8}px`, height: `${buttonSize * 0.8}px`}}/> :handleLanguage(item.lang, buttonSize)}
                </AwesomeButton>
            );
        } else {
            return (
                <AwesomeButton style={{
                    width: `${buttonSize}px`,
                    height: `${buttonSize}px`,
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
                    '--button-raise-level': `${buttonSize * 0.12}px`,
                    '--button-hover-pressure': '3',
                    '--transform-speed': '0.275s',
                }} type="primary">
                    <QuestionMarkIcon fontSize="large" sx={{width: `${buttonSize * 0.8}px`, height: `${buttonSize * 0.8}px`}}/>
                </AwesomeButton>
            );
        }
    }


    const openDetour = Boolean(anchorElDetour);
    const openDesc = Boolean(anchorElDesc);

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

    const Tasks = (item: any, index: any, firstIncomplete: any, buttonSize: any) => {
        return (
            <>
                <SpeedDial
                    sx={{
                        '& .MuiSpeedDial-fab': {
                            width: `${buttonSize}px`,
                            height: `${buttonSize}px`,
                            backgroundColor: 'transparent',
                            boxShadow: "none",
                            '&:hover': {
                                backgroundColor: 'transparent',
                            },
                        },
                    }}
                    ariaLabel={`SpeedDial ${item.name}`}
                    icon={handleIcon(item, index, firstIncomplete, buttonSize)}
                    direction="right"
                    open={openSpeedDial === item._id}
                >
                </SpeedDial>

                {taskPopups()}
            </>
        )
    }

    const journeyStops = (unit: Unit, metadata: Task[]) => {
        let buttonSpacing = 40; // space between buttons
        let buttonSize = 130; // size of each button
        let maxOffset = 200; // maximum offset from center
        const offsetBase = 4; // number of tasks before repeating the pattern

        if (window !== undefined) {
            buttonSize = Math.max(Math.min(window.innerWidth * 0.2, 130), 55);
            buttonSpacing = Math.max(Math.min(buttonSize * 0.3, 40), 16);
            maxOffset = Math.max(Math.min(buttonSize * 1.3, 170), 84);
            console.log("buttonSize: ", buttonSize);
            console.log("buttonSpacing: ", buttonSpacing);
            console.log("maxOffset: ", maxOffset);
        }

        // get base offset by summing all the task counts of the previous units
        const unitIdx = unitData.findIndex((u: Unit) => u._id === unit._id)
        let baseOffset = 0;
        if (unitIdx > 0) {
            baseOffset = unitData.slice(0, unitIdx).reduce((acc, unit) => acc + unit.tasks.length, 0);
        }
    
        const calculateOffset = (index: number) => {
            let lastCenter = index;
            while (lastCenter > 0 && lastCenter % offsetBase !== 0) {
                lastCenter--;
            }
            const inverse = (lastCenter / offsetBase) % 2 === 0;
    
            let scalingFactor = (index - lastCenter) / (offsetBase / 2);
            if (index % offsetBase > Math.floor(offsetBase / 2)) {
                let stepsFromMidpoint = index % offsetBase - Math.floor(offsetBase / 2);
                scalingFactor = Math.abs(index - (stepsFromMidpoint * 2) - lastCenter) / (offsetBase / 2);
            }
    
            const offset = inverse ? maxOffset : -maxOffset;
            return offset * scalingFactor;
        };
    
        const firstIncompleteIndex = metadata.findIndex((item: { completed: any; }) => !item.completed);
    
        return (
            <Box sx={{ position: 'relative', width: '100%', minHeight: `${metadata.length * (buttonSize + buttonSpacing)}px` }}>
                {metadata.map((item: Task, index: number) => (
                    <Box
                        key={item._id}
                        sx={{
                            position: 'absolute',
                            top: `${index * (buttonSize + buttonSpacing)}px`,
                            left: `calc(50% + ${calculateOffset(index + baseOffset)}px)`,
                            transform: 'translateX(-50%)',
                        }}
                        onMouseEnter={handleMouseEnter(item._id)}
                        onMouseLeave={handleMouseLeave}
                    >
                        {Tasks(item, index, firstIncompleteIndex, buttonSize)}
                    </Box>
                ))}
            </Box>
        );
    };


    const GetStarted = () => {
        const [selectedJourney, setSelectedJourney] = useState('');
        const [firstProject, setFirstProject] = useState('');
        const [loadingMapData, setLoadingMapData] = useState(false);

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
                id: "example_id_csharp",
                favorite: false
            },
            cpp: {
                title: 'C++',
                description: 'C++ is highly efficient and versatile, favored for applications where speed and resource control are critical, such as video games or real-time systems.',
                img: <CplusplusOriginal size={"100px"}/>,
                id: "example_id_cpp",
                favorite: false
            }
        };

        const selectJourney = (journeyKey: React.SetStateAction<string>, id: React.SetStateAction<string>) => {
            setSelectedJourney(journeyKey);
            setFirstProject(id);
        };

        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'start',
                flexGrow: 1
            }}>
                <Typography variant="h4" sx={{ color: "white", mb: 2 }}>Choose Your Lane</Typography>
                <Typography variant="body1" sx={{ width: '90vw', textAlign: 'center', color: "white", mb: 3 }}>
                    Journeys are a structured way to learn programming. Select the starting path you would like to take in your Journey. You can always take a detour at any time to switch it up.
                </Typography>
                <Grid container spacing={2}>
                    {Object.entries(journeys).map(([key, value], index) => (
                        <Grid item xs={6} key={key}>
                            <Box textAlign="center" sx={{ width: '100%', p:1 }}>
                                <Typography variant="subtitle1" sx={{ color: selectedJourney === key ? "#29C18C" : 'white' }}>
                                    {value.title}
                                </Typography>
                                <Button variant="outlined" onClick={() => selectJourney(key, value.id)} sx={{
                                    borderRadius: "20px",
                                    width: '100%',
                                    height: '30vw',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    borderColor: selectedJourney === key ? "#29C18C" : 'white',
                                    backgroundColor: selectedJourney === key ? "#282826" : '',
                                    '&:hover': {
                                        backgroundColor: selectedJourney === key ? '#282826' : '',
                                        borderColor: selectedJourney === key ? "#29C18C" : '#29C18C',
                                    },
                                }}>
                                    {value.img}
                                </Button>
                                {value.favorite && (
                                    <Chip
                                        icon={<StarIcon sx={{color: '#ffd700 !important'}}/>}
                                        label="Most Popular"
                                        size="small"
                                        sx={{
                                            color: '#ffd700',
                                            border: '1px solid #ffd700',
                                        }}
                                    />
                                )}
                            </Box>
                        </Grid>
                    ))}
                </Grid>
                {selectedJourney && (
                    <Box sx={{ mt: 2, pb: 2, width: '90vw', textAlign: 'center' }}>
                        <Typography variant="body1" sx={{ color: "white" }}>
                            {/*@ts-ignore*/}
                            {journeys[selectedJourney].description}
                        </Typography>
                        <Button
                            onClick={handleStartJourney}
                            sx={{
                                width: '50vw',
                                height: '8vh',
                                backgroundColor: "#29C18C",
                                color: "white",
                                mt: 2,
                                '&:hover': {
                                    backgroundColor: "#3ACF98",
                                }
                            }}>
                            Start Journey
                        </Button>
                    </Box>
                )}
            </Box>
        );
    };

    const nextUnitPreview = () => {
        return (
            <Box sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                zIndex: 1,
            }}>
                {nextUnit && (
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            backgroundColor: "transparent",
                            position: 'relative',
                            zIndex: 10,
                            width: "400px",
                            paddingTop: "16px"
                        }}>
                            <Box sx={{
                                p: 1.5, 
                                backgroundColor: nextUnit.color, 
                                borderRadius: '30px',
                                width: "calc(100vw - 40px)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginBottom: "16px",
                                position: "relative"
                            }}>
                                <Typography 
                                    variant="h5" 
                                    sx={{
                                        color: getTextColor(nextUnit.color),
                                        fontSize: "clamp(0.9rem, 3vw, 1.5rem)",
                                        paddingLeft: "55px", 
                                        paddingRight: "55px",
                                        textAlign: "center"
                                    }}
                                >
                                    {nextUnit.name}
                                </Typography>
                            </Box>
                            {journeyStops(nextUnit, nextUnit.tasks)}
                        </Box>
                        <Box sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: 98,
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
                            zIndex: 99,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <MuiAwesomeButton
                                backgroundColor={theme.palette.secondary.main}
                                hoverColor={theme.palette.secondary.light}
                                secondaryColor={theme.palette.secondary.dark}
                                textColor={theme.palette.secondary.dark}
                                loading={loadingMapData}
                                onClick={handleAddUnitToMap}
                            >
                                <Typography variant="h6" sx={{ fontSize: "clamp(1rem, 4vw, 1.5rem)", px: 2 }}>
                                    Add Unit to Map
                                </Typography>
                            </MuiAwesomeButton>
                        </Box>
                    </Box>
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
            <DetourSelection detours={detours} color={unit.color} textColor={getTextColor(unit.color)} width={'65vw'}/>
        )
    }

    const [openDetourPop, setOpenDetourPop] = useState(false);

    const handleMap = (unit: any, index: any) => {
        const lastIndex = index === unitData.length - 1
        const handleOpen = () => setOpenDetourPop(true);
        const handleClose = () => setOpenDetourPop(false);
        const allCompleted = (tasks: Task[]) => tasks.every(task => task.completed);

        return (
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: "transparent",
                    position: 'relative',
                    zIndex: 10,
                    width: "400px",
                }}>
                    <Box sx={{
                            p: 1.5, 
                            backgroundColor: unit.color, 
                            borderRadius: '30px',
                            width: "calc(100vw - 40px)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: "16px",
                            position: "relative"
                        }}>
                        <Typography 
                            variant="h5" 
                            sx={{
                                color: getTextColor(unit.color),
                                fontSize: "clamp(0.9rem, 3vw, 1.5rem)",
                                paddingLeft: "55px", 
                                paddingRight: "55px",
                                textAlign: "center"
                            }}
                        >
                            {unit.name}
                            {(allCompleted(unit.tasks))
                                ?
                                <Box sx={{
                                    position: 'absolute',
                                    bottom: 8,
                                    left: 8,
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
                            <Tooltip title={selectedHandout === unit._id ? "Close Handout" : "Show Handout"}>
                                <IconButton
                                    onClick={() => {
                                        if (selectedHandout === unit._id) {
                                            setSelectedHandout(null);
                                        } else {
                                            setSelectedHandout(unit._id);
                                        }
                                    }}
                                    sx={{
                                        position: 'absolute',
                                        bottom: 8,
                                        right: 8,
                                        height: 55,
                                        width: 55,
                                    }}
                                >
                                    <Article 
                                        fontSize="large" 
                                        sx={{
                                            color: selectedHandout === unit._id ? "grey" : getTextColor(unit.color)
                                        }}
                                    />
                                </IconButton>
                            </Tooltip>
                        </Typography>
                    </Box>
                    {journeyStops(unit, unit.tasks)}
                </Box>
                {lastIndex && (
                    <>
                        <Fab
                            onClick={handleOpen}
                            aria-label="launch-mobile"
                            sx={{ position: "fixed", bottom: 16, left: 16, zIndex: 100, boxShadow: 'none', backgroundColor: "#ef9558", color: "white" }}
                        >
                            <FollowTheSignsIcon />
                        </Fab>
                        <Modal
                            open={openDetourPop}
                            onClose={handleClose}
                            slotProps={{ backdrop: {
                                style: {
                                        backdropFilter: "blur(6.8px)",
                                        opacity: "0.9"
                                    }
                                }
                            }}
                        >
                            <Box sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: "90%",
                                bgcolor: 'background.paper',
                                boxShadow: 24,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: "30px"
                            }}>
                                {handleDetourSelection(unit)}
                            </Box>
                        </Modal>
                    </>
                )}
            </Box>
        )
    }

    const renderHandoutOverlay = () => {
        if (selectedHandout === null) {
            return null;
        }
        const unit = unitData.find(unit => unit._id === selectedHandout);
        if (!unit) {
            return null;
        }
    
        return (
            <Slide direction="up" in={selectedHandout !== null} mountOnEnter unmountOnExit>
                <Paper
                    elevation={4}
                    sx={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        maxHeight: '80vh',
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        backgroundColor: unit.color,
                        zIndex: 1300,
                        overflow: 'hidden',
                    }}
                >
                    <IconButton
                        onClick={() => {
                            setSelectedHandout(null);
                        }}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: getTextColor(unit.color),
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Box
                        sx={{
                            overflowY: 'auto',
                            maxHeight: 'calc(80vh - 48px)', // subtract the height of the close button
                            padding: '20px',
                        }}
                    >
                        <MarkdownRenderer
                            markdown={unit.handout}
                            style={{
                                color: getTextColor(unit.color),
                                fontSize: "0.8rem",
                                width: "fit-content",
                                maxWidth: "90vw",
                            }}
                        />
                    </Box>
                </Paper>
            </Slide>
        );
    };

    const userJourney = () => {
        return (
            <Box sx={{overflow: 'hidden'}}>
                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', m: 2}}>
                    <Typography variant="h3" sx={{color: 'text.primary', m: 1}}>Your Journey</Typography>
                </Box>
                {loading && (
                    <div style={{width: "100%", display: "flex", justifyContent: "center", paddingBottom: "40px"}}>
                        <CircularProgress size={48}/>
                    </div>
                )}
                {unitData.map((unit, index) => (
                    <section key={unit._id} id={unit._id} ref={unitRefs.current[index]}>
                            {handleMap(unit, index)}
                    </section>
                ))}
                {nextUnitPreview()}
            </Box>
        );
    };

    const pageContent = () => {
        if (loadingMainPage) {
            return null
        }
        if (activeJourney) {
            return userJourney();
        }
        return <GetStarted/>;
    };

    return <>
        {pageContent()}
        {renderHandoutOverlay()}
        <GoProDisplay open={proPopupOpen} onClose={() => setProPopupOpen(false)}/>
    </>
}

function hexToRGBA(hex: any, alpha = 1) {
    let r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default JourneyMainMobile;