import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import journeyUnitImage from "@/img/journey-unit-transparent.png";
import Image from "next/image";
import {palette} from "@/palette";

const GIGOLandingPageMobile: React.FC = () => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: '24px',
            paddingTop: '16px',
            color: '#fff',
            textAlign: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            position: 'relative',
        }}>
            <Typography variant="h1" sx={{
                fontWeight: 'bold',
                fontSize: '24px',
                marginBottom: '0px',
                lineHeight: '1.2'
            }}>
                Learn to code fast
            </Typography>
            <Typography variant="h5" sx={{
                fontWeight: 'medium',
                fontSize: '18px',
                marginBottom: '24px',
                lineHeight: '1.5'
            }}>
                Start with guided learning plans<br />
                Grow with real-world projects
            </Typography>
            <Box sx={{
                position: 'relative',
                marginBottom: '24px',
                '::before': { // Pseudo-element for the gradient blob
                    content: '""',
                    position: 'absolute',
                    // top: '-20%', // Position adjustments may be needed
                    // right: '-20%',
                    left: '-55px',
                    bottom: '-55px',
                    width: '350px', // Size of the blob
                    height: '350px',
                    background: `radial-gradient(
                        circle, 
                        ${palette.secondary.main} 0%, 
                        ${palette.primary.light} 50%, 
                        ${palette.primary.main} 100%
                    )`, // Gradient colors
                    filter: 'blur(100px)', // Adjust the blur effect to your liking
                    zIndex: -1,
                }
            }}>
                <Image
                    src={journeyUnitImage}
                    alt="Journey Illustration"
                    width={240}
                    height={240}
                    priority={true}
                />
            </Box>
            <Typography variant="body1" sx={{
                fontSize: '14px',
                marginBottom: '32px'
            }}>
                GIGO solves the problem we faced when learning to code: it&apos;s hard. 
                Learn directly in your browser—no installation, no setup required. 
                Get real-time help with GIGO&apos;s integrated learning assistant, Code Teacher.
            </Typography>
            <Button
                variant="contained"
                sx={{
                    fontSize: "16px",
                    padding: "12px 24px"
                }}
                href={"/journey"}
            >
                Start Your Journey
            </Button>
        </Box>
    );
};

export default GIGOLandingPageMobile;
