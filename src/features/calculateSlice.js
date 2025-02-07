import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: null, // Saugome informaciją apie upgrade galimybes ir kt.
};

export const calculateSlice = createSlice({
    name: "calculate",
    initialState,
    reducers:{
        setCalculated: (state, action) => {
            state.value = action.payload;
        },
        resetCalculated: (state) => {
            state.value = null;
        },
    },
});

export const { setCalculated, resetCalculated } = calculateSlice.actions;

export const selectCalculated = (state) => state.calculate.value;

export default calculateSlice.reducer;
