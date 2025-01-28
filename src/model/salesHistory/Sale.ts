import { Dayjs } from "dayjs";

export interface Sale {
    quantity: number;
    salePrice: string;
    sellerCountry?: string;
    buyerCountry?: string;
    date?: Dayjs;
}