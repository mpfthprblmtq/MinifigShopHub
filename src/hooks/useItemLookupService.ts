import { Item } from "../model/item/Item";
import { Type } from "../model/_shared/Type";
import { useSelector } from "react-redux";
import { useCacheService } from "./cache/useCacheService";
import { useBackendService } from "./useBackendService";
import { Condition } from "../model/_shared/Condition";
import { ItemResponse } from "../model/item/ItemResponse";

export interface ItemLookupServiceHooks {
  searchItem: (id: string) => Promise<Item[]>;
  determineType: (id: string) => Type;
}

export const useItemLookupService = (): ItemLookupServiceHooks => {

  const {configuration} = useSelector((state: any) => state.configurationStore);
  const { getItem } = useBackendService();
  const { getCacheItem, setCacheItem } = useCacheService();

  const searchItem = async (id: string): Promise<Item[]> => {
    // try to get the cached data if it exists
    const cacheItem = getCachedItem(id);
    if (cacheItem) {
      return cacheItem;
    }

    // item doesn't exist in cache, let's get it from the API
    const type: Type = determineType(id);
    try {
      const response: ItemResponse = await getItem(id, type);
      const results: Item[] = response.items;
      if (results.length === 1) {
        results[0] = populateItem(results[0]);
        setCacheItem(`getItem-${id}`, [results[0]]);
      }
      return results;
    } catch (error) {
      throw error;
    }
  }

  const getCachedItem = (id: string): Promise<Item[]> | undefined => {
    const cacheItem = getCacheItem(`getItem-${id}`);
    if (cacheItem) {
      return new Promise<Item[]>(resolve => resolve(cacheItem));
    }
    return undefined;
  }

  const populateItem = (item: Item): Item => {
    // by default, set the condition to used, base value to BL sales data, value, adjustment and type
    item.condition = Condition.USED;
    item.baseValue = +(item.salesHistory?.usedSales?.averagePrice ?? 0);
    item.value = Math.round(item.baseValue * (configuration.autoAdjustmentPercentageUsed / 100));
    item.valueAdjustment = item.baseValue !== 0 ? configuration.autoAdjustmentPercentageUsed : 0;
    item.type = determineType(item.setId ?? '');
    if (!item.sources) {
      item.sources = [];
    }

    // TODO find out if I need this still
    // remove the "-1" for display purposes if we should
    if (new RegExp("\\D+.*-\\d+").test(item.setId ?? '')) {
      // don't do anything
    } else if (new RegExp(".+-\\d+").test(item.setId ?? '')) {
      item.setId = item.setId?.split("-")[0];
    }

    return item;
  }

  const determineType = (id: string): Type => {
    // special case for collectable figures, which can look like "col12-12" and similar
    if (new RegExp("col\\d+-\\d+").test(id)) {
      return Type.SET;
    } else if (new RegExp("col.+").test(id)) {
      return Type.MINIFIG;
    } else if (new RegExp("[a-zA-Z]+\\d+").test(id)) {
      return Type.MINIFIG;
    }
    return Type.SET;
  };

  return { searchItem, determineType };
};