import React, {FunctionComponent} from "react";
import {Slider} from "@mui/material";

interface ManualTotalAdjustmentSliderParams {
    value: number;
    handleSliderChange: (event: any) => void;
    disabled: boolean;
}

const ManualTotalAdjustmentSlider: FunctionComponent<ManualTotalAdjustmentSliderParams> = ({value, handleSliderChange, disabled}) => {
    const marks = [
        { value: 0, label: "0%" },
        { value: 25, label: "25%" },
        { value: 50, label: "50%" },
        { value: 75, label: "75%" },
        { value: 100, label: "100%" }
    ];

    /**
     * Helper function to set the slider value label to a clean value.
     * @param value the value to format
     */
    const formatSliderLabel = (value: number): string => {
        return value + "%";
    };

    return (
      <Slider
        onChange={handleSliderChange}
        valueLabelFormat={formatSliderLabel}
        defaultValue={50}
        marks={marks}
        step={5}
        valueLabelDisplay="auto"
        min={0}
        max={100}
        value={value}
        disabled={disabled}
        sx={{marginLeft: '-10px'}}
      />
    );
};

export default React.memo(ManualTotalAdjustmentSlider);