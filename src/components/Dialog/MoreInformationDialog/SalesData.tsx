import React, {FunctionComponent, useState} from "react";
import {PriceDetail} from "../../../model/salesHistory/PriceDetail";
import {Box, Button, Card, Tooltip, Typography} from "@mui/material";
import {formatCurrency} from "../../../utils/CurrencyUtils";
import {formatDate} from "../../../utils/DateUtils";
import {getCountryFromIso2Code} from "../../../utils/CountryUtils";
import {htmlDecode} from "../../../utils/StringUtils";

interface SalesDataParams {
    priceDetails?: PriceDetail[];
    isSalesData: boolean;
}

const SalesData: FunctionComponent<SalesDataParams> = ({priceDetails, isSalesData}) => {

    const [listToShow, setListToShow] = useState<PriceDetail[]>(
        priceDetails ? priceDetails.slice().reverse().slice(0, 10) : []);

    const showAllPriceDetails = () => {
        if (priceDetails) {
            setListToShow(priceDetails.slice().reverse());
        }
    };

    return (
        <Box>
            {priceDetails && priceDetails.length > 0 && (
                <>
                    {listToShow.map(priceDetail => (
                        <Card style={{marginTop: "10px", backgroundColor: "#F5F5F5"}}>
                            <Box sx={{ display: 'flex' }}>
                                <Box sx={{ m: 1, position: 'relative' }}>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <Typography>
                                                        <strong>{isSalesData ? 'Unit Price:' : 'Listing Price:'}</strong>
                                                    </Typography>
                                                </td>
                                                <td><Typography>{formatCurrency(priceDetail.unit_price)}</Typography></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <Typography>
                                                        <strong>{isSalesData ? 'Quantity Sold:' : 'Quantity Listed:'}</strong>
                                                    </Typography>
                                                </td>
                                                <td><Typography>{priceDetail.quantity}</Typography></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Box>
                                {isSalesData && (
                                    <Box sx={{ m: 1, position: 'relative'}}>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td><Typography><strong>Date Ordered:</strong></Typography></td>
                                                    <td><Typography>{formatDate(priceDetail.date_ordered)}</Typography></td>
                                                </tr>
                                                <tr>
                                                    <td><Typography><strong>Sale Location:</strong></Typography></td>
                                                    <Tooltip title={getCountryFromIso2Code(priceDetail.seller_country_code) + ' ' + htmlDecode('&rarr;') + ' ' + getCountryFromIso2Code(priceDetail.buyer_country_code)}>
                                                        <td><Typography>{priceDetail.seller_country_code} &rarr; {priceDetail.buyer_country_code}</Typography></td>
                                                    </Tooltip>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Box>
                                )}
                            </Box>
                        </Card>
                    ))}
                    {listToShow.length !== priceDetails.length && (
                        <Box style={{textAlign: 'center', marginTop: 10}}>
                            <Button size='large' onClick={showAllPriceDetails}>Show All ({priceDetails.length})</Button>
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
};

export default SalesData;