import React from 'react';
import { Grid, Card, CardActionArea, CardContent, Typography, Box } from '@mui/material';
import Image from "next/image";

interface IProps {
    articles: {
       name: string;
       imageUrl: string;
       date: string;
       content: string;
    }[];
}

const ArticlesPage = ({ articles }: IProps) => {
    return (
        <>
            <style>{`
                .article-content img {
                    max-width: 400px;
                    height: auto;
                    display: block;
                    margin-left: auto;
                    margin-right: auto;
                }
            `}</style>
            <Grid container spacing={4} style={{ padding: '24px' }}>
                {articles.map((article, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                            <CardActionArea href={`/articles/${article.name.replaceAll(" ", "-")}`}>
                                {article.imageUrl && (
                                    <Box
                                        sx={{
                                            height: 258,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            overflow: 'hidden',
                                            pl: 1,
                                            pr: 1
                                        }}
                                    >
                                        <Image
                                            src={article.imageUrl}
                                            style={{
                                                maxHeight: 242,
                                                maxWidth: '100%',
                                                borderRadius: "8px",
                                                margin: "8px",
                                            }}
                                            alt="Article Image"
                                        />
                                    </Box>
                                )}
                                <CardContent style={{ height: "100px" }}>
                                    <Typography gutterBottom variant="h5" component="div" sx={{ fontSize: "100%" }}>
                                        {article.name}
                                    </Typography>
                                    <Typography gutterBottom variant="body1" component="div">
                                        {article.date}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>
    );
};

export default ArticlesPage;
