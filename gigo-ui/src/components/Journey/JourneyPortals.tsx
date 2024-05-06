import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";
import config from "@/config";
import journeySide1 from "@/img/journey/journey-side-1.svg";
import journeySide2 from "@/img/journey/journey-side-2.svg";
import journeySide3 from "@/img/journey/journey-side-3.svg";
import journeySide4 from "@/img/journey/journey-side-4.svg";
import journeySide5 from "@/img/journey/journey-side-5.svg";
import journeySide6 from "@/img/journey/journey-side-6.svg";
import journeySide7 from "@/img/journey/journey-side-7.svg";
import Image from 'next/image';

// @ts-ignore
function JourneyPortals({ currentIndex }) {
    const [animationData, setAnimationData] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    let userPref = localStorage.getItem('theme');

    useEffect(() => {
        const url = userPref !== 'light'
            ? `${config.rootPath}/static/ui/lottie/general/journey-portal-dark.json`
            : `${config.rootPath}/static/ui/lottie/general/journey-portal-light.json`;

        fetch(url, { credentials: 'include' })
            .then(data => data.json())
            .then(json => {
                setAnimationData(json);
                setImageLoaded(true)
            })
            .catch(error => console.error(error));
    }, [userPref]);

    const images = [
        journeySide1, journeySide2, journeySide3, journeySide4,
        journeySide5, journeySide6, journeySide7
    ];
    const currentImage = images[currentIndex % images.length];

    const portalOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    return (
        <div style={{ position: 'relative', width: '20vw', height: '20vw' }}>
            {animationData && (
                <Lottie
                    options={portalOptions}
                    speed={0.5}
                    isClickToPauseDisabled={true}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '20vw',
                        height: '20vw',
                        zIndex: 3,
                        overflow: "visible"
                    }}
                />
            )}
            {imageLoaded && (
                <Image
                    src={currentImage}
                    style={{
                        position: 'absolute',
                        top: 1,
                        left: 1,
                        height: '99%',
                        width: '99%',
                        zIndex: 1
                    }}
                    alt="Journey Portal"
                />
            )}
        </div>
    );
}

export default JourneyPortals;
