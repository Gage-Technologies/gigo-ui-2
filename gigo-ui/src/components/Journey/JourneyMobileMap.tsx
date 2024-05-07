import {AwesomeButton} from "react-awesome-button";
import CheckIcon from "@mui/icons-material/Check";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import React, {useEffect, useState} from "react";
import {Box, Button, CircularProgress, createTheme, PaletteMode, Popover, SpeedDial, Typography} from "@mui/material";
import {SpeedDialAction} from "@mui/lab";
import ArticleIcon from "@mui/icons-material/Article";
import CloseIcon from "@mui/icons-material/Close";
import {getAllTokens} from "@/theme";
import {useAppSelector} from "@/reducers/hooks";
import {selectAuthStateId} from "@/reducers/auth/auth";
import call from "@/services/api-call";
import config from "@/config";
import swal from "sweetalert";
import CplusplusPlain from 'devicons-react/lib/icons/CplusplusPlain';
import CsharpPlain from 'devicons-react/lib/icons/CsharpPlain';
import GoPlain from 'devicons-react/lib/icons/GoPlain';
import JavascriptPlain from 'devicons-react/lib/icons/JavascriptPlain';
import PythonOriginal from 'devicons-react/lib/icons/PythonOriginal';
import RustOriginal from 'devicons-react/lib/icons/RustOriginal';

interface JourneyMapProps {
    unitId: any;
}

function JourneyMobileMap({unitId}: JourneyMapProps) {
    const [anchorElDetour, setAnchorElDetour] = useState(null);
    const [anchorElDesc, setAnchorElDesc] = useState(null);
    let userPref = localStorage.getItem('theme')
    const [mode, setMode] = React.useState<PaletteMode>(userPref === 'light' ? 'light' : 'dark');
    const theme = React.useMemo(() => createTheme(getAllTokens(mode)), [mode]);
    const [openSpeedDial, setOpenSpeedDial] = useState(null);
    const [tasks, setTasks] = React.useState([])

    function splitDataByUnit(data: any[]) {
        // Reduce the data into an object with unit numbers as keys
        const unitData = data.reduce((acc, item) => {
            // If the unit doesn't exist in the accumulator, initialize it
            if (!acc[item.unit]) {
                acc[item.unit] = [];
            }
            // Push the current item into the array for its unit
            acc[item.unit].push(item);
            return acc;
        }, {});

        // Convert the object into an array of objects with unit and metadata properties
        return Object.keys(unitData).map(unit => ({
            unit: unit,
            metadata: unitData[unit],
        }));
    }

    const items = [1, 2];

    //@ts-ignore
    const handleMouseEnter = (id) => () => setOpenSpeedDial(id);
    const handleMouseLeave = () => setOpenSpeedDial(null);

    //@ts-ignore
    const handleClickDetour = (event) => {
        setAnchorElDetour(event.currentTarget);
    };

    const [taskDescription, setTaskDescription] = useState("")
    const [taskTitle, setTaskTitle] = useState("")
    const [taskId, setTaskId] = useState("")

    //@ts-ignore
    const handleClickDesc = (description, title, taskID) => (event) => {
        setTaskTitle(title)
        setTaskDescription(description)
        setTaskId(taskID)
        setAnchorElDesc(event.currentTarget);
    };
    const handleDetourClose = () => {
        setAnchorElDetour(null);
    };

    const handleDescClose = () => {
        setAnchorElDesc(null);
    };

    const handleLanguage = (lang: string) => {
        switch (lang.toLowerCase()) {
            case "python":
            case "py":
                return <PythonOriginal size={"35px"}/>
            case "golang":
            case "go":
                return <GoPlain size={"35px"}/>
            case "rust":
            case "rs":
                return <RustOriginal size={"35px"}/>
            case "cpp":
            case "c++":
            case "cc":
            case "cxx":
                return <CplusplusPlain size={"35px"}/>
            case "javascript":
            case "js":
                return <JavascriptPlain size={"35px"}/>
            case "c#":
            case "csharp":
            case "cs":
                return <CsharpPlain size={"35px"}/>
            default:
                return null
        }
    }

    const handleIcon = (item: any, index: any, firstIncomplete: any) => {
        if (item.completed) {
            return (
                <AwesomeButton style={{
                    width: "5em",
                    height: "4.5em",
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    '--button-default-height': '70px',
                    //@ts-ignore
                    '--button-primary-color': theme.palette.tertiary.dark,
                    //@ts-ignore
                    '--button-primary-color-dark': "#afa33d",
                    '--button-primary-color-light': "#dfce53",
                    //@ts-ignore
                    '--button-primary-color-active': theme.palette.tertiary.dark,
                    //@ts-ignore
                    '--button-primary-color-hover': theme.palette.tertiary.main,
                    '--button-default-font-size': '14px',
                    '--button-default-border-radius': '80%',
                    '--button-horizontal-padding': '3px',
                    '--button-raise-level': '6px',
                    '--button-hover-pressure': '3',
                    '--transform-speed': '0.275s',
                }} type="primary">
                    <CheckIcon fontSize="large" sx={{width: '1.5em', height: '1.3em'}}/>
                </AwesomeButton>

            );
        } else if (index === firstIncomplete) {
            return (
                <AwesomeButton style={{
                    width: "4em",
                    height: "4.5em",
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    '--button-default-height': '70px',
                    '--button-primary-color': theme.palette.secondary.main,
                    '--button-primary-color-dark': theme.palette.secondary.dark,
                    '--button-primary-color-light': theme.palette.secondary.dark,
                    '--button-primary-color-active': theme.palette.secondary.dark,
                    '--button-primary-color-hover': theme.palette.secondary.main,
                    '--button-default-font-size': '14px',
                    '--button-default-border-radius': '80%',
                    '--button-horizontal-padding': '3px',
                    '--button-raise-level': '6px',
                    '--button-hover-pressure': '3',
                    '--transform-speed': '0.275s',
                }} type="primary">
                    <div style={{
                        height: "50px",
                        width: "50px",
                        paddingTop: "2.5px",
                    }}>
                        {handleLanguage(item.lang)}
                    </div>
                </AwesomeButton>
            );
        } else {
            return (
                <AwesomeButton style={{
                    width: "4em",
                    height: "4.5em",
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
                    '--button-raise-level': '6px',
                    '--button-hover-pressure': '3',
                    '--transform-speed': '0.275s',
                }} type="primary">
                    <div style={{
                        height: "50px",
                        width: "50px",
                    }}>
                        <QuestionMarkIcon fontSize="large" sx={{width: '1.3em', height: '1.3em'}}/>
                    </div>
                </AwesomeButton>
            );
        }
    }

    const userId = useAppSelector(selectAuthStateId);

    const getTasks = async () => {
        let res = await call(
            "/api/journey/getTasksInUnit",
            "POST",
            null,
            null,
            null,
            // @ts-ignore
            {unit_id: unitId, user_id: userId},
            null,
            config.rootPath
        )

        if (res !== undefined && res["success"] !== undefined && res["success"] === true) {
            let tasks = res["data"]["tasks"]

            let structuredData = tasks.sort((a: { node_above: number | null; }, b: { node_above: number | null; }) => {
                if (a.node_above === null) return -1;
                if (b.node_above === null) return 1;
                // @ts-ignore
                return a.node_above - b.node_above;
            });

            setTasks(structuredData)
        } else {
            swal("There was an issue getting this data. Please try again.")
        }

        return null
    }

    useEffect(() => {
        getTasks()
    }, [unitId])

    const openDesc = Boolean(anchorElDesc);

    //@ts-ignore
    const CurvedPath = ({points}) => {
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
            <svg viewBox={`${minX} ${minY} ${width} ${height}`}
                 style={{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0}}>
                <path d={d} stroke="#008866" strokeWidth="12" fill="none" strokeDasharray="30,10"/>
            </svg>
        );
    };


    const TaskDescription = () => {
        return (
            <>
                <Box sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <Typography sx={{textTransform: "none"}} variant={"h6"}>
                        {taskTitle}
                    </Typography>
                </Box>
                <Box sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    flexDirection: "column",
                    pt: 4,
                    height: "225px"
                }}>
                    <Typography
                        sx={{textTransform: "none", textAlign: 'justify', marginLeft: '28px', marginRight: '28px'}}
                        variant={"h6"}>
                        {taskDescription}
                    </Typography>

                </Box>
            </>

        )
    }

    const taskPopups = () => {
        ;
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
                            //@ts-ignore
                            backgroundColor: theme.palette.background.chat,
                        }
                    }}
                >
                    <Box sx={{m: 3}}>
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
                            width: "30px",
                            height: "30px",
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
                        onClick={handleClickDesc(item.description, item.name, item.code_source_id)}
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

    function JourneyStops(metadata: any[]) {
        const gap = 15;
        const speedDialHeight = 130; // Height of each SpeedDial plus gap
        const points = metadata.map((item: any, index: number) => ({
            x: index % 2 === 0 ? 100 : 300,
            y: speedDialHeight * index + speedDialHeight / 2
        }));

        const firstIncompleteIndex = metadata.findIndex((item: { completed: any; }) => !item.completed);

        return (
            <Box sx={{
                position: 'relative',
                width: '100%',
                height: "100%",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                paddingTop: "10px",
                paddingBottom: "10px"
            }}>
                <CurvedPath points={points}/>
                {metadata.map((item: { _id: React.Key | null | undefined; }, index: number) => (
                    <div
                        style={{
                            transform: `${index % 2 === 0 ? 'translateX(-25%)' : 'translateX(70%)'}`,
                        }}
                        key={item._id}
                        onMouseEnter={handleMouseEnter(item._id)}
                        onMouseLeave={handleMouseLeave}
                    >
                        {Tasks(item, index, firstIncompleteIndex)}
                    </div>
                ))}
            </Box>
        );
    }

    return (
        <>
            {tasks.length > 0 ? (
                <div>
                    {JourneyStops(tasks)}
                </div>
            ) : (
                <Box sx={{
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    height: "35vh",
                    alignItems: "center",
                    alignContent: "center"
                }}>
                    <CircularProgress/>
                </Box>
            )}
        </>
    )

}

const calculatePositionAsPercentage = (pixelValue: number, axis: 'horizontal' | 'vertical'): number => {
    const screenSize = axis === 'horizontal' ? window.innerWidth : window.innerHeight;
    return (pixelValue / screenSize) * 100;
};

export default JourneyMobileMap