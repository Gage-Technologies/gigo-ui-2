import React from 'react';
import { Icon } from "@material-ui/core";
import pro from '@/img/pro/premium_gorilla_pro.svg';
import Image from "next/image";

function ProIcon() {
    return (
        <Icon>
            <Image src={pro} height={32} width={32} alt="Pro"/>
        </Icon>
    );
}

export default ProIcon;
