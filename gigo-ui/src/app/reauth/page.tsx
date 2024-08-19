'use client'
import React from 'react';
import { Button, Box, Typography, Container } from '@mui/material';
import { styled } from '@mui/styles';
import config from '@/config';
import { theme } from '@/theme';
import useIsMobile from '@/hooks/isMobile';

const BackgroundContainer = styled(Box)({
    backgroundColor: 'black',
    backgroundImage: `url(${config.rootPath}/cloudstore/images/login_background.jpg)`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    width: '100vw',
    height: 'calc(100vh - 64px)',
    overflowX: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

const ContentContainer = styled(Container)({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: theme.palette.background.default,
    p: 5,
    maxWidth: 'calc(100vw - 20px)',
    width: 'fit-content',
    borderRadius: 10,
});

export default function StripeReauth() {
    const isMobile = useIsMobile();
    return (
        <BackgroundContainer>
            <ContentContainer>
                <Typography variant={isMobile ? "h5" : "h3"} component="h1" sx={{ fontFamily: 'Poppins', color: 'white', textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}>
                    There was an issue with payment
                </Typography>
                <Button
                    variant="contained"
                    href="/home"
                    sx={{ m: 2 }}
                >
                    Take Me Home
                </Button>
            </ContentContainer>
        </BackgroundContainer>
    );
}
