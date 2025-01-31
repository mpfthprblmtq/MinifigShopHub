import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { ItemResponse } from "../model/item/ItemResponse";
import { BrickEconomyResponse } from "../model/brickEconomy/BrickEconomyResponse";
import { RebrickableResponse } from "../model/rebrickable/RebrickableResponse";
import { MultipleItemResponse } from "../model/item/MultipleItemResponse";

const baseUrl: string = 'https://gblo076h16.execute-api.us-east-2.amazonaws.com/prod';

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
    timeout: 10000
  });

  const get = async <T,>(endpoint: string): Promise<T> => {
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

  const generateTraceId = (): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  const getHealth = async (): Promise<{ version: string, status: string }> => {
    return await get('/health');
  }

  const getItem = async (id: string): Promise<ItemResponse> => {
    return await get(`/get-item/${id}`);
  };

  const getItems = async (ids: string[]): Promise<MultipleItemResponse> => {
    return await get(`get-items/${ids.join(',')}`);
  }

  const getBrickEconomyData = async (id: string): Promise<BrickEconomyResponse> => {
    return await get(`/get-brickeconomy-data/${id}`);
  }

  const getPartsList = async (id: string): Promise<RebrickableResponse> => {
    return await get(`/get-rebrickable-parts/${id}`);
  }

  return { getHealth, getItem, getItems, getBrickEconomyData, getPartsList };
};