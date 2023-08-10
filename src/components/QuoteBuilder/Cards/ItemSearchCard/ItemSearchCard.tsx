import React, {FunctionComponent, useState} from "react";
import {Box, Button, CircularProgress, TextField, Tooltip} from "@mui/material";
import {green} from "@mui/material/colors";
import {SetNameStyledTypography} from "../../QuoteBuilderComponent.styles";
import {Item} from "../../../../model/item/Item";
import {generateId} from "../../../../utils/ArrayUtils";
import {PlaylistAdd} from "@mui/icons-material";
import {StyledCard} from "../Cards.styles";
import {AxiosError} from "axios";
import {useItemLookupService} from "../../../../hooks/useItemLookupService";
import BulkLoadDialog from "../../Dialog/BulkLoadDialog/BulkLoadDialog";
import MultipleItemsFoundDialog from "../../Dialog/MultipleItemsFoundDialog/MultipleItemsFoundDialog";

interface SetSearchCardParams {
    items: Item[];
    setItems: (items: Item[]) => void;
}

const ItemSearchCard: FunctionComponent<SetSearchCardParams> = ({items, setItems}) => {

    const [setNumber, setSetNumber] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [bulkLoadModalOpen, setBulkLoadModalOpen] = useState<boolean>(false);

    const [multipleItemsDialogOpen, setMultipleItemsDialogOpen] = useState<boolean>(false);
    const [multipleItems, setMultipleItems] = useState<Item[]>([]);

    const { getHydratedItem, getItemMatches } = useItemLookupService();

    /**
     * Main search method that searches for a set and sets all appropriate values
     */
    const searchForSet = async () => {
        setLoading(true);
        setError('');

        await getItemMatches(setNumber).then(async (matches) => {
            // if there's only one match, get the hydration data and add it to the table
            if (matches.length === 1) {
                await getHydratedItem(matches[0])
                    .then((item: Item) => {

                        // set the id
                        item.id = generateId(items);

                        // add the item with sales data to existing state
                        setItems([...items, item]);

                        // update graphics
                        setLoading(false);
                        setSetNumber('');
                    })
            } else {
                setMultipleItems(matches);
                setMultipleItemsDialogOpen(true);
                setLoading(false);
            }
        }).catch((error: AxiosError) => {
            setLoading(false);
            if (error.response?.status === 404) {
                setError(`Item not found: ${setNumber}`);
            } else {
                setError("Issue with BrickLink service!");
            }
        });
    };

    const addItems = (itemsToAdd: Item[]) => {
        let nextId = generateId(items);
        itemsToAdd.forEach(item => {
            // set the id
            item.id = nextId;
            nextId++;
        });

        setItems([...items, ...itemsToAdd]);
    };

    const addMultipleMatchItems = (items: Item[]) => {
        if (items && items.length !== 0) {
            setMultipleItems(items);
            setMultipleItemsDialogOpen(true);
        }
    };

    const addItem = async (item: Item) => {
        const itemToAdd = {...item};
        await getHydratedItem(itemToAdd).then(hydratedItem => {
            hydratedItem.id = generateId(items);
            setItems([...items, hydratedItem]);
        });
    };

    return (
        <StyledCard variant="outlined" sx={{width: 420}}>
            <SetNameStyledTypography>Add Set</SetNameStyledTypography>
            <form>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ m: 1, position: 'relative', flexGrow: 4 }}>
                        <TextField
                            label={'Item ID'}
                            variant="outlined"
                            sx={{backgroundColor: "white", width: '100%'}}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setSetNumber(event.target.value);
                            }}
                            value={setNumber}
                        />
                    </Box>
                    <Box sx={{ m: 1, position: 'relative' }}>
                        <Button
                            variant="contained"
                            disabled={loading || !setNumber}
                            onClick={searchForSet}
                            sx={{minWidth: "100px", height: "50px"}}
                            type='submit'>
                            Search
                        </Button>
                        {loading && (
                            <CircularProgress
                                size={24}
                                sx={{
                                    color: green[500],
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginTop: '-12px',
                                    marginLeft: '-12px',
                                }}
                            />
                        )}
                    </Box>
                    <Box sx={{ m: 1, position: 'relative' }}>
                        <Tooltip title={'Bulk Load Items'}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    setBulkLoadModalOpen(true);
                                }}
                                style={{width: "50px", minWidth: "50px", maxWidth: "50px", height: "50px", marginRight: '5px'}}>
                                <PlaylistAdd />
                            </Button>
                        </Tooltip>
                    </Box>
                </Box>
            </form>
            <Box>
                {error &&
                    <SetNameStyledTypography color={"#800000"}>{error}</SetNameStyledTypography>}
            </Box>
            <BulkLoadDialog
                open={bulkLoadModalOpen}
                onClose={() => setBulkLoadModalOpen(false)}
                addItems={addItems}
                addMultipleMatchItems={addMultipleMatchItems}
            />
            <MultipleItemsFoundDialog
                open={multipleItemsDialogOpen}
                onClose={() => setMultipleItemsDialogOpen(false)}
                items={multipleItems}
                addItem={addItem} />
        </StyledCard>
    )
};

export default React.memo(ItemSearchCard);