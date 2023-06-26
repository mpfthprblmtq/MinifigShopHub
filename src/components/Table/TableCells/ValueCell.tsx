import React, {FunctionComponent} from "react";
import {Item} from "../../../model/item/Item";
import CurrencyTextInput from "../../_shared/CurrencyTextInput/CurrencyTextInput";
import {StyledTableCell} from "../TableComponent/TableComponent.styles";
import {Availability} from "../../../model/salesStatus/Availability";
import {formatCurrency} from "../../../utils/CurrencyUtils";

interface ValueCellParams {
    item: Item;
    handleValueBlur: (event: any, id: number) => void;
    handleValueChange: (event: any, id: number) => void;
    storeMode: boolean;
}

const ValueCell: FunctionComponent<ValueCellParams> = ({item, handleValueBlur, handleValueChange, storeMode}) => {
    return (
        <StyledTableCell>
            <div style={{width: "120px", minWidth: "120px", maxWidth: "120px"}}>
                <CurrencyTextInput
                    label={storeMode && item.salesStatus?.availability === Availability.RETAIL ? 'MSRP: ' + formatCurrency(item.salesStatus.retailPrice) : ''}
                    value={item.valueDisplay}
                    onChange={(event) => handleValueChange(event, item.id)}
                    onBlur={(event) => handleValueBlur(event, item.id)}
                />
            </div>
        </StyledTableCell>
    );
};

export default ValueCell;