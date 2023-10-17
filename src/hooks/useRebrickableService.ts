import { PartsResponse } from "../model/partCollector/PartsResponse";
import axios from "axios";
import { Part } from "../model/partCollector/Part";
import { PartResult } from "../model/partCollector/PartResult";
import { Color } from "../model/partCollector/Color";

const baseUrl: string = 'https://rebrickable.com/api/v3';

export interface RebrickableServiceHooks {
  getPartsList: (id: string) => Promise<Part[]>;
}

export const useRebrickableService = (): RebrickableServiceHooks => {

  // create our Rebrickable Axios instance
  const rebrickableAxiosInstance = axios.create({
    baseURL: `${baseUrl}`,
    timeout: 5000,
    headers: {}
  });

  const getPartsList = async (id: string): Promise<Part[]> => {
    let partResults: PartResult[] = [];
    try {
      const partsResponse = await get(buildRequestUrl(id));
      partResults = partsResponse.results;

      // check to see if there are more calls to make
      if (partsResponse.next) {
        const subsequentCalls: string[] = [];
        const totalCalls = Math.ceil(partsResponse.count / 100) - 1;
        for (let i = 1; i <= totalCalls; i++) {
          subsequentCalls.push(buildRequestUrl(id) + '&page=' + (i + 1))
        }

        // make all subsequent requests 5 at a time
        await Promise.all(
          subsequentCalls
            .splice(0, 5)
            .map(url => get(url))
            .map(p => p.catch(e => e))
        ).then(responses => {
            responses.forEach(response => {
              partResults = [...partResults, ...response.results];
            })
        });
      }
      // we have all the part results, transform into the usable versions
      return transformParts(partResults, id);
    } catch (error) {
      throw error;
    }
  }

  const transformParts = (partResults: PartResult[], set: string): Part[] => {
    return partResults.map((partResult, index) => {
      return {
        id: index,
        bricklinkId: partResult.part.external_ids.BrickLink[0],
        name: partResult.part.name,
        imageUrl: partResult.part.part_img_url,
        quantity: partResult.quantity,
        isSpare: partResult.is_spare,
        inOtherSets: partResult.num_sets,
        color: {
          id: partResult.color.external_ids.BrickLink.ext_ids[0],
          description: partResult.color.external_ids.BrickLink.ext_descrs[0][0],
          rgb: partResult.color.rgb,
          translucent: partResult.color.is_trans
        } as Color,
        set: set
      } as Part;
    });
  };

  const get = async (url: string): Promise<PartsResponse> => {
    return (await rebrickableAxiosInstance.get<PartsResponse>(url, {})).data;
  }

  const buildRequestUrl = (id: string): string => {
    return `${baseUrl}/lego/sets/${id}/parts/?key=${process.env.REACT_APP_REBRICKABLE_API_KEY}&page_size=100`;
  }

  return { getPartsList };
};