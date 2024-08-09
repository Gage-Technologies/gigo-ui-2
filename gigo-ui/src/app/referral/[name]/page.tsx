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
import backgroundImage from '@/img/welcome-background.png';
import ThinkingGorillaImage from '@/img/thinking-gorilla-discord-png.svg'; // import the svg image
import Image from 'next/image';

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

    // check if the referral user is null and return a message if so
    if (referralUser === null) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    backgroundImage: `url(${backgroundImage.src})`, // ensure the background image is correctly referenced
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    textAlign: 'center',
                    padding: '20px', // add padding for better spacing
                }}
            >
                <Typography variant="h2" color="error" sx={{ mb: 2, fontSize: { xs: '4vw', sm: '3vw', md: '2.5vw' } }}>
                    Sorry, we could not find that user on GIGO
                </Typography>
                <Typography variant="h6" sx={{ color: '#fff', maxWidth: '600px', fontSize: { xs: '3vw', sm: '2.5vw', md: '1.5rem' }, lineHeight: 1.4 }}>
                    Please check the username and try again. If you believe this is an error, contact support at <a href="mailto:contact@gigo.dev" style={{ color: '#fff', textDecoration: 'underline' }}>contact@gigo.dev</a>.
                </Typography>
                <Image 
                    src={ThinkingGorillaImage} // use the svg image
                    alt="thinking gorilla emoji" 
                    style={{ marginTop: '20px' }} 
                    width={250} // 3x the original width of 50px
                    height={250} // 3x the original height of 50px
                /> {/* add the image below the text */}
            </Box>
        );
    }

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