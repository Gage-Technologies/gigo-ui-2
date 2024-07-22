'use client'
import React, { Suspense, useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Button,
} from '@mui/material';
import { theme } from "@/theme";
import config from "@/config";
import { programmingLanguages } from "@/services/vars";
import BytesCard from "@/components/Bytes/BytesCard";
import SheenPlaceholder from "@/components/Loading/SheenPlaceholder";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

type FOT = {
    id: string;
    owner_id: string;
    concept: string;
    mistake_description: string;
    concept_explanation: string;
    created_at: Date;
    valid_until: Date;
    byte_id: string | null;
    search_query: string;
    in_operation: boolean;
    hash: string | null;
};

const FocusPageMobile: React.FC<{ language: number}> = ({ language }) => {
    const [fot, setFot] = useState<FOT | null>(null);

    useEffect(() => {
        const fetchFOT = async () => {
            try {
                const response = await fetch(
                    `${config.rootPath}/api/stats/getFOT`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: '{}',
                        credentials: 'include'
                    }
                );

                const data = await response.json();
                if (data.fot) {
                    setFot(data.fot);
                }
            } catch (e) {
                console.log("failed to get fot: ", e);
            }
        };

        fetchFOT();
    }, []);

    const formatDate = (dateString: string | null | undefined): string => {
        if (!dateString) {
            return 'Date not available';
        }
        
        const date = new Date(dateString);
        
        if (isNaN(date.getTime())) {
            return 'Invalid date';
        }
        
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom align="center">
                Focus on This
            </Typography>
            
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Suspense fallback={<SheenPlaceholder height={300} width={'100%'}/>}>
                        {fot && (
                        <BytesCard
                            height={"400px"}
                            imageHeight={300}
                            width={'100%'}
                            imageWidth={200}
                            bytesId={fot?.byte_id}
                            bytesTitle={fot?.concept}
                            bytesThumb={config.rootPath + "/static/bytes/t/" + fot?.byte_id}
                            language={programmingLanguages[language]}
                            animate={false}
                        />
                        )}
                    </Suspense>
                </Grid>
                <Grid item xs={12}>
                    <Box
                        sx={{
                            border: `2px solid ${theme.palette.primary.main}`,
                            backgroundColor: theme.palette.background.card,
                            borderRadius: "8px",
                            p: 2,
                            mb: 2,
                            backgroundImage: 'linear-gradient(to bottom, #208562 -15%, transparent 25%)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant="h5" gutterBottom>
                            Finish Challenge By
                        </Typography>
                        <CalendarTodayIcon sx={{ fontSize: '4rem', color: 'white', mb: 1 }} />
                        <Typography variant="h6">
                            {formatDate(fot?.valid_until)}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box
                        sx={{
                            border: `2px solid ${theme.palette.primary.main}`,
                            backgroundColor: theme.palette.background.card,
                            borderRadius: "8px",
                            p: 2,
                            mb: 2,
                            backgroundImage: 'linear-gradient(to bottom, #208562 -15%, transparent 25%)',
                        }}
                    >
                        <Typography variant="h5" gutterBottom>
                            Your Largest Mistake
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            {fot?.concept}
                        </Typography>
                        <Typography variant="body1">
                            {fot?.concept_explanation}
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <Box
                        sx={{
                            border: `2px solid ${theme.palette.primary.main}`,
                            backgroundColor: theme.palette.background.card,
                            borderRadius: "8px",
                            p: 2,
                            mb: 2,
                            backgroundImage: 'linear-gradient(to bottom, #208562 -15%, transparent 25%)',
                        }}
                    >
                        <Typography variant="h5" gutterBottom>
                            Mistake Description
                        </Typography>
                        <Typography variant="body1">
                            {fot?.mistake_description}
                        </Typography>
                    </Box>
                </Grid>


            </Grid>
        </Box>
    );
};

export default FocusPageMobile;