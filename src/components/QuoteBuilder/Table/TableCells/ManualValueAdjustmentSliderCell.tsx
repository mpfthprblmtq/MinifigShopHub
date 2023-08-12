import React, {FunctionComponent} from "react";
import {Slider} from "@mui/material";
import {Item} from "../../../../model/item/Item";
import {StyledTableCell} from "../TableComponent/TableComponent.styles";
import {Source} from "../../../../model/_shared/Source";

interface ManualAdjustmentSliderParams {
    item: Item;
    handleSliderChange: (event: Event, id: number) => void;
    disabled: boolean;
}

const ManualValueAdjustmentSliderCell: FunctionComponent<ManualAdjustmentSliderParams> = ({item, handleSliderChange, disabled}) => {

    const marks = [
        { value: 0, label: "0%" },
        { value: 25, label: "25%" },
        { value: 50, label: "50%" },
        { value: 75, label: "75%" },
        { value: 100, label: "100%"}
    ];

    /**
     * Helper function to set the slider value label to a clean value.  If there's a decimal, then fixes the digits
     * after the decimal to 2, else just return the number, so we don't get something like 21.00% every time.
     * @param value the value to format
     */
    const formatSliderLabel = (value: number): string => {
        return value + "%";
    };

    return (
        <StyledTableCell>
            <Slider
                onChange={(event) => handleSliderChange(event, item.id)}
                valueLabelFormat={formatSliderLabel}
                disabled={item.baseValue === 0 || item.source === Source.CUSTOM || disabled}
                defaultValue={50}
                marks={marks}
                step={5}
                valueLabelDisplay="auto"
                min={0}
                max={100}
                value={item.baseValue === 0 ? 0 : item.valueAdjustment}
                sx={{marginLeft: '-10px'}}
            />
        </StyledTableCell>
    );
};

export default ManualValueAdjustmentSliderCell;