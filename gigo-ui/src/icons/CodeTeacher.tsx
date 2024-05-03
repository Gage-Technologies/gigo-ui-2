import React from 'react';
import { Icon } from "@material-ui/core";
import codeTeacher from '@/img/codeteacher.svg'
import Image from "next/image";

function CodeTeacherIcon() {
    return (
        <Icon>
            <Image alt="" src={codeTeacher} height={30} width={30}/>
        </Icon>
    );
}

export default CodeTeacherIcon;
