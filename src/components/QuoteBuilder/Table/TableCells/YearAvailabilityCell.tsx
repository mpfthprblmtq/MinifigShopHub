import React, {FunctionComponent} from "react";
import {Item} from "../../../../model/item/Item";
import {Availability} from "../../../../model/retailStatus/Availability";
import {StyledTableCell} from "../TableComponent/TableComponent.styles";

interface YearAvailabilityCellParams {
    item: Item;
    storeMode: boolean;
}

const YearAvailabilityCell: FunctionComponent<YearAvailabilityCellParams> = ({item, storeMode}) => {
    return (
        <StyledTableCell color={storeMode && item.retailStatus?.availability === Availability.RETAIL ? '#008000' : 'black'}>
            {item.year_released}<br/>{storeMode && (item.retailStatus?.availability ?? '')}
        </StyledTableCell>
    );
};

export default YearAvailabilityCell;