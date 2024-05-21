'use client'
import React, {useState} from "react";
import {Box, Card, CardContent, CardMedia, createTheme, PaletteMode, Tooltip, Typography} from "@mui/material";
import JourneyDetourPopup from "./JourneyDetourPopup";
import {theme} from "@/theme";
import config from "@/config"
import {programmingLanguages} from "@/services/vars";
import BytesLanguage from "@/icons/Bytes/BytesLanguage";
import {useSearchParams} from "next/navigation";

function DetourCard(props: any) {
    let query = useSearchParams();
    let isMobile = query.get("viewport") === "mobile";
    const [openPopup, setOpenPopup] = useState<boolean>(false);

    const closePopup = () => {
        setOpenPopup(false);
    }

    // simple card is for the unit map within the detour popup
    if (props.simple) {
        let borderColor = `5px solid white`
        if (props.currentUnit === props.data._id) {
            borderColor = `5px solid ${theme.palette.primary.light}`
        }
        return (
            <>
                <Card sx={{
                    display: 'flex',
                    width: props.width !== undefined && props.width !== null ? props.width : '23vw',
                    height: '14vh',
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'scale(1.05)',
                        cursor: 'pointer'
                    },
                    border: borderColor,
                    backgroundColor: "rgba(19,19,19,0.31)",
                    position: "relative"
                }} onClick={() => props.onSelect(props.data)}>
                    <CardMedia
                        component="img"
                        sx={{
                            width: '5.5vw',
                            height: '10vw',
                            objectFit: 'cover',
                            alignSelf: 'center',
                            borderRadius: '10px',
                            clipPath: 'polygon(50% 20%, 100% 35%, 100% 65%, 50% 80%, 0 65%, 0 35%)',
                            marginLeft: '1vw',
                            marginRight: ".3vw"
                        }}
                        image={config.rootPath + "/static/junit/t/" + props.data._id}
                        alt="Hexagon Image"
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '450px' }}>
                        <CardContent>
                            <Typography component="div" variant="body1" sx={{ fontSize: '1.3rem', paddingBottom: "10px" }}>
                                {props.data.name}
                            </Typography>
                        </CardContent>
                        <Box
                            sx={{
                                position: 'absolute',
                                right: '16px',
                                bottom: 5,
                                zIndex: 3,
                                minWidth: 0,
                            }}
                        >
                            <BytesLanguage language={props.data.langs[0]}/>
                        </Box>
                    </Box>
                </Card>
                <JourneyDetourPopup open={openPopup} onClose={closePopup} unit={props.data}/>
            </>
        )
    }
    return (
        <>
            <Card sx={{
                display: 'flex',
                width: props.width !== undefined && props.width !== null ? props.width : '23vw',
                height: '14vh',
                overflow: 'hidden',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                    transform: 'scale(1.05)',
                    cursor: 'pointer'
                },
                border: `5px solid ${props.data.color}`,
                backgroundColor: "rgba(19,19,19,0.31)",
                position: "relative"
            }} onClick={() => setOpenPopup(true)}>
                <CardMedia
                    component="img"
                    sx={isMobile ? {
                        width: '20vw',
                        height: '30vw',
                        objectFit: 'cover',
                        alignSelf: 'center',
                        borderRadius: '10px',
                        clipPath: 'polygon(50% 20%, 100% 35%, 100% 65%, 50% 80%, 0 65%, 0 35%)',
                        marginLeft: '1vw',
                        marginRight: ".3vw",
                    } : {
                        width: '5.5vw',
                        height: '10vw',
                        objectFit: 'cover',
                        alignSelf: 'center',
                        borderRadius: '10px',
                        clipPath: 'polygon(50% 20%, 100% 35%, 100% 65%, 50% 80%, 0 65%, 0 35%)',
                        marginLeft: '1vw',
                        marginRight: ".3vw"
                    }}
                    image={config.rootPath + "/static/junit/t/" + props.data._id}
                    alt="Hexagon Image"
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '450px' }}>
                    <CardContent>
                        <Typography component="div" variant="body1" sx={{ fontSize: '1.3rem', paddingBottom: "10px" }}>
                            {props.data.name}
                        </Typography>
                    </CardContent>
                    <Tooltip title={programmingLanguages[props.data.langs]}>
                        <Box
                            sx={{
                                position: 'absolute',
                                right: '16px',
                                bottom: 5,
                                zIndex: 3,
                                minWidth: 0,
                            }}
                        >
                            <BytesLanguage language={props.data.langs[0]}/>
                        </Box>
                    </Tooltip>
                </Box>
            </Card>
            <JourneyDetourPopup open={openPopup} onClose={closePopup} unit={props.data}/>
        </>
    )

}

export default DetourCard;
