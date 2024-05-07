import React, {useEffect, useState} from "react";
import {
    Box,
    Button, ButtonBase,
    CircularProgress, createTheme,
    Grid, MobileStepper, PaletteMode, Tooltip,
    Typography
} from "@mui/material";
import Carousel from "@/components/Carousel";
import DetourCard from "./DetourCard";
import {Unit} from "@/models/journey/unit";
import DetourSignIcon from "@/icons/Journey/DetourSign";
import call from "@/services/api-call";
import config from "@/config";
import {theme} from "@/theme";

interface DetourSelectionProps {
    detours: Unit[];
    color: string;
    textColor: string;
    width?: string;
    mobile: boolean;
}

function DetourSelection(props: DetourSelectionProps) {
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

    return (
        //@ts-ignore
        <Box sx={{position: "relative", width: "80%", borderRadius: '30px'}}>
            <Tooltip title={"See More"}>
                <ButtonBase href={"/journey/detours"}>
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
                                            <DetourCard data={unit} width={props.width !== undefined && props.width !== null ? props.width : '18vw'} mobile={props.mobile}/>
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
