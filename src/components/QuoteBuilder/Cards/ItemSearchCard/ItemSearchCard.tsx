import React, { FunctionComponent } from "react";
import { SetNameStyledTypography } from "../../QuoteBuilderComponent.styles";
import { Item } from "../../../../model/item/Item";
import { generateId } from "../../../../utils/ArrayUtils";
import { StyledCard } from "../Cards.styles";
import ItemSearchBar from "../../../_shared/ItemSearchBar/ItemSearchBar";
import { useSnackbar } from "../../../../app/contexts/SnackbarProvider";
import { useItemLookupService } from "../../../../hooks/useItemLookupService";

interface SetSearchCardParams {
    items: Item[];
    setItems: (items: Item[]) => void;
}

const ItemSearchCard: FunctionComponent<SetSearchCardParams> = ({items, setItems}) => {

    const { showSnackbar } = useSnackbar();
    const { populateItem } = useItemLookupService();

    const processItem = (item: Item) => {
        let message: string = '';
        // show any messages
        if (item.messages && item.messages.length > 0) {
            message = message + item.messages.join('\n') + '\n';
        }
        // set the id
        item.id = generateId(items);
        populateItem(item);
        if (!!message) {
            showSnackbar(message, 'info', {vertical: 'top', horizontal: 'right'});
        }
        // add the item with sales data to existing state
        setItems([...items, item]);
    }

    const processItems = (itemsToProcess: Item[]) => {
        let nextId = generateId(items);
        let message: string = '';
        itemsToProcess.forEach(item => {
            // show any messages
            if (item.messages && item.messages.length > 0) {
                message = message + item.messages.join('\n') + '\n';
            }
            // set the id
            item.id = nextId;
            nextId++;
        });
        if (!!message) {
            showSnackbar(message, 'info', {vertical: 'top', horizontal: 'right'});
        }
        setItems([...items, ...itemsToProcess]);
    }

    return (
        <StyledCard variant="outlined" sx={{width: 350}}>
            <SetNameStyledTypography>Add Set</SetNameStyledTypography>
            <ItemSearchBar processItem={processItem} processItems={processItems} enableBulkSearch />
        </StyledCard>
    )
};

export default React.memo(ItemSearchCard);