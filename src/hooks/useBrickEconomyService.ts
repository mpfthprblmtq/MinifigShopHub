import {RetailStatus} from "../model/retailStatus/RetailStatus";
import axios from "axios";
import * as cheerio from 'cheerio';
import {Availability} from "../model/retailStatus/Availability";
import {launderMoney} from "../utils/CurrencyUtils";
import { toNumber } from "lodash";

const corsProxyUrl: string = 'https://proxy.cors.sh/';
const baseUrl: string = 'https://www.brickeconomy.com/search?query=';

export interface BrickEconomyHooks {
  getRetailStatus: (id: string) => Promise<RetailStatus>;
  getPieceAndMinifigCount: (id: string) => Promise<number[]>;
  getBrickEconomyValue: (id: string) => Promise<number>;
}

export const useBrickEconomyService = (): BrickEconomyHooks => {

  // create our BrickEconomy Axios instance
  const brickEconomyAxiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 10000,
    headers: {
      "x-cors-api-key": "live_6aba39ccdee8ed8b73605d0e20a44856036a469b78fd9fdbb2a0399951e920a1"
    }
  });

  const getRetailStatus = async (id: string): Promise<RetailStatus> => {
    const retailStatus: RetailStatus = {};
    try {
      const { data: pageSource } = await brickEconomyAxiosInstance.get(`${corsProxyUrl}${baseUrl}${id}`);
      await Promise.all([getAvailability(pageSource), getMSRP(pageSource)])
        .then((results) => {
          if (results[0]) {
            retailStatus.availability =
              results[0] === Availability.RETIRED ? Availability.RETIRED : Availability.RETAIL;
          }
          if (results[1]) {
            retailStatus.retailPrice = launderMoney(results[1]);
          }
        });

    } catch (error) {
      throw error;
    }
    return retailStatus;
  };

  const getPieceAndMinifigCount = async (id: string): Promise<number[]> => {
    const results: number[] = [];
    try {
      const { data: pageSource } = await brickEconomyAxiosInstance.get(`${corsProxyUrl}${baseUrl}${id}`);
      await getPieceAndMinifigString(pageSource)
        .then((result) => {
          if (new RegExp('.*\\s/\\s.*').test(result)) {
            const arr = result.split(' / ');
            results.push(launderMoney(arr[0]));
            results.push(launderMoney(arr[1]));
          } else if (new RegExp('\\d+').test(result)) {
            results.push(launderMoney(result));
          }
        });

    } catch (error) {
      console.error(error);
    }
    return results;
  }

  const getAvailability = async (pageSource: string): Promise<string> => {
    const $ = cheerio.load(pageSource);
    const availabilityElements = $('div.mb-2').filter((_, element) => {
      return $(element).text().toLowerCase().includes("availability");
    });
    // using >= 2 because if there's 2 elements, then there's only one result
    // if there's more than 2 elements, that means there's multiple matches, and we want to use the first one
    if (availabilityElements.length >= 2) {
      const availabilityElement: any = availabilityElements[1];
      const availabilityValue: any = availabilityElement.children[1];
      return availabilityValue.data.toString().trim();
    }
    return '';
  };

  const getMSRP = async (pageSource: string): Promise<string> => {
    const $ = cheerio.load(pageSource);
    const msrpElements = $('small.mr-5').filter((_, element) => {
      return $(element).text().toLowerCase().includes("retail");
    });
    // using >= 2 because if there's 2 elements, then there's only one result
    // if there's more than 2 elements, that means there's multiple matches, and we want to use the first one anyway
    if (msrpElements.length >= 2) {
      const retailElement: any = msrpElements[0];
      return retailElement.next.data.toString().trim();
    }
    return '';
  };

  const getBrickEconomyValue = async (id: string): Promise<number> => {
    let value: number = 0;
    try {
      const { data: pageSource } = await brickEconomyAxiosInstance.get(`${corsProxyUrl}${baseUrl}${id}`);
      await getValue(pageSource).then((result) => {
        value = toNumber(result.replace('$', '').replace(',', ''));
      });
    } catch (error) {
      console.error(error);
    }
    return value;
  }

  const getValue = async (pageSource: string): Promise<string> => {
    const $ = cheerio.load(pageSource);
    const valueElements = $('small.mr-5').filter((_, element) => {
      return $(element).text().toLowerCase().includes("value");
    });
    // using >= 2 because if there's 2 elements, then there's only one result
    // if there's more than 2 elements, that means there's multiple matches, and we want to use the first one anyway
    if (valueElements.length >= 2) {
      const valueElement: any = valueElements[1];
      return valueElement.next.next.children[0].data.toString().trim();
    }
    return '';
  }

  const getPieceAndMinifigString = async (pageSource: string): Promise<string> => {
    const $ = cheerio.load(pageSource);
    const $mb2Div = $('div.mb-2');
    let piecesMinifigsElements = $mb2Div.filter((_, element) => {
      return $(element).text().toLowerCase().includes("pieces / minifigs");
    });
    if (piecesMinifigsElements.length === 0) {
      // if there's no piecesMinifigElements, then that means that the set might not have minifigs
      // so, we need to search for just "pieces"
      piecesMinifigsElements = $mb2Div.filter((_, element) => {
        return $(element).text().toLowerCase().includes("pieces");
      });
    }
    if (piecesMinifigsElements.length >= 1) {
      const value: any = piecesMinifigsElements[0].children[1];
      return value.data.toString().trim();
    }
    return '';
  }

  return { getRetailStatus, getPieceAndMinifigCount, getBrickEconomyValue };
}