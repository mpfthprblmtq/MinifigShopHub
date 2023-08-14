import React, { forwardRef, ReactNode } from "react";
import { ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip } from "@mui/material";

interface MenuItemIconButtonParams {
  navBarOpen: boolean;
  action: (() => void) | undefined;
  icon: ReactNode;
  text: string;
}

const NavBarActionIconButton = forwardRef(({navBarOpen, action, icon, text}: MenuItemIconButtonParams, ref) => {
  return (
    <ListItem
      onClick={action}
      disabled={!action}
      disablePadding
      sx={{ display: 'block' }}>
      <Tooltip title={!navBarOpen && !!action ? text : ''} placement={'right'} ref={ref}>
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: navBarOpen ? 'initial' : 'center',
            px: 2.5,
            "&:hover": { backgroundColor: !action ? 'transparent' : 'rgba(240, 240, 240, 0.87)' },
            cursor: !!action ? 'pointer' : 'default !important'
          }}
          disableRipple={!action}
          disableTouchRipple={!action}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: navBarOpen ? 3 : 'auto',
              justifyContent: 'center',
            }}>
            {icon}
          </ListItemIcon>
          <ListItemText primary={text} sx={{ opacity: navBarOpen ? 1 : 0 }} />
        </ListItemButton>
      </Tooltip>
    </ListItem>
  );
});

export default NavBarActionIconButton;
