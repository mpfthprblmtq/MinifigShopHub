import React, {FunctionComponent} from "react";
import {PriceDetail} from "../../../model/salesHistory/PriceDetail";
import {Box, Card, Typography} from "@mui/material";
import {formatCurrency} from "../../../utils/CurrencyUtils";
import {formatDate} from "../../../utils/DateUtils";

interface SalesDataParams {
    priceDetails?: PriceDetail[];
    isSalesData: boolean;
}

const SalesData: FunctionComponent<SalesDataParams> = ({priceDetails, isSalesData}) => {
    return (
        <Box>
            {priceDetails && priceDetails.length > 0 && (
                <>
                    {priceDetails.slice().reverse().map(priceDetail => (
                        <Card style={{marginTop: "10px", backgroundColor: "#F5F5F5"}}>
                            <Box sx={{ display: 'flex' }}>
                                <Box sx={{ m: 1, position: 'relative' }}>
                                    <table>
                                        <tr>
                                            <td><Typography>
                                                <strong>{isSalesData ? 'Unit Price:' : 'Listing Price:'}</strong>
                                            </Typography></td>
                                            <td><Typography>{formatCurrency(priceDetail.unit_price)}</Typography></td>
                                        </tr>
                                        <tr>
                                            <td><Typography>
                                                <strong>{isSalesData ? 'Quantity Sold:' : 'Quantity Listed:'}</strong>
                                            </Typography></td>
                                            <td><Typography>{priceDetail.quantity}</Typography></td>
                                        </tr>
                                    </table>
                                </Box>
                                {isSalesData && (
                                    <Box sx={{ m: 1, position: 'relative'}}>
                                        <table>
                                            <tr>
                                                <td><Typography><strong>Date Ordered:</strong></Typography></td>
                                                <td><Typography>{formatDate(priceDetail.date_ordered)}</Typography></td>
                                            </tr>
                                            <tr>
                                                <td><Typography><strong>Sale Location:</strong></Typography></td>
                                                <td><Typography>{priceDetail.seller_country_code} &rarr; {priceDetail.buyer_country_code}</Typography></td>
                                            </tr>
                                        </table>
                                    </Box>
                                )}
                            </Box>
                        </Card>
                    ))}
                </>
            )}
        </Box>
    );
};

export default SalesData;