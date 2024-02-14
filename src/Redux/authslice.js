import {createSlice} from '@reduxjs/toolkit'

const initialState = false;

const authUserSlice = createSlice({
    name: 'authenticatedUser',
    initialState,
    reducers: {
        isAuthenticUser: (state,action) => {
            const userData = action.payload;
            return userData;
        }
    }
})

export const {isAuthenticUser} = authUserSlice.actions
export default authUserSlice.reducer