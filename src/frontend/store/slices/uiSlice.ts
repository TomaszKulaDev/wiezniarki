import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";

type Toast = {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number;
};

interface UIState {
  toasts: Toast[];
  modals: {
    activeModal: string | null;
    modalData: Record<string, unknown>;
  };
  navigation: {
    isSidebarOpen: boolean;
    activePage: string;
  };
}

const initialState: UIState = {
  toasts: [],
  modals: {
    activeModal: null,
    modalData: {},
  },
  navigation: {
    isSidebarOpen: false,
    activePage: "home",
  },
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // Toast actions
    addToast: (state, action: PayloadAction<Omit<Toast, "id">>) => {
      const id = Date.now().toString();
      state.toasts.push({
        ...action.payload,
        id,
      });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(
        (toast) => toast.id !== action.payload
      );
    },

    // Modal actions
    openModal: (
      state,
      action: PayloadAction<{ modalId: string; data?: Record<string, unknown> }>
    ) => {
      state.modals.activeModal = action.payload.modalId;
      state.modals.modalData = action.payload.data || {};
    },
    closeModal: (state) => {
      state.modals.activeModal = null;
      state.modals.modalData = {};
    },

    // Navigation actions
    toggleSidebar: (state) => {
      state.navigation.isSidebarOpen = !state.navigation.isSidebarOpen;
    },
    setActivePage: (state, action: PayloadAction<string>) => {
      state.navigation.activePage = action.payload;
    },
  },
});

export const {
  addToast,
  removeToast,
  openModal,
  closeModal,
  toggleSidebar,
  setActivePage,
} = uiSlice.actions;

export const selectToasts = (state: RootState) => state.ui.toasts;
export const selectModals = (state: RootState) => state.ui.modals;
export const selectNavigation = (state: RootState) => state.ui.navigation;

export default uiSlice.reducer;
