// src/redux/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import authService from '../services/auth.service';

// Define a type for the user, matching your backend's expected user structure
interface User {
  id?: string; // Assuming id might be present
  username: string;
  email?: string; // Assuming email might be present
  // Add other user properties as needed
}

// Define the shape of our authentication state
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Initial state for the authentication slice
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Async thunk for user login
export const loginUser = createAsyncThunk<
  { access_token: string; user: User }, // 1. Fulfilled return type
  { username: string; password: string }, // 2. Argument type
  { rejectValue: string } // 3. Rejected value type (what rejectWithValue returns)
>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      localStorage.setItem('authToken', data.access_token);
      return data; // Expects { access_token: string, user: User }
    } catch (error: any) {
      // Ensure the rejected value is always a string
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// Async thunk for user registration
export const registerUser = createAsyncThunk<
  { access_token: string; user: User }, // 1. Fulfilled return type
  { username: string; email: string; password: string }, // 2. Argument type
  { rejectValue: string } // 3. Rejected value type (what rejectWithValue returns)
>(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authService.register(userData);
      localStorage.setItem('authToken', data.access_token);
      return data; // Expects { access_token: string, user: User }
    } catch (error: any) {
      // Ensure the rejected value is always a string
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Reducer to set auth state from local storage (e.g., on app load)
    setAuthFromLocalStorage: (state) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        // In a real app, you'd decode the token or call an API to get user info
        // For now, we'll set a dummy user or parse basic info from the token if possible
        state.isAuthenticated = true;
        state.token = token;
        state.user = { username: 'Authenticated User' }; // Replace with actual user data if available
      } else {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      }
    },
    // Reducer for user logout
    logout: (state) => {
      localStorage.removeItem('authToken');
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ access_token: string; user: User }>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.access_token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<string | undefined>) => { // Adjusted to string | undefined
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload || 'An unknown login error occurred.'; // Provide a fallback
        state.token = null;
        state.user = null;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<{ access_token: string; user: User }>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.access_token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action: PayloadAction<string | undefined>) => { // Adjusted to string | undefined
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload || 'An unknown registration error occurred.'; // Provide a fallback
        state.token = null;
        state.user = null;
      });
  },
});

// Export actions and reducer
export const { setAuthFromLocalStorage, logout } = authSlice.actions;
export default authSlice.reducer;
