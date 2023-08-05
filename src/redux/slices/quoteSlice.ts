import {createSlice} from "@reduxjs/toolkit";
import {Quote} from "../../model/quote/Quote";

export const quoteSlice = createSlice({
    name: 'quote',
    initialState: {
        quote: {}
    },
    reducers: {
        updateQuoteInStore: (state, action) => {
            state.quote = action.payload as Quote;
        }
    }
});

export const { updateQuoteInStore } = quoteSlice.actions;
export default quoteSlice.reducer;