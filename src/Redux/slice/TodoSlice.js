import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const TodoSlice = createSlice({
    name: 'TodoList',
    initialState,
    reducers: {
        setTodoTaskList : (state, action) => {
            return action.payload;
        }
    }
})

export const {setTodoTaskList} = TodoSlice.actions;
export default TodoSlice.reducer;
