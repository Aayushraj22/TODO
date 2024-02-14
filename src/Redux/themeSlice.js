import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    backgroundColor: 'black',
    color: 'white',
}

const themeSlice = createSlice({
    name: 'toogleTheme',
    initialState,
    reducers: {
        dark: (state) => {
            state.backgroundColor = 'black';
            state.color = 'white';
        },

        light: (state) => {
            state.backgroundColor = 'white';
            state.color = 'black';
        }
    }
})

export const {dark, light} = themeSlice.actions
export default themeSlice.reducer