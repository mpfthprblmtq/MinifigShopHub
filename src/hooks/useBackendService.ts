import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { ItemResponse } from "../model/item/ItemResponse";
import { BrickEconomyResponse } from "../model/brickEconomy/BrickEconomyResponse";
import { RebrickableResponse } from "../model/rebrickable/RebrickableResponse";

const baseUrl: string = 'https://gblo076h16.execute-api.us-east-2.amazonaws.com/prod';

export interface BackendServiceHooks {
  getHealth:() => Promise<{ version: string, status: string }>;
  getItem: (id: string) => Promise<ItemResponse>;
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
          'User': user?.sub
        }
      }
    )).data;
  }

  const getHealth = async (): Promise<{ version: string, status: string }> => {
    return await get('/health');
  }

  const getItem = async (id: string): Promise<ItemResponse> => {
    return await get(`/get-item/${id}`);
  };

  const getBrickEconomyData = async (id: string): Promise<BrickEconomyResponse> => {
    return await get(`/get-brickeconomy-data/${id}`);
  }

  const getPartsList = async (id: string): Promise<RebrickableResponse> => {
    return await get(`/get-rebrickable-parts/${id}`);
  }

  return { getHealth, getItem, getBrickEconomyData, getPartsList };
};