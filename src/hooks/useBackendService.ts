import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { ItemResponse } from "../model/item/ItemResponse";
import { BrickEconomyResponse } from "../model/brickEconomy/BrickEconomyResponse";
import { RebrickableResponse } from "../model/rebrickable/RebrickableResponse";
import { MultipleItemResponse } from "../model/item/MultipleItemResponse";
import { Item } from "../model/item/Item";

const baseUrl: string = 'https://gblo076h16.execute-api.us-east-2.amazonaws.com/prod';
// const baseUrl: string = 'http://localhost:8080';

export interface BackendServiceHooks {
  getHealth:() => Promise<{ version: string, status: string }>;
  getItem: (id: string) => Promise<ItemResponse>;
  getItems: (ids: string[]) => Promise<MultipleItemResponse>;
  getBrickEconomyData: (id: string) => Promise<BrickEconomyResponse>;
  getPartsList: (id: string) => Promise<RebrickableResponse>;
}

export const useBackendService = (): BackendServiceHooks => {

  const { user, getAccessTokenSilently } = useAuth0();

  // create our axios instance
  const axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 30000
  });

  const get = async <T>(endpoint: string): Promise<T> => {
    const token = await getAccessTokenSilently();
    return (await axiosInstance.get<T>(
      `${baseUrl}${endpoint}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'User': user?.sub,
          'trace-id': generateTraceId()
        }
      }
    )).data;
  }

  const getWithoutHeaders = async <T,>(endpoint: string): Promise<T> => {
    return (await axiosInstance.get<T>(`${baseUrl}${endpoint}`)).data;
  }

  const generateTraceId = (): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  const getHealth = async (): Promise<{ version: string, status: string }> => {
    return await getWithoutHeaders('/health');
  }

  const getItem = async (id: string): Promise<ItemResponse> => {
    return await get(`/get-item/${id}`);
  };

  const getItems = async (ids: string[]): Promise<MultipleItemResponse> => {
    const BATCH_SIZE = 20;

    // split IDs into batches
    const batches = [];
    for (let i = 0; i < ids.length; i += BATCH_SIZE) {
      batches.push(ids.slice(i, i + BATCH_SIZE));
    }

    // fetch all batches in parallel
    const responses = await Promise.all(
      batches.map(batch => get(`/get-items?ids=${batch.join(',')}`))
    ) as MultipleItemResponse[];

    // validate responses, makes sure each response was a 200
    for (const res of responses) {
      if (res.meta.message !== "success" && res.meta.code !== 200) {
        throw new Error(`API call failed: ${JSON.stringify(res.meta)}`);
      }
    }

    // put all of the items in a merged map
    const allItems = new Map<string, Item[]>();
    responses.forEach(response => {
      const itemsMap = new Map(Object.entries(response.items));
      itemsMap.forEach((items, key) => {
        allItems.set(key, items);
      });
    });

    // return everything with a success
    return { meta: { message: 'success', code: 200 }, items: allItems } as MultipleItemResponse;
  };


  const getBrickEconomyData = async (id: string): Promise<BrickEconomyResponse> => {
    return await get(`/get-brickeconomy-data/${id}`);
  }

  const getPartsList = async (id: string): Promise<RebrickableResponse> => {
    return await get(`/get-rebrickable-parts/${id}`);
  }

  return { getHealth, getItem, getItems, getBrickEconomyData, getPartsList };
};