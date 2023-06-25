import React, {FunctionComponent} from "react";
import {Item} from "../../../model/item/Item";
import {StyledTableCell} from "../TableComponent/TableComponent.styles";
import {Source} from "../../../model/shared/Source";
import {Tooltip} from "@mui/material";
import {formatCurrency} from "../../../utils/CurrencyUtils";

interface BrickLinkSalesCellsParams {
    item: Item;
}

const BrickLinkSalesCells: FunctionComponent<BrickLinkSalesCellsParams> = ({item}) => {
    return (
        <>
            <StyledTableCell>
                {item.source === Source.BRICKLINK && (
                    <Tooltip title={`Based on ${item.newSold?.unit_quantity} sales`}>
                        <div>
                            Min: {formatCurrency(item.newSold?.min_price)}<br/>
                            <strong>Avg: {formatCurrency(item.newSold?.avg_price)}</strong><br/>
                            Max: {formatCurrency(item.newSold?.max_price)}
                        </div>
                    </Tooltip>
                )}
            </StyledTableCell>
            <StyledTableCell>
                {item.source === Source.BRICKLINK && (
                    <Tooltip title={`Based on ${item.usedSold?.unit_quantity} sales`}>
                        <div>
                            Min: {formatCurrency(item.usedSold?.min_price)}<br/>
                            <strong>Avg: {formatCurrency(item.usedSold?.avg_price)}</strong><br/>
                            Max: {formatCurrency(item.usedSold?.max_price)}
                        </div>
                    </Tooltip>
                )}
            </StyledTableCell>
        </>
    );
};

export default BrickLinkSalesCells;