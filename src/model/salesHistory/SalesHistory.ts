import {Sale} from "./Sale";

export interface SalesHistory {
    minimumPrice: string;
    maximumPrice: string;
    averagePrice: string;
    numberOfSales: number;
    numberOfItemsSold: number;
    sales: Sale[];
}