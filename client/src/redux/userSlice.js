import { createSlice } from '@reduxjs/toolkit';

// Khởi tạo trạng thái ban đầu cho customer
const initialState = {
    user: null, 
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Cập nhật thông tin người dùng
        setUser: (state, action) => {
            state.user = action.payload;
        },

        // Xoá thông tin người dùng
        clearUser: (state) => {
            state.user = null;
        },

        // Cập nhật thông tin người dùng hiện tại
        updateUser: (state, action) => {
            if (state.user) {
                state.user = {
                    ...state.user,
                    ...action.payload,
                };
            }
        },
    },
});

export const { setUser, clearUser, updateUser } = userSlice.actions;
export default userSlice.reducer;