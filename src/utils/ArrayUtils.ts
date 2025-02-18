import {Item} from "../model/item/Item";

export const generateId = (items: Item[]): number => {
    if (items.length === 0) {
        return 0;
    }
    return Math.max(...items.map(i => i.id)) + 1;
};

export const getItemWithId = (items: Item[], id: number): Item | undefined => {
    return items.filter(item => item.id === id)[0];
}

export const retainOriginalOrder = (originalIds: string[], resultMap: Map<string, any[]>) => {
    return originalIds.map(id => ({ id, results: resultMap.get(id) || [] }));
};
