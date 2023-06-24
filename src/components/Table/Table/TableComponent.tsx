import React, {FunctionComponent, useState} from "react";
import {Box, Table, TableBody, TableContainer, TableHead, TableRow, Tooltip} from "@mui/material";
import NewUsedToggleButton from "../NewUsedToggleButton/NewUsedToggleButton";
import {formatCurrency, launderMoney} from "../../../utils/CurrencyUtils";
import {FixedWidthColumnHeading, StyledTableCell} from "./TableComponent.styles";
import {Item} from "../../../model/item/Item";
import {Condition} from "../../../model/shared/Condition";
import ManualValueAdjustmentSlider from "../ManualValueAdjustmentSlider/ManualValueAdjustmentSlider";
import ImageDialog from "../../Dialog/ImageDialog/ImageDialog";
import {Delete, PlaylistAdd} from "@mui/icons-material";
import {getItemWithId} from "../../../utils/ArrayUtils";
import ItemComment from "../ItemComment/ItemComment";
import ConfirmItemDeleteDialog from "../../Dialog/ConfirmDialog/ConfirmItemDeleteDialog";
import {Source} from "../../../model/shared/Source";
import MoreInformationDialog from "../../Dialog/MoreInformationDialog/MoreInformationDialog";
import {Type} from "../../../model/shared/Type";
import CurrencyTextInput from "../../_shared/CurrencyTextInput/CurrencyTextInput";
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
        const newItems = [...items];
        const item = getItemWithId(newItems, id);
        if (item) {
            item.condition = condition;
            calculatePrice(item);
        }
        setItems(newItems);
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
        if (item.condition === Condition.USED && item.usedSold) {
            item.value = item.usedSold?.avg_price ?
                +item.usedSold.avg_price * +process.env.REACT_APP_AUTO_ADJUST_VALUE! : 0;
            item.baseValue = item.value;
        } else if (item.condition === Condition.NEW && item.newSold) {
            item.value = item.newSold?.avg_price ?
                +item.newSold.avg_price * +process.env.REACT_APP_AUTO_ADJUST_VALUE! : 0;
            item.baseValue = item.value;
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

    const handleCommentChange = (event: any, id: number) => {
        const newItems = [...items];
        const item = getItemWithId(newItems, id);
        if (item) {
            item.comment = event.target.value;
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
                                <StyledTableCell className={"clickable"}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                        {item.thumbnail_url && item.image_url && (
                                            <img alt="bricklink-set-img" src={item.thumbnail_url} onClick={() => {
                                                setFocusedItem(item);
                                                setShowImageDialog(true);
                                            }}/>
                                        )}
                                        {item.source === Source.CUSTOM && item.type !== Type.OTHER && (
                                            <img src={`/assets/images/${item.type}.svg`} alt="set" width={55}/>
                                        )}
                                    </Box>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <a
                                        href={`https://www.bricklink.com/v2/catalog/catalogitem.page?${item.type === Type.SET ? 'S' : 'M'}=${item.no}#T=P`}
                                        target="_blank" rel="noreferrer">{item.no}
                                    </a>
                                </StyledTableCell>
                                <StyledTableCell>{item.name}</StyledTableCell>
                                <StyledTableCell color={item.salesStatus?.availability === Availability.RETAIL ? '#008B00' : 'black'}>
                                    {item.year_released}<br/>{item.salesStatus?.availability ?? ''}
                                </StyledTableCell>
                                <StyledTableCell>
                                    <NewUsedToggleButton item={item} handleConditionChange={handleConditionChange} />
                                </StyledTableCell>
                                {storeMode && (
                                    <>
                                        <StyledTableCell>
                                            {item.source === Source.BRICKLINK && (
                                                <Tooltip title={`Based on ${item.newSold?.unit_quantity} sales`}>
                                                    <div>
                                                        Min: {formatCurrency(item.newSold?.min_price)}<br/>
                                                        <strong>Avg: {formatCurrency(item.newSold?.avg_price)}</strong><br/>
                                                        Max: {formatCurrency(item.newSold?.max_price)}
                                                    </div>
                                                </Tooltip>
                                            )}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {item.source === Source.BRICKLINK && (
                                                <Tooltip title={`Based on ${item.usedSold?.unit_quantity} sales`}>
                                                    <div>
                                                        Min: {formatCurrency(item.usedSold?.min_price)}<br/>
                                                        <strong>Avg: {formatCurrency(item.usedSold?.avg_price)}</strong><br/>
                                                        Max: {formatCurrency(item.usedSold?.max_price)}
                                                    </div>
                                                </Tooltip>
                                            )}
                                        </StyledTableCell>
                                    </>
                                )}
                                <StyledTableCell>
                                    <CurrencyTextInput
                                        value={item.valueDisplay}
                                        onChange={(event) => handleValueChange(event, item.id)}
                                        onBlur={(event) => handleValueBlur(event, item.id)}
                                    />
                                </StyledTableCell>
                                {storeMode && (
                                    <StyledTableCell>
                                        <ManualValueAdjustmentSlider item={item} handleSliderChange={handleSliderChange}/>
                                    </StyledTableCell>
                                )}
                                <StyledTableCell>
                                    <ItemComment item={item} storeMode={storeMode} handleCommentChange={handleCommentChange}/>
                                </StyledTableCell>
                                <StyledTableCell className={"clickable"}>
                                    {storeMode && (
                                        <>
                                            <Tooltip title={"Delete Row"}>
                                                <Delete fontSize={"large"} color={"error"} style={{padding: "5px"}} onClick={() => {
                                                    setFocusedItem(item);
                                                    setShowDeleteDialog(true);
                                                }} />
                                            </Tooltip>
                                            {item.source === Source.BRICKLINK && (
                                                <Tooltip title={"More Details"}>
                                                    <PlaylistAdd fontSize={"large"} color={"primary"} style={{padding: "5px"}} onClick={() => {
                                                        setFocusedItem(item);
                                                        setShowMoreInformationDialog(true);
                                                    }}/>
                                                </Tooltip>
                                            )}
                                        </>
                                    )}
                                </StyledTableCell>
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