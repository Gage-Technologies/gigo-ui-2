import React from "react";
import compass from '@/img/journey/compass.svg';
import Image from 'next/image';

export type JourneyIconStyle = {
    style: React.CSSProperties;
};

function JourneyIcon(props: JourneyIconStyle) {
    return (
        <div style={{display: "flex", justifyContent: "center"}}>
            <Image
                src={compass}
                alt="compass"
                style={props.style}
            />
        </div>
    );
}

export default JourneyIcon;