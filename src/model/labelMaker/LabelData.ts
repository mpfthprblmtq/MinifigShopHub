export interface LabelData {
  item: {
    no: string;
    name: string;
    value: number;
    image_url: string;
  };
  status: string;
  pieces: number;
  minifigs: number;
  partsIndicator: boolean;
  minifigsIndicator: boolean;
  manualIndicator: boolean;
  validatedBy: string;
}