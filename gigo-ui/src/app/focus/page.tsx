'use client'
import {
    Box,
    Typography,
} from '@mui/material';
import {theme} from "@/theme";
import config from "@/config";
import {programmingLanguages} from "@/services/vars";
import BytesCard from "@/components/Bytes/BytesCard";
import * as React from "react";
import {Suspense} from "react";
import SheenPlaceholder from "@/components/Loading/SheenPlaceholder";

// TODO currently has filler data
const FocusPage: React.FC = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: "column"
            }}
        >
            <Box sx={{ width: '100%', textAlign: 'center', pt: 1 }}>
                <Typography variant="h3">
                    Focus on This
                </Typography>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: "80vh",
                    width: "100%",
                }}
            >
                <Box
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"center"}
                    sx={{
                        width: "16vw",
                        marginRight: 4,
                        marginBottom: 6,

                    }}
                >
                    <Typography variant="h5" component="h2" gutterBottom>
                        Lesson To Learn with
                    </Typography>
                    <Suspense fallback={<SheenPlaceholder height={400} width={225}/>}>
                        <BytesCard
                            height={"475px"}
                            imageHeight={475}
                            width={'100%'}
                            imageWidth={300}
                            bytesId={"1780323453681795072"}
                            bytesTitle={"Classes and Objects"}
                            bytesDesc={"Concept Explanation"}
                            bytesThumb={config.rootPath + "/static/bytes/t/" + '1780323453681795072'}
                            language={programmingLanguages["python"]}
                            animate={false}
                        />
                    </Suspense>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: "50vw",
                        marginLeft: 6,
                        p: 2
                    }}
                >
                    <Box
                        sx={{
                            border: `2px solid ${theme.palette.primary.main}`,
                            backgroundColor: theme.palette.background.card,
                            height: '30vh',
                            marginBottom: 6,
                            borderRadius: "20px",
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'start',
                            flexDirection: 'column',
                            pr: 4,
                            pl: 4,
                            pt: 2
                        }}
                    >
                        <Typography variant="h5" component="h2" sx={{ textAlign: 'left' }}>
                            Your Largest Mistake
                        </Typography>
                        <Typography variant="h4" component="h2" sx={{ textAlign: 'left', marginBottom: 1}}>
                            Python Classes
                        </Typography>
                        <Typography variant="body1" component="p" sx={{ textAlign: 'left' }}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Box
                            sx={{
                                border: `2px solid ${theme.palette.primary.main}`,
                                backgroundColor: theme.palette.background.card,
                                height: '30vh',
                                width: '48%',
                                borderRadius: "20px",
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'start',
                                flexDirection: 'column',
                                pr: 4,
                                pl: 4,
                                pt: 2,
                                mr: 3
                            }}
                        >
                            <Typography variant="h5" component="h2" sx={{ textAlign: 'left', marginBottom: 2 }}>
                                Mistake Description
                            </Typography>
                            <Typography variant="body1" component="p" sx={{ textAlign: 'left' }}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                border: `2px solid ${theme.palette.primary.main}`,
                                backgroundColor: theme.palette.background.card,
                                height: '30vh',
                                width: '48%',
                                borderRadius: "20px",
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                p: 4,
                            }}
                        >
                            <Typography variant="h5" component="h2" sx={{ textAlign: 'left'}}>
                                Finish Challenge By
                            </Typography>
                            <Typography variant="h4" component="p" sx={{ textAlign: 'left' }}>
                                June 30, 2024
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>


    );
};

export default FocusPage;

function hexToRGBA(hex: any, alpha = 1) {
    let r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}