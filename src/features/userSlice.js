import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {
        uid: null,
        balance: 0,
        mineRate: 0.01,
        isMining: false,
        username: "",
        firstname: "",
        lastname: "",
        userImage: "",
        referrals: {},
        referredBy: null,
        miningStartedTime: null,
        daily: {
            claimedTime: null,
            claimedDay: null,
        },
        links: {},
    },
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.value = action.payload;
        },
        setBalance: (state, action) => {
            state.value.balance = action.payload.balance; // Atnaujiname balansą
            state.value.mineRate = action.payload.mineRate; // Atnaujiname mineRate, jei reikia
        },
        setMiningStatus: (state, action) => {
            state.value.isMining = action.payload;
        },
        setMiningStartTime: (state, action) => {
            state.value.miningStartedTime = action.payload;
        },
    },
});

export const { setUser, setbalance, setMiningStatus, setMiningStartTime } = userSlice.actions;

export const selectUser = (state) => state.user.value;

export default userSlice.reducer;
