'use client'
import React, {ReactNode, Suspense, useState} from 'react';
import {Box, IconButton, MobileStepper} from '@mui/material';
import {KeyboardArrowLeft, KeyboardArrowRight} from '@mui/icons-material';
import SwipeableViews from 'react-swipeable-views';
import {theme} from "@/theme";
import {useSearchParams} from "next/navigation";
import SuspenseFallback from "@/components/SuspenseFallback";

interface CarouselProps {
    children: ReactNode;
    itemsShown: number;
    itemsToSlide: number;
    infiniteLoop: boolean;
    detour?: boolean;
}

const Carousel: React.FC<CarouselProps> = ({
                                               children,
                                               itemsShown,
                                               itemsToSlide,
                                               infiniteLoop,
                                               detour,
                                           }) => {
    let query = useSearchParams();
    let isMobile = query.get("viewport") === "mobile";

    const [activeStep, setActiveStep] = useState(0);
    const childrenArray = React.Children.toArray(children);
    const maxSteps = Math.ceil(childrenArray.length / itemsShown);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => {
            const nextStep = prevActiveStep + itemsToSlide / itemsShown;
            if (infiniteLoop && nextStep >= maxSteps) {
                return 0; // Loop back to the start.
            }
            return Math.min(nextStep, maxSteps - 1);
        });
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => {
            const prevStep = prevActiveStep - itemsToSlide / itemsShown;
            if (infiniteLoop && prevStep < 0) {
                return maxSteps - 1; // Loop to the end.
            }
            return Math.max(0, prevStep);
        });
    };

    return (
        <Suspense fallback={<SuspenseFallback/>}>
            <style>{`
                div[aria-hidden="false"][data-swipeable="true"][style] {
                    overflow: hidden !important;
                }
            `}</style>
            <Box sx={{position: 'relative', width: '100%', overflow: 'hidden'}}>
                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={activeStep * (itemsShown / itemsToSlide)}
                    onChangeIndex={(index) => setActiveStep(index / (itemsShown / itemsToSlide))}
                    enableMouseEvents
                >
                    {Array.from({length: maxSteps}, (_, idx) => (
                        <Box key={idx} display="flex" justifyContent="center">
                            {childrenArray
                                .slice(idx * itemsShown, idx * itemsShown + itemsShown)
                                .map((child, index) => (
                                    <Box
                                        key={index}
                                        p={1}
                                        width={`${100 / Math.min(itemsShown, childrenArray.length)}%`}
                                        display="flex"
                                        justifyContent="center"
                                    >
                                        {child}
                                    </Box>
                                ))}
                        </Box>
                    ))}
                </SwipeableViews>
                {maxSteps > 1 && !isMobile && (
                    <>
                        <IconButton
                            onClick={handleBack}
                            sx={{
                                height: "4vh",
                                width: "4vh",
                                position: 'absolute',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                left: theme.spacing(2),
                                zIndex: 1,
                                display: activeStep === 0 && !infiniteLoop ? 'none' : 'inline-flex',
                                border: `1px solid ${theme.palette.primary.dark}`,
                                backdropFilter: "blur(10px)",
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                                }
                            }}
                        >
                            <KeyboardArrowLeft/>
                        </IconButton>
                        <IconButton
                            onClick={handleNext}
                            sx={{
                                height: "4vh",
                                width: "4vh",
                                position: 'absolute',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                right: theme.spacing(2),
                                zIndex: 1,
                                display: activeStep >= maxSteps - 1 && !infiniteLoop ? 'none' : 'inline-flex',
                                border: `1px solid ${theme.palette.primary.dark}`,
                                backdropFilter: "blur(10px)",
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                                }
                            }}
                        >
                            <KeyboardArrowRight/>
                        </IconButton>
                        <MobileStepper
                            steps={maxSteps}
                            variant="dots"
                            activeStep={activeStep}
                            sx={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                width: '100%',
                                justifyContent: 'center',
                                backgroundColor: 'transparent',
                                zIndex: 100
                            }}
                            backButton={null}
                            nextButton={null}
                        />
                    </>
                )}
                {
                    detour
                        ?
                        <MobileStepper
                            steps={maxSteps}
                            variant="dots"
                            activeStep={activeStep}
                            sx={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                width: '100%',
                                justifyContent: 'center',
                                backgroundColor: 'transparent',
                            }}
                            backButton={null}
                            nextButton={null}
                        />
                        :
                        null
                }
            </Box>
        </Suspense>
    );
};

export default Carousel;
