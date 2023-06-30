import {Type} from "../model/shared/Type";
import {Item} from "../model/item/Item";
import {Category} from "../model/category/Category";
import {SalesStatus} from "../model/salesStatus/SalesStatus";
import {AllSalesHistory} from "../model/salesHistory/AllSalesHistory";
import {htmlDecode} from "../utils/StringUtils";
import {useBrickEconomyService} from "./useBrickEconomyService";
import {useBrickLinkService} from "./useBrickLinkService";
import {Condition} from "../model/shared/Condition";
import {formatCurrency} from "../utils/CurrencyUtils";
import {Source} from "../model/shared/Source";

export interface ItemLookupServiceHooks {
    getHydratedItem: (id: string) => Promise<Item>;
}

export const useItemLookupService = (): ItemLookupServiceHooks => {

    const { getItem, getCategory, getAllSalesHistory } = useBrickLinkService();
    const { getSaleStatus } = useBrickEconomyService();

    const getHydratedItem = async (id: string): Promise<Item> => {

        const type: Type = determineType(id);
        try {
            // get the main item data
            // also acts as the error checking, if this fails, that means the set probably doesn't exist
            const item: Item = await getItem(id, type);

            // then grab the category, salesStatus, and sales history
            if (item.category_id && item.no) {
                await Promise.all(
                    [
                        getCategory(item.category_id),
                        getSaleStatus(item.no),
                        getAllSalesHistory(item)
                    ]
                ).then(itemHydrationData => {
                    const category: Category = itemHydrationData[0];
                    const salesStatus: SalesStatus = itemHydrationData[1];
                    const allSalesHistory: AllSalesHistory = itemHydrationData[2];

                    item.category_name = category.category_name;
                    item.salesStatus = salesStatus;
                    item.usedSold = allSalesHistory.usedSold;
                    item.usedStock = allSalesHistory.usedStock;
                    item.newSold = allSalesHistory.newSold;
                    item.newStock = allSalesHistory.newStock;

                    // by default, set the condition to used and use the average sold value for the value attribute
                    item.condition = Condition.USED;
                    item.value = item.usedSold?.avg_price ?
                        +item.usedSold.avg_price * +process.env.REACT_APP_AUTO_ADJUST_VALUE_USED! : 0;
                    item.valueDisplay = formatCurrency(item.value)!.toString().substring(1);
                    item.baseValue = item.value;
                    item.valueAdjustment = 0;
                    item.source = Source.BRICKLINK;
                    item.type = type;

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

    return { getHydratedItem };
};