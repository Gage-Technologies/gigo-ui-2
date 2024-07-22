'use client';
import * as React from "react";
import {Button, Card, createTheme, CssBaseline, PaletteMode, Tab, Tabs, ThemeProvider, Tooltip, Typography} from "@mui/material";
import {theme} from "@/theme";
import {useEffect, useReducer} from "react";
import swal from "sweetalert";
import config from "../config";
import {initialAuthStateUpdate, selectAuthState, updateAuthState} from "@/reducers/auth/auth";
import {useAppSelector} from "@/reducers/hooks";
import ReactGA from "react-ga4";
import BytesCard from "../components/BytesCard";
import { programmingLanguages } from "@/services/vars";
import BytesCardMobile from "@/components/Bytes/BytesCardMobile";
import {useRouter} from "next/navigation";


function AllBytesScrollMobile() {
    let navigate = useRouter();

    const [bytes, setBytes] = React.useState([]);

    const [skip, setSkip] = React.useState(0);

    ReactGA.initialize("G-38KBFJZ6M6");

    let loggedIn = false
    const authState = useAppSelector(selectAuthState);
    if (authState.authenticated !== false) {
        loggedIn = true
    }

    window.onscroll = function() {
        if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
            apiLoad()
        }
    }

    const apiLoad = async () => {
        let byteData = fetch(
            `${config.rootPath}/api/bytes/getRecommendedBytes`,
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({}),
            }
        ).then(res => res.json());


        const [res] = await Promise.all([byteData])

        if (res === undefined){
            swal("There has been an issue loading data. Please try again later.")
        }

        setBytes(res["rec_bytes"])
    }



    useEffect(() => {
        //null
        apiLoad()
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    overflowY: "scroll",
                    height: "100%",
                    width: "100%",
                    marginTop: "5vh",
                }}>
                    {bytes.length > 0 ? (
                        bytes.map((byte) => (
                            <div key={byte["_id"]} style={{ width: '100%', display: 'flex', justifyContent: 'center', paddingTop: "1em" }}>
                                <BytesCardMobile
                                    completedEasy={byte["completed_easy"]}
                                    completedMedium={byte["completed_medium"]}
                                    completedHard={byte["completed_hard"]}
                                    height="100%"
                                    width="100%"
                                    bytesId={byte["_id"]}
                                    bytesTitle={byte["name"]}
                                    bytesDesc={byte["description_medium"]}
                                    bytesThumb={config.rootPath + "/static/bytes/t/" + byte["_id"]}
                                    onClick={() => navigate.push("/byte/" + byte["_id"])}
                                    role={authState.role}
                                    language={programmingLanguages[byte["lang"]]}
                                />
                            </div>
                        ))
                    ) : (
                        <Typography textAlign="center">Loading bytes...</Typography>
                    )}
                </div>
            </CssBaseline>
        </ThemeProvider>
    );
}

export default AllBytesScrollMobile;