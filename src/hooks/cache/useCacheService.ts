import { CacheItem } from "../../model/cache/CacheItem";

export interface CacheHooks {
  getCacheItem: (key: string) => any;
  setCacheItem: (key: string, data: any) => void;
}

export const useCacheService = (): CacheHooks => {

  const CACHE_DURATION: number = 86400000;  // 24 hours in ms (24*60*60*1000)

  const getCacheItem = (key: string): any => {
    const cacheData = window.sessionStorage.getItem(key);

    if (cacheData === null) {
      return undefined;
    }

    const cacheItem: CacheItem = JSON.parse(cacheData);
    const currentTimestamp = Date.now();
    if (currentTimestamp - CACHE_DURATION > cacheItem.timestamp) {
      return undefined;
    } else {
      return cacheItem.data;
    }
  }

  const setCacheItem = (key: string, data: any) => {
    window.sessionStorage.setItem(key, JSON.stringify({timestamp: Date.now(), data: data} as CacheItem));
  }

  return { getCacheItem, setCacheItem };
};