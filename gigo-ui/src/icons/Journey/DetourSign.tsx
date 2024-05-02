import sign from "@/img/journey/detour-sign.png";
import React from "react";
import Image from 'next/image';

function DetourSignIcon(props: any) {
    return (
        <div style={{...props.style, width: props.width, height: props.height, position: 'relative'}}>
            <Image alt="" src={sign} style={{width: '100%', height: '100%'}} />
        </div>
    );


}

export default DetourSignIcon;