'use client'

import config from "@/config"
import GigoCircleIcon from "@/icons/GigoCircleLogo"
import UserIcon from "@/icons/User/UserIcon"
import AboutPageConnectionIcon from "@/icons/aboutPage/AboutPageConnection"
import AboutPageEasyIcon from "@/icons/aboutPage/AboutPageEasy"
import AboutPageLearnIcon from "@/icons/aboutPage/AboutPageLearn"
import AboutPageWorldIcon from "@/icons/aboutPage/AboutPageWorld"
import logoImgMobile from "@/img/WIP-referral-plain-noback.svg";
import { Box, Grid, Typography } from "@mui/material"
import { useState, useEffect } from "react"
import { AwesomeButton } from "react-awesome-button"
import Image from "next/image"

function MainRender({ referralUser, isMobile }: { referralUser: any, isMobile: boolean }) {
    const [isClient, setIsClient] = useState(false)
    useEffect(() => {
        setIsClient(true)
    }, [])


    const iconStyles: React.CSSProperties = {
        width: '150%',
        height: '150%',
    };

    return (
        <div
            style={{
                backgroundColor: `#63a4f8`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                width: '100vw',
                overflow: 'hidden',
            }}
        >
            <div>
                <Grid container justifyContent="center" sx={{
                    display: "flex", flexDirection: "row", width: "100%", height: "100vh", justifyContent: "space-evenly", alignItems: "center",
                }}>
                    <div>
                        <h1 style={!isMobile ? { fontSize: "4vw" } : { fontSize: "6vw" }}>
                            Welcome to GIGO
                        </h1>
                        <Typography style={{ display: "flex", flexDirection: "row", width: "85%" }}>
                            <div>
                                {isClient && (
                                    <UserIcon
                                        userId={
                                            referralUser["_id"]}
                                        userTier={
                                            referralUser["tier"]}
                                        userThumb={config.rootPath + "/static/user/pfp/" +
                                            referralUser["_id"]}
                                        backgroundName={
                                            referralUser["name"]}
                                        backgroundPalette={
                                            referralUser["color_palette"]}
                                        backgroundRender={
                                            referralUser["render_in_front"]}
                                        size={window.innerWidth / 10}
                                        imageTop={2}
                                        mouseMove={false}
                                    />
                                )}
                            </div>
                            <Typography variant="h5" component="div" style={!isMobile ? { fontSize: "2vw", display: "flex", alignItems: "center", paddingLeft: "3vw" } : { fontSize: "4vw", display: "flex", alignItems: "center", paddingLeft: "3vw" }}>
                                {referralUser["user_name"] + " invited you to GIGO"}
                            </Typography>
                        </Typography>
                        <h3 style={!isMobile ? { fontSize: "2vw" } : { fontSize: "6vw" }}>
                            Claim your free month now!
                        </h3>
                        <AwesomeButton style={!isMobile ? {
                            width: "auto",
                            '--button-primary-color': "#29C18C",
                            '--button-primary-color-dark': "#1c8762",
                            '--button-primary-color-light': "#fff",
                            '--button-primary-color-hover': "#29C18C",
                            '--button-default-border-radius': "24px",
                            '--button-hover-pressure': "4",
                            height: "10vh",
                            '--button-raise-level': "10px",
                            marginTop: "40px"
                        } : {
                            width: "100%",
                            '--button-primary-color': "#29C18C",
                            '--button-primary-color-dark': "#1c8762",
                            '--button-primary-color-light': "#fff",
                            '--button-primary-color-hover': "#29C18C",
                            '--button-default-border-radius': "12px",
                            '--button-hover-pressure': "4",
                            height: "calc(8vw + 20px)",
                            '--button-raise-level': "6px",
                            marginTop: "40px"
                        }} type="primary" href={"/signup/" + referralUser["user_name"]}>
                            <h1 style={{ fontSize: isMobile ? "8vw" : "3vw", paddingRight: "1vw", paddingLeft: "1vw" }}>
                                Create Account
                            </h1>
                        </AwesomeButton>
                    </div>
                    <div>
                        {isClient && (
                            <Image
                                src={logoImgMobile}
                                alt="Gigo Logo"
                                width={isMobile ? window.innerWidth : window.innerWidth * .45}
                            />
                        )}
                    </div>
                    <Box display={"flex"} flexDirection={"column"} alignItems={"center"} sx={{ position: "absolute", bottom: "20px" }}>
                        <Typography variant="body2">
                            <a href="/about" style={{ textDecoration: "underline" }}>
                                Learn more about GIGO
                            </a>
                        </Typography>
                    </Box>
                </Grid>
            </div>
        </div>
    );
}

export default MainRender;
