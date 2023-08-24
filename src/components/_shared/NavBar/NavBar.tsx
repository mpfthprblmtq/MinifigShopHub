import React, { FunctionComponent, useState } from "react";
import {
  Divider,
  IconButton,
  Toolbar,
  Typography
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Tabs } from "./Tabs";
import { AppBar, DrawerHeader, Drawer } from "./NavBarUtils";
import QuoteBuilderActions from "./NavBarSections/QuoteBuilderActions";
import LabelMakerActions from "./NavBarSections/LabelMakerActions";
import AppNavigationActions from "./NavBarSections/AppNavigationActions";

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
        <AppNavigationActions navBarOpen={open} activeTab={activeTab} />
        <Divider />
        {activeTab === Tabs.QUOTE_BUILDER && (
          <QuoteBuilderActions
            navBarOpen={open}
            saveQuote={saveQuote}
            loadQuote={loadQuote}
            openSettings={openSettings}
            print={print}
            storeMode={storeMode}
            setStoreMode={setStoreMode}
            clearAll={clearAll} />
        )}
        {activeTab === Tabs.LABEL_MAKER && (
          <LabelMakerActions
            navBarOpen={open}
            openSettings={openSettings}
            print={print}
            clearAll={clearAll} />
        )}
        {activeTab === Tabs.ROLODEX && (
          <></>
        )}
      </Drawer>
    </>
  )
};

export default React.memo(NavBar);