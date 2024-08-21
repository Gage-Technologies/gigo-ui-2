import React from 'react';
import {Box, Button, Typography} from '@mui/material';
import journeyUnitImage from "@/img/journey-unit-transparent.png"
import byteImage from "@/img/byte.png"
import devSpaceImage from "@/img/devspace.png"
import Image from "next/image";
import {palette} from '@/palette';

const GIGOLandingPage: React.FC = () => {
    const windowSize = 1000;

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            // height: '100vh',
            minHeight: "90vh",
            width: '100%',
            padding: '50px 60px', // Adequate padding to position the content from the edges
            color: '#fff',
            position: 'relative',
            '::before': { // Pseudo-element for the gradient blob
                content: '""',
                position: 'absolute',
                top: '-20%', // Position adjustments may be needed
                right: '-20%',
                width: '70vw', // Size of the blob
                height: '40vw',
                background: `radial-gradient(
                    circle, 
                    ${palette.secondary.main + "60"} 0%, 
                    ${palette.primary.light + "60"} 50%, 
                    ${palette.primary.main + "60"} 100%
                )`, // Gradient colors
                filter: 'blur(100px)', // Adjust the blur effect to your liking
                zIndex: -1,
            }
        }}>
            <Image
                src={journeyUnitImage}
                alt=""
                width={300}
                height={300}
                priority={true}
                style={{
                    position: 'absolute',
                    top: '206px',
                    right: '380px',
                    zIndex: 9,
                }}
            />
            <Image
                src={byteImage}
                alt=""
                width={500}
                height={245}
                priority={true}
                style={{
                    position: 'absolute',
                    top: '64px',
                    right: '30px',
                    zIndex: 7,
                    borderRadius: '10px',
                }}
            />
            <Image
                src={devSpaceImage}
                alt=""
                width={500}
                height={245}
                priority={true}
                style={{
                    position: 'absolute',
                    top: '284px',
                    right: '-113px',
                    zIndex: 8,
                    borderRadius: '10px',
                }}
            />
            <Box sx={{
                maxWidth: '60vw', // Limits the width of the text box for readability
                zIndex: 10,
            }}>
                <Typography
                    variant="h1"
                    gutterBottom
                    sx={{
                        fontWeight: 'regular',
                        lineHeight: '1.2',
                        fontSize: '4vw',
                    }}
                >
                    Learn to code fast
                </Typography>
                <Typography
                    variant="h2"
                    gutterBottom
                    sx={{
                        marginBottom: '100px',
                        fontWeight: 'regular',
                        lineHeight: '1.2',
                        fontSize: '2vw',
                    }}
                >
                    Start with guided learning plans<br />
                    Grow with real-world projects
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        marginBottom: '20px',
                        fontWeight: 'light',
                        fontSize: '1.2vw',
                        lineHeight: '1.2',
                        maxWidth: '40vw',
                    }}
                >
                    GIGO solves the problem we faced when learning to code: it&apos;s hard. 
                    Learn directly in your browser—no installation, no setup required. 
                    Get real-time help with GIGO&apos;s integrated learning assistant, Code Teacher.
                </Typography>
                {windowSize <= 1300 && (
                    <Button
                        variant="contained"
                        sx={{
                            fontSize: "28px",
                            padding: "24px",
                        }}
                        href={"/journey"}
                    >
                        Start Your Journey
                    </Button>
                )}
            </Box>
            {windowSize > 1300 && (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                        position: 'absolute',
                        width: "100%",
                        bottom: '20vh',
                        marginLeft: '-50px',
                    }}
                >
                    <Button
                        variant="contained"
                        sx={{
                            fontSize: "28px",
                            padding: "24px",
                        }}
                        href={"/journey"}
                    >
                        Start Your Journey
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default GIGOLandingPage;
