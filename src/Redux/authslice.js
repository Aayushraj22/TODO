import {createSlice} from '@reduxjs/toolkit'

const initialState = false;

const authUserSlice = createSlice({
    name: 'authenticatedUser',
    initialState,
    reducers: {
        isAuthenticUser: (state,action) => {
            const authStatus = action.payload;
            return authStatus;
        }
    }
})

export const {isAuthenticUser} = authUserSlice.actions
export default authUserSlice.reducer