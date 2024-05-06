'use client'
import React from 'react';
import { Icon } from "@mui/material";
import ProBanner from '@/img/pro/pro-background-profile.svg'
import Image from "next/image";

function ProBackgroundProfile(props: any) {
    return (
        <Icon style={{width: "100%", height: "100%"}}>
            <Image alt="" src={ProBanner} height={props.height} width={props.width} style={props.style}/>
        </Icon>
    );
}

export default ProBackgroundProfile;