import { Meta } from "../_shared/Meta";
import { Dayjs } from "dayjs";

export interface BrickEconomyResponse {
  meta: Meta;
  item: {
    retailPrice: number;
    newValue: number;
    usedValue: number;
    forecastedValueNew2Years: number;
    forecastedValueNew5Years: number;
    rollingGrowthLastYear: number;
    rollingGrowthLast12Months: number;
    newPriceEvents: PriceEvent[];
    usedPriceEvents: PriceEvent[];
  }
}

interface PriceEvent {
  value: number;
  date: Dayjs;
}