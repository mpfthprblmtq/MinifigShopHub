import React, { FunctionComponent } from "react";
import NavBarActionIconButton from "../NavBarButtons/NavBarActionIconButton";
import { List } from "@mui/material";
import { GridView, PlaylistAdd } from "@mui/icons-material";
import { CurrentView } from "../../../PartCollector/CurrentView";

interface PartCollectorActionsParams {
  navBarOpen: boolean;
  currentView?: CurrentView;
  showAddParts?: () => void;
  showViewParts?: () => void;
}

const PartCollectorActions: FunctionComponent<PartCollectorActionsParams> = ({navBarOpen, currentView, showAddParts, showViewParts}) => {

  return (
    <List>
      <NavBarActionIconButton
        navBarOpen={navBarOpen}
        action={showAddParts}
        icon={<PlaylistAdd />}
        text={'Add Parts'}
        active={currentView === CurrentView.ADD_PARTS} />
      <NavBarActionIconButton
        navBarOpen={navBarOpen}
        action={showViewParts}
        icon={<GridView />}
        text={'View Parts'}
        active={currentView === CurrentView.VIEW_PARTS} />
    </List>
  )
};

export default PartCollectorActions;