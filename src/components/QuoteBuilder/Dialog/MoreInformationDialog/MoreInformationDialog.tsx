import React, { FunctionComponent, useState } from "react";
import {Item} from "../../../../model/item/Item";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography
} from "@mui/material";
import { Close, Refresh } from "@mui/icons-material";
import SalesHistoryAccordion from "./SalesHistoryAccordion";
import {formatCurrency} from "../../../../utils/CurrencyUtils";
import { LoadingButton } from "@mui/lab";
import { useItemLookupService } from "../../../../_hooks/useItemLookupService";
import { useDispatch } from "react-redux";
import { updateItem } from "../../../../redux/slices/quoteSlice";

interface MoreInformationDialogParams {
    open: boolean;
    onClose: () => void;
    item?: Item;
}

const MoreInformationDialog: FunctionComponent<MoreInformationDialogParams> = ({open, onClose, item}) => {

    const [loading, setLoading] = useState<boolean>(false);
    const { getHydratedItem } = useItemLookupService();
    const dispatch = useDispatch();

    const refreshItem = async () => {
        if (item) {
            setLoading(true);
            await getHydratedItem(item).then(item => {
                dispatch(updateItem(item));
                setLoading(false);
            });
        }
    }

    return (
        <Dialog open={open} onClose={onClose} PaperProps={{
            sx: {
                width: "50%",
                maxHeight: '80vh',
                height: '80vh'
            }
        }}>
            <DialogTitle>Item Details for {item?.setId}</DialogTitle>
            <Box position="absolute" top={0} right={0} onClick={onClose}>
                <IconButton>
                    <Close />
                </IconButton>
            </Box>
            <DialogContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {item?.imageUrl && item?.thumbnailUrl && (
                        <Box sx={{ m: 1, position: 'relative' }}>
                            <img width="200" alt="bricklink-set-img" src={item.imageUrl}/>
                        </Box>
                    )}
                    <Box sx={{ m: 1, position: 'relative' }}>
                        <Typography>
                            <strong>Set ID: </strong>{item?.setId}<br/>
                            <strong>Name: </strong>{item?.name}<br/>
                            <strong>Year: </strong>{item?.yearReleased}<br/>
                            {item?.pieceCount && item.minifigCount && (
                              <>
                                  <strong>Pieces / Minifigs: </strong>
                                    {`${item?.pieceCount?.toLocaleString() ?? 0} / ${item?.minifigCount?.toLocaleString() ?? 0}`}<br/>
                              </>
                            )}
                            {item?.theme && item.subTheme && (
                              <>
                                  <strong>Theme: </strong>{item?.theme}<br/>
                                  <strong>SubTheme: </strong>{item?.subTheme}<br/>
                              </>
                            )}
                        </Typography>
                        {item?.retailStatus?.availability && item.retailStatus.retailPrice && (
                            <Typography style={{marginTop: 10}}>
                                <strong>Availability: </strong>{item?.retailStatus?.availability}<br/>
                                <strong>MSRP: </strong>{formatCurrency(item?.retailStatus?.retailPrice)}<br/>
                                <a href={`https://www.brickeconomy.com/search?query=${item.setId}`} target='_blank' rel='noreferrer'>
                                    <strong>BrickEconomy Value: </strong>{formatCurrency(item?.brickEconomyValue)}<br/>
                                </a>
                            </Typography>
                        )}
                    </Box>
                </Box>
                <Box marginTop={'10px'}>
                    {item?.salesData?.newSold && (
                        <SalesHistoryAccordion
                            title={<Typography>Last 6 Months Sales <strong>(New)</strong></Typography>}
                            salesHistory={item?.salesData?.newSold} />
                    )}
                    {item?.salesData?.usedSold && (
                        <SalesHistoryAccordion
                            title={<Typography>Last 6 Months Sales <strong>(Used)</strong></Typography>}
                            salesHistory={item?.salesData?.usedSold} />
                    )}
                    {item?.salesData?.newStock && (
                        <SalesHistoryAccordion
                            title={<Typography>Current Items For Sale <strong>(New)</strong></Typography>}
                            salesHistory={item?.salesData?.newStock} />
                    )}
                    {item?.salesData?.usedStock && (
                        <SalesHistoryAccordion
                            title={<Typography>Current Items For Sale <strong>(Used)</strong></Typography>}
                            salesHistory={item?.salesData?.usedStock} />
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <LoadingButton
                  color="success"
                  onClick={refreshItem}
                  loading={loading}
                  loadingPosition="start"
                  startIcon={<Refresh />}
                  variant="contained"
                  type={'submit'}>
                    Refresh
                </LoadingButton>
                <Button variant='contained' onClick={onClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default MoreInformationDialog;