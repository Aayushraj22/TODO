import {configureStore, combineReducers} from '@reduxjs/toolkit'
import themeReducer from './themeSlice'
import authUserReducer from './authslice'
import TodoReducer from './slice/TodoSlice'
import storage from 'redux-persist/lib/storage'
import { persistStore , persistReducer } from 'redux-persist';
const persistConfig = {
    key: 'root',
    storage,
  };

  const rootReducer = combineReducers({
    themeChanger: themeReducer,
    authenticUser: authUserReducer,
 })

 const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
    reducer:{ 
      persistedReducer,
      todos: TodoReducer,
    }
})

export default store;
export const persistor = persistStore(store);