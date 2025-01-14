import { Type } from "../model/_shared/Type";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { ItemResponse } from "../model/item/ItemResponse";

const baseUrl: string = 'https://gblo076h16.execute-api.us-east-2.amazonaws.com/prod';

export interface BackendServiceHooks {
  getItem: (id: string, type: Type) => Promise<ItemResponse>;
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

  return { getItem };
};