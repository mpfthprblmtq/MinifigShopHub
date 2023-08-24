import React, { FunctionComponent, useEffect, useState } from "react";
import { Item } from "../../model/item/Item";
import {
  Alert,
  Box, Portal, Snackbar,
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

const QuoteBuilderComponent: FunctionComponent = () => {

  const configuration: Configuration = useSelector((state: any) => state.configurationStore.configuration);
  const quote: Quote = useSelector((state: any) => state.quoteStore.quote);
  const items = quote.items as Item[];
  const dispatch = useDispatch();

  const [storeMode, setStoreMode] = useState<boolean>(true);
  const [rowAdjustmentsDisabled, setRowAdjustmentsDisabled] = useState<boolean>(false);
  const [totalAdjustmentDisabled, setTotalAdjustmentDisabled] = useState<boolean>(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({open: false});

  const { calculatePrice } = usePriceCalculationEngine();
  const { initConfig } = useConfigurationService();

  const resetCalculations = () => {
    const clonedItems: Item[] = _.cloneDeep(items);
    clonedItems.forEach(item => {
      item.valueAdjustment = item.condition === Condition.USED ?
        configuration.autoAdjustmentPercentageUsed : configuration.autoAdjustmentPercentageNew;
      item.value = item.baseValue * (item.valueAdjustment / 100);
      item.valueDisplay = formatCurrency(item.value).toString().substring(1);
    });

    const calculatedValue: number = quote.total.baseValue * (configuration.autoAdjustmentPercentageUsed / 100);
    const total: Total = {
      ...quote.total,
      value: calculatedValue,
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

  /**
   * This useEffect is confusing.  Basically, we want to take into consideration that the total value adjustment might
   * not match the rows on load.
   * Before this, when you would refresh the page and have multiple rows with the same value adjustment, but a different
   * total value adjustment, the total value adjustment would be set to the adjustment that matches the rows.
   * This was bad, because I want to load the most accurate quote information possible.
   * This NEARLY works, but there has to be a better way.
   */
  useEffect(() => {
    const adjustmentSet = new Set(items.map(item => item.valueAdjustment));

    if (adjustmentSet.size === 1) {
      if (quote.total.valueAdjustment !== adjustmentSet.values().next().value) {
        if (mounted) {
          setRowAdjustmentsDisabled(false);
          setTotalAdjustmentDisabled(false);
          dispatch(updateTotalInStore({...quote.total, valueAdjustment: adjustmentSet.values().next().value} as Total));
        } else {
          setRowAdjustmentsDisabled(true);
          setTotalAdjustmentDisabled(false);
          setMounted(true);
        }
      } else {
        setRowAdjustmentsDisabled(false);
        setTotalAdjustmentDisabled(false);
      }
    } else {
      setTotalAdjustmentDisabled(true);
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
          } : undefined}
          print={items.length > 0 ? () => {
            if (items && items.length > 0) {
              window.print();
            }
          } : undefined}
          // TODO Save Quote & Load Quote
          storeMode={storeMode}
          setStoreMode={items.length > 0 ? () => setStoreMode(!storeMode) : undefined}
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
      <Box style={{ marginTop: 20 }}>
        <TableComponent
          storeMode={storeMode}
          rowAdjustmentsDisabled={rowAdjustmentsDisabled}
        />
      </Box>
      {items.length > 0 && (
        <Totals
          items={items}
          storeMode={storeMode}
          totalAdjustmentDisabled={totalAdjustmentDisabled}
          setRowAdjustmentsDisabled={setRowAdjustmentsDisabled}
        />
      )}
      <SettingsDialog
        open={settingsDialogOpen}
        onClose={() => setSettingsDialogOpen(false)}
        resetCalculations={resetCalculations}
        setBulkCondition={(condition) => { setBulkCondition(condition) }}
        actionsDisabled={items.length === 0}
      />
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