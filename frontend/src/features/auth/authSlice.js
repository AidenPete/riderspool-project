import { createSlice } from '@reduxjs/toolkit';

// Get user from localStorage if exists
const getUserFromStorage = () => {
  try {
    const storedUser = localStorage.getItem('riderspool_user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

const initialState = {
  user: getUserFromStorage(),
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      localStorage.setItem('riderspool_user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.loading = false;
      localStorage.removeItem('riderspool_user');
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('riderspool_user', JSON.stringify(state.user));
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { login, logout, updateUser, setLoading } = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectLoading = (state) => state.auth.loading;
export const selectIsAuthenticated = (state) => !!state.auth.user;
export const selectIsEmployer = (state) => state.auth.user?.userType === 'employer';
export const selectIsProvider = (state) => state.auth.user?.userType === 'provider';

export default authSlice.reducer;
