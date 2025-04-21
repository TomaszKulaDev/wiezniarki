import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

// Importy API
import { profileApi } from "@/frontend/store/apis/profileApi";
import { authApi } from "@/frontend/store/apis/authApi";
import { statsApi } from "@/frontend/store/apis/statsApi";
import { settingsApi } from "@/frontend/store/apis/settingsApi";
import { messageApi } from "@/frontend/store/apis/messageApi";
import { matchApi } from "@/frontend/store/apis/matchApi";

// Importy slices
import profileReducer from "@/frontend/store/slices/profileSlice";
import authReducer from "@/frontend/store/slices/authSlice";
import uiReducer from "@/frontend/store/slices/uiSlice";
import notificationReducer from "@/frontend/store/slices/notificationSlice";

export const store = configureStore({
  reducer: {
    // API reducers
    [profileApi.reducerPath]: profileApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [statsApi.reducerPath]: statsApi.reducer,
    [settingsApi.reducerPath]: settingsApi.reducer,
    [messageApi.reducerPath]: messageApi.reducer,
    [matchApi.reducerPath]: matchApi.reducer,

    // Feature reducers
    profile: profileReducer,
    auth: authReducer,
    ui: uiReducer,
    notification: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      profileApi.middleware,
      authApi.middleware,
      statsApi.middleware,
      settingsApi.middleware,
      messageApi.middleware,
      matchApi.middleware
    ),
  devTools: process.env.NODE_ENV !== "production",
});

// Setup do refetchingu po ponownym podłączeniu
setupListeners(store.dispatch);

// Exporty typów dla typowanie w komponentach
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
