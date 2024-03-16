import React, { FunctionComponent, useState } from "react";
import { Alert, Portal, Snackbar, Table, TableBody, TableContainer, TableHead, TableRow } from "@mui/material";
import NewUsedToggleButtonCell from "../TableCells/NewUsedToggleButtonCell";
import { formatCurrency, launderMoney, roundToNearestFive } from "../../../../utils/CurrencyUtils";
import { FixedWidthColumnHeading, StyledTableCell } from "./TableComponent.styles";
import { Item } from "../../../../model/item/Item";
import { Condition } from "../../../../model/_shared/Condition";
import { getItemWithId } from "../../../../utils/ArrayUtils";
import ItemCommentCell from "../TableCells/ItemCommentCell";
import MoreInformationDialog from "../../Dialog/MoreInformationDialog/MoreInformationDialog";
import ImageCell from "../TableCells/ImageCell";
import SetNumberCell from "../TableCells/SetNumberCell";
import YearAvailabilityCell from "../TableCells/YearAvailabilityCell";
import BrickLinkSalesCells from "../TableCells/BrickLinkSalesCells";
import ValueCell from "../TableCells/ValueCell";
import IconsCell from "../TableCells/IconsCell";
import InformationDialog from "../../../_shared/InformationDialog/InformationDialog";
import { updateItem, updateItemsInStore } from "../../../../redux/slices/quoteSlice";
import { useDispatch, useSelector } from "react-redux";
import { SnackbarState } from "../../../_shared/Snackbar/SnackbarState";
import { updateItemInStore } from "../../../../redux/slices/labelSlice";
import { useNavigate } from "react-router-dom";
import { RouterPaths } from "../../../../utils/RouterPaths";
import { Availability } from "../../../../model/retailStatus/Availability";
import { Configuration } from "../../../../model/dynamo/Configuration";

interface TableComponentParams {
    storeMode: boolean;
    compressedView: boolean;
    updateItems: (items: Item[]) => void;
}

const TableComponent: FunctionComponent<TableComponentParams> = ({ storeMode, compressedView, updateItems }) => {

    const [focusedItem, setFocusedItem] = useState<Item>();
    const [showImageDialog, setShowImageDialog] = useState<boolean>(false);
    const [showMoreInformationDialog, setShowMoreInformationDialog] = useState<boolean>(false);
    const [snackbarState, setSnackbarState] = useState<SnackbarState>({open: false});

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { quote } = useSelector((state: any) => state.quoteStore);
    const configuration: Configuration = useSelector((state: any) => state.configurationStore.configuration);
    const items = quote.items as Item[];

    /**
     * Event handler for the change event on the condition selector
     * @param condition the condition value to set
     * @param id the id of the item to modify
     */
    const handleConditionChange = (condition: Condition, id: number) => {
        if (condition) {
            const itemCopy = {...getItemWithId(items, id)} as Item;
            if (itemCopy) {
                itemCopy.condition = condition;

                // new Retail sets use the MSRP as the base value, used Retail sets use BrickLink sales data as the base value
                if (itemCopy.condition === Condition.USED) {
                    itemCopy.baseValue = +(itemCopy.salesData?.usedSold?.avg_price ?? 0);
                } else if (itemCopy.condition === Condition.NEW) {
                    itemCopy.baseValue = itemCopy.retailStatus?.availability === Availability.RETAIL ?
                      itemCopy.retailStatus.retailPrice ?? 0 : +(itemCopy.salesData?.newSold?.avg_price ?? 0);
                }
                if (itemCopy.baseValue === 0) {
                    itemCopy.valueAdjustment = 0;
                } else {
                    itemCopy.valueAdjustment = condition === Condition.NEW ?
                      configuration.autoAdjustmentPercentageNew : configuration.autoAdjustmentPercentageUsed;
                }
                itemCopy.value = itemCopy.baseValue * (itemCopy.valueAdjustment / 100);

                dispatch(updateItem(itemCopy));
                updateItems(getUpdatedItems(itemCopy));
            }
        }
    };

    /**
     * Event handler for the blur event on the value text field, just cleans up the value display mostly
     * @param event the event to capture
     * @param id the id of the item to modify
     */
    const handleValueBlur = (event: any, id: number) => {
        const itemCopy = {...getItemWithId(items, id)} as Item;
        if (itemCopy.value !== launderMoney(event.target.value)) {  // prevent dispatch on value not changed
            if (itemCopy) {
                console.log(itemCopy)
                if (itemCopy.baseValue !== 0) {
                    itemCopy.value = launderMoney(event.target.value);
                    itemCopy.valueAdjustment = Math.round((itemCopy.value / itemCopy.baseValue) * 100);
                } else {
                    itemCopy.value = launderMoney(event.target.value);
                }

            }
            dispatch(updateItem(itemCopy));
            updateItems(getUpdatedItems(itemCopy));
        }
    };

    const getUpdatedItems = (item: Item): Item[] => {
        const updatedItems: Item[] = [...items];
        updatedItems[updatedItems.findIndex(itemInList =>
          itemInList.id === item.id
        )] = item;
        return updatedItems;
    }

    /**
     * Event handler for the comment change, sets the comment on the item
     * @param comment the comment to add
     * @param id the id of the item to modify
     */
    const handleCommentChange = (comment: string, id: number) => {
        const itemCopy = {...getItemWithId(items, id)} as Item;
        dispatch(updateItem({...itemCopy, comment: comment}));
    }

    const addToLabel = (item: Item) => {
        // retail sets are set at 80% of the MSRP, rounded to the nearest 5
        // retired sets won't have a value, since they will most often be overridden
        const itemCopy = {...item};
        if (itemCopy.retailStatus?.retailPrice && itemCopy.retailStatus?.availability === Availability.RETAIL) {
            itemCopy.baseValue = itemCopy.retailStatus.retailPrice;
            itemCopy.valueAdjustment = configuration.autoAdjustmentPercentageCertifiedPreOwned;
            itemCopy.value = roundToNearestFive(itemCopy.retailStatus.retailPrice * (itemCopy.valueAdjustment / 100), 'DOWN');
        } else {
            itemCopy.valueAdjustment = 0;
            itemCopy.value = 0.00;
        }
        dispatch(updateItemInStore(itemCopy));
        navigate(RouterPaths.LabelMaker);
    }

    return (
      <>
          <TableContainer style={{width: "100%"}}>
              <Table size="small">
                  <TableHead>
                      <TableRow>
                          <FixedWidthColumnHeading width={80} />
                          <FixedWidthColumnHeading width={80}>Set No.</FixedWidthColumnHeading>
                          <FixedWidthColumnHeading width={180}>Name</FixedWidthColumnHeading>
                          <FixedWidthColumnHeading width={50}>Year</FixedWidthColumnHeading>
                          <FixedWidthColumnHeading width={100}>Condition</FixedWidthColumnHeading>
                          {storeMode && (
                            <>
                                <FixedWidthColumnHeading width={120}>New Sales</FixedWidthColumnHeading>
                                <FixedWidthColumnHeading width={120}>Used Sales</FixedWidthColumnHeading>
                            </>
                          )}
                          <FixedWidthColumnHeading width={150}>Cash Value</FixedWidthColumnHeading>
                          <FixedWidthColumnHeading width={180}>Notes/Comments</FixedWidthColumnHeading>
                          <FixedWidthColumnHeading width={100} />
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {items.map(item => (
                        <TableRow key={item.id}>
                            <ImageCell item={item} compressedView={compressedView} onClick={() => {
                                setFocusedItem(item);
                                setShowImageDialog(true);
                            }}/>
                            <SetNumberCell item={item} />
                            <StyledTableCell>{item.name}</StyledTableCell>
                            <YearAvailabilityCell item={item} storeMode={storeMode} />
                            <NewUsedToggleButtonCell item={item} handleConditionChange={handleConditionChange} storeMode={storeMode} />
                            {storeMode && (
                              <BrickLinkSalesCells item={item} />
                            )}
                            {storeMode ? (
                                <ValueCell
                                  item={item}
                                  handleValueBlur={handleValueBlur}
                                  storeMode={storeMode}
                                />
                              ) : (
                                  <StyledTableCell>
                                      {formatCurrency(Math.round(item.value))}
                                  </StyledTableCell>
                            )}
                            <ItemCommentCell item={item} storeMode={storeMode} handleCommentChange={handleCommentChange}/>
                            {storeMode && (
                              <IconsCell
                                item={item}
                                onDelete={(id: number) => {
                                    dispatch(updateItemsInStore([...items].filter(item => item.id !== id)));
                                    setSnackbarState({open: true, message: `Item ${item.setId ? item.setId : ''} successfully deleted!`, severity: 'success'})
                                }}
                                onShowMoreInfo={() => {
                                    setFocusedItem(item);
                                    setShowMoreInformationDialog(true);
                                }}
                                onAddToLabel={() => addToLabel(item)}
                              />
                            )}
                        </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </TableContainer>
          <InformationDialog
            open={showImageDialog && focusedItem !== undefined}
            onClose={() => {
                setFocusedItem(undefined);
                setShowImageDialog(false);
            }}
            title={focusedItem?.name ?? ''}
            content={<img src={focusedItem?.imageUrl} alt="bricklink-img" />} />
          <MoreInformationDialog
            open={showMoreInformationDialog && focusedItem !== undefined}
            onClose={() => {
                setFocusedItem(undefined);
                setShowMoreInformationDialog(false);
            }}
            item={focusedItem} />
          <Portal>
              <Snackbar
                anchorOrigin={{ horizontal: "right", vertical: "top" }}
                autoHideDuration={5000}
                onClose={() => setSnackbarState({open: false})}
                open={snackbarState.open}>
                  <Alert severity={snackbarState.severity} onClose={() => setSnackbarState({open: false})}>
                      {snackbarState.message}
                  </Alert>
              </Snackbar>
          </Portal>
      </>
    );
}

export default React.memo(TableComponent);