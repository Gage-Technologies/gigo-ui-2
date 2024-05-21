import React from 'react';
import HeartIcon from '@/icons/HeartIcon';
import HeartDisabledIcon from '@/icons/HeartDisabledIcon';
import Box from '@mui/material/Box';
import { Tooltip, Typography, Button } from '@mui/material';
import { DailyHearts } from '@/models/dailyHearts';
import { useAppDispatch, useAppSelector } from '@/reducers/hooks';
import call from '../services/api-call';
import config from '../config';
import { initialHeartsStateUpdate, selectRemainingHearts, updateHeartsState } from '@/reducers/hearts/hearts';

interface HeartTrackerProps {
    openGoProPopup: () => void;
    small?: boolean;
}

const HeartTracker: React.FC<HeartTrackerProps> = ({ openGoProPopup, small }) => {
    const dispatch = useAppDispatch();

    const activeHearts = useAppSelector(selectRemainingHearts);
    console.log("activeHearts reducer: ", activeHearts)

    const getActiveHearts = async () => {
        let res = await call(
            "/api/bytes/getUsedHeartCountToday",
            "post",
            null,
            null,
            null,
            // @ts-ignore
            {},
            null,
            config.rootPath
        )

        if (!res || res["remaining_hearts"] === undefined) {
            return
        }

        if (res["remaining_hearts"] !== activeHearts) {
            const newState = Object.assign({}, initialHeartsStateUpdate)
            newState.remainingHearts = res["remaining_hearts"]
            dispatch(updateHeartsState(newState))
        }
    }

    React.useEffect(() => {
        getActiveHearts()
    }, [])


    return (
        <Tooltip title={(
            <Box sx={{ p: 1 }}>
                <Typography variant="h6">
                    {/*@ts-ignore*/}
                    {activeHearts} Heart{activeHearts > 1 ? "s" : ""} Remaining
                </Typography>
                <Typography variant="caption" sx={{ fontSize: "0.8rem", lineHeight: "0px", letterSpacing: "0px" }}>
                    Hearts are the amount of retries you get on Journeys and Bytes.
                    <br />
                    Go Pro to get unlimited retries!
                    <Button
                        variant="contained"
                        onClick={openGoProPopup}
                        sx={{
                            fontSize: "0.8rem",
                            minWidth: "none",
                            height: "30px",
                            p: 0.5,
                            marginLeft: "4px",
                        }}
                    >
                        Go Pro
                    </Button>
                </Typography>
            </Box>
        )}>
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ marginRight: "16px" }}>
                {Array.from({ length: DailyHearts }, (_, index) => (
                    // @ts-ignore
                    index < DailyHearts - activeHearts ?
                        <HeartDisabledIcon key={index} sx={{ fontSize: small ? "0.8rem" : undefined }} /> :
                        <HeartIcon key={index} sx={{ fontSize: small ? "0.8rem" : undefined }} />
                ))}
            </Box>
        </Tooltip>
    );
};

export default HeartTracker;
