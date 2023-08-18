import React, { FunctionComponent, useRef, useState } from "react";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import NavBar from "../_shared/NavBar/NavBar";
import Version from "../_shared/Version/Version";
import { Tabs } from "../_shared/NavBar/Tabs";
import LabelContent from "./LabelContent/LabelContent";
import { useReactToPrint } from 'react-to-print';
import { green } from "@mui/material/colors";
import { Item } from "../../model/item/Item";
import { AxiosError } from "axios";
import { useItemLookupService } from "../../hooks/useItemLookupService";
import MultipleItemsFoundDialog from "../QuoteBuilder/Dialog/MultipleItemsFoundDialog/MultipleItemsFoundDialog";
import { SetNameStyledTypography } from "../QuoteBuilder/QuoteBuilderComponent.styles";
import { LabelData } from "../../model/labelMaker/LabelData";

const LabelMakerComponent: FunctionComponent = () => {

  const [setNumber, setSetNumber] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [multipleItemsDialogOpen, setMultipleItemsDialogOpen] = useState<boolean>(false);
  const [multipleItems, setMultipleItems] = useState<Item[]>([]);
  const [labelData, setLabelData] = useState<LabelData>();

  const { getHydratedItem, getItemMatches } = useItemLookupService();

  const componentRef = useRef(null);
  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
  }, []);
  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
  });

  const searchForSet = async () => {
    setLoading(true);
    setError('');

    await getItemMatches(setNumber).then(async (matches) => {
      // if there's only one match, get the hydration data and add it to the table
      if (matches.length === 1) {
        await getHydratedItem(matches[0])
          .then((item: Item) => {
            setLabelData({...labelData, item: {no: item.no, name: item.name, image_url: item.image_url}} as LabelData);
            // update graphics
            setLoading(false);
            setSetNumber('');
          })
      } else {
        setMultipleItems(matches);
        setMultipleItemsDialogOpen(true);
        setLoading(false);
      }
    }).catch((error: AxiosError) => {
      setLoading(false);
      if (error.response?.status === 404) {
        setError(`Item not found: ${setNumber}`);
      } else {
        setError("Issue with BrickLink service!");
      }
    });
  };

  const addItem = async (item: Item) => {
    const itemToAdd = {...item};
    await getHydratedItem(itemToAdd).then(hydratedItem => {
      setLabelData({...labelData, item: {no: hydratedItem.no, name: hydratedItem.name, image_url: hydratedItem.image_url}} as LabelData);
    });
  };

  return (
    <div className={"App label-maker-print-configuration"}>
      <NavBar activeTab={Tabs.LABEL_MAKER} print={handlePrint}/>
      <Version />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ m: 1, position: 'relative' }}>
          <form>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ m: 1, position: 'relative' }}>
                <TextField placeholder={'Set Number'} value={setNumber} onChange={(event) => setSetNumber(event.target.value)} />
              </Box>
              <Box sx={{ m: 1, position: 'relative' }}>
                <Button
                  variant="contained"
                  disabled={loading || !setNumber}
                  onClick={searchForSet}
                  sx={{minWidth: "100px", height: "50px"}}
                  type='submit'>
                  Search
                </Button>
                {loading && (
                  <CircularProgress
                    size={24}
                    sx={{
                      color: green[500],
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-12px',
                      marginLeft: '-12px',
                    }}
                  />
                )}
              </Box>
            </Box>
          </form>
          <Box>
            {error &&
              <SetNameStyledTypography sx={{ paddingTop: 0}} color={'error'}>{error}</SetNameStyledTypography>}
          </Box>
        </Box>
        <Box sx={{ m: 1, position: 'relative' }}>
          <LabelContent ref={componentRef} labelData={labelData}/>
        </Box>
      </Box>
      <MultipleItemsFoundDialog
        open={multipleItemsDialogOpen}
        onClose={() => setMultipleItemsDialogOpen(false)}
        items={multipleItems}
        addItem={addItem} />
    </div>
  );
};

export default LabelMakerComponent;