import React, { forwardRef, ReactNode } from "react";
import { ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip } from "@mui/material";

interface MenuItemIconButtonParams {
  navBarOpen: boolean;
  action: (() => void) | undefined;
  icon: ReactNode;
  text: string;
  active?: boolean;
}

const NavBarActionIconButton = forwardRef(({navBarOpen, action, icon, text, active}: MenuItemIconButtonParams, ref) => {
  return (
    <ListItem
      onClick={action}
      disablePadding
      sx={{ display: 'block' }}>
      <Tooltip title={!navBarOpen && !!action ? text : ''} placement={'right'} ref={ref}>
        <ListItemButton
          disabled={!action}
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
            color={ active ? 'primary' : 'inherit' }
            sx={{
              minWidth: 0,
              mr: navBarOpen ? 3 : 'auto',
              justifyContent: 'center',
              color: active ? '#1976d2' : 'rgba(0, 0, 0, 0.54)'
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
