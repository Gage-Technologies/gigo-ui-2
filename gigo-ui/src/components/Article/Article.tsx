'use server';
import React from 'react';
import {
    Typography,
    Button,
    Box
} from '@mui/material';
import MarkdownRenderer from "@/components/MarkdownServer/MarkdownRenderer";
import SheenPlaceholder from "@/components/Loading/SheenPlaceholder";
import Link from 'next/link';  // Use Link for navigation
// import useThemeMode from '@/components/ThemeMode'; // Assume this is a custom hook for managing theme

//@ts-ignore
const ArticlePage = ({ markdownContents, articleName }) => {
    // const theme = useThemeMode();

    const titlePlaceholderStyle = {
        margin: "auto",
        opacity: 0.3,
        backdropFilter: "blur(15px)"
    };

    return (
        <>
            <style>{`
                .markdown-body img {
                    background-color: transparent !important;
                    border-radius: 10px;
                }
            `}</style>
            <Box
                id="article-container"
                sx={{ width: "100%" }}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                alignContent={"center"}
            >
                <Box id="article-content" sx={{ maxWidth: 800, width: "100%", m: 2 }}>
                    <Typography variant="h4" gutterBottom>
                        {articleName.replaceAll("-", " ").replace('.md', '')}
                    </Typography>
                    {markdownContents ? (
                        <MarkdownRenderer
                            markdown={markdownContents}
                            style={{
                                overflowWrap: 'break-word',
                                borderRadius: '10px',
                                padding: '0px',
                            }}
                        />
                    ) : (
                        <Box sx={titlePlaceholderStyle}>
                            <SheenPlaceholder width="800px" height="300px" />
                        </Box>
                    )}
                    {/* Use Link for navigation */}
                    <Link href="/articles" passHref>
                        <Button style={{ marginTop: '20px' }} variant="outlined">Back to list</Button>
                    </Link>
                </Box>
            </Box>
        </>
    );
};

export default ArticlePage;

// Re-exporting getServerSideProps from the component's data fetching logic
