

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/reducers/store';

export interface AppWrapperState {
    closedMobileWelcomeBanner: boolean
}

export interface AppWrapperStateUpdate {
    closedMobileWelcomeBanner: boolean | null
}

export const initialAppWrapperState: AppWrapperState = {
    closedMobileWelcomeBanner: false
}

export const initialAppWrapperStateUpdate: AppWrapperStateUpdate = {
    closedMobileWelcomeBanner: null,
}

export const appWrapperSlice = createSlice({
    name: 'appWrapper',
    initialState: initialAppWrapperState,
    reducers: {
        resetAppWrapper: (state) => {
            state.closedMobileWelcomeBanner = false
        },
        updateAppWrapper: (state, update: PayloadAction<AppWrapperStateUpdate>) => {
            if (update.payload.closedMobileWelcomeBanner !== null) {
                state.closedMobileWelcomeBanner = update.payload.closedMobileWelcomeBanner
            }
        },
    }
});

export const { resetAppWrapper, updateAppWrapper } = appWrapperSlice.actions;

export const selectAppWrapperClosedMobileWelcomeBanner = (state: RootState) => state.appWrapper ? state.appWrapper.closedMobileWelcomeBanner : initialAppWrapperState.closedMobileWelcomeBanner;

export default appWrapperSlice.reducer;

