import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";

interface ProfileState {
  // Stan filtrów dla UI
  filters: {
    minAge: number | null;
    maxAge: number | null;
    facility: string | null;
    interests: string[];
  };
  // Opcje wyświetlania
  view: {
    currentPage: number;
    itemsPerPage: number;
    sortBy: "newest" | "oldest" | "ageAsc" | "ageDesc";
    layout: "grid" | "list";
  };
  // Stan interakcji użytkownika
  interaction: {
    selectedProfileId: string | null;
    profileDetailsOpen: boolean;
  };
}

const initialState: ProfileState = {
  filters: {
    minAge: null,
    maxAge: null,
    facility: null,
    interests: [],
  },
  view: {
    currentPage: 1,
    itemsPerPage: 12,
    sortBy: "newest",
    layout: "grid",
  },
  interaction: {
    selectedProfileId: null,
    profileDetailsOpen: false,
  },
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    // Akcje dla filtrów
    setAgeRange: (
      state,
      action: PayloadAction<{ min: number | null; max: number | null }>
    ) => {
      state.filters.minAge = action.payload.min;
      state.filters.maxAge = action.payload.max;
      state.view.currentPage = 1; // Reset strony przy zmianie filtrów
    },
    setFacility: (state, action: PayloadAction<string | null>) => {
      state.filters.facility = action.payload;
      state.view.currentPage = 1;
    },
    setInterests: (state, action: PayloadAction<string[]>) => {
      state.filters.interests = action.payload;
      state.view.currentPage = 1;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.view.currentPage = 1;
    },

    // Akcje dla widoku
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.view.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.view.itemsPerPage = action.payload;
      state.view.currentPage = 1;
    },
    setSortBy: (
      state,
      action: PayloadAction<ProfileState["view"]["sortBy"]>
    ) => {
      state.view.sortBy = action.payload;
    },
    setLayout: (
      state,
      action: PayloadAction<ProfileState["view"]["layout"]>
    ) => {
      state.view.layout = action.payload;
    },

    // Akcje dla interakcji
    selectProfile: (state, action: PayloadAction<string | null>) => {
      state.interaction.selectedProfileId = action.payload;
    },
    openProfileDetails: (state, action: PayloadAction<boolean>) => {
      state.interaction.profileDetailsOpen = action.payload;
    },
  },
});

// Export akcji
export const {
  setAgeRange,
  setFacility,
  setInterests,
  resetFilters,
  setCurrentPage,
  setItemsPerPage,
  setSortBy,
  setLayout,
  selectProfile,
  openProfileDetails,
} = profileSlice.actions;

// Selektory
export const selectProfileFilters = (state: RootState) => state.profile.filters;
export const selectProfileView = (state: RootState) => state.profile.view;
export const selectProfileInteraction = (state: RootState) =>
  state.profile.interaction;

export default profileSlice.reducer;
