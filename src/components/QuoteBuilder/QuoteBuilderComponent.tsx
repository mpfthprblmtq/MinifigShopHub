import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { Item } from "../../model/item/Item";
import {
  Alert,
  Box, Portal, Snackbar
} from "@mui/material";
import TableComponent from "./Table/TableComponent/TableComponent";
import ItemSearchCard from "./Cards/ItemSearchCard/ItemSearchCard";
import CustomItemCard from "./Cards/CustomItemCard/CustomItemCard";
import Totals from "./Totals/Totals";
import BrickLinkSearchCard from "./Cards/BrickLinkSearchCard/BrickLinkSearchCard";
import { formatCurrency } from "../../utils/CurrencyUtils";
import Version from "../_shared/Version/Version";
import { Condition } from "../../model/_shared/Condition";
import SettingsDialog from "./Dialog/SettingsDialog/SettingsDialog";
import { usePriceCalculationEngine } from "../../hooks/priceCalculation/usePriceCalculationEngine";
import { ChangeType } from "../../model/priceCalculation/ChangeType";
import { useDispatch, useSelector } from "react-redux";
import { useConfigurationService } from "../../hooks/dynamo/useConfigurationService";
import { updateStoreConfiguration } from "../../redux/slices/configurationSlice";
import NavBar from "../_shared/NavBar/NavBar";
import { Tabs } from "../_shared/NavBar/Tabs";
import { Total } from "../../model/total/Total";
import { updateItemsInStore, updateQuoteInStore, updateTotalInStore } from "../../redux/slices/quoteSlice";
import _ from "lodash";
import { Configuration } from "../../model/dynamo/Configuration";
import { Quote } from "../../model/quote/Quote";
import { SnackbarState } from "../_shared/Snackbar/SnackbarState";
import { useReactToPrint } from "react-to-print";
import ItemStatisticsCard from "./Cards/ItemStatisticsCard/ItemStatisticsCard";
import SaveQuoteDialog from "./Dialog/SaveQuoteDialog/SaveQuoteDialog";
import LoadQuoteDialog from "./Dialog/LoadQuoteDialog/LoadQuoteDialog";

const QuoteBuilderComponent: FunctionComponent = () => {

  const configuration: Configuration = useSelector((state: any) => state.configurationStore.configuration);
  const quote: Quote = useSelector((state: any) => state.quoteStore.quote);
  const items = quote.items as Item[];
  const dispatch = useDispatch();

  const [storeMode, setStoreMode] = useState<boolean>(true);
  const [compressedView, setCompressedView] = useState<boolean>(false);
  const [rowAdjustmentsDisabled, setRowAdjustmentsDisabled] = useState<boolean>(false);
  const [totalAdjustmentDisabled, setTotalAdjustmentDisabled] = useState<boolean>(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState<boolean>(false);
  const [saveQuoteDialogOpen, setSaveQuoteDialogOpen] = useState<boolean>(false);
  const [loadQuoteDialogOpen, setLoadQuoteDialogOpen] = useState<boolean>(false);
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({open: false});

  const { calculatePrice } = usePriceCalculationEngine();
  const { initConfig } = useConfigurationService();

  const componentRef = useRef(null);
  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
  }, []);
  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
  });

  const resetCalculations = () => {
    const clonedItems: Item[] = _.cloneDeep(items);
    clonedItems.forEach(item => {
      item.valueAdjustment = item.condition === Condition.USED ?
        configuration.autoAdjustmentPercentageUsed : configuration.autoAdjustmentPercentageNew;
      item.value = Math.round(item.baseValue * (item.valueAdjustment / 100));
      item.valueDisplay = formatCurrency(item.value).toString().substring(1);
    });

    const calculatedValue: number = quote.total.baseValue * (configuration.autoAdjustmentPercentageUsed / 100);
    const total: Total = {
      ...quote.total,
      value: Math.floor(calculatedValue),
      valueAdjustment: configuration.autoAdjustmentPercentageUsed,
      storeCreditValue: (configuration.storeCreditValueAdjustment / 100) * calculatedValue
    };

    dispatch(updateQuoteInStore({ items: [...clonedItems], total: total } as Quote));
    setRowAdjustmentsDisabled(false);
    setTotalAdjustmentDisabled(false);

    setSnackbarState({open: true, severity: "success", message: 'Successfully reset calculations!'} as SnackbarState);
  };

  const setBulkCondition = (condition: Condition) => {
    const clonedItems: Item[] = _.cloneDeep(items);
    clonedItems.forEach(item => {
      item.condition = condition;
      calculatePrice(item, ChangeType.CONDITION);
    });
    dispatch((updateItemsInStore([...clonedItems])));
  };

  useEffect(() => {
    if (items.length > 1) {
      const adjustmentSet = new Set(items.map(item => item.valueAdjustment));
      if (adjustmentSet.size === 1 && quote.total.valueAdjustment !== adjustmentSet.values().next().value) {
        // row adjustments are all the same, and total adjustment is different, enabling total and disabling rows
        console.log('row adjustments are all the same, and total adjustment is different, enabling total and disabling rows')
        setRowAdjustmentsDisabled(true);
        setTotalAdjustmentDisabled(false);
        console.log('total value adjustment: ' + quote.total.valueAdjustment)
        console.log('row adjustment: ' + adjustmentSet.values().next().value)
      } else if (adjustmentSet.size === 1 && quote.total.valueAdjustment === adjustmentSet.values().next().value) {
        // row adjustments are all the same, and total adjustment matches, enabling both rows and total
        console.log('row adjustments are all the same, and total adjustment matches, enabling both rows and total')
        setRowAdjustmentsDisabled(false);
        setTotalAdjustmentDisabled(false);
      } else if (adjustmentSet.size > 1) {
        // adjustments are different, enabling rows, disabling totals
        console.log('adjustments are different, enabling rows, disabling totals')
        setRowAdjustmentsDisabled(false);
        setTotalAdjustmentDisabled(true);
      }
    } else {
      setRowAdjustmentsDisabled(false);
      setTotalAdjustmentDisabled(false);
    }
    // eslint-disable-next-line
  }, [items]);

  useEffect(() => {
    const initConfiguration = async () => {
      await initConfig().then(config => {
        dispatch(updateStoreConfiguration(config));
      }).catch(error => {
        console.error(error);
      });
    }
    if (!configuration.storeCreditValueAdjustment
      && !configuration.autoAdjustmentPercentageNew
      && !configuration.autoAdjustmentPercentageUsed
      && !configuration.autoAdjustmentPercentageCertifiedPreOwned
    ) {
      initConfiguration().then(() => { });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={"App quote-builder-print-configuration"}>
      <div className={"hide-in-print-preview"}>
        <NavBar
          activeTab={Tabs.QUOTE_BUILDER}
          openSettings={() => setSettingsDialogOpen(true)}
          clearAll={items.length > 0 ? () => {
            dispatch(updateItemsInStore([]));
            dispatch(updateTotalInStore({value: 0, baseValue: 0, storeCreditValue: 0, valueAdjustment: configuration.autoAdjustmentPercentageUsed} as Total));
            setSnackbarState({open: true, severity: 'success', message: 'All items cleared!'});
            setStoreMode(true);
          } : undefined}
          print={items.length > 0 ? () => {
            if (items && items.length > 0) {
              handlePrint();
            }
          } : undefined}
          saveQuote={items.length > 0 ? () => setSaveQuoteDialogOpen(true) : undefined}
          loadQuote={() => setLoadQuoteDialogOpen(true)}
          storeMode={storeMode}
          setStoreMode={items.length > 0 ? () => {
            setStoreMode(!storeMode);
            setCompressedView(false);
          } : undefined}
          compressedView={compressedView}
          setCompressedView={items.length > 0 ? () => setCompressedView(!compressedView) : undefined}
        />
      </div>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {storeMode && (
          <>
            <Box sx={{ m: 1, position: 'relative' }} className={"hide-in-print-preview"}>
              <ItemSearchCard items={items} setItems={items => dispatch(updateItemsInStore([...items]))} />
            </Box>
            <Box sx={{ m: 1, position: 'relative' }} className={"hide-in-print-preview"}>
              <CustomItemCard items={items} setItems={(items) => dispatch(updateItemsInStore([...items]))} />
            </Box>
            <Box sx={{ m: 1, position: 'relative' }} className={"hide-in-print-preview"}>
              <BrickLinkSearchCard />
            </Box>
          </>
        )}
      </Box>
      <div ref={componentRef}>
        <Box style={{ marginTop: 20 }}>
          <TableComponent
            storeMode={storeMode}
            compressedView={compressedView}
            rowAdjustmentsDisabled={rowAdjustmentsDisabled}
          />
        </Box>
        {items.length > 0 && (
          <>
            {storeMode && (
              <ItemStatisticsCard items={items} />
            )}
            <Totals
              items={items}
              storeMode={storeMode}
              totalAdjustmentDisabled={totalAdjustmentDisabled}
              setRowAdjustmentsDisabled={setRowAdjustmentsDisabled}
            />
          </>
        )}
      </div>
      <SettingsDialog
        open={settingsDialogOpen}
        onClose={() => setSettingsDialogOpen(false)}
        resetCalculations={resetCalculations}
        setBulkCondition={(condition) => { setBulkCondition(condition) }}
        actionsDisabled={items.length === 0}
      />
      <SaveQuoteDialog open={saveQuoteDialogOpen} onClose={() => setSaveQuoteDialogOpen(false)} />
      <LoadQuoteDialog open={loadQuoteDialogOpen} onClose={() => setLoadQuoteDialogOpen(false)} />
      <Version />
      <Portal>
        <Snackbar
          anchorOrigin={{ horizontal: "right", vertical: "top" }}
          autoHideDuration={5000}
          onClose={() => setSnackbarState({open: false})}
          open={snackbarState.open}>
          <Alert severity={snackbarState.severity} onClose={() => setSnackbarState({open: false})}>
            {snackbarState.message}
          </Alert>
        </Snackbar>
      </Portal>
    </div>
  );
};

export default React.memo(QuoteBuilderComponent);