import React, {FunctionComponent, useState} from "react";
import {Table, TableBody, TableContainer, TableHead, TableRow} from "@mui/material";
import NewUsedToggleButtonCell from "../TableCells/NewUsedToggleButtonCell";
import {formatCurrency, launderMoney} from "../../../utils/CurrencyUtils";
import {FixedWidthColumnHeading, StyledTableCell} from "./TableComponent.styles";
import {Item} from "../../../model/item/Item";
import {Condition} from "../../../model/shared/Condition";
import ManualValueAdjustmentSliderCell from "../TableCells/ManualValueAdjustmentSliderCell";
import ImageDialog from "../../Dialog/ImageDialog/ImageDialog";
import {getItemWithId} from "../../../utils/ArrayUtils";
import ItemCommentCell from "../TableCells/ItemCommentCell";
import ConfirmItemDeleteDialog from "../../Dialog/ConfirmDialog/ConfirmItemDeleteDialog";
import MoreInformationDialog from "../../Dialog/MoreInformationDialog/MoreInformationDialog";
import ImageCell from "../TableCells/ImageCell";
import SetNumberCell from "../TableCells/SetNumberCell";
import YearAvailabilityCell from "../TableCells/YearAvailabilityCell";
import BrickLinkSalesCells from "../TableCells/BrickLinkSalesCells";
import ValueCell from "../TableCells/ValueCell";
import IconsCell from "../TableCells/IconsCell";
import {Availability} from "../../../model/salesStatus/Availability";

interface TableComponentParams {
    items: Item[];
    setItems: (items: Item[]) => void;
    storeMode: boolean;
}

const TableComponent: FunctionComponent<TableComponentParams> = ({ items, setItems, storeMode }) => {

    const [focusedItem, setFocusedItem] = useState<Item>();
    const [showImageDialog, setShowImageDialog] = useState<boolean>(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
    const [showMoreInformationDialog, setShowMoreInformationDialog] = useState<boolean>(false);

    /**
     * Event handler for the change event on the value adjustment slider
     * @param condition the condition value to set
     * @param id the id of the item to modify
     */
    const handleConditionChange = (condition: Condition, id: number) => {
        if (condition) {
            const newItems = [...items];
            const item = getItemWithId(newItems, id);
            if (item) {
                item.condition = condition;
                calculatePrice(item);
            }
            setItems(newItems);
        }
    };

    /**
     * Event handler for the change event on the value adjustment slider
     * @param event the event to capture
     * @param id the id of the item to modify
     */
    const handleSliderChange = (event: any, id: number) => {
        const newItems = [...items];
        const item = getItemWithId(newItems, id);
        if (item) {
            item.valueAdjustment = event.target.value;
            calculatePrice(item);
        }
        setItems(newItems);
    };

    /**
     * Event handler for the change event on the value text field, just sets the value
     * @param event the event to capture
     * @param id the id of the item to modify
     */
    const handleValueChange = (event: any, id: number) => {
        const newItems = [...items];
        const item = getItemWithId(newItems, id);
        if (item) {
            item.value = launderMoney(event.target.value);
            item.valueDisplay = event.target.value;
            calculateAdjustment(item);
        }
        setItems(newItems);
    };

    /**
     * Event handler for the blur event on the value text field, just cleans up the value display mostly
     * @param event the event to capture
     * @param id the id of the item to modify
     */
    const handleValueBlur = (event: any, id: number) => {
        const newItems = [...items];
        const item = getItemWithId(newItems, id);
        if (item) {
            item.valueDisplay = formatCurrency(launderMoney(event.target.value));
        }
        setItems(newItems);
    };

    /**
     * Helper function that calculates the price based on the condition and value adjustment.  Calculates the value,
     * baseValue, and valueDisplay.
     * @param item the item to check
     */
    const calculatePrice = (item: Item) => {
        // if the set is still available at retail
        if (item.salesStatus?.availability === Availability.RETAIL && item.salesStatus.retailPrice) {
            // if the set is used, use BrickLink data to set value
            if (item.condition === Condition.USED) {
                item.value = item.usedSold?.avg_price ?
                    +item.usedSold.avg_price * +process.env.REACT_APP_AUTO_ADJUST_VALUE_USED! : 0;
            // else if the set is new, use MSRP to set value
            } else if (item.condition === Condition.NEW) {
                item.value = item.salesStatus.retailPrice * (+process.env.REACT_APP_AUTO_ADJUST_VALUE_NEW!);
            }
            item.baseValue = item.value;

        // if the set is retired
        } else {
            // if the set is used
            if (item.condition === Condition.USED && item.usedSold) {
                item.value = item.usedSold?.avg_price ?
                    +item.usedSold.avg_price * +process.env.REACT_APP_AUTO_ADJUST_VALUE_USED! : 0;
                item.baseValue = item.value;
            // else if the set is new
            } else if (item.condition === Condition.NEW && item.newSold) {
                item.value = item.newSold?.avg_price ?
                    +item.newSold.avg_price * +process.env.REACT_APP_AUTO_ADJUST_VALUE_NEW! : 0;
                item.baseValue = item.value;
            }
        }

        if (item.valueAdjustment === 0) {
            item.value = item.baseValue;
        } else {
            item.value = item.baseValue + (item.baseValue * (item.valueAdjustment/100));
        }
        item.valueDisplay = formatCurrency(item.value)!.toString().substring(1);
    };

    /**
     * Helper function that calculates the value adjustment by taking the value and baseValue and returning a percentage
     * of the difference between the two
     * @param item the item to check
     */
    const calculateAdjustment = (item: Item) => {
        if (item.value < item.baseValue) {
            item.valueAdjustment = ((item.value / item.baseValue) - 1) * 100;
        } else if (item.value > item.baseValue) {
            item.valueAdjustment = ((item.value - item.baseValue) / item.baseValue) * 100;
        }
        // account for tiny values because math is dumb
        if (item.valueAdjustment < 0.001 && item.valueAdjustment > -0.001) {
            item.valueAdjustment = 0;
        }
    };

    const handleCommentChange = (comment: string, id: number) => {
        const newItems = [...items];
        const item = getItemWithId(newItems, id);
        if (item) {
            item.comment = comment;
        }
        setItems(newItems);
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
                                <NewUsedToggleButtonCell item={item} handleConditionChange={handleConditionChange} />
                                {storeMode && (
                                    <BrickLinkSalesCells item={item} />
                                )}
                                <ValueCell
                                    item={item}
                                    handleValueBlur={handleValueBlur}
                                    handleValueChange={handleValueChange}
                                    storeMode={storeMode} />
                                {storeMode && (
                                    <ManualValueAdjustmentSliderCell item={item} handleSliderChange={handleSliderChange}/>
                                )}
                                <ItemCommentCell item={item} storeMode={storeMode} handleCommentChange={handleCommentChange}/>
                                {storeMode && (
                                    <IconsCell
                                        item={item}
                                        onDelete={() => {
                                            setFocusedItem(item);
                                            setShowDeleteDialog(true);
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
            <ImageDialog open={showImageDialog && focusedItem !== undefined} item={focusedItem!} onClose={() => {
                setFocusedItem(undefined);
                setShowImageDialog(false);
            }}/>
            <ConfirmItemDeleteDialog
                open={showDeleteDialog && focusedItem !== undefined}
                item={focusedItem}
                onCancel={() => {
                    setFocusedItem(undefined);
                    setShowDeleteDialog(false);
                }}
                deleteRow={(id: number) => {
                    setItems([...items].filter(item => item.id !== id));
                    setFocusedItem(undefined);
                    setShowDeleteDialog(false);
                }} />
            <MoreInformationDialog
                open={showMoreInformationDialog && focusedItem !== undefined}
                onClose={() => {
                    setFocusedItem(undefined);
                    setShowMoreInformationDialog(false);
                }}
                item={focusedItem} />
        </>
    );
}

export default TableComponent;