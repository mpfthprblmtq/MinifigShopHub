import { Type } from "../model/_shared/Type";
import { Item } from "../model/item/Item";
import { AllSalesHistory } from "../model/salesHistory/AllSalesHistory";
import { htmlDecode } from "../utils/StringUtils";
import { useBrickLinkService } from "./useBrickLinkService";
import { Condition } from "../model/_shared/Condition";
import { formatCurrency } from "../utils/CurrencyUtils";
import { Source } from "../model/_shared/Source";
import { useSelector } from "react-redux";
import { useBricksetService } from "./useBricksetService";
import { useBrickEconomyService } from "./useBrickEconomyService";
import { useCacheService } from "./cache/useCacheService";

export interface ItemLookupServiceHooks {
    getHydratedItem: (item: Item) => Promise<Item>;
    getItemMatches: (id: string) => Promise<Item[]>;
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
            try {
                // get the first item with the id
                // also acts as an error checker for bad ids given
                const item: Item = await getBricklinkData(id, determineType(id));

                // check to see if there are other sets by appending sequential numbers
                const items: Item[] = [item];
                let matchesFound: boolean = true;
                let index: number = 2;
                while (matchesFound) {
                    try {
                        const setNumber: string = item.setId!.split("-")[0] + "-" + index;
                        const matchedItem = await getBricklinkData(setNumber, determineType(setNumber));
                        if (matchedItem) {
                            items.push(matchedItem);
                            index++;
                        }
                    } catch (error) {
                        matchesFound = false;
                    }
                }
                setCacheItem(`getItemMatches-${id}`, items);
                return items;
            } catch (error) {
                // error handler for the first search, throws the error for the UI to catch (no items found with that id)
                console.error(error);
                throw error;
            }
        }
    };

    const getHydratedItem = async (item: Item): Promise<Item> => {
        // try to get the cached data if it exists
        const cacheItem: Item = getCacheItem(`getHydratedItem-${item.setId}`);
        if (cacheItem) {
            if (new RegExp(".+-\\d").test(cacheItem.setId ?? '')) {
                cacheItem.setId = cacheItem.setId?.substring(0, cacheItem.setId?.length - 2);
            }
            return new Promise<Item>(resolve => resolve(cacheItem));
        } else {
            try {
                // grab the category, retailStatus, and sales history from the given item
                if (item.setId) {
                    await Promise.all(
                      [
                          getBricksetData(item),
                          getAllSalesHistory(item)
                      ]
                    ).then(async itemHydrationData => {
                        item = {
                            ...item,
                            ...itemHydrationData[0] as Item,
                            salesData: itemHydrationData[1] as AllSalesHistory,
                            sources: []
                        };

                        // fallback on BrickEconomy if the RetailStatus is blank, since Brickset might not have it
                        if (!item.retailStatus?.retailPrice && !item.retailStatus?.availability) {
                            if (item.setId) {
                                item.retailStatus = await getRetailStatus(item.setId);
                                item.sources.push(Source.BRICKECONOMY);
                            }
                        }

                        // fallback on BrickEconomy if the pieceCount or minifigCount is undefined, since Brickset might not have it
                        if (!item.pieceCount || !item.minifigCount) {
                            if (item.setId) {
                                const pieceAndMinifigCounts: number[] = await getPieceAndMinifigCount(item.setId);
                                if (pieceAndMinifigCounts.length === 1) {
                                    item.pieceCount = pieceAndMinifigCounts[0] === 0 ? undefined : pieceAndMinifigCounts[0];
                                } else if (pieceAndMinifigCounts.length === 2) {
                                    item.pieceCount = pieceAndMinifigCounts[0] === 0 ? undefined : pieceAndMinifigCounts[0];
                                    item.minifigCount = pieceAndMinifigCounts[1] === 0 ? undefined : pieceAndMinifigCounts[1];
                                }
                                item.sources.push(Source.BRICKECONOMY);
                            }
                        }

                        // by default, set the condition to used and use the average sold value for the value attribute
                        item.condition = Condition.USED;
                        item.baseValue = item.salesData?.usedSold?.avg_price ? +item.salesData.usedSold.avg_price : 0;
                        item.value = item.salesData?.usedSold?.avg_price ?
                          Math.round(+item.salesData.usedSold.avg_price * (configuration.autoAdjustmentPercentageUsed / 100)) : 0;
                        item.value = +item.value.toFixed(2);
                        item.valueDisplay = formatCurrency(item.value)!.toString().substring(1);
                        item.valueAdjustment = configuration.autoAdjustmentPercentageUsed;
                        item.sources.push(...[Source.BRICKLINK, Source.BRICKSET]);
                        item.type = determineType(item.setId ?? '');

                        // set the item in cache
                        setCacheItem(`getHydratedItem-${item.setId}`, item);

                        // remove the "-1" for display purposes
                        if (new RegExp(".+-\\d").test(item.setId ?? '')) {
                            item.setId = item.setId?.substring(0, item.setId?.length - 2);
                        }
                    });
                }

                // html decode the item name since that's html encoded
                item.name = htmlDecode(item.name);

                // return the hydrated item
                return item;
            } catch (error) {
                console.error(error);
                throw error;
            }
        }
    }

    const determineType = (id: string): Type => {
        if (new RegExp("[a-zA-Z]+\\d+").test(id)) {
            return Type.MINIFIG;
        }
        return Type.SET;
    };

    return { getHydratedItem, getItemMatches };
};