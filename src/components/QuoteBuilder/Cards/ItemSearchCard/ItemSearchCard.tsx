import React, { FunctionComponent } from "react";
import { SetNameStyledTypography } from "../../QuoteBuilderComponent.styles";
import { Item } from "../../../../model/item/Item";
import { generateId } from "../../../../utils/ArrayUtils";
import { StyledCard } from "../Cards.styles";
import ItemSearchBar from "../../../_shared/ItemSearchBar/ItemSearchBar";
import { Availability } from "../../../../model/retailStatus/Availability";
import { Configuration } from "../../../../model/dynamo/Configuration";
import { useSelector } from "react-redux";
import { formatCurrency } from "../../../../utils/CurrencyUtils";

interface SetSearchCardParams {
    items: Item[];
    setItems: (items: Item[]) => void;
}

const ItemSearchCard: FunctionComponent<SetSearchCardParams> = ({items, setItems}) => {

    const configuration: Configuration = useSelector((state: any) => state.configurationStore.configuration);

    const processItem = (item: Item) => {
        // set the id
        item.id = generateId(items);
        // make sure we're using the correct value
        validateValue(item);
        // add the item with sales data to existing state
        setItems([...items, item]);
    }

    const processItems = (itemsToProcess: Item[]) => {
        let nextId = generateId(items);
        itemsToProcess.forEach(item => {
            // set the id
            item.id = nextId;
            nextId++;
        });
        setItems([...items, ...itemsToProcess]);
    }

    const validateValue = (item: Item) => {
        if (item.retailStatus?.availability === Availability.RETAIL && item.retailStatus.retailPrice) {
            item.baseValue = item.retailStatus.retailPrice;
            item.value = item.baseValue * (configuration.autoAdjustmentPercentageUsed / 100);
            item.valueDisplay = formatCurrency(item.value);
        }
    }

    return (
        <StyledCard variant="outlined" sx={{width: 420}}>
            <SetNameStyledTypography>Add Set</SetNameStyledTypography>
            <ItemSearchBar processItem={processItem} processItems={processItems} enableBulkSearch />
        </StyledCard>
    )
};

export default React.memo(ItemSearchCard);