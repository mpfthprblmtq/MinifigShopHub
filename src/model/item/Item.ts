import {SalesHistory} from "../salesHistory/SalesHistory";
import {Condition} from "../_shared/Condition";
import {Source} from "../_shared/Source";
import {Type} from "../_shared/Type";
import {RetailStatus} from "../retailStatus/RetailStatus";

export interface Item {
    id: number;
    no?: string;
    name: string;
    category_id?: number;
    category_name?: string;
    image_url?: string;
    thumbnail_url?: string;
    year_released?: number;
    condition: Condition;
    baseValue: number;
    valueAdjustment: number;
    value: number;
    valueDisplay?: string;
    comment?: string;
    source: Source;
    type: Type;
    retailStatus?: RetailStatus;
    newStock?: SalesHistory;
    usedStock?: SalesHistory;
    newSold?: SalesHistory;
    usedSold?: SalesHistory;
}