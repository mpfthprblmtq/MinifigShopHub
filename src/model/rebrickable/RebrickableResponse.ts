import { Meta } from "../_shared/Meta";

export interface RebrickableResponse {
  meta: Meta;
  parts: Part[];
}

export interface Part {
  name: string;
  id: string;
  quantity: number;
  spare: boolean;
  inSets: number;
  color: Color;
  imageUrl: string;
}

export interface Color {
  id: number;
  name: string;
  rgb: string;
  isTrans: boolean;
}