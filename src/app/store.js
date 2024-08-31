import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '../features/auth/authSlice';
import articleReducer from '../features/articles/articleSlice';
import commentReducer from '../features/comments/commentSlice'; // Import the comment reducer

// Persist configuration for the 'auth' slice
const authPersistConfig = {
  key: 'auth',
  storage,
};

// Combine all reducers into a single root reducer
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer), // Apply persist to only the 'auth' slice
  articles: articleReducer,
  comments: commentReducer,
});

// Create and configure the Redux store
export const store = configureStore({
  reducer: rootReducer,
});

// Create a persistor to manage the persisted state
export const persistor = persistStore(store);
