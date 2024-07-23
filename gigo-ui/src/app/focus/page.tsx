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
import {Suspense, useEffect} from "react";
import SheenPlaceholder from "@/components/Loading/SheenPlaceholder";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FocusPageMobile from './focusMobile';
import { useSearchParams } from 'next/navigation';


interface LanguageOption {
    name: string;
    extensions: string[];
    languageId: number;
    execSupported: boolean;
    lspSupport: boolean;
}

const languages: LanguageOption[] = [
    {name: 'Go', extensions: ['go'], languageId: 6, execSupported: true, lspSupport: true},
    {name: 'Python', extensions: ['py', 'pytho', 'pyt'], languageId: 5, execSupported: true, lspSupport: true},
    {
        name: 'C++',
        extensions: ['cpp', 'cc', 'cxx', 'hpp', 'c++', 'h'],
        languageId: 8,
        execSupported: true,
        lspSupport: true
    },
    {name: 'HTML', extensions: ['html', 'htm'], languageId: 27, execSupported: false, lspSupport: false},
    {name: 'Java', extensions: ['java'], languageId: 2, execSupported: false, lspSupport: false},
    {name: 'JavaScript', extensions: ['js'], languageId: 3, execSupported: true, lspSupport: true},
    {name: 'JSON', extensions: ['json'], languageId: 1, execSupported: false, lspSupport: false},
    {name: 'Markdown', extensions: ['md'], languageId: 1, execSupported: false, lspSupport: false},
    {name: 'PHP', extensions: ['php'], languageId: 13, execSupported: false, lspSupport: false},
    {name: 'Rust', extensions: ['rs'], languageId: 14, execSupported: true, lspSupport: true},
    {name: 'SQL', extensions: ['sql'], languageId: 34, execSupported: false, lspSupport: false},
    {name: 'XML', extensions: ['xml'], languageId: 1, execSupported: false, lspSupport: false},
    {name: 'LESS', extensions: ['less'], languageId: 1, execSupported: false, lspSupport: false},
    {name: 'SASS', extensions: ['sass', 'scss'], languageId: 1, execSupported: false, lspSupport: false},
    {name: 'Clojure', extensions: ['clj'], languageId: 21, execSupported: false, lspSupport: false},
    {name: 'C#', extensions: ['cs'], languageId: 10, execSupported: true, lspSupport: false},
    {name: 'Shell', extensions: ['bash', 'sh'], languageId: 38, execSupported: true, lspSupport: false},
    {name: 'Toml', extensions: ['toml'], languageId: 14, execSupported: false, lspSupport: false}
];

const FocusPage: React.FC = () => {
    let query = useSearchParams();
    let isMobile = query.get("viewport") === "mobile";
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

    const [fot, setFot] = React.useState<FOT | null>(null);
    const [language, setLanguage] = React.useState<string | null>(null);
    const [languageId, setLanguageId] = React.useState<number>(0);

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
                    console.log("fot: ", data.fot);

                    // Parse the search_query and extract the language
                    try {
                        const searchQuery = JSON.parse(data.fot.search_query);
                        setLanguage(searchQuery.language);
                    } catch (error) {
                        console.error("Error parsing search_query:", error);
                    }
                }
                console.log("fot data: ", data);
            } catch (e) {
                console.log("failed to get fot: ", e);
            }
        };
        fetchFOT();
    }, []);

    useEffect(() => {
        if (language) {
            const languageOption = languages.find((lang: { name: string }) => lang.name.toLowerCase() === language.toLowerCase());
            if (languageOption) {
                setLanguageId(languageOption.languageId);
            }
        }
    }, [language]);

    const fotDesktop = () => {
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
                    <Typography variant="h5" component="h2" gutterBottom sx={{fontSize: '1.5rem'}}>
                        Lesson To Learn with
                    </Typography>
                    <Suspense fallback={<SheenPlaceholder height={400} width={225}/>}>
                        {fot && (
                        <BytesCard
                            height={"475px"}
                            imageHeight={475}
                            width={'100%'}
                            imageWidth={300}
                            bytesDesc={fot?.concept_explanation ?? ''}
                            bytesId={fot?.byte_id ?? ''}
                            bytesTitle={fot?.concept ?? ''}
                            bytesThumb={config.rootPath + "/static/bytes/t/" + fot?.byte_id}
                            language={programmingLanguages[languageId]}
                            animate={false}
                            />
                        )}
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
                            // @ts-ignore
                            backgroundColor: theme.palette.background.card,
                            height: '30vh',
                            marginBottom: 6,
                            borderRadius: "8px",
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'start',
                            flexDirection: 'column',
                            pr: 4,
                            pl: 4,
                            pt: 2,
                            overflow: 'auto',
                            '&::-webkit-scrollbar': {
                                width: '6px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: hexToRGBA(theme.palette.text.primary, 0.2),
                                borderRadius: '4px',
                            },
                            '&::-webkit-scrollbar-track': {
                                backgroundColor: hexToRGBA(theme.palette.background.default, 0.2),
                                borderRadius: '4px',
                            },
                            backgroundImage: 'linear-gradient(to bottom, #208562 -15%, transparent 25%)',
                        }}
                    >
                        <Typography variant="h5" component="h2" sx={{ textAlign: 'left' }}>
                            Your Largest Mistake
                        </Typography>
                        <Typography variant="h4" component="h2" sx={{ textAlign: 'left', marginBottom: 1}}>
                            {fot?.concept}
                        </Typography>
                        <Typography variant="body1" component="p" sx={{ textAlign: 'left', fontSize: '.9rem'}}>
                            {fot?.concept_explanation}
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
                                // @ts-ignore
                                backgroundColor: theme.palette.background.card,
                                height: '30vh',
                                width: '95%',
                                borderRadius: "8px",
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'start',
                                flexDirection: 'column',
                                paddingRight: theme.spacing(4),
                                paddingLeft: theme.spacing(4),
                                paddingTop: theme.spacing(2),
                                marginRight: theme.spacing(3),
                                overflow: 'auto',
                                '&::-webkit-scrollbar': {
                                    width: '6px',
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: hexToRGBA(theme.palette.text.primary, 0.2),
                                    borderRadius: '4px',
                                },
                                '&::-webkit-scrollbar-track': {
                                    backgroundColor: hexToRGBA(theme.palette.background.default, 0.2),
                                    borderRadius: '4px',
                                },
                                backgroundImage: 'linear-gradient(to bottom, #208562 -15%, transparent 25%)',
                            }}
                        >
                            <Typography variant="h5" component="h2" sx={{ textAlign: 'left', marginBottom: 2 }}>
                                Mistake Description
                            </Typography>
                            <Typography variant="body1" component="p" sx={{ textAlign: 'left', fontSize: '.9rem' }}>
                                {fot?.mistake_description}
                            </Typography>
                        </Box>
                            <Box
                sx={{
                    border: `2px solid ${theme.palette.primary.main}`,
                    // @ts-ignore
                    backgroundColor: theme.palette.background.card,
                    height: '30vh',
                    width: '48%',
                    borderRadius: "8px",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    position: 'relative',
                    p: 4,
                    overflow: 'auto',
                    backgroundImage: 'linear-gradient(to bottom, #208562 -15%, transparent 25%)',
                }}
            >
                <Typography 
                                    variant="h6" 
                                    component="h2" 
                                    sx={{ 
                                        textAlign: 'center', 
                        position: 'absolute', 
                        top: 16, // Adjust the value as needed
                        left: '50%',
                        marginBottom: "8rem",
                        transform: 'translateX(-50%)',
                    }}
                >
                    Finish Challenge By
                </Typography>
                <Typography 
                    variant="h5" 
                    component="p" 
                    sx={{ textAlign: 'center' }}
                >
                    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2.5rem' }}>
                        <CalendarTodayIcon sx={{ fontSize: '11rem', color: 'white' }} />
                        <Box sx={{ 
                            position: 'absolute', 
                            top: '50%', 
                            left: '50%', 
                            transform: 'translate(-50%, -50%)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            <Typography 
                                variant="subtitle1" 
                                component="span" 
                                sx={{ 
                                    fontWeight: 'bold',
                                    marginBottom: '.5rem',  // Increased from '0.5rem' to '1rem' to move it down further
                                    marginTop: '2rem',  // Added marginTop to push the text down\
                                    fontSize: '1rem'
                                }}
                            >
                                {formatDate(fot?.valid_until ? new Date(fot.valid_until).toISOString() : undefined)?.split(' ')[0]}
                            </Typography>
                            <Typography 
                                variant="h4" 
                                component="span" 
                                sx={{ 
                                    fontWeight: 'bold'
                                }}
                            >
                                {formatDate(fot?.valid_until ? new Date(fot.valid_until).toISOString() : undefined)?.split(' ')[1].replace(',', '')}
                            </Typography>
                        </Box>
                    </Box>
                </Typography>
            </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
        )
    }

    return (
        isMobile ? <FocusPageMobile language={languageId} /> : fotDesktop()
    );
};

export default FocusPage;

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

function hexToRGBA(hex: any, alpha = 1) {
    let r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}