import {RetailStatus} from "../model/retailStatus/RetailStatus";
import axios from "axios";
import * as cheerio from 'cheerio';
import {Availability} from "../model/retailStatus/Availability";
import {launderMoney} from "../utils/CurrencyUtils";

const corsProxyUrl: string = 'https://corsproxy.io/?';
const baseUrl: string = 'https://www.brickeconomy.com/search?query=';

export interface BrickEconomyHooks {
  getRetailStatus: (id: string) => Promise<RetailStatus>;
}

export const useBrickEconomyService = (): BrickEconomyHooks => {

  // create our BrickEconomy Axios instance
  const brickEconomyAxiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
    headers: {}
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
      console.error(error);
    }
    return retailStatus;

  };

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

  return { getRetailStatus };
}