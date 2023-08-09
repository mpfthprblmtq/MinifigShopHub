import React, {FunctionComponent} from "react";
import {Item} from "../../../../model/item/Item";
import {StyledTableCell} from "../TableComponent/TableComponent.styles";
import {Source} from "../../../../model/_shared/Source";
import {Box, Tooltip} from "@mui/material";
import {formatCurrency} from "../../../../utils/CurrencyUtils";

interface BrickLinkSalesCellsParams {
    item: Item;
}

const BrickLinkSalesCells: FunctionComponent<BrickLinkSalesCellsParams> = ({item}) => {
    return (
        <>
            <StyledTableCell>
                {item.source === Source.BRICKLINK
                    && item.newSold?.price_detail && item.newSold.price_detail.length > 0 && (
                    <Tooltip title={`Based on ${item.newSold?.unit_quantity} ${+item.newSold?.unit_quantity === 1 ? 'sale' : 'sales'}`}>
                        <Box style={{color: item.newSold?.unit_quantity && item.newSold?.unit_quantity >= 5 ? '#008000' : '#BD0000'}}>
                            Min: {formatCurrency(item.newSold?.min_price)}<br/>
                            <strong>Avg: {formatCurrency(item.newSold?.avg_price)}</strong><br/>
                            Max: {formatCurrency(item.newSold?.max_price)}
                        </Box>
                    </Tooltip>
                )}
            </StyledTableCell>
            <StyledTableCell>
                {item.source === Source.BRICKLINK
                    && item.usedSold?.price_detail && item.usedSold.price_detail.length > 0 && (
                    <Tooltip title={`Based on ${item.usedSold?.unit_quantity} ${+item.usedSold?.unit_quantity === 1 ? 'sale' : 'sales'}`}>
                        <Box style={{color: item.usedSold?.unit_quantity && item.usedSold?.unit_quantity >= 5 ? '#008000' : '#BD0000'}}>
                            Min: {formatCurrency(item.usedSold?.min_price)}<br/>
                            <strong>Avg: {formatCurrency(item.usedSold?.avg_price)}</strong><br/>
                            Max: {formatCurrency(item.usedSold?.max_price)}
                        </Box>
                    </Tooltip>
                )}
            </StyledTableCell>
        </>
    );
};

export default BrickLinkSalesCells;