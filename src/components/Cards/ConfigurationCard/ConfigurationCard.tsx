import React, {FunctionComponent} from "react";
import {StyledCard} from "../Cards.styles";
import {Box, Button, FormControlLabel, Switch} from "@mui/material";
import {Print, Settings} from "@mui/icons-material";

interface ConfigurationCardParams {
    storeMode: boolean;
    setStoreMode: (storeMode: boolean) => void;
    setSettingsDialogOpen: (open: boolean) => void;
    buttonsDisabled: boolean;
}

const ConfigurationCard: FunctionComponent<ConfigurationCardParams> =
    ({storeMode, setStoreMode, setSettingsDialogOpen, buttonsDisabled}) => {

    return (
       <StyledCard variant="outlined" sx={{minHeight: 80, marginLeft: "5px", width: 420}} className={"hide-in-print-preview"}>
           <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
               <Box sx={{ m: 1, position: 'relative' }}>
                   <FormControlLabel control={
                       <Switch checked={storeMode} onChange={() => {setStoreMode(!storeMode)}} />
                   } label={"Store Mode"} style={{marginLeft: "10px"}}/>
               </Box>
               <Box sx={{ m: 1, float: 'right'}}>
                   <Button
                       variant="contained"
                       color="success"
                       onClick={() => {
                           window.print();
                       }}
                       disabled={buttonsDisabled}
                       style={{width: "50px", minWidth: "50px", maxWidth: "50px", height: "50px", margin: "5px"}}>
                       <Print />
                   </Button>
                   <Button
                       variant="contained"
                       color="primary"
                       onClick={() => setSettingsDialogOpen(true)}
                       style={{width: "50px", minWidth: "50px", maxWidth: "50px", height: "50px", margin: "5px"}}>
                       <Settings />
                   </Button>
               </Box>
           </Box>
       </StyledCard>
    );
};

export default ConfigurationCard;