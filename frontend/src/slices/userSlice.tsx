import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../service/userService";
import type { RootState } from "../store";

type UserState = {
  user: any;
  error: boolean | string | null | any; // Permite vários tipos
  success: boolean;
  loading: boolean;
  message: any;
};

const initialState: UserState = {
  user: {},
  error: false,
  success: false,
  loading: false,
  message: null,
};

// Get user details
export const profile = createAsyncThunk(
  "user/profile",
  async (user, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).auth.user.token;

    const data = await userService.profile(user, token);

    return data;
  },
);

// Update user details
export const updateProfile = createAsyncThunk(
  "user/update",
  async (user: any, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).auth.user.token;

    const data = await userService.updateProfile(user, token);

    // Check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

// Get user details
export const getUserDetails = createAsyncThunk(
  "users/get",
  async (id: string, thunkAPI) => {
    const data = await userService.getUserDetails(id);

    return data;
  },
);

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(profile.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(profile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.user = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.user = action.payload;
        state.message = "Usuário atualizado com sucesso!";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = {};
      })
      .addCase(getUserDetails.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.user = action.payload;
      });
  },
});

export const { resetMessage } = userSlice.actions;
export default userSlice.reducer;
