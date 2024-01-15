import axios from "axios";
import {getAuthHeader} from "../utils/Oauth1Helper";
import {BricklinkItemResponse} from "../model/item/BricklinkItemResponse";
import {Item} from "../model/item/Item";
import {SalesHistory} from "../model/salesHistory/SalesHistory";
import {SalesHistoryResponse} from "../model/salesHistory/SalesHistoryResponse";
import {AllSalesHistory} from "../model/salesHistory/AllSalesHistory";
import {Type} from "../model/_shared/Type";
import {filterOutOldDates} from "../utils/DateUtils";
import { htmlDecode } from "../utils/StringUtils";

const corsProxyUrl: string = 'https://proxy.cors.sh/';
const baseUrl: string = "https://api.bricklink.com/api/store/v1";

export interface BrickLinkHooks {
    getBricklinkData: (id: string, type: Type) => Promise<Item>;
    getAllSalesHistory: (item: Item) => Promise<AllSalesHistory>;
}

export const useBrickLinkService = (): BrickLinkHooks => {

    // create our BrickLink Axios instance
    const brickLinkAxiosInstance = axios.create({
        baseURL: baseUrl,
        timeout: 10000,
        headers: {
            'x-cors-api-key': 'live_6aba39ccdee8ed8b73605d0e20a44856036a469b78fd9fdbb2a0399951e920a1',
        }
    });

    const get = async <T,>(url: string): Promise<T> => {
        // build the request and authorization header
        const request = {
            url: url,
            method: 'GET'
        };
        const authHeader = getAuthHeader(request);

        // make the request
        return (await brickLinkAxiosInstance.get<T>(
          `${corsProxyUrl}${url}`,
          {headers: authHeader}
        )).data;
    };

    /**
     * Get function that retrieves basic set information (name, year released, etc)
     * @param id the id of the set
     * @param type the type of item to get
     */
    const getBricklinkData = async (id: string, type: Type): Promise<Item> => {
        // append a '-1' onto the end of the id, since that's how BrickLink stores their data
        if (type === Type.SET && !id.match(".*-\\d+")) {
            id += "-1";
        }

        try {
            const bricklinkData: BricklinkItemResponse =
              await get<BricklinkItemResponse>(`${baseUrl}/items/${type}/${id}`);
            const item = bricklinkData.data;
            return {
              setId: item.no,
              name: htmlDecode(item.name),
              type: item.type,
              imageUrl: item.image_url,
              thumbnailUrl: item.thumbnail_url,
              yearReleased: item.year_released
            } as Item;
        } catch (error) {
            throw error;
        }
    };

    const getAllSalesHistory = async (item: Item): Promise<AllSalesHistory> => {
        let allSalesHistory: AllSalesHistory = {};
        if (item.setId) {
            await Promise.all([
                getSalesHistory(item.setId, item.type, "sold", "U"),
                getSalesHistory(item.setId, item.type, "stock", "U"),
                getSalesHistory(item.setId, item.type, "sold", "N"),
                getSalesHistory(item.setId, item.type, "stock", "N")
            ]).then(responses => {
                responses.map((response) => {
                    return filterOutOldDates(response);
                });
                allSalesHistory.usedSold = validateSalesData(responses[0]);
                allSalesHistory.usedStock = validateSalesData(responses[1]);
                allSalesHistory.newSold = validateSalesData(responses[2]);
                allSalesHistory.newStock = validateSalesData(responses[3]);
            });
        }
        return allSalesHistory;
    };

    /**
     * Request function that gets the Category information from BrickLink
     * @param id the ID of the set to get sales history from
     * @param itemType the type of the item to get (set, minifig, bulk, or other)
     * @param type the type of sales to get ("sold" or "stock")
     * @param state the condition to search on ("U" for used, "N" for new)
     * @returns a SalesHistory object
     */
    const getSalesHistory = async (id: string, itemType: Type, type: 'sold' | 'stock', state: 'U' | 'N'): Promise<SalesHistory> => {
        return (
          await get<SalesHistoryResponse>(
            `${baseUrl}/items/${itemType}/${id}/price?guide_type=${type}&new_or_used=${state}`
          )).data;
    };

    /**
     * Helper function that looks at all data on the SalesHistory object and checks if we can just set it to undefined
     * @param salesHistory the SalesHistory to check
     * @returns the SalesHistory object if there's valid data, or undefined if there's no valid data
     */
    const validateSalesData = (salesHistory: SalesHistory): SalesHistory | undefined => {
        if (salesHistory.min_price === "0.0000" &&
            salesHistory.max_price === "0.0000" &&
            salesHistory.avg_price === "0.0000" &&
            salesHistory.qty_avg_price === "0.0000" &&
            salesHistory.unit_quantity === 0 &&
            salesHistory.total_quantity === 0 &&
            salesHistory.price_detail.length === 0) {
            return undefined;
        }
        return salesHistory;
    };

    return { getBricklinkData, getAllSalesHistory };
};

