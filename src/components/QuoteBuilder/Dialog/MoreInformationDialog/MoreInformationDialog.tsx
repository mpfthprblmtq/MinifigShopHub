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
import { useDispatch } from "react-redux";
import { updateItem } from "../../../../redux/slices/quoteSlice";
import { useBackendService } from "../../../../hooks/useBackendService";
import { Type } from "../../../../model/_shared/Type";

interface MoreInformationDialogParams {
    open: boolean;
    onClose: () => void;
    item: Item;
}

const MoreInformationDialog: FunctionComponent<MoreInformationDialogParams> = ({open, onClose, item}) => {

    const [loading, setLoading] = useState<boolean>(false);
    const { getItem } = useBackendService();
    const dispatch = useDispatch();

    const refreshItem = async () => {
        if (item && item.bricklinkId) {
            setLoading(true);
            await getItem(item.bricklinkId).then(itemResponse => {
                dispatch(updateItem({
                    ...itemResponse.items[0],
                    id: item.id,
                    baseValue: item.baseValue,
                    value: item.value,
                    valueAdjustment: item.valueAdjustment,
                    condition: item.condition,
                } as Item));
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
                    {item?.imageUrl && (
                        <Box sx={{ m: 1, position: 'relative' }}>
                            <img width="200" alt="bricklink-set-img" src={item.imageUrl}/>
                        </Box>
                    )}
                    <Box sx={{ m: 1, position: 'relative' }}>
                        <Typography>
                            <strong>Set ID: </strong>{item?.setId}<br/>
                            <strong>Bricklink ID: </strong>
                            <a
                              href={`https://www.bricklink.com/v2/catalog/catalogitem.page?${
                                item.type === Type.SET ? 'S' : 'M'
                              }=${item.bricklinkId}#T=P`}
                              target="_blank" rel="noreferrer">{item.bricklinkId}
                            </a><br/>
                            <strong>Name: </strong>{item?.name}<br/>
                            <strong>Year: </strong>{item?.year}<br/>
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
                                    {/*<strong>BrickEconomy Value: </strong>{formatCurrency(item?.brickEconomyValue)}<br/>*/}
                                </a>
                            </Typography>
                        )}
                    </Box>
                </Box>
                <Box marginTop={'10px'}>
                    {item?.salesHistory?.newSales && (
                        <SalesHistoryAccordion
                            title={<Typography>Last 6 Months Sales <strong>(New)</strong></Typography>}
                            salesHistory={item?.salesHistory?.newSales}
                            setId={item?.bricklinkId} />
                    )}
                    {item?.salesHistory?.usedSales && (
                        <SalesHistoryAccordion
                            title={<Typography>Last 6 Months Sales <strong>(Used)</strong></Typography>}
                            salesHistory={item?.salesHistory?.usedSales}
                            setId={item?.bricklinkId} />
                    )}
                    {item?.salesHistory?.newStock && (
                        <SalesHistoryAccordion
                            title={<Typography>Current Items For Sale <strong>(New)</strong></Typography>}
                            salesHistory={item?.salesHistory?.newStock}
                            setId={item?.bricklinkId} />
                    )}
                    {item?.salesHistory?.usedStock && (
                        <SalesHistoryAccordion
                            title={<Typography>Current Items For Sale <strong>(Used)</strong></Typography>}
                            salesHistory={item?.salesHistory?.usedStock}
                            setId={item?.bricklinkId} />
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