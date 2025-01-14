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
                {item.sources?.includes(Source.BRICKLINK) && item.salesHistory?.newSales && (
                    <Tooltip title={`Based on ${item.salesHistory?.newSales?.numberOfItemsSold} ${+item.salesHistory?.newSales?.numberOfItemsSold === 1 ? 'sale' : 'sales'}`}>
                        <Box style={{color: item.salesHistory?.newSales?.numberOfItemsSold && item.salesHistory?.newSales?.numberOfItemsSold >= 5 ? '#008000' : '#BD0000'}}>
                            Min: {formatCurrency(item.salesHistory?.newSales?.minimumPrice)}<br/>
                            <strong>Avg: {formatCurrency(item.salesHistory?.newSales?.averagePrice)}</strong><br/>
                            Max: {formatCurrency(item.salesHistory?.newSales?.maximumPrice)}
                        </Box>
                    </Tooltip>
                )}
            </StyledTableCell>
            <StyledTableCell>
                {item.sources?.includes(Source.BRICKLINK) && item.salesHistory?.usedSales && (
                    <Tooltip title={`Based on ${item.salesHistory?.usedSales?.numberOfItemsSold} ${+item.salesHistory?.usedSales?.numberOfItemsSold === 1 ? 'sale' : 'sales'}`}>
                        <Box style={{color: item.salesHistory?.usedSales?.numberOfItemsSold && item.salesHistory?.usedSales?.numberOfItemsSold >= 5 ? '#008000' : '#BD0000'}}>
                            Min: {formatCurrency(item.salesHistory?.usedSales?.minimumPrice)}<br/>
                            <strong>Avg: {formatCurrency(item.salesHistory?.usedSales?.averagePrice)}</strong><br/>
                            Max: {formatCurrency(item.salesHistory?.usedSales?.maximumPrice)}
                        </Box>
                    </Tooltip>
                )}
            </StyledTableCell>
        </>
    );
};

export default React.memo(BrickLinkSalesCells);