'use client'
import * as React from "react"
import {Box, ButtonBase, Card, CardContent, Typography} from "@mui/material";
import {theme} from "@/theme";
import BytesEasyBadge from "@/icons/Bytes/BytesEasyBadge";
import BytesMediumBadge from "@/icons/Bytes/BytesMediumBadge";
import BytesHardBadge from "@/icons/Bytes/BytesHardBadge";
import BytesLanguage from "@/icons/Bytes/BytesLanguage";
import Image from "next/image";


interface IProps {
    width?: number | string,
    height?: number | string,
    imageWidth: number,
    imageHeight: number,
    bytesId: string,
    bytesTitle: string,
    bytesThumb: string,
    bytesDesc: string,
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

export default function BytesCardMobile({
                                            width = "100%",
                                            height = "550px",
                                            imageWidth = 281,
                                            imageHeight = 500,
                                            bytesId = '',
                                            bytesTitle = '',
                                            bytesThumb = '',
                                            bytesDesc = '',
                                            animate = false,
                                            style = {},
                                            onMouseEnter = undefined,
                                            onMouseLeave = undefined,
                                            inByte = false,
                                            completedEasy = false,
                                            completedMedium = false,
                                            completedHard = false,
                                            language = "Python",
                                            isHome = false
                                        }) {
    const styles = {
        card: {
            width: width,
            // boxShadow: "0px 6px 3px -3px rgba(0,0,0,0.3),0px 3px 3px 0px rgba(0,0,0,0.3),0px 3px 9px 0px rgba(0,0,0,0.3)",
            // backgroundColor: theme.palette.background.default
            height: height,
            border: "none",
            boxShadow: "none",
            backgroundColor: "transparent",
            backgroundImage: "none",
            animation: animate ? 'auraEffect 2s infinite alternate' : 'none',
            overflow: "visible"
        },
        image: {
            borderRadius: "10px",
        },
        imageContainer: {
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
        },
        title: {
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            display: 'block',
            textAlign: "center",
            fontSize: ".8em",
            margin: 0,
            paddingLeft: 0,
            width: '100%',
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
            width: '100%',
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
            <ButtonBase href={`/byte/${bytesId}`}>
                <Card
                    sx={styles.card}
                    style={style}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                >
                    <div style={styles.imageContainer as React.CSSProperties}>
                        <div style={{position: "relative", width: "fit-content", height: "fit-content"}}>
                            <Image
                                alt={""}
                                src={bytesThumb}
                                style={styles.image as React.CSSProperties}
                                width={imageWidth}
                                height={imageHeight}
                            />
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
                                    finished={completedHard === undefined ? false : completedHard}
                                    inByte={inByte}
                                />
                                <BytesMediumBadge
                                    finished={completedMedium === undefined ? false : completedMedium}
                                    inByte={inByte}
                                />
                                <BytesEasyBadge
                                    finished={completedEasy === undefined ? false : completedEasy}
                                    inByte={inByte}
                                />
                            </Box>
                            <Box
                                display={"flex"}
                                flexDirection={"column"}
                                style={{
                                    position: 'absolute',
                                    bottom: '20px',
                                    right: '10px',
                                    height: "fit-content",
                                    width: "fit-content",
                                    gap: '10px',
                                }}
                            >
                                <BytesLanguage language={language === undefined ? "Python" : language}/>
                            </Box>
                        </div>
                    </div>
                    <CardContent sx={styles.content}>
                        <Typography gutterBottom variant="h6" component="div" sx={styles.title}>
                            {bytesTitle}
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