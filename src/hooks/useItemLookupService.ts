import { Type } from "../model/_shared/Type";
import { Item } from "../model/item/Item";
import { useBrickLinkService } from "./useBrickLinkService";
import { useSelector } from "react-redux";
import { useBricksetService } from "./useBricksetService";
import { useBrickEconomyService } from "./useBrickEconomyService";
import { useCacheService } from "./cache/useCacheService";
import { AxiosError, HttpStatusCode } from "axios";
import { AllSalesHistory } from "../model/salesHistory/AllSalesHistory";
import { Source } from "../model/_shared/Source";
import { Condition } from "../model/_shared/Condition";
import { Availability } from "../model/retailStatus/Availability";
import { formatCurrency } from "../utils/CurrencyUtils";

export interface ItemLookupServiceHooks {
    getHydratedItem: (item: Item) => Promise<Item>;
    getItemMatches: (id: string) => Promise<Item[]>;
    determineType: (id: string) => Type;
}

export const useItemLookupService = (): ItemLookupServiceHooks => {

    const {configuration} = useSelector((state: any) => state.configurationStore);

    const { getBricklinkData, getAllSalesHistory } = useBrickLinkService();
    const { getBricksetData } = useBricksetService();
    const { getRetailStatus, getPieceAndMinifigCount } = useBrickEconomyService();
    const { getCacheItem, setCacheItem } = useCacheService();

    const getItemMatches = async (id: string): Promise<Item[]> => {
        // try to get the cached data if it exists
        const cacheItem = getCacheItem(`getItemMatches-${id}`);
        if (cacheItem) {
            return new Promise<Item[]>(resolve => resolve(cacheItem));
        } else {
            const type: Type = determineType(id);
            const promises = [
              getBricklinkData(id, type)
            ];
            // if the id passed in doesn't match 1234-1, then search for more
            // else just return that one they're searching for
            if (!new RegExp(".+-\\d").test(id)) {
                // if it's a set, then make another call to get the -2 variant
                if (type === Type.SET) {
                    promises.push(...[getBricklinkData(`${id}-2`, type)]);
                }
            }
            // get the results
            const results = await Promise.allSettled(promises);
            if (results.length === 1) {
                // we only want the one search, so return that item or error handle accordingly
                if (results[0].status === 'fulfilled') {
                    setCacheItem(`getItemMatches-${id}`, [results[0].value]);
                    return [results[0].value];
                } else {
                    handleError(results[0].reason);
                }
            } else {
                if (results[0].status === 'fulfilled' && results[1].status === 'rejected'
                  && results[1].reason instanceof AxiosError
                  && results[1].reason.code === HttpStatusCode.NotFound.toString()) {
                    // first result went through, and second failed on 404, which means we have a match on the first
                    // one, and there's no duplicates
                    setCacheItem(`getItemMatches-${id}`, [results[0].value]);
                    return [results[0].value];
                } else if (results[0].status === 'rejected') {
                    // both calls failed, so handle the error on the first one, since they both probably failed for the same reason
                    handleError(results[0].reason);
                } else if (results[0].status === 'fulfilled' && results[1].status === 'fulfilled') {
                    // both calls succeeded, which means that there are multiple matches, let's find more
                    const items: Item[] = [results[0].value, results[1].value];
                    let index: number = 3;  // start at 3 since we already have 2 results
                    let matchesFound: boolean = true;   // flag to determine whether to continue or not
                    while (matchesFound) {
                        try {
                            const nextId: string = items[0].setId!.split("-")[0] + "-" + index;
                            const matchedItem: Item = await getBricklinkData(nextId, type);
                            items.push(matchedItem);
                            index++;
                        } catch (error: AxiosError | any) {
                            matchesFound = false;
                        }
                    }
                    setCacheItem(`getItemMatches-${id}`, items);
                    return items;
                }
            }
            throw new Error('Unknown error occurred!');
        }
    };

    const getHydratedItem = async (item: Item): Promise<Item> => {
        // try to get the cached data if it exists
        const cacheItem: Item = getCacheItem(`getHydratedItem-${item.setId}`);
        if (cacheItem) {
            // remove the "-1" for display purposes if we should
            if (new RegExp("\\D+.*-\\d+").test(cacheItem.setId ?? '')) {
                // don't do anything
            } else if (new RegExp(".+-\\d+").test(cacheItem.setId ?? '')) {
                cacheItem.setId = cacheItem.setId?.split("-")[0];
            }
            return new Promise<Item>(resolve => resolve(cacheItem));
        } else {
            // grab the category, retailStatus, and sales history from the given item
            if (item.setId) {
                const promises = [
                    getAllSalesHistory(item),
                    getBricksetData(item)
                ];
                const results = await Promise.allSettled(promises);

                if (results[0].status === 'fulfilled' && results[1].status === 'fulfilled') {
                    // both sales history and brickset calls succeeded
                    const salesHistory: AllSalesHistory = results[0].value as AllSalesHistory;
                    const bricksetData: Item = results[1].value as Item;
                    const messages: string[] = bricksetData ? [] : [`Brickset data unavailable for ${item.setId}!`];
                    item = {...item, salesData: salesHistory, ...bricksetData, messages: messages};
                } else if (results[0].status === 'fulfilled' && results[1].status === 'rejected') {
                    // sales history succeeded, brickset failed
                    const salesHistory: AllSalesHistory = results[0].value as AllSalesHistory;
                    item = {...item, salesData: salesHistory, messages: [`Brickset data unavailable for ${item.setId}!`]};
                } else {
                    // both sales history and brickset calls failed
                    item = {...item, messages: [`Sales data unavailable for ${item.setId}!`, `Brickset data unavailable for ${item.setId}!`]};
                }
                await populateItemData(item);
            }

            // return the hydrated item
            return item;
        }
    }

    const populateItemData = async (item: Item) => {
        // fallback on BrickEconomy if the RetailStatus is blank, since Brickset might not have it
        if (!item.retailStatus?.retailPrice && !item.retailStatus?.availability) {
            if (item.setId) {
                try {
                    item.retailStatus = await getRetailStatus(item.setId);
                    if (item.retailStatus.retailPrice && item.retailStatus.availability) {
                        item.sources.push(Source.BRICKECONOMY);
                    } else {
                        addBrickEconomyMessage(item);
                    }
                } catch (e: any) {
                    addBrickEconomyMessage(item);
                }
            }
        }

        // fallback on BrickEconomy if the pieceCount or minifigCount is undefined,
        // since Brickset might not have it
        if (!item.pieceCount || !item.minifigCount) {
            if (item.setId) {
                try {
                    const pieceAndMinifigCounts: number[] = await getPieceAndMinifigCount(item.setId);
                    if (pieceAndMinifigCounts.length > 0) {
                        if (pieceAndMinifigCounts.length === 1) {
                            item.pieceCount = pieceAndMinifigCounts[0] === 0 ? undefined : pieceAndMinifigCounts[0];
                        } else if (pieceAndMinifigCounts.length === 2) {
                            item.pieceCount = pieceAndMinifigCounts[0] === 0 ? undefined : pieceAndMinifigCounts[0];
                            item.minifigCount = pieceAndMinifigCounts[1] === 0 ? undefined : pieceAndMinifigCounts[1];
                        } else {
                            addBrickEconomyMessage(item);
                        }
                        if (!item.sources.includes(Source.BRICKECONOMY)) {
                            item.sources.push(Source.BRICKECONOMY);
                        }
                    }
                } catch (e: any) {
                    addBrickEconomyMessage(item);
                }
            }
        }

        // by default, set the condition to used
        item.condition = Condition.USED;

        // if the item is available at retail, set the value to reflect MSRP, not sales data
        // set the base value using the same logic as well
        if (item.retailStatus?.availability === Availability.RETAIL) {
            item.value = item.retailStatus.retailPrice ?
              item.retailStatus.retailPrice * (configuration.autoAdjustmentPercentageUsed / 100) : 0;
            item.baseValue = item.retailStatus.retailPrice ?? 0;
        } else {
            item.value = item.salesData?.usedSold?.avg_price ?
              Math.round(+item.salesData.usedSold.avg_price * (configuration.autoAdjustmentPercentageUsed / 100)) : 0;
            item.baseValue = item.salesData?.usedSold?.avg_price ? +item.salesData.usedSold.avg_price : 0;
        }
        item.value = +item.value.toFixed(2);
        item.valueDisplay = formatCurrency(item.value)!.toString().substring(1);
        item.valueAdjustment = configuration.autoAdjustmentPercentageUsed;
        item.type = determineType(item.setId ?? '');

        // set the item in cache
        setCacheItem(`getHydratedItem-${item.setId}`, item);

        // remove the "-1" for display purposes if we should
        if (new RegExp("\\D+.*-\\d+").test(item.setId ?? '')) {
            // don't do anything
        } else if (new RegExp(".+-\\d+").test(item.setId ?? '')) {
            item.setId = item.setId?.split("-")[0];
        }
    }

    const addBrickEconomyMessage = (item: Item) => {
        if (item.messages && item.messages.filter(message => message.startsWith('BrickEconomy')).length === 0) {
            item.messages = [...item.messages, `BrickEconomy data unavailable for ${item.setId}!`]
        }
    }

    const determineType = (id: string): Type => {
        // special case for collectable figures, which can look like "col12-12" and similar
        if (new RegExp("col.+").test(id)) {
            return Type.SET;
        }
        if (new RegExp("[a-zA-Z]+\\d+").test(id)) {
            return Type.MINIFIG;
        }
        return Type.SET;
    };

    const handleError = (error: AxiosError) => {
        if (error instanceof AxiosError && error.code === AxiosError.ECONNABORTED) {
            // timeout error
            throw new AxiosError(error.message, '408');
        } else if (error instanceof AxiosError && error.code === AxiosError.ERR_NETWORK) {
            // no network connection
            throw new AxiosError('No network connection detected!', HttpStatusCode.BadRequest.toString());
        } else if (error instanceof AxiosError && error.code === HttpStatusCode.NotFound.toString()) {
            // item not found, throw up to catching service
            throw error;
        } else {
            // unknown error, throw up to catching service
            throw error;
        }
    }

    return { getHydratedItem, getItemMatches, determineType };
};