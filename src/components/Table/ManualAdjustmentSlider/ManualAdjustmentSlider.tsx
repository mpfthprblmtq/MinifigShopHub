import React, {FunctionComponent} from "react";
import {Slider} from "@mui/material";
import {Item} from "../../../model/item/Item";

interface ManualAdjustmentSliderParams {
    item: Item;
    handleSliderChange: (event: Event, id: number) => void;
}

const ManualAdjustmentSlider: FunctionComponent<ManualAdjustmentSliderParams> = ({item, handleSliderChange}) => {

    const marks = [
        { value: 0, label: "|" },
        { value: -100, label: "-100%" },
        { value: 100, label: "+100%"},
        { value: -50, label: "-50%" },
        { value: 50, label: "+50%" }
    ];

    const formatSliderLabel = (value: number): string => {
        return value + "%";
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

export default ManualAdjustmentSlider;