import { Item } from "../model/item/Item";
import axios from "axios";
import { BricksetItemResponse } from "../model/item/BricksetItemResponse";
import { RetailStatus } from "../model/retailStatus/RetailStatus";
import { Availability } from "../model/retailStatus/Availability";
import dayjs from "dayjs";

const baseUrl: string = 'https://corsproxy.io/?https://brickset.com/api/v3.asmx';

export interface BricksetServiceHooks {
  getBricksetData: (item: Item) => Promise<Item>;
}

export const useBricksetService = (): BricksetServiceHooks => {

  // create our Brickset Axios instance
  const bricksetAxiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
    headers: {}
  });

  const getBricksetData = async (item: Item): Promise<Item> => {
    if (item?.setId) {
      try {
        const bricksetData = await get(item.setId);
        const set = bricksetData.sets[0];
        return {
          theme: set.theme,
          subTheme: set.subtheme,
          pieceCount: set.pieces,
          minifigCount: set.minifigs,
          retailStatus: {
            retailPrice: set.LEGOCom.US.retailPrice,
            availability: determineAvailability(set.LEGOCom.US.dateLastAvailable),
          } as RetailStatus
        } as Item;
      } catch (error) {
        console.error(error);
        return item;
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
    return `${baseUrl}/getSets?apiKey=${process.env.REACT_APP_BRICKSET_API_KEY}&userHash=&params={"setNumber": "${id}"}`;
  }

  const determineAvailability = (date: string): Availability | undefined => {
    if (!date) {
      return undefined;
    }
    return dayjs().isAfter(date) ? Availability.RETIRED : Availability.RETAIL;
  }

  return { getBricksetData };
}