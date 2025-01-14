import {Sale} from "./Sale";

export interface SalesHistory {
    minimumPrice: string;
    maximumPrice: string;
    averagePrice: string;
    unit_quantity: number;
    numberOfItemsSold: number;
    sales: Sale[];
}