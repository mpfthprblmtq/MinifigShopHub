import React, { FunctionComponent, useEffect, useState } from "react";
import { Table, TableBody, tableCellClasses, TableContainer, TableRow } from "@mui/material";
import { FixedWidthColumnHeading } from "../Table/TableComponent/TableComponent.styles";
import { Item } from "../../../model/item/Item";
import { formatCurrency, launderMoney } from "../../../utils/CurrencyUtils";
import CurrencyTextInput from "../../_shared/CurrencyTextInput/CurrencyTextInput";
import { useDispatch, useSelector } from "react-redux";
import { Configuration } from "../../../model/dynamo/Configuration";
import { Total } from "../../../model/total/Total";
import { Quote } from "../../../model/quote/Quote";
import {
    updateQuoteInStore,
    updateTotalInStore
} from "../../../redux/slices/quoteSlice";
import ValueAdjustmentSlider from "../../_shared/ValueAdjustmentSlider/ValueAdjustmentSlider";

interface TotalsSectionParams {
    items: Item[];
    storeMode: boolean;
    totalAdjustmentDisabled: boolean;
    setRowAdjustmentsDisabled: (rowAdjustmentsDisabled: boolean) => void;
}

const Totals: FunctionComponent<TotalsSectionParams> = ({ items, storeMode }) => {

    const configuration: Configuration = useSelector((state: any) => state.configurationStore.configuration);
    const quote: Quote = useSelector((state: any) => state.quoteStore.quote);
    const dispatch = useDispatch();

    const [baseValueDisplay, setBaseValueDisplay] = useState<string>(formatCurrency(quote.total.baseValue) ?? '');
    const [valueDisplay, setValueDisplay] = useState<string>(formatCurrency(quote.total.value) ?? '');
    const [storeCreditValueDisplay, setStoreCreditValueDisplay] = useState<string>(formatCurrency(quote.total.storeCreditValue) ?? '');
    const [sliderDisabled, setSliderDisabled] = useState<boolean>(false);
    const [sliderValue, setSliderValue] = useState<number>(quote.total.valueAdjustment);

    useEffect(() => {
        // calculate adjustment
        let calculatedAdjustment: number;
        const adjustmentSet = new Set(items.map(item => item.valueAdjustment));
        if (adjustmentSet.size > 1) {
            setSliderDisabled(true);
            calculatedAdjustment = 0;
        } else {
            calculatedAdjustment = adjustmentSet.values().next().value;
        }

        // calculate values
        const calculatedBaseValue: number = Math.round(items.reduce((sum, item) => sum + item.baseValue, 0));
        let calculatedValue: number = items.length > 1 ?
          items.reduce((sum, item) => sum + Math.round(item.value), 0) : items[0].value;
        let calculatedStoreCreditValue: number = Math.round(calculatedValue * (configuration.storeCreditValueAdjustment / 100));
        // need to check what state we're in at this point for the value and store credit value
        if (Math.round(calculatedValue) !== launderMoney(valueDisplay) && launderMoney(valueDisplay) !== 0) {
            // if the calculated value isn't equal to the value being displayed and the value display isn't 0
            // then the value being displayed should override the calculated value, since that's probably changed via
            // typing a total value in manually
            calculatedValue = launderMoney(valueDisplay);
            calculatedStoreCreditValue = launderMoney(storeCreditValueDisplay);
        } else {
            // else if the calculated value is equal to the display value
            // then we can recalculate the value
            calculatedValue = Math.round(calculatedValue !== Math.round(calculatedBaseValue * (calculatedAdjustment / 100)) ?
              calculatedBaseValue * (calculatedAdjustment / 100) : calculatedValue);
        }

        // send it to store
        const updatedTotal = {
            value: calculatedValue,
            baseValue: calculatedBaseValue,
            storeCreditValue: calculatedStoreCreditValue,
            valueAdjustment: calculatedAdjustment
        } as Total;
        dispatch(updateTotalInStore(updatedTotal));

        // set the display values
        setValueDisplay(formatCurrency(calculatedValue).toString().substring(1));
        setBaseValueDisplay(formatCurrency(calculatedBaseValue).toString().substring(1));
        setStoreCreditValueDisplay(formatCurrency(calculatedStoreCreditValue).toString().substring(1));
        // eslint-disable-next-line
    }, [items]);

    const handleValueBlur = (event: any) => {
        const adjustment: number = Math.round((+valueDisplay / +baseValueDisplay) * 100);
        setSliderValue(adjustment);
        setValueDisplay(formatCurrency(launderMoney(event.target.value)));
        updateAllValues(adjustment);
    }

    const handleSliderChange = (event: any) => {
        setSliderValue(event.target.value);

        // calculate the values
        const calculatedValue: number = Math.round((event.target.value / 100) * quote.total.baseValue);
        const calculatedStoreCreditValue: number = Math.round(calculatedValue * (configuration.storeCreditValueAdjustment / 100));

        // set the display values
        setValueDisplay(formatCurrency(calculatedValue).substring(1));
        setStoreCreditValueDisplay(formatCurrency(calculatedStoreCreditValue).substring(1));
    }

    const handleSliderChangeCommitted = async (event: any) => {
        const adjustment: number = +event.target.textContent.replace('%', '');
        updateAllValues(adjustment);
    }

    const handleStoreCreditValueBlur = (event: any) => {
        dispatch(updateTotalInStore({
            ...quote.total,
            storeCreditValue: launderMoney(event.target.value)
        } as Total));
        setStoreCreditValueDisplay(formatCurrency(launderMoney(event.target.value)));
    }

    const updateAllValues = (adjustment: number) => {
        const updatedItems = items.map(item => ({
            ...item,
            valueAdjustment: adjustment,
            value: Math.round(item.baseValue * (adjustment / 100))
        }));
        const calculatedStoreCreditValue =
          launderMoney(valueDisplay) * (configuration.storeCreditValueAdjustment / 100);
        setStoreCreditValueDisplay(formatCurrency(calculatedStoreCreditValue));
        dispatch(updateQuoteInStore({
            items: updatedItems,
            total: {
                ...quote.total,
                value: launderMoney(valueDisplay),
                valueAdjustment: adjustment,
                storeCreditValue: calculatedStoreCreditValue
            }
        } as Quote))
    };

    // useEffect(() => {
    //     const calculatedBaseValue: number = Math.round(items.reduce((sum, item) => sum + item.baseValue, 0));
    //     let calculatedValue: number;
    //     if (items.length > 1) {
    //         calculatedValue = totalAdjustmentDisabled ? items.reduce((sum, item) => sum + item.value, 0) :
    //           Math.round(calculatedBaseValue * (quote.total.valueAdjustment / 100));
    //     } else {
    //         calculatedValue = items.reduce((sum, item) => sum + item.value, 0);
    //     }
    //     const calculatedStoreCreditValue: number = calculatedValue * (configuration.storeCreditValueAdjustment / 100);
    //
    //     setValueDisplay(formatCurrency(calculatedValue).toString().substring(1));
    //     setBaseValueDisplay(formatCurrency(calculatedBaseValue).toString().substring(1));
    //
    //     dispatch(updateTotalInStore({...quote.total, value: calculatedValue, baseValue: calculatedBaseValue, storeCreditValue: calculatedStoreCreditValue} as Total));
    //     // eslint-disable-next-line
    // }, [items, totalAdjustmentDisabled]);
    //
    // /**
    //  * Event handler for the change event on the value text field, just sets the value
    //  * @param event the event to capture
    //  */
    // const handleValueChange = (event: any) => {
    //     setValueDisplay(event.target.value);
    //     setStoreCreditValueDisplay(formatCurrency(Math.round(event.target.value * (configuration.storeCreditValueAdjustment / 100))));
    // };
    //
    // /**
    //  * Event handler for the blur event on the value text field, just cleans up the value display mostly
    //  * @param event the event to capture
    //  */
    // const handleValueBlur = (event: any) => {
    //     if (!totalAdjustmentDisabled) {
    //         const launderedValue: number = launderMoney(event.target.value);
    //         const calculatedAdjustment: number = Math.round((launderedValue / quote.total.baseValue) * 100);
    //         const calculatedStoreCreditValue: number = Math.round(launderMoney(event.target.value) * (configuration.storeCreditValueAdjustment / 100));
    //         setValueDisplay(formatCurrency(launderedValue));
    //         setStoreCreditValueDisplay(formatCurrency(calculatedStoreCreditValue));
    //
    //         // if (quote.total.value !== launderedValue) {
    //             dispatch(updateTotalInStore({...quote.total, value: launderedValue, valueAdjustment: calculatedAdjustment, storeCreditValue: calculatedStoreCreditValue} as Total));
    //             const adjustmentSet = new Set(items.map(item => item.valueAdjustment));
    //             setRowAdjustmentsDisabled(adjustmentSet.size === 1 && adjustmentSet.values().next().value !== event.target.value);
    //         // }
    //
    //         if (items.length === 1) {
    //             const itemCopy = {...getItemWithId(items, items.at(0)?.id ?? -1)} as Item;
    //             if (itemCopy) {
    //                 itemCopy.value = launderedValue;
    //                 itemCopy.valueAdjustment = calculatedAdjustment;
    //             }
    //             dispatch(updateItem(itemCopy));
    //         }
    //     }
    // };
    //
    // const handleStoreCreditValueChange = (event: any) => {
    //     setStoreCreditValueDisplay(formatCurrency(event.target.value));
    // }
    //
    // const handleStoreCreditValueBlur = (event: any) => {
    //     const launderedValue: number = launderMoney(event.target.value);
    //     setStoreCreditValueDisplay(formatCurrency(launderedValue));
    //
    //     dispatch(updateTotalInStore({...quote.total, storeCreditValue: launderedValue} as Total));
    // }
    //
    // const handleSliderChange = (event: any) => {
    //     const calculatedValue = Math.round(quote.total.baseValue * (event.target.value / 100));
    //     const calculatedStoreCreditValue = calculatedValue * (configuration.storeCreditValueAdjustment / 100);
    //     setValueDisplay(formatCurrency(calculatedValue));
    //     setStoreCreditValueDisplay(formatCurrency(calculatedStoreCreditValue));
    //
    //     dispatch(updateTotalInStore({...quote.total, value: calculatedValue, valueAdjustment: event.target.value, storeCreditValue: calculatedStoreCreditValue} as Total));
    //     const adjustmentSet = new Set(items.map(item => item.valueAdjustment));
    //     setRowAdjustmentsDisabled(adjustmentSet.size === 1 && adjustmentSet.values().next().value !== event.target.value);
    //
    //     const itemsCopy: Item[] = _.cloneDeep(items);
    //     itemsCopy.forEach(item => {
    //         item.valueAdjustment = event.target.value;
    //         item.value = Math.round(item.baseValue * (event.target.value / 100));
    //     });
    //     dispatch(updateItemsInStore(itemsCopy));
    // };

    return (
      <TableContainer style={{width: "100%", paddingTop: "20px", marginLeft: '-10px'}}>
          <Table size="small"
                 sx={{
                     [`& .${tableCellClasses.root}`]: {
                         borderBottom: "none"
                     }
                 }}>
              <TableBody>
                  <TableRow>
                      <FixedWidthColumnHeading width={100} />
                      <FixedWidthColumnHeading width={110} />
                      <FixedWidthColumnHeading width={160} />
                      {storeMode && (
                        <>
                            <FixedWidthColumnHeading width={140} />
                            <FixedWidthColumnHeading width={140}>
                                Total Value
                            </FixedWidthColumnHeading>
                        </>
                      )}
                      <FixedWidthColumnHeading width={120}>
                          Total (Cash)
                      </FixedWidthColumnHeading>
                      {storeMode &&
                        <FixedWidthColumnHeading width={250}>
                            Total Adjustment
                        </FixedWidthColumnHeading>
                      }
                      <FixedWidthColumnHeading width={200} sx={{padding: '20px'}}>
                          Total (Store Credit)
                      </FixedWidthColumnHeading>
                  </TableRow>
                  <TableRow>
                      <FixedWidthColumnHeading />
                      <FixedWidthColumnHeading />
                      <FixedWidthColumnHeading />
                      {storeMode && (
                        <>
                            <FixedWidthColumnHeading />
                            <FixedWidthColumnHeading>
                                <div style={{width: "120px", minWidth: "120px", maxWidth: "120px"}}>
                                    <CurrencyTextInput
                                      value={baseValueDisplay}
                                      onChange={() => {}}
                                      readonly />
                                </div>
                            </FixedWidthColumnHeading>
                        </>
                      )}
                      <FixedWidthColumnHeading>
                          <div style={{width: "120px", minWidth: "120px", maxWidth: "120px"}}>
                              <CurrencyTextInput
                                value={valueDisplay}
                                onChange={(event) => setValueDisplay(event.target.value)}
                                onBlur={handleValueBlur}
                                readonly={sliderDisabled} />
                          </div>
                      </FixedWidthColumnHeading>
                      {storeMode &&
                        <FixedWidthColumnHeading>
                            <ValueAdjustmentSlider
                              value={sliderValue}
                              handleSliderChange={handleSliderChange}
                              handleSliderChangeCommitted={handleSliderChangeCommitted}
                              disabled={sliderDisabled}
                              sx={{marginLeft: '8px', marginRight: '10px'}}
                            />
                        </FixedWidthColumnHeading>}
                      <FixedWidthColumnHeading>
                          <div style={{width: "120px", minWidth: "120px", maxWidth: "120px", marginLeft: '20px'}}>
                              <CurrencyTextInput
                                value={storeCreditValueDisplay}
                                onChange={(event) => setStoreCreditValueDisplay(event.target.value)}
                                onBlur={handleStoreCreditValueBlur} />
                          </div>
                      </FixedWidthColumnHeading>
                  </TableRow>
              </TableBody>
          </Table>
      </TableContainer>
    );
};

export default React.memo(Totals);