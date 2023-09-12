import { Label } from "../../model/labelMaker/Label";
import { Item } from "../../model/item/Item";
import { createSlice } from "@reduxjs/toolkit";
import { Status } from "../../model/labelMaker/Status";

export interface LabelState {
  label: Label;
  item?: Item;
}

const initialState: LabelState = {
  label: {
    partsIndicator: true,
    manualIndicator: true,
    minifigsIndicator: true,
    status: Status.PRE_OWNED,
    validatedBy: ''
  }
};

export const labelSlice = createSlice({
  name: 'label',
  initialState,
  reducers: {
    updateLabelInStore: (state, action) => {
      state.label = action.payload as Label;
    },
    updateItemInStore: (state, action) => {
      state.item = action.payload as Item;
    }
  }
});

export const { updateLabelInStore, updateItemInStore } = labelSlice.actions;
export default labelSlice.reducer;