import { Color } from "./Color";

export interface Part {
  id: number;
  bricklinkId: string;
  name: string;
  imageUrl: string;
  color: Color;
  quantity: number;
  isSpare: boolean;
  inOtherSets: number;
  set: string;
}