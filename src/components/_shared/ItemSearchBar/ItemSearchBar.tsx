import React, { FunctionComponent, useState } from "react";
import { Item } from "../../../model/item/Item";
import { useItemLookupService } from "../../../hooks/useItemLookupService";
import { AxiosError } from "axios";
import MultipleItemsFoundDialog from "./MultipleItemsFoundDialog/MultipleItemsFoundDialog";
import { Box, Button, TextField, Tooltip } from "@mui/material";
import { PlaylistAdd, Search } from "@mui/icons-material";
import BulkLoadDialog from "../../QuoteBuilder/Dialog/BulkLoadDialog/BulkLoadDialog";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "../../../app/contexts/SnackbarProvider";
// import { useItemLookupService } from "../../../_hooks/useItemLookupService";

interface ItemSearchBarParams {
  processItem: (item: Item) => void;
  processItems?: (items: Item[]) => void;
  enableBulkSearch?: boolean;
  onChange?: (event: any) => void;
}

const ItemSearchBar: FunctionComponent<ItemSearchBarParams> = ({processItem, processItems, enableBulkSearch, onChange}) => {

  const [setNumber, setSetNumber] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [multipleItemsDialogOpen, setMultipleItemsDialogOpen] = useState<boolean>(false);
  const [multipleItems, setMultipleItems] = useState<Item[]>([]);
  const [bulkLoadModalOpen, setBulkLoadModalOpen] = useState<boolean>(false);

  // const { getHydratedItem, getItemMatches } = useItemLookupService();
  const { searchItem } = useItemLookupService();
  const { showSnackbar } = useSnackbar();

  const searchForSet = async () => {
    setLoading(true);

    await searchItem(setNumber).then(async (matches) => {
      // if there's only one match, get the hydration data and add it to the table
      if (matches.length === 1) {
        const item: Item = matches[0];
        processItem(item);

        // update graphics
        setLoading(false);
        setSetNumber('');

        // show any messages
        if (item.messages && item.messages.length > 0) {
          showSnackbar(item.messages.join('\n'), 'info');
        }
      } else {
        setMultipleItems(matches);
        setMultipleItemsDialogOpen(true);
        setLoading(false);
      }
    }).catch((error: AxiosError) => {
      setLoading(false);
      if (error.message === 'Request failed with status code 404') {
        error.message = `No results found for ${setNumber}`!;
      }
      showSnackbar(error.message, 'error', {vertical: 'top', horizontal: 'left'});
    });
  };

  const addItem = async (item: Item) => {
    processItem(item);
    setSetNumber('');
  };

  const addMultipleMatchItems = (items: Item[]) => {
    if (items && items.length !== 0) {
      setMultipleItems(items);
      setMultipleItemsDialogOpen(true);
    }
  };

  return (
    <>
      <form>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ m: 1, position: 'relative', flexGrow: 4 }}>
            <TextField
              label={'Item ID'}
              variant="outlined"
              sx={{backgroundColor: "white", width: '100%'}}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setSetNumber(event.target.value);
                if (onChange) {
                  onChange(event);
                }
              }}
              value={setNumber}
            />
          </Box>
          <Box sx={{ m: 1, position: 'relative' }}>
            <LoadingButton
              sx={{ height: '48px' }}
              color="primary"
              onClick={searchForSet}
              loading={loading}
              loadingPosition="start"
              startIcon={<Search />}
              variant="contained"
              disabled={!setNumber}
              type={'submit'}>
              Search
            </LoadingButton>
          </Box>
          {enableBulkSearch && (
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
          )}
        </Box>
      </form>
      <MultipleItemsFoundDialog
        open={multipleItemsDialogOpen}
        onClose={() => setMultipleItemsDialogOpen(false)}
        items={multipleItems}
        addItem={addItem} />
      <BulkLoadDialog
        open={bulkLoadModalOpen}
        onClose={() => setBulkLoadModalOpen(false)}
        processItems={processItems ?? ((_: Item[]) => {})}
        addMultipleMatchItems={addMultipleMatchItems}
      />
    </>
  );
};

export default ItemSearchBar;