import React, { FunctionComponent } from "react";
import { Typography } from "@mui/material";
import NavBar from "../_shared/NavBar/NavBar";
import Version from "../_shared/Version/Version";
import { Tabs } from "../_shared/NavBar/Tabs";
import { hasAccessToRolodex } from "../../utils/AuthUtils";
import { usePermissions } from "../../app/contexts/PermissionsProvider";
import AccessDenied from "../_shared/AccessDenied/AccessDenied";

const RolodexComponent: FunctionComponent = () => {

  return (
    <div className={"App"}>
      <NavBar activeTab={Tabs.ROLODEX} />
      <Version />
      {!hasAccessToRolodex(usePermissions().permissions) ? <AccessDenied activeTab={Tabs.ROLODEX} /> :
        <Typography>Rolodex coming soon!</Typography>}
    </div>
  );
};

export default React.memo(RolodexComponent);