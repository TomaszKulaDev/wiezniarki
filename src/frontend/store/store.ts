import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "./apis/authApi";
import { profileApi } from "./apis/profileApi";
import { settingsApi } from "./apis/settingsApi";
import { statsApi } from "./apis/statsApi";
import { messageApi } from "./apis/messageApi";
import { matchApi } from "./apis/matchApi";

// Importy slices
import profileReducer from "./slices/profileSlice";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import notificationReducer from "./slices/notificationSlice";

export const store = configureStore({
  reducer: {
    // API reducers
    [authApi.reducerPath]: authApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [settingsApi.reducerPath]: settingsApi.reducer,
    [statsApi.reducerPath]: statsApi.reducer,
    [messageApi.reducerPath]: messageApi.reducer,
    [matchApi.reducerPath]: matchApi.reducer,

    // Feature reducers
    profile: profileReducer,
    auth: authReducer,
    ui: uiReducer,
    notification: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(profileApi.middleware)
      .concat(settingsApi.middleware)
      .concat(statsApi.middleware)
      .concat(messageApi.middleware)
      .concat(matchApi.middleware),
});

// Opcjonalne, ale wymagane do refetchQuery i innych
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
