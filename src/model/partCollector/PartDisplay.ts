import { Part } from "./Part";

export interface PartDisplay {
  key: string;
  set: string;
  quantity: number;
  comment: string;
  part: Part;
}