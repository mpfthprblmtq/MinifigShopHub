import { Status } from "./Status";

export interface Label {
  title?: string;
  value?: number;
  image_url?: string;
  status: Status;
  pieces?: number;
  minifigs?: number;
  partsIndicator: boolean;
  minifigsIndicator: boolean;
  manualIndicator: boolean;
  validatedBy: string;
  comment?: string;
}