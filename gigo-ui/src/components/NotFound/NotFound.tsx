"use client"

import notFoundDark from "@/img/404-dark.svg";
import notFoundDark219 from "@/img/404-dark-219.svg"
import notFoundLight from "@/img/404-light.svg";
import notFoundLight219 from "@/img/404-light-219.svg"

import React from "react";
import { theme } from "@/theme";
import Image from 'next/image';
import { AwesomeButton } from "react-awesome-button";

function NotFoundPageIcon() {
    const aspectRatio = useAspectRatio();

    const [widthRatio, heightRatio] = aspectRatio.split(':').map(Number);
    const paddingBottom = `${(heightRatio / widthRatio) * 100}%`;

    // determine which image to use based on theme and aspect ratio
    const imageSource = theme.palette.mode === 'dark'
        ? (aspectRatio === '21:9' ? notFoundDark219 : notFoundDark)
        : (aspectRatio === '21:9' ? notFoundLight219 : notFoundLight);

    return (
        <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
            {/* <div style={{ width: '120%', height: '100%' }}> */}
                <Image
                    src={imageSource}
                    alt="Not Found"
                    layout="fill"
                    objectFit="cover"
                    style={{ width: '100%', height: '100%', objectPosition: 'center center' }}
                />
            {/* </div> */}
            <div style={{
                position: 'absolute',
                bottom: '50px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10
            }}>
                <AwesomeButton href={"/home"} style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    '--button-primary-color': "#29C18C",
                    '--button-primary-color-dark': "#1c8762",
                    '--button-primary-color-light': "#1c8762",
                    '--button-primary-color-active': "#1c8762",
                    '--button-primary-color-hover': "#29C18C",
                    '--button-default-font-size': '48px',
                    '--button-default-border-radius': '10px',
                    '--button-horizontal-padding': '20px',
                    '--button-vertical-padding': '20px',
                    '--button-raise-level': '8px',
                    '--button-hover-pressure': '3',
                    '--transform-speed': '0.275s',
                    height: '80px',
                }}>
                    Go Home
                </AwesomeButton>
            </div>
        </div>
    );
}

function useAspectRatio() {
    const [aspectRatio, setAspectRatio] = React.useState('');

    React.useEffect(() => {
        function gcd(a: any, b: any): any {
            return b === 0 ? a : gcd(b, a % b);
        }

        function calculateAspectRatio() {
            const width = window.screen.width;
            const height = window.screen.height;
            let divisor = gcd(width, height);
            // Dividing by GCD and truncating into integers
            let simplifiedWidth = Math.trunc(width / divisor);
            let simplifiedHeight = Math.trunc(height / divisor);

            divisor = Math.ceil(simplifiedWidth / simplifiedHeight);
            simplifiedWidth = Math.trunc(simplifiedWidth / divisor);
            simplifiedHeight = Math.trunc(simplifiedHeight / divisor);
            setAspectRatio(`${simplifiedWidth}:${simplifiedHeight}`);
        }

        calculateAspectRatio();

        window.addEventListener('resize', calculateAspectRatio);

        return () => {
            window.removeEventListener('resize', calculateAspectRatio);
        };
    }, []);

    return aspectRatio;
}

export default NotFoundPageIcon;