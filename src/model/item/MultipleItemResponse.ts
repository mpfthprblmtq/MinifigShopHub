import { Meta } from "../_shared/Meta";
import { Item } from "./Item";

export interface MultipleItemResponse {
  meta: Meta;
  items: Map<string, Item[]>
}