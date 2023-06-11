import {SalesHistory} from "../salesHistory/SalesHistory";
import {Condition} from "../shared/Condition";
import {Source} from "../shared/Source";
import {Type} from "../shared/Type";

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
    value: number;
    valueDisplay?: string;
    valueAdjustment: number;
    comment?: string;
    source: Source;
    type: Type;
    newStock?: SalesHistory;
    usedStock?: SalesHistory;
    newSold?: SalesHistory;
    usedSold?: SalesHistory;
}