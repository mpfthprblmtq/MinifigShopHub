import React, { FunctionComponent, useState } from "react";
import NavBarActionIconButton from "../NavBarButtons/NavBarActionIconButton";
import ClearIcon from "@mui/icons-material/Clear";
import TooltipConfirmationModal from "../../TooltipConfirmationModal/TooltipConfirmationModal";
import { Box, List, Typography } from "@mui/material";
import { ArrowDownward, Rectangle, RectangleOutlined } from "@mui/icons-material";
import PrintIcon from "@mui/icons-material/Print";
import SettingsIcon from "@mui/icons-material/Settings";

interface LabelMakerActionsParams {
  navBarOpen: boolean;
  clearAll?: () => void;
  print?: () => void;
  openSettings?: () => void;
}

const LabelMakerActions: FunctionComponent<LabelMakerActionsParams> = ({navBarOpen, clearAll, print, openSettings}) => {

  const [printVerificationTooltipOpen, setPrintVerificationTooltipOpen] = useState<boolean>(false);

  return (
    <List>
      <NavBarActionIconButton
        navBarOpen={navBarOpen}
        action={clearAll}
        icon={<ClearIcon />}
        text={'Clear'} />
      <TooltipConfirmationModal
        content={
          <Box sx={{ display: 'flex', position: 'relative' }}>
            <Box sx={{ m: 1, position: 'relative' }}>
              <Rectangle sx={{ fontSize: 40, marginBottom: '-10px' }} />
              <br />
              <RectangleOutlined sx={{ fontSize: 40, marginTop: '-11px' }} />
              <br />
              <ArrowDownward sx={{ fontSize: 40, marginTop: '-10px' }} />
            </Box>
            <Box sx={{ m: 1, position: 'relative' }}>
              <Typography sx={{ fontFamily: 'Didact Gothic', width: '150px' }}>
                Ensure you're placing the label paper with the label to print on on the bottom!
              </Typography>
            </Box>
          </Box>
        }
        open={printVerificationTooltipOpen}
        onClose={() => setPrintVerificationTooltipOpen(false)}
        onConfirm={print ? print : () => {}}
        confirmButtonText={'Done'}
        confirmButtonColor={'success'}
        placement={'right'}>
        <NavBarActionIconButton
          navBarOpen={navBarOpen}
          action={!!print ? () => setPrintVerificationTooltipOpen(true) : undefined}
          icon={<PrintIcon />}
          text={'Print Label'} />
      </TooltipConfirmationModal>
      <NavBarActionIconButton
        navBarOpen={navBarOpen}
        action={openSettings}
        icon={<SettingsIcon />}
        text={'Settings'} />
    </List>
  )
};

export default LabelMakerActions;