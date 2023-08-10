import React, { FunctionComponent, useState } from "react";
import {
  CSSObject,
  Divider,
  IconButton,
  List,
  ListItem, ListItemButton, ListItemIcon, ListItemText,
  styled,
  Theme,
  Toolbar, Tooltip,
  Typography
} from "@mui/material";
import { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar/AppBar";
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
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
import { useNavigate } from "react-router-dom";
import { Tabs } from "./Tabs";

interface NavBarParams {
  activeTab: string;
  openSettings?: () => void;
  clearAll?: () => void;
  printQuote?: () => void;
  storeMode?: boolean;
  setStoreMode?: (storeMode: boolean) => void;
}

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: '#1976d2 !important',
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const NavBar: FunctionComponent<NavBarParams> = ({activeTab, openSettings, clearAll, printQuote, storeMode, setStoreMode}) => {

  const [open, setOpen] = useState<boolean>(false);

  let navigate = useNavigate();
  const changeRoute = (route: string) =>{
    navigate('/' + route)
  }

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
            }}
          >
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
          <ListItem disablePadding sx={{ display: 'block'}} onClick={() => changeRoute('quote-builder')}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}>
                <Tooltip title={'Quote Builder'} placement={'right'}>
                  <TableViewIcon
                    sx={{color: activeTab === Tabs.QUOTE_BUILDER ? '#1976d2' : 'inherit'}} />
                </Tooltip>
              </ListItemIcon>
              <ListItemText
                primary={'Quote Builder'}
                sx={{ opacity: open ? 1 : 0, color: activeTab === Tabs.QUOTE_BUILDER ? '#1976d2' : 'inherit' }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => changeRoute('label-maker')}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}>
                <Tooltip title={'Label Maker'} placement={'right'}>
                  <BookmarksIcon
                    sx={{color: activeTab === Tabs.LABEL_MAKER ? '#1976d2' : 'inherit'}} />
                </Tooltip>
              </ListItemIcon>
              <ListItemText
                primary={'Label Maker'}
                sx={{ opacity: open ? 1 : 0, color: activeTab === Tabs.LABEL_MAKER ? '#1976d2' : 'inherit' }}  />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ display: 'block' }} onClick={() => changeRoute('rolodex')}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}>
                <Tooltip title={'Rolodex'} placement={'right'}>
                  <CollectionsBookmarkIcon
                    sx={{color: activeTab === Tabs.ROLODEX ? '#1976d2' : 'inherit'}} />
                </Tooltip>
              </ListItemIcon>
              <ListItemText
                primary={'Rolodex'}
                sx={{ opacity: open ? 1 : 0, color: activeTab === Tabs.ROLODEX ? '#1976d2' : 'inherit' }}  />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        {activeTab === Tabs.QUOTE_BUILDER && (
          <List>

            {/* OPTION 1 - Toggle Button */}
            {/*<ListItem disablePadding sx={{ display: 'block', marginLeft: '7px' }}>*/}
              {/*<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>*/}
              {/*  <Box sx={{ m: 1, position: 'relative' }}>*/}
              {/*    <Tooltip title={'Store Mode'} placement={'right'}>*/}
              {/*      <FormControlLabel control={*/}
              {/*        <Switch checked={storeMode} onChange={() => {*/}
              {/*          if (setStoreMode) {*/}
              {/*            setStoreMode(!storeMode);*/}
              {/*          }}} />*/}
              {/*      } label={''} sx={{marginRight: 0}}/>*/}
              {/*    </Tooltip>*/}
              {/*  </Box>*/}
              {/*  <ListItemText primary={'Store Mode'} sx={{ opacity: open ? 1 : 0 }} />*/}
              {/*</Box>*/}

            <ListItem disablePadding sx={{ display: 'block' }} onClick={() => {
              if (setStoreMode) {
                setStoreMode(!storeMode);
              }
            }} >

              {/* OPTION 2 - Store + Customer Icons */}
              {/*<ListItemButton*/}
              {/*  sx={{*/}
              {/*    minHeight: 48,*/}
              {/*    justifyContent: open ? 'initial' : 'center',*/}
              {/*    px: 2.5,*/}
              {/*  }}>*/}
              {/*  <ListItemIcon*/}
              {/*    sx={{*/}
              {/*      minWidth: 0,*/}
              {/*      mr: open ? 3 : 'auto',*/}
              {/*      justifyContent: 'center',*/}
              {/*    }}>*/}
              {/*    {storeMode ?*/}
              {/*      <StoreIcon sx={{color: '#1976d2'}} />*/}
              {/*      : <PersonIcon sx={{color: '#1976d2'}} />}*/}
              {/*  </ListItemIcon>*/}
              {/*  <ListItemText primary={'Print'} sx={{ opacity: open ? 1 : 0 }} />*/}
              {/*</ListItemButton>*/}

            {/* OPTION 3 - EYES */}
              <Tooltip title={!open ? 'Store Mode' : ''} placement={'right'}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}>
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}>
                    {storeMode ?
                      <VisibilityIcon sx={{color: '#1976d2'}} />
                      : <VisibilityOffIcon sx={{color: '#1976d2'}} />}
                  </ListItemIcon>
                  <ListItemText primary={'Store Mode Visibility'} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </Tooltip>
            </ListItem>
            <ListItem disablePadding sx={{ display: 'block' }} onClick={clearAll}>
              <Tooltip title={!open ? 'Clear All Items' : ''} placement={'right'}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}>
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}>
                    <ClearAllIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Clear All Items'} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </Tooltip>
            </ListItem>
            <ListItem disablePadding sx={{ display: 'block' }} onClick={printQuote}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}>
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}>
                  <PrintIcon />
                </ListItemIcon>
                <ListItemText primary={'Print'} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ display: 'block' }} onClick={() => alert("Save")}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}>
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}>
                  <SaveIcon />
                </ListItemIcon>
                <ListItemText primary={'Save Quote'} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ display: 'block' }} onClick={() => alert("Load")}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}>
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}>
                  <DriveFileMoveIcon />
                </ListItemIcon>
                <ListItemText primary={'Load Quote'} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ display: 'block' }} onClick={openSettings}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}>
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary={'Settings'} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          </List>
          )}
      </Drawer>
    </>
  )
};

export default React.memo(NavBar);