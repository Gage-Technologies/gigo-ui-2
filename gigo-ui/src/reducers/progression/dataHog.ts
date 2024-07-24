import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DataHogState {
  value: number;
  level: string;
  levelMax: string;
}

const initialState: DataHogState = {
  value: 0,
  level: '',
  levelMax: '',
};

const dataHogSlice = createSlice({
  name: 'dataHog',
  initialState,
  reducers: {
    // update the data hog value
    updateDataHogValue: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
    // update the data hog level
    updateDataHogLevel: (state, action: PayloadAction<string>) => {
      state.level = action.payload;
    },
    // update the data hog level max
    updateDataHogLevelMax: (state, action: PayloadAction<string>) => {
      state.levelMax = action.payload;
    },
    // reset the data hog state
    resetDataHog: (state) => {
      state.value = 0;
      state.level = '';
      state.levelMax = '';
    },
  },
});

// export the actions
export const { 
  updateDataHogValue, 
  updateDataHogLevel, 
  updateDataHogLevelMax, 
  resetDataHog 
} = dataHogSlice.actions;

// export the reducer
export default dataHogSlice.reducer;
