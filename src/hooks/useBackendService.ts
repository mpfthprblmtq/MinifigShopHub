import { Type } from "../model/_shared/Type";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { ItemResponse } from "../model/item/ItemResponse";
import { BrickEconomyResponse } from "../model/brickEconomy/BrickEconomyResponse";
import { RebrickableResponse } from "../model/rebrickable/RebrickableResponse";

const baseUrl: string = 'https://gblo076h16.execute-api.us-east-2.amazonaws.com/prod';

export interface BackendServiceHooks {
  getItem: (id: string, type: Type) => Promise<ItemResponse>;
  getBrickEconomyData: (id: string, type: Type) => Promise<BrickEconomyResponse>;
  getParts: (id: string) => Promise<RebrickableResponse>;
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

  const getItem = async (id: string, type: Type): Promise<ItemResponse> => {
    return await get(`/get-item/${type}/${id}`);
  };

  const getBrickEconomyData = async (id: string, type: Type): Promise<BrickEconomyResponse> => {
    return await get(`/get-brickeconomy-data/${type}/${id}`);
  }

  const getParts = async (id: string): Promise<RebrickableResponse> => {
    return await get(`/get-rebrickable-parts/${id}`);
  }

  return { getItem, getBrickEconomyData, getParts };
};