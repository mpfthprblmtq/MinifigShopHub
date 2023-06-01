import React, {FunctionComponent, useState} from "react";
import {
    InputAdornment,
    OutlinedInput,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import NewUsedToggleButton from "../NewUsedToggleButton/NewUsedToggleButton";
import {formatCurrency, launderMoney} from "../../../utils/CurrencyUtils";
import {FixedWidthColumnHeading} from "./TableComponent.styles";
import {Item} from "../../../model/item/Item";
import {Condition} from "../../../model/shared/Condition";
import ManualAdjustmentSlider from "../ManualAdjustmentSlider/ManualAdjustmentSlider";
import ImageDialog from "../../Dialog/ImageDialog/ImageDialog";
import {Delete} from "@mui/icons-material";
import {getItemWithId} from "../../../utils/ArrayUtils";
import ItemComment from "../ItemComment/ItemComment";
import ConfirmDialog from "../../Dialog/ConfirmDialog/ConfirmDialog";

interface TableComponentParams {
    items: Item[];
    setItems: (items: Item[]) => void;
    storeMode: boolean;
}

const TableComponent: FunctionComponent<TableComponentParams> = ({ items, setItems, storeMode }) => {

    const [imageUrl, setImageUrl] = useState<string>('');
    const [itemToDelete, setItemToDelete] = useState<Item>();

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
            item.value = launderMoney(event.target.value);
            item.valueDisplay = formatCurrency(event.target.value)!.toString().substring(1);
            calculateAdjustment(item);
        }
        setItems(newItems);
    };

    /**
     * Helper function that calculates the price based on the condition and value adjustment.  Calculates the value,
     * baseValue, and valueDisplay.
     * @param item the item to check
     */
    const calculatePrice = (item: Item) => {
        if (item.condition === Condition.USED) {
            item.value = item.usedSold?.avg_price ?
                +item.usedSold.avg_price * +process.env.REACT_APP_AUTO_ADJUST_VALUE! : 0;
        } else {
            item.value = item.newSold?.avg_price ?
                +item.newSold.avg_price * +process.env.REACT_APP_AUTO_ADJUST_VALUE! : 0;
        }
        item.baseValue = item.value;

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
            item.valueAdjustment = -100 + ((item.value / item.baseValue) * 100);
        } else if (item.value > item.baseValue) {
            item.valueAdjustment = 100 - ((item.value / item.baseValue) * 100);
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
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <FixedWidthColumnHeading width={80} />
                            <FixedWidthColumnHeading width={80}>ID</FixedWidthColumnHeading>
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
                            <FixedWidthColumnHeading width={50} />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map(item => (
                            <TableRow key={item.id}>
                                <TableCell className={"clickable"}>
                                    <img alt="bricklink-set-img" src={item.thumbnail_url} onClick={() => {
                                        setImageUrl(item.image_url);
                                    }}/>
                                </TableCell>
                                <TableCell>
                                    <a
                                        href={`https://www.bricklink.com/v2/catalog/catalogitem.page?S=${item.no}#T=P`}
                                        target="_blank" rel="noreferrer">{item.no}
                                    </a>
                                </TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.year_released}</TableCell>
                                <TableCell>
                                    <NewUsedToggleButton item={item} handleConditionChange={handleConditionChange} />
                                </TableCell>
                                {storeMode && (
                                    <>
                                        <TableCell>
                                            Min: {formatCurrency(item.newSold?.min_price)}<br/>
                                            <strong>Avg: {formatCurrency(item.newSold?.avg_price)}</strong><br/>
                                            Max: {formatCurrency(item.newSold?.max_price)}
                                        </TableCell>
                                        <TableCell>
                                            Min: {formatCurrency(item.usedSold?.min_price)}<br/>
                                            <strong>Avg: {formatCurrency(item.usedSold?.avg_price)}</strong><br/>
                                            Max: {formatCurrency(item.usedSold?.max_price)}
                                        </TableCell>
                                    </>
                                )}
                                <TableCell>
                                    <OutlinedInput
                                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                        value={item.valueDisplay}
                                        inputProps={{ inputMode: 'numeric', pattern: '[0-9,\\.]'}}
                                        onChange={(event) => handleValueChange(event, item.id)}
                                        onBlur={(event) => handleValueBlur(event, item.id)}
                                    />
                                </TableCell>
                                {storeMode && (
                                    <TableCell>
                                        <ManualAdjustmentSlider item={item} handleSliderChange={handleSliderChange}/>
                                    </TableCell>
                                )}
                                <TableCell>
                                    <ItemComment item={item} storeMode={storeMode} handleCommentChange={handleCommentChange}/>
                                </TableCell>
                                <TableCell className={"clickable"}>
                                    {storeMode && (
                                        <Delete color={"error"} onClick={() => setItemToDelete(item)} />
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <ImageDialog open={imageUrl !== ''} imageUrl={imageUrl} onClose={() => {
                setImageUrl('');
            }}/>
            <ConfirmDialog
                open={itemToDelete !== undefined}
                item={itemToDelete}
                onCancel={() => setItemToDelete(undefined)}
                deleteRow={(id: number) => {
                    setItems([...items].filter(item => item.id !== id));
                    setItemToDelete(undefined);
                }} />
        </>
    );
}

export default TableComponent;