import React, { FunctionComponent, useRef, useState } from "react";
import {
  Divider,
  IconButton,
  List,
  Toolbar,
  Typography
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import TableViewIcon from "@mui/icons-material/TableView";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import SettingsIcon from "@mui/icons-material/Settings";
import PrintIcon from "@mui/icons-material/Print";
import SaveIcon from "@mui/icons-material/Save";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { Tabs } from "./Tabs";
import TooltipConfirmationModal from "../TooltipConfirmationModal/TooltipConfirmationModal";
import NavBarActionIconButton from "./NavBarActionIconButton";
import NavBarAppIconButton from "./NavBarAppIconButton";
import { RouterPaths } from "../../../utils/RouterPaths";
import { AppBar, DrawerHeader, Drawer } from "./NavBarUtils";

interface NavBarParams {
  activeTab: string;
  openSettings?: () => void;
  clearAll?: () => void;
  print?: () => void;
  saveQuote?: () => void;
  loadQuote?: () => void;
  storeMode?: boolean;
  setStoreMode?: () => void;
}

const NavBar: FunctionComponent<NavBarParams> = ({ activeTab, openSettings, clearAll, print, saveQuote, loadQuote, storeMode, setStoreMode}) => {

  const [open, setOpen] = useState<boolean>(false);
  const [clearConfirmationTooltipOpen, setClearConfirmationTooltipOpen] = useState<boolean>(false);
  const navRef = useRef();

  return (
    <>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpen(true)}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h4" noWrap component="div" sx={{fontFamily: 'Didact Gothic'}}>
            Minifig Shop Hub - {activeTab}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={() => setOpen(false)}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <NavBarAppIconButton navBarOpen={open} title={Tabs.QUOTE_BUILDER} route={RouterPaths.QuoteBuilder} icon={<TableViewIcon />} active={activeTab === Tabs.QUOTE_BUILDER} />
          <NavBarAppIconButton navBarOpen={open} title={Tabs.LABEL_MAKER} route={RouterPaths.LabelMaker} icon={<BookmarksIcon />} active={activeTab === Tabs.LABEL_MAKER} />
          <NavBarAppIconButton navBarOpen={open} title={Tabs.ROLODEX} route={RouterPaths.Rolodex} icon={<CollectionsBookmarkIcon />} active={activeTab === Tabs.ROLODEX} />
        </List>
        <Divider />
        {activeTab === Tabs.QUOTE_BUILDER && (
          <List>
            <NavBarActionIconButton
              navBarOpen={open}
              action={setStoreMode}
              icon={storeMode ? <VisibilityIcon sx={{color: '#1976d2'}} /> : <VisibilityOffIcon sx={{color: '#1976d2'}} />}
              text={'Store Mode'} />
            <TooltipConfirmationModal
              text={'Are you sure you want to clear all items?'}
              open={clearConfirmationTooltipOpen}
              onClose={() => setClearConfirmationTooltipOpen(false)}
              onConfirm={clearAll ? clearAll : () => {}}
              confirmButtonText={'Clear'}
              placement={'right'}>
              <NavBarActionIconButton
                navBarOpen={open}
                action={!!clearAll ? () => setClearConfirmationTooltipOpen(true) : undefined}
                icon={<ClearAllIcon />}
                text={'Clear All Items'}
                ref={navRef} />
            </TooltipConfirmationModal>
            <NavBarActionIconButton
              navBarOpen={open}
              action={print}
              icon={<PrintIcon />}
              text={'Print Quote'} />
            <NavBarActionIconButton
              navBarOpen={open}
              action={saveQuote}
              icon={<SaveIcon />}
              text={'Save Quote'} />
            <NavBarActionIconButton
              navBarOpen={open}
              action={loadQuote}
              icon={<DriveFileMoveIcon />}
              text={'Load Quote'} />
            <NavBarActionIconButton
              navBarOpen={open}
              action={openSettings}
              icon={<SettingsIcon />}
              text={'Settings'} />
          </List>
        )}
        {activeTab === Tabs.LABEL_MAKER && (
          <List>
            <NavBarActionIconButton
              navBarOpen={open}
              action={print}
              icon={<PrintIcon />}
              text={'Print Label'} />
          </List>
        )}
        {activeTab === Tabs.ROLODEX && (
          <></>
        )}
      </Drawer>
    </>
  )
};

export default React.memo(NavBar);