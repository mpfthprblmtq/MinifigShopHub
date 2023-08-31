export interface BricksetItemResponse {
  status: string;
  matches: number;
  sets: [
    {
      theme: string;
      subtheme: string;
      pieces: number;
      minifigs: number;
      LEGOCom: {
        US: {
          retailPrice: number;
          dateFirstAvailable: string;
          dateLastAvailable: string;
        }
      }
    }
  ]
}