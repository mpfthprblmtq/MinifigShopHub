import React, { FunctionComponent } from "react";
import NavBarActionIconButton from "../NavBarButtons/NavBarActionIconButton";
import ClearIcon from "@mui/icons-material/Clear";
import { List } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import SettingsIcon from "@mui/icons-material/Settings";

interface LabelMakerActionsParams {
  navBarOpen: boolean;
  clearAll?: () => void;
  print?: () => void;
  openSettings?: () => void;
}

const LabelMakerActions: FunctionComponent<LabelMakerActionsParams> = ({navBarOpen, clearAll, print, openSettings}) => {

  return (
    <List>
      <NavBarActionIconButton
        navBarOpen={navBarOpen}
        action={clearAll}
        icon={<ClearIcon />}
        text={'Clear'} />
      <NavBarActionIconButton
        navBarOpen={navBarOpen}
        action={print}
        icon={<PrintIcon />}
        text={'Print Label'} />
      <NavBarActionIconButton
        navBarOpen={navBarOpen}
        action={openSettings}
        icon={<SettingsIcon />}
        text={'Settings'} />
    </List>
  )
};

export default LabelMakerActions;