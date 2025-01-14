import { Meta } from "../_shared/Meta";

export interface RebrickableResponse {
  meta: Meta;
  parts: Part[];
}

interface Part {
  name: string;
  id: string;
  quantity: number;
  isSpare: boolean;
  inSets: number;
  color: {
    id: number;
    name: string;
    rgb: string;
    isTrans: boolean;
  }
}