import React from "react";
import banana from '@/img/journey/compass.svg';
import Image from "next/image"

export type AboutPageStyle = {
    style: React.CSSProperties;
};

function JourneyIcon(props: AboutPageStyle) {
    return (
        <div style={{display: "flex", justifyContent: "center"}}>
            <Image alt="" src={banana} style={props.style}/>
        </div>
    );
}

export default JourneyIcon;