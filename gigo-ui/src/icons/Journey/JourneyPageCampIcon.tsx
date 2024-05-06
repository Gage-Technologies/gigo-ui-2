import journeyCamp from "@/img/journey/camp-site-journey.svg";
import React from "react";
import Image from 'next/image';

function JourneyPageCampIcon(props: any) {
    const aspectRatio = props.aspectRatio || '16:9';

    const [widthRatio, heightRatio] = aspectRatio.split(':').map(Number);
    const paddingBottom = `${(heightRatio / widthRatio) * 100}%`;

    if (props.aspectRatio === '21:9') {
        return (
            <div style={{...props.style, width: props.width, paddingBottom, position: 'relative'}}>
                <Image alt="" src={journeyCamp} style={{position: 'absolute', width: '100%', height: '100%'}}/>
            </div>
        );
    } else {
        return (
            <div style={{...props.style, width: props.width, paddingBottom, position: 'relative'}}>
                <Image alt="" src={journeyCamp} style={{position: 'absolute', width: '100%', height: '100%'}}/>
            </div>
        );
    }

}

export default JourneyPageCampIcon;
