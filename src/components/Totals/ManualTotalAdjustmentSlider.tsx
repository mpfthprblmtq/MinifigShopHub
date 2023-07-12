import React, {FunctionComponent} from "react";
import {Slider} from "@mui/material";

interface ManualTotalAdjustmentSliderParams {
    value: number;
    handleSliderChange: (event: any) => void;
    handleSliderChangeCommitted: (event: any) => void;
}

const ManualTotalAdjustmentSlider: FunctionComponent<ManualTotalAdjustmentSliderParams> = ({value, handleSliderChange, handleSliderChangeCommitted}) => {
    const marks = [
        { value: -50, label: "-50%" },
        { value: -25, label: "-25%" },
        { value: 0, label: "|" },
        { value: 50, label: "+50%" },
        { value: 25, label: "+25%" }
    ];

    /**
     * Helper function to set the slider value label to a clean value.  If there's a decimal, then fixes the digits
     * after the decimal to 2, else just return the number, so we don't get something like 21.00% every time.
     * @param value the value to format
     */
    const formatSliderLabel = (value: number): string => {
        const label = value.toFixed(2);
        return label.replace(".00", "") + "%";
    };

    return (
        <Slider
            onChange={handleSliderChange}
            onChangeCommitted={handleSliderChangeCommitted}
            valueLabelFormat={formatSliderLabel}
            defaultValue={0}
            marks={marks}
            step={5}
            valueLabelDisplay="auto"
            min={-50}
            max={50}
            value={value} />
    );
};

export default ManualTotalAdjustmentSlider;