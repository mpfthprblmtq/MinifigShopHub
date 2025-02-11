import React, { FunctionComponent, useState } from "react";
import {
  Divider,
  IconButton, ListItemIcon, ListItemText, Menu, MenuItem,
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
import { determineEnvironment } from "../../../utils/UrlUtils";
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import NavBarActionIconButton from "./NavBarButtons/NavBarActionIconButton";
import { useNavigate } from "react-router-dom";
import { DataObject, Logout, Person } from "@mui/icons-material";
import { useAuth0 } from "@auth0/auth0-react";
import { determineRedirectURI } from "../../../utils/AuthUtils";
import { usePermissions } from "../../../app/contexts/PermissionsProvider";
import { Permissions } from "../../../model/permissions/Permissions";

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

  const [userAnchorEl, setUserAnchorEl] = React.useState<null | HTMLElement>(null);
  const userOptionsOpen = Boolean(userAnchorEl);

  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const { logout, getAccessTokenSilently } = useAuth0();
  const { permissions } = usePermissions();

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
          <IconButton
            aria-controls={userOptionsOpen ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={userOptionsOpen ? 'true' : undefined}
            onClick={(event) => setUserAnchorEl(event.currentTarget)}
            sx={{ color: 'white', right: 10, position: 'absolute' }}
          >
            <Person fontSize='large' />
          </IconButton>
          <Menu
            anchorEl={userAnchorEl}
            open={userOptionsOpen}
            onClose={() => setUserAnchorEl(null)}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={() => {
              setUserAnchorEl(null);
              logout({ logoutParams: { returnTo: determineRedirectURI(window.location.href) } });
            }}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
            {permissions.includes(Permissions.ADMIN) && (
              <MenuItem onClick={async () => {
                setUserAnchorEl(null);
                const jwt = await getAccessTokenSilently();
                const input = prompt("Here is your JWT, press OK to copy to clipboard", jwt);
                if (input !== null) {
                  navigator.clipboard.writeText(jwt).then(() => {})
                }
              }}>
                <ListItemIcon>
                  <DataObject fontSize="small" />
                </ListItemIcon>
                <ListItemText>Show JWT</ListItemText>
              </MenuItem>
            )}
          </Menu>
          <Typography noWrap component="div" sx={{ fontFamily: 'Didact Gothic', right: 64, position: 'absolute' }}>
            {determineEnvironment()}
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
        {open && (
          <NavBarActionIconButton
            navBarOpen={open}
            action={() => navigate('/support')}
            icon={<SettingsSuggestIcon />}
            text={'Support'}
          />
        )}
      </Drawer>
    </>
  )
};

export default React.memo(NavBar);