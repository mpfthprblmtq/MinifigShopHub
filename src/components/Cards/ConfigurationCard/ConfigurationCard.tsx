import React, {FunctionComponent} from "react";
import {StyledCard} from "../Cards.styles";
import {SetNameStyledTypography} from "../../Main/MainComponent.styles";
import {Box, Button, FormControlLabel, Switch, Tooltip} from "@mui/material";
import {Print, Refresh} from "@mui/icons-material";

interface ConfigurationCardParams {
    storeMode: boolean;
    setStoreMode: (storeMode: boolean) => void;
    resetCalculations: () => void;
}

const ConfigurationCard: FunctionComponent<ConfigurationCardParams> = ({storeMode, setStoreMode, resetCalculations}) => {

    return (
       <StyledCard variant="outlined" sx={{minHeight: 100, marginLeft: "5px"}} className={"hide-in-print-preview"}>
           <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
               <Box sx={{ m: 1, position: 'relative' }}>
                   <SetNameStyledTypography>Options</SetNameStyledTypography>
                   <FormControlLabel control={
                       <Switch checked={storeMode} onChange={() => {setStoreMode(!storeMode)}} />
                   } label={"Store Mode"} style={{marginLeft: "10px"}}/>
               </Box>
               <Box sx={{ m: 1, float: 'right'}}>
                   <Tooltip title='Reset Calculations'>
                       <Button
                           variant="contained"
                           color="error"
                           onClick={resetCalculations}
                           style={{width: "50px", minWidth: "50px", maxWidth: "50px", height: "50px", margin: "5px"}}>
                           <Refresh />
                       </Button>
                   </Tooltip>
                   <Button
                       variant="contained"
                       color="success"
                       onClick={() => {
                           window.print();
                       }}
                       style={{width: "50px", minWidth: "50px", maxWidth: "50px", height: "50px", margin: "5px"}}>
                       <Print />
                   </Button>
               </Box>
           </Box>


       </StyledCard>
    );
};

export default ConfigurationCard;