import React, { FunctionComponent, useRef, useState } from "react";
import { Box } from "@mui/material";
import NavBar from "../_shared/NavBar/NavBar";
import Version from "../_shared/Version/Version";
import { Tabs } from "../_shared/NavBar/Tabs";
import LabelContent from "./LabelContent/LabelContent";
import { useReactToPrint } from "react-to-print";
import { Item } from "../../model/item/Item";
import { LabelData } from "../../model/labelMaker/LabelData";
import { formatCurrency } from "../../utils/CurrencyUtils";
import { Status } from "../../model/labelMaker/Status";
import ItemSearchBar from "../_shared/ItemSearchBar/ItemSearchBar";
import SettingsDialog from "./Dialog/SettingsDialog/SettingsDialog";
import { Configuration } from "../../model/dynamo/Configuration";
import { useSelector } from "react-redux";
import LabelForm from "./LabelForm/LabelForm";

const LabelMakerComponent: FunctionComponent = () => {

  const [item, setItem] = useState<Item>();
  const [labelData, setLabelData] = useState<LabelData>({
    partsIndicator: true,
    manualIndicator: true,
    minifigsIndicator: true,
    status: Status.PRE_OWNED,
    validatedBy: ''
  });

  const [settingsDialogOpen, setSettingsDialogOpen] = useState<boolean>(false);

  const configuration: Configuration = useSelector((state: any) => state.configurationStore.configuration);

  const componentRef = useRef(null);
  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
  }, []);
  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
  });

  const processItem = (item: Item) => {
    item.valueAdjustment = configuration.autoAdjustmentPercentageCertifiedPreOwned;
    item.value = item.baseValue * (item.valueAdjustment / 100);
    item.valueDisplay = formatCurrency(item.value);
    setItem(item);
  };

  const validate = (): boolean => {
    return !!labelData.validatedBy || !!labelData.title || labelData.value !== 0;
  }

  return (
    <div className={"App label-maker-print-configuration"}>
      <NavBar
        activeTab={Tabs.LABEL_MAKER}
        print={validate() ? handlePrint : undefined}
        openSettings={() => setSettingsDialogOpen(true)}
        clearAll={!item ? undefined : () => {
          setItem(undefined);
          setLabelData({
            partsIndicator: true,
            manualIndicator: true,
            minifigsIndicator: true,
            status: Status.PRE_OWNED
          } as LabelData);
        }}
      />
      <Version />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ m: 1, position: 'relative', width: '360px' }}>
          <ItemSearchBar processItem={processItem} />
          {item && (
            <LabelForm item={item} setItem={setItem} labelData={labelData} setLabelData={setLabelData} />
          )}
        </Box>
        <Box sx={{ m: 1, position: 'relative' }}>
          <LabelContent ref={componentRef} labelData={labelData}/>
        </Box>
      </Box>
      <SettingsDialog open={settingsDialogOpen} onClose={() => setSettingsDialogOpen(false)} />
    </div>
  );
};

export default LabelMakerComponent;