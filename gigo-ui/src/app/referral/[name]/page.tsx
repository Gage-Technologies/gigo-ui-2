import * as React from "react";
import {
    Box,
    Button,
    Grid,
    Typography
} from "@mui/material";
import config from "@/config";
import ReactGA from "react-ga4";
import UserIcon from "@/icons/User/UserIcon";
import { AwesomeButton } from "react-awesome-button";
import AboutPageLearnIcon from "@/icons/aboutPage/AboutPageLearn";
import AboutPageEasyIcon from "@/icons/aboutPage/AboutPageEasy";
import AboutPageConnectionIcon from "@/icons/aboutPage/AboutPageConnection";
import AboutPageWorldIcon from "@/icons/aboutPage/AboutPageWorld";
import type { Metadata, ResolvingMetadata } from 'next'
import GigoCircleIcon from "@/icons/GigoCircleLogo";
import MainRender from "@/components/Pages/Referral/MainRender";
import JsonLd from '@/components/JsonLD';

type Props = {
    params: { name: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const name = params.name

    // fetch data
    const referralUser = await fetch(
        `${config.rootPath}/api/auth/referralUserInfo`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_name: name,
            }),
            credentials: 'include'
        }
    ).then(async (response) => {
        const data = await response.json()
        if (data === undefined || data["user"] === undefined) {
            return null
        }
        return data["user"]
    })

    if (referralUser === null) {
        return {}
    }

    return {
        applicationName: `${referralUser["user_name"]} Invite - GIGO Dev`,
        title: `${referralUser["user_name"]} has invited you to GIGO Dev`,
        description: 'GIGO is a fully integrated learn-to-code platform. Gigo provides cloud development environments, interactive coding challenges, and access to a global community of developers. Join now and start coding!',
        keywords: ['coding', 'programming', 'learning', 'challenges', 'developers', 'cloud development'],
        openGraph: {
            title: `${referralUser["user_name"]} has invited you to GIGO Dev`,
            description: 'GIGO is a fully integrated learn-to-code platform. Gigo provides cloud development environments, interactive coding challenges, and access to a global community of developers. Join now and start coding!',
            type: 'website',
            url: 'https://gigo.dev/referral/' + name,
            images: [
                {
                    url: config.rootPath + "/static/user/pfp/" + referralUser["_id"],
                    width: 250,
                    height: 250,
                    alt: `${referralUser["user_name"]} Avatar`,
                },
                {
                    url: 'https://gigo.dev/logo192.png',
                    width: 192,
                    height: 192,
                    alt: 'GIGO Dev Logo',
                },
            ],
            siteName: 'GIGO Dev',
        }
    }
}

async function ReferralWelcome({ params, searchParams }: Props) {
    const name = params.name;

    ///////// Server Fetching //////////
    const referralUser = await fetch(
        `${config.rootPath}/api/auth/referralUserInfo`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_name: name,
            }),
            credentials: 'include'
        }
    ).then(async (response) => {
        const data = await response.json()
        if (data === undefined || data["user"] === undefined) {
            return null
        }
        return data["user"]
    })

    ///////// Server Fetching //////////


    const isMobile = searchParams?.viewport === "mobile";

    ReactGA.initialize("G-38KBFJZ6M6");

    // transferring data from google logi


    const jsonLdData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": referralUser.user_name,
        "url": `https://gigo.dev/referral/${params.name}`,
        "memberOf": {
            "@type": "Organization",
            "name": "GIGO Dev",
            "url": "https://gigo.dev"
        }
    };

    return (
        <>
            <JsonLd data={jsonLdData} />
            <MainRender referralUser={referralUser} isMobile={isMobile}/>
        </>
    )
}


export default ReferralWelcome;