

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/reducers/store';

export interface TranslationState {
    language: string | null
}

export interface TranslationStateUpdate {
    language: string | null
}

export const initialTranslationState: TranslationState = {
    language: null
}

export const initialTranslationStateUpdate: TranslationStateUpdate = {
    language: null,
}

export const translationSlice = createSlice({
    name: 'translation',
    initialState: initialTranslationState,
    reducers: {
        resetTranslation: (state) => {
            state.language = null
        },
        updateTranslation: (state, update: PayloadAction<TranslationStateUpdate>) => {
            if (update.payload.language !== null) {
                state.language = update.payload.language
            }
        },
    }
});

export const { resetTranslation, updateTranslation } = translationSlice.actions;

export const selectTranslationLanguage = (state: RootState) => state.translation ? state.translation.language : initialTranslationState.language;

export default translationSlice.reducer;

