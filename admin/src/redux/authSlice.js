import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  permissions: [],
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      // Token is now stored in HttpOnly cookie by backend
      // Redux only manages user data and permissions
      state.loading = false;
      state.user = action.payload.user;
      state.permissions = action.payload.permissions || [];
      state.isAuthenticated = true;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.permissions = [];
      state.isAuthenticated = false;
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setPermissions: (state, action) => {
      state.permissions = action.payload || [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setUser,
  setPermissions,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
