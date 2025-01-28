import React, {FunctionComponent, useState} from "react";
import {Sale} from "../../../../model/salesHistory/Sale";
import {Box, Button, Card, Tooltip, Typography} from "@mui/material";
import {formatCurrency} from "../../../../utils/CurrencyUtils";
import {getCountryFromIso2Code} from "../../../../utils/CountryUtils";
import {htmlDecode} from "../../../../utils/StringUtils";
import { formatDate } from "../../../../utils/DateUtils";

interface SalesDataParams {
    sales?: Sale[];
    isSalesData: boolean;
}

const SalesData: FunctionComponent<SalesDataParams> = ({sales, isSalesData}) => {

    const [listToShow, setListToShow] = useState<Sale[]>(
      sales ? sales.slice().reverse().slice(0, 10) : []);

    const showAllSales = () => {
        if (sales) {
            setListToShow(sales.slice().reverse());
        }
    };

    return (
        <Box>
            {sales && sales.length > 0 && (
                <>
                    {listToShow.map((sale, index) => (
                        <Card style={{marginTop: "10px", backgroundColor: "#F5F5F5"}} key={index}>
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
                                                <td><Typography>{formatCurrency(sale.salePrice)}</Typography></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <Typography>
                                                        <strong>{isSalesData ? 'Quantity Sold:' : 'Quantity Listed:'}</strong>
                                                    </Typography>
                                                </td>
                                                <td><Typography>{sale.quantity}</Typography></td>
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
                                                    <td><Typography>{formatDate(sale.date)}</Typography></td>
                                                </tr>
                                                <tr>
                                                    <td><Typography><strong>Sale Location:</strong></Typography></td>
                                                    <Tooltip title={getCountryFromIso2Code(sale.sellerCountry) + ' ' + htmlDecode('&rarr;') + ' ' + getCountryFromIso2Code(sale.buyerCountry)}>
                                                        <td><Typography>{sale.sellerCountry} &rarr; {sale.buyerCountry}</Typography></td>
                                                    </Tooltip>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Box>
                                )}
                            </Box>
                        </Card>
                    ))}
                    {listToShow.length !== sales.length && (
                        <Box style={{textAlign: 'center', marginTop: 10}}>
                            <Button size='large' onClick={showAllSales}>Show All ({sales.length})</Button>
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
};

export default SalesData;