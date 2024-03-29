import React, {FunctionComponent} from "react";
import {ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import {Item} from "../../../../model/item/Item";
import {Condition} from "../../../../model/_shared/Condition";
import {StyledTableCell} from "../TableComponent/TableComponent.styles";

interface NewUsedToggleButtonParams {
    item: Item;
    handleConditionChange: (condition: Condition, id: number) => void;
    storeMode: boolean;
}

const NewUsedToggleButtonCell: FunctionComponent<NewUsedToggleButtonParams> = ({item, handleConditionChange, storeMode}) => {

    return (
        <StyledTableCell>
          {storeMode ?
            <ToggleButtonGroup
              exclusive
              size="small"
              onChange={(event, value) => handleConditionChange(value, item.id)}
              value={item.condition}>
              <ToggleButton value="NEW"><Typography>New</Typography></ToggleButton>
              <ToggleButton value="USED"><Typography>Used</Typography></ToggleButton>
            </ToggleButtonGroup>
          : <Typography>{item.condition === Condition.USED ? 'Used' : 'New'}</Typography>}

        </StyledTableCell>
    )
}

export default NewUsedToggleButtonCell;