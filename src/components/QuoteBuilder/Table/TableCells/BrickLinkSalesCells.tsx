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
                {item.sources?.includes(Source.BRICKLINK)
                    && item.salesData?.newSold?.price_detail && item.salesData.newSold.price_detail.length > 0 && (
                    <Tooltip title={`Based on ${item.salesData?.newSold?.unit_quantity} ${+item.salesData?.newSold?.unit_quantity === 1 ? 'sale' : 'sales'}`}>
                        <Box style={{color: item.salesData?.newSold?.unit_quantity && item.salesData?.newSold?.unit_quantity >= 5 ? '#008000' : '#BD0000'}}>
                            Min: {formatCurrency(item.salesData?.newSold?.min_price)}<br/>
                            <strong>Avg: {formatCurrency(item.salesData?.newSold?.avg_price)}</strong><br/>
                            Max: {formatCurrency(item.salesData?.newSold?.max_price)}
                        </Box>
                    </Tooltip>
                )}
            </StyledTableCell>
            <StyledTableCell>
                {item.sources?.includes(Source.BRICKLINK)
                    && item.salesData?.usedSold?.price_detail && item.salesData?.usedSold.price_detail.length > 0 && (
                    <Tooltip title={`Based on ${item.salesData?.usedSold?.unit_quantity} ${+item.salesData?.usedSold?.unit_quantity === 1 ? 'sale' : 'sales'}`}>
                        <Box style={{color: item.salesData?.usedSold?.unit_quantity && item.salesData?.usedSold?.unit_quantity >= 5 ? '#008000' : '#BD0000'}}>
                            Min: {formatCurrency(item.salesData?.usedSold?.min_price)}<br/>
                            <strong>Avg: {formatCurrency(item.salesData?.usedSold?.avg_price)}</strong><br/>
                            Max: {formatCurrency(item.salesData?.usedSold?.max_price)}
                        </Box>
                    </Tooltip>
                )}
            </StyledTableCell>
        </>
    );
};

export default React.memo(BrickLinkSalesCells);