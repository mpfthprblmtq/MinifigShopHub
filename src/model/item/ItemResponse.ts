import { Item } from "./Item";

export interface ItemResponse {
  meta: {
    description?: string;
    code?: number;
    message?: string;
  };
  items: Item[];
}