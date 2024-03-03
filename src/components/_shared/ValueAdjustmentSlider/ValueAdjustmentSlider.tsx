import React, { FunctionComponent } from "react";
import { Slider, SliderProps } from "@mui/material";

interface ValueAdjustmentSliderParams extends SliderProps {
  value: number;
  handleSliderChange: (event: any) => void;
  handleSliderChangeCommitted?: (event: any) => void;
  disabled?: boolean;
}

const ValueAdjustmentSlider: FunctionComponent<ValueAdjustmentSliderParams & SliderProps> = ({value, handleSliderChange, handleSliderChangeCommitted, disabled, ...sliderProps}) => {

  const marks = [
    { value: 0, label: "0%" },
    { value: 25, label: "25%" },
    { value: 50, label: "50%" },
    { value: 75, label: "75%" },
    { value: 100, label: "100%"}
  ];

  return (
    <Slider
      value={value}
      onChange={handleSliderChange}
      onChangeCommitted={handleSliderChangeCommitted}
      disabled={!!disabled}
      valueLabelFormat={(value: any) => { return value + "%"; }}
      defaultValue={50}
      marks={marks}
      step={5}
      valueLabelDisplay="auto"
      min={0}
      max={100}
      {...sliderProps}
    />
  );
};

export default ValueAdjustmentSlider;