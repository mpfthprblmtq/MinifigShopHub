import React, {FunctionComponent} from "react";
import {Slider} from "@mui/material";
import {Item} from "../../../model/item/Item";

interface ManualAdjustmentSliderParams {
    item: Item;
    handleSliderChange: (event: Event, id: number) => void;
}

const ManualValueAdjustmentSlider: FunctionComponent<ManualAdjustmentSliderParams> = ({item, handleSliderChange}) => {

    const marks = [
        { value: 0, label: "|" },
        { value: -100, label: "-100%" },
        { value: 100, label: "+100%"},
        { value: -50, label: "-50%" },
        { value: 50, label: "+50%" }
    ];

    /**
     * Helper function to set the slider value label to a clean value.  If there's a decimal, then fixes the digits
     * after the decimal to 2, else just return the number, so we don't get something like 21.00% every time.
     * @param value the value to format
     */
    const formatSliderLabel = (value: number): string => {
        const label = (value - Math.floor(value) === 0 ? value : value.toFixed(2)) + "%";
        return label === "0.00%" ? "0%" : label;
    };

    return (
        <Slider
            onChange={(event) => handleSliderChange(event, item.id)}
            valueLabelFormat={formatSliderLabel}
            defaultValue={0}
            marks={marks}
            valueLabelDisplay="auto"
            min={-100}
            max={100}
            value={item.valueAdjustment} />
    );
};

export default ManualValueAdjustmentSlider;