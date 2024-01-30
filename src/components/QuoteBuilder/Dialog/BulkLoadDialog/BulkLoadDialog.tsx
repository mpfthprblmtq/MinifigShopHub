import React, { FunctionComponent, useState } from "react";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Portal,
    Snackbar,
    TextareaAutosize,
    Typography
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { cleanTextAreaList } from "../../../../utils/StringUtils";
import { Item } from "../../../../model/item/Item";
import { useItemLookupService } from "../../../../hooks/useItemLookupService";
import { HttpStatusCode } from "axios";
import { green } from "@mui/material/colors";
import { SnackbarState } from "../../../_shared/Snackbar/SnackbarState";

interface BulkLoadDialogParams {
    open: boolean;
    onClose: () => void;
    processItems: (items: Item[]) => void;
    addMultipleMatchItems: (items: Item[]) => void;
}

const BulkLoadDialog: FunctionComponent<BulkLoadDialogParams> = ({open, onClose, processItems, addMultipleMatchItems}) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [setNumbers, setSetNumbers] = useState<string>('');
    const [snackbarState, setSnackbarState] = useState<SnackbarState>({open: false});
    const { getItemMatches, getHydratedItem } = useItemLookupService();

    const loadItems = async () => {
        setLoading(true);
        const setNumberList: string[] =
            cleanTextAreaList(setNumbers).split(',').filter(setNumber => setNumber);
        const items: Item[] = [];
        const itemsWithMultipleMatches: Item[] = [];
        const errorItems: string[] = [];

        while(setNumberList.length) {
            // 5 at a time
            await Promise.all(
                setNumberList
                    .splice(0,5)
                    .map(async setNumber => {
                          try {
                              return await getItemMatches(setNumber);
                          } catch (e: any) {
                              if (e.code === HttpStatusCode.NotFound.toString()) {
                                  errorItems.push(setNumber);
                              }
                              return undefined;
                          }
                      }

                    )
                    .map(p => p?.catch(e => e)))
                .then(responses => {
                    responses.forEach(response => {
                        if (response) {
                            if (response.length === 1) {
                                items.push(response[0]);
                            } else {
                                itemsWithMultipleMatches.push(...response);
                            }
                        }
                    });
                }).catch(error => {
                    console.error(error);
                });
        }

        // add the items that worked to the items list
        const hydratedItems: Item[] = [];
        for (const item of items) {
            try {
                await getHydratedItem(item).then(hydratedItem => hydratedItems.push(hydratedItem));
            } catch (error: any) {
                // setSnackbarState({open: true, severity: 'error', message: error.message} as SnackbarState);
                hydratedItems.push(item);
            }

        }
        processItems(hydratedItems);

        // add the items with multiple matches
        addMultipleMatchItems(itemsWithMultipleMatches);

        // close if there are no errors
        if (errorItems.length === 0) {
            setSnackbarState({open: false});
            setSetNumbers('');
            onClose();
        } else {
            setSnackbarState({open: true, severity: 'warning',
                message: "These sets weren't found!\nPlease correct them or remove them from the list."});
            setSetNumbers(errorItems.join('\r\n'));
        }
        setLoading(false);
    }

    return (
        <Dialog open={open} onClose={onClose} disableScrollLock={true}
                PaperProps={{
                    sx: {
                        width: "50vh",
                        maxHeight: '50vh',
                        height: '50vh'
                    }
                }}>
            <DialogTitle>
                <Typography style={{fontFamily: 'Didact Gothic', fontSize: '20px', marginBottom: '-20px'}}>
                    Bulk Load Items
                </Typography>
            </DialogTitle>
            <Box position="absolute" top={0} right={0} onClick={onClose}>
                <IconButton>
                    <Close />
                </IconButton>
            </Box>
            <DialogContent>
                <TextareaAutosize
                    value={setNumbers}
                    minRows={5}
                    placeholder={'Enter set numbers, separated by either new lines or commas'}
                    onChange={(event) => setSetNumbers(event.target.value)}
                    style={{fontFamily: 'Didact Gothic', fontSize: '18px', height: '100%', width: '100%', resize: 'none'}}
                />
            </DialogContent>
            <DialogActions style={{marginBottom: 10}}>
                <Button
                    variant="contained"
                    disabled={loading}
                    onClick={() => {
                        setSetNumbers('');
                        onClose();
                    }}>
                    Cancel
                </Button>
                <Box sx={{ m: 1, position: 'relative' }}>
                    <Button
                        color={"success"}
                        variant="contained"
                        onClick={loadItems}
                        disabled={loading}>
                        Search
                    </Button>
                    {loading && (
                        <CircularProgress
                            size={20}
                            sx={{
                                color: green[500],
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                marginTop: '-10px',
                                marginLeft: '-10px',
                            }}
                        />
                    )}
                </Box>
            </DialogActions>
            <Portal>
                <Snackbar
                  sx={{marginTop: '50px'}}
                  anchorOrigin={{ horizontal: "center", vertical: "top" }}
                  autoHideDuration={10000}
                  ClickAwayListenerProps={{ onClickAway: () => null }}
                  onClose={() => setSnackbarState({open: false})}
                  open={snackbarState.open}>
                    <Alert sx={{whiteSpace: 'pre'}} severity={snackbarState.severity} onClose={() => setSnackbarState({open: false})}>
                        {snackbarState.message}
                    </Alert>
                </Snackbar>
            </Portal>
        </Dialog>
    )
};

export default React.memo(BulkLoadDialog);