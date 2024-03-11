import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { Item } from "../../model/item/Item";
import { Alert, Box, Portal, Snackbar } from "@mui/material";
import TableComponent from "./Table/TableComponent/TableComponent";
import ItemSearchCard from "./Cards/ItemSearchCard/ItemSearchCard";
import CustomItemCard from "./Cards/CustomItemCard/CustomItemCard";
import Totals from "./Totals/Totals";
import BrickLinkSearchCard from "./Cards/BrickLinkSearchCard/BrickLinkSearchCard";
import Version from "../_shared/Version/Version";
import { Condition } from "../../model/_shared/Condition";
import SettingsDialog from "./Dialog/SettingsDialog/SettingsDialog";
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
import { SavedQuote } from "../../model/dynamo/SavedQuote";

const QuoteBuilderComponent: FunctionComponent = () => {

  const configuration: Configuration = useSelector((state: any) => state.configurationStore.configuration);
  const quote: Quote = useSelector((state: any) => state.quoteStore.quote);
  const items = quote.items as Item[];
  const dispatch = useDispatch();

  const [storeMode, setStoreMode] = useState<boolean>(true);
  const [compressedView, setCompressedView] = useState<boolean>(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState<boolean>(false);
  const [saveQuoteDialogOpen, setSaveQuoteDialogOpen] = useState<boolean>(false);
  const [loadQuoteDialogOpen, setLoadQuoteDialogOpen] = useState<boolean>(false);
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({open: false});
  const [savedQuote, setSavedQuote] = useState<SavedQuote>();

  const { initConfig } = useConfigurationService();

  // print stuff
  const componentRef = useRef(null);
  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
  }, []);
  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
  });

  // forwardRef for the Totals component, allows the updating of the items without state since that causes issues
  interface TotalsRefType {
    updateItems: (items: any[]) => void; // Adjust the type of 'items' as needed
  }
  const totalsRef = useRef<TotalsRefType | null>(null);
  const updateItems = (items: Item[]) => {
    if (totalsRef.current) {
      totalsRef.current.updateItems(items);
    }
  }

  const handleTotalAdjustmentChange = (adjustment: number) => {
    dispatch(updateItemsInStore(items.map(item => {
      return {...item, valueAdjustment: adjustment, value: (item.baseValue * (adjustment / 100))} as Item;
    })))
  }

  const resetCalculations = () => {
    const clonedItems: Item[] = _.cloneDeep(items);
    clonedItems.forEach(item => {
      item.valueAdjustment = item.condition === Condition.USED ?
        configuration.autoAdjustmentPercentageUsed : configuration.autoAdjustmentPercentageNew;
      item.value = Math.round(item.baseValue * (item.valueAdjustment / 100));
    });

    const calculatedValue: number = quote.total.baseValue * (configuration.autoAdjustmentPercentageUsed / 100);
    const total: Total = {
      ...quote.total,
      value: Math.floor(calculatedValue),
      valueAdjustment: configuration.autoAdjustmentPercentageUsed,
      storeCreditValue: (configuration.storeCreditValueAdjustment / 100) * calculatedValue
    };

    dispatch(updateQuoteInStore({ items: [...clonedItems], total: total } as Quote));
    setSnackbarState({open: true, severity: "success", message: 'Successfully reset calculations!'} as SnackbarState);
  };

  const setBulkCondition = (condition: Condition) => {
    const clonedItems: Item[] = _.cloneDeep(items);
    clonedItems.forEach(item => {
      item.condition = condition;
      item.valueAdjustment = condition === Condition.NEW ?
        configuration.autoAdjustmentPercentageNew : configuration.autoAdjustmentPercentageUsed;
      item.value = item.baseValue * (item.valueAdjustment / 100);
    });
    dispatch((updateItemsInStore([...clonedItems])));
    updateItems(clonedItems);
  };

  const addQuote = (savedQuote: SavedQuote) => {
    setSavedQuote(savedQuote);
  }

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
              <ItemSearchCard items={items} setItems={items => {
                dispatch(updateItemsInStore(items));
                updateItems(items);
              }} />
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
            updateItems={updateItems}
          />
        </Box>
        {items.length > 0 && (
            storeMode && (
              <ItemStatisticsCard items={items} />
            )
        )}
        <Totals
          ref={totalsRef}
          storeMode={storeMode}
          handleTotalAdjustmentChange={handleTotalAdjustmentChange}
        />
      </div>
      <SettingsDialog
        open={settingsDialogOpen}
        onClose={() => setSettingsDialogOpen(false)}
        resetCalculations={resetCalculations}
        setBulkCondition={(condition) => { setBulkCondition(condition) }}
        actionsDisabled={items.length === 0}
      />
      <SaveQuoteDialog open={saveQuoteDialogOpen} onClose={() => setSaveQuoteDialogOpen(false)} addQuote={addQuote} />
      <LoadQuoteDialog open={loadQuoteDialogOpen} onClose={() => setLoadQuoteDialogOpen(false)} quote={savedQuote}/>
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