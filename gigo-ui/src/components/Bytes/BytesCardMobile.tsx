'use client';
import * as React from "react"
import {
    Box,
    ButtonBase,
    Card,
    CardContent,
    Typography
} from "@mui/material";
import { theme } from "@/theme";
import BytesEasyBadge from "@/icons/Bytes/BytesEasyBadge";
import BytesMediumBadge from "@/icons/Bytes/BytesMediumBadge";
import BytesHardBadge from "@/icons/Bytes/BytesHardBadge";
import BytesLanguage from "@/icons/Bytes/BytesLanguage";
import {useRouter} from "next/navigation";
import Image from "next/image";


interface IProps {
    role?: any | null;
    width?: number | string,
    height?: number | string,
    imageWidth: number | string,
    imageHeight: number | string,
    bytesId: string,
    bytesTitle: string,
    bytesThumb: string,
    bytesDesc: string,
    onClick?: () => void,
    animate: boolean,
    style?: React.CSSProperties;
    onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
    inByte?: boolean,
    completedEasy?: boolean;
    completedMedium?: boolean;
    completedHard?: boolean;
    language?: string;
    isHome?: boolean;
}

export default function BytesCardMobile(props: IProps) {
    let navigate = useRouter();

    const styles = {
        card: {
            width: props.width,
            // boxShadow: "0px 6px 3px -3px rgba(0,0,0,0.3),0px 3px 3px 0px rgba(0,0,0,0.3),0px 3px 9px 0px rgba(0,0,0,0.3)",
            // backgroundColor: theme.palette.background.default
            height: props.height,
            border: "none",
            boxShadow: "none",
            backgroundColor: "transparent",
            backgroundImage: "none",
            animation: props.animate ? 'auraEffect 2s infinite alternate' : 'none',
            overflow: "visible"
        },
        title: {
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            display: 'block',
            textAlign: "left",
            fontSize: ".8em",
            margin: 0,
            paddingLeft: 0,
            maxWidth: '100%',
        },
        content: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: "4px",
            paddingLeft: 0,
            paddingRight: "8px",
            width: '100%',
        },
        badgesContainer: {
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
            marginTop: '-8vh',
        },
        container: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
    };

    // @ts-ignore
    return (
        <>
            <style>
                {`
            @keyframes auraEffect {
                0% {
                    box-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px ${theme.palette.primary.main}, 0 0 20px ${theme.palette.primary.main}, 0 0 25px ${theme.palette.primary.main}, 0 0 30px ${theme.palette.primary.main} 0 0 35px ${theme.palette.primary.main};
                }
                100% {
                    box-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 25px ${theme.palette.primary.main}, 0 0 30px ${theme.palette.primary.main}, 0 0 35px ${theme.palette.primary.main}, 0 0 40px ${theme.palette.primary.main}, 0 0 50px ${theme.palette.primary.main};
                }
            }
            `}
            </style>
            <ButtonBase href={`/byte/${props.bytesId}`} onClick={props.onClick}>
                <Card
                    sx={styles.card}
                    style={props.style}
                    onMouseEnter={props.onMouseEnter}
                    onMouseLeave={props.onMouseLeave}
                >
                    <div style={{ position: 'relative' }}>
                        <Box
                            sx={{
                                width: props.imageWidth,
                                height: props.imageHeight,
                            }}
                        >
                            <Image 
                                alt="bytes-thumbnail"
                                style={{
                                    borderRadius: "10px",
                                    objectFit: "cover",
                                }} 
                                src={props.bytesThumb} 
                                loading="lazy" 
                                width={281}
                                height={500}
                            />
                        </Box>
                        {!props.isHome && (
                            <Box
                                display={"flex"}
                                flexDirection={"column"}
                                style={{
                                    position: 'absolute',
                                    top: '0px',
                                    left: '0px',
                                    height: "100%",
                                    width: "fit-content",
                                    gap: '10px',
                                }}
                            >
                                <BytesHardBadge
                                    finished={props.completedHard === undefined ? false : props.completedHard}
                                    inByte={props.inByte}
                                    sizeMultiplier={7}
                                />
                                <BytesMediumBadge
                                    finished={props.completedMedium === undefined ? false : props.completedMedium}
                                    inByte={props.inByte}
                                    sizeMultiplier={7}
                                />
                                <BytesEasyBadge
                                    finished={props.completedEasy === undefined ? false : props.completedEasy}
                                    inByte={props.inByte}
                                    sizeMultiplier={7}
                                />
                            </Box>
                        )}
                        <Box
                            display={"flex"}
                            flexDirection={"column"}
                            style={{
                                position: 'absolute',
                                bottom: '10px',
                                right: '10px',
                                height: "fit-content",
                                width: "fit-content",
                                gap: '10px',
                            }}
                        >
                            <BytesLanguage language={props.language === undefined ? "Python" : props.language} />
                        </Box>
                    </div>
                    <CardContent sx={styles.content}>
                        <Typography gutterBottom variant="h6" component="div" sx={styles.title}>
                            {props.bytesTitle}
                        </Typography>
                    </CardContent>
                </Card>
            </ButtonBase>
        </>
    );
}

BytesCardMobile.defaultProps = {
    width: "12vw",
    height: "36vh",
    imageWidth: "12vw",
    imageHeight: "30vh",
    bytesId: 0,
    bytesTitle: "",
    bytesDesc: "",
    bytesThumb: "",
    animate: false,
    isHome: false,
}