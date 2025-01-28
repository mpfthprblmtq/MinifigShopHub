import { Part } from "../rebrickable/RebrickableResponse";

export interface PartDisplay {
  key: string;
  set: string;
  quantity: number;
  comment: string;
  part: Part;
}