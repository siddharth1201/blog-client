import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8080/articles'; // Base URL for articles

// Fetch comments for a specific article by its slug
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (articleSlug, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${articleSlug}/comments`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Create a new comment for a specific article
export const createComment = createAsyncThunk(
  'comments/createComment',
  async ({ articleSlug, body, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/${articleSlug}/comments`,
        { body }, // Assuming 'body' contains the comment text
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const commentSlice = createSlice({
  name: 'comments',
  initialState: {
    comments: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.push(action.payload);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default commentSlice.reducer;
