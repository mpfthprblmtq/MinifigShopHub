import axios from "axios";
import {getAuthHeader} from "../utils/Oauth1Helper";
import {ItemResponse} from "../model/item/ItemResponse";
import {Item} from "../model/item/Item";
import {SalesHistory} from "../model/salesHistory/SalesHistory";
import {SalesHistoryResponse} from "../model/salesHistory/SalesHistoryResponse";
import {AllSalesHistory} from "../model/salesHistory/AllSalesHistory";
import {Category} from "../model/category/Category";
import {CategoryResponse} from "../model/category/CategoryResponse";
import {Type} from "../model/shared/Type";
import {htmlDecode} from "../utils/StringUtils";

const baseUrl: string = "https://api.bricklink.com/api/store/v1";

export interface BrickLinkHooks {
    getHydratedItem: (id: string, itemType: Type) => Promise<Item>;
    getItem: (id: string, itemType: Type) => Promise<Item>;
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

    const getHydratedItem = async (id: string, itemType: Type): Promise<Item> => {
        try {
            // get the main item data
            const item: Item = await getItem(id, itemType);

            // get the category
            if (item.category_id) {
                const category: Category = await getCategory(item.category_id);
                item.category_name = category.category_name;
            }

            // html decode the item name since that's html encoded
            item.name = htmlDecode(item.name);

            // return the hydrated item
            return item;
        } catch (error) {
            console.log(error);
            throw error;
        }


    }

    /**
     * Get function that retrieves basic set information (name, year released, etc)
     * @param id the id of the set
     * @param itemType the type of item to get
     */
    const getItem = async (id: string, itemType: Type): Promise<Item> => {
        // append a '-1' onto the end of the id, since that's how BrickLink stores their data
        if (itemType === Type.SET && !id.match(".*-\\d+")) {
            id += "-1";
        }

        // build the request and authorization header
        const request = {
            url: `${baseUrl}/items/${itemType}/${id}`,
            method: 'GET'
        };
        const authHeader = getAuthHeader(request);

        // make the request
        return (await brickLinkAxiosInstance.get<ItemResponse>(
            `api/store/v1/items/${itemType}/${id}`,
            {headers: authHeader}
        )).data.data;
    };

    const getSalesHistory = async (id: string, itemType: Type, type: 'sold' | 'stock', state: 'U' | 'N'): Promise<SalesHistory> => {
        // build the request and authorization header
        const request = {
            url: `${baseUrl}/items/${itemType}/${id}/price?guide_type=${type}&new_or_used=${state}`,
            method: 'GET'
        };
        const authHeader = getAuthHeader(request);

        // make the request
        return (await brickLinkAxiosInstance.get<SalesHistoryResponse>(
            `api/store/v1/items/${itemType}/${id}/price?guide_type=${type}&new_or_used=${state}`,
            {headers: authHeader}
        )).data.data;
    };

    const getAllSalesHistory = async (item: Item): Promise<AllSalesHistory> => {
        let allSalesHistory: AllSalesHistory = {};
        if (item.no) {
            await Promise.all([
                getSalesHistory(item.no, item.type, "sold", "U"),
                getSalesHistory(item.no, item.type, "stock", "U"),
                getSalesHistory(item.no, item.type, "sold", "N"),
                getSalesHistory(item.no, item.type, "stock", "N")
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

    return { getHydratedItem, getItem, getAllSalesHistory, getCategory };
};

