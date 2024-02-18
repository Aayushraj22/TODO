import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    containerListView: '',
    todoCardListView: '',
}

const ViewSlice = createSlice({
    name: 'viewOfList',
    initialState,
    reducers: {
        listView: (state) => {
            return {
                containerListView: 'toggle-content-task-container',
                todoCardListView: 'toggle-taskcard-container',
            }
        },

        compactView: (state) => {
            return {
                containerListView: '',
                todoCardListView: '',
            }
        }
    }
})

export const {listView, compactView} = ViewSlice.actions;
export default ViewSlice.reducer;