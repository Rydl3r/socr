import { configureStore } from '@reduxjs/toolkit'

import isLoggedReducer from './features/user/isLoggedSlice';
import userInfoReducer from './features/user/userInfoSlice';
import themeReducer from './features/theme/themeSlice';

export const store = configureStore({
    reducer: {
        isLogged: isLoggedReducer,
        userInfo: userInfoReducer,
        theme: themeReducer
    },
})