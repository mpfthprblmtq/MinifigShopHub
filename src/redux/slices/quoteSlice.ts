import { createSlice } from "@reduxjs/toolkit";
import { Quote } from "../../model/quote/Quote";
import { Item } from "../../model/item/Item";
import { Total } from "../../model/total/Total";

interface QuoteState {
    quote: Quote
}

const initialState: QuoteState = {
    quote: {
        items: [],
        total: {
            value: 0,
            valueAdjustment: 50,
            baseValue: 0,
            storeCreditValue: 0
        }
    }
}

export const quoteSlice = createSlice({
    name: 'quote',
    initialState,
    reducers: {
        updateQuoteInStore: (state, action) => {
            state.quote = action.payload as Quote;
        },
        updateItemsInStore: (state, action) => {
            state.quote.items = [...action.payload] as Item[];
        },
        updateTotalInStore: (state, action) => {
            state.quote.total = action.payload as Total;
        },
        updateItem: (state, action) => {
            state.quote.items[state.quote.items.findIndex(item =>
                item.id === action.payload.id
            )] = action.payload
        }
    }
});

export const { updateQuoteInStore, updateItemsInStore, updateTotalInStore, updateItem } = quoteSlice.actions;
export default quoteSlice.reducer;