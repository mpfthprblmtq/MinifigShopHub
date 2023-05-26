import {Item} from "../item/Item";
import {PriceDetail} from "./PriceDetail";

export interface SalesHistory {
    item: Item;
    new_or_used: 'U' | 'N';
    currency_code: string;
    min_price: string;
    max_price: string;
    avg_price: string;
    qty_avg_price: string;
    unit_quantity: number;
    total_quantity: number;
    price_detail: PriceDetail[];
}