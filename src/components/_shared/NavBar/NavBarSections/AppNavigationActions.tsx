import React, { FunctionComponent } from "react";
import NavBarAppIconButton from "../NavBarButtons/NavBarAppIconButton";
import { Tabs } from "../Tabs";
import { RouterPaths } from "../../../../utils/RouterPaths";
import TableViewIcon from "@mui/icons-material/TableView";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import { List } from "@mui/material";

interface AppNavigationActionsParams {
  navBarOpen: boolean;
  activeTab: string;
}

const AppNavigationActions: FunctionComponent<AppNavigationActionsParams> = ({ navBarOpen, activeTab }) => {
  return (
    <List>
      <NavBarAppIconButton
        navBarOpen={navBarOpen}
        title={Tabs.QUOTE_BUILDER}
        route={RouterPaths.QuoteBuilder}
        icon={<TableViewIcon />}
        active={activeTab === Tabs.QUOTE_BUILDER} />
      <NavBarAppIconButton
        navBarOpen={navBarOpen}
        title={Tabs.LABEL_MAKER}
        route={RouterPaths.LabelMaker}
        icon={<BookmarksIcon />}
        active={activeTab === Tabs.LABEL_MAKER} />
      <NavBarAppIconButton
        navBarOpen={navBarOpen}
        title={Tabs.ROLODEX}
        route={RouterPaths.Rolodex}
        icon={<CollectionsBookmarkIcon />}
        active={activeTab === Tabs.ROLODEX} />
      <NavBarAppIconButton
        navBarOpen={navBarOpen}
        title={Tabs.PART_COLLECTOR}
        route={RouterPaths.PartCollector}
        icon={<FactCheckIcon />}
        active={activeTab === Tabs.PART_COLLECTOR} />
    </List>
  )
};

export default AppNavigationActions;