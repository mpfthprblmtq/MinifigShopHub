import {Item} from "../model/item/Item";
import _ from "lodash";

export const generateId = (items: Item[]): number => {
    if (items.length === 0) {
        return 0;
    }
    return Math.max(...items.map(i => i.id)) + 1;
};

export const getItemWithId = (items: Item[], id: number): Item | undefined => {
    return items.filter(item => item.id === id)[0];
}

export const retainOriginalOrder = (originalIds: string[], resultMap: Map<string, any[]>): {id: string, results: Item[]}[] => {
    // we have to use clonedeep here because this will map the same object in memory to the same id, making it
    // impossible to make updates to a single item in the list
    return originalIds.map(id => ({ id, results: _.cloneDeep(resultMap.get(id)) || [] }));
};
