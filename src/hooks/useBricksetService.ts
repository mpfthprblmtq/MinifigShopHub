import { Item } from "../model/item/Item";
import axios, { AxiosError } from "axios";
import { BricksetItemResponse } from "../model/item/BricksetItemResponse";
import { RetailStatus } from "../model/retailStatus/RetailStatus";
import { Availability } from "../model/retailStatus/Availability";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Source } from "../model/_shared/Source";

const corsProxyUrl: string = "https://proxy.cors.sh/";
const baseUrl: string = 'https://brickset.com/api/v3.asmx';

export interface BricksetServiceHooks {
  getBricksetData: (item: Item) => Promise<Item | undefined>;
}

export const useBricksetService = (): BricksetServiceHooks => {

  // create our Brickset Axios instance
  const bricksetAxiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 10000,
    headers: {
      "x-cors-api-key": "live_6aba39ccdee8ed8b73605d0e20a44856036a469b78fd9fdbb2a0399951e920a1"
    }
  });

  const getBricksetData = async (item: Item): Promise<Item | undefined> => {
    if (item?.setId) {
      try {
        const id: string = new RegExp(".+-\\d").test(item.setId) ? item.setId : item.setId + '-1';
        const bricksetData = await get(id);
        const set = bricksetData.sets[0];
        if (set) {
          return {
            theme: set.theme,
            subTheme: set.subtheme,
            pieceCount: set.pieces,
            minifigCount: set.minifigs,
            retailStatus: {
              retailPrice: set.LEGOCom.US.retailPrice,
              availability: determineAvailability(set.LEGOCom.US.dateFirstAvailable, set.LEGOCom.US.dateLastAvailable),
            } as RetailStatus,
            sources: item.sources ? [...item.sources, Source.BRICKSET] : [Source.BRICKSET]
          } as Item;
        }
        return undefined;
      } catch (error: AxiosError | any) {
        console.error(error);
        if (error.code === AxiosError.ECONNABORTED && error.message.startsWith('timeout')) {
          throw new AxiosError('Error with Brickset, request timed out!', AxiosError.ECONNABORTED);
        } else {
          throw new AxiosError(`Error with Brickset: ${error.message}`);
        }
      }
    } else {
      return item;
    }
  }

  const get = async (id: string): Promise<BricksetItemResponse> => {
    return (await bricksetAxiosInstance.get<BricksetItemResponse>(
      buildRequestUrl(id),
      {}
    )).data;
  }

  const buildRequestUrl = (id: string): string => {
    return `${corsProxyUrl}${baseUrl}/getSets?apiKey=${process.env.REACT_APP_BRICKSET_API_KEY}&userHash=&params=${encodeURI(`{"setNumber":"${id}"}`)}`;
  }

  const determineAvailability = (dateFirstAvailable: string, dateLastAvailable: string): Availability | undefined => {
    // if we have a dateFirstAvailable and not a dateLastAvailable, then the set is at Retail
    // or if we have both dates, and the dateLastAvailable is today, then set is also at Retail
    dayjs.extend(utc);
    const dateToday =
      dayjs(dayjs().toISOString()).utcOffset(dayjs().toISOString().slice(-6)).format('YYYY-MM-DD') + 'T00:00:00Z';
    if ((dateFirstAvailable && !dateLastAvailable) || (dateFirstAvailable && dateLastAvailable === dateToday)) {
      return Availability.RETAIL;
    } else if (!dateFirstAvailable && !dateLastAvailable) {
      // if we have neither, then brickset doesn't have the data
      return undefined;
    }
    // if we have both for some reason, then just check if the date is after
    return dayjs().isAfter(dateLastAvailable) ? Availability.RETIRED : Availability.RETAIL;
  }

  return { getBricksetData };
}