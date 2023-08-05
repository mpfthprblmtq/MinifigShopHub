import {Item} from "../../model/item/Item";
import {ChangeType} from "../../model/priceCalculation/ChangeType";
import {Condition} from "../../model/_shared/Condition";
import {Availability} from "../../model/retailStatus/Availability";
import {formatCurrency} from "../../utils/CurrencyUtils";
import {Source} from "../../model/_shared/Source";
import {useSelector} from "react-redux";

export interface PriceCalculationHooks {
    calculatePrice: (item: Item, changeType: ChangeType) => void;
    roundAdjustmentWithConfidence: (item: Item) => void;
}

export const usePriceCalculationEngine = (): PriceCalculationHooks => {

    const {configuration} = useSelector((state: any) => state.configurationStore);

    /**
     * Main function that determines the price and adjustment of the item
     * @param item the item to modify
     * @param changeType the type of change, can be "CONDITION," "ADJUSTMENT," or "VALUE"
     */
    const calculatePrice = (item: Item, changeType: ChangeType) => {
        setBaseValue(item);

        if (changeType === ChangeType.CONDITION) {

            if (item.source === Source.BRICKLINK) {
                // since we change the baseValue, the valueAdjustment might be super close to the standard valueAdjustments,
                // so we round them with 0.05 confidence
                roundAdjustmentWithConfidenceOnConditionChange(item);

                // if we're changing from used to new, and the existing valueAdjustment is the valueAdjustment for used,
                // then change the valueAdjustment to the valueAdjustment for new
                if (item.condition === Condition.NEW &&
                    (item.valueAdjustment === configuration.autoAdjustmentPercentageUsed || item.valueAdjustment === 0)) {
                    item.valueAdjustment = configuration.autoAdjustmentPercentageNew;
                    // if we're changing from new to used, and the existing valueAdjustment is the valueAdjustment for new,
                    // then change the valueAdjustment to the valueAdjustment for used
                } else if (item.condition === Condition.USED &&
                    (item.valueAdjustment === configuration.autoAdjustmentPercentageNew || item.valueAdjustment === 0)) {
                    item.valueAdjustment = configuration.autoAdjustmentPercentageUsed;
                } else {
                    // else just leave the value adjustment as it is, since we want to take a custom value as precedent
                }

                // then set the value based on the determined valueAdjustment
                item.value = (item.valueAdjustment / 100) * item.baseValue;
                item.valueDisplay = formatCurrency(item.value);
            }

        } else if (changeType === ChangeType.ADJUSTMENT) {

            // nothing fancy here, just need to set the value to the new adjustment * baseValue
            item.value = (item.valueAdjustment / 100) * item.baseValue;
            item.valueDisplay = formatCurrency(item.value);

        } else if (changeType === ChangeType.VALUE) {

            // need to do a reverse calculation to determine the valueAdjustment with the new value
            // if the base value is 0 (can happen with no sales for a given condition), don't set the valueAdjustment
            // the slider for the row will be set to 0 and disabled if it detects that the baseValue is 0
            setBaseValue(item);
            if (item.baseValue !== 0) {
                item.valueAdjustment = +((item.value / item.baseValue) * 100)
                    .toFixed(2)
                    .replace(".00", "");
            }
        }
    };

    /**
     * Helper function that determines what the base value of the item should be.
     * If the set is available at retail and the condition is new, then uses the MSRP for the baseValue, else use the
     * average price based on sales history for the condition.
     * If the set is not available at retail AND there is no sales data, sets the baseValue to 0.
     * @param item the item to check
     */
    const setBaseValue = (item: Item) => {
        if (item.source === Source.BRICKLINK) {
            if (item.retailStatus?.availability === Availability.RETAIL
                && item.retailStatus.retailPrice
                && item.condition === Condition.NEW) {
                item.baseValue = item.retailStatus.retailPrice;
            } else {
                if (item.condition === Condition.USED) {
                    item.baseValue = item.usedSold?.avg_price ? +item.usedSold.avg_price : 0;
                } else {
                    item.baseValue = item.newSold?.avg_price ? +item.newSold.avg_price : 0;
                }
            }
            if (item.baseValue === 0) {
                item.valueAdjustment = 0;
            }
        }
    }

    /**
     * Helper function that rounds the value adjustment to the nearest valid value.  Sometimes, if the value changes and
     * the valueAdjustment gets set to something like 59.98%, then we want that to really be 60%
     * @param item the item to check
     */
    const roundAdjustmentWithConfidenceOnConditionChange = (item: Item) => {
        if (item.condition === Condition.USED) {
            const lowerThreshold: number = (configuration.autoAdjustmentPercentageNew) - 0.05;
            const upperThreshold: number = (configuration.autoAdjustmentPercentageNew) + 0.05;
            if (lowerThreshold < item.valueAdjustment && item.valueAdjustment < upperThreshold) {
                item.valueAdjustment = configuration.autoAdjustmentPercentageUsed;
            }
        } else if (item.condition === Condition.NEW) {
            const lowerThreshold: number = (configuration.autoAdjustmentPercentageUsed) - 0.05;
            const upperThreshold: number = (configuration.autoAdjustmentPercentageUsed) + 0.05;
            if (lowerThreshold < item.valueAdjustment && item.valueAdjustment < upperThreshold) {
                item.valueAdjustment = configuration.autoAdjustmentPercentageNew;
            }
        }
    }

    const roundAdjustmentWithConfidence = (item: Item) => {
        if (item.condition === Condition.USED) {
            const lowerThreshold: number = (configuration.autoAdjustmentPercentageUsed) - 0.05;
            const upperThreshold: number = (configuration.autoAdjustmentPercentageUsed) + 0.05;
            if (lowerThreshold < item.valueAdjustment && item.valueAdjustment < upperThreshold) {
                item.valueAdjustment = configuration.autoAdjustmentPercentageUsed;
            }
        } else if (item.condition === Condition.NEW) {
            const lowerThreshold: number = (configuration.autoAdjustmentPercentageNew) - 0.05;
            const upperThreshold: number = (configuration.autoAdjustmentPercentageNew) + 0.05;
            if (lowerThreshold < item.valueAdjustment && item.valueAdjustment < upperThreshold) {
                item.valueAdjustment = configuration.autoAdjustmentPercentageNew;
            }
        }
    }

    return { calculatePrice, roundAdjustmentWithConfidence };
}