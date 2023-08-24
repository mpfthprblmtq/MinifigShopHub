import React, { FunctionComponent, ReactNode } from "react";
import { Box, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface NavBarAppIconButtonParams {
  navBarOpen: boolean;
  title: string;
  route: string;
  icon: ReactNode;
  active: boolean;
}

const NavBarAppIconButton: FunctionComponent<NavBarAppIconButtonParams> = ({navBarOpen, title, route, icon, active}) => {

  let navigate = useNavigate();

  return (
    <ListItem disablePadding sx={{ display: 'block'}} onClick={() => navigate(route)}>
      <ListItemButton
        sx={{
          minHeight: 48,
          justifyContent: navBarOpen ? 'initial' : 'center',
          px: 2.5,
        }}>
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: navBarOpen ? 3 : 'auto',
            justifyContent: 'center',
          }}>
          <Tooltip title={title} placement={'right'}>
            <Box sx={{color: active ? '#1976d2' : 'inherit', padding: 0}}>
              {icon}
            </Box>
          </Tooltip>
        </ListItemIcon>
        <ListItemText
          primary={title}
          sx={{ opacity: navBarOpen ? 1 : 0, color: active ? '#1976d2' : 'inherit' }} />
      </ListItemButton>
    </ListItem>
  );
};

export default NavBarAppIconButton;