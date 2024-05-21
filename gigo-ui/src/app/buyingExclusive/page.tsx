'use client'
import * as React from "react";
import { Box, Typography, Container, Grid, Paper } from "@mui/material";
import { styled } from '@mui/system';
import { theme } from "@/theme";
import exclusive from "@/img/icons/exclusive.svg";
import fast from "@/img/icons/fast-time.svg";
import click from "@/img/icons/click.svg";
import Image from "next/image";

const SectionContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(6, 0),
    textAlign: 'center',
}));

const ContentBox = styled(Paper)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(4),
    margin: theme.spacing(2, 0),
    backgroundColor: 'transparent',
    boxShadow: 'none',
    [theme.breakpoints.up('md')]: {
        flexDirection: 'row',
    },
}));

const TextContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    textAlign: 'left',
    padding: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
        width: '40vw',
    },
}));

function BuyingExclusiveContent() {
    return (
        <Container>
            <SectionContainer sx={{ backgroundColor: theme.palette.primary.light }}>
                <Typography variant="h2">What is Exclusive Content?</Typography>
                <ContentBox>
                    <Image src={exclusive} width={300} height={400} alt="Exclusive Content Icon" />
                    <TextContainer>
                        <Typography variant="h4">Unique Content Made by Top Creators</Typography>
                        <Typography variant="body1" paragraph>
                            Exclusive content in the context of a coding project refers to a premium programming challenge that requires payment to access. Although it doesn&apos;t include extra features, it is usually designed to be a more engaging and challenging experience. The creators of such content often invest more effort into crafting detailed explanations and presenting complex concepts, making it a valuable learning resource for those who choose to invest in it.
                        </Typography>
                    </TextContainer>
                </ContentBox>
            </SectionContainer>
            <SectionContainer sx={{ backgroundColor: theme.palette.primary.main }}>
                <Typography variant="h2">Why Do You Want Exclusive Content?</Typography>
                <ContentBox>
                    <Image src={fast} width={300} height={400} alt="Fast Time Icon" />
                    <TextContainer>
                        <Typography variant="h4">More Personalized and Unique Content</Typography>
                        <Typography variant="body1" paragraph>
                            Paying for exclusive content in programming can be a wise investment for individuals looking to accelerate their learning process. The primary reason is that premium content tends to be of higher quality, with more effort put into crafting detailed explanations and presenting complex concepts. This well-structured and comprehensive material can help decrease the time it takes to learn programming, as it allows users to grasp concepts more effectively and efficiently.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Moreover, exclusive content often comes with better support and guidance, providing users with a more personalized learning experience. This can lead to a deeper understanding of programming concepts, faster problem-solving skills, and ultimately, a more solid foundation in the programming language or framework being studied. By investing in exclusive content, users can save time and effort in the long run, enabling them to advance their programming skills more rapidly.
                        </Typography>
                    </TextContainer>
                </ContentBox>
            </SectionContainer>
            <SectionContainer sx={{ backgroundColor: theme.palette.primary.dark }}>
                <Typography variant="h2">How to Purchase Exclusive Content?</Typography>
                <ContentBox>
                    <Image src={click} width={300} height={400} alt="Click Icon" />
                    <TextContainer>
                        <Typography variant="h4">Get Access in Only a Few Clicks</Typography>
                        <Typography variant="body1" paragraph>
                            Purchasing exclusive content is only a few clicks away. Click on the project you would like to purchase and go to the challenge page. Once you are on the challenge page, click on the &apos;Buy Content&apos; button. You will be navigated to a secure checkout page for a one-time payment. Once redirected to the site, you will have access to start your attempt on the project.
                        </Typography>
                    </TextContainer>
                </ContentBox>
            </SectionContainer>
        </Container>
    );
}

export default BuyingExclusiveContent;
