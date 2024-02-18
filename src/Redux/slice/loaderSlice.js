import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

const LoaderSlice = createSlice({
    name: 'loading Status',
    initialState,
    reducers: {
        toggleLoading: (state, action) => {
            return action.payload;
        }
    }

})  

export const {toggleLoading} = LoaderSlice.actions;
export default LoaderSlice.reducer;