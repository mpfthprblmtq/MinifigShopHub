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
import ExpandIcon from "@mui/icons-material/Expand";
import CompressIcon from "@mui/icons-material/Compress";

interface QuoteBuilderActionsParams {
  navBarOpen: boolean;
  openSettings?: () => void;
  clearAll?: () => void;
  print?: () => void;
  saveQuote?: () => void;
  loadQuote?: () => void;
  storeMode?: boolean;
  setStoreMode?: () => void;
  compressedView?: boolean;
  setCompressedView?: () => void;
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
     setStoreMode,
     compressedView,
     setCompressedView
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
      <NavBarActionIconButton
        navBarOpen={navBarOpen}
        action={storeMode ? undefined : setCompressedView} // only want to be able to compress on customer view
        icon={compressedView ? <ExpandIcon sx={{color: '#1976d2'}} /> : <CompressIcon />}
        text={compressedView ? 'Expand View' : 'Compress View'} />
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