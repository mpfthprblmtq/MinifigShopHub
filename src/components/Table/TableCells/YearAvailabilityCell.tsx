import React, {FunctionComponent} from "react";
import {Item} from "../../../model/item/Item";
import {Availability} from "../../../model/salesStatus/Availability";
import {StyledTableCell} from "../TableComponent/TableComponent.styles";

interface YearAvailabilityCellParams {
    item: Item;
}

const YearAvailabilityCell: FunctionComponent<YearAvailabilityCellParams> = ({item}) => {
    return (
        <StyledTableCell color={item.salesStatus?.availability === Availability.RETAIL ? '#008B00' : 'black'}>
            {item.year_released}<br/>{item.salesStatus?.availability ?? ''}
        </StyledTableCell>
    );
};

export default YearAvailabilityCell;