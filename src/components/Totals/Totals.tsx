import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {
    Table,
    TableBody,
    tableCellClasses,
    TableContainer,
    TableRow
} from "@mui/material";
import {FixedWidthColumnHeading} from "../Table/TableComponent/TableComponent.styles";
import {Item} from "../../model/item/Item";
import {formatCurrency, launderMoney} from "../../utils/CurrencyUtils";
import ManualTotalAdjustmentSlider from "./ManualTotalAdjustmentSlider";
import CurrencyTextInput from "../_shared/CurrencyTextInput/CurrencyTextInput";

interface TotalsSectionParams {
    items: Item[];
    storeMode: boolean;
}

const Totals = forwardRef(({items, storeMode}: TotalsSectionParams, totalsRef) => {

    useImperativeHandle(totalsRef, () => {
        return {
            resetTotalsCalculations: resetCalculations
        };
    });

    const [value, setValue] = useState<number>(0);
    const [valueDisplay, setValueDisplay] = useState<string>('');
    const [valueAdjustment, setValueAdjustment] = useState<number>(0);
    const [baseValue, setBaseValue] = useState<number>(0);
    const [storeCreditValue, setStoreCreditValue] = useState<string>('');

    useEffect(() => {
        setValue(items.reduce((sum, item) => sum + item.value, 0));
        setBaseValue(items.reduce((sum, item) => sum + item.baseValue, 0));
    }, [items]);

    useEffect(() => {
        setValueDisplay(formatCurrency(value).toString().substring(1));
        setStoreCreditValue(formatCurrency(+process.env.REACT_APP_STORE_CREDIT_ADJUSTMENT! * value).toString().substring(1));
        calculateAdjustment();
        // eslint-disable-next-line
    }, [value]);

    const resetCalculations = () => {
        setValue(baseValue);
        setValueDisplay(formatCurrency(value).toString().substring(1));
        setStoreCreditValue(formatCurrency(+process.env.REACT_APP_STORE_CREDIT_ADJUSTMENT! * value).toString().substring(1));
        setValueAdjustment(0);
    };

    /**
     * Event handler for the change event on the value text field, just sets the value
     * @param event the event to capture
     */
    const handleValueChange = (event: any) => {
        setValueDisplay(event.target.value);
    };

    /**
     * Event handler for the blur event on the value text field, just cleans up the value display mostly
     * @param event the event to capture
     */
    const handleValueBlur = (event: any) => {
        setValue(launderMoney(event.target.value));
        setValueDisplay(formatCurrency(event.target.value).toString().substring(1));
    };

    const handleSliderChange = (event: any) => {
        setValueAdjustment(event.target.value);
        calculateTotal();
    };

    const handleSliderChangeCommitted = () => {
        calculateTotal();
    }

    const calculateTotal = () => {
        if (valueAdjustment === 0) {
            setValue(baseValue);
        } else {
            setValue(baseValue + (baseValue * (valueAdjustment/100)));
        }
    };

    const calculateAdjustment = () => {
        if (value < baseValue) {
            setValueAdjustment(((value / baseValue) - 1) * 100);
        } else if (value > baseValue) {
            setValueAdjustment(((value - baseValue) / baseValue) * 100);
        }
    };

    return (
        <>
            <TableContainer style={{width: "100%", paddingTop: "40px"}}>
                <Table size="small"
                    sx={{
                        [`& .${tableCellClasses.root}`]: {
                            borderBottom: "none"
                        }
                    }}>
                    <TableBody>
                        <TableRow>
                            <FixedWidthColumnHeading width={80} />
                            <FixedWidthColumnHeading width={80} />
                            <FixedWidthColumnHeading width={150} />
                            <FixedWidthColumnHeading width={50} />
                            <FixedWidthColumnHeading width={110} />
                            {storeMode && (
                                <>
                                    <FixedWidthColumnHeading width={100} />
                                    <FixedWidthColumnHeading width={100} />
                                </>
                            )}
                            <FixedWidthColumnHeading width={120}>
                                Total (Cash)
                            </FixedWidthColumnHeading>
                            {storeMode &&
                                <FixedWidthColumnHeading width={200}>
                                    Total Adjustment
                                </FixedWidthColumnHeading>
                            }
                            <FixedWidthColumnHeading width={200}>
                                Total (Store Credit)
                            </FixedWidthColumnHeading>
                            <FixedWidthColumnHeading width={50} />
                        </TableRow>
                        <TableRow>
                            <FixedWidthColumnHeading width={80} />
                            <FixedWidthColumnHeading width={80} />
                            <FixedWidthColumnHeading width={150} />
                            <FixedWidthColumnHeading width={50} />
                            <FixedWidthColumnHeading width={110} />
                            {storeMode && (
                                <>
                                    <FixedWidthColumnHeading width={100} />
                                    <FixedWidthColumnHeading width={100} />
                                </>
                            )}
                            <FixedWidthColumnHeading width={120}>
                                <div style={{width: "120px", minWidth: "120px", maxWidth: "120px"}}>
                                    <CurrencyTextInput value={valueDisplay} onChange={handleValueChange} onBlur={handleValueBlur} />
                                </div>
                            </FixedWidthColumnHeading>
                            {storeMode &&
                                <FixedWidthColumnHeading width={200}>
                                    <ManualTotalAdjustmentSlider value={valueAdjustment} handleSliderChange={handleSliderChange} handleSliderChangeCommitted={handleSliderChangeCommitted}/>
                                </FixedWidthColumnHeading>}
                            <FixedWidthColumnHeading width={200}>
                                <div style={{width: "120px", minWidth: "120px", maxWidth: "120px"}}>
                                    <CurrencyTextInput value={storeCreditValue} onChange={() => {}} onBlur={() => {}} readonly/>
                                </div>
                            </FixedWidthColumnHeading>
                            <FixedWidthColumnHeading width={100} />
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
});

export default Totals;