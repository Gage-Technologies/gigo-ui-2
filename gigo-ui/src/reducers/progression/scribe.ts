import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ScribeState {
  value: number;
  level: string;
  levelMax: string;
}

const initialState: ScribeState = {
  value: 0,
  level: '',
  levelMax: '',
};

const scribeSlice = createSlice({
  name: 'scribe',
  initialState,
  reducers: {
    // update the scribe value
    updateScribeValue: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
    // update the scribe level
    updateScribeLevel: (state, action: PayloadAction<string>) => {
      state.level = action.payload;
    },
    // update the scribe level max
    updateScribeLevelMax: (state, action: PayloadAction<string>) => {
      state.levelMax = action.payload;
    },
    // reset the scribe state
    resetScribe: (state) => {
      state.value = 0;
      state.level = '';
      state.levelMax = '';
    },
  },
});

// export the actions
export const { 
  updateScribeValue, 
  updateScribeLevel, 
  updateScribeLevelMax, 
  resetScribe 
} = scribeSlice.actions;

// export the reducer
export default scribeSlice.reducer;
