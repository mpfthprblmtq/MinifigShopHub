import { Label } from "../../model/labelMaker/Label";
import { Item } from "../../model/item/Item";
import { createSlice } from "@reduxjs/toolkit";

export interface LabelState {
  label?: Label;
  item?: Item;
}

export const labelSlice = createSlice({
  name: 'label',
  initialState: {} as LabelState,
  reducers: {
    updateLabelInStore: (state, action) => {
      state.label = action.payload as Label;
    },
    updateItemInStore: (state, action) => {
      state.item = action.payload as Item;
    },
    clearLabelState: (state) => {
      state.label = undefined;
      state.item = undefined;
    }
  }
});

export const { updateLabelInStore, updateItemInStore, clearLabelState } = labelSlice.actions;
export default labelSlice.reducer;