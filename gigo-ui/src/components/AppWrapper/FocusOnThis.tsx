import React, { Suspense, useEffect } from 'react';
import { Dialog, DialogContent, Box, Typography, IconButton, Button, useMediaQuery } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SheenPlaceholder from '../Loading/SheenPlaceholder';
import config from '@/config';
import { programmingLanguages } from '@/services/vars';
import { theme, themeHelpers } from '@/theme';
import BytesCard from '../BytesCard';
import { useSearchParams } from 'next/navigation';
import BytesCardMobile from '../Bytes/BytesCardMobile';

interface FocusOnThisProps {
  open: boolean;
}

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

const FocusOnThis: React.FC<FocusOnThisProps> = ({ open }) => {
    let query = useSearchParams();
    let isMobile = query.get("viewport") === "mobile";

    const styles = {
        fotBox: {
            ...themeHelpers.frostedGlass,
            borderRadius: '15px',
            padding: theme.spacing(3),
            margin: theme.spacing(1, 0),
            textAlign: 'center',
        },
        mobileBox: {
            ...themeHelpers.frostedGlass,
            borderRadius: '15px',
            padding: theme.spacing(2),
            margin: theme.spacing(1, 0),
            textAlign: 'center',
            width: "100%"
        }
    };

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

    const [fotOpen, setFotOpen] = React.useState(open)

    const renderContent = () => {
        if (isMobile) {
            return (
                <>
                <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
                    <Typography variant="h4" sx={{ textAlign: 'center' }}>
                        focus on this
                    </Typography>
                    <Typography variant="body2" sx={{ textAlign: 'center' }} gutterBottom>
                        Code Teacher believes this is what you should improve this week!
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={styles.mobileBox}>
                            <Typography variant="h6">Complete this By</Typography>
                            <Typography variant="h5">{formatDate(fot?.valid_until)}</Typography>
                    </Box>
                    <Box sx={{ width: '100%', maxWidth: '300px', margin: '16px 0', display: 'flex', justifyContent: 'center' }}>
                    <IconButton
                        aria-label="close"
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                        }}
                        onClick={() => {
                            setFotOpen(false);
                            localStorage.setItem('fotLastShownDate', new Date().toISOString());
                        }}
                    >
                        <CloseIcon sx={{fontSize: 20}} />
                    </IconButton>
                        <Suspense fallback={<SheenPlaceholder height={200} width={150} />}>
                            <BytesCardMobile
                                height={"250px"}
                                imageHeight={200}
                                width={'100%'}
                                imageWidth={150}
                                bytesId={fot?.byte_id}
                                bytesTitle={fot?.concept}
                                bytesThumb={config.rootPath + "/static/bytes/t/" + fot?.byte_id}
                                language={programmingLanguages[languageId]}
                                animate={false}
                            />
                        </Suspense>
                    </Box>
                    <Box sx={styles.mobileBox}>
                        <Typography variant="h6">Your Largest Mistake</Typography>
                        <Typography variant="h5">{fot?.concept}</Typography>
                    </Box>
                    <Button variant="contained" href={`/byte/${fot?.byte_id}`}
                        sx={{ 
                            marginTop: 1, 
                            width: '100%',
                            background: "linear-gradient(160deg, rgba(28,135,98,1) 0%, rgba(42,99,172,1) 78%)" 
                        }} 
                    >
                        Start Now
                    </Button>
                    <Button
                        variant="text"
                        sx={{ marginTop: 1, width: '100%', color: theme.palette.primary.dark }}
                        href={"/focus"}
                    >
                        More Details
                    </Button>
                </Box>
                </>
            );
        } else {
            return (
                <>
                <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
                    <Typography variant="h3" sx={{ textAlign: 'center' }}>
                        focus on this
                    </Typography>
                    <Typography variant="body2" sx={{ textAlign: 'center' }} gutterBottom>
                        Code Teacher believes this is what you should improve this week!
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', textAlign: 'center' }}>
                    <IconButton
                        aria-label="close"
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                        }}
                        onClick={() => {
                            setFotOpen(false);
                            localStorage.setItem('fotLastShownDate', new Date().toISOString());
                        }}
                    >
                        <CloseIcon sx={{fontSize: 20}} />
                    </IconButton>
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            best byte for you
                        </Typography>
                        <Box
                            display={"flex"}
                            flexDirection={"column"}
                            alignItems={"center"}
                            justifyContent={"center"}
                            sx={{
                                width: "16vw",
                            }}
                        >
                            <Suspense fallback={<SheenPlaceholder height={350} width={220} />}>
                            <BytesCard
                                height={"400px"}
                                imageHeight={350}
                                width={'100%'}
                                imageWidth={225}
                                bytesId={fot?.byte_id}
                                bytesTitle={fot?.concept}
                                bytesThumb={config.rootPath + "/static/bytes/t/" + fot?.byte_id}
                                language={programmingLanguages[languageId]}
                                animate={false}
                            />
                            </Suspense>
                        </Box>
                    </Box>
                    <Box sx={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', }}>
                        <Box sx={styles.fotBox}>
                            <Typography variant="h6">Your Largest Mistake</Typography>
                            <Typography variant="h5" sx={{ textAlign: 'center' }}>{fot?.concept}</Typography>
                        </Box>
                        <Box sx={styles.fotBox}>
                            <Typography variant="h6">Complete this By</Typography>
                            <Typography variant="h5">{formatDate(fot?.valid_until)}</Typography>
                        </Box>
                        <Button variant="contained" href={`/byte/${fot?.byte_id}`}
                        sx={{ 
                            marginTop: 1, 
                            background: "linear-gradient(160deg, rgba(28,135,98,1) 0%, rgba(42,99,172,1) 78%)" 
                        }} 
                        
                        >
                            Start Now
                        </Button>
                        <Button
                            variant="text"
                            sx={{ marginTop: 1, maxWidth: '200px', marginLeft: 'auto', marginRight: 'auto', color: theme.palette.primary.dark }}
                            href={"/focus"}
                        >
                            More Details
                        </Button>
                    </Box>
                </Box>
                </>
            );
        }
    };

    return (
        <Dialog open={fotOpen} maxWidth="md" fullWidth>
            <DialogContent
                sx={{
                    backdropFilter: "blur(15px)",
                    WebkitBackdropFilter: "blur(15px)",
                    background: "linear-gradient(160deg, rgba(41,193,140,1) 0%, rgba(28,135,98,1) 0%, rgba(50,50,49,1) 73%)",
                    position: "relative"
                }}
            >
                {renderContent()}
            </DialogContent>
        </Dialog>
    );
};

export default FocusOnThis;

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