import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Table, TableBody, tableCellClasses, TableContainer, TableRow, Tooltip } from "@mui/material";
import { FixedWidthColumnHeading } from "../Table/TableComponent/TableComponent.styles";
import { formatCurrency, launderMoney } from "../../../utils/CurrencyUtils";
import CurrencyTextInput from "../../_shared/CurrencyTextInput/CurrencyTextInput";
import { useDispatch, useSelector } from "react-redux";
import { Configuration } from "../../../model/dynamo/Configuration";
import { Total } from "../../../model/total/Total";
import { Quote } from "../../../model/quote/Quote";
import { updateTotalInStore } from "../../../redux/slices/quoteSlice";
import ValueAdjustmentSlider from "../../_shared/ValueAdjustmentSlider/ValueAdjustmentSlider";
import { Item } from "../../../model/item/Item";

interface TotalsSectionParams {
    storeMode: boolean;
    handleTotalAdjustmentChange: (adjustment: number) => void;
}

const Totals = forwardRef(({storeMode, handleTotalAdjustmentChange}: TotalsSectionParams, ref) => {

    const configuration: Configuration = useSelector((state: any) => state.configurationStore.configuration);
    const quote: Quote = useSelector((state: any) => state.quoteStore.quote);
    const dispatch = useDispatch();

    const [baseValueDisplay, setBaseValueDisplay] = useState<string>(formatCurrency(quote.total.baseValue) ?? '');
    const [valueDisplay, setValueDisplay] = useState<string>(formatCurrency(quote.total.value) ?? '');
    const [storeCreditValueDisplay, setStoreCreditValueDisplay] = useState<string>(formatCurrency(quote.total.storeCreditValue) ?? '');
    const [sliderDisabled, setSliderDisabled] = useState<boolean>(false);
    const [sliderValue, setSliderValue] = useState<number>(quote.total.valueAdjustment);

    useImperativeHandle(ref, () => ({
        updateItems: (updatedItems: Item[]) => {
            calculateValues(updatedItems);
        },
    }));

    const calculateValues = (items: Item[]) => {
        if (items.length > 0) {
            // calculate values
            const calculatedBaseValue: number = Math.round(items.reduce((sum, item) => sum + item.baseValue, 0));
            let calculatedValue: number = items.length > 1 ?
              items.reduce((sum, item) => sum + Math.round(item.value), 0) : items[0].value;
            let calculatedStoreCreditValue: number = Math.round(calculatedValue * (configuration.storeCreditValueAdjustment / 100));

            // calculate adjustment
            let calculatedAdjustment: number = sliderValue;
            const adjustmentSet = new Set(items.map(item => item.valueAdjustment));
            if (adjustmentSet.size > 1) {
                setSliderDisabled(true);
            } else {
                setSliderDisabled(false);
                calculatedAdjustment = adjustmentSet.values().next().value;
            }

            // set the display values
            setValueDisplay(formatCurrency(calculatedValue).toString().substring(1));
            setBaseValueDisplay(formatCurrency(calculatedBaseValue).toString().substring(1));
            setStoreCreditValueDisplay(formatCurrency(calculatedStoreCreditValue).toString().substring(1));
            setSliderValue(calculatedAdjustment);

            // send it to store
            const updatedTotal = {
                value: calculatedValue,
                baseValue: calculatedBaseValue,
                storeCreditValue: calculatedStoreCreditValue,
                valueAdjustment: calculatedAdjustment
            } as Total;
            dispatch(updateTotalInStore(updatedTotal));
        }
    }

    useEffect(() => {
        if (quote.items.length > 0) {
            const adjustmentSet = new Set(quote.items.map(item => item.valueAdjustment));
            if (adjustmentSet.size > 1) {
                setSliderDisabled(true);
            } else {
                setSliderDisabled(false);
            }
        }
        // eslint-disable-next-line
    }, []);

    const handleValueBlur = (event: any) => {
        const calculatedValue: number = launderMoney(event.target.value);
        const calculatedStoreCreditValue: number = Math.round(launderMoney(valueDisplay) * (configuration.storeCreditValueAdjustment / 100));
        const calculatedAdjustment: number = Math.round((launderMoney(valueDisplay) / launderMoney(baseValueDisplay)) * 100);

        setValueDisplay(formatCurrency(calculatedValue));
        setStoreCreditValueDisplay(formatCurrency(calculatedStoreCreditValue));
        setSliderValue(calculatedAdjustment);

        dispatch(updateTotalInStore({
            ...quote.total,
            value: calculatedValue,
            valueAdjustment: calculatedAdjustment,
            storeCreditValue: calculatedStoreCreditValue
        } as Total));
    }

    const handleStoreCreditValueBlur = (event: any) => {
        dispatch(updateTotalInStore({
            ...quote.total,
            storeCreditValue: launderMoney(event.target.value)
        } as Total));
        setStoreCreditValueDisplay(formatCurrency(launderMoney(event.target.value)));
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
        handleTotalAdjustmentChange(adjustment);
        dispatch(updateTotalInStore({
            ...quote.total,
            valueAdjustment: adjustment,
            value: launderMoney(valueDisplay),
            storeCreditValue: launderMoney(storeCreditValueDisplay)
        } as Total));
    }

    return (
      quote.items.length > 0 ? (
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
                              />
                          </div>
                      </FixedWidthColumnHeading>
                      {storeMode &&
                        <Tooltip title={sliderDisabled ? 'Disabled due to adjustment values not matching in table!' : ''}>
                            <FixedWidthColumnHeading>
                                <ValueAdjustmentSlider
                                  value={sliderValue}
                                  handleSliderChange={handleSliderChange}
                                  handleSliderChangeCommitted={handleSliderChangeCommitted}
                                  disabled={sliderDisabled}
                                />
                            </FixedWidthColumnHeading>
                        </Tooltip>}
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
      ) : <></>
    );
});

export default React.memo(Totals);