import React, { FunctionComponent, useEffect, useState } from "react";
import {Table, TableBody, tableCellClasses, TableContainer, TableRow} from "@mui/material";
import {FixedWidthColumnHeading} from "../Table/TableComponent/TableComponent.styles";
import {Item} from "../../../model/item/Item";
import {formatCurrency, launderMoney} from "../../../utils/CurrencyUtils";
import CurrencyTextInput from "../../_shared/CurrencyTextInput/CurrencyTextInput";
import { useDispatch, useSelector } from "react-redux";
import {Configuration} from "../../../model/dynamo/Configuration";
import { Total } from "../../../model/total/Total";
import { Quote } from "../../../model/quote/Quote";
import { updateTotalInStore } from "../../../redux/slices/quoteSlice";
import ValueAdjustmentSlider from "../../_shared/ValueAdjustmentSlider/ValueAdjustmentSlider";

interface TotalsSectionParams {
    items: Item[];
    storeMode: boolean;
    totalAdjustmentDisabled: boolean;
    setRowAdjustmentsDisabled: (rowAdjustmentsDisabled: boolean) => void;
}

const Totals: FunctionComponent<TotalsSectionParams> = ({ items, storeMode, totalAdjustmentDisabled, setRowAdjustmentsDisabled}) => {

    const configuration: Configuration = useSelector((state: any) => state.configurationStore.configuration);
    const quote: Quote = useSelector((state: any) => state.quoteStore.quote);
    const dispatch = useDispatch();

    const [valueDisplay, setValueDisplay] = useState<string>(formatCurrency(quote.total.value) ?? '');
    const [storeCreditValueDisplay, setStoreCreditValueDisplay] = useState<string>(formatCurrency(quote.total.storeCreditValue) ?? '');

    useEffect(() => {
        const calculatedValue: number = items.reduce((sum, item) => sum + item.value, 0);
        const calculatedBaseValue: number = items.reduce((sum, item) => sum + item.baseValue, 0);
        const calculatedStoreCreditValue = Math.round((configuration.storeCreditValueAdjustment / 100) * quote.total.value);
        setStoreCreditValueDisplay(formatCurrency(calculatedStoreCreditValue).toString().substring(1));
        setValueDisplay(formatCurrency(calculatedValue).toString().substring(1));

        dispatch(updateTotalInStore({...quote.total, value: calculatedValue, baseValue: calculatedBaseValue, storeCreditValue: calculatedStoreCreditValue} as Total));
        // eslint-disable-next-line
    }, [items]);

    /**
     * Event handler for the change event on the value text field, just sets the value
     * @param event the event to capture
     */
    const handleValueChange = (event: any) => {
        setValueDisplay(event.target.value);
        setStoreCreditValueDisplay(formatCurrency(Math.round(event.target.value * (configuration.storeCreditValueAdjustment / 100))));
    };

    /**
     * Event handler for the blur event on the value text field, just cleans up the value display mostly
     * @param event the event to capture
     */
    const handleValueBlur = (event: any) => {
        const launderedValue: number = launderMoney(event.target.value);
        const calculatedAdjustment: number = Math.round((launderedValue / quote.total.baseValue) * 100);
        const calculatedStoreCreditValue: number = Math.round(launderMoney(event.target.value) * (configuration.storeCreditValueAdjustment / 100));
        setValueDisplay(formatCurrency(launderedValue));
        setStoreCreditValueDisplay(formatCurrency(calculatedStoreCreditValue));

        dispatch(updateTotalInStore({...quote.total, value: launderedValue, valueAdjustment: calculatedAdjustment, storeCreditValue: calculatedStoreCreditValue} as Total));
        const adjustmentSet = new Set(items.map(item => item.valueAdjustment));
        setRowAdjustmentsDisabled(adjustmentSet.size === 1 && adjustmentSet.values().next().value !== event.target.value);
    };

    const handleSliderChange = (event: any) => {
        const calculatedValue = Math.round(quote.total.baseValue * (event.target.value / 100));
        const calculatedStoreCreditValue = calculatedValue * (configuration.storeCreditValueAdjustment / 100);
        setValueDisplay(formatCurrency(calculatedValue));
        setStoreCreditValueDisplay(formatCurrency(calculatedStoreCreditValue));

        dispatch(updateTotalInStore({...quote.total, value: calculatedValue, valueAdjustment: event.target.value, storeCreditValue: calculatedStoreCreditValue} as Total));
        const adjustmentSet = new Set(items.map(item => item.valueAdjustment));
        setRowAdjustmentsDisabled(adjustmentSet.size === 1 && adjustmentSet.values().next().value !== event.target.value);
    };

    return (
      <TableContainer style={{width: "100%", paddingTop: "40px", marginLeft: '-10px'}}>
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
                              <CurrencyTextInput
                                value={valueDisplay}
                                onChange={handleValueChange}
                                onBlur={handleValueBlur}
                                readonly={totalAdjustmentDisabled} />
                          </div>
                      </FixedWidthColumnHeading>
                      {storeMode &&
                        <FixedWidthColumnHeading width={200}>
                            <ValueAdjustmentSlider
                              value={quote.total.valueAdjustment}
                              handleSliderChange={handleSliderChange}
                              disabled={totalAdjustmentDisabled}
                              sx={{ marginLeft: '-10px' }} />
                        </FixedWidthColumnHeading>}
                      <FixedWidthColumnHeading width={200}>
                          <div style={{width: "120px", minWidth: "120px", maxWidth: "120px"}}>
                              <CurrencyTextInput value={storeCreditValueDisplay} onChange={() => {}} readonly/>
                          </div>
                      </FixedWidthColumnHeading>
                      <FixedWidthColumnHeading width={100} />
                  </TableRow>
              </TableBody>
          </Table>
      </TableContainer>
    );
};

export default React.memo(Totals);