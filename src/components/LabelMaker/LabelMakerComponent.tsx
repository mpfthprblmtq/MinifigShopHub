import React, { FunctionComponent, useRef, useState } from "react";
import { Box } from "@mui/material";
import NavBar from "../_shared/NavBar/NavBar";
import Version from "../_shared/Version/Version";
import { Tabs } from "../_shared/NavBar/Tabs";
import LabelContent from "./LabelContent/LabelContent";
import { useReactToPrint } from "react-to-print";
import { Item } from "../../model/item/Item";
import { Label } from "../../model/labelMaker/Label";
import { formatCurrency, roundToNearestFive } from "../../utils/CurrencyUtils";
import ItemSearchBar from "../_shared/ItemSearchBar/ItemSearchBar";
import SettingsDialog from "./Dialog/SettingsDialog/SettingsDialog";
import { Configuration } from "../../model/dynamo/Configuration";
import { useDispatch, useSelector } from "react-redux";
import LabelForm from "./LabelForm/LabelForm";
import { Availability } from "../../model/retailStatus/Availability";
import { clearLabelState, LabelState, updateItemInStore, updateLabelInStore } from "../../redux/slices/labelSlice";

const LabelMakerComponent: FunctionComponent = () => {

  const [settingsDialogOpen, setSettingsDialogOpen] = useState<boolean>(false);

  const dispatch = useDispatch();
  const configuration: Configuration = useSelector((state: any) => state.configurationStore.configuration);
  const labelData: LabelState = useSelector((state: any) => state.labelStore);

  const componentRef = useRef(null);
  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
  }, []);
  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
  });

  const processItem = (item: Item) => {
    // retail sets are set at 80% of the MSRP, rounded to the nearest 5
    // retired sets won't have a value, since they will most often be overridden
    if (item.retailStatus?.retailPrice && item.retailStatus?.availability === Availability.RETAIL) {
      item.baseValue = item.retailStatus.retailPrice;
      item.valueAdjustment = configuration.autoAdjustmentPercentageCertifiedPreOwned;
      item.value = roundToNearestFive(item.retailStatus.retailPrice * (item.valueAdjustment / 100));
    } else {
      item.valueAdjustment = 0;
      item.value = 0.00;
    }
    dispatch(updateItemInStore(item));
  };

  const canPrint = (): boolean => {
    return !!labelData.item && !!labelData?.label?.validatedBy && !!labelData.label.title && formatCurrency(labelData.item.value) !== '$0.00';
  }

  return (
    <div className={"App label-maker-print-configuration"}>
      <NavBar
        activeTab={Tabs.LABEL_MAKER}
        print={canPrint() ? handlePrint : undefined}
        openSettings={() => setSettingsDialogOpen(true)}
        clearAll={!labelData.item ? undefined : () => {
          dispatch(clearLabelState());
        }}
      />
      <Version />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ m: 1, position: 'relative', width: '360px' }}>
          <ItemSearchBar processItem={processItem} />
          {labelData.item && (
            <LabelForm item={labelData.item} setItem={(item: Item) => dispatch(updateItemInStore(item))} label={labelData.label} setLabel={(label: Label) => dispatch(updateLabelInStore(label))} />
          )}
        </Box>
        <Box sx={{ m: 1, position: 'relative' }}>
          <LabelContent ref={componentRef} labelData={labelData.label}/>
        </Box>
      </Box>
      <SettingsDialog open={settingsDialogOpen} onClose={() => setSettingsDialogOpen(false)} />
    </div>
  );
};

export default LabelMakerComponent;