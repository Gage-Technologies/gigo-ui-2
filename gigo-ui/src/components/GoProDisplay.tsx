import React, {useEffect, useState} from 'react';
import {Box, Dialog, IconButton, Typography} from '@mui/material';
import Close from '@mui/icons-material/Close'; // Assuming you're using MUI icons
import {LoadingButton} from '@mui/lab';
import premiumGorilla from "../img/pro-pop-up-icon-plain.svg";
import {theme} from "@/theme";
import config from "../config";
import proBackground from "../img/popu-up-backgraound-plain.svg";
import {useAppSelector} from "@/reducers/hooks";
import {selectAuthState} from "@/reducers/auth/auth"; // Adjust import based on actual location
import Image from "next/image";
import {useSearchParams} from "next/navigation";

interface GoProPopupProps {
    open: boolean;
    onClose: () => void;
}

const GoProDisplay: React.FC<GoProPopupProps> = ({open, onClose}) => {
    let query = useSearchParams();
    let isMobile = query.get("viewport") === "mobile";

    const authState = useAppSelector(selectAuthState);

    const [proUrlsLoading, setProUrlsLoading] = useState(false);
    const [proMonthlyLink, setProMonthlyLink] = useState('');
    const [proYearlyLink, setProYearlyLink] = useState('');

    const retrieveProUrls = async (): Promise<{ monthly: string, yearly: string } | null> => {
        setProUrlsLoading(true)
        let res = await fetch(
            `${config.rootPath}/api/stripe/premiumMembershipSession`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: '{}',
                cache: "no-cache"
            }
        ).then(async (response) => response.json())

        setProUrlsLoading(false)

        if (res !== undefined && res["return url"] !== undefined && res["return year"] !== undefined) {
            setProMonthlyLink(res["return url"])
            setProYearlyLink(res["return year"])
            return {
                "monthly": res["return url"],
                "yearly": res["return year"],
            }
        }

        return null
    }

    useEffect(() => {
        if (authState.authenticated) {
            retrieveProUrls()
        }
    }, [authState.authenticated])

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md"
                    PaperProps={{sx: {borderRadius: 7, overflow: "hidden"}}}>
                <Box style={{
                    width: isMobile ? "80vw" : "28vw",
                    height: isMobile ? "78vh" : "70vh",
                    minHeight: "420px",
                    // justifyContent: "center",
                    // marginLeft: "25vw",
                    // marginTop: "5vh",
                    outlineColor: "black",
                    borderRadius: 7,
                    boxShadow:
                        "0px 12px 6px -6px rgba(0,0,0,0.6),0px 6px  0px rgba(0,0,0,0.6),0px 6px 18px 0px rgba(0,0,0,0.6)",
                    // backgroundColor: theme.palette.background.default,
                    backgroundImage: `url(${proBackground})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center center"
                }}>
                    <div style={{
                        borderRadius: "10px",
                        padding: "20px",
                        textAlign: "center",
                    }}>
                        <IconButton
                            edge="end"
                            color="inherit"
                            size="small"
                            onClick={onClose}

                            sx={isMobile ? {
                                position: "absolute",
                                top: '3vh',
                                right: '3vw',
                                color: "white"
                            } : {
                                position: "absolute",
                                top: '2vh',
                                right: '2vw', color: "white"
                            }}
                        >
                            <Close/>
                        </IconButton>
                        <Image alt={""} src={premiumGorilla} style={isMobile ? {width: "20%", marginBottom: "5px"} : {
                            width: "30%",
                            marginBottom: "20px"
                        }}/>
                        <Typography variant={isMobile ? "h5" : "h4"}
                                    style={{marginBottom: "10px", color: "white"}} align={"center"}>GIGO
                            Pro</Typography>
                        <Typography variant={isMobile ? "body2" : "body1"}
                                    style={{marginLeft: "20px", marginRight: "20px", color: "white"}} align={"center"}>
                            Learn faster with a smarter Code Teacher!
                        </Typography>
                        <Typography variant={isMobile ? "body2" : "body1"}
                                    style={{
                                        marginBottom: "20px",
                                        marginLeft: "20px",
                                        marginRight: "20px",
                                        color: "white"
                                    }}
                                    align={"center"}>
                            Do more with larger DevSpaces!
                        </Typography>
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row",
                            width: "100%"
                        }}>
                            <div style={isMobile ? {
                                backgroundColor: "#070D0D",
                                borderRadius: "10px",
                                padding: "20px",
                                margin: "10px",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                                textAlign: "center",
                                height: "fit-content"
                            } : {
                                backgroundColor: "#070D0D",
                                borderRadius: "10px",
                                padding: "20px",
                                margin: "10px",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                                textAlign: "center",
                                width: "200px"
                            }}>
                                <Typography variant={isMobile ? "subtitle2" : "subtitle1"}
                                            style={{marginBottom: "10px", color: "white"}}
                                            align={"center"}>Monthly</Typography>
                                <Typography variant={isMobile ? "h6" : "h5"}
                                            style={{marginBottom: "10px", color: "white"}}
                                            align={"center"}>$8</Typography>
                                <LoadingButton
                                    loading={proUrlsLoading}
                                    variant="contained"
                                    href={proMonthlyLink}
                                    target="_blank"
                                    style={{backgroundColor: theme.palette.secondary.dark}}
                                >
                                    Select
                                </LoadingButton>
                            </div>
                            <div style={isMobile ? {
                                backgroundColor: "#070D0D",
                                borderRadius: "10px",
                                padding: "20px",
                                margin: "10px",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                                textAlign: "center",
                                height: "fit-content"
                            } : {
                                backgroundColor: "#070D0D",
                                borderRadius: "10px",
                                padding: "20px",
                                margin: "10px",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                                textAlign: "center",
                                width: "200px"
                            }}>
                                <Typography variant={isMobile ? "subtitle2" : "subtitle1"}
                                            style={{marginBottom: "10px", color: "white"}}
                                            align={"center"}>Yearly</Typography>
                                <Typography variant={isMobile ? "h6" : "h5"}
                                            style={{marginBottom: "10px", color: "white"}}
                                            align={"center"}>$80</Typography>
                                <LoadingButton
                                    loading={proUrlsLoading}
                                    variant="contained"
                                    href={proYearlyLink}
                                    target="_blank"
                                    style={{backgroundColor: theme.palette.secondary.dark}}
                                >
                                    Select
                                </LoadingButton>
                            </div>
                        </div>
                        <Typography
                            variant="body1"
                            style={{marginTop: "20px", color: "white", cursor: "pointer"}}
                            align="center"
                            component="a" // Render the Typography as an <a> tag
                            href="/premium" // Specify the target URL
                            target="_blank"
                        >
                            Learn More About Pro
                        </Typography>
                    </div>
                </Box>
            </Dialog>
        </>
    );
};

export default GoProDisplay;
