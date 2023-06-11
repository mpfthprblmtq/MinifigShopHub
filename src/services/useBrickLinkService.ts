import axios from "axios";
import {getAuthHeader} from "../utils/Oauth1Helper";
import {ItemResponse} from "../model/item/ItemResponse";
import {Item} from "../model/item/Item";
import {SalesHistory} from "../model/salesHistory/SalesHistory";
import {SalesHistoryResponse} from "../model/salesHistory/SalesHistoryResponse";
import {AllSalesHistory} from "../model/salesHistory/AllSalesHistory";
import {Category} from "../model/category/Category";
import {CategoryResponse} from "../model/category/CategoryResponse";

const baseUrl: string = "https://api.bricklink.com/api/store/v1";

export interface BrickLinkHooks {
    getItem: (id: string) => Promise<Item>;
    getAllSalesHistory: (item: Item) => Promise<AllSalesHistory>;
    getCategory: (id: number) => Promise<Category>;
}

export const useBrickLinkService = (): BrickLinkHooks => {

    // create our BrickLink Axios instance
    const brickLinkAxiosInstance = axios.create({
        baseURL: "",
        timeout: 3000,
        headers: {}
    });

    /**
     * Get function that retrieves basic set information (name, year released, etc)
     * @param id the id of the set
     */
    const getItem = async (id: string): Promise<Item> => {
        // append a '-1' onto the end of the id, since that's how BrickLink stores their data
        if (!id.match(".*-\\d+")) {
            id += "-1";
        }

        // build the request and authorization header
        const request = {
            url: `${baseUrl}/items/set/${id}`,
            method: 'GET'
        };
        const authHeader = getAuthHeader(request);

        // make the request
        return (await brickLinkAxiosInstance.get<ItemResponse>(
            `api/store/v1/items/set/${id}`,
            {headers: authHeader}
        )).data.data;
    };

    const getSalesHistory = async (id: string, type: 'sold' | 'stock', state: 'U' | 'N'): Promise<SalesHistory> => {
        // build the request and authorization header
        const request = {
            url: `${baseUrl}/items/set/${id}/price?guide_type=${type}&new_or_used=${state}`,
            method: 'GET'
        };
        const authHeader = getAuthHeader(request);

        // make the request
        return (await brickLinkAxiosInstance.get<SalesHistoryResponse>(
            `api/store/v1/items/set/${id}/price?guide_type=${type}&new_or_used=${state}`,
            {headers: authHeader}
        )).data.data;
    };

    const getAllSalesHistory = async (item: Item): Promise<AllSalesHistory> => {
        let allSalesHistory: AllSalesHistory = {};
        if (item.no) {
            await Promise.all([
                getSalesHistory(item.no, "sold", "U"),
                getSalesHistory(item.no, "stock", "U"),
                getSalesHistory(item.no, "sold", "N"),
                getSalesHistory(item.no, "stock", "N")
            ]).then(responses => {
                allSalesHistory.usedSold = responses[0];
                allSalesHistory.usedStock = responses[1];
                allSalesHistory.newSold = responses[2];
                allSalesHistory.newStock = responses[3];
            });
        }
        return allSalesHistory;
    };

    const getCategory = async (id: number): Promise<Category> => {
        // build the request and authorization header
        const request = {
            url: `${baseUrl}/categories/${id}`,
            method: 'GET'
        };
        const authHeader = getAuthHeader(request);

        // make the request
        return (await brickLinkAxiosInstance.get<CategoryResponse>(
            `api/store/v1/categories/${id}`,
            {headers: authHeader}
        )).data.data;
    }

    return { getItem, getAllSalesHistory, getCategory };
};

