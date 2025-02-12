import {SalesHistory} from "./SalesHistory";

export interface AllSalesHistory {
    newStock?: SalesHistory;
    usedStock?: SalesHistory;
    newSales?: SalesHistory;
    usedSales?: SalesHistory;
}