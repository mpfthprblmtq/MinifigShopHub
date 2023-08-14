import React, { FunctionComponent } from "react";
import { Typography } from "@mui/material";
import NavBar from "../_shared/NavBar/NavBar";
import Version from "../_shared/Version/Version";
import { Tabs } from "../_shared/NavBar/Tabs";

const RolodexComponent: FunctionComponent = () => {
  return (
    <div className={"App"}>
      <NavBar activeTab={Tabs.ROLODEX} />
      <Version />
      <Typography>Rolodex coming soon!</Typography>
    </div>
  );
};

export default React.memo(RolodexComponent);