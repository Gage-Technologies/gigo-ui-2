import React, { useState } from "react";
import {
    Box,
    Button,
    ClickAwayListener, createTheme,
    Grow, IconButton,
    MenuItem,
    MenuList, PaletteMode,
    Paper,
    Popper, Tooltip, Typography,
} from "@mui/material";
import Notification from "@/models/notification";
import CloseIcon from "@mui/icons-material/Close";
import call from "@/services/api-call";
import config from "@/config";
import swal from "sweetalert";
import { getAllTokens } from "@/theme";
import NotificationsPausedIcon from '@mui/icons-material/NotificationsPaused';
import {useRouter} from "next/navigation";


interface IProps {
    open: boolean;
    onClose: () => void;
    notificationCount: number;
    notifications: Notification[];
    setNotifications: (notifications: Notification[]) => void;
    setNotificationCount: (notificationCount: number) => void;
}

const NotificationPopup: React.FC<IProps> = ({
                                                 open,
                                                 onClose,
                                                 notificationCount,
                                                 notifications,
                                                 setNotifications,
                                                 setNotificationCount,
                                             }) => {
    let navigate = useRouter();

    let userPref = localStorage.getItem('theme')
    const [mode, _] = React.useState<PaletteMode>(userPref === 'light' ? 'light' : 'dark');
    const theme = React.useMemo(() => createTheme(getAllTokens(mode)), [mode]);

    const acknowledgeNotification = async (notification_id: string) => {
        let res = await call(
            "/api/notification/acknowledge",
            "POST",
            null,
            null,
            null,
            // @ts-ignore
            {
                notification_id: notification_id,
            },
            null,
            config.rootPath
        )

        if (res === undefined) {
            swal("Server Error", "We can't get in touch with the GIGO servers right now. Sorry about that! " +
                "We'll get crackin' on that right away!")
            return
        }

        if (res["message"] === undefined) {
            swal("Server Error", res["message"])
            return
        }

        if (res["message"] !== "Notification acknowledged") {
            swal("We seem to be having trouble clearing your notification. Sorry for the inconvenience!")
            return
        }

    }

    const clearAllNotifications = async () => {
        let res = await call(
            "/api/notification/clearAll",
            "POST",
            null,
            null,
            null,
            // @ts-ignore
            {},
            null,
            config.rootPath
        )

        if (res === undefined) {
            swal("Server Error", "We can't get in touch with the GIGO servers right now. Sorry about that! " +
                "We'll get crackin' on that right away!")
            return
        }

        if (res["message"] === undefined) {
            swal("Server Error", res["message"])
            return
        }

        if (res["message"] !== "Notifications cleared") {
            swal("We seem to be having trouble clearing your notification. Sorry for the inconvenience!")
            return
        }

        onClose();
        setNotificationCount(0);
        setNotifications([]);
    }

    const handleNotificationClose = (notifId: string, event?: React.MouseEvent) => {
        event?.stopPropagation();

        const updatedNotifications = notifications.filter(notification => notification._id !== notifId);
        setNotifications(updatedNotifications);
        setNotificationCount(notificationCount - 1);

        acknowledgeNotification(notifId)
    };

    const handleClose = (event: MouseEvent | TouchEvent) => {
        onClose();
    };

    const handleNotificationNavigate = (event: React.MouseEvent<HTMLLIElement, MouseEvent> | React.TouchEvent<HTMLLIElement>, notificationType: number, notifId: string) => {
        if (notificationType === 0) {
            // add a navigate to friends page once available
            navigate.push("/profile")
            handleNotificationClose(notifId)
        } else if (notificationType === 1) {
            acknowledgeNotification(notifId)
            navigate.push("/nemesis")
            handleNotificationClose(notifId)
        } else if (notificationType === 2) {
            acknowledgeNotification(notifId)
            navigate.push("/nemesis")
            handleNotificationClose(notifId)
        } else if (notificationType === 3) {
            acknowledgeNotification(notifId)
            navigate.push("/streak")
            handleNotificationClose(notifId)
        } else {
            acknowledgeNotification(notifId)

            handleNotificationClose(notifId)
        }
    };

    return (
        <Popper open={open} transition sx={{
            zIndex: 10000,
            position: 'absolute !important',
            width: '200px',
            top: "68px !important",
            right: "40px !important",
            left: "auto !important",
        }}>
            {({ TransitionProps, placement }) => (
                <Grow
                    {...TransitionProps}
                    style={{
                        transformOrigin: placement === "bottom" ? "center top" : "center bottom",
                    }}
                >
                    <Paper sx={{ width: "115%" }}>
                        <ClickAwayListener onClickAway={handleClose}>
                            <Box>
                                {notifications.length > 0 ? (
                                        <Box sx={{ textAlign: "center", paddingTop: "10px", paddingBottom: "3px" }}>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                onClick={clearAllNotifications}
                                                size={"medium"}
                                            >
                                                Clear All
                                            </Button>
                                        </Box>
                                    ) :
                                    <Box sx={{ textAlign: "center", paddingTop: "10px", paddingBottom: "3px", flexDirection: "column", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        No Notifications!
                                        <NotificationsPausedIcon fontSize={"large"} style={{ color: theme.palette.primary.contrastText, opacity: 0.2 }} />
                                    </Box>
                                }
                                <MenuList autoFocusItem={open} id="menu-list-grow">
                                    {notifications.map((notification, index) => (
                                        <MenuItem
                                            key={index}
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                paddingRight: "40px",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                wordBreak: "break-all",
                                                maxWidth: "30ch",
                                                backgroundColor: "transparent",
                                                borderColor: `ActiveBorder`,
                                                borderWidth: "2px",
                                                borderStyle: "solid",
                                                margin: "10px 0",
                                                borderRadius: "10px",
                                                padding: "5px",
                                            }}
                                            onClick={(event) => handleNotificationNavigate(event, notification.notification_type, notification._id)}
                                        >
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: "text.primary",
                                                    fontSize: "16px",
                                                    fontStyle: `normal`,
                                                }}
                                            >
                                                {notification.message}
                                            </Typography>
                                            <IconButton
                                                edge="end"
                                                color="inherit"
                                                size="small"
                                                onClick={(event) => {
                                                    event.stopPropagation(); // This stops MenuItem Onclick from overriding close icon Onclick
                                                    handleNotificationClose(notification._id);
                                                }}
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 0,
                                                    zIndex: 1000
                                                }}
                                            >
                                                <CloseIcon />
                                            </IconButton>
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </Box>
                        </ClickAwayListener>
                    </Paper>
                </Grow>
            )}
        </Popper>
    );
};

export default NotificationPopup;