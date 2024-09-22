import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://blog-server-latest.onrender.com/articles'; // Replace with your API URL

// Thunks for asynchronous actions
export const fetchArticles = createAsyncThunk('articles/fetchArticles', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const createArticle = createAsyncThunk('articles/createArticle', async (articleData, { rejectWithValue, getState }) => {
  try {
    const { token } = getState().auth; // Access token from auth slice
    const response = await axios.post(API_URL, articleData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const updateArticle = createAsyncThunk('articles/updateArticle', async (articleData, { rejectWithValue, getState }) => {
  try {
    const { token } = getState().auth; // Access token from auth slice
    const response = await axios.put(`${API_URL}/${articleData.id}`, articleData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const deleteArticle = createAsyncThunk('articles/deleteArticle', async (articleId, { rejectWithValue, getState }) => {
  try {
    const { token } = getState().auth; // Access token from auth slice
    await axios.delete(`${API_URL}/${articleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return articleId;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

const articleSlice = createSlice({
  name: 'articles',
  initialState: {
    articles: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch articles
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create article
      .addCase(createArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.articles.push(action.payload); // Add new article to the list
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update article
      .addCase(updateArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.articles.findIndex((article) => article.id === action.payload.id);
        if (index !== -1) {
          state.articles[index] = action.payload;
        }
      })
      .addCase(updateArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete article
      .addCase(deleteArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = state.articles.filter((article) => article.id !== action.payload);
      })
      .addCase(deleteArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default articleSlice.reducer;
