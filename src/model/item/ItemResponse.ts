import { Item } from "./Item";
import { Meta } from "../_shared/Meta";

export interface ItemResponse {
  meta: Meta;
  items: Item[];
}