import {createSlice} from "@reduxjs/toolkit";
import {Configuration} from "../../model/dynamo/Configuration";

export const configurationSlice = createSlice({
    name: 'configuration',
    initialState: {
        configuration: {} as Configuration
    },
    reducers: {
        updateStoreConfiguration: (state, action) => {
            state.configuration = action.payload as Configuration;
        }
    }
});

export const { updateStoreConfiguration } = configurationSlice.actions;
export default configurationSlice.reducer;