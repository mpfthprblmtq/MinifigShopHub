import React, { FunctionComponent, useRef, useState } from "react";
import NavBarActionIconButton from "../NavBarButtons/NavBarActionIconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import TooltipConfirmationModal from "../../TooltipConfirmationModal/TooltipConfirmationModal";
import { List, Typography } from "@mui/material";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import PrintIcon from "@mui/icons-material/Print";
import SaveIcon from "@mui/icons-material/Save";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import SettingsIcon from "@mui/icons-material/Settings";

interface QuoteBuilderActionsParams {
  navBarOpen: boolean;
  openSettings?: () => void;
  clearAll?: () => void;
  print?: () => void;
  saveQuote?: () => void;
  loadQuote?: () => void;
  storeMode?: boolean;
  setStoreMode?: () => void;
}

const QuoteBuilderActions: FunctionComponent<QuoteBuilderActionsParams> =
  ({
     navBarOpen,
     openSettings,
     clearAll,
     print,
     saveQuote,
     loadQuote,
     storeMode,
     setStoreMode
  }) => {

  const [clearConfirmationTooltipOpen, setClearConfirmationTooltipOpen] = useState<boolean>(false);
  const navRef = useRef();

  return (
    <List>
      <NavBarActionIconButton
        navBarOpen={navBarOpen}
        action={setStoreMode}
        icon={storeMode ? <VisibilityIcon sx={{color: '#1976d2'}} /> : <VisibilityOffIcon sx={{color: '#1976d2'}} />}
        text={'Store Mode'} />
      <TooltipConfirmationModal
        content={
          <Typography sx={{fontSize: '14px'}}>
            Are you sure you want to clear all items?
          </Typography>}
        open={clearConfirmationTooltipOpen}
        onClose={() => setClearConfirmationTooltipOpen(false)}
        onConfirm={clearAll ? clearAll : () => {}}
        confirmButtonText={'Clear'}
        placement={'right'}>
        <NavBarActionIconButton
          navBarOpen={navBarOpen}
          action={!!clearAll ? () => setClearConfirmationTooltipOpen(true) : undefined}
          icon={<ClearAllIcon />}
          text={'Clear All Items'}
          ref={navRef} />
      </TooltipConfirmationModal>
      <NavBarActionIconButton
        navBarOpen={navBarOpen}
        action={print}
        icon={<PrintIcon />}
        text={'Print Quote'} />
      <NavBarActionIconButton
        navBarOpen={navBarOpen}
        action={saveQuote}
        icon={<SaveIcon />}
        text={'Save Quote'} />
      <NavBarActionIconButton
        navBarOpen={navBarOpen}
        action={loadQuote}
        icon={<DriveFileMoveIcon />}
        text={'Load Quote'} />
      <NavBarActionIconButton
        navBarOpen={navBarOpen}
        action={openSettings}
        icon={<SettingsIcon />}
        text={'Settings'} />
    </List>
  )
};

export default QuoteBuilderActions;