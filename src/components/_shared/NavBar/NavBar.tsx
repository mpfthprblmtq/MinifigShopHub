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
import PartCollectorActions from "./NavBarSections/PartCollectorActions";
import { CurrentView } from "../../PartCollector/CurrentView";

interface NavBarParams {
  activeTab: string;
  openSettings?: () => void;
  clearAll?: () => void;
  print?: () => void;
  saveQuote?: () => void;
  loadQuote?: () => void;
  storeMode?: boolean;
  setStoreMode?: () => void;
  compressedView?: boolean;
  setCompressedView?: () => void;
  currentView?: CurrentView;
  showAddParts?: () => void;
  showViewParts?: () => void;
}

const NavBar: FunctionComponent<NavBarParams> =
  ({
     activeTab,
     openSettings,
     clearAll,
     print,
     saveQuote,
     loadQuote,
     storeMode,
     setStoreMode,
     compressedView,
     setCompressedView,
     currentView,
     showAddParts,
     showViewParts}) => {

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
            compressedView={compressedView}
            setCompressedView={setCompressedView}
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
        {activeTab === Tabs.PART_COLLECTOR && (
          <PartCollectorActions
            navBarOpen={open}
            currentView={currentView}
            showAddParts={showAddParts}
            showViewParts={showViewParts} />
        )}
      </Drawer>
    </>
  )
};

export default React.memo(NavBar);