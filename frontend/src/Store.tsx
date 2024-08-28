// store.js

import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Use localStorage
import Root_Reducer from './Redux/Reducer';

// Configuration for redux-persist
const persistConfig = {
    key: 'root',
    storage,
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, Root_Reducer);

// Create the Redux store with the persisted reducer
const Store = createStore(persistedReducer);

// Create a persistor for redux-persist
const persistor = persistStore(Store);

export { Store, persistor };
