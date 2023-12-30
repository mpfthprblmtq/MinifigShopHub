import { createSlice } from "@reduxjs/toolkit";
import { Part } from "../../components/PartFinder/Part";

export interface PartFinderState {
  parts: Part[];
}

export const partFinderSlice = createSlice({
  name: 'partFinder',
  initialState: {
    parts: []
  } as PartFinderState,
  reducers: {
    addPartsToStore: (state, action) => {
      state.parts = action.payload;
    },
    removeAllPartsFromStore: (state) => {
      state.parts = [];
    },
    updatePartCount: (state, action) => {
      state.parts[state.parts.findIndex(part =>
        part.id === action.payload.id && part.set === action.payload.set && part.colorId === action.payload.colorId
      )] = action.payload
    }
  }
});

export const { updatePartCount, addPartsToStore, removeAllPartsFromStore } = partFinderSlice.actions;
export default partFinderSlice.reducer;