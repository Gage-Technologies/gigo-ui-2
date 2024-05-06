import byte from "@/img/bytes/byte-medium-difficulty-no-selection.svg";
import React from "react";
import Image from 'next/image';

function ByteMediumNoSelectionIcon(props: any) {
    const aspectRatio = props.aspectRatio || '16:9';

    const [widthRatio, heightRatio] = aspectRatio.split(':').map(Number);
    const paddingBottom = `${(heightRatio / widthRatio) * 100}%`;


    return (
        <div style={{...props.style, width: props.width, position: 'relative'}}>
            <Image alt="" src={byte} style={{width: '100%', height: '100%'}}/>
        </div>
    );


}

export default ByteMediumNoSelectionIcon;
