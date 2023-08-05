import {Item} from "../item/Item";
import {Total} from "../total/Total";

export interface Quote {
    items: Item[];
    total: Total;
}