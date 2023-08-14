import React, {FunctionComponent} from "react";
import {SalesHistory} from "../../../../model/salesHistory/SalesHistory";
import {Box, Typography} from "@mui/material";
import {formatCurrency} from "../../../../utils/CurrencyUtils";

interface SalesSummaryParams {
    salesHistory?: SalesHistory;
    isSalesData: boolean;
}

const SalesSummary: FunctionComponent<SalesSummaryParams> = ({salesHistory, isSalesData}) => {
    return (
        <Box sx={{ display: 'flex' }}>
            <Box sx={{ m: 1, position: 'relative' }}>
                <table>
                    <tbody>
                        <tr>
                            <td><Typography><strong>Minimum Price: </strong></Typography></td>
                            <td><Typography>{formatCurrency(salesHistory?.min_price)}</Typography></td>
                        </tr>
                        <tr>
                            <td><Typography><strong>Average Price: </strong></Typography></td>
                            <td><Typography>{formatCurrency(salesHistory?.avg_price)}</Typography></td>
                        </tr>
                        <tr>
                            <td><Typography><strong>Maximum Price: </strong></Typography></td>
                            <td><Typography>{formatCurrency(salesHistory?.max_price)}</Typography></td>
                        </tr>
                    </tbody>
                </table>
            </Box>
            <Box sx={{ m: 1, position: 'relative'}}>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <Typography>
                                    <strong>{isSalesData ? 'Sales:' : 'Listings:'}</strong>
                                </Typography>
                            </td>
                            <td><Typography>{salesHistory?.unit_quantity}</Typography></td>
                        </tr>
                        <tr>
                            <td>
                                <Typography>
                                    <strong>{isSalesData ? 'Total Sold:' : 'Total Listed:'}</strong>
                                </Typography>
                            </td>
                            <td><Typography>{salesHistory?.total_quantity}</Typography></td>
                        </tr>
                    </tbody>
                </table>
            </Box>
        </Box>
    );
};

export default SalesSummary;