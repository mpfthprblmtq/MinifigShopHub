import React, {FunctionComponent, useState} from "react";
import {Table, TableBody, TableContainer, TableHead, TableRow} from "@mui/material";
import NewUsedToggleButtonCell from "../TableCells/NewUsedToggleButtonCell";
import {formatCurrency, launderMoney} from "../../../../utils/CurrencyUtils";
import {FixedWidthColumnHeading, StyledTableCell} from "./TableComponent.styles";
import {Item} from "../../../../model/item/Item";
import {Condition} from "../../../../model/_shared/Condition";
import ManualValueAdjustmentSliderCell from "../TableCells/ManualValueAdjustmentSliderCell";
import {getItemWithId} from "../../../../utils/ArrayUtils";
import ItemCommentCell from "../TableCells/ItemCommentCell";
import ConfirmItemDeleteDialog from "../../Dialog/ConfirmItemDeleteDialog/ConfirmItemDeleteDialog";
import MoreInformationDialog from "../../Dialog/MoreInformationDialog/MoreInformationDialog";
import ImageCell from "../TableCells/ImageCell";
import SetNumberCell from "../TableCells/SetNumberCell";
import YearAvailabilityCell from "../TableCells/YearAvailabilityCell";
import BrickLinkSalesCells from "../TableCells/BrickLinkSalesCells";
import ValueCell from "../TableCells/ValueCell";
import IconsCell from "../TableCells/IconsCell";
import InformationDialog from "../../../_shared/InformationDialog/InformationDialog";
import {usePriceCalculationEngine} from "../../../../hooks/priceCalculation/usePriceCalculationEngine";
import {ChangeType} from "../../../../model/priceCalculation/ChangeType";
import { updateItemsInStore } from "../../../../redux/slices/quoteSlice";
import { useDispatch } from "react-redux";

interface TableComponentParams {
    items: Item[];
    setItems: (items: Item[]) => void;
    storeMode: boolean;
    disableRowAdjustmentSliders: boolean;
}

const TableComponent: FunctionComponent<TableComponentParams> = ({ items, setItems, storeMode, disableRowAdjustmentSliders }) => {

    const [focusedItem, setFocusedItem] = useState<Item>();
    const [showImageDialog, setShowImageDialog] = useState<boolean>(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
    const [showMoreInformationDialog, setShowMoreInformationDialog] = useState<boolean>(false);

    const { calculatePrice } = usePriceCalculationEngine();
    const dispatch = useDispatch();

    /**
     * Event handler for the change event on the condition selector
     * @param condition the condition value to set
     * @param id the id of the item to modify
     */
    const handleConditionChange = (condition: Condition, id: number) => {
        if (condition) {
            const newItems = [...items];
            const item = getItemWithId(newItems, id);
            if (item) {
                item.condition = condition;
                calculatePrice(item, ChangeType.CONDITION);
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
            item.valueAdjustment = +event.target.value
                .toFixed(2)
                .replace(".00", "");
            calculatePrice(item, ChangeType.ADJUSTMENT);
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
            calculatePrice(item, ChangeType.VALUE);
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
                                <NewUsedToggleButtonCell item={item} handleConditionChange={handleConditionChange} storeMode={storeMode} />
                                {storeMode && (
                                    <BrickLinkSalesCells item={item} />
                                )}
                                <ValueCell
                                    item={item}
                                    handleValueBlur={handleValueBlur}
                                    handleValueChange={handleValueChange}
                                    storeMode={storeMode} />
                                {storeMode && (
                                    <ManualValueAdjustmentSliderCell item={item} handleSliderChange={handleSliderChange} disabled={disableRowAdjustmentSliders} />
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
            <InformationDialog
                open={showImageDialog && focusedItem !== undefined}
                onClose={() => {
                    setFocusedItem(undefined);
                    setShowImageDialog(false);
                }}
                title={focusedItem?.name ?? ''}
                content={<img src={focusedItem?.image_url} alt="bricklink-img" />} />
            <ConfirmItemDeleteDialog
                open={showDeleteDialog && focusedItem !== undefined}
                item={focusedItem}
                onCancel={() => {
                    setFocusedItem(undefined);
                    setShowDeleteDialog(false);
                }}
                deleteRow={(id: number) => {
                    const filteredItems = [...items].filter(item => item.id !== id)
                    setItems(filteredItems);
                    dispatch(updateItemsInStore(filteredItems));
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

export default React.memo(TableComponent);