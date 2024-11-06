import React, { FunctionComponent } from "react";
import NavBarAppIconButton from "../NavBarButtons/NavBarAppIconButton";
import { Tabs } from "../Tabs";
import { RouterPaths } from "../../../../utils/RouterPaths";
import TableViewIcon from "@mui/icons-material/TableView";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import { List } from "@mui/material";
import { usePermissions } from "../../../../app/contexts/PermissionsProvider";
import {
  hasAccessToLabelMaker,
  hasAccessToPartCollector,
  hasAccessToRolodex
} from "../../../../utils/AuthUtils";

interface AppNavigationActionsParams {
  navBarOpen: boolean;
  activeTab: string;
}

const AppNavigationActions: FunctionComponent<AppNavigationActionsParams> = ({ navBarOpen, activeTab }) => {

  const { permissions } = usePermissions();

  return (
    <List>
      <NavBarAppIconButton
        navBarOpen={navBarOpen}
        title={Tabs.QUOTE_BUILDER}
        route={RouterPaths.QuoteBuilder}
        icon={<TableViewIcon />}
        active={activeTab === Tabs.QUOTE_BUILDER}
        disabled={false} // always enabled since that's the base app
      />
      <NavBarAppIconButton
        navBarOpen={navBarOpen}
        title={Tabs.LABEL_MAKER}
        route={RouterPaths.LabelMaker}
        icon={<BookmarksIcon />}
        active={activeTab === Tabs.LABEL_MAKER}
        disabled={!hasAccessToLabelMaker(permissions)} />
      <NavBarAppIconButton
        navBarOpen={navBarOpen}
        title={Tabs.ROLODEX}
        route={RouterPaths.Rolodex}
        icon={<CollectionsBookmarkIcon />}
        active={activeTab === Tabs.ROLODEX}
        disabled={!hasAccessToRolodex(permissions)} />
      <NavBarAppIconButton
        navBarOpen={navBarOpen}
        title={Tabs.PART_COLLECTOR}
        route={RouterPaths.PartCollector}
        icon={<FactCheckIcon />}
        active={activeTab === Tabs.PART_COLLECTOR}
        disabled={!hasAccessToPartCollector(permissions)} />
    </List>
  )
};

export default AppNavigationActions;