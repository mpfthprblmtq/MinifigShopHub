import {SalesHistory} from "../salesHistory/SalesHistory";
import {Condition} from "../shared/Condition";

export interface Item {
    id: number;
    no: string;
    name: string;
    category_id: number;
    image_url: string;
    thumbnail_url: string;
    year_released: number;
    condition: Condition;
    baseValue: number;
    value: number;
    valueAdjustment: number;
    notes: string;
    newStock?: SalesHistory;
    usedStock?: SalesHistory;
    newSold?: SalesHistory;
    usedSold?: SalesHistory;
}