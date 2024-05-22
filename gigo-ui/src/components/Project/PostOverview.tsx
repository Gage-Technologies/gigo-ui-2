import * as React from "react"
import { Box, Button, Card, CardContent, Chip, TextField, Tooltip, Typography } from "@mui/material";
import UserIcon from "@/icons/User/UserIcon";
import EditIcon from '@mui/icons-material/Edit';
import call from "@/services/api-call";
import config from "@/config";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import { themeHelpers } from "@/theme";
import Person3Icon from '@mui/icons-material/Person3';
// @ts-ignore
import styled, { keyframes } from "styled-components"

interface IProps {
    width: number | string,
    height: number | string,
    userName: string,
    userThumb: string,
    userId: string,
    userTier: string | number,
    postDate: string | Date,
    userIsOP: boolean,
    id: string | number,
    renown: number,
    project: boolean,
    backgroundName: string | null,
    backgroundPalette: string | null,
    backgroundRender: boolean | null,
    estimatedTime: number | null,
}

export default function PostOverview(props: IProps) {
    const styles = {
        card: {
            display: 'flex',
            borderRadius: "18px",
            width: "100%",
            height: "auto",
        },
        image: {
            width: "20%",
            height: "20%",
            borderRadius: "50%"
        },
        cardContent: {
            width: props.width,
            position: "relative",
            borderRadius: "10px",
            borderTopLeftRadius: "10px; !important",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2);",
            ...themeHelpers.frostedGlass,
            // backgroundColor: "rgba(206,206,206,0.31)",
            backgroundColor: "rgba(19,19,19,0.31)"
        },
        sectionDisplay1: {
            width: props.width,
            height: "auto",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
        },
        userName: {
            maxWidth: typeof props.width === "number" ? props.width / 7 : props.width,
            fontSize: "20px"
        },
        sectionDisplay2: {
            paddingRight: "2%",
            lineHeight: 2,
            height: "auto",
            overflowY: "auto",
        },
        title: {
            fontSize: "20px",
            height: typeof props.height === "number" ? props.height * 1 / 4 : props.height,
            width: typeof props.width === "number" ? props.width * .6 : props.width
        },
        summary: {
            fontSize: "14px",
            height: typeof props.height === "number" ? props.height * 1 / 2 : props.height,
            width: typeof props.width === "number" ? props.width * .9 : props.width
        },
        tags: {
            display: "flex",
            width: typeof props.width === "number" ? props.width * .2 : props.width,
            height: typeof props.height === "number" ? props.height * 1 / 4 : props.height,
            justifyContent: "right"
        },
        tag: {
            display: "flex"

        },
        textField: {
            color: `text.secondary`,
        },
    };

    const [editMode, setEditMode] = React.useState(false)

    /**
     * Convert millis duration to a well formatted time string with a min precision of minutes (ex: 1h2m)
     */
    const millisToTime = (millisDuration: number) => {
        const minutes = Math.floor((millisDuration / (1000 * 60)) % 60);
        const hours = Math.floor((millisDuration / (1000 * 60 * 60)) % 24);
        const days = Math.floor(millisDuration / (1000 * 60 * 60 * 24));

        let timeString = "";

        if (days > 0) {
            timeString += `${days}d `;
        }
        if (hours > 0) {
            timeString += `${hours}h `;
        }
        if (minutes > 0) {
            timeString += `${minutes}m `;
        }

        return timeString.trim();
    };


    const handleCancel = () => {
        setEditMode(false)
    }

    const shimmer = keyframes`
      0% {
        background-position: -1200px 0;
      }
      100% {
        background-position: 1200px 0;
      }
    `;

    const StyledDiv = styled.div`
      animation: ${shimmer} 2.2s infinite linear forwards;
      width: 100%;
      height: 220%;
      background: #E5F0FB;
      background: linear-gradient(to right, #c1dceb 4%, #a3cbe1 25%, #c1dceb 36%);
      background-size: 1200px 100%;
    `;

    let date = new Date(props.postDate)

    // @ts-ignore
    return (
        <div style={styles.card}>
            <CardContent sx={styles.cardContent}>
                {props.postDate === "" ? (
                    <Typography component={"div"} sx={styles.sectionDisplay1}>
                        <Typography style={{ display: "flex", flexDirection: "row", width: "85%" }}>
                            <div>
                                <Person3Icon sx={{ width: "50px", height: "50px" }} />
                            </div>
                            <StyledDiv style={{ height: "24px", width: "20%", marginBottom: "12px", borderRadius: "20px", marginTop: "10px" }} />
                        </Typography>
                    </Typography>
                ) : (
                    <Box sx={styles.sectionDisplay1}>
                        <Typography style={{ display: "flex", flexDirection: "row", width: "85%", alignItems: "center" }}>
                            <div>
                                <UserIcon
                                    userId={props.userId}
                                    userTier={props.userTier}
                                    userThumb={props.userThumb}
                                    backgroundName={props.backgroundName}
                                    backgroundPalette={props.backgroundPalette}
                                    backgroundRender={props.backgroundRender}
                                    size={50}
                                    imageTop={2}
                                    mouseMove={false}
                                />
                            </div>
                            <Typography variant="h5" component="div" color="white">
                                {props.userName}
                            </Typography>
                        </Typography>
                        <Box style={{ display: "flex", flexDirection: "column" }}>
                            <Typography variant="body1" color="white" align="right">
                                {date.toLocaleString("en-us", { day: '2-digit', month: 'short', year: 'numeric' })}
                            </Typography>
                            {props.estimatedTime !== null && props.estimatedTime > 0 && (
                                <Tooltip title={"Estimated Tutorial Time"}>
                                    <Typography variant="caption" color="white" align="right">
                                        {millisToTime(props.estimatedTime)}
                                    </Typography>
                                </Tooltip>
                            )}
                        </Box>
                    </Box>
                )}
                {props.postDate === "" ? (
                    <div>
                        <StyledDiv style={{ height: "8px", width: "100%", marginBottom: "16px", borderRadius: "8px", marginTop: "24px" }} />
                        <StyledDiv style={{ height: "8px", width: "100%", marginBottom: "16px", borderRadius: "8px" }} />
                        <StyledDiv style={{ height: "8px", width: "100%", marginBottom: "16px", borderRadius: "8px" }} />
                        <StyledDiv style={{ height: "8px", width: "100%", marginBottom: "16px", borderRadius: "8px" }} />
                        <StyledDiv style={{ height: "8px", width: "40%", marginBottom: "16px", borderRadius: "8px" }} />
                    </div>
                ) : null}
            </CardContent>
        </div>
    )
}

PostOverview.defaultProps = {
    width: 700,
    height: 500,
    userId: 0,
    userName: "",
    userThumb: "",
    userTier: "",
    description: "",
    postDate: "",
    userIsOP: false,
    id: "",
    project: false,
    estimatedTime: 0,
};
