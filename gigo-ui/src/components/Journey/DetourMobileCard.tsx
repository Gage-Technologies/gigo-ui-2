import React, {useState} from "react";
import {Box, Card, CardContent, CardMedia, Tooltip, Typography} from "@mui/material";
import JourneyDetourPopup from "./JourneyDetourPopup";
import {theme} from "@/theme";
import config from "@/config"
import {programmingLanguages} from "@/services/vars";
import BytesLanguage from "@/icons/Bytes/BytesLanguage";
import JourneyDetourMobilePopup from "./JourneyDetourMobilePopup";

function DetourMobileCard(props: any) {
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
                            width: '10vw',
                            height: '20vw',
                            objectFit: 'cover',
                            alignSelf: 'center',
                            borderRadius: '10px',
                            clipPath: 'polygon(50% 20%, 100% 35%, 100% 65%, 50% 80%, 0 65%, 0 35%)',
                            marginLeft: '10px',
                            marginRight: "1px"
                        }}
                        image={config.rootPath + "/static/junit/t/" + props.data._id}
                        alt="Hexagon Image"
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '450px' }}>
                        <CardContent sx={{
                            maxWidth: '100em',  // Set the maximum width of the text
                            maxHeight: '100em',  // Set the maximum height of the text
                        }}>
                            <Typography
                                component="div"
                                variant="body1"
                                sx={{
                                    fontSize: '0.5em',
                                    paddingRight: '20px',
                                    paddingBottom: "40px"
                                }}
                            >
                                {props.data.name}
                            </Typography>
                        </CardContent>
                        <Box
                            sx={{
                                position: 'absolute',
                                right: '1px',
                                bottom: 2,
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
                width: props.width !== undefined && props.width !== null ? props.width : '80vw',
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
                    sx={props.width !== undefined && props.width !== null ? {
                        width: '15vw',
                        height: '30vw',
                        objectFit: 'cover',
                        alignSelf: 'center',
                        borderRadius: '10px',
                        clipPath: 'polygon(50% 20%, 100% 35%, 100% 65%, 50% 80%, 0 65%, 0 35%)',
                        marginLeft: '10px',
                        marginRight: "10px",
                    } : {
                        width: '20.5vw',
                        height: '30vw',
                        objectFit: 'cover',
                        alignSelf: 'center',
                        borderRadius: '10px',
                        clipPath: 'polygon(50% 20%, 100% 35%, 100% 65%, 50% 80%, 0 65%, 0 35%)',
                        marginLeft: '10px',
                        marginRight: "10px"
                    }}
                    image={config.rootPath + "/static/junit/t/" + props.data._id}
                    alt="Hexagon Image"
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '450px' }}>
                    <CardContent sx={{
                        maxWidth: '190em',  // Set the maximum width of the text
                        maxHeight: '100em',  // Set the maximum height of the text
                    }}>
                        <Typography
                            component="div"
                            variant="body1"
                            sx={{
                                fontSize: '0.7em',
                            }}
                        >
                            {props.data.name}
                        </Typography>
                    </CardContent>
                    <Tooltip title={programmingLanguages[props.data.langs]}>
                        <Box
                            sx={{
                                position: 'absolute',
                                right: '1px',
                                bottom: 2,
                                zIndex: 3,
                                minWidth: 0,
                            }}
                        >
                            <BytesLanguage language={props.data.langs[0]}/>
                        </Box>
                    </Tooltip>
                </Box>
            </Card>
            <JourneyDetourMobilePopup open={openPopup} onClose={closePopup} unit={props.data}/>
        </>
    )

}

export default DetourMobileCard;
