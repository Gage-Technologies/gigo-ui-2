import React, {useEffect, useState} from "react";
import {
    Box,
    ButtonBase,
    CircularProgress,
    Grid, Tooltip,
    Typography,
} from "@mui/material";
import Carousel from "@/components/Carousel";
import DetourCard from "./DetourCard";
import {Unit} from "@/models/journey";
import DetourSignIcon from "@/icons/Journey/DetourSign";
import config from "@/config";
import DetourMobileCard from "@/components/Journey/DetourMobileCard";
import {useSearchParams} from "next/navigation";

interface DetourSelectionProps {
    detours: Unit[];
    color: string;
    textColor: string;
    width?: string;
}

function DetourSelection(props: DetourSelectionProps) {
    let query = useSearchParams();
    let isMobile = query.get("viewport") === "mobile";
    const [detours, setDetours] = useState<Unit[]>([])
    const detourUnitPreview = async () => {
        let res = await fetch(
            `${config.rootPath}/api/journey/getUnitsPreview`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: '{}',
                credentials: 'include'
            }
        ).then(async (response) => response.json())


        if (res !== undefined && res["success"] !== undefined && res["success"] === true) {
            setDetours(res["units"])
        }
    };

    useEffect(() => {
        detourUnitPreview()
    },[])

    // border: `2px solid ${props.color}`

    const [activeStep, setActiveStep] = useState(0);
    const maxSteps = detours.length;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleRender = (unit: Unit) => {
        if (isMobile) {
            return <DetourMobileCard width={"70vw"} data={unit}/>
        } else {
            return <DetourCard data={unit} width={props.width !== undefined && props.width !== null ? props.width : '18vw'}/>
        }
    }

    return (
        //@ts-ignore
        <Box sx={{position: "relative", width: "80%", borderRadius: '30px'}}>
            <Tooltip 
                title={
                    <React.Fragment>
                        <Typography variant="body2">
                            Detours are optional learning paths you can add to your Journey.
                        </Typography>
                        <Typography variant="body2">
                            Click here to view all Detours
                        </Typography>
                    </React.Fragment>
                }
            >
                <ButtonBase href={"/journey/detour"}>
                    <Box sx={{display: "flex", justifyContent: "center", alignItems: "center", paddingTop: "10px"}}>
                        <DetourSignIcon width={"80%"}/>
                    </Box>
                </ButtonBase>
            </Tooltip>
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                pt: 4,
            }}>
                <Carousel itemsShown={1} infiniteLoop={true}
                          itemsToSlide={1} detour={true}>
                    {
                        detours && detours.length > 0 ?
                            detours.map((unit, index) => {
                                return (
                                    <div key={unit._id} style={{display: "grid", justifyContent: "center", alignItems: "center", paddingBottom: "20px"}}>
                                        <Grid item xs={6}>
                                            {handleRender(unit)}
                                        </Grid>
                                    </div>
                                )
                            }) : (
                                <Box
                                    display={"flex"}
                                    sx={{
                                        width: "100%",
                                        marginTop: "36px",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        alignContent: "center",
                                    }}
                                >
                                    <CircularProgress size={48}/>
                                </Box>
                            )
                    }
                </Carousel>
            </Box>
        </Box>

    )
}

export default DetourSelection;
