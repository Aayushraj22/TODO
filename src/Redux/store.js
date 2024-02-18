import {configureStore, combineReducers} from '@reduxjs/toolkit'
import themeReducer from './themeSlice'
import authUserReducer from './authslice'
import TodoReducer from './slice/TodoSlice'
import storage from 'redux-persist/lib/storage'
import { persistStore , persistReducer } from 'redux-persist';
import LoadReducer from './slice/loaderSlice';
import ViewReducer from './slice/viewSlice';

const persistConfig = {
    key: 'root',
    storage,
  };

  const rootReducer = combineReducers({
    themeChanger: themeReducer,
    authenticUser: authUserReducer,
    listView: ViewReducer,
 })

 const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
    reducer:{ 
      persistedReducer,
      todos: TodoReducer,
      loadingStatus: LoadReducer,
    }
})

export default store;
export const persistor = persistStore(store);