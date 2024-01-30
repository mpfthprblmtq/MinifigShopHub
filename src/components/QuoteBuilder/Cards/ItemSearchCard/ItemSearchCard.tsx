import React, { FunctionComponent, useState } from "react";
import { SetNameStyledTypography } from "../../QuoteBuilderComponent.styles";
import { Item } from "../../../../model/item/Item";
import { generateId } from "../../../../utils/ArrayUtils";
import { StyledCard } from "../Cards.styles";
import ItemSearchBar from "../../../_shared/ItemSearchBar/ItemSearchBar";
import { SnackbarState } from "../../../_shared/Snackbar/SnackbarState";
import { Alert, Portal, Snackbar } from "@mui/material";

interface SetSearchCardParams {
    items: Item[];
    setItems: (items: Item[]) => void;
}

const ItemSearchCard: FunctionComponent<SetSearchCardParams> = ({items, setItems}) => {

    const [snackbarState, setSnackbarState] = useState<SnackbarState>({open: false});

    const processItem = (item: Item) => {
        let message: string = '';
        // show any messages
        if (item.messages && item.messages.length > 0) {
            message = message + item.messages.join('\n') + '\n';
        }
        // set the id
        item.id = generateId(items);
        if (!!message) {
            setSnackbarState({open: true, severity: 'info', message: message});
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
            setSnackbarState({open: true, severity: 'info', message: message});
        }
        setItems([...items, ...itemsToProcess]);
    }

    return (
        <StyledCard variant="outlined" sx={{width: 350}}>
            <SetNameStyledTypography>Add Set</SetNameStyledTypography>
            <ItemSearchBar processItem={processItem} processItems={processItems} enableBulkSearch />
            <Portal>
                <Snackbar
                  sx={{marginTop: '50px', marginLeft: '75px'}}
                  anchorOrigin={{ horizontal: "left", vertical: "top" }}
                  autoHideDuration={10000}
                  ClickAwayListenerProps={{ onClickAway: () => null }}
                  onClose={() => setSnackbarState({open: false})}
                  open={snackbarState.open}>
                    <Alert sx={{whiteSpace: 'pre'}} severity={snackbarState.severity} onClose={() => setSnackbarState({open: false})}>
                        {snackbarState.message}
                    </Alert>
                </Snackbar>
            </Portal>
        </StyledCard>
    )
};

export default React.memo(ItemSearchCard);