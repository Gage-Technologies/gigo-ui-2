import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '@/reducers/store';

export interface BytesState {
    initialized: boolean;
    byteDifficulty: number;
    acceptedExplanationSuggestion: boolean;
    helpPopupClosedByUser: boolean;
    nextStepsPopupClosedByUser: boolean;
    handoutClosedByUser: boolean;
}

export interface BytesStateUpdate {
    initialized: boolean | null;
    byteDifficulty: number | null;
    acceptedExplanationSuggestion: boolean | null;
    nextStepsPopupClosedByUser: boolean | null;
    handoutClosedByUser: boolean | null;
}

export const initialBytesState: BytesState = {
    initialized: false,
    byteDifficulty: 0,
    acceptedExplanationSuggestion: false,
    helpPopupClosedByUser: false,
    nextStepsPopupClosedByUser: false,
    handoutClosedByUser: false
};

export const initialBytesStateUpdate: BytesStateUpdate = {
    initialized: null,
    byteDifficulty: null,
    acceptedExplanationSuggestion: null,
    nextStepsPopupClosedByUser: null,
    handoutClosedByUser: null,
};

export const bytesSlice = createSlice({
    name: 'bytes',
    initialState: initialBytesState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        clearBytesState: (state) => {
            state.initialized = false
            state.byteDifficulty = 0
        },
        updateBytesState: (state, update: PayloadAction<BytesStateUpdate>) => {
            if (update.payload.initialized !== null) {
                state.initialized = update.payload.initialized
            }

            if (update.payload.byteDifficulty !== null) {
                state.byteDifficulty = update.payload.byteDifficulty
            }

            if (update.payload.acceptedExplanationSuggestion !== null) {
                state.acceptedExplanationSuggestion = update.payload.acceptedExplanationSuggestion
            }

            if (update.payload.nextStepsPopupClosedByUser !== null) {
                state.nextStepsPopupClosedByUser = update.payload.nextStepsPopupClosedByUser
            }

            if (update.payload.handoutClosedByUser !== null) {
                state.handoutClosedByUser = update.payload.handoutClosedByUser
            }
        },
        setHelpPopupClosedByUser: (state, action: PayloadAction<boolean>) => {
            state.helpPopupClosedByUser = action.payload;
        },
    }
});

export const {updateBytesState, clearBytesState, setHelpPopupClosedByUser} = bytesSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectBytesState = (state: RootState) => state.bytes;
export const selectBytesInitialized = (state: RootState) => state.bytes ? state.bytes.initialized : initialBytesState.initialized;
export const selectBytesDifficulty = (state: RootState) => state.bytes ? state.bytes.byteDifficulty : initialBytesState.byteDifficulty;
export const selectBytesExplanationSuggestion = (state: RootState) => state.bytes ? state.bytes.acceptedExplanationSuggestion : initialBytesState.acceptedExplanationSuggestion;
export const selectBytesNextStepsPopupClosedByUser = (state: RootState) => state.bytes ? state.bytes.nextStepsPopupClosedByUser : initialBytesState.nextStepsPopupClosedByUser;
export const selectBytesHandoutClosedByUser = (state: RootState) => state.bytes ? state.bytes.handoutClosedByUser : initialBytesState.handoutClosedByUser;
export const selectHelpPopupClosedByUser = (state: RootState) => state.bytes ? state.bytes.helpPopupClosedByUser : initialBytesState.helpPopupClosedByUser;

export default bytesSlice.reducer;
