import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import cartReducer from './cartSlice';
import userReducer from './userSlice';

// Cấu hình redux-persist để lưu trữ dữ liệu giỏ hàng và thông tin người dùng vào localStorage.
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['cart', 'user']
};

const rootReducer = combineReducers({
    cart: cartReducer,
    user: userReducer
});

//tao reducer de luu tru du lieu
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: { // Tránh lỗi khi sử dụng redux-persist với các action không serializable
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        })
})

export const persistor = persistStore(store)

// Cấu hình store với redux-persist để lưu trữ dữ liệu giỏ hàng và thông tin người dùng vào localStorage.