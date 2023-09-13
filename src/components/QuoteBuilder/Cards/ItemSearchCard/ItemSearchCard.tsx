import React, { FunctionComponent } from "react";
import { SetNameStyledTypography } from "../../QuoteBuilderComponent.styles";
import { Item } from "../../../../model/item/Item";
import { generateId } from "../../../../utils/ArrayUtils";
import { StyledCard } from "../Cards.styles";
import ItemSearchBar from "../../../_shared/ItemSearchBar/ItemSearchBar";

interface SetSearchCardParams {
    items: Item[];
    setItems: (items: Item[]) => void;
}

const ItemSearchCard: FunctionComponent<SetSearchCardParams> = ({items, setItems}) => {

    const processItem = (item: Item) => {
        // set the id
        item.id = generateId(items);
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

    return (
        <StyledCard variant="outlined" sx={{width: 420}}>
            <SetNameStyledTypography>Add Set</SetNameStyledTypography>
            <ItemSearchBar processItem={processItem} processItems={processItems} enableBulkSearch />
        </StyledCard>
    )
};

export default React.memo(ItemSearchCard);