import React, {useEffect, useState} from 'react';
import {Typography, IconButton, Dialog, PaletteMode, createTheme, Box, Grid, Chip, Button} from '@mui/material';
import Close from '@mui/icons-material/Close'; // Assuming you're using MUI icons
import {getAllTokens, themeHelpers} from "@/theme";
import call from "@/services/api-call";
import config from "@/config";
import JourneyMap from "./JourneysMap";
import {useAppSelector} from "@/reducers/hooks";
import {selectAuthStateId} from "@/reducers/auth/auth";
import {selectJourneysId} from "@/reducers/journeyDetour/journeyDetour"; // Adjust import based on actual location
import swal from "sweetalert";
import MuiAwesomeButton from "@/components/MuiAwesomeButton";
import {Unit} from "@/models/journey/unit";
import DetourCard from "./DetourCard";
import Image from "next/image";
interface JourneyDetourPopupProps {
    open: boolean;
    onClose: () => void;
    unit: object;
}

const JourneyDetourPopup: React.FC<JourneyDetourPopupProps> = ({ open, onClose, unit }) => {
    let userPref = localStorage.getItem('theme')
    const [mode, setMode] = React.useState<PaletteMode>(userPref === 'light' ? 'light' : 'dark');

    const theme = React.useMemo(() => createTheme(getAllTokens(mode)), [mode]);

    // Determine if it's a mobile view
    const isMobile = window.innerWidth < 1000;

    const [showFullDescription, setShowFullDescription] = useState(false);
    //@ts-ignore
    const isLongDescription = unit.description && unit.description.length > 150;
    const toggleDescription = () => setShowFullDescription(!showFullDescription);
    //@ts-ignore
    const displayedDescription = showFullDescription || !isLongDescription ? unit.description : unit.description.substring(0, 150) + '...';

    const reduxIdState = useAppSelector(selectJourneysId);

    const [journeyUnitMap, setJourneyUnitMap] = useState<Unit[]>([])

    const [detourData, setDetourData] = useState(unit)

    useEffect(() => {
        if (open) {
            // @ts-ignore
            getUnitMap(unit._id)
        }
    }, [open])

    const userId = useAppSelector(selectAuthStateId);

    function redirectToMain(newPath: string) {
        // Get the current URL's protocol, hostname, and port
        const baseUrl = `${window.location.protocol}//${window.location.host}`;

        // Construct the new URL
        const newUrl = `${baseUrl}${newPath}`;

        // Redirect to the new URL
        window.location.href = newUrl;
    }


    const TakeDetour = async() => {
        let detour = await call(
            "/api/journey/createDetour",
            "post",
            null,
            null,
            null,
            //@ts-ignore
            { detour_unit_id: unit._id, user_id: userId, task_id: reduxIdState, },
            null,
            config.rootPath
        )

        if (detour !== undefined && detour["success"] !== undefined && detour["success"] === true){
            redirectToMain("/journey/main")
        } else {
            swal("There was an issue adding this detour")
        }
    }

    const getUnitMap= async(unitId: any) => {
        let unitmap = await call(
            "/api/journey/getJourneyFromUnit",
            "post",
            null,
            null,
            null,
            //@ts-ignore
            { unit_id: unitId},
            null,
            config.rootPath
        )

        if (unitmap !== undefined && unitmap["success"] !== undefined && unitmap["success"] === true){
            setJourneyUnitMap(unitmap["units"])
            console.log("this is the journey map", unitmap["units"])
        } else {
            swal("There was an issue getting the journey map")
        }
    }

    const handleDataChange= (data: React.SetStateAction<object>) => {
        setDetourData(data)
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: {
            borderRadius: 7,
                maxHeight: "95vh",
                overflow: "scroll",
                height: "auto",
                paddingBottom: "100px",
                ...themeHelpers.frostedGlass,
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': {
                    display: 'none',
                },
            }
        }}>
            <Box style={{
                width: '100%', // Use 100% width to utilize the dialog's width fully
                minHeight: "auto",
                outlineColor: "black",
                borderRadius: 7,
                height: "100%",
            }}>
                <Grid container spacing={2} alignItems="center" justifyContent="center" style={{paddingTop: "20px"}}>
                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
                        <Box style={{
                            padding: '20px', // Adjust padding as needed
                            borderRadius: '50px', // Adjust for rounded corners
                            backgroundColor: theme.palette.background.default,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center', // Center the text inside
                            justifyContent: 'center',
                            width: "90%", // Set the width to 90% of the parent
                            textAlign: 'center', // Center the text horizontally
                            margin: 'auto', // Auto margins for horizontal centering if needed
                            border: `2px solid ${
                                //@ts-ignore
                                detourData.color}`
                        }}>
                            <Image src={config.rootPath + "/static/junit/t/" +
                                //@ts-ignore
                                detourData._id} alt="Top Image"
                                 style={{
                                     maxHeight: '200px',
                                     borderRadius: '30px',
                                     padding: "10px",
                                     marginRight: "20px"
                                 }}/>
                            <div style={{display: "flex", flexDirection: "column", textAlign: "left", height: "100%"}}>
                                <Typography variant="h5" style={{marginBottom: '8px'}}>
                                    {
                                        //@ts-ignore
                                        detourData.name}
                                </Typography>
                                <Typography variant="body2">
                                    {displayedDescription}
                                </Typography>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end'
                                }}> {/* Container for the button */}
                                    {isLongDescription && (
                                        <Button onClick={toggleDescription} size="small">
                                            {showFullDescription ? 'Read Less' : 'Read More'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Box>
                    </Grid>
                </Grid>
                <Grid container spacing={2} alignItems="center" style={{display: "flex", flexDirection: "row"}}>
                    <Grid item xs={6} style={{position: "relative", left: "2vw", top: "3vh"}}>
                        <Box sx={{
                            backgroundColor: `${
                                //@ts-ignore
                                detourData.color}`,
                            borderRadius: "50px",
                            width: "90%",
                            height: "100%",
                            minHeight: "275px",
                            paddingBottom: "10px",
                            maxHeight: "45vh",
                            border: '2px solid white', // This creates a thin white line around the box
                            overflow: "scroll",
                            msOverflowStyle: 'none',  // IE and Edge
                            scrollbarWidth: 'none',  // Firefox
                            '&::-webkit-scrollbar': {
                                display: 'none',
                            },
                        }}>
                            <JourneyMap unitId={
                                //@ts-ignore
                                detourData._id}/>
                        </Box>
                    </Grid>
                    <Grid item xs={6} style={{position: "relative", top: "3vh"}}>
                        <Box sx={{
                            backgroundColor: `${
                                //@ts-ignore
                                detourData.color}`,
                            borderRadius: "50px",
                            width: "90%",
                            height: "100%",
                            minHeight: "350px",
                            paddingBottom: "10px",
                            maxHeight: "400px",
                            border: '2px solid white', // This creates a thin white line around the box
                            overflow: "scroll",
                            msOverflowStyle: 'none',  // IE and Edge
                            scrollbarWidth: 'none',  // Firefox
                            '&::-webkit-scrollbar': {
                                display: 'none',
                            },
                        }}>
                            <Typography variant="subtitle1" style={{ marginBottom: '10px', textAlign: "center", width: "100%" }}>Unit Map</Typography>
                            {journeyUnitMap.map((journeyUnit, index) => (
                                <Box key={journeyUnit._id} sx={{
                                    padding: '10px',
                                    display: "flex",
                                    justifyContent: "center",
                                    flexDirection: `row`,
                                    alignItems: 'center'
                                }}>
                                    <Typography variant={"h4"} sx={{
                                        padding: '10px',
                                        //@ts-ignore
                                        color: (detourData._id === journeyUnit._id) ? theme.palette.primary.light : theme.palette.text.primary
                                    }}>
                                        {index + 1}.
                                    </Typography>
                                    {/*@ts-ignore*/}
                                    <DetourCard data={journeyUnit}  width={"100%"} simple={true} currentUnit={detourData._id} onSelect={handleDataChange}/>
                                </Box>
                            ))}
                        </Box>
                    </Grid>
                    <div style={{width: "100%", display: "flex", justifyContent: "center", paddingTop: "50px"}}>
                        <MuiAwesomeButton
                            backgroundColor={theme.palette.primary.main}
                            hoverColor={theme.palette.primary.light}
                            secondaryColor={theme.palette.primary.dark}
                            textColor={theme.palette.primary.dark}
                            onClick={TakeDetour}
                        >
                            <h1 style={{fontSize: "1vw", paddingRight: "1vw", paddingLeft: "1vw"}}>
                                Take Detour
                            </h1>
                        </MuiAwesomeButton>
                    </div>
                </Grid>
                {/* Close Button */}
                <Box style={{
                    position: "absolute",
                    top: window.innerWidth < 1000 ? '3vh' : '5vh',
                    right: window.innerWidth < 1000 ? '3vw' : '.5vw',
                }}>
                    <IconButton edge="end" color="inherit" size="small" onClick={onClose}>
                        <Close style={{ color: "white" }} />
                    </IconButton>
                </Box>
            </Box>
        </Dialog>
    );
};

export default JourneyDetourPopup;
