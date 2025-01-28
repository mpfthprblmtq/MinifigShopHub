import React, {FunctionComponent, ReactNode, useEffect, useState} from "react";
import {SalesHistory} from "../../../../model/salesHistory/SalesHistory";
import {Accordion, AccordionDetails, AccordionSummary} from "@mui/material";
import {ExpandMore} from "@mui/icons-material";
import SalesSummary from "./SalesSummary";
import SalesData from "./SalesData";
import Chart from 'react-apexcharts';
import {formatCurrency} from "../../../../utils/CurrencyUtils";
import {ApexOptions} from "apexcharts";
import { Sale } from "../../../../model/salesHistory/Sale";
import { formatDate } from "../../../../utils/DateUtils";
import dayjs from "dayjs";

interface SalesHistoryAccordionParams {
    title: ReactNode;
    salesHistory?: SalesHistory;
    setId?: string;
}

const SalesHistoryAccordion: FunctionComponent<SalesHistoryAccordionParams> = ({title, salesHistory, setId}) => {

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
        if (salesHistory?.sales && salesHistory.sales.length > 0 && salesHistory.sales[0].date && series[0].data.length === 0) {

            // since we're dealing with sales data, set the state value for use later in the component
            setIsSalesData(true);

            const data: any[] = [];
            // convert and sort it by date first since sometimes it doesn't come back sorted
            const salesHistoryList: Sale[] = [...salesHistory.sales].map(sale => ({
                ...sale,
                date: dayjs(sale.date)
            })).sort((a, b) => a.date.valueOf() - b.date.valueOf());
            // then populate the chart data in its x/y format
            salesHistoryList.forEach((sale) => {
                data.push({x: formatDate(sale.date), y: sale.salePrice});
            });
            seriesData[0].data = data;
            setSeries(seriesData);
        }
        // eslint-disable-next-line
    }, [salesHistory]);

    // custom chart options
    const options: ApexOptions = {
        chart: { id: "basic-bar", type: 'area' },
        title: { text: `Sales history for ${setId}`, align: 'left' },
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
                <SalesData sales={salesHistory?.sales} isSalesData={isSalesData} />
            </AccordionDetails>
        </Accordion>
    );
};

export default SalesHistoryAccordion;