import { CurrentView } from "../../components/PartCollector/CurrentView";
import { createSlice } from "@reduxjs/toolkit";

export interface PartState {
  currentView: CurrentView;
}

export const partSlice = createSlice({
  name: 'part',
  initialState: {
    currentView: CurrentView.ADD_PARTS
  } as PartState,
  reducers: {
    updateCurrentView: (state, action) => {
      state.currentView = action.payload as CurrentView;
    }
  }
});

export const { updateCurrentView } = partSlice.actions;
export default partSlice.reducer;