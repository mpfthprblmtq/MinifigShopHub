import { CacheItem } from "../../model/cache/CacheItem";

export interface CacheHooks {
  getCacheItem: (key: string) => any;
  setCacheItem: (key: string, data: any) => void;
  clearCache: () => void;
  getCacheItemCount: () => number;
}

export const useCacheService = (): CacheHooks => {

  const CACHE_DURATION: number = 86400000;  // 24 hours in ms (24*60*60*1000)
  const cacheEnabled: boolean = true;

  const getCacheItem = (key: string): any => {
    if (!cacheEnabled) {
      return undefined;
    }

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
  };

  const setCacheItem = (key: string, data: any) => {
    if (cacheEnabled) {
      window.sessionStorage.setItem(key, JSON.stringify({timestamp: Date.now(), data: data} as CacheItem));
    }
  };

  const clearCache = () => {
    window.sessionStorage.clear();
  };

  const getCacheItemCount = (): number => {
    return window.sessionStorage.length;
  }

  return { getCacheItem, setCacheItem, clearCache, getCacheItemCount };
};