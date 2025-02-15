import React, { FunctionComponent, useEffect, useState } from "react";
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
  TextareaAutosize,
  Typography
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { cleanTextAreaList } from "../../../../utils/StringUtils";
import { Item } from "../../../../model/item/Item";
import { useItemLookupService } from "../../../../hooks/useItemLookupService";
import { green } from "@mui/material/colors";

interface BulkLoadDialogParams {
    open: boolean;
    onClose: () => void;
    processItems: (items: Item[]) => void;
    addMultipleMatchItems: (items: Item[]) => void;
}

const BulkLoadDialog: FunctionComponent<BulkLoadDialogParams> = ({open, onClose, processItems, addMultipleMatchItems}) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [setNumbers, setSetNumbers] = useState<string>('');
    const [setNumberList, setSetNumberList] = useState<string[]>([])
    const [error, setError] = useState<string>('');
    const { searchItems } = useItemLookupService();

    const loadItems = async () => {
        setLoading(true);
        const items: Item[] = [];
        const itemsWithMultipleMatches: Item[] = [];
        const errorItems: string[] = [];

        await searchItems(setNumberList).then(map => {
          for (const [key, value] of map.entries()) {
            if (value.length > 1) {
              itemsWithMultipleMatches.push(...value)
            } else if (value.length === 1) {
              items.push(value[0]);
            } else {
              errorItems.push(key);
            }
          }
        }).catch(error => {
          console.error(error);
        });
        processItems(items);

        // add the items with multiple matches
        addMultipleMatchItems(itemsWithMultipleMatches);

        // close if there are no errors
        if (errorItems.length === 0) {
          setError('');
          setSetNumbers('');
          onClose();
        } else {
          setError('These sets weren\'t found!  Please correct them or remove them from the list.');
          setSetNumbers(errorItems.join('\r\n'));
        }
        setLoading(false);
    }

  useEffect(() => {
    setSetNumberList(cleanTextAreaList(setNumbers).split(',').filter(setNumber => setNumber));
  }, [setNumbers]);

    return (
        <Dialog open={open} onClose={() => {
          setError('');
          setSetNumbers('')
          onClose();
        }} disableScrollLock={true}
                PaperProps={{
                    sx: {
                        width: "400px",
                        maxHeight: '50vh',
                        height: '50vh'
                    }
                }}>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography style={{fontFamily: 'Didact Gothic', fontSize: '20px', marginBottom: '-20px'}}>
                    Bulk Load Items
                </Typography>
              <Typography sx={{float: 'right', fontFamily: 'Didact Gothic', marginBottom: '-20px', marginRight: '20px'}}>
                {setNumberList.length} {setNumberList.length === 1 ? 'Item' : 'Items'}
              </Typography>
            </DialogTitle>
            <Box position="absolute" top={0} right={0} onClick={onClose}>
                <IconButton>
                    <Close />
                </IconButton>
            </Box>
            <DialogContent sx={{overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                <TextareaAutosize
                    value={setNumbers}
                    minRows={5}
                    placeholder={'Enter set numbers, separated by either new lines or commas'}
                    onChange={(event) => setSetNumbers(event.target.value)}
                    style={{fontFamily: 'Didact Gothic', fontSize: '18px', height: '80%', width: '100%', resize: 'none'}}
                />
              {error && (
                <Alert severity={'error'}>{error}</Alert>
              )}
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
        </Dialog>
    )
};

export default React.memo(BulkLoadDialog);