import React, {FunctionComponent, useState} from "react";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField} from "@mui/material";
import NewUsedToggleButton from "../NewUsedToggleButton/NewUsedToggleButton";
import {formatCurrency} from "../../../utils/CurrencyUtils";
import {FixedWidthTableCell} from "./TableComponent.styles";
import {Item} from "../../../model/item/Item";
import {Condition} from "../../../model/shared/Condition";
import ManualAdjustmentSlider from "../ManualAdjustmentSlider/ManualAdjustmentSlider";
import ImageDialog from "../../ImageDialog/ImageDialog";

interface TableComponentParams {
    items: Item[];
    setItems: (items: Item[]) => void;
    storeMode: boolean;
}

const TableComponent: FunctionComponent<TableComponentParams> = ({ items, setItems, storeMode }) => {

    const [imageModalOpen, setImageModalOpen] = useState<boolean>(false);
    const [imageUrl, setImageUrl] = useState<string>('');

    const handleConditionChange = (condition: Condition, id: number) => {
        const newItems = [...items];
        const item = newItems.at(id);
        if (item) {
            item.condition = condition;
            calculatePrice(item);
        }
        setItems(newItems);
    }

    const handleSliderChange = (event: any, id: number) => {
        const newItems = [...items];
        const item = newItems.at(id);
        if (item) {
            item.valueAdjustment = event.target.value;
            calculatePrice(item);
        }
        setItems(newItems);
    }

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
    }

    return (
        <>
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <FixedWidthTableCell width={80} />
                            <FixedWidthTableCell width={80}>ID</FixedWidthTableCell>
                            <FixedWidthTableCell width={150}>Name</FixedWidthTableCell>
                            <FixedWidthTableCell width={50}>Year</FixedWidthTableCell>
                            <FixedWidthTableCell width={100}>Condition</FixedWidthTableCell>
                            {storeMode && (
                                <>
                                    <FixedWidthTableCell width={100}>New Sales</FixedWidthTableCell>
                                    <FixedWidthTableCell width={100}>Used Sales</FixedWidthTableCell>
                                </>
                            )}
                            <FixedWidthTableCell width={100}>Trade-In Value</FixedWidthTableCell>
                            {storeMode && <FixedWidthTableCell width={200}>Manual Adjustment</FixedWidthTableCell>}
                            <TableCell>Notes/Comments</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map(item => (
                            <TableRow key={item.id}>
                                <TableCell className={"clickable"}><img alt="bricklink-set-img" src={item.thumbnail_url} onClick={() => {
                                    setImageUrl(item.image_url);
                                    setImageModalOpen(true);
                                }}/></TableCell>
                                <TableCell>{item.no}</TableCell>
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
                                <TableCell>{formatCurrency(item.value)}</TableCell>
                                {storeMode && (
                                    <TableCell>
                                        <ManualAdjustmentSlider item={item} handleSliderChange={handleSliderChange}/>
                                    </TableCell>
                                )}
                                <TableCell>
                                    <TextField value={item.notes} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <ImageDialog open={imageModalOpen} imageUrl={imageUrl} onClose={() => {
                setImageModalOpen(false);
                setImageUrl('');
            }}/>
        </>
    );
}

export default TableComponent;