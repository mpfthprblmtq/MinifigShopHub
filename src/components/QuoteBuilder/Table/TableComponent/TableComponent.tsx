import React, { FunctionComponent, useState } from "react";
import { Alert, Portal, Snackbar, Table, TableBody, TableContainer, TableHead, TableRow } from "@mui/material";
import NewUsedToggleButtonCell from "../TableCells/NewUsedToggleButtonCell";
import { formatCurrency, launderMoney } from "../../../../utils/CurrencyUtils";
import { FixedWidthColumnHeading, StyledTableCell } from "./TableComponent.styles";
import { Item } from "../../../../model/item/Item";
import { Condition } from "../../../../model/_shared/Condition";
import ManualValueAdjustmentSliderCell from "../TableCells/ManualValueAdjustmentSliderCell";
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
import { usePriceCalculationEngine } from "../../../../hooks/priceCalculation/usePriceCalculationEngine";
import { ChangeType } from "../../../../model/priceCalculation/ChangeType";
import { updateItem, updateItemsInStore } from "../../../../redux/slices/quoteSlice";
import { useDispatch, useSelector } from "react-redux";
import { SnackbarState } from "../../../_shared/Snackbar/SnackbarState";

interface TableComponentParams {
    storeMode: boolean;
    rowAdjustmentsDisabled: boolean;
}

const TableComponent: FunctionComponent<TableComponentParams> = ({ storeMode, rowAdjustmentsDisabled }) => {

    const [focusedItem, setFocusedItem] = useState<Item>();
    const [showImageDialog, setShowImageDialog] = useState<boolean>(false);
    const [showMoreInformationDialog, setShowMoreInformationDialog] = useState<boolean>(false);
    const [snackbarState, setSnackbarState] = useState<SnackbarState>({open: false});

    const { calculatePrice } = usePriceCalculationEngine();
    const dispatch = useDispatch();
    const { quote } = useSelector((state: any) => state.quoteStore);
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
                calculatePrice(itemCopy, ChangeType.CONDITION);
            }
            dispatch(updateItem(itemCopy));
        }
    };

    /**
     * Event handler for the change event on the value adjustment slider
     * @param event the event to capture
     * @param id the id of the item to modify
     */
    const handleSliderChange = (event: any, id: number) => {
        const itemCopy = {...getItemWithId(items, id)} as Item;
        if (itemCopy) {
            itemCopy.valueAdjustment = +event.target.value;
            calculatePrice(itemCopy, ChangeType.ADJUSTMENT);
        }
        dispatch(updateItem(itemCopy));
    };

    /**
     * Event handler for the change event on the value text field, just sets the value
     * @param event the event to capture
     * @param id the id of the item to modify
     */
    const handleValueChange = (event: any, id: number) => {
        const itemCopy = {...getItemWithId(items, id)} as Item;
        if (itemCopy) {
            itemCopy.value = launderMoney(event.target.value);
            itemCopy.valueDisplay = event.target.value;
            calculatePrice(itemCopy, ChangeType.VALUE);
        }
        dispatch(updateItem(itemCopy));
    };

    /**
     * Event handler for the blur event on the value text field, just cleans up the value display mostly
     * @param event the event to capture
     * @param id the id of the item to modify
     */
    const handleValueBlur = (event: any, id: number) => {
        const itemCopy = {...getItemWithId(items, id)} as Item;
        if (itemCopy) {
            itemCopy.valueDisplay = formatCurrency(launderMoney(event.target.value));
        }
        if (!rowAdjustmentsDisabled) {
            dispatch(updateItem(itemCopy));
        }
    };

    const handleCommentChange = (comment: string, id: number) => {
        const itemCopy = {...getItemWithId(items, id)} as Item;
        if (itemCopy) {
            itemCopy.comment = comment;
        }
        dispatch(updateItem(itemCopy));
    }

    return (
      <>
          <TableContainer style={{width: "100%"}}>
              <Table size="small">
                  <TableHead>
                      <TableRow>
                          <FixedWidthColumnHeading width={80} />
                          <FixedWidthColumnHeading width={80}>Set No.</FixedWidthColumnHeading>
                          <FixedWidthColumnHeading width={150}>Name</FixedWidthColumnHeading>
                          <FixedWidthColumnHeading width={50}>Year</FixedWidthColumnHeading>
                          <FixedWidthColumnHeading width={100}>Condition</FixedWidthColumnHeading>
                          {storeMode && (
                            <>
                                <FixedWidthColumnHeading width={100}>New Sales</FixedWidthColumnHeading>
                                <FixedWidthColumnHeading width={100}>Used Sales</FixedWidthColumnHeading>
                            </>
                          )}
                          <FixedWidthColumnHeading width={120}>Trade-In Value</FixedWidthColumnHeading>
                          {storeMode && <FixedWidthColumnHeading width={200}>Manual Adjustment</FixedWidthColumnHeading>}
                          <FixedWidthColumnHeading width={200}>Notes/Comments</FixedWidthColumnHeading>
                          <FixedWidthColumnHeading width={100} />
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {items.map(item => (
                        <TableRow key={item.id}>
                            <ImageCell item={item} onClick={() => {
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
                            <ValueCell
                              item={item}
                              handleValueBlur={handleValueBlur}
                              handleValueChange={handleValueChange}
                              storeMode={storeMode}
                              editable={rowAdjustmentsDisabled}
                            />
                            {storeMode && (
                              <ManualValueAdjustmentSliderCell item={item} handleSliderChange={handleSliderChange} disabled={rowAdjustmentsDisabled} />
                            )}
                            <ItemCommentCell item={item} storeMode={storeMode} handleCommentChange={handleCommentChange}/>
                            {storeMode && (
                              <IconsCell
                                item={item}
                                onDelete={(id: number) => {
                                    dispatch(updateItemsInStore([...items].filter(item => item.id !== id)));
                                    setSnackbarState({open: true, message: `Item ${item.no ? item.no : ''} successfully deleted!`, severity: 'success'})
                                }}
                                onShowMoreInfo={() => {
                                    setFocusedItem(item);
                                    setShowMoreInformationDialog(true);
                                }}
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
            content={<img src={focusedItem?.image_url} alt="bricklink-img" />} />
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