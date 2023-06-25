import React, {FunctionComponent} from "react";
import {Item} from "../../../model/item/Item";
import CurrencyTextInput from "../../_shared/CurrencyTextInput/CurrencyTextInput";
import {StyledTableCell} from "../TableComponent/TableComponent.styles";

interface ValueCellParams {
    item: Item;
    handleValueBlur: (event: any, id: number) => void;
    handleValueChange: (event: any, id: number) => void;
}

const ValueCell: FunctionComponent<ValueCellParams> = ({item, handleValueBlur, handleValueChange}) => {
    return (
        <StyledTableCell>
            <CurrencyTextInput
                value={item.valueDisplay}
                onChange={(event) => handleValueChange(event, item.id)}
                onBlur={(event) => handleValueBlur(event, item.id)}
            />
        </StyledTableCell>
    );
};

export default ValueCell;