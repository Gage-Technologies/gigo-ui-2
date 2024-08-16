import React, { useEffect, useState } from 'react';
import { Typography, IconButton, Dialog, Box, Grid, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import Close from '@mui/icons-material/Close';
import { theme, themeHelpers } from "@/theme";
import config from "@/config";
import { useAppDispatch, useAppSelector } from "@/reducers/hooks";
import { initialAuthStateUpdate, selectAuthStateId, updateAuthState } from "@/reducers/auth/auth";
import { selectJourneysId } from "@/reducers/journeyDetour/journeyDetour";
import swal from "sweetalert";
import MuiAwesomeButton from "@/components/MuiAwesomeButton";
import { Unit, Task } from "@/models/journey";
import Image from "next/image";
import { useRouter } from 'next/navigation';

// import necessary icons
import { PythonOriginal, GoPlain, RustOriginal, CplusplusPlain, JavascriptPlain, CsharpPlain } from 'devicons-react';
import { CheckCircle, HelpOutline, Article as ArticleIcon, Map as MapIcon, Route as RouteIcon } from '@mui/icons-material';
import { AwesomeButton } from "react-awesome-button";

interface JourneyDetourPopupProps {
    open: boolean;
    onClose: () => void;
    unit: Unit;
}

const JourneyDetourMobilePopup: React.FC<JourneyDetourPopupProps> = ({ open, onClose, unit: initialUnit }) => {
    const [journeyUnitMap, setJourneyUnitMap] = useState<Unit[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [view, setView] = useState<'path' | 'map'>('path');
    const [selectedUnit, setSelectedUnit] = useState<Unit>(initialUnit);
    const [selectedUnitColor, setSelectedUnitColor] = useState<string>("#ffffff");

    const reduxIdState = useAppSelector(selectJourneysId);
    const userId = useAppSelector(selectAuthStateId);
    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffect(() => {
        if (open) {
            getUnitMap(selectedUnit._id);
            getTasks();
        }
    }, [open, selectedUnit]);

    function redirectToMain(newPath: string) {
        // Get the current URL's protocol, hostname, and port
        const baseUrl = `${window.location.protocol}//${window.location.host}`;

        // Construct the new URL
        const newUrl = `${baseUrl}${newPath}`;

        // Redirect to the new URL
        window.location.href = newUrl;
    }

    const getTasks = async () => {
        let res = await fetch(
            `${config.rootPath}/api/journey/getTasksInUnit`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({unit_id: selectedUnit._id, user_id: userId}),
                credentials: 'include'
            }
        ).then(async (response) => response.json())

        if (res !== undefined && res["success"] !== undefined && res["success"] === true){
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

        console.log("this is the task: ", res)
        return null
    }


    const TakeDetour = async() => {
        let detour = await fetch(
            `${config.rootPath}/api/journey/createDetour`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({detour_unit_id: selectedUnit._id, user_id: userId, task_id: typeof reduxIdState === "string" ? reduxIdState : `${reduxIdState}`}),
                credentials: 'include'
            }
        ).then(async (response) => response.json())

        if (detour !== undefined && detour["success"] !== undefined && detour["success"] === true){
            redirectToMain("/journey")
        } else {
            swal("There was an issue adding this detour")
        }
    }

    const getUnitMap= async(unitId: any) => {
        let unitmap = await fetch(
            `${config.rootPath}/api/journey/getJourneyFromUnit`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({unit_id: unitId}),
                credentials: 'include'
            }
        ).then(async (response) => response.json())

        if (unitmap !== undefined && unitmap["success"] !== undefined && unitmap["success"] === true){
            setJourneyUnitMap(unitmap["units"])
            console.log("this is the journey map", unitmap["units"])
        } else {
            swal("There was an issue getting the journey map")
        }
    }

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

    const handleIcon = (item: Task, index: number, firstIncomplete: number, buttonSize: number) => {
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
                }} type="primary" 
                //@ts-ignore
                href={item.code_source_type === 4 ? `/quiz/${item.code_source_id}?journey` : `/byte/${item.code_source_id}?journey`}>
                    <CheckCircle style={{width: `${buttonSize * 0.8}px`, height: `${buttonSize * 0.8}px`}}/>
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
                    //@ts-ignore
                   href={item.code_source_type === 4 ? `/quiz/${item.code_source_id}?journey` : `/byte/${item.code_source_id}?journey`}
                >
                    {handleLanguage(item.lang, buttonSize)}
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
                    <HelpOutline style={{width: `${buttonSize * 0.8}px`, height: `${buttonSize * 0.8}px`}}/>
                </AwesomeButton>
            );
        }
    }

    const handleViewChange = (
        event: React.MouseEvent<HTMLElement>,
        newView: 'path' | 'map',
    ) => {
        if (newView !== null) {
            setView(newView);
        }
    };

    const handleUnitClick = (clickedUnit: Unit) => {
        setTasks([]);
        setSelectedUnit(clickedUnit);
        setView('path');
    };

    const renderJourneyPath = (tasks: Task[]) => {
        let buttonSize = 50; // smaller size for mobile
        let buttonSpacing = 20; // smaller spacing for mobile
        let maxOffset = 75; // smaller offset for mobile
        const offsetBase = 4;

        // calculate offset function
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

        const firstIncompleteIndex = tasks.findIndex(task => !task.completed);

        return (
            <Box sx={{ position: 'relative', width: '100%', height: '100%', overflowY: 'auto', paddingBottom: '60px' }}>
                {/* header with title */}
                <Box sx={{
                    p: 2, 
                    backgroundColor: selectedUnitColor, 
                    borderRadius: '15px',
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "16px",
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                }}>
                    <Typography variant="subtitle1" style={{ color: getTextColor(selectedUnitColor) }}>
                        {selectedUnit.name}
                    </Typography>
                </Box>

                {/* tasks */}
                <Box sx={{ minHeight: `${tasks.length * (buttonSize + buttonSpacing)}px`, position: 'relative', paddingTop: '16px' }}>
                    {tasks.map((task, index) => (
                        <Box
                            key={task._id}
                            sx={{
                                position: 'absolute',
                                top: `${index * (buttonSize + buttonSpacing)}px`,
                                left: `calc(50% + ${calculateOffset(index)}px)`,
                                transform: 'translateX(-50%)',
                            }}
                        >
                            {handleIcon(task, index, firstIncompleteIndex, buttonSize)}
                        </Box>
                    ))}
                </Box>
            </Box>
        );
    };

    const renderUnitMap = () => {
        return (
            <Box sx={{ flexGrow: 1, overflow: 'auto', height: '100%', paddingBottom: '60px' }}>
                {journeyUnitMap.map((mapUnit, index) => (
                    <Box
                        key={mapUnit._id}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 2,
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: mapUnit._id === selectedUnit._id ? 'rgba(41, 193, 140, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                            border: mapUnit._id === selectedUnit._id ? '2px solid #29C18C' : 'none',
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: 'rgba(41, 193, 140, 0.1)',
                            },
                        }}
                        onClick={() => handleUnitClick(mapUnit)}
                    >
                        <Typography variant="body2" sx={{ flexGrow: 1 }}>
                            {index + 1}. {mapUnit.name}
                        </Typography>
                        {mapUnit._id === selectedUnit._id && (
                            <Typography variant="caption" sx={{ color: '#29C18C' }}>
                                Current
                            </Typography>
                        )}
                    </Box>
                ))}
            </Box>
        );
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            fullScreen 
            PaperProps={{ 
                sx: {
                    ...themeHelpers.frostedGlass,
                    backgroundColor: "rgba(0,0,0,0.7)",
                }
            }}
        >
            <Box sx={{ p: 2, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {selectedUnit.name}
                    </Typography>
                    <IconButton onClick={onClose}>
                        <Close />
                    </IconButton>
                </Box>
                
                <Box sx={{ flexGrow: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
                    <Image
                        src={`${config.rootPath}/static/junit/t/${selectedUnit._id}`}
                        alt="Unit Image"
                        width={300}
                        height={150}
                        style={{ objectFit: 'cover', borderRadius: 16, marginBottom: 16, width: '100%', height: 'auto' }}
                    />
                    <Typography variant="body2" sx={{ mb: 2, maxHeight: '20vh', overflowY: 'auto' }}>
                        {selectedUnit.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle1">
                            {view === 'path' ? 'Tasks' : 'Unit Map'}
                        </Typography>
                        <ToggleButtonGroup
                            value={view}
                            exclusive
                            onChange={handleViewChange}
                            aria-label="view selector"
                            size="small"
                        >
                            <ToggleButton value="path" aria-label="journey path">
                                <RouteIcon />
                            </ToggleButton>
                            <ToggleButton value="map" aria-label="unit map">
                                <MapIcon />
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                    <Box sx={{ flexGrow: 1, position: 'relative' }}>
                        {view === 'path' ? renderJourneyPath(tasks) : renderUnitMap()}
                    </Box>
                </Box>
                
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    mt: 2, 
                    position: 'fixed', 
                    bottom: 16, 
                    left: 16, 
                    right: 16,
                    zIndex: 1000
                }}>
                    <MuiAwesomeButton
                        backgroundColor={theme.palette.secondary.main}
                        href={`/journey/info/${selectedUnit._id}`}
                        hoverColor={theme.palette.secondary.light} 
                        secondaryColor={theme.palette.secondary.dark} 
                        textColor={theme.palette.text.primary}
                        sx={{ flex: 1, mr: 1 }}
                    >
                        More Details
                    </MuiAwesomeButton>
                    <MuiAwesomeButton
                        backgroundColor={theme.palette.primary.main}
                        onClick={TakeDetour} 
                        hoverColor={theme.palette.primary.light} 
                        secondaryColor={theme.palette.primary.dark} 
                        textColor={theme.palette.text.primary}
                        sx={{ flex: 1, ml: 1 }}
                    >
                        Take Detour
                    </MuiAwesomeButton>
                </Box>
            </Box>
        </Dialog>
    );
};

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

export default JourneyDetourMobilePopup;