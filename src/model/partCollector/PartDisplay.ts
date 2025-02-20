import { Part } from "../rebrickable/RebrickableResponse";

export interface PartDisplay {
  id: string;
  set: string;
  quantity: number;
  comment: string;
  part: Part;
}