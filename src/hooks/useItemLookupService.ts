import {Type} from "../model/_shared/Type";
import {Item} from "../model/item/Item";
import {Category} from "../model/category/Category";
import {RetailStatus} from "../model/retailStatus/RetailStatus";
import {AllSalesHistory} from "../model/salesHistory/AllSalesHistory";
import {htmlDecode} from "../utils/StringUtils";
import {useBrickEconomyService} from "./useBrickEconomyService";
import {useBrickLinkService} from "./useBrickLinkService";
import {Condition} from "../model/_shared/Condition";
import {formatCurrency} from "../utils/CurrencyUtils";
import {Source} from "../model/_shared/Source";

export interface ItemLookupServiceHooks {
    getHydratedItem: (item: Item) => Promise<Item>;
    getItemMatches: (id: string) => Promise<Item[]>;
}

export const useItemLookupService = (): ItemLookupServiceHooks => {

    const { getItem, getCategory, getAllSalesHistory } = useBrickLinkService();
    const { getRetailStatus } = useBrickEconomyService();

    const getItemMatches = async (id: string): Promise<Item[]> => {
        try {
            // get the first item with the id
            // also acts as an error checker for bad ids given
            const item: Item = await getItem(id, determineType(id));

            // check to see if there are other sets by appending sequential numbers
            const items: Item[] = [item];
            let matchesFound: boolean = true;
            let index: number = 2;
            while (matchesFound) {
                try {
                    const setNumber: string = item.no!.split("-")[0] + "-" + index;
                    const matchedItem = await getItem(setNumber, determineType(setNumber));
                    if (matchedItem) {
                        items.push(matchedItem);
                        index++;
                    }
                } catch (error) {
                    matchesFound = false;
                }
            }
            return items;
        } catch (error) {
            // error handler for the first search, throws the error for the UI to catch (no items found with that id)
            console.log(error);
            throw error;
        }
    };

    const getHydratedItem = async (item: Item): Promise<Item> => {
        try {
            // grab the category, retailStatus, and sales history from the given item
            if (item.category_id && item.no) {
                await Promise.all(
                    [
                        getCategory(item.category_id),
                        getRetailStatus(item.no),
                        getAllSalesHistory(item)
                    ]
                ).then(itemHydrationData => {
                    const category: Category = itemHydrationData[0];
                    const retailStatus: RetailStatus = itemHydrationData[1];
                    const allSalesHistory: AllSalesHistory = itemHydrationData[2];

                    item.category_name = category.category_name;
                    item.retailStatus = retailStatus;
                    item.usedSold = allSalesHistory.usedSold;
                    item.usedStock = allSalesHistory.usedStock;
                    item.newSold = allSalesHistory.newSold;
                    item.newStock = allSalesHistory.newStock;

                    // by default, set the condition to used and use the average sold value for the value attribute
                    item.condition = Condition.USED;
                    item.baseValue = item.usedSold?.avg_price ? +item.usedSold.avg_price : 0;
                    item.value = item.usedSold?.avg_price ?
                        +item.usedSold.avg_price * +process.env.REACT_APP_AUTO_ADJUST_VALUE_USED! : 0;
                    item.valueDisplay = formatCurrency(item.value)!.toString().substring(1);
                    item.valueAdjustment = +process.env.REACT_APP_AUTO_ADJUST_VALUE_USED! * 100;
                    item.source = Source.BRICKLINK;
                    item.type = determineType(item.no ?? '');

                    // remove the "-1" for display purposes
                    if (new RegExp(".+-\\d").test(item.no ?? '')) {
                        item.no = item.no?.substring(0, item.no?.length - 2);
                    }
                });
            }

            // html decode the item name since that's html encoded
            item.name = htmlDecode(item.name);

            // return the hydrated item
            return item;
        } catch (error) {
            console.log(error);
            throw error;
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