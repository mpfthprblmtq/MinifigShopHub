import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {Table, TableBody, tableCellClasses, TableContainer, TableRow} from "@mui/material";
import {FixedWidthColumnHeading} from "../Table/TableComponent/TableComponent.styles";
import {Item} from "../../../model/item/Item";
import {formatCurrency, launderMoney} from "../../../utils/CurrencyUtils";
import ManualTotalAdjustmentSlider from "./ManualTotalAdjustmentSlider";
import CurrencyTextInput from "../../_shared/CurrencyTextInput/CurrencyTextInput";
import {useSelector} from "react-redux";
import {Configuration} from "../../../model/dynamo/Configuration";
import { Total } from "../../../model/total/Total";

interface TotalsSectionParams {
    total: Total;
    setTotal: (total: Total) => void;
    items: Item[];
    storeMode: boolean;
    setOverrideRowAdjustments: (override: boolean) => void;
    overrideTotalAdjustments: boolean;
}

const Totals = forwardRef(({total, setTotal, items, storeMode, setOverrideRowAdjustments, overrideTotalAdjustments}: TotalsSectionParams, totalsRef) => {

    useImperativeHandle(totalsRef, () => {
        return { resetTotalsCalculations: resetCalculations };
    });

    const [value, setValue] = useState<number>(total.value ?? 0);
    const [valueDisplay, setValueDisplay] = useState<string>(formatCurrency(total.value) ?? '');
    const [valueAdjustment, setValueAdjustment] = useState<number>(total.valueAdjustment ?? 50);
    const [baseValue, setBaseValue] = useState<number>(total.baseValue ?? 0);
    const [storeCreditValue, setStoreCreditValue] = useState<string>(formatCurrency(total.storeCreditValue) ?? '');

    const configuration: Configuration = useSelector((state: any) => state.configurationStore.configuration);

    useEffect(() => {
        const calculatedValue: number = items.reduce((sum, item) => sum + item.value, 0);
        const calculatedBaseValue: number = items.reduce((sum, item) => sum + item.baseValue, 0);
        setValue(calculatedValue);
        setBaseValue(calculatedBaseValue);
        // eslint-disable-next-line
    }, [items]);

    useEffect(() => {
        setValueDisplay(formatCurrency(value).toString().substring(1));
        const calculatedStoreCreditValue = (configuration.storeCreditValueAdjustment / 100) * value;
        setStoreCreditValue(formatCurrency(calculatedStoreCreditValue).toString().substring(1));

        setTotal({value: value, baseValue: baseValue, valueAdjustment: valueAdjustment, storeCreditValue: calculatedStoreCreditValue})
        // eslint-disable-next-line
    }, [value, valueAdjustment]);

    const resetCalculations = () => {
        setValue(baseValue * (configuration.autoAdjustmentPercentageUsed / 100));
        setValueDisplay(formatCurrency(baseValue * 0.5).toString().substring(1));
        setStoreCreditValue(formatCurrency((configuration.storeCreditValueAdjustment / 100) * value).toString().substring(1));
        setValueAdjustment(50);
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
        const launderedValue: number = launderMoney(event.target.value);
        const calculatedAdjustment: number = Math.round((launderedValue / baseValue) * 100);
        setValue(launderedValue);
        setValueDisplay(formatCurrency(launderedValue));
        setValueAdjustment(calculatedAdjustment);

        const adjustmentSet = new Set(items.map(item => item.valueAdjustment));
        if (adjustmentSet.size === 1 && adjustmentSet.values().next().value === calculatedAdjustment) {
            setOverrideRowAdjustments(false);
        } else {
            setOverrideRowAdjustments(true);
        }
    };

    const handleSliderChange = (event: any) => {
        setValueAdjustment(event.target.value);
        setValue(baseValue * (event.target.value / 100));
        const adjustmentSet = new Set(items.map(item => item.valueAdjustment));
        if (adjustmentSet.size === 1 && adjustmentSet.values().next().value === event.target.value) {
            setOverrideRowAdjustments(false);
        } else {
            setOverrideRowAdjustments(true);
        }
    };

    return (
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
                                <CurrencyTextInput value={valueDisplay} onChange={handleValueChange} onBlur={handleValueBlur} readonly={overrideTotalAdjustments} />
                            </div>
                        </FixedWidthColumnHeading>
                        {storeMode &&
                            <FixedWidthColumnHeading width={200}>
                                <ManualTotalAdjustmentSlider value={valueAdjustment} handleSliderChange={handleSliderChange} disabled={overrideTotalAdjustments}/>
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
    );
});

export default React.memo(Totals);