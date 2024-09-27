import React, {FunctionComponent, ReactNode, useEffect, useState} from "react";
import {SalesHistory} from "../../../../model/salesHistory/SalesHistory";
import {Accordion, AccordionDetails, AccordionSummary} from "@mui/material";
import {ExpandMore} from "@mui/icons-material";
import SalesSummary from "./SalesSummary";
import SalesData from "./SalesData";
import Chart from 'react-apexcharts';
import {formatDate} from "../../../../utils/DateUtils";
import {formatCurrency} from "../../../../utils/CurrencyUtils";
import {ApexOptions} from "apexcharts";
import { PriceDetail } from "../../../../model/salesHistory/PriceDetail";

interface SalesHistoryAccordionParams {
    title: ReactNode;
    salesHistory?: SalesHistory;
}

const SalesHistoryAccordion: FunctionComponent<SalesHistoryAccordionParams> = ({title, salesHistory}) => {

    const initialData: any = [{
        name: 'Sale Price',
        data: []
    }];
    const [series, setSeries] = useState<any[]>(initialData);
    const [isSalesData, setIsSalesData] = useState<boolean>(false);

    useEffect(() => {
        const seriesData = [...series];

        // check to see if we're dealing with sales data
        // also have to have a check to see if the data is set to 0 because the chart data was getting populated twice
        if (salesHistory?.price_detail && salesHistory.price_detail.length > 0 && salesHistory.price_detail[0].date_ordered && series[0].data.length === 0) {

            // since we're dealing with sales data, set the state value for use later in the component
            setIsSalesData(true);

            const data: any[] = [];
            // sort it by date first since sometimes it doesn't come back sorted
            const salesHistoryList: PriceDetail[] = [...salesHistory.price_detail]
              .sort((a, b) => a.date_ordered!.localeCompare(b.date_ordered!));
            // then populate the chart data in its x/y format
            salesHistoryList.forEach((priceDetail) => {
                data.push({x: formatDate(priceDetail.date_ordered), y: priceDetail.unit_price});
            });
            seriesData[0].data = data;
            setSeries(seriesData);
        }
        // eslint-disable-next-line
    }, [salesHistory]);

    // custom chart options
    const options: ApexOptions = {
        chart: { id: "basic-bar", type: 'area' },
        title: { text: `Sales history for ${salesHistory?.item.no}`, align: 'left' },
        xaxis: { type: 'datetime', title: { text: 'Sale Date' }},
        yaxis: {
            labels: { formatter: (value: number) => { return formatCurrency(value).replace(".00", ""); }, },
            title: { text: 'Sale Price' },
        },
    };

    return (
        <Accordion TransitionProps={{timeout: 200}}>
            <AccordionSummary expandIcon={<ExpandMore />}>
                {title}
            </AccordionSummary>
            <AccordionDetails>
                <SalesSummary salesHistory={salesHistory} isSalesData={isSalesData} />
                {isSalesData && (
                    <Chart series={series} options={options}/>
                )}
                <SalesData priceDetails={salesHistory?.price_detail} isSalesData={isSalesData} />
            </AccordionDetails>
        </Accordion>
    );
};

export default SalesHistoryAccordion;