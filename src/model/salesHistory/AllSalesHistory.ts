import {SalesHistory} from "./SalesHistory";

export interface AllSalesHistory {
    newStock?: SalesHistory;
    usedStock?: SalesHistory;
    newSold?: SalesHistory;
    usedSold?: SalesHistory;
}