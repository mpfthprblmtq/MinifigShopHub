import React, { FC, ReactElement } from "react";
import NavBar from "../NavBar/NavBar";
import Version from "../Version/Version";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, Typography } from "@mui/material";
import { MailOutline, TableView } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { RouterPaths } from "../../../utils/RouterPaths";

interface AccessDeniedProps {
  activeTab: string;
}

const Transition = React.forwardRef(function Transition(props: {children: ReactElement}, ref) {
  return <Slide direction="up" ref={ref} {...props}>{props.children}</Slide>;
});

const AccessDenied: FC<AccessDeniedProps> = ({activeTab}) => {

  const navigate = useNavigate();

  return (
    <div>
      <NavBar activeTab={activeTab}/>
      <Version />
      <Dialog open={true} onClose={() => navigate(RouterPaths.QuoteBuilder)} TransitionComponent={Transition}>
        <DialogTitle variant='h3'>
          <Typography sx={{color: 'darkred', fontFamily: 'Didact Gothic', textAlign: 'center'}}>Access Denied</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant='h5' sx={{marginBottom: '20px', fontFamily: 'Didact Gothic', textAlign: 'center'}}>Access denied to the {activeTab} component.</Typography>
          <Typography variant='h5' sx={{marginBottom: '20px', fontFamily: 'Didact Gothic', textAlign: 'center'}}>Your plan currently does not have the {activeTab} component included in your subscription.  Please reach out to your system administrator for assistance.</Typography>
        </DialogContent>
        <DialogActions>
          <Box sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
            <Button sx={{position: 'relative', fontFamily: 'Didact Gothic'}} variant='contained' color='primary' startIcon={<TableView />} onClick={() => navigate(RouterPaths.QuoteBuilder)}>
              Go Back
            </Button>
            <Button sx={{fontFamily: 'Didact Gothic'}} variant='contained' color='primary' startIcon={<MailOutline />} onClick={() => window.location.href = 'mailto:pat@prblmtq.com'}>
              Email Support
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default React.memo(AccessDenied);