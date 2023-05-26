import {Meta} from "../shared/Meta";
import {Item} from "./Item";

export interface ItemResponse {
    meta: Meta;
    data: Item;
}