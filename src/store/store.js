// store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducers/root_reducers'; // Sesuaikan path ini


const store = configureStore({
    reducer: rootReducer
});


export {store};
