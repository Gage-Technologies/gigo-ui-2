'use client'
import React, {useState} from 'react';
import {Box, createTheme, Grid, List, ListItem, ListItemText, PaletteMode, Paper, Typography} from '@mui/material';
import BytesCard from "./BytesCard";
import config from "../config";
import JourneyIcon from "@/icons/Bytes/JourneyIcon";
import {AwesomeButton} from "react-awesome-button";
import {theme} from "@/theme";
import {useAppSelector} from "@/reducers/hooks";
import {useSearchParams} from "next/navigation";

interface Byte {
    id: string;
    name: string;
    content: string;
    bytesThumb: string;
    completedEasy: boolean;
    completedMedium: boolean;
    completedHard: boolean;
    language: string;
}

interface ByteSelectionMenuProps {
    bytes: Byte[];
    onSelectByte: (id: string) => void;
    style?: React.CSSProperties;
}

const ByteSelectionMenu: React.FC<ByteSelectionMenuProps> = ({ bytes, onSelectByte }) => {
    const query = useSearchParams();
    const chatOpen = query.get("chat") === "true";
    const sidebarOpen = query.get("menu") === "true";
    let isMobile = query.get("viewport") === "mobile";
    return (
        <div style={{
            height: '80vh',
            overflowY: 'auto',
            overflowX: 'hidden',
            borderRadius: '4px',
            // padding: '20px',
            backgroundColor: 'transparent',
            boxSizing: 'border-box'
        }}>
            <List
                sx={{
                    p: 0
                }}
            >
                <ListItem key={"journeyPlug"} style={{
                    // justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: '9%'
                }}>
                    <Box sx={{width: "260px", height: "200px", borderRadius: "12px", backgroundColor: "#ffef62"}}>
                        <div style={{width: "100%", display: "inline-flex", justifyContent: "space-evenly"}}>
                            <div style={{position: "relative"}}>
                                <Typography variant={"h5"} sx={{
                                    color: theme.palette.mode === "dark" ? theme.palette.background.default : theme.palette.text.primary,
                                    textTransform: 'none',
                                    paddingTop: "20px",
                                    paddingLeft: "10px",
                                    fontSize: sidebarOpen || chatOpen ? "20px" : "28px",
                                }}>
                                    Want more direction?
                                </Typography>
                            </div>
                            <div>
                                <JourneyIcon style={{height: "80px", width: "80px", paddingTop: "20px", paddingRight: "10px"}}/>
                            </div>
                        </div>
                        <Box sx={{ display: 'flex', justifyContent: 'center', paddingTop: "30px" }}>
                            <AwesomeButton style={{
                                width: "200px",
                                height: "50px",
                                '--button-primary-color': theme.palette.primary.main,
                                '--button-primary-color-dark': theme.palette.primary.dark,
                                '--button-primary-color-light': "white",
                                '--button-primary-color-hover': theme.palette.primary.main,
                                fontSize: "16px",
                            }} type="primary" href={"/journey"} >
                                <span>Start Your Journey</span>
                            </AwesomeButton>
                        </Box>
                    </Box>
                </ListItem>
                {bytes.map((byte) => (
                    <ListItem key={byte.id} style={{
                        // justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '9%'
                    }}>
                        <BytesCard
                            inByte={true}
                            completedEasy={byte.completedEasy}
                            completedMedium={byte.completedMedium}
                            completedHard={byte.completedHard}
                            bytesId={byte.id}
                            bytesTitle={byte.name}
                            bytesThumb={config.rootPath + "/static/bytes/t/" + byte.id}
                            onClick={() => onSelectByte(byte.id)}
                            style={{ cursor: 'pointer', transition: 'transform 0.3s ease' }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            width={"100%"}
                            height="250px"
                            imageWidth="250px"
                            imageHeight="200px"
                            language={byte.language}
                        />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default ByteSelectionMenu;