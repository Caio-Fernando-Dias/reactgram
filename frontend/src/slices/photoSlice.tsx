import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import photoService from "../service/photoService";
import type { RootState } from "../store";

type PhotoState = {
  photos: any[];
  photo: any;
  error: boolean | string | null | any;
  success: boolean;
  loading: boolean;
  message: any;
};

const initialState: PhotoState = {
  photos: [],
  photo: {},
  error: false,
  success: false,
  loading: false,
  message: null,
};

// Publish user photo
export const publishPhoto = createAsyncThunk(
  "photo/publish",
  async (photo: any, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).auth.user.token;

    const data = await photoService.publishPhoto(photo, token);

    // Check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

// Get user photos
export const getUserPhotos = createAsyncThunk(
  "photo/userphotos",
  async (id: string, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).auth.user.token;

    const data = await photoService.getUserPhotos(id, token);

    return data;
  },
);

// Delete a photo
export const deletePhoto = createAsyncThunk(
  "photo/delete",
  async (id: string, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).auth.user.token;

    const data = await photoService.deletePhoto(id, token);

    // Check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

// Update a photo
export const updatePhoto = createAsyncThunk(
  "photo/update",
  async (photoData: any, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).auth.user.token;

    const data = await photoService.updatePhoto(
      photoData.id,
      { title: photoData.title },
      token,
    );

    // Check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

// Get photo by id
export const getPhoto = createAsyncThunk(
  "photo/getphoto",
  async (id: string, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).auth.user.token;

    const data = await photoService.getPhoto(id, token);

    // Check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

// Like a photo
export const like = createAsyncThunk(
  "photo/like",
  async (id: string, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).auth.user.token;

    const data = await photoService.like(id, token);

    return data;
  },
);

// Add comment to a photo
export const comment = createAsyncThunk(
  "photo/comment",
  async (commentData: any, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).auth.user.token;

    const data = await photoService.comment(
      commentData.id,
      { comment: commentData.comment },
      token,
    );

    // Check for errors
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  },
);

// Get all photos
export const getPhotos = createAsyncThunk(
  "photo/getall",
  async (_, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).auth.user.token;

    const data = await photoService.getPhotos(token);

    return data;
  },
);

// Search photo by title
export const searchPhotos = createAsyncThunk(
  "photo/search",
  async (query: string, thunkAPI) => {
    const token = (thunkAPI.getState() as RootState).auth.user.token;

    const data = await photoService.searchPhotos(query, token);

    return data;
  },
);

export const photoSlice = createSlice({
  name: "photo",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(publishPhoto.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(publishPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photo = action.payload;
        state.photos.unshift(state.photo);
        state.message = "Foto publicada com sucesso!";
      })
      .addCase(publishPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })
      .addCase(getUserPhotos.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getUserPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos = action.payload;
      })
      .addCase(deletePhoto.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(deletePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos = state.photos.filter((photo) => {
          return photo._id !== action.payload.id;
        });
        state.message = action.payload.message;
      })
      .addCase(deletePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })
      .addCase(updatePhoto.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(updatePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos.map((photo) => {
          if (photo._id === action.payload.photo._id) {
            return (photo.title = action.payload.photo.title);
          }
          return photo;
        });
        state.message = action.payload.message;
      })
      .addCase(updatePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })
      .addCase(getPhoto.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photo = action.payload.photo || action.payload;
      })
      .addCase(like.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        if (state.photo.likes) {
          state.photo.likes.push(action.payload.userId);
        }

        state.photos.map((photo) => {
          if (photo._id === action.payload.photoId) {
            return photo.likes.push(action.payload.userId);
          }
          return photo;
        });
        state.message = action.payload.message;
      })
      .addCase(like.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })
      .addCase(comment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photo.comments.push(action.payload.comment);
        state.message = action.payload.message;
      })
      .addCase(comment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPhotos.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos = action.payload;
      })
      .addCase(searchPhotos.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(searchPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos = action.payload;
      });
  },
});

export const { resetMessage } = photoSlice.actions;
export default photoSlice.reducer;
